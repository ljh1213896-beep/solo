'use client';

import { useEffect, useRef } from 'react';

type Particle = { x:number; y:number; vx:number; vy:number; life:number; size:number; rotation:number };

type CursorVariant = 'flamingo' | 'anchor' | 'coffee' | 'leaf';

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
          : Math.min(4, 1 + Math.floor(distance / 24));
      for (let index = 0; index < count; index += 1) particles.push({
        x:event.clientX + (Math.random() - .5) * 9,
        y:event.clientY + (Math.random() - .5) * 9,
        vx:(Math.random() - .5) * .5,
        vy:-.12 - Math.random() * .38,
        life:1,
        size:variant === 'flamingo' ? 1.8 + Math.random() * 1.5 : variant === 'leaf' ? 1.5 + Math.random() * 2.2 : .55 + Math.random() * 1.25,
        rotation:Math.random() * Math.PI,
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
        particle.life *= variant === 'coffee' ? .965 : variant === 'flamingo' ? .954 : .947;
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
      {variant === 'flamingo' ? '🦩' : variant === 'anchor' ? '⚓' : variant === 'coffee' ? '☕' : '🍁'}
    </span>
  </>;
}
