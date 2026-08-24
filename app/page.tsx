'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import LjhScene from './LjhScene';
import { projects as works } from './projectData';
import ProjectCarouselScene from './ProjectCarouselScene';

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
  const profileRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: .075, smoothWheel: true, wheelMultiplier: .9, touchMultiplier: 1.1 });
    let frame = 0;
    let heroSnapping = false;
    let heroSnapTimer = 0;
    const render = (time: number) => {
      lenis.raf(time);
      const hero = heroRef.current;
      const gallery = galleryRef.current;
      const profile = profileRef.current;
      if (!hero || !gallery || !profile) return;
      const heroTravel = Math.max(1, hero.offsetHeight - window.innerHeight);
      const hp = clamp(window.scrollY / heroTravel);
      const profileProgress = clamp((window.scrollY - (hero.offsetTop + heroTravel)) / Math.max(1, window.innerHeight));
      const profileEase = profileProgress * profileProgress * (3 - 2 * profileProgress);
      const backEase = clamp(profileProgress / .58); const backFlight = backEase * backEase * (3 - 2 * backEase);
      const leftEase = clamp((profileProgress - .08) / .78); const leftFlight = leftEase * leftEase * (3 - 2 * leftEase);
      const rightEase = clamp((profileProgress - .18) / .82); const rightFlight = rightEase * rightEase * (3 - 2 * rightEase);
      profile.style.setProperty('--profile-enter', String(profileEase));
      profile.style.setProperty('--profile-enter-shift', `${(1 - profileEase) * 82}px`);
      profile.style.setProperty('--profile-enter-scale', String(.9 + profileEase * .1));
      profile.style.setProperty('--profile-section-lift', `${(1 - profileProgress) * -100}vh`);
      profile.style.setProperty('--profile-back-flight', String(backFlight));
      profile.style.setProperty('--profile-left-flight', String(leftFlight));
      profile.style.setProperty('--profile-right-flight', String(rightFlight));
      profile.style.setProperty('--profile-back-x', `${(1 - backFlight) * 2}vw`);
      profile.style.setProperty('--profile-back-y', `${(1 - backFlight) * -9}vh`);
      profile.style.setProperty('--profile-back-z', `${(1 - backFlight) * 560}px`);
      profile.style.setProperty('--profile-back-turn', `${(1 - backFlight) * 132}deg`);
      profile.style.setProperty('--profile-back-roll', `${(1 - backFlight) * -48}deg`);
      profile.style.setProperty('--profile-back-scale', String(.08 + backFlight * .92));
      profile.style.setProperty('--profile-left-x', `${(1 - leftFlight) * 41}vw`);
      profile.style.setProperty('--profile-left-y', `${(1 - leftFlight) * 11}vh`);
      profile.style.setProperty('--profile-left-z', `${(1 - leftFlight) * 520}px`);
      profile.style.setProperty('--profile-left-turn', `${24 + (1 - leftFlight) * 128}deg`);
      profile.style.setProperty('--profile-left-roll', `${(1 - leftFlight) * -74}deg`);
      profile.style.setProperty('--profile-left-scale', String(.06 + leftFlight * .94));
      profile.style.setProperty('--profile-right-x', `${(1 - rightFlight) * -41}vw`);
      profile.style.setProperty('--profile-right-y', `${(1 - rightFlight) * 11}vh`);
      profile.style.setProperty('--profile-right-z', `${(1 - rightFlight) * 520}px`);
      profile.style.setProperty('--profile-right-turn', `${-24 - (1 - rightFlight) * 128}deg`);
      profile.style.setProperty('--profile-right-roll', `${(1 - rightFlight) * 74}deg`);
      profile.style.setProperty('--profile-right-scale', String(.06 + rightFlight * .94));
      const galleryTop = gallery.offsetTop;
      const gp = clamp((window.scrollY - galleryTop) / Math.max(1, gallery.offsetHeight - window.innerHeight));
      chapterRefs.current.forEach((chapter, i) => {
        if (!chapter) return;
        const center = i / (chapters.length - 1);
        const distance = Math.abs(hp - center);
        const opacity = clamp(1 - distance * 7.2) * (i === chapters.length - 1 ? 1 - profileEase : 1);
        chapter.style.opacity = String(opacity);
        chapter.style.transform = `translateY(${(hp - center) * -90}px)`;
        chapter.style.pointerEvents = opacity > .5 ? 'auto' : 'none';
      });

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const rel = i - gp * (works.length - 1);
        const active = clamp(1 - Math.abs(rel) * 4.5);
        card.style.transform = 'translate3d(-50%,-50%,0)';
        card.style.opacity = String(active);
        card.style.pointerEvents = active > .55 ? 'auto' : 'none';
        card.style.zIndex = String(20 - Math.round(Math.abs(rel) * 2));
      });

      frame = requestAnimationFrame(render);
    };
    const onPointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
      document.documentElement.style.setProperty('--my', `${event.clientY}px`);
      const profile = profileRef.current;
      if (profile) {
        const rect = profile.getBoundingClientRect();
        profile.style.setProperty('--profile-x', `${event.clientX - rect.left}px`);
        profile.style.setProperty('--profile-y', `${event.clientY - rect.top}px`);
      }
    };
    const onWheel = (event: WheelEvent) => {
      const hero = heroRef.current;
      if (!hero || Math.abs(event.deltaY) < 4) return;
      const start = hero.offsetTop;
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
      const currentY = window.scrollY;
      if (currentY < start - 2 || currentY > start + travel + 2) return;

      const currentStep = Math.round(clamp((currentY - start) / travel) * (chapters.length - 1));
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextStep = currentStep + direction;
      if (nextStep >= chapters.length && direction > 0 && profileRef.current) {
        event.preventDefault();
        if (heroSnapping) return;
        heroSnapping = true;
        lenis.scrollTo(profileRef.current.offsetTop, {
          duration: 1.35,
          easing: value => 1 - Math.pow(1 - value, 4),
          force: true,
        });
        window.clearTimeout(heroSnapTimer);
        heroSnapTimer = window.setTimeout(() => { heroSnapping = false; }, 1240);
        return;
      }
      if (nextStep < 0 || nextStep >= chapters.length) return;

      event.preventDefault();
      if (heroSnapping) return;
      heroSnapping = true;
      const targetY = start + travel * (nextStep / (chapters.length - 1));
      lenis.scrollTo(targetY, {
        duration: 1.05,
        easing: value => 1 - Math.pow(1 - value, 4),
        force: true,
      });
      window.clearTimeout(heroSnapTimer);
      heroSnapTimer = window.setTimeout(() => { heroSnapping = false; }, 920);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(heroSnapTimer);
      lenis.destroy();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('wheel', onWheel, { capture: true });
    };
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

      <div className="intro-sequence">
      <div className="intro-continuous-scene"><LjhScene /><div className="scanlines" /></div>
      <section className="hero-scroll" id="top" ref={heroRef}>
        <div className="hero-stage">
          <div className="target target-a">[</div><div className="target target-b">]</div>
          <div className="hero-chapters">
            {chapters.map((chapter, i) => <div className={`hero-chapter ${i === 0 ? 'intro-manifesto' : ''} ${chapter.layout !== 'statement' ? `glyph-copy-chapter ${chapter.layout}-chapter` : ''}`} key={chapter.tag} ref={el => { chapterRefs.current[i] = el; }}>
              <p className="chapter-tag">{chapter.tag}</p><h1>{chapter.title}</h1>{chapter.copy && <p className="chapter-copy">{chapter.copy}</p>}
            </div>)}
          </div>
          <div className="stage-foot"><span>SCROLL / SCRUB</span><span>35.027° N · 111.006° E</span><span>PORTFOLIO INDEX 00—07</span></div>
        </div>
      </section>

      <section className="profile-section" id="profile" ref={profileRef}>
        <div className="profile-head"><span>ABOUT / 个人介绍</span><span>PROFILE 01</span><span>CHENGDU · CHINA</span></div>
        <div className="profile-room-content">
          <aside className="profile-wall profile-wall-left">
            <div className="profile-wall-inner">
            <div className="room-info-section"><span>■ 教育背景&nbsp; Education</span><div className="room-education"><b>西南民族大学</b><b>环境设计</b><small>2022.09 至今</small><p>学业情况：90.41 / 100&nbsp;&nbsp;3.74 / 4</p><p>专业课排名：2 / 98</p></div></div>
            <div className="room-info-section"><span>■ 荣誉奖项&nbsp; Honors</span><ul className="room-simple-list"><li><time>2024</time><b>国家奖学金</b></li><li><time>2025</time><b>四川省大学生综合素质 A 级证书</b></li><li><time>2024</time><b>西南民族大学本科生一等奖学金</b></li><li><time>2024</time><b>西南民族大学校级三好学生</b></li><li><time>2023</time><b>西南民族大学本科生二等奖学金</b></li></ul></div>
            <div className="room-info-section"><span>■ 软件技能&nbsp; Skills</span><div className="room-skills"><b>Photoshop</b><b>Sketch Up</b><b>Illustrator</b><b>Cinema 4D</b><b>Auto CAD</b><b>Midjourney</b><b>D5 Render</b><b>Blender</b><b>Stable Diffusion</b><b>ChatGPT</b><b>Codex</b></div></div>
            <div className="room-info-section"><span>■ 校园经历&nbsp; Campus Experiences</span><ul className="room-simple-list"><li><time>2025</time><b>FOCUS DESIGN 设计平台签约设计师</b></li><li><time>2024</time><b>环境设计与陈设艺术研究所 第四工作室负责人</b></li><li><time>2023</time><b>中国建筑学会室内设计分会会员</b></li><li><time>2023</time><b>建筑学院环境设计系实践工作组组长</b></li><li><time>2022</time><b>党委宣传部民小薇工作室摄影记者</b></li></ul></div>
            </div>
          </aside>
          <div className="profile-wall profile-wall-back">
            <div className="profile-back-card">
              <figure className="profile-portrait"><img src="/profile/li-jianhua.png" alt="李建华个人肖像" /><figcaption>PORTRAIT / 2025</figcaption></figure>
              <div className="profile-intro"><div className="profile-name"><p>李建华</p><h2>LI JIANHUA</h2></div><p className="profile-role">环境设计师 / 空间实践者</p><p>以环境、室内、空间与景观为实践边界，关注场地语境、人的行为以及自然关系。从调研、概念构建到视觉表达与落地协同，在设计实践与科研探索之间建立持续连接。</p><p className="profile-intro-en">An environmental design practitioner translating research, context and human experience into tangible places.</p></div>
            </div>
          </div>
          <aside className="profile-wall profile-wall-right">
            <div className="profile-wall-inner">
            <div className="room-info-section"><span>■ 学术经历&nbsp; Academic Experience</span><ul className="room-award-list"><li><b>2025 米兰设计周中国高校设计学科师生优秀作品展四川赛区</b><em>二等奖</em></li><li><b>2024 第十届“中装杯”全国大学生环境设计大赛</b><em>二等奖</em></li><li><b>2024 四川省大学生环境设计大赛</b><em>一等奖</em></li><li><b>2024 两岸新锐设计竞赛·华灿奖</b><em>三等奖</em></li><li><b>2024 东方设计奖全国高校创新设计大赛</b><em>一等奖</em></li><li><b>2024 四川省大学生农业创意设计大赛</b><em>一等奖</em></li><li><b>2024 十七届全国三维数字化创新设计大赛</b><em>一等奖</em></li><li><b>2024 首届中西部乡村振兴环境设计大赛</b><em>一等奖</em></li><li><b>2023 第12届未来设计师高校数字艺术设计大赛</b><em>一等奖</em></li><li><b>2023 四川省国际大学生创新大赛</b><em>银奖</em></li><li><b>2023 四川省道中华杯原创手绘比赛</b><em>一等奖</em></li><li><b>2023 成都市优秀原创方案设计室内装饰类</b><em>优秀奖</em></li></ul></div>
            <div className="room-info-section room-practice"><span>■ 科研与实践经历&nbsp; Research & Practice</span><ul><li><b>青触 Design — 基于新媒体平台的创意传媒品牌</b><em>负责人</em><p>负责项目研究主干梳理及主要设计工作。</p></li><li><b>油脉巡行者 — 新一代仿生蛇形石油管道巡检机器人</b><em>主要负责人</em><p>负责产品研发、项目视觉设计与策划统筹。</p></li><li><b>江西省赣州市赣县区义源村旅游规划项目</b><em>主要负责人</em><p>约 650 亩，方案已中标并进入落地阶段。</p></li><li><b>四川省成都市红牌里两新艺术中心设计</b><em>设计主创</em><p>约 3000㎡文化空间改造，项目已落地。</p></li><li><b>西南民族大学校图书馆一至四楼改造项目</b><em>主要负责人</em><p>负责调研、方案、采购需求与落地协同。</p></li></ul></div>
            </div>
          </aside>
        </div>
      </section>
      </div>

      <section className="gallery-scroll" id="work" ref={galleryRef}>
        <div className="gallery-stage">
          <ProjectCarouselScene projects={works} />
          <div className="gallery-backdrop">OUR WORK · OUR WORK · OUR WORK<br />OUR WORK · OUR WORK · OUR WORK<br />OUR WORK · OUR WORK · OUR WORK</div>
          <div className="gallery-head"><span>PROJECT ARCHIVE</span><span>DRAGGED BY SCROLL</span><span>(07)</span></div>
          <div className="card-space">
            {works.map((work, i) => <article className="project-card" key={work.no} ref={el => { cardRefs.current[i] = el; }}>
              <img src={work.image} alt="" /><div className="card-shade" />
              <div className="card-label"><span>{work.no} / {work.year}</span><h2>{work.title}</h2><p>{work.en}</p><small>{work.type}</small></div>
              <a className="project-card-link" href={`/projects/${work.slug}`} aria-label={`查看 ${work.title} 项目详情`} />
            </article>)}
          </div>
          <div className="gallery-progress"><i /><span>SCROLL THROUGH PROJECTS</span></div>
        </div>
      </section>

      <section className="paper-section" id="position">
        <div className="paper-kicker"><span>DESIGN POSITION / 设计立场</span><span>APPROACH 01—04</span></div>
        <h2 className="paper-title">NOT OBJECTS<br />IN SPACE.<br /><em>RELATIONS</em><br />MADE VISIBLE.</h2>
        <p className="paper-copy">不止于塑造空间中的物体，<br />更在于让不可见的关系被感知。</p>
        <div className="orbit-lines" aria-hidden="true" />
      </section>

      <section className="ticker" aria-label="设计领域"><div><span>LANDSCAPE</span><span>INTERIOR</span><span>SPATIAL</span><span>VISUAL</span><span>LANDSCAPE</span><span>INTERIOR</span></div></section>

      <section className="work-index">
        <div className="index-head"><span>ALL PROJECTS</span><span>项目索引 / 2022—2025</span><span>(07)</span></div>
        {works.map(work => <a className="index-row" href={`/projects/${work.slug}`} key={work.no}>
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
