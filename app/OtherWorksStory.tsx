'use client';

import ProjectCursor from './ProjectCursor';

const sections = [
  { no:'01', title:'其他作品', en:'SELECTED WORKS', image:'/projects/other-works-detail/pages/01.webp', label:'INTRODUCTION' },
  { no:'02', title:'渲染与摄影', en:'RENDERING / PHOTOGRAPHY', image:'/projects/other-works-detail/pages/02.webp', label:'IMAGE STUDIES' },
  { no:'03', title:'课程作业', en:'COURSE ASSIGNMENTS', image:'/projects/other-works-detail/pages/03.webp', label:'SPATIAL STUDIES' },
  { no:'04', title:'平面与海报', en:'GRAPHIC / POSTER DESIGN', image:'/projects/other-works-detail/pages/04.webp', label:'VISUAL STUDIES' },
];

export default function OtherWorksStory() {
  return <div className="other-works-story">
    <ProjectCursor variant="film" />
    <div className="other-works-marquee" aria-hidden="true">
      <div>{Array.from({ length:2 }, (_, group) => <span key={group}>RENDERING — PHOTOGRAPHY — COURSE WORKS — GRAPHIC DESIGN — </span>)}</div>
    </div>
    {sections.map((section, index) => <section className="other-works-section" key={section.no}>
      <p className="other-works-vertical" aria-hidden="true">{section.label}</p>
      <header className="other-works-head">
        <span>{section.no} / 04</span>
        <h2>{section.title}</h2>
        <p>{section.en}</p>
      </header>
      <figure>
        <img src={section.image} alt={`${section.title}作品集跨页`} loading={index === 0 ? 'eager' : 'lazy'} />
        <figcaption><span>LJH / ARCHIVE</span><span>{section.en}</span><span>2022—2025</span></figcaption>
      </figure>
    </section>)}
  </div>;
}
