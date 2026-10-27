"""Generate a paced conversation with word boundaries and audio-driven mouth motion.
Requires edge-tts==7.3.1 and ffmpeg/ffprobe. Cached raw clips use text/voice hashes.
"""
import asyncio, hashlib, json, math, os, ssl, struct, subprocess
from pathlib import Path
import edge_tts
import edge_tts.communicate as communicate
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/audio/natural'
OUT.mkdir(parents=True,exist_ok=True)
CACHE=ROOT/'.cache/natural-voice'
CACHE.mkdir(parents=True,exist_ok=True)
communicate._SSL_CTX=ssl.create_default_context(cafile='/etc/ssl/certs/ca-certificates.crt')
def duration(p):
 return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
async def main():
 rows=json.loads((ROOT/'src/natural-dialogue.json').read_text())
 for i,row in enumerate(rows):
  voice='id-ID-ArdiNeural' if row['who']=='raka' else 'id-ID-GadisNeural'
  key=hashlib.sha256((row['text']+voice+'+3%').encode()).hexdigest()[:16]
  raw=CACHE/f'{key}.mp3'; meta=CACHE/f'{key}.json'
  if not(raw.exists() and meta.exists()):
   words=[]
   with raw.open('wb') as audio:
    async for chunk in edge_tts.Communicate(row['text'],voice,rate='+3%',boundary='WordBoundary',proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')).stream():
     if chunk['type']=='audio':audio.write(chunk['data'])
     elif chunk['type']=='WordBoundary':words.append({'text':chunk['text'],'start':chunk['offset']/1e7,'duration':chunk['duration']/1e7})
   meta.write_text(json.dumps(words,ensure_ascii=False))
  row['_raw']=str(raw);row['_words']=json.loads(meta.read_text());row['_duration']=duration(raw)
 total=sum(r['_duration'] for r in rows)
 gap=.20
 # Reserve a clean 2.5 second end card, keeping conversation pace consistent.
 speed=max(1,total/(57.5-len(rows)*gap))
 if speed>1.20:raise RuntimeError(f'Dialogue too long for natural delivery: {total:.2f}s; shorten the script.')
 print(f'Raw speech {total:.2f}s; uniform tempo {speed:.3f}',flush=True)
 remaining=57.5-total/speed-len(rows)*gap
 start=0.0
 for i,row in enumerate(rows):
  target=OUT/f'line-{i:02}.mp3'
  subprocess.run(['ffmpeg','-y','-v','error','-i',row['_raw'],'-af',f'atempo={speed:.6f},loudnorm=I=-18:TP=-2:LRA=9','-c:a','libmp3lame','-q:a','2',str(target)],check=True)
  row['audioDuration']=duration(target)
  row['start']=round(start,5)
  row['words']=[{**w,'start':w['start']/speed,'duration':w['duration']/speed} for w in row.pop('_words')]
  tokens=row['text'].split()
  if len(tokens)==len(row['words']):
   for word,token in zip(row['words'],tokens):word['text']=token
  pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(target),'-f','s16le','-ac','1','-ar','12000','-'])
  samples=struct.unpack('<'+'h'*(len(pcm)//2),pcm)
  rms=[math.sqrt(sum(v*v for v in samples[k:k+400])/max(1,len(samples[k:k+400]))) for k in range(0,len(samples),400)]
  peak=max(rms) or 1;row['mouth']=[round(min(1,v/peak*1.5),3) for v in rms]
  start+=row['_duration']/speed+gap+remaining/len(rows)
  row['end']=round(start,5)
  row.pop('_duration');row.pop('_raw')
  print(i,round(row['start'],2),round(row['end'],2),row['text'],flush=True)
 (ROOT/'src/natural-timing.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'reels/jokoding-natural-60s.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(r['start'])} --> {stamp(r['end'])}\n{r['text']}" for i,r in enumerate(rows))+'\n')
asyncio.run(main())
