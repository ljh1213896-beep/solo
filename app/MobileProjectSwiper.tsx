'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from './projectData';

export default function MobileProjectSwiper({ projects }: { projects: Project[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const redirectTimer = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    const contact = contactRef.current;
    if (!rail || !contact) return;

    const slides = Array.from(rail.querySelectorAll<HTMLElement>('[data-mobile-slide]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number((entry.target as HTMLElement).dataset.mobileSlide ?? 0);
        if (entry.intersectionRatio >= .58) setActive(index);
        if (entry.target !== contact || entry.intersectionRatio < .86) return;

        setEntering(true);
        if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        redirectTimer.current = window.setTimeout(() => window.location.assign('/contact'), reducedMotion ? 240 : 1250);
      });
    }, { root: rail, threshold: [.25, .58, .86] });

    slides.forEach(slide => observer.observe(slide));
    return () => {
      observer.disconnect();
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    };
  }, []);

  const total = projects.length + 1;

  return (
    <div className="mobile-project-gallery" aria-label="左右滑动切换作品">
      <div className="mobile-gallery-head">
        <span>PROJECT ARCHIVE</span>
        <span>{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
      <div className="mobile-project-rail" ref={railRef}>
        {projects.map((project, index) => (
          <article className="mobile-project-slide" data-mobile-slide={index} key={project.slug}>
            <a href={`/projects/${project.slug}`} aria-label={`查看 ${project.fullTitle}`}>
              <img src={project.image} alt={project.fullTitle} loading={index < 2 ? 'eager' : 'lazy'} />
              <span className="mobile-project-shade" aria-hidden="true" />
              <div className="mobile-project-copy">
                <span>{project.no} / {project.year}</span>
                <h2>{project.title}</h2>
                <p>{project.en}</p>
              </div>
              <i aria-hidden="true">↗</i>
            </a>
          </article>
        ))}
        <article className={`mobile-contact-slide ${entering ? 'is-entering' : ''}`} data-mobile-slide={projects.length} ref={contactRef}>
          <a href="/contact" aria-label="进入联系页面">
            <div className="mobile-contact-orbit" aria-hidden="true"><i /><i /><i /></div>
            <span>08 / CONTACT</span>
            <h2>LET'S<br />CONNECT</h2>
            <p>滑动完成 · 正在进入联系页</p>
            <b aria-hidden="true">→</b>
          </a>
        </article>
      </div>
      <div className="mobile-gallery-foot">
        <span>SWIPE →</span>
        <i><b style={{ transform: `scaleX(${(active + 1) / total})` }} /></i>
        <span>CONTACT →</span>
      </div>
    </div>
  );
}
