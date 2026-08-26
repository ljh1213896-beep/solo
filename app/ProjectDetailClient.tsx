'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import CurvedMedia from './CurvedMedia';
import SaltLakeStory from './SaltLakeStory';
import MedievalPirateStory from './MedievalPirateStory';
import DigitalNomadStory from './DigitalNomadStory';
import AutumnMarketStory from './AutumnMarketStory';
import TidalMoonStory from './TidalMoonStory';
import type { Project } from './projectData';

export default function ProjectDetailClient({ project, next }: { project: Project; next: Project }) {
  const mainRef = useRef<HTMLElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp:.075, smoothWheel:true, wheelMultiplier:.9 });
    let frame = 0;
    const animate = (time: number) => {
      lenis.raf(time);
      const root = mainRef.current;
      if (root) {
        const progress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
        root.style.setProperty('--detail-scroll', String(progress));
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, []);

  const goNext = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => { window.location.href = `/projects/${next.slug}`; }, 920);
  };

  return (
    <main ref={mainRef} className={`project-detail ${project.slug === 'salt-lake-habitat' ? 'is-salt-lake' : ''} ${project.slug === 'medieval-pirate' ? 'is-medieval' : ''} ${project.slug === 'digital-nomad' ? 'is-digital-nomad' : ''} ${project.slug === 'autumn-market' ? 'is-autumn-market' : ''} ${project.slug === 'tidal-moon-library' ? 'is-tidal-moon' : ''} ${leaving ? 'is-leaving' : ''}`}>
      <header className="project-header">
        <a href="/#work" className="project-brand">LJH<span>®</span></a>
        <span>{project.no} / 07</span>
        <span>{project.type}</span>
        <a href="/#work" className="project-close" aria-label="返回作品列表">BACK ×</a>
      </header>

      {project.slug !== 'salt-lake-habitat' && project.slug !== 'digital-nomad' && <section className="project-detail-hero">
        <div className="project-hero-backdrop" aria-hidden="true">{project.en} · {project.en} · {project.en}</div>
        {project.slug === 'salt-lake-habitat'
          ? <div className="salt-hero-plain" aria-hidden="true"><span>LANDSCAPE / ECOLOGY / 2025</span></div>
          : project.slug === 'medieval-pirate'
            ? <div className="pirate-hero-media"><img src="/projects/medieval-pirate-detail/renders/06.webp" alt="Medieval Pirate 中古店入口效果图" /></div>
            : project.slug === 'digital-nomad'
              ? <div className="nomad-hero-media"><img src={project.image} alt="数字游民社区办公空间主视觉" /></div>
              : project.slug === 'autumn-market'
                ? <div className="autumn-hero-media"><img src="/projects/autumn-market-detail/effects/01.webp" alt="秋风市集空间效果图" /></div>
                : project.slug === 'tidal-moon-library'
                  ? <div className="tidal-hero-media"><img src="/projects/tidal-moon-detail/full/025.webp" alt="汐月书庭图书馆空间效果图" /></div>
                  : <CurvedMedia image={project.image} />}
        <div className="project-hero-title">
          <p>{project.no} / {project.year}</p>
          <h1>{project.title}</h1>
          <h2>{project.en}</h2>
        </div>
        <div className="project-hero-meta"><span>{project.location}</span><span>{project.role}</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>}

      {project.slug === 'salt-lake-habitat' ? <SaltLakeStory /> : project.slug === 'medieval-pirate' ? <MedievalPirateStory /> : project.slug === 'digital-nomad' ? <DigitalNomadStory /> : project.slug === 'autumn-market' ? <AutumnMarketStory /> : project.slug === 'tidal-moon-library' ? <TidalMoonStory /> : <>
        <section className="project-overview">
          <div className="project-overview-index"><span>PROJECT OVERVIEW</span><b>[ {project.no} ]</b></div>
          <div className="project-overview-copy">
            <p className="project-lead">{project.summary}</p>
            <p>{project.concept}</p>
          </div>
          <dl>
            <div><dt>YEAR</dt><dd>{project.year}</dd></div>
            <div><dt>LOCATION</dt><dd>{project.location}</dd></div>
            <div><dt>ROLE</dt><dd>{project.role}</dd></div>
          </dl>
        </section>

        <section className="project-image-study">
          <div className="project-image-frame"><img src={project.image} alt={`${project.title} 项目主视觉`} /></div>
          <p>01 / SPATIAL FRAME</p>
        </section>

        <section className="project-concept-band">
          <p>CONCEPT / 设计概念</p>
          <h2>{project.concept}</h2>
          <div>{project.keywords.map(keyword => <span key={keyword}>{keyword}</span>)}</div>
        </section>
      </>}

      <section className="next-project">
        <div className="next-project-sticky">
          <div className="next-backdrop" aria-hidden="true">NEXT PROJECT · NEXT PROJECT · NEXT PROJECT</div>
          <CurvedMedia image={next.image} mode="next" />
          <div className="next-project-label"><span>NEXT / {next.no}</span><h2>{next.title}</h2><p>{next.en}</p></div>
          <a href={`/projects/${next.slug}`} onClick={goNext} className="next-project-link" aria-label={`进入下一个项目：${next.title}`}><span>ENTER PROJECT</span><b>↗</b></a>
        </div>
      </section>

      <div className="project-route-transition" aria-hidden="true"><img src={next.image} alt="" /><span>{next.no} / {next.title}</span></div>
    </main>
  );
}
