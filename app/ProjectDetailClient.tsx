'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import CurvedMedia from './CurvedMedia';
import SaltLakeStory from './SaltLakeStory';
import MedievalPirateStory from './MedievalPirateStory';
import DigitalNomadStory from './DigitalNomadStory';
import AutumnMarketStory from './AutumnMarketStory';
import TidalMoonStory from './TidalMoonStory';
import QixiangStory from './QixiangStory';
import OtherWorksStory from './OtherWorksStory';
import { projects, type Project } from './projectData';
import { getProjectDetail } from './projectDetailData';
import SiteMark from './SiteMark';

export default function ProjectDetailClient({ project, next }: { project: Project; next: Project }) {
  const detail = getProjectDetail(project.slug);
  const mainRef = useRef<HTMLElement>(null);
  const qixiangVideoRef = useRef<HTMLVideoElement>(null);
  const qixiangTitleRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (project.slug !== 'myriad-formless') return;
    const video = qixiangVideoRef.current;
    const title = qixiangTitleRef.current;
    if (!video || !title) return;
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 12;
    const context = canvas.getContext('2d', { willReadFrequently:true });
    if (!context) return;
    let frame = 0;
    let lastSample = 0;
    let redWeight = .5;

    const sample = (time:number) => {
      if (time - lastSample > 120 && video.readyState >= 2 && video.videoWidth > 0) {
        lastSample = time;
        const videoRect = video.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const scale = Math.max(videoRect.width / video.videoWidth, videoRect.height / video.videoHeight);
        const renderedWidth = video.videoWidth * scale;
        const renderedHeight = video.videoHeight * scale;
        const offsetX = (renderedWidth - videoRect.width) / 2;
        const offsetY = (renderedHeight - videoRect.height) / 2;
        const sourceX = Math.max(0, (titleRect.left - videoRect.left + offsetX) / scale);
        const sourceY = Math.max(0, (titleRect.top - videoRect.top + offsetY) / scale);
        const sourceWidth = Math.min(video.videoWidth - sourceX, titleRect.width / scale);
        const sourceHeight = Math.min(video.videoHeight - sourceY, titleRect.height / scale);
        if (sourceWidth > 0 && sourceHeight > 0) {
          context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let redPixels = 0;
          let lightPixels = 0;
          let luminance = 0;
          for (let index = 0; index < pixels.length; index += 4) {
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            luminance += red * .2126 + green * .7152 + blue * .0722;
            if (red > 115 && red > green * 1.3 && red > blue * 1.3) redPixels += 1;
            if (red + green + blue > 650) lightPixels += 1;
          }
          const samples = pixels.length / 4;
          const averageLuminance = luminance / samples;
          const currentWeight = redPixels / Math.max(1, redPixels + lightPixels);
          redWeight = redWeight * .72 + currentWeight * .28;
          title.classList.toggle('is-on-red', redWeight > .48 || averageLuminance < 145);
        }
      }
      frame = requestAnimationFrame(sample);
    };
    frame = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(frame);
  }, [project.slug]);

  const goNext = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => { window.location.href = `/projects/${next.slug}`; }, 920);
  };

  return (
    <main ref={mainRef} className={`project-detail ${project.slug === 'salt-lake-habitat' ? 'is-salt-lake' : ''} ${project.slug === 'medieval-pirate' ? 'is-medieval' : ''} ${project.slug === 'digital-nomad' ? 'is-digital-nomad' : ''} ${project.slug === 'autumn-market' ? 'is-autumn-market' : ''} ${project.slug === 'tidal-moon-library' ? 'is-tidal-moon' : ''} ${project.slug === 'myriad-formless' ? 'is-qixiang' : ''} ${project.slug === 'experiments' ? 'is-other-works' : ''} ${leaving ? 'is-leaving' : ''}`}>
      <header className="project-header">
        <a href="/#work" className="project-brand" aria-label="返回作品列表"><SiteMark /></a>
        <details className="project-switcher">
          <summary aria-label="切换作品"><span>{project.no} / 07</span><b>{project.title}</b><i>＋</i></summary>
          <nav aria-label="作品快速切换">
            {projects.map(item => <a href={`/projects/${item.slug}`} className={item.slug === project.slug ? 'is-current' : ''} aria-current={item.slug === project.slug ? 'page' : undefined} key={item.slug}>
              <span>{item.no}</span><span><b>{item.title}</b><small>{item.fullTitle}</small></span><i>↗</i>
            </a>)}
          </nav>
        </details>
        <span>{project.type}</span>
        <a href="/#work" className="project-close" aria-label="返回作品列表">BACK ×</a>
      </header>

      {project.slug !== 'salt-lake-habitat' && project.slug !== 'digital-nomad' && <section className="project-detail-hero">
        <div className="project-hero-backdrop" aria-hidden="true">{project.en} · {project.en} · {project.en}</div>
        {project.slug === 'salt-lake-habitat'
          ? <div className="salt-hero-plain" aria-hidden="true"><span>LANDSCAPE / ECOLOGY / 2025</span></div>
          : project.slug === 'medieval-pirate'
            ? <div className="pirate-hero-media"><img src={detail.hero.image} alt={detail.hero.alt} /></div>
            : project.slug === 'digital-nomad'
              ? <div className="nomad-hero-media"><img src={project.image} alt="数字游民社区办公空间主视觉" /></div>
              : project.slug === 'autumn-market'
                ? <div className="autumn-hero-media"><img src={detail.hero.image} alt={detail.hero.alt} /></div>
                : project.slug === 'tidal-moon-library'
                  ? <div className="tidal-hero-media"><img src={detail.hero.image} alt={detail.hero.alt} /></div>
                  : project.slug === 'myriad-formless'
                    ? <div className="qixiang-hero-media"><video ref={qixiangVideoRef} src={detail.hero.video} poster={detail.hero.poster} autoPlay muted loop playsInline /></div>
                    : project.slug === 'experiments'
                      ? <div className="other-works-hero-media"><video src={detail.hero.video} poster={detail.hero.poster} autoPlay muted loop playsInline /></div>
                  : <CurvedMedia image={project.image} />}
        <div ref={project.slug === 'myriad-formless' ? qixiangTitleRef : undefined} className="project-hero-title">
          <p>{project.no} / {project.year}</p>
          <h1>{project.title}</h1>
          <h2>{project.en}</h2>
        </div>
        <div className="project-hero-meta"><span>{project.location}</span><span>{project.role}</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>}

      {project.slug === 'salt-lake-habitat' ? <SaltLakeStory detail={detail} /> : project.slug === 'medieval-pirate' ? <MedievalPirateStory detail={detail} /> : project.slug === 'digital-nomad' ? <DigitalNomadStory detail={detail} /> : project.slug === 'autumn-market' ? <AutumnMarketStory detail={detail} /> : project.slug === 'tidal-moon-library' ? <TidalMoonStory detail={detail} /> : project.slug === 'myriad-formless' ? <QixiangStory detail={detail} /> : project.slug === 'experiments' ? <OtherWorksStory detail={detail} /> : <>
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
          <a href={`/projects/${next.slug}`} onClick={goNext} className="next-project-link" aria-label={`进入下一个项目：${next.fullTitle}`}><span>ENTER PROJECT</span><b>↗</b></a>
        </div>
      </section>

      <div className="project-route-transition" aria-hidden="true"><img src={next.image} alt="" /><span>{next.no} / {next.title}</span></div>
    </main>
  );
}
