'use client';

import { useEffect, useRef } from 'react';

type TrailPoint={x:number;y:number;life:number};

export default function HomeSwipeTrail(){
  const canvasRef=useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas||!matchMedia('(pointer: coarse)').matches)return;
    const context=canvas.getContext('2d');
    if(!context)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width=innerWidth,height=innerHeight,frame=0,active=false,points:TrailPoint[]=[];

    const resize=()=>{
      const ratio=Math.min(devicePixelRatio||1,2);
      width=innerWidth;height=innerHeight;
      canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
      canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;
      context.setTransform(ratio,0,0,ratio,0,0);
    };
    const down=(event:TouchEvent)=>{
      const touch=event.touches[0];if(!touch)return;
      active=true;points=[{x:touch.clientX,y:touch.clientY,life:1}];
      document.documentElement.classList.add('is-touching-home');
      document.documentElement.style.setProperty('--mx',`${touch.clientX}px`);
      document.documentElement.style.setProperty('--my',`${touch.clientY}px`);
    };
    const move=(event:TouchEvent)=>{
      const touch=event.touches[0];if(!active||!touch)return;
      const previous=points[points.length-1];
      if(previous&&Math.hypot(touch.clientX-previous.x,touch.clientY-previous.y)<4)return;
      document.documentElement.style.setProperty('--mx',`${touch.clientX}px`);document.documentElement.style.setProperty('--my',`${touch.clientY}px`);
      points.push({x:touch.clientX,y:touch.clientY,life:1});
      if(points.length>90)points=points.slice(-90);
    };
    const up=()=>{active=false;document.documentElement.classList.remove('is-touching-home');};
    const draw=()=>{
      context.clearRect(0,0,width,height);
      if(!reduced&&points.length>1){
        context.save();context.globalCompositeOperation='lighter';context.lineCap='round';context.lineJoin='round';
        for(let index=1;index<points.length;index+=1){
          const previous=points[index-1],point=points[index];
          const alpha=Math.min(previous.life,point.life);
          context.beginPath();context.moveTo(previous.x,previous.y);context.lineTo(point.x,point.y);
          context.strokeStyle=`rgba(216,76,150,${alpha*.42})`;context.lineWidth=1+alpha*2;context.stroke();
          if(index%6===0){context.beginPath();context.fillStyle=`rgba(49,137,216,${alpha*.9})`;context.shadowColor='#3189d8';context.shadowBlur=8;context.arc(point.x,point.y,1.4+alpha,0,Math.PI*2);context.fill();}
        }
        context.restore();
      }
      points=points.map(point=>({...point,life:point.life*(active ? .965 : .91)})).filter(point=>point.life>.025);
      frame=requestAnimationFrame(draw);
    };
    resize();addEventListener('resize',resize);addEventListener('touchstart',down,{passive:true});addEventListener('touchmove',move,{passive:true});addEventListener('touchend',up,{passive:true});addEventListener('touchcancel',up,{passive:true});frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('touchstart',down);removeEventListener('touchmove',move);removeEventListener('touchend',up);removeEventListener('touchcancel',up);document.documentElement.classList.remove('is-touching-home');};
  },[]);

  return <canvas ref={canvasRef} className="home-swipe-trail" aria-hidden="true"/>;
}
