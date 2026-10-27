import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import lines from './timing.json';

const C={paper:'#f8f5e9',ink:'#292c29',green:'#49a900',lime:'#def3b7',red:'#e36057',muted:'#8d9582'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=(v:number,a:number,b:number)=>interpolate(v,[a,b],[0,1],clamp);

type PersonProps={x:number;y:number;name:'raka'|'naya';talk:boolean;time:number;beat:string;local:number};
const Person:React.FC<PersonProps>=({x,y,name,talk,time,beat,local})=>{
 const n=name==='naya';
 const worried=['panic','bugs','cry','deadline'].includes(beat)&&!n;
 const happy=['success','rest','cta'].includes(beat);
 const run=beat==='deadline'&&!n;
 const bounce=run?Math.abs(Math.sin(time*15))*16:Math.sin(time*3+(n?1:0))*3;
 const gesture=talk?Math.sin(time*6)*12:Math.sin(time*2)*3;
 const point=(n&&['run','offer','chat','learn','cta'].includes(beat))||(!n&&['send','ask','success'].includes(beat));
 const leftHand=point&&n?[-148,90+gesture]:worried?[ -87,-27]:run?[-120,160+Math.sin(time*15)*70]:[-100,238+gesture];
 const rightHand=point&&!n?[148,90+gesture]:worried?[82,-25]:[105,236-gesture];
 const mouth=talk?8+Math.abs(Math.sin(time*19))*15:happy?10:2;
 const leg=run?Math.sin(time*15)*65:0;
 return <g transform={`translate(${x},${y-bounce}) rotate(${beat==='rest'&&!n?-13:worried?-3:0})`} stroke={C.ink} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
  <ellipse cx="0" cy="432" rx="112" ry="17" fill="#dddccb" stroke="none"/>
  {n&&<path d="M44 -56 Q119 -78 110 14 Q87 -12 60 -3" fill={C.ink}/>}
  <path d="M0 76 Q-8 167 0 270 M0 270 L-53 350 L-68 416 M0 270 L57 347 L75 416" transform={`skewX(${leg/6})`} fill="none"/>
  <path d={`M-3 112 Q-75 128 ${leftHand.join(' ')} M3 112 Q82 135 ${rightHand.join(' ')}`} fill="none"/>
  <circle cx={leftHand[0]} cy={leftHand[1]} r="9" fill={C.paper}/><circle cx={rightHand[0]} cy={rightHand[1]} r="9" fill={C.paper}/>
  <path d="M-25 83 L25 83 L33 160 L-33 160 Z" fill={n?C.lime:C.green} strokeWidth="5"/>
  <circle r="72" fill={C.paper}/>
  {!n&&<><path d="M-65 -33 L-49 -73 L-21 -60 L-9 -85 L15 -64 L43 -75 L64 -38" fill={C.ink}/><g strokeWidth="5" fill="none"><rect x="-57" y="-14" width="49" height="37" rx="13"/><rect x="8" y="-14" width="49" height="37" rx="13"/><path d="M-8 -1 H8"/></g></>}
  {n&&<><path d="M-70 -11 Q-65 -75 5 -72 Q54 -70 71 -10 Q31 -23 10 -47 Q-20 -19 -70 -11" fill={C.ink}/><path d="M-47 -54 Q0 -82 45 -54" stroke={C.green} strokeWidth="12"/></>}
  <path d={worried?'M-42 -25 L-20 -36 M19 -36 L42 -24':'M-42 -26 Q-28 -33 -18 -27 M18 -27 Q33 -33 44 -26'} fill="none" strokeWidth="5"/>
  {happy&&!talk?<path d="M-38 4 Q-28 -7 -18 4 M18 4 Q28 -7 38 4" fill="none" strokeWidth="5"/>:<><circle cx={n?-27:-26} cy="4" r="5" fill={C.ink}/><circle cx="27" cy="4" r="5" fill={C.ink}/></>}
  {talk?<ellipse cx="0" cy="38" rx={worried?15:19} ry={mouth} fill={C.ink} strokeWidth="3"/>:<path d={worried?'M-17 45 Q0 28 17 45':'M-18 33 Q0 53 18 33'} fill="none" strokeWidth="5"/>}
  {beat==='cry'&&!n&&[0,1].map(k=><path key={k} d={`M${k?48:-48} ${18+(time*90)%80} q-13 21 0 24 q13 -3 0 -24`} fill="#82c8e8" stroke="none"/>)}
  {worried&&<path d="M85 -60 Q108 -27 91 -22 Q70 -26 85 -60" fill="#82c8e8" stroke="none"/>}
  {talk&&<g stroke={C.green} strokeWidth="6"><path d="M94 -52 l19 -9 M100 -27 h25 M94 -4 l19 8"/></g>}
  <g stroke="none"><rect x="-71" y="460" width="142" height="42" rx="21" fill={n?C.ink:C.green}/><text y="489" textAnchor="middle" fill="white" fontSize="24" fontWeight="800">{n?'NAYA':'RAKA'}</text></g>
 </g>;
};

const Bug:React.FC<{x:number;y:number;scale?:number;rotation?:number}>=({x,y,scale=1,rotation=0})=><g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`} stroke={C.ink} strokeWidth="5" strokeLinecap="round"><path d="M-28 -12 l-24 -19 M-31 5 h-25 M-28 24 l-24 18 M28 -12 l24 -19 M31 5 h25 M28 24 l24 18"/><ellipse rx="32" ry="39" fill={C.green}/><path d="M0 -29 V32"/><circle cx="-12" cy="-14" r="4" fill="white"/><circle cx="12" cy="-14" r="4" fill="white"/></g>;

const Reel:React.FC=()=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig(); const t=f/fps;
 const idx=Math.max(0,lines.findIndex(l=>t>=l.start&&t<l.end)); const line=lines[idx];
 const local=t-line.start; const beat=line.beat;
 const talking=local>.15&&local<line.audioDuration+.15;
 const pop=spring({frame:f-line.start*fps,fps,config:{damping:17,stiffness:170}});
 const phone=['offer','ask','chat','send'].includes(beat);
 const success=['success','rest','cta'].includes(beat);
 const split=line.text.split(' '); const active=Math.min(split.length-1,Math.floor(Math.max(0,local-.15)/line.audioDuration*split.length));
 const nayaX=780+(1-ease(t,2.6,4))*390;
 const focus=1+(['panic','bugs','deadline'].includes(beat)?.045:0)*pop;
 return <AbsoluteFill style={{background:C.paper,fontFamily:'DejaVu Sans, sans-serif',color:C.ink}}>
  <AbsoluteFill style={{backgroundImage:'linear-gradient(#8ba77415 1px,transparent 1px),linear-gradient(90deg,#8ba77415 1px,transparent 1px)',backgroundSize:'64px 64px'}}/>
  <div style={{position:'absolute',width:800,height:800,left:500,top:400,background:'radial-gradient(circle,#d8efaf99,transparent 65%)'}}/>
  <div style={{position:'absolute',left:80,top:94,fontSize:52,fontWeight:900,letterSpacing:-3}}>joko<span style={{color:C.green}}>ding</span></div>
  <div style={{position:'absolute',right:80,top:111,fontSize:20,fontWeight:700,letterSpacing:3}}>KISAH ANAK INFORMATIKA</div>
  <div style={{position:'absolute',left:80,top:200,fontSize:20,letterSpacing:4,color:C.muted,fontWeight:800}}>SKETSA {String(idx+1).padStart(2,'0')} / 15</div>
  <div style={{position:'absolute',left:76,right:76,top:250,fontSize:70,lineHeight:1.08,fontWeight:900,letterSpacing:-3,transform:`translateY(${(1-pop)*22}px)`,opacity:pop}}>{line.title}</div>
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
   <defs><linearGradient id="screen" x2="1" y2="1"><stop stopColor="#303b31"/><stop offset="1" stopColor="#1c251d"/></linearGradient></defs>
   <g opacity=".5" stroke="#adb4a2" strokeWidth="3" fill="none"><path d="M70 1210 H1010 M74 1225 H1005"/><path d="M90 510 v-90 h190 v90 z M185 420 v90 M90 466 h190"/><path d="M130 438 q25 5 18 28 q27 -12 10 -35"/></g>
   <g transform={`translate(885 470) rotate(${beat==='deadline'?Math.sin(t*12)*10:0})`} stroke={C.ink} strokeWidth="5"><circle r="61" fill={C.paper}/><path d={`M0 -40 V0 L${beat==='deadline'?Math.sin(t*8)*36:30} ${beat==='deadline'?Math.cos(t*8)*36:15}`} fill="none"/><text y="98" stroke="none" fontSize="23" textAnchor="middle" fill={C.red} fontWeight="800">23:59</text></g>
   <g transform={`translate(${540-540*focus} ${950-950*focus}) scale(${focus})`}>
    <Person x={275} y={705} name="raka" talk={talking&&line.who==='raka'} time={t} beat={beat} local={local}/>
    <Person x={nayaX} y={705} name="naya" talk={talking&&line.who==='naya'} time={t} beat={beat} local={local}/>
    {!phone&&<g transform={`translate(384 ${965+(beat==='panic'?Math.sin(t*32)*4:0)})`} stroke={C.ink} strokeWidth="7" strokeLinejoin="round">
     <path d="M-68 148 H358 M-34 148 V245 M327 148 V245" fill="none"/>
     <rect x="0" y="-60" width="307" height="197" rx="15" fill="url(#screen)"/>
     <path d="M-20 137 H326 L344 151 H-39 Z" fill="#aeb7a5"/>
     <g stroke="none" fontFamily="monospace" fontWeight="700"><text x="22" y="-20" fill="#e7f0df" fontSize="18">$ npm run dev</text><text x="22" y="28" fill={success?'#95e45f':'#ff877b'} fontSize="22">{success?'✓ localhost ready':t<6?'× 5 errors':'× 12 errors'}</text><text x="22" y="65" fill="#bac7af" fontSize="15">{success?'compiled successfully':'Cannot read undefined'}</text><text x="22" y="101" fill={C.green} fontSize="20">{Math.floor(t*3)%2?'▌':''}</text></g>
    </g>}
    {phone&&<g transform={`translate(${540+(beat==='offer'?(1-ease(local,0,1))*125:0)} ${985+(1-pop)*120}) rotate(${beat==='offer'?-8*(1-ease(local,0,1)):0})`}>
     <rect x="-137" y="-240" width="274" height="440" rx="33" fill={C.ink}/><rect x="-124" y="-223" width="248" height="403" rx="23" fill="#fffdf5"/><rect x="-42" y="-222" width="84" height="15" rx="7" fill={C.ink}/>
     <text textAnchor="middle" y="-165" fill={C.green} fontSize="31" fontWeight="900">jokoding</text><path d="M-105 -144 H105" stroke="#dce5d4" strokeWidth="2"/>
     {['Brief tugas','Screenshot error','Deadline'].map((v,i)=><g key={v} opacity={['chat','send'].includes(beat)?ease(local,.3+i*.5,.7+i*.5):.3}><rect x="-103" y={-121+i*70} width="206" height="51" rx="13" fill={C.lime}/><text x="-89" y={-89+i*70} fontSize="20" fill={C.ink}>{v} ✓</text></g>)}
     <rect x="-103" y="104" width="206" height="50" rx="25" fill={C.green}/><text textAnchor="middle" y="137" fill="white" fontSize="24" fontWeight="800">{beat==='send'&&local>1?'Terkirim ✓':'Diskusi dulu'}</text>
    </g>}
   </g>
   {['bugs','panic'].includes(beat)&&Array.from({length:beat==='bugs'?7:3},(_,i)=><Bug key={i} x={400+Math.sin(t*2+i*2)*280} y={610+i*58+Math.cos(t*3+i)*22} scale={.6} rotation={Math.sin(t*3+i)*22}/>)}
   {beat==='deadline'&&<g transform={`translate(${110+(local*230)%1000},530)`}><rect width="230" height="64" rx="12" fill={C.red}/><text x="115" y="41" textAnchor="middle" fill="white" fontSize="27" fontWeight="900">DEADLINE</text><path d={`M65 65 l${Math.sin(t*18)*30} 35 M160 65 l${-Math.sin(t*18)*30} 35 M-15 14 H-70 M-15 36 H-50`} stroke={C.red} strokeWidth="8" fill="none"/></g>}
   {beat==='send'&&<text x="520" y="600" fontSize="100" fill={C.ink} transform={`rotate(${Math.sin(t*4)*15} 520 600)`}>;</text>}
   {beat==='learn'&&<g transform={`translate(540 570) scale(${pop})`} stroke={C.green} strokeWidth="5" fill={C.lime}><path d="M-78 -35 Q-32 -55 0 -20 Q32 -55 78 -35 V45 Q32 25 0 55 Q-32 25 -78 45 Z"/><path d="M0 -20 V55"/><path d="M-40 -75 l-10 -25 M0 -85 v-30 M40 -75 l10 -25"/></g>}
   {success&&Array.from({length:20},(_,i)=><rect key={i} x={90+i*48} y={450+((local*105+i*47)%700)} width="9" height="22" rx="3" fill={i%3?C.green:'#e5bf51'} opacity=".65" transform={`rotate(${i*32+t*40} ${90+i*48} ${450+((local*105+i*47)%700)})`}/>)}
  </svg>
  <div style={{position:'absolute',left:80,top:1300,right:80,display:'flex',alignItems:'center',gap:14,fontSize:23,fontWeight:800,color:C.muted}}><span style={{width:12,height:12,borderRadius:12,background:line.who==='raka'?C.green:C.ink}}/>{line.who.toUpperCase()}<span style={{height:1,background:'#b7bead',flex:1}}/><span style={{fontWeight:500,fontSize:19}}>{t<25?'PANIK MODE':t<46?'CARI SOLUSI':'BISA NAPAS LAGI'}</span></div>
  <div style={{position:'absolute',top:1370,left:75,right:75,textAlign:'center',fontSize:47,lineHeight:1.43,fontWeight:800}}><span style={{background:C.ink,color:C.paper,boxDecorationBreak:'clone',WebkitBoxDecorationBreak:'clone',padding:'10px 18px',borderRadius:8}}>{split.map((w,i)=><React.Fragment key={i}><span style={{color:i===active?'#b6ef6d':C.paper}}>{w}</span>{' '}</React.Fragment>)}</span></div>
  {beat==='cta'&&<div style={{position:'absolute',top:1580,left:80,right:80,background:C.green,borderRadius:22,padding:'24px 28px',color:'white',textAlign:'center',fontSize:42,fontWeight:900,transform:`scale(${.95+.05*pop})`}}>ORDER? DM @jokodingg ↗</div>}
  <div style={{position:'absolute',left:80,right:80,bottom:140,display:'flex',justifyContent:'space-between',fontSize:22,fontWeight:700}}><span>@jokodingg</span><span style={{color:C.muted}}>BUG JANGAN DITERNAK.</span></div>
  <div style={{position:'absolute',bottom:105,left:80,right:80,height:5,background:'#dfe4d5',borderRadius:4}}><div style={{height:'100%',width:`${t/60*100}%`,background:C.green}}/></div>
  {lines.map((l,i)=><Sequence key={i} from={Math.round(l.start*fps)+5} durationInFrames={Math.round((l.end-l.start)*fps)-5}><Audio src={staticFile(`audio/line-${String(i).padStart(2,'0')}.mp3`)}/></Sequence>)}
  <Audio src={staticFile('audio/bed.mp3')} volume={.18}/>
 </AbsoluteFill>;
};

export const Root:React.FC=()=> <Composition id="Jokoding" component={Reel} durationInFrames={1800} fps={30} width={1080} height={1920}/>;
