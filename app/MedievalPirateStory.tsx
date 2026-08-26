'use client';

import GoldDustTrail from './GoldDustTrail';

const assetRoot = '/projects/medieval-pirate-detail';
const overview = Array.from({ length:4 }, (_, index) => `${assetRoot}/overview/${String(index + 1).padStart(2, '0')}.webp`);
const renders = Array.from({ length:8 }, (_, index) => `${assetRoot}/renders/${String(index + 1).padStart(2, '0')}.webp`);

export default function MedievalPirateStory() {
  return <div className="pirate-story">
    <GoldDustTrail />

    <section className="pirate-overview" aria-labelledby="pirate-overview-title">
      <header className="pirate-section-head">
        <span>01 / 02</span>
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
          <img src={src} alt={`Medieval Pirate 项目概况 ${index + 1}`} loading={index > 0 ? 'lazy' : 'eager'} />
          <figcaption>{String(index + 1).padStart(2, '0')} / 04</figcaption>
        </figure>)}
      </div>
    </section>

    <section className="pirate-renders" aria-labelledby="pirate-renders-title">
      <header className="pirate-section-head">
        <span>02 / 02</span>
        <h2 id="pirate-renders-title">效果图</h2>
        <p>RENDERED ATMOSPHERES</p>
      </header>
      <div className="pirate-render-grid">
        {renders.map((src, index) => <figure key={src} className={`pirate-render-${index + 1}`}>
          <div><img src={src} alt={`Medieval Pirate 效果图 ${index + 1}`} loading="lazy" /></div>
          <figcaption><span>FRAME</span>{String(index + 1).padStart(2, '0')} / 08</figcaption>
        </figure>)}
      </div>
    </section>
  </div>;
}
