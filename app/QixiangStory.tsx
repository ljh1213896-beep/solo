'use client';

import ProjectCursor from './ProjectCursor';
import type { ProjectDetail } from './projectDetailData';

export default function QixiangStory({ detail }:{ detail:ProjectDetail }) {
  const [motion, system] = detail.sections;
  return <div className="qixiang-story">
    <ProjectCursor variant="typhoon" />
    <div className="qixiang-geometry" aria-hidden="true"><i /><i /><i /><span /></div>

    <section className="qixiang-section qixiang-video" aria-labelledby="qixiang-video-title">
      <header className="qixiang-section-head">
        <span>{motion.id} / 02</span>
        <h2 id="qixiang-video-title">{motion.title}</h2>
        <p>{motion.en}</p>
      </header>
      <div className="qixiang-video-frame">
        <video src={motion.video} controls playsInline preload="metadata" />
        <span aria-hidden="true">{motion.text}</span>
      </div>
    </section>

    <section className="qixiang-section qixiang-system" aria-labelledby="qixiang-system-title">
      <header className="qixiang-section-head">
        <span>{system.id} / 02</span>
        <h2 id="qixiang-system-title">{system.title}</h2>
        <p>{system.en}</p>
      </header>
      <div className="qixiang-system-grid">
        {system.media.map((media, index) => <figure className={media.paired ? 'is-paired' : ''} key={`${media.image}-${index}`}>
          <img src={media.image} alt={`${system.title} ${index + 1}`} loading={index < 2 ? 'eager' : 'lazy'} />
          <figcaption><span>QX / SYSTEM</span>{media.caption || `${String(index + 1).padStart(2, '0')} / ${String(system.media.length).padStart(2,'0')}`}</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
