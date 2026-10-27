"""Generate Indonesian synthetic dialogue with Edge TTS; preserve TLS verification.
Install edge-tts==7.3.1, then run python scripts/voiceover.py.
The system CA bundle includes the execution environment's trusted proxy CA.
"""
import asyncio, json, os, ssl, subprocess
from pathlib import Path
import edge_tts
import edge_tts.communicate as communicate

ROOT=Path(__file__).resolve().parents[1]
communicate._SSL_CTX=ssl.create_default_context(cafile='/etc/ssl/certs/ca-certificates.crt')
dialogue=json.loads((ROOT/'src/dialogue.json').read_text())
async def main():
 for i,line in enumerate(dialogue):
  target=ROOT/f'public/audio/line-{i:02}.mp3'
  if not target.exists():
   voice='id-ID-ArdiNeural' if line['who']=='raka' else 'id-ID-GadisNeural'
   await edge_tts.Communicate(line['text'],voice,rate='+8%',proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')).save(str(target))
  duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)]))
  available=line['end']-line['start']-.35
  if duration>available:
   temp=target.with_suffix('.fit.mp3')
   subprocess.run(['ffmpeg','-y','-v','error','-i',str(target),'-af',f'atempo={duration/available:.5f}','-codec:a','libmp3lame','-q:a','2',str(temp)],check=True)
   temp.replace(target)
   duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)]))
  line['audioDuration']=duration
  print(i,line['who'],round(duration,2),line['text'],flush=True)
 (ROOT/'src/timing.json').write_text(json.dumps(dialogue,ensure_ascii=False,indent=2)+'\n')
asyncio.run(main())
