import React from 'react';
import {AbsoluteFill,Audio,Sequence,interpolate,staticFile,useCurrentFrame} from 'remotion';
import lines from './natural-timing.json';
const P={paper:'#eae6d8',ink:'#44443b',wall:'#c8c8b8',floor:'#aca58c',green:'#647e4a',yellow:'#f1dc83'};
const ramp=(v:number,a:number,b:number)=>interpolate(v,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const Room=()=> <g stroke={P.ink} strokeWidth="3" strokeLinejoin="round">
 <path d="M0 0 H1080 V1290 L0 1400 Z" fill={P.wall}/><path d="M0 200 L150 440 V1150 L0 1390 Z" fill="#a6aa9c"/>
 <path d="M0 1390 L150 1150 L1080 1140 V1920 H0 Z" fill={P.floor}/><path d="M150 1150 L1080 1140 M150 440 L1080 420" fill="none" stroke="#898e7c"/>
 <path d="M0 1660 L500 1147 M360 1920 L760 1140 M970 1920 L1020 1140 M0 1535 H1080 M0 1770 H1080" fill="none" stroke="#8e8a75" strokeWidth="2" opacity=".5"/>
 <rect x="680" y="480" width="300" height="330" rx="3" fill="#dfdcca"/><rect x="696" y="497" width="268" height="291" fill="#707c8d"/>
 <path d="M698 711 H730 V674 H770 V699 H807 V656 H845 V712 H879 V681 H920 V703 H963 V786 H698Z" fill="#596574" stroke="none"/>
 <path d="M822 497 V788 M696 640 H964" fill="none" stroke="#dfdcca" strokeWidth="13"/><circle cx="900" cy="551" r="25" fill="#eee7c4" stroke="none"/><circle cx="913" cy="541" r="25" fill="#707c8d" stroke="none"/>
 <path d="M664 474 Q629 651 665 826 L700 817 Q675 652 704 475 M976 474 Q1012 649 984 831 L953 819 Q979 647 943 474" fill="#bab79f" stroke="#777b6c"/>
 <g transform="translate(355 555)"><circle r="72" fill="#dddcca"/><circle r="64" fill="none" strokeWidth="1"/><path d="M0 -48 V0 L33 19" fill="none" strokeWidth="5"/><circle r="5" fill={P.ink}/></g>
 <g transform="translate(182 744)"><path d="M0 0 H255 V22 H0 Z" fill="#8d8367"/><path d="M30 24 V57 M220 24 V57" fill="none"/><path d="M20 -75 H49 V0 H20Z" fill="#9c7963"/><path d="M53 -93 H87 V0 H53Z" fill="#84926b"/><path d="M96 -65 H127 V0 H96Z" fill="#d0c6a4"/><path d="M151 -17 L177 -75 L203 -62 L177 0Z" fill="#808a97"/></g>
 <path d="M105 1210 Q38 1030 91 980 Q138 1027 105 1210 M106 1210 Q152 1095 199 1101 Q171 1175 106 1210 M105 1192 Q29 1124 21 1076 Q102 1095 105 1192" fill="#738661"/><path d="M61 1201 H148 L135 1290 H77Z" fill="#b89174"/>
 <path d="M910 1235 H1045 V1450 H910 Z" fill="#8d8d79"/><path d="M925 1250 V1435 M951 1250 V1435 M977 1250 V1435 M1003 1250 V1435 M1029 1250 V1435" stroke="#6f7466" strokeWidth="2"/>
</g>;
const Cup=()=> <g stroke={P.ink} strokeWidth="3"><path d="M-24 -31 H23 V20 Q0 32 -24 20Z" fill="#e7dfbf"/><path d="M23 -20 Q50 -21 45 2 Q42 17 23 11" fill="none"/><ellipse cy="-30" rx="23" ry="6" fill="#7b624a"/></g>;
const Student:React.FC<{name:string;time:number;local:number;act:string;mouth:number;talk:boolean;index:number}>=({name,time,local,act,mouth,talk,index})=>{
 const n=name==='naya',x=n?820:330,y=n?800:850;
 const entered=n?(1-ramp(time,1,3))*370:0;
 const lean=n&&['lean','point','explain'].includes(act)?-10:!n&&['tired','slump'].includes(act)?10:0;
 const gesture=talk?Math.sin(time*4)*9:0,point=n&&['point','show','explain'].includes(act);
 const lift=!n&&act==='drink'?ramp(local,.1,1.2):0;
 const closed=(time+(n?.7:0))%4.7>4.53;
 return <g transform={`translate(${x+entered} ${y}) rotate(${lean})`} stroke={P.ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
  {!n&&<><path d="M-85 110 Q-120 120 -110 280 L-92 310 H80 L83 287 H-82 V123 Z" fill="#788274"/><path d="M-75 310 V410 M70 310 L100 410" fill="none"/></>}
  <path d={n?'M-29 210 L-42 350 L-75 423 M28 210 L46 350 L79 423':'M-45 218 L65 250 L85 393 M40 220 L113 254 L139 393'} fill="none" strokeWidth="6"/>
  <path d={n?'M-75 423 h-28 M79 423 h28':'M85 393 h32 M139 393 h30'} strokeWidth="8"/>
  <path d="M-23 59 H23 L58 209 Q0 228 -57 209 Z" fill={n?'#b0b88f':'#8a9b72'}/><path d="M-23 64 Q0 95 23 64" fill="none" strokeWidth="2"/>
  <path d={n?`M-29 93 Q-85 128 ${point?-180:-100} ${point?125+gesture:236} M30 94 Q65 145 72 ${235-gesture}`:`${act==='typing'?'M-30 95 L-35 128':'M-30 95 Q-71 160 -35 204'} M33 98 Q104 160 ${143-lift*120} ${197-lift*150+gesture}`} fill="none" strokeWidth="5"/>
  <circle cx={n?(point?-180:-100):-35} cy={n?(point?125+gesture:236):204} r="7" fill={P.paper}/><circle cx={n?72:143-lift*120} cy={n?235-gesture:197-lift*150+gesture} r="7" fill={P.paper}/>
  {n&&<path d="M40 -48 Q111 -60 103 38 Q78 22 57 0" fill="#5a564b"/>}<circle r="62" fill="#eee7d0"/>
  {n?<path d="M-61 -12 Q-65 -65 5 -63 Q58 -57 62 -7 Q24 -22 9 -40 Q-22 -18 -61 -12Z" fill="#5a564b"/>:<path d="M-61 -19 L-59 -51 L-35 -66 L-14 -57 L9 -72 L31 -59 L51 -64 L62 -23 Q22 -40 -8 -27 Z" fill="#595649"/>}
  {!n&&<g fill="none" strokeWidth="3"><rect x="-48" y="-12" width="40" height="32" rx="8"/><rect x="8" y="-12" width="40" height="32" rx="8"/><path d="M-8 -1 H8"/></g>}
  {closed?<path d="M-36 4 H-20 M20 4 H36" strokeWidth="3"/>:<><ellipse cx={n?-30:-21} cy="4" rx="3.8" ry="5" fill={P.ink}/><ellipse cx={n?21:30} cy="4" rx="3.8" ry="5" fill={P.ink}/></>}
  <path d={index<9&&!n?'M-42 -23 L-17 -19 M17 -19 L41 -23':'M-40 -24 Q-28 -28 -16 -24 M16 -24 Q28 -28 40 -24'} fill="none" strokeWidth="2.5"/>
  {mouth>.12?<ellipse cy="34" rx={7+mouth*6} ry={2+mouth*14} fill="#72584c" strokeWidth="2"/>:<path d={index>=13?'M-13 30 Q0 43 13 30':'M-12 35 Q0 33 12 35'} fill="none" strokeWidth="2.5"/>}
  {!n&&act==='shrug'&&<path d={`M-50 146 Q-110 ${112+gesture} -123 155`} fill="none" strokeWidth="5"/>}
  {!n&&act==='drink'&&<g transform={`translate(${143-lift*120} ${187-lift*150}) rotate(${-lift*18})`}><Cup/></g>}
 </g>;
};
const Desk:React.FC<{index:number;time:number;act:string}>=({index,time,act})=><g stroke={P.ink} strokeWidth="3" strokeLinejoin="round">
 <path d="M167 1039 L660 1019 L745 1081 L199 1120 Z" fill="#b0a17f"/><path d="M199 1120 L745 1081 V1103 L199 1144Z" fill="#8f8268"/><path d="M219 1142 V1345 L238 1340 V1139 M709 1105 V1290 L727 1284 V1101" fill="#847c65"/>
 <g transform="translate(423 884)"><path d="M0 0 H238 L255 159 H18Z" fill="#74786d"/><path d="M10 11 H228 L242 146 H28Z" fill="#38423d"/><path d="M18 159 H255 L279 184 H-5Z" fill="#a4aa9a"/><path d="M34 165 H232 M46 174 H245" stroke="#6d7469" strokeWidth="2"/>
 <text x="27" y="39" fontFamily="monospace" fontSize="15" fill="#c5cdb6" stroke="none">$ npm run dev</text>
 {[0,1,2,3].map(i=><text key={i} x={28+i*2} y={68+i*22} fontFamily="monospace" fontSize="13" fill={i===0?'#da907e':'#9ca99d'} stroke="none">{i===0?(index<2?'× 1 error':'× 6 errors'):['','TypeError: undefined','at app.js:24','build failed'][i]}</text>)}</g>
 {act!=='drink'&&<g transform="translate(275 1020)"><Cup/></g>}
 <path d="M335 1079 L392 1075 L417 1094 L356 1101Z" fill="#ded6b8"/><path d="M348 1086 L394 1083" strokeWidth="1"/>
 {act==='typing'&&<g transform={`translate(${380+Math.sin(time*16)*3} 1040)`}><path d="M-85 -62 Q-36 -47 35 5 L108 15" fill="none" strokeWidth="5"/><path d="M108 15 l19 -5 M108 15 l22 1 M108 15 l18 8" fill="none"/></g>}
</g>;
const Phone:React.FC<{local:number;send:boolean}>=({local,send})=><g transform={`translate(537 ${960+(1-ramp(local,0,.4))*80})`} stroke={P.ink} strokeWidth="3">
 <path d="M-110 210 Q-212 139 -195 50 Q-188 5 -163 42 L-133 103 L-145 -91 Q-142 -129 -119 -112 L-70 115Z" fill="#e9dfc5"/>
 <rect x="-145" y="-270" width="290" height="540" rx="30" fill="#646b60"/><rect x="-132" y="-252" width="264" height="502" rx="21" fill="#efece0"/><rect x="-37" y="-247" width="74" height="10" rx="5" fill={P.ink}/>
 <text y="-198" textAnchor="middle" fill={P.green} fontSize="32" fontWeight="800" stroke="none">jokoding</text><text y="-171" textAnchor="middle" fill="#8d9280" fontSize="15" stroke="none">@jokodingg</text><path d="M-115 -154 H115" stroke="#c9cdbf"/>
 <g stroke="none" fontSize="19" fill={P.ink}><rect x="-106" y="-132" width="212" height="79" rx="12" fill="#d1d9b8"/><text x="-90" y="-101">Halo, mau tanya</text><text x="-90" y="-74">tugas ini.</text>
 <g opacity={ramp(local,.3,.8)}><rect x="-106" y="-40" width="212" height="112" rx="12" fill="#d1d9b8"/><rect x="-91" y="-24" width="182" height="58" rx="4" fill="#4d594f"/><text x="-82" y="12" fill="#de9b85" fontFamily="monospace" fontSize="15">× TypeError</text><text x="-90" y="57" fontSize="15">screenshot-error.png</text></g>
 <g opacity={send?ramp(local,.2,.6):.45}><rect x="-106" y="85" width="212" height="74" rx="12" fill="#d1d9b8"/><text x="-90" y="113">Deadline besok pagi.</text><text x="-90" y="140">Bisa diskusi dulu?</text></g><text y="204" textAnchor="middle" fontSize="18" fill={P.green}>{send&&local>.8?'Terkirim ✓':'Tulis pesan…'}</text></g>
</g>;
export const Natural:React.FC=()=>{
 const f=useCurrentFrame(),t=f/30,final=t>=57.5;
 const index=final?lines.length-1:Math.max(0,lines.findIndex(r=>t>=r.start&&t<r.end));
 const line=lines[index],local=t-line.start,mouth=line.mouth[Math.floor(local*30)]||0,shot=line.shot;
 const zoom=(shot==='raka'?1.65:shot==='naya'?1.6:shot==='screen'?1.52:shot==='phone'?1.17:1)+(final?0:ramp(local,0,line.end-line.start)*.025);
 const fx=shot==='raka'?360:shot==='naya'?760:shot==='screen'?530:540,fy=shot==='raka'?955:shot==='naya'?880:shot==='screen'?1000:960;
 const chapter=index<5?'Satu baris doang.':index<9?'Besok pagi dikumpulin.':index<13?'Coba tanya dulu.':'Biar nggak mentok sendiri.';
 let wi=0;line.words.forEach((w,i)=>{if(local>=w.start)wi=i});const group=Math.floor(wi/5)*5;
 return <AbsoluteFill style={{background:P.paper,fontFamily:'DejaVu Sans, sans-serif',color:P.ink}}>
  <svg width="1080" height="1920" viewBox="0 0 1080 1920"><g transform={`translate(${540-fx*zoom} ${960-fy*zoom}) scale(${zoom})`}><Room/><Student name="raka" time={t} local={local} act={line.act} mouth={!final&&line.who==='raka'?mouth:0} talk={!final&&line.who==='raka'} index={index}/><Student name="naya" time={t} local={local} act={line.act} mouth={!final&&line.who==='naya'?mouth:0} talk={!final&&line.who==='naya'} index={index}/><Desk index={index} time={t} act={line.act}/>{shot==='phone'&&!final&&<Phone local={local} send={line.act==='send'}/>}</g></svg>
  <AbsoluteFill style={{background:'linear-gradient(to bottom,#eae6d8 0%,#eae6d8 10%,#eae6d8e8 17%,#eae6d800 28%,#eae6d800 69%,#eae6d8cb 80%,#eae6d8 91%)'}}/>
  <div style={{position:'absolute',left:62,top:155,right:62,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:17,fontWeight:800,letterSpacing:4}}><span>CERITA ANAK KAMPUS</span><span style={{letterSpacing:-1,fontSize:31}}>joko<span style={{color:P.green}}>ding</span></span></div>
  <div style={{position:'absolute',left:62,right:62,top:212,fontSize:48,fontWeight:800,letterSpacing:-1.6,lineHeight:1.15}}>{final?'Mentok di tugas koding?':chapter}</div><div style={{position:'absolute',left:62,top:292,background:P.green,color:'#f6f1df',borderRadius:12,fontSize:16,fontWeight:700,letterSpacing:3,padding:'7px 14px'}}>SKETSA • JOKODING</div>
  {!final&&<div style={{position:'absolute',top:1430,left:100,right:100,textAlign:'center'}}><div style={{fontSize:21,fontWeight:800,letterSpacing:3,marginBottom:18,color:'#565c4c'}}>{line.who.toUpperCase()}</div><div style={{fontSize:45,lineHeight:1.43,fontWeight:800}}><span style={{background:'#35372fef',color:'#f6f2e6',padding:'8px 12px',borderRadius:6,boxDecorationBreak:'clone',WebkitBoxDecorationBreak:'clone'}}>{line.words.slice(group,group+5).map((w,k)=><React.Fragment key={k}><span style={{background:group+k===wi?P.yellow:'transparent',color:group+k===wi?P.ink:undefined,borderRadius:4,padding:'0 3px'}}>{w.text}</span>{' '}</React.Fragment>)}</span></div></div>}
  {final&&<AbsoluteFill style={{background:'#eae6d8eb',justifyContent:'center',alignItems:'center',opacity:ramp(t,57.5,57.85)}}><div style={{fontSize:100,fontWeight:900,letterSpacing:-7}}>joko<span style={{color:P.green}}>ding</span></div><div style={{fontSize:46,fontWeight:700,marginTop:45}}>Mentok di tugas koding?</div><div style={{fontSize:30,marginTop:25}}>Kirim brief, error, dan deadline kamu.</div><div style={{background:P.green,color:'#fffbea',borderRadius:18,padding:'26px 48px',fontSize:45,fontWeight:800,marginTop:55}}>DM @jokodingg ↗</div></AbsoluteFill>}
  <div style={{position:'absolute',left:62,bottom:145,fontSize:24,color:P.green,fontWeight:800}}>@jokodingg</div>
  {lines.map((r,i)=><Sequence key={i} from={Math.round(r.start*30)} durationInFrames={Math.ceil(r.audioDuration*30)}><Audio src={staticFile(`audio/natural/line-${String(i).padStart(2,'0')}.mp3`)}/></Sequence>)}<Audio src={staticFile('audio/natural/bed.mp3')} volume={.12}/>
 </AbsoluteFill>;
};
