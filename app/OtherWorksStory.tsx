'use client';

import ProjectCursor from './ProjectCursor';
import type { ProjectDetail } from './projectDetailData';

export default function OtherWorksStory({ detail }:{ detail:ProjectDetail }) {
  return <div className="other-works-story">
    <ProjectCursor variant="film" />
    <div className="other-works-marquee" aria-hidden="true">
      <div>{Array.from({ length:2 }, (_, group) => <span key={group}>{(detail.marquee || []).join(' — ')} — </span>)}</div>
    </div>
    {detail.sections.map((section, index) => <section className="other-works-section" key={section.id}>
      <p className="other-works-vertical" aria-hidden="true">{section.label}</p>
      <header className="other-works-head">
        <span>{section.id} / {String(detail.sections.length).padStart(2,'0')}</span>
        <h2>{section.title}</h2>
        <p>{section.en}</p>
      </header>
      <figure>
        <img src={section.media[0]?.image} alt={`${section.title}作品集跨页`} loading={index === 0 ? 'eager' : 'lazy'} />
        <figcaption><span>{section.media[0]?.caption || 'LJH / ARCHIVE'}</span><span>{section.en}</span><span>2022—2025</span></figcaption>
      </figure>
    </section>)}
  </div>;
}
