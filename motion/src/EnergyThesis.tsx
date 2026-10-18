import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import snapshot from '../../docs/design/references/thesis-2026-10-16/data.json';
import './motion.css';

const TEAL = '#0F766E';
const GRAY = '#667085';
const FPS = 30;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(.2,.75,.25,1);
const progress = (frame: number, start: number, duration: number) => interpolate(frame,[start,start+duration],[0,1],{...clamp,easing:ease});
const shown = (frame: number, start = 0, duration = 24): React.CSSProperties => {
  const p = progress(frame,start,duration);
  return {opacity:p, transform:`translateY(${(1-p)*24}px)`};
};

function Brand() {
  return <div className="brand"><span className="brand-mark"><Img src={staticFile('gen-z-symbol.svg')} /></span><span>Gen-Z</span></div>;
}

function Frame({children, duration, source, chapter}: {children: React.ReactNode; duration:number; source?:string; chapter:string}) {
  const f=useCurrentFrame();
  const alpha=interpolate(f,[0,12,duration-12,duration],[0,1,1,0],clamp);
  return <AbsoluteFill className="canvas" style={{opacity:alpha}}>
    <Brand />
    <div className="chapter">{chapter}</div>
    {children}
    {source && <p className="source">{source}</p>}
  </AbsoluteFill>;
}

function Scatter() {
  const f=useCurrentFrame();
  const left=156,right=1736,top=385,bottom=815;
  const x=(kwh:number)=>left+kwh/14000*(right-left);
  const y=(gdp:number)=>bottom-gdp/100000*(bottom-top);
  const offsets:Record<string,[number,number]>={IDN:[-8,-100],VNM:[8,35],THA:[12,-45],MYS:[-32,-31],CHN:[23,4],SGP:[-32,-38],USA:[-120,40]};
  return <Frame duration={330} chapter="Electricity & prosperity" source="World Bank WDI · 2023 · Seven selected economies · Snapshot 16 Oct 2026">
    <h2 className="scene-title" style={shown(f,4)}>Electricity supports<br/><span>productive economies.</span></h2>
    <svg className="scatter" viewBox="0 0 1920 1080" aria-label="Electricity and GDP in seven selected economies">
      {[0,25000,50000,75000,100000].map(v=><g key={v} opacity={progress(f,15,24)}>
        <line x1={left} y1={y(v)} x2={right} y2={y(v)} stroke="#DFE5E5" strokeWidth="1.3" />
        <text x={left-24} y={y(v)+9} textAnchor="end" className="tick">{v===0?'$0':`$${v/1000}k`}</text>
      </g>)}
      {[0,2000,4000,6000,8000,10000,12000,14000].map(v=><g key={v} opacity={progress(f,15,24)}>
        <line x1={x(v)} y1={top} x2={x(v)} y2={bottom} stroke="#EBEEEE" />
        <text x={x(v)} y={bottom+45} textAnchor="middle" className="tick">{v.toLocaleString('en-US')}</text>
      </g>)}
      {snapshot.countries.map((c,i)=>{
        const p=progress(f,36+i*8,35), px=x(c.kwh),py=y(c.gdp),[dx,dy]=offsets[c.code];
        const hi=c.code==='IDN';
        return <g key={c.code} opacity={p}>
          {hi&&<circle cx={px} cy={py} r={19} fill="none" stroke={TEAL} strokeWidth={2.5}/>}
          <circle cx={px} cy={py} r={hi?11:10} fill={hi?TEAL:GRAY} />
          <line x1={px} y1={py} x2={px+dx} y2={py+dy+(dy<0?11:-8)} stroke={hi?TEAL:GRAY}/>
          <text x={px+dx} y={py+dy} className={hi?'country highlighted':'country'}>{c.name}</text>
        </g>;
      })}
      <text x={left} y={top-27} className="axis-name">GDP per person · current US$</text>
      <text x={(left+right)/2} y={bottom+97} textAnchor="middle" className="axis-name">Electric power consumption · kWh / person / year</text>
    </svg>
    <p className="scatter-note" style={{opacity:progress(f,130,25)}}>Selected-country comparison. Association does not establish causation.</p>
  </Frame>;
}

function DataCentres() {
  const f=useCurrentFrame();
  const p=progress(f,32,60);
  const scale=0.44;
  const bottom=833;
  return <Frame duration={300} chapter="AI & data centres" source="IEA · Key Questions on Energy and AI · 2026 · Global data centres, all workloads">
    <h2 className="scene-title" style={shown(f,4)}>Digital growth has<br/><span>a physical power demand.</span></h2>
    <div className="data-copy" style={shown(f,22)}>
      <p className="metric-caption">Global data-centre electricity use</p>
      <p className="large-stat">485 <span>TWh</span></p>
      <p className="metric-description">in 2025</p>
      <p className="data-explainer">AI accelerates the buildout.<br/>Grid connections, generation and storage must keep pace.</p>
    </div>
    <svg className="data-chart" viewBox="0 0 1920 1080">
      {[0,250,500,750,1000].map(v=><g key={v}><line x1={1030} y1={bottom-v*scale} x2={1748} y2={bottom-v*scale} stroke="#E2E8E7"/><text x={1005} y={bottom-v*scale+8} textAnchor="end" className="tick">{v.toLocaleString('en-US')}</text></g>)}
      <rect x={1110} y={bottom-485*scale*p} width={190} height={485*scale*p} fill={GRAY} rx={4}/>
      <rect x={1450} y={bottom-950*scale*p} width={190} height={950*scale*p} fill="#CCFBF1" stroke={TEAL} strokeWidth={3} rx={4}/>
      <text x={1205} y={bottom-485*scale-30} textAnchor="middle" className="bar-value" opacity={p}>485</text>
      <text x={1545} y={bottom-950*scale-30} textAnchor="middle" className="bar-value teal" opacity={p}>950</text>
      <text x={1205} y={bottom+49} textAnchor="middle" className="country">2025</text>
      <text x={1545} y={bottom+49} textAnchor="middle" className="country">2030</text>
      <text x={1545} y={bottom+87} textAnchor="middle" className="tick">Projection</text>
      <text x={1030} y={340} className="axis-name">TWh / year</text>
    </svg>
  </Frame>;
}

function SoutheastAsia() {
  const f=useCurrentFrame();
  return <Frame duration={180} chapter="Southeast Asia" source="IEA · Energy and AI · 2025 Base Case · Regional data centres, 2024–2030">
    <h2 className="scene-title" style={shown(f,3)}>The demand is<br/><span>closer than it looks.</span></h2>
    <div className="regional-stat" style={shown(f,22)}><span>&gt;2×</span><p>Projected data-centre electricity demand<br/>in Southeast Asia by 2030, relative to 2024.</p></div>
    <p className="regional-note" style={shown(f,45)}>AI is one demand layer.<br/>Cooling, manufacturing and electrification add others.</p>
  </Frame>;
}

function Hormuz() {
  const f=useCurrentFrame();
  const p=progress(f,40,65);
  return <Frame duration={300} chapter="Energy security" source="IEA · Southeast Asia Energy Outlook · 2026 · Import share before the crisis">
    <h2 className="scene-title" style={shown(f,4)}>Energy security has<br/><span>a supply-route risk.</span></h2>
    <div className="hormuz-copy" style={shown(f,20)}><p className="large-stat">60<span>%</span></p><p className="metric-description">of Southeast Asia’s crude oil imports<br/>came from the Middle East before the crisis.</p></div>
    <div className="route-diagram" style={{opacity:progress(f,35,20)}}>
      <span className="route-label origin">Middle East</span><span className="route-label destination">Southeast Asia</span>
      <svg viewBox="0 0 1660 210" aria-label="Conceptual supply route, not a geographic map">
        <path d="M50 106 H635 Q710 106 758 106 H878 Q956 106 1020 106 H1600" fill="none" stroke="#DAE5E2" strokeWidth="6" />
        <path d="M50 106 H635 Q710 106 758 106 H878 Q956 106 1020 106 H1600" fill="none" stroke={TEAL} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>
        <path d="M753 30 V75 M753 137 V182 M885 30 V75 M885 137 V182" fill="none" stroke="#111827" strokeWidth="5"/>
        <text x="819" y="203" textAnchor="middle" className="route-small">Strait of Hormuz</text>
      </svg>
    </div>
    <p className="hormuz-note" style={shown(f,100)}>Disruption can transmit into fuel costs.<br/>Dependence makes diversification more urgent.</p>
    <p className="route-caveat">Conceptual route. The 60% figure describes import origin, not the share transiting Hormuz.</p>
  </Frame>;
}

function Electrification() {
  const f=useCurrentFrame();
  return <Frame duration={240} chapter="Electrification" source="IEA · Electrification and energy security · 22 Sep 2026 · Directional implication, not a guarantee">
    <h2 className="scene-title" style={shown(f,4)}>Less imported fuel.<br/><span>More demand for reliable power.</span></h2>
    <p className="ev-copy" style={shown(f,28)}>EVs can reduce exposure to oil.<br/>The shift needs generation, grids, storage and charging.</p>
    <div className="infrastructure-flow">
      {['Generation','Grids','Storage','EV charging'].map((name,i)=><div key={name} className="flow-item" style={shown(f,44+i*14)}><span className="flow-rule"/><p>{name}</p></div>)}
    </div>
    <p className="ev-note" style={shown(f,125)}>Electrification changes the energy system.<br/>It does not remove the need to build one.</p>
  </Frame>;
}

function Readiness() {
  const f=useCurrentFrame();
  return <Frame duration={120} chapter="Readiness">
    <div className="readiness"><h2 style={shown(f,4)}>See the shift early.</h2><h2 className="teal" style={shown(f,23)}>Be ready to lead.</h2><p style={shown(f,48)}>The advantage starts with understanding what must be built.</p></div>
  </Frame>;
}

function Closing() {
  const f=useCurrentFrame();
  return <Frame duration={150} chapter="Infrastructure meets capital">
    <div className="closing"><h2 style={shown(f,4)}>Electricity powers<br/>infrastructure.</h2><h2 className="teal" style={shown(f,23)}>Capital powers<br/>electricity.</h2><p style={shown(f,50)}>Gen-Z connects energy asset owners with global investors.</p></div>
  </Frame>;
}

export function EnergyThesis() {
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{background:'#FFFFFF'}}>
    <Sequence durationInFrames={6*FPS}><OffthreadVideo src={staticFile('intro.mp4')} muted style={{width:'100%',height:'100%'}}/></Sequence>
    <Sequence from={6*FPS} durationInFrames={11*FPS}><Scatter/></Sequence>
    <Sequence from={17*FPS} durationInFrames={10*FPS}><DataCentres/></Sequence>
    <Sequence from={27*FPS} durationInFrames={6*FPS}><SoutheastAsia/></Sequence>
    <Sequence from={33*FPS} durationInFrames={10*FPS}><Hormuz/></Sequence>
    <Sequence from={43*FPS} durationInFrames={8*FPS}><Electrification/></Sequence>
    <Sequence from={51*FPS} durationInFrames={4*FPS}><Readiness/></Sequence>
    <Sequence from={55*FPS} durationInFrames={5*FPS}><Closing/></Sequence>
    <div className="film-progress" style={{width:`${frame/1799*100}%`}}/>
  </AbsoluteFill>;
}
