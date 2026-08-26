'use client';

import ProjectCursor from './ProjectCursor';

const assetRoot = '/projects/medieval-pirate-detail';
const assets = (folder:string, length:number) => Array.from(
  { length },
  (_, index) => `${assetRoot}/${folder}/${String(index + 1).padStart(2, '0')}.webp`,
);

const overview = assets('overview', 4);
const renders = assets('renders', 8);
const tour = assets('tour', 2);
const boards = assets('boards', 2);
const plans = assets('plans', 2);

export default function MedievalPirateStory() {
  return <div className="pirate-story">
    <ProjectCursor variant="anchor" />

    <section className="pirate-renders" aria-labelledby="pirate-renders-title">
      <header className="pirate-section-head">
        <span>01 / 05</span>
        <h2 id="pirate-renders-title">效果展示</h2>
        <p>RENDERED ATMOSPHERES</p>
      </header>
      <div className="pirate-render-grid">
        {renders.map((src, index) => <figure key={src} className={`pirate-render-${index + 1}`}>
          <div><img src={src} alt={`Medieval Pirate 效果展示 ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} /></div>
          <figcaption><span>FRAME</span>{String(index + 1).padStart(2, '0')} / 08</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="pirate-overview" aria-labelledby="pirate-overview-title">
      <header className="pirate-section-head">
        <span>02 / 05</span>
        <h2 id="pirate-overview-title">项目概况</h2>
        <p>PROJECT OVERVIEW</p>
      </header>
      <div className="pirate-statement">
        <p>以航海、舱室与藏宝路径为叙事线索，把中古服饰零售空间转化为一段可被行走、观看与发现的沉浸旅程。</p>
        <dl>
          <div><dt>TYPE</dt><dd>中古商业 / 叙事空间</dd></div>
          <div><dt>LOCATION</dt><dd>成都 · 四川</dd></div>
          <div><dt>YEAR</dt><dd>2024</dd></div>
        </dl>
      </div>
      <div className="pirate-overview-grid">
        {overview.map((src, index) => <figure key={src}>
          <img src={src} alt={`Medieval Pirate 项目概况 ${index + 1}`} loading="lazy" />
          <figcaption>{String(index + 1).padStart(2, '0')} / 04</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="pirate-tour" aria-labelledby="pirate-tour-title">
      <header className="pirate-section-head">
        <span>03 / 05</span>
        <h2 id="pirate-tour-title">导览</h2>
        <p>SPATIAL GUIDE</p>
      </header>
      <div className="pirate-tour-grid">
        {tour.map((src, index) => <figure key={src}>
          <img src={src} alt={`Medieval Pirate 导览图 ${index + 1}`} loading="lazy" />
          <figcaption>{String(index + 1).padStart(2, '0')} / 02</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="pirate-boards" aria-labelledby="pirate-boards-title">
      <header className="pirate-section-head">
        <span>04 / 05</span>
        <h2 id="pirate-boards-title">项目展板</h2>
        <p>PROJECT BOARDS</p>
      </header>
      <div className="pirate-board-stack">
        {boards.map((src, index) => <figure key={src}>
          <img src={src} alt={`Medieval Pirate 项目展板 ${index + 1}`} loading="lazy" />
          <figcaption>{String(index + 1).padStart(2, '0')} / 02</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="pirate-plans" aria-labelledby="pirate-plans-title">
      <header className="pirate-section-head">
        <span>05 / 05</span>
        <h2 id="pirate-plans-title">平面</h2>
        <p>FLOOR PLANS</p>
      </header>
      <div className="pirate-plan-grid">
        {plans.map((src, index) => <figure key={src}>
          <img src={src} alt={`Medieval Pirate 平面图 ${index + 1}`} loading="lazy" />
          <figcaption>{String(index + 1).padStart(2, '0')} / 02</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
