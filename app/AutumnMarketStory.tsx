'use client';

import ProjectCursor from './ProjectCursor';

const assetRoot = '/projects/autumn-market-detail';

export default function AutumnMarketStory() {
  return <div className="autumn-story">
    <ProjectCursor variant="leaf" />

    <section className="autumn-section autumn-effects" aria-labelledby="autumn-effects-title">
      <header className="autumn-section-head">
        <span>01 / 02</span>
        <h2 id="autumn-effects-title">效果展示</h2>
        <p>MARKET IN MOTION</p>
      </header>
      <div className="autumn-effects-grid">
        {[1, 2, 3].map((index) => <figure key={index}>
          <img src={`${assetRoot}/effects/0${index}.webp`} alt={`秋风市集效果展示 ${index}`} loading={index === 1 ? 'eager' : 'lazy'} />
          <figcaption><span>VIEW</span>{String(index).padStart(2, '0')} / 03</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="autumn-section autumn-overview" aria-labelledby="autumn-overview-title">
      <header className="autumn-section-head">
        <span>02 / 02</span>
        <h2 id="autumn-overview-title">项目概况</h2>
        <p>PROJECT OVERVIEW</p>
      </header>
      <div className="autumn-overview-stack">
        {[1, 2, 3, 4].map((index) => <figure key={index}>
          <img src={`${assetRoot}/overview/0${index}.webp`} alt={`秋风市集项目概况 ${index}`} loading="lazy" />
          <figcaption><span>BOARD</span>{String(index).padStart(2, '0')} / 04</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
