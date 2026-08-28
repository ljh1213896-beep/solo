'use client';

import ProjectCursor from './ProjectCursor';
import type { ProjectDetail } from './projectDetailData';

export default function AutumnMarketStory({ detail }:{ detail:ProjectDetail }) {
  const [effects, overview] = detail.sections;
  return <div className="autumn-story">
    <ProjectCursor variant="leaf" />

    <section className="autumn-section autumn-effects" aria-labelledby="autumn-effects-title">
      <header className="autumn-section-head">
        <span>{effects.id} / 02</span>
        <h2 id="autumn-effects-title">{effects.title}</h2>
        <p>{effects.en}</p>
      </header>
      <div className="autumn-effects-grid">
        {effects.media.map((media,index) => <figure key={`${media.image}-${index}`}>
          <img src={media.image} alt={`${effects.title} ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
          <figcaption><span>VIEW</span>{media.caption || `${String(index + 1).padStart(2, '0')} / ${String(effects.media.length).padStart(2,'0')}`}</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="autumn-section autumn-overview" aria-labelledby="autumn-overview-title">
      <header className="autumn-section-head">
        <span>{overview.id} / 02</span>
        <h2 id="autumn-overview-title">{overview.title}</h2>
        <p>{overview.en}</p>
      </header>
      <div className="autumn-overview-stack">
        {overview.media.map((media,index) => <figure key={`${media.image}-${index}`}>
          <img src={media.image} alt={`${overview.title} ${index + 1}`} loading="lazy" />
          <figcaption><span>BOARD</span>{media.caption || `${String(index + 1).padStart(2, '0')} / ${String(overview.media.length).padStart(2,'0')}`}</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
