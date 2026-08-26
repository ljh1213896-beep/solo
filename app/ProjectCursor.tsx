'use client';

import { useEffect, useRef } from 'react';

type Particle = { x:number; y:number; vx:number; vy:number; life:number; size:number; rotation:number; char?:string };

type CursorVariant = 'flamingo' | 'anchor' | 'coffee' | 'leaf' | 'book' | 'typhoon';

const bookCharacters = ['阅', '读', '字', '句', 'A', 'B', 'C', '·'];

export default function ProjectCursor({ variant }:{ variant:CursorVariant }) {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas || window.matchMedia('(pointer: coarse)').matches) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let particles: Particle[] = [];
    let lastX = -100;
    let lastY = -100;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      cursor.style.opacity = '1';
      if (reduceMotion) return;
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (distance < 7) return;
      lastX = event.clientX;
      lastY = event.clientY;
      const count = variant === 'flamingo'
        ? Math.min(3, 1 + Math.floor(distance / 34))
        : variant === 'coffee'
          ? Math.min(2, 1 + Math.floor(distance / 42))
          : variant === 'book'
            ? Math.min(2, 1 + Math.floor(distance / 38))
            : variant === 'typhoon'
              ? Math.min(3, 1 + Math.floor(distance / 28))
          : Math.min(4, 1 + Math.floor(distance / 24));
      for (let index = 0; index < count; index += 1) particles.push({
        x:event.clientX + (Math.random() - .5) * 9,
        y:event.clientY + (Math.random() - .5) * 9,
        vx:(Math.random() - .5) * .5,
        vy:-.12 - Math.random() * .38,
        life:1,
        size:variant === 'book' ? 8 + Math.random() * 4 : variant === 'typhoon' ? .8 + Math.random() * 1.4 : variant === 'flamingo' ? 1.8 + Math.random() * 1.5 : variant === 'leaf' ? 1.5 + Math.random() * 2.2 : .55 + Math.random() * 1.25,
        rotation:Math.random() * Math.PI,
        char:variant === 'book' ? bookCharacters[Math.floor(Math.random() * bookCharacters.length)] : undefined,
      });
      if (particles.length > 100) particles = particles.slice(-100);
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles = particles.filter(particle => particle.life > .025);
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += .018;
        particle.life *= variant === 'coffee' ? .965 : variant === 'book' ? .958 : variant === 'typhoon' ? .952 : variant === 'flamingo' ? .954 : .947;
        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        if (variant === 'flamingo') {
          context.beginPath();
          context.fillStyle = `rgba(255, 91, 164, ${particle.life * .72})`;
          context.shadowColor = 'rgba(255, 75, 155, .8)';
          context.shadowBlur = 6;
          context.ellipse(0, 0, particle.size * 1.9, particle.size * .62, 0, 0, Math.PI * 2);
          context.fill();
          context.beginPath();
          context.strokeStyle = `rgba(255, 205, 225, ${particle.life * .7})`;
          context.lineWidth = .55;
          context.moveTo(-particle.size * 1.8, 0);
          context.lineTo(particle.size * 1.9, 0);
          context.stroke();
        } else if (variant === 'anchor') {
          context.beginPath();
          context.fillStyle = `rgba(244, 196, 86, ${particle.life * .78})`;
          context.shadowColor = 'rgba(238, 176, 55, .82)';
          context.shadowBlur = 7;
          context.arc(0, 0, particle.size, 0, Math.PI * 2);
          context.fill();
        } else if (variant === 'coffee') {
          context.beginPath();
          context.strokeStyle = `rgba(242, 235, 220, ${particle.life * .7})`;
          context.lineWidth = 1.1;
          context.lineCap = 'round';
          context.shadowColor = 'rgba(255, 247, 229, .5)';
          context.shadowBlur = 5;
          context.moveTo(0, particle.size * 4);
          context.bezierCurveTo(-3, particle.size, 4, -particle.size * 2, 0, -particle.size * 5);
          context.stroke();
        } else if (variant === 'typhoon') {
          context.beginPath();
          context.strokeStyle = `rgba(191, 55, 55, ${particle.life * .78})`;
          context.lineWidth = particle.size;
          context.lineCap = 'round';
          context.shadowColor = 'rgba(181, 45, 45, .4)';
          context.shadowBlur = 4;
          context.moveTo(-8, 1);
          context.bezierCurveTo(-3, -4, 3, 5, 10, -1);
          context.stroke();
          context.beginPath();
          context.strokeStyle = `rgba(218, 103, 96, ${particle.life * .5})`;
          context.lineWidth = Math.max(.45, particle.size * .55);
          context.moveTo(-5, 4);
          context.bezierCurveTo(0, 0, 4, 6, 8, 3);
          context.stroke();
        } else if (variant === 'book') {
          context.fillStyle = `rgba(236, 236, 232, ${particle.life * .72})`;
          context.shadowColor = 'rgba(255, 255, 255, .24)';
          context.shadowBlur = 3;
          context.font = `300 ${particle.size}px "Helvetica Neue", "Noto Sans SC", sans-serif`;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(particle.char || '字', 0, 0);
        } else {
          context.beginPath();
          context.fillStyle = `rgba(190, 74, 43, ${particle.life * .78})`;
          context.shadowColor = 'rgba(139, 61, 35, .55)';
          context.shadowBlur = 4;
          context.ellipse(0, 0, particle.size * 1.8, particle.size, .55, 0, Math.PI * 2);
          context.fill();
          context.beginPath();
          context.strokeStyle = `rgba(255, 197, 143, ${particle.life * .58})`;
          context.lineWidth = .55;
          context.moveTo(-particle.size * 1.4, -particle.size * .7);
          context.lineTo(particle.size * 1.4, particle.size * .7);
          context.stroke();
        }
        context.restore();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive:true });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, [variant]);

  return <>
    <canvas ref={canvasRef} className={`project-cursor-trail is-${variant}`} aria-hidden="true" />
    <span ref={cursorRef} className={`project-cursor-icon is-${variant}`} aria-hidden="true">
      {variant === 'flamingo' ? '🦩' : variant === 'anchor' ? '⚓' : variant === 'coffee' ? '☕' : variant === 'leaf' ? '🍁' : variant === 'book' ? <><i /><b /></> : <><i /><b /><em /></>}
    </span>
  </>;
}
