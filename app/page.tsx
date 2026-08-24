'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import LjhScene from './LjhScene';

const works = [
  { no: '01', year: '2025', title: '循“析”而栖', en: 'Dwelling Through Analysis', type: 'LANDSCAPE / ECOLOGY', image: '/projects/salt-lake.jpg' },
  { no: '02', year: '2024', title: 'Medieval Pirate', en: 'A Medieval Narrative Store', type: 'INTERIOR / RETAIL', image: '/projects/medieval-pirate.jpg' },
  { no: '03', year: '2024', title: '从“游走”到“扎根”', en: 'From Roaming to Rooting', type: 'WORKPLACE / COMMUNITY', image: '/projects/digital-nomad.jpg' },
  { no: '04', year: '2024', title: '秋风市集', en: 'Autumn Breeze Market', type: 'URBAN RENEWAL / MARKET', image: '/projects/autumn-market.jpg' },
  { no: '05', year: '2023', title: '汐月书庭', en: 'Tidal Moon Reading Court', type: 'INTERIOR / RENOVATION', image: '/projects/library.jpg' },
  { no: '06', year: '2023', title: '万千无象', en: 'Myriad Formless', type: 'VISUAL IDENTITY / SYSTEM', image: '/projects/identity.jpg' },
  { no: '07', year: '2022—25', title: '其他作品', en: 'Experiments & Studies', type: 'RENDER / PHOTO / STUDY', image: '/projects/other-works.jpg' },
];

const chapters = [
  { layout: 'statement', tag: '00 / INTRODUCTION', title: <><span className="manifesto-title">萬千無象</span><small>Plain paper thousand hoodles</small><i /><span className="manifesto-line">当<em>空白</em>开始汲取<strong>空间</strong></span><small>When the blank begins to absorb space</small></>, copy: '' },
  { layout: 'glyph-left', tag: '[ L / LATITUDE ]', title: <>L — Latitude</>, copy: '设计的格局与思考的广度' },
  { layout: 'glyph-right', tag: '[ J / JUNCTION ]', title: <>J — Junction</>, copy: '空间的交汇、人与人 / 人与自然的互动' },
  { layout: 'glyph-bottom', tag: '[ H / HARMONY ]', title: <>H — Harmony</>, copy: '设计的终极目标——人与天地的共融' },
];

function clamp(value: number, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: .075, smoothWheel: true, wheelMultiplier: .9, touchMultiplier: 1.1 });
    let frame = 0;
    const render = (time: number) => {
      lenis.raf(time);
      const hero = heroRef.current;
      const gallery = galleryRef.current;
      if (!hero || !gallery) return;
      const hp = clamp(window.scrollY / Math.max(1, hero.offsetHeight - window.innerHeight));
      const galleryTop = gallery.offsetTop;
      const gp = clamp((window.scrollY - galleryTop) / Math.max(1, gallery.offsetHeight - window.innerHeight));
      chapterRefs.current.forEach((chapter, i) => {
        if (!chapter) return;
        const center = i / (chapters.length - 1);
        const distance = Math.abs(hp - center);
        const opacity = clamp(1 - distance * 7.2);
        chapter.style.opacity = String(opacity);
        chapter.style.transform = `translateY(${(hp - center) * -90}px)`;
        chapter.style.pointerEvents = opacity > .5 ? 'auto' : 'none';
      });

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const rel = i - gp * (works.length - 1);
        const x = rel * Math.min(window.innerWidth * .43, 560);
        const y = Math.abs(rel) * 38 + Math.sin(rel * 1.4) * 22;
        const z = -Math.abs(rel) * 260;
        const rotateY = -rel * 17;
        const rotateZ = rel * 2.2;
        const scale = Math.max(.56, 1 - Math.abs(rel) * .12);
        card.style.transform = `translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
        card.style.opacity = String(clamp(1.25 - Math.abs(rel) * .36, 0, 1));
        card.style.zIndex = String(20 - Math.round(Math.abs(rel) * 2));
      });

      frame = requestAnimationFrame(render);
    };
    const onPointer = (event: PointerEvent) => { document.documentElement.style.setProperty('--mx', `${event.clientX}px`); document.documentElement.style.setProperty('--my', `${event.clientY}px`); };
    window.addEventListener('pointermove', onPointer, { passive: true });
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); window.removeEventListener('pointermove', onPointer); };
  }, []);

  return (
    <main>
      <div className="cursor" aria-hidden="true"><span /></div>
      <header className="site-header">
        <a className="brand" href="#top">LJH<span>®</span></a>
        <p>SPATIAL PRACTICE<br />CHINA / 2026</p>
        <p className="local-time">ENVIRONMENT × INTERIOR</p>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="打开菜单"><i /><i /></button>
      </header>

      <aside className={`menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <button onClick={() => setMenuOpen(false)} aria-label="关闭菜单">CLOSE ×</button>
        <nav>{['HOME / 首页','WORK / 作品','PROFILE / 关于','CONTACT / 联系'].map((item, i) => <a key={item} href={i === 0 ? '#top' : i === 1 ? '#work' : i === 2 ? '#profile' : '#contact'} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{item}</a>)}</nav>
        <p>ENVIRONMENTAL · INTERIOR · SPATIAL · LANDSCAPE DESIGN</p>
      </aside>

      <section className="hero-scroll" id="top" ref={heroRef}>
        <div className="hero-stage">
          <LjhScene />
          <div className="scanlines" />
          <div className="target target-a">[</div><div className="target target-b">]</div>
          <div className="hero-chapters">
            {chapters.map((chapter, i) => <div className={`hero-chapter ${i === 0 ? 'intro-manifesto' : ''} ${chapter.layout !== 'statement' ? `glyph-copy-chapter ${chapter.layout}-chapter` : ''}`} key={chapter.tag} ref={el => { chapterRefs.current[i] = el; }}>
              <p className="chapter-tag">{chapter.tag}</p><h1>{chapter.title}</h1>{chapter.copy && <p className="chapter-copy">{chapter.copy}</p>}
            </div>)}
          </div>
          <div className="stage-foot"><span>SCROLL / SCRUB</span><span>35.027° N · 111.006° E</span><span>PORTFOLIO INDEX 00—07</span></div>
        </div>
      </section>

      <section className="gallery-scroll" id="work" ref={galleryRef}>
        <div className="gallery-stage">
          <div className="gallery-backdrop">SELECTED WORK<br />SELECTED WORK<br />SELECTED WORK</div>
          <div className="gallery-head"><span>PROJECT ARCHIVE</span><span>DRAGGED BY SCROLL</span><span>(07)</span></div>
          <div className="card-space">
            {works.map((work, i) => <article className="project-card" key={work.no} ref={el => { cardRefs.current[i] = el; }}>
              <img src={work.image} alt="" /><div className="card-shade" />
              <div className="card-label"><span>{work.no} / {work.year}</span><h2>{work.title}</h2><p>{work.en}</p><small>{work.type}</small></div>
            </article>)}
          </div>
          <div className="gallery-progress"><i /><span>SCROLL THROUGH PROJECTS</span></div>
        </div>
      </section>

      <section className="paper-section" id="profile">
        <div className="paper-kicker"><span>DESIGN POSITION / 设计立场</span><span>APPROACH 01—04</span></div>
        <h2 className="paper-title">NOT OBJECTS<br />IN SPACE.<br /><em>RELATIONS</em><br />MADE VISIBLE.</h2>
        <p className="paper-copy">不止于塑造空间中的物体，<br />更在于让不可见的关系被感知。</p>
        <div className="orbit-lines" aria-hidden="true" />
      </section>

      <section className="ticker" aria-label="设计领域"><div><span>LANDSCAPE</span><span>INTERIOR</span><span>SPATIAL</span><span>VISUAL</span><span>LANDSCAPE</span><span>INTERIOR</span></div></section>

      <section className="work-index">
        <div className="index-head"><span>ALL PROJECTS</span><span>项目索引 / 2022—2025</span><span>(07)</span></div>
        {works.map(work => <a className="index-row" href="#contact" key={work.no}>
          <span>{work.no}</span><div><h3>{work.title}</h3><p>{work.en}</p></div><small>{work.type}</small><time>{work.year}</time><b>↗</b><img src={work.image} alt="" />
        </a>)}
      </section>

      <footer id="contact">
        <div className="footer-meta"><span>OPEN TO COLLABORATION / 2026</span><span>BASED IN CHINA · WORKING EVERYWHERE</span></div>
        <a className="contact-link" href="mailto:2425527779@qq.com">LET&apos;S CREATE<i>让想法发生 ↗</i></a>
        <div className="footer-grid"><span>LJH © 2026</span><span>ENVIRONMENTAL / INTERIOR / SPATIAL / LANDSCAPE</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
