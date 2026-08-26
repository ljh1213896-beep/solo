'use client';

import { useEffect, useRef } from 'react';

type Speck = { x:number; y:number; vx:number; vy:number; life:number; size:number };

export default function GoldDustTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let particles: Speck[] = [];
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
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (distance < 6) return;
      lastX = event.clientX;
      lastY = event.clientY;
      const amount = Math.min(4, 1 + Math.floor(distance / 24));
      for (let index = 0; index < amount; index += 1) {
        particles.push({
          x:event.clientX + (Math.random() - .5) * 10,
          y:event.clientY + (Math.random() - .5) * 10,
          vx:(Math.random() - .5) * .42,
          vy:-.12 - Math.random() * .42,
          life:1,
          size:.55 + Math.random() * 1.35,
        });
      }
      if (particles.length > 110) particles = particles.slice(-110);
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles = particles.filter(particle => particle.life > .025);
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life *= .947;
        context.beginPath();
        context.fillStyle = `rgba(244, 196, 86, ${particle.life * .78})`;
        context.shadowColor = 'rgba(238, 176, 55, .82)';
        context.shadowBlur = 7;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
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
  }, []);

  return <canvas ref={canvasRef} className="gold-dust-trail" aria-hidden="true" />;
}
