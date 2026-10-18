import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import snapshot from '../../docs/design/references/thesis-2026-10-16/data.json';
import './kinetic.css';

const teal='#0F766E', ink='#111827', gray='#667085', mint='#CCFBF1';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const p=(f:number,start=0,length=22)=>interpolate(f,[start,start+length],[0,1],{...clamp,easing:Easing.bezier(.2,.75,.2,1)});

function Scene({children,kind='wipe'}:{children:React.ReactNode;kind?:'wipe'|'iris'|'rise'}) {
  const f=useCurrentFrame(),a=p(f,0,15);
  const clip=kind==='iris'?`circle(${a*150}% at 80% 60%)`:kind==='rise'?`inset(${(1-a)*100}% 0 0 0)`:`inset(0 ${(1-a)*100}% 0 0)`;
  return <AbsoluteFill className="kinetic-stage" style={{clipPath:clip}}><svg viewBox="0 0 1920 1080" className="kinetic-svg">{children}</svg></AbsoluteFill>;
}
function Title({one,two,f}:{one:string;two:string;f:number}) {
  return <g transform={`translate(${(1-p(f,5,18))*-60},0)`} opacity={p(f,5,12)}><text x="108" y="180" className="k-title">{one}</text><text x="108" y="276" className="k-title" fill={teal}>{two}</text></g>;
}
function Source({children}:{children:React.ReactNode}) {return <text x="110" y="1015" className="k-source">{children}</text>;}
function Pulse({f,y=900}:{f:number;y?:number}) {
  const phase=((f%60)+60)%60/60;
  return <g><path d={`M-30 ${y} H1950`} fill="none" stroke="#DFEEE9" strokeWidth="3"/><circle cx={phase*2050-60} cy={y} r="8" fill={teal}/></g>;
}

function Prosperity() {
  const f=useCurrentFrame(),left=150,right=1750,top=370,bottom=820;
  const x=(v:number)=>left+v/14000*(right-left), y=(v:number)=>bottom-v/100000*(bottom-top);
  const labels:Record<string,[number,number]>={IDN:[-15,-90],VNM:[10,35],THA:[10,-45],MYS:[-65,-32],CHN:[20,-4],SGP:[-20,-38],USA:[-125,40]};
  return <Scene><Title one="Productive economies." two="Dependable power." f={f}/>
    {[0,25000,50000,75000,100000].map(v=><g key={v} opacity={p(f,15,16)}><line x1={left} y1={y(v)} x2={left+(right-left)*p(f,15,30)} y2={y(v)} stroke="#DFE5E5"/><text x={left-20} y={y(v)+8} textAnchor="end" className="k-tick">{v===0?'$0':`$${v/1000}k`}</text></g>)}
    {[0,2000,4000,6000,8000,10000,12000,14000].map(v=><g key={v} opacity={p(f,16,20)}><line x1={x(v)} y1={top} x2={x(v)} y2={bottom} stroke="#E6EDEC"/><text x={x(v)} y={bottom+45} textAnchor="middle" className="k-tick">{v.toLocaleString('en-US')}</text></g>)}
    {snapshot.countries.map((c,i)=>{const a=p(f,25+i*4,15),hi=c.code==='IDN',[dx,dy]=labels[c.code];return <g key={c.code} opacity={a}><circle cx={x(c.kwh)} cy={y(c.gdp)} r={(hi?12:10)*a} fill={hi?teal:gray}/>{hi&&<circle cx={x(c.kwh)} cy={y(c.gdp)} r={21} stroke={teal} strokeWidth="2" fill="none"/>}<path d={`M${x(c.kwh)} ${y(c.gdp)} l${dx} ${dy+(dy<0?12:-10)}`} stroke={hi?teal:gray}/><text x={x(c.kwh)+dx} y={y(c.gdp)+dy} className="k-country" fill={hi?teal:ink}>{c.name}</text></g>;})}
    <text x={left} y={top-27} className="k-label">GDP / person · current US$</text><text x="950" y="922" textAnchor="middle" className="k-label">Electricity consumption · kWh / person / year</text>
    <text x="110" y="969" className="k-source">Selected economies. Association does not establish causation.</text><Source>World Bank WDI · 2023 · Snapshot 16 Oct 2026</Source>
  </Scene>;
}

function Rack({x,y,f,index=0}:{x:number;y:number;f:number;index?:number}) {
  const a=p(f,8+index*6,24);
  return <g transform={`translate(${x},${y+(1-a)*130})`} opacity={a}>
    <rect width="194" height="433" rx="22" fill="#F6FAF8" stroke={ink} strokeWidth="4"/>
    <rect x="12" y="13" width="170" height="405" rx="13" fill="#fff"/>
    {Array.from({length:6},(_,i)=><g key={i} transform={`translate(26,${35+i*58})`}><rect width="143" height="42" rx="7" fill={i%2?mint:'#EAF2EF'} stroke="#ABC6BE"/><path d="M15 14 H73 M15 26 H73" stroke="#7E9F95" strokeWidth="3"/>{[0,1,2].map(j=><circle key={j} cx={107+j*10} cy="21" r="3" fill={teal} opacity={.3+.7*(.5+.5*Math.sin(f*.18+i+j+index))}/>)}</g>)}
    <circle cx="96" cy="392" r="7" fill={teal}/>
  </g>;
}
function Compute() {
  const f=useCurrentFrame(),a=p(f,18,40);
  return <Scene kind="rise"><Title one="AI runs on compute." two="Compute runs on power." f={f}/>
    <g transform="translate(110,388)"><text y="15" className="k-label">Global data-centre electricity</text><text y="125" className="k-number">485<tspan fontSize="39"> TWh</tspan></text><text y="174" className="k-body">2025</text>
      <path d="M65 220 H505 m-23 -14 23 14 -23 14" stroke={teal} strokeWidth="5" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(f,28,28)}/>
      <text x="0" y="345" className="k-number" fill={teal}>950<tspan fontSize="39"> TWh</tspan></text><text y="392" className="k-body">2030 projection</text>
    </g>
    <g transform={`translate(${(1-a)*100},0)`}><Rack x={1090} y={367} f={f}/><Rack x={1310} y={323} f={f} index={1}/><Rack x={1530} y={367} f={f} index={2}/>
      <path d="M1187 805 V860 H1627 V805 M1407 760 V936 H950" stroke={teal} strokeWidth="5" fill="none"/>
      {[0,1,2,3,4].map(i=><rect key={i} x={1187+((f*6+i*91)%440)} y="852" width="18" height="16" rx="3" fill={teal}/>)}
    </g>
    <text x="110" y="940" className="k-body">Power must keep pace.</text>
    <Source>IEA · Key Questions on Energy and AI, 2026 · All data-centre workloads · Infrastructure illustration</Source>
  </Scene>;
}

function Region() {
  const f=useCurrentFrame(),a=p(f,6,27);
  return <Scene kind="iris"><text x="110" y="178" className="k-title">Closer to home.</text>
    <g transform={`translate(1400,555) rotate(${f*.24})`} fill="none" stroke="#A9D4C7" strokeWidth="3">{[190,285,365].map((r,i)=><ellipse key={r} rx={r} ry={r*.64} transform={`rotate(${i*60})`}/>)}{[0,1,2,3,4,5].map(i=><circle key={i} cx={Math.cos(i*Math.PI/3)*285} cy={Math.sin(i*Math.PI/3)*185} r="11" fill={teal} stroke="none"/>)}</g>
    <text x="108" y="575" fontSize={250} className="k-display" fill={teal} transform={`translate(0,${(1-a)*70})`} opacity={a}>&gt;2×</text>
    <text x="116" y="675" className="k-body">Southeast Asian data-centre power demand</text><text x="116" y="731" className="k-body">by 2030, relative to 2024.</text><Pulse f={f}/><Source>IEA · Energy and AI, 2025 Base Case · Regional data centres</Source>
  </Scene>;
}

function Ship({x,y,scale=1}:{x:number;y:number;scale?:number}) {
  return <g transform={`translate(${x},${y}) scale(${scale})`}><path d="M0 58 H266 L238 109 H32 Z" fill={ink}/><path d="M30 17 H195 V58 H30 Z" fill={mint} stroke={teal} strokeWidth="3"/>{[0,1,2,3,4].map(i=><path key={i} d={`M${42+i*29} 17 V58`} stroke={teal} strokeWidth="2"/>)}<path d="M202 27 H236 V58 H202 Z" fill="#fff" stroke={ink} strokeWidth="3"/><path d="M220 27 V0" stroke={ink} strokeWidth="4"/><path d="M18 127 Q55 116 92 127 T166 127 T240 127" fill="none" stroke="#8CBDAC" strokeWidth="3"/></g>;
}
function Security() {
  const f=useCurrentFrame(),a=p(f,18,90),gap=interpolate(f,[20,70,120,180],[140,54,54,140],clamp);
  return <Scene><Title one="Supply shocks" two="travel fast." f={f}/>
    <text x="110" y="420" className="k-number" fill={teal}>60<tspan fontSize="56">%</tspan></text><text x="110" y="490" className="k-body">of Southeast Asia’s crude imports</text><text x="110" y="540" className="k-body">came from the Middle East.</text><text x="110" y="591" className="k-label">Before the crisis · import origin</text>
    <g transform="translate(835,298)"><path d="M0 60 H960 M0 460 H960" stroke="#BCD9CF" strokeWidth="4"/>
      <path d={`M490 60 V${260-gap/2} H640 V60 M490 460 V${260+gap/2} H640 V460`} fill="#E5F2EC" stroke={teal} strokeWidth="3"/>
      <path d="M-20 260 H960" fill="none" stroke="#9EC8BA" strokeWidth="3" strokeDasharray="9 12"/>
      <Ship x={interpolate(a,[0,.5,1],[-230,230,680])} y={214+Math.sin(f*.08)*3} scale={.58}/><Ship x={interpolate(a,[0,.5,1],[-530,-40,370])} y={214+Math.sin(f*.08+2)*3} scale={.58}/>
      <text x="560" y="520" className="k-label" textAnchor="middle">Hormuz</text>
    </g>
    <text x="110" y="882" className="k-body">Concentrated routes make diversification matter.</text><text x="110" y="943" className="k-source">Conceptual route. 60% describes import origin, not Hormuz transit volume.</text><Source>IEA · Southeast Asia Energy Outlook, 2026</Source>
  </Scene>;
}

function Car({f,x,y}:{f:number;x:number;y:number}) {
  const rotation=f*7;
  return <g transform={`translate(${x},${y})`}><path d="M25 93 Q29 58 76 55 L128 7 Q144 -5 203 -5 H310 Q337 -3 353 25 L375 58 422 71 Q449 79 449 110 V136 H16 V115 Q16 102 25 93Z" fill={mint} stroke={ink} strokeWidth="5"/>
    <path d="M148 15 H215 V58 H103 Z M232 15 H304 Q323 15 334 34 L348 58 H232 Z" fill="#fff" stroke={teal} strokeWidth="3"/><path d="M217 62 V124 M241 79 H269" stroke={teal} strokeWidth="3"/>
    {[103,356].map(cx=><g key={cx} transform={`translate(${cx},132)`}><circle r="39" fill={ink}/><circle r="22" fill="#fff"/><g transform={`rotate(${rotation})`} stroke={gray} strokeWidth="4"><path d="M-16 0 H16 M0 -16 V16"/></g></g>)}
  </g>;
}
function Mobility() {
  const f=useCurrentFrame(),drive=p(f,6,55),charge=p(f,65,65);
  return <Scene kind="rise"><Title one="Less oil exposure." two="More to electrify." f={f}/>
    <text x="110" y="390" className="k-body">EVs change what must be built.</text>
    <g><path d="M-30 815 H1950" stroke="#A8C9BE" strokeWidth="5"/><Car f={Math.min(f,64)} x={interpolate(drive,[0,1],[210,1000])} y={638}/>
      <g transform="translate(1520,476)"><rect width="150" height="333" rx="20" fill="#F3F9F6" stroke={teal} strokeWidth="5"/><rect x="25" y="32" width="100" height="112" rx="10" fill="#fff" stroke="#93B9AC" strokeWidth="3"/>
        {[0,1,2].map(i=><rect key={i} x="43" y={111-i*23} width="63" height="15" rx="3" fill={teal} opacity={charge>(i+1)/4?1:.15}/>)}<path d="M148 90 H192 V218 Q192 258 152 258 H-65" stroke={ink} strokeWidth="9" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(f,58,27)}/><rect x="-79" y="246" width="29" height="22" rx="4" fill={teal} opacity={p(f,80,8)}/>
      </g>
      <path d="M110 870 H1770" stroke={teal} strokeWidth="4" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p(f,18,40)}/>
      {['Generation','Grids','Storage','Charging'].map((label,i)=><g key={label} opacity={p(f,38+i*9,16)}><circle cx={150+i*475} cy="870" r="10" fill="#fff" stroke={teal} strokeWidth="4"/><text x={110+i*475} y="940" className="k-label">{label}</text></g>)}
    </g><Source>IEA · Electrification and energy security, Sep 2026 · EV and infrastructure illustration</Source>
  </Scene>;
}

function Connection() {
  const f=useCurrentFrame(),a=p(f,10,45);
  return <Scene kind="iris"><Title one="Electricity powers infrastructure." two="Capital powers electricity." f={f}/>
    <g transform="translate(130,430)"><defs><clipPath id="solar-roof"><path d="M20 107 210 30 397 112 210 188Z"/></clipPath></defs><path d="M0 330 V120 L210 15 420 120 V330 Z" fill="#F4F9F6" stroke={ink} strokeWidth="4"/><path d="M20 107 210 30 397 112 210 188Z" fill={mint} stroke={teal} strokeWidth="3"/><g clipPath="url(#solar-roof)">{[0,1,2,3,4].map(i=><path key={i} d={`M${-10+i*75} 30 l300 152`} stroke={teal} strokeWidth="2"/>)}</g><path d="M45 210 H160 V290 H45 Z M205 210 H320 V290 H205 Z" fill="#fff" stroke="#9DBCAE" strokeWidth="3"/></g>
    <g transform={`translate(1510,610) rotate(${f*.25})`} fill="none" stroke="#9BCDBB" strokeWidth="3"><circle r="175"/><ellipse rx="175" ry="65"/><ellipse rx="65" ry="175"/><path d="M-175 0 H175"/>{[0,1,2].map(i=><circle key={i} cx={Math.cos(i*2)*175} cy={Math.sin(i*2)*175} r="9" fill={teal}/>)}</g>
    <path d="M550 650 H790 Q850 650 850 610 H1040 Q1120 610 1140 650 H1330" fill="none" stroke={teal} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-a}/>
    <circle cx={550+780*((f%45)/45)} cy="650" r="9" fill={teal}/><text x="110" y="942" className="k-body">Understand the shift. Connect the infrastructure.</text>
  </Scene>;
}
function Closing() {
  const f=useCurrentFrame();
  return <AbsoluteFill className="kinetic-stage"><div className="k-close" style={{transform:`translateY(${(1-p(f,4,18))*50}px)`}}><div className="k-close-brand"><Img src={staticFile('gen-z-symbol.svg')}/><span>Gen-Z</span></div><h2>See it early.<br/><span>Be ready to lead.</span></h2><p>Energy infrastructure. Global capital.</p></div><svg viewBox="0 0 1920 1080" className="kinetic-svg"><Pulse f={f} y={900}/></svg></AbsoluteFill>;
}

export function KineticThesis() {
  return <AbsoluteFill style={{background:'#fff'}}>
    <Sequence durationInFrames={192}><OffthreadVideo src={staticFile('intro-v2.mp4')} muted style={{width:'100%',height:'100%'}}/></Sequence>
    <Sequence from={180} durationInFrames={192}><Prosperity/></Sequence>
    <Sequence from={360} durationInFrames={192}><Compute/></Sequence>
    <Sequence from={540} durationInFrames={102}><Region/></Sequence>
    <Sequence from={630} durationInFrames={192}><Security/></Sequence>
    <Sequence from={810} durationInFrames={192}><Mobility/></Sequence>
    <Sequence from={990} durationInFrames={132}><Connection/></Sequence>
    <Sequence from={1110} durationInFrames={90}><Closing/></Sequence>
  </AbsoluteFill>;
}
