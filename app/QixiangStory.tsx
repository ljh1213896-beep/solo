'use client';

import ProjectCursor from './ProjectCursor';

const systemRoot = '/projects/qixiang-detail/system';
const systemPages = Array.from({ length:26 }, (_, index) => `${systemRoot}/${String(index + 1).padStart(3, '0')}.webp?v=2`);
const pairedPages = new Set([7, 8, 10, 11, 18, 19, 23, 24, 25, 26]);

export default function QixiangStory() {
  return <div className="qixiang-story">
    <ProjectCursor variant="typhoon" />
    <div className="qixiang-geometry" aria-hidden="true"><i /><i /><i /><span /></div>

    <section className="qixiang-section qixiang-video" aria-labelledby="qixiang-video-title">
      <header className="qixiang-section-head">
        <span>01 / 02</span>
        <h2 id="qixiang-video-title">展示视频</h2>
        <p>BRAND MOTION / 01:35</p>
      </header>
      <div className="qixiang-video-frame">
        <video src="/projects/qixiang-detail/showcase.mp4?v=2" controls playsInline preload="metadata" />
        <span aria-hidden="true">QIXIANG / MOTION SYSTEM</span>
      </div>
    </section>

    <section className="qixiang-section qixiang-system" aria-labelledby="qixiang-system-title">
      <header className="qixiang-section-head">
        <span>02 / 02</span>
        <h2 id="qixiang-system-title">炁象视觉形象系统</h2>
        <p>VISUAL IDENTITY / 26 PAGES</p>
      </header>
      <div className="qixiang-system-grid">
        {systemPages.map((src, index) => <figure className={pairedPages.has(index + 1) ? 'is-paired' : ''} key={src}>
          <img src={src} alt={`炁象视觉形象系统 ${index + 1}`} loading={index < 2 ? 'eager' : 'lazy'} />
          <figcaption><span>QX / SYSTEM</span>{String(index + 1).padStart(2, '0')} / 26</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
