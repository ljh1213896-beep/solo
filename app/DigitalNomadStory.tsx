'use client';

import ProjectCursor from './ProjectCursor';
import type { ProjectDetail } from './projectDetailData';

export default function DigitalNomadStory({ detail }:{ detail:ProjectDetail }) {
  const [effects, overview] = detail.sections;
  return <div className="nomad-story">
    <ProjectCursor variant="coffee" />
    <section className="nomad-section nomad-effects" aria-labelledby="nomad-effects-title">
      <header className="nomad-section-head">
        <span>{effects.id} / 02</span>
        <h2 id="nomad-effects-title">{effects.title}</h2>
        <p>{effects.en}</p>
      </header>
      <div className="nomad-effects-stack">
        {effects.media.map((media,index) => <figure className="nomad-full-board" key={`${media.image}-${index}`}>
          <img src={media.image} alt={`${effects.title} ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
          <figcaption>{media.caption || `${String(index + 1).padStart(2, '0')} / ${String(effects.media.length).padStart(2,'0')}`}</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="nomad-section nomad-overview" aria-labelledby="nomad-overview-title">
      <header className="nomad-section-head">
        <span>{overview.id} / 02</span>
        <h2 id="nomad-overview-title">{overview.title}</h2>
        <p>{overview.en}</p>
      </header>
      <div className="nomad-overview-stack">
        {overview.media.map((media,index) => <figure key={`${media.image}-${index}`}>
          <img src={media.image} alt={`${overview.title} ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
          <figcaption>{media.caption || `${String(index + 1).padStart(2, '0')} / ${String(overview.media.length).padStart(2,'0')}`}</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
