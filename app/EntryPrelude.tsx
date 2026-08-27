'use client';

import { useEffect, useRef, useState } from 'react';

const clamp = (value:number,min=0,max=1)=>Math.min(max,Math.max(min,value));
const easeOut = (value:number)=>1-Math.pow(1-value,4);
const smooth = (value:number)=>value*value*(3-2*value);

export default function EntryPrelude(){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [finished,setFinished]=useState(false);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return;
    const context=canvas.getContext('2d',{alpha:true});
    if(!context)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    history.scrollRestoration='manual';
    window.scrollTo(0,0);
    document.documentElement.classList.add('is-entering');
    let width=innerWidth,height=innerHeight,dpr=1,frame=0,start=performance.now();

    const resize=()=>{
      width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio,width<760?1.25:1.75);
      canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);
      canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;
      context.setTransform(dpr,0,0,dpr,0,0);
    };

    const drawGrid=(progress:number,fade:number)=>{
      const cx=width*.5,cy=height*.48;
      const rings=15;
      context.save();
      context.lineWidth=.65;
      for(let ring=0;ring<rings;ring+=1){
        const delay=ring/rings*.22;
        const local=easeOut(clamp((progress-delay)/(1-delay)));
        if(local<=0)continue;
        const depth=Math.pow((ring+1)/rings,2.15);
        const halfW=(18+(width*.64)*depth)*local;
        const halfH=(10+(height*.58)*depth)*local;
        context.strokeStyle=`rgba(${ring%4===0?'218,76,150':'230,234,239'},${(.07+depth*.17)*fade})`;
        context.strokeRect(cx-halfW,cy-halfH,halfW*2,halfH*2);
      }
      const rayProgress=easeOut(clamp((progress-.16)/.84));
      const edgePoints=[
        ...Array.from({length:13},(_,i)=>({x:width*i/12,y:0})),
        ...Array.from({length:13},(_,i)=>({x:width*i/12,y:height})),
        ...Array.from({length:7},(_,i)=>({x:0,y:height*i/6})),
        ...Array.from({length:7},(_,i)=>({x:width,y:height*i/6})),
      ];
      edgePoints.forEach((point,index)=>{
        const local=clamp(rayProgress-(index%7)*.018);
        context.beginPath();context.moveTo(cx,cy);
        context.lineTo(cx+(point.x-cx)*local,cy+(point.y-cy)*local);
        context.strokeStyle=`rgba(${index%9===0?'218,76,150':'224,229,235'},${.12*fade})`;
        context.stroke();
      });
      context.restore();
    };

    const drawGlyph=(letter:string,x:number,y:number,rotation:number,progress:number,index:number)=>{
      const fromX=[-width*.16,width*.18,width*.1][index];
      const fromY=[-height*.2,height*.19,-height*.16][index];
      const arrive=easeOut(clamp(progress));
      context.save();
      context.translate(x+fromX*(1-arrive),y+fromY*(1-arrive));
      context.rotate(rotation*(1-arrive));
      context.scale(.7+arrive*.3,.7+arrive*.3);
      context.textAlign='center';context.textBaseline='middle';
      context.font=`800 ${Math.min(width*.2,height*.34)}px Arial`;
      context.lineJoin='round';context.lineWidth=Math.max(1.2,width*.0012);
      context.fillStyle='rgba(3,3,4,.96)';context.strokeStyle=`rgba(237,239,242,${.3+arrive*.62})`;
      context.shadowColor=index===1?'rgba(218,76,150,.7)':'rgba(255,255,255,.18)';context.shadowBlur=18;
      context.fillText(letter,0,0);context.strokeText(letter,0,0);
      context.lineWidth=.8;context.strokeStyle=`rgba(218,76,150,${.38+arrive*.32})`;
      context.strokeText(letter,-4+index*4,3-index*2);
      context.restore();
    };

    const draw=(now:number)=>{
      const duration=reduced?650:3450;
      const t=clamp((now-start)/duration);
      context.clearRect(0,0,width,height);
      context.fillStyle='#020203';context.fillRect(0,0,width,height);
      if(!reduced){
        const grid=smooth(clamp((t-.12)/.45));
        const fade=1-smooth(clamp((t-.77)/.18));
        drawGrid(grid,fade);
        const glyph=smooth(clamp((t-.39)/.28));
        const size=Math.min(width*.13,height*.22);
        drawGlyph('L',width*.5-size*1.15,height*.48,-.62,glyph,0);
        drawGlyph('J',width*.5,height*.48,.42,clamp(glyph-.06),1);
        drawGlyph('H',width*.5+size*1.15,height*.48,-.35,clamp(glyph-.12),2);
        const copy=smooth(clamp((t-.58)/.14))*(1-smooth(clamp((t-.79)/.1)));
        context.textAlign='center';context.fillStyle=`rgba(239,235,238,${copy})`;
        context.font=`500 ${Math.max(16,Math.min(28,width*.018))}px "Noto Sans SC",sans-serif`;
        context.fillText('萬 千 炁 象',width*.5,height*.73);
        context.font='8px monospace';context.fillStyle=`rgba(218,76,150,${copy*.92})`;
        context.fillText('SPATIAL PRACTICE / STRUCTURE IN MOTION',width*.5,height*.78);
      }
      const reveal=smooth(clamp((t-.76)/.22));
      if(reveal>0){
        context.save();context.globalCompositeOperation='destination-out';
        const revealWidth=width*(.03+reveal*1.12);
        const revealHeight=height*(.018+reveal*1.18);
        context.translate(width*.5,height*.48);
        context.beginPath();context.roundRect(-revealWidth/2,-revealHeight/2,revealWidth,revealHeight,Math.max(2,(1-reveal)*120));
        context.fillStyle=`rgba(0,0,0,${Math.min(1,reveal*1.55)})`;context.fill();context.restore();
      }
      if(t<1)frame=requestAnimationFrame(draw);
      else{document.documentElement.classList.remove('is-entering');setFinished(true);}
    };

    resize();addEventListener('resize',resize);frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);document.documentElement.classList.remove('is-entering');};
  },[]);

  if(finished)return null;
  return <div className="entry-prelude" aria-label="LJH 入站动画"><canvas ref={canvasRef}/><span className="entry-corner entry-corner-a">LJH / 2026</span><span className="entry-corner entry-corner-b">STRUCTURE / 空间</span></div>;
}
