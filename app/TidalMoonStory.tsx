'use client';

import ProjectCursor from './ProjectCursor';

const assetRoot = '/projects/tidal-moon-detail';
const fullPages = Array.from({ length:108 }, (_, index) => `${assetRoot}/full/${String(index + 1).padStart(3, '0')}.webp`);

export default function TidalMoonStory() {
  return <div className="tidal-story">
    <ProjectCursor variant="book" />
    <div className="tidal-manifesto" aria-hidden="true">
      <span>READ</span><span>PAUSE</span><span>GATHER</span><span>REPEAT</span>
    </div>

    <section className="tidal-section tidal-overview" aria-labelledby="tidal-overview-title">
      <header className="tidal-section-head">
        <span>01 / 02</span>
        <h2 id="tidal-overview-title">项目概况</h2>
        <p>PROJECT OVERVIEW</p>
      </header>
      <div className="tidal-overview-stack">
        {[1, 2, 3].map((index) => <figure key={index}>
          <img src={`${assetRoot}/overview/${String(index).padStart(3, '0')}.webp`} alt={`汐月书庭项目概况 ${index}`} loading={index === 1 ? 'eager' : 'lazy'} />
          <figcaption><span>OVERVIEW</span>{String(index).padStart(2, '0')} / 03</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="tidal-section tidal-full" aria-labelledby="tidal-full-title">
      <header className="tidal-section-head">
        <span>02 / 02</span>
        <h2 id="tidal-full-title">项目全览</h2>
        <p>COMPLETE PROJECT INDEX</p>
      </header>
      <div className="tidal-full-grid">
        {fullPages.map((src, index) => <figure key={src}>
          <img src={src} alt={`汐月书庭项目全览 ${index + 1}`} loading="lazy" />
          <figcaption>{String(index + 1).padStart(3, '0')} / 108</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
