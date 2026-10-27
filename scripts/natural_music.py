"""Generate a quiet original electric-piano bed; requires numpy and FFmpeg."""
from pathlib import Path
import subprocess,wave
import numpy as np
root=Path(__file__).resolve().parents[1]
sr=44100
audio=np.zeros(sr*60,dtype=np.float32)
chords=[[130.81,164.81,196,246.94],[110,130.81,164.81,196],[87.31,110,130.81,164.81],[98,123.47,146.83,196]]
for beat in range(75):
 start=beat*.8
 chord=chords[(beat//8)%4]
 for k,freq in enumerate(chord):
  offset=start+k*.035
  n=min(int(sr*2.2),len(audio)-int(offset*sr))
  if n<=0:continue
  t=np.arange(n)/sr
  signal=(np.sin(2*np.pi*freq*t)+.14*np.sin(2*np.pi*freq*2*t))*np.exp(-t*2.6)*np.minimum(t*35,1)*.06
  pos=int(offset*sr);audio[pos:pos+n]+=signal
audio[:sr]*=np.linspace(0,1,sr);audio[-sr*2:]*=np.linspace(1,0,sr*2)
temp=root/'.cache/natural-bed.wav';temp.parent.mkdir(exist_ok=True)
with wave.open(str(temp),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((audio*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-y','-v','error','-i',str(temp),'-c:a','libmp3lame','-b:a','128k',str(root/'public/audio/natural/bed.mp3')],check=True)
