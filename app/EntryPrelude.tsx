'use client';

import { useEffect, useRef, useState } from 'react';

const clamp = (value:number,min=0,max=1)=>Math.min(max,Math.max(min,value));
const ease = (value:number)=>value*value*(3-2*value);

type Particle={sx:number;sy:number;tx:number;ty:number;vx:number;vy:number;size:number;seed:number;rose:boolean};

export default function EntryPrelude(){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [finished,setFinished]=useState(false);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const context=canvas.getContext('2d',{alpha:true});
    if(!context)return;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    history.scrollRestoration='manual';
    window.scrollTo(0,0);
    document.documentElement.classList.add('is-entering');
    const pixelRatio=()=>Math.min(devicePixelRatio,innerWidth<760?1.25:1.75);
    let width=innerWidth,height=innerHeight,dpr=pixelRatio(),frame=0,start=performance.now();
    let particles:Particle[]=[];

    const buildParticles=()=>{
      const sample=document.createElement('canvas');
      const sw=Math.min(1040,Math.max(620,width*.72));
      const sh=Math.min(360,Math.max(220,height*.34));
      sample.width=Math.floor(sw); sample.height=Math.floor(sh);
      const sampleContext=sample.getContext('2d');
      if(!sampleContext)return;
      sampleContext.fillStyle='#fff';
      sampleContext.textAlign='center';
      sampleContext.textBaseline='middle';
      sampleContext.font=`900 ${Math.floor(sh*.72)}px Arial`;
      sampleContext.fillText('LJH',sw/2,sh/2);
      const pixels=sampleContext.getImageData(0,0,sample.width,sample.height).data;
      const step=Math.max(5,Math.floor(sw/150));
      const points:{x:number;y:number}[]=[];
      for(let y=0;y<sample.height;y+=step){
        for(let x=0;x<sample.width;x+=step){
          if(pixels[(y*sample.width+x)*4+3]>100)points.push({x:x+width/2-sw/2,y:y+height/2-sh/2});
        }
      }
      const particleLimit=width<760?760:1350;
      const stride=Math.max(1,Math.ceil(points.length/particleLimit));
      particles=points.filter((_,index)=>index%stride===0).map((point,index)=>{
        const seed=(Math.sin(index*91.731)*43758.5453)%1;
        const edge=index%4;
        const lane=((index*37)%100)/100;
        const sx=edge===0?width*.08+lane*width*.84:edge===1?width*.92:edge===2?width*.08+lane*width*.84:width*.08;
        const sy=edge===0?height*.13:edge===1?height*.13+lane*height*.74:edge===2?height*.87:height*.13+lane*height*.74;
        const angle=Math.atan2(point.y-height/2,point.x-width/2)+(index%7-3)*.055;
        return {sx,sy,tx:point.x,ty:point.y,vx:Math.cos(angle)*(width*.72+Math.abs(seed)*180),vy:Math.sin(angle)*(height*.68+Math.abs(seed)*140),size:.65+(index%5)*.26,seed:Math.abs(seed),rose:index%5<2};
      });
    };
    const resize=()=>{
      width=innerWidth;height=innerHeight;dpr=pixelRatio();
      canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);
      canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;
      context.setTransform(dpr,0,0,dpr,0,0);
      buildParticles();
    };
    const line=(ax:number,ay:number,bx:number,by:number,progress:number,alpha:number)=>{
      context.beginPath();context.moveTo(ax,ay);context.lineTo(ax+(bx-ax)*progress,ay+(by-ay)*progress);
      context.strokeStyle=`rgba(224,82,156,${alpha})`;context.stroke();
    };
    const draw=(now:number)=>{
      const duration=reduce?700:4300;
      const t=clamp((now-start)/duration);
      context.clearRect(0,0,width,height);
      const reveal=ease(clamp((t-.84)/.16));
      context.fillStyle=`rgba(2,2,3,${1-reveal})`;
      context.fillRect(0,0,width,height);

      if(!reduce){
        const structure=ease(clamp(t/.24));
        const structureFade=1-ease(clamp((t-.32)/.28));
        context.lineWidth=.7;
        const left=width*.075,right=width*.925,top=height*.12,bottom=height*.88,cx=width*.5,cy=height*.5;
        line(left,top,right,top,structure,.72*structureFade);line(right,top,right,bottom,structure,.55*structureFade);
        line(right,bottom,left,bottom,structure,.72*structureFade);line(left,bottom,left,top,structure,.55*structureFade);
        [left,right].forEach(x=>{line(x,top,cx,cy,structure,.38*structureFade);line(x,bottom,cx,cy,structure,.38*structureFade);});
        for(let i=1;i<7;i++){
          const y=top+(bottom-top)*i/7;
          line(left,y,right,y,clamp(structure-i*.045),.22*structureFade);
        }
        for(let i=1;i<11;i++){
          const x=left+(right-left)*i/11;
          line(x,top,cx+(x-cx)*.16,cy,clamp(structure-i*.025),.18*structureFade);
          line(cx+(x-cx)*.16,cy,x,bottom,clamp(structure-i*.025),.18*structureFade);
        }

        const gather=ease(clamp((t-.2)/.34));
        const scatter=ease(clamp((t-.62)/.25));
        const particleAlpha=(ease(clamp((t-.16)/.1)))*(1-ease(clamp((t-.84)/.12)));
        particles.forEach((particle,index)=>{
          const delay=(index%19)/19*.08;
          const localGather=ease(clamp((t-.2-delay)/.31));
          const x=particle.sx+(particle.tx-particle.sx)*localGather+particle.vx*scatter;
          const y=particle.sy+(particle.ty-particle.sy)*localGather+particle.vy*scatter+Math.sin(t*22+particle.seed*8)*scatter*18;
          const pulse=.7+Math.sin(now*.004+particle.seed*9)*.3;
          context.fillStyle=particle.rose?`rgba(226,73,151,${particleAlpha*pulse})`:`rgba(235,232,235,${particleAlpha*(.55+pulse*.35)})`;
          context.fillRect(x,y,particle.size*(1+scatter*1.8),particle.size*(1+scatter*1.8));
        });
        if(gather>.74&&scatter<.5){
          context.textAlign='center';context.font='9px monospace';context.letterSpacing='3px';
          context.fillStyle=`rgba(235,232,235,${clamp((gather-.74)*3.8)*(1-scatter*2)})`;
          context.fillText('SPATIAL PRACTICE / CHINA',width/2,height*.72);
        }
      }

      if(t<.91){
        context.textAlign='left';context.font='8px monospace';context.fillStyle=`rgba(211,205,211,${(1-reveal)*.7})`;
        context.fillText(t<.22?'STRUCTURE / 结构':t<.62?'MATTER / 粒子':'REVEAL / 显现',width*.075,height*.94);
        context.textAlign='right';context.fillText(`${String(Math.round(t*100)).padStart(3,'0')}%`,width*.925,height*.94);
      }
      if(t<1)frame=requestAnimationFrame(draw);
      else{document.documentElement.classList.remove('is-entering');setFinished(true);}
    };
    resize();addEventListener('resize',resize);frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);document.documentElement.classList.remove('is-entering');};
  },[]);

  if(finished)return null;
  return <div className="entry-prelude" aria-label="LJH 入站动画"><canvas ref={canvasRef}/><div className="entry-reveal-line"/></div>;
}
