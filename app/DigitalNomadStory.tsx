'use client';

import ProjectCursor from './ProjectCursor';

const assetRoot = '/projects/digital-nomad-detail';

export default function DigitalNomadStory() {
  return <div className="nomad-story">
    <ProjectCursor variant="coffee" />
    <section className="nomad-section nomad-effects" aria-labelledby="nomad-effects-title">
      <header className="nomad-section-head">
        <span>01 / 02</span>
        <h2 id="nomad-effects-title">效果展示</h2>
        <p>RENDERED VIEWS</p>
      </header>
      <div className="nomad-effects-stack">
        {[1, 2, 3].map(index => <figure className="nomad-full-board" key={index}>
          <img src={`${assetRoot}/effects/0${index}.webp`} alt={`数字游民社区办公空间效果展示 ${index}`} loading={index === 1 ? 'eager' : 'lazy'} />
          <figcaption>{String(index).padStart(2, '0')} / 03</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="nomad-section nomad-overview" aria-labelledby="nomad-overview-title">
      <header className="nomad-section-head">
        <span>02 / 02</span>
        <h2 id="nomad-overview-title">项目概况</h2>
        <p>PROJECT OVERVIEW</p>
      </header>
      <div className="nomad-overview-stack">
        {[1, 2, 3, 4].map(index => <figure key={index}>
          <img src={`${assetRoot}/overview/0${index}.webp`} alt={`数字游民社区办公空间项目概况 ${index}`} loading={index === 1 ? 'eager' : 'lazy'} />
          <figcaption>{String(index).padStart(2, '0')} / 04</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
