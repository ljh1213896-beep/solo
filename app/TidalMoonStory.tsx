'use client';

import ProjectCursor from './ProjectCursor';
import type { ProjectDetail } from './projectDetailData';

export default function TidalMoonStory({ detail }:{ detail:ProjectDetail }) {
  const [overview, full] = detail.sections;
  return <div className="tidal-story">
    <ProjectCursor variant="book" />
    <div className="tidal-manifesto" aria-hidden="true">
      {(detail.marquee || []).map(item => <span key={item}>{item}</span>)}
    </div>

    <section className="tidal-section tidal-overview" aria-labelledby="tidal-overview-title">
      <header className="tidal-section-head">
        <span>{overview.id} / 02</span>
        <h2 id="tidal-overview-title">{overview.title}</h2>
        <p>{overview.en}</p>
      </header>
      <div className="tidal-overview-stack">
        {overview.media.map((media,index) => <figure key={`${media.image}-${index}`}>
          <img src={media.image} alt={`${overview.title} ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
          <figcaption><span>{media.caption || 'OVERVIEW'}</span>{String(index + 1).padStart(2, '0')} / {String(overview.media.length).padStart(2,'0')}</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="tidal-section tidal-full" aria-labelledby="tidal-full-title">
      <header className="tidal-section-head">
        <span>{full.id} / 02</span>
        <h2 id="tidal-full-title">{full.title}</h2>
        <p>{full.en}</p>
      </header>
      <div className="tidal-full-grid">
        {full.media.map((media, index) => <figure key={`${media.image}-${index}`}>
          <img src={media.image} alt={`${full.title} ${index + 1}`} loading="lazy" />
          <figcaption>{media.caption || `${String(index + 1).padStart(3, '0')} / ${String(full.media.length).padStart(3,'0')}`}</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
