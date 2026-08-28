'use client';

import ProjectCursor from './ProjectCursor';
import type { ProjectDetail } from './projectDetailData';

export default function MedievalPirateStory({ detail }:{ detail:ProjectDetail }) {
  const [overview, renders] = detail.sections;
  return <div className="pirate-story">
    <ProjectCursor variant="anchor" />

    <section className="pirate-overview" aria-labelledby="pirate-overview-title">
      <header className="pirate-section-head">
        <span>{overview.id} / 02</span>
        <h2 id="pirate-overview-title">{overview.title}</h2>
        <p>{overview.en}</p>
      </header>
      <div className="pirate-statement">
        <p>{overview.text}</p>
        <dl>
          {(overview.meta || []).map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
        </dl>
      </div>
      <div className="pirate-overview-grid">
        {overview.media.map((media, index) => <figure key={`${media.image}-${index}`}>
          <img src={media.image} alt={`${overview.title} ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
          <figcaption>{media.caption || `${String(index + 1).padStart(2, '0')} / ${String(overview.media.length).padStart(2,'0')}`}</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="pirate-renders" aria-labelledby="pirate-renders-title">
      <header className="pirate-section-head">
        <span>{renders.id} / 02</span>
        <h2 id="pirate-renders-title">{renders.title}</h2>
        <p>{renders.en}</p>
      </header>
      <div className="pirate-render-grid">
        {renders.media.map((media, index) => <figure key={`${media.image}-${index}`} className={`pirate-render-${index + 1}`}>
          <div><img src={media.image} alt={`${renders.title} ${index + 1}`} loading="lazy" /></div>
          <figcaption><span>FRAME</span>{media.caption || `${String(index + 1).padStart(2, '0')} / ${String(renders.media.length).padStart(2,'0')}`}</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
