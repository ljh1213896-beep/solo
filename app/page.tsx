'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import LjhScene from './LjhScene';
import { projects as works } from './projectData';
import ProjectCarouselScene from './ProjectCarouselScene';
import MobileProjectSwiper from './MobileProjectSwiper';
import ContactClient from './ContactClient';
import SiteMark from './SiteMark';
import EntryPrelude from './EntryPrelude';
import { homeContent, menuContent, profileContent } from './siteContent';

const chapters = [
  { layout: 'statement', tag: homeContent.hero.tag, title: <><span className="manifesto-title">{homeContent.hero.mainTitle}</span><small>{homeContent.hero.subtitle}</small><i /><span className="manifesto-line">{homeContent.hero.linePrefix}<em>{homeContent.hero.lineEmphasis}</em>{homeContent.hero.lineMiddle}<strong>{homeContent.hero.lineStrong}</strong></span><small>{homeContent.hero.lineEnglish}</small></>, copy: '' },
  ...homeContent.principles.map((item, index) => ({ layout: ['glyph-left', 'glyph-right', 'glyph-bottom'][index], tag:item.tag, title:<>{item.title}</>, copy:item.copy })),
];

function clamp(value: number, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: .075, smoothWheel: true, wheelMultiplier: .9, touchMultiplier: 1.1 });
    let frame = 0;
    let scrollSnapping = false;
    let snapTimer = 0;
    let settleTimer = 0;
    const snapTo = (target: number, duration = 1.05) => {
      if (scrollSnapping) return;
      scrollSnapping = true;
      lenis.scrollTo(target, {
        duration,
        lock: true,
        easing: value => 1 - Math.pow(1 - value, 4),
        force: true,
        onComplete: () => {
          window.clearTimeout(snapTimer);
          scrollSnapping = false;
        },
      });
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => { scrollSnapping = false; }, duration * 1000 + 480);
    };
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
      gallery.style.setProperty('--gallery-progress', String(gp));
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
      const profile = profileRef.current;
      const gallery = galleryRef.current;
      const contact = contactRef.current;
      if (!hero || !profile || !gallery || !contact || window.innerWidth <= 1000 || Math.abs(event.deltaY) < 2) return;
      const start = hero.offsetTop;
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
      const currentY = window.scrollY;
      const direction = event.deltaY > 0 ? 1 : -1;
      if (scrollSnapping) {
        event.preventDefault();
        return;
      }

      if (currentY >= start - 2 && currentY <= start + travel + 2) {
        const currentStep = Math.round(clamp((currentY - start) / travel) * (chapters.length - 1));
        const nextStep = currentStep + direction;
        event.preventDefault();
        if (scrollSnapping) return;
        if (nextStep >= chapters.length) snapTo(profile.offsetTop, 1.2);
        else if (nextStep >= 0) snapTo(start + travel * (nextStep / (chapters.length - 1)), 1.12);
        return;
      }

      const profileStart = profile.offsetTop;
      const profileEnd = profileStart + profile.offsetHeight;
      if (currentY > start + travel && currentY < profileStart - 2) {
        event.preventDefault();
        snapTo(direction > 0 ? profileStart : start + travel, .8);
        return;
      }
      if (currentY > start + travel && currentY >= profileStart - 3 && currentY < profileEnd - 3) {
        event.preventDefault();
        if (scrollSnapping) return;
        snapTo(direction > 0 ? gallery.offsetTop : start + travel, 1.15);
        return;
      }

      const galleryStart = gallery.offsetTop;
      const galleryTravel = Math.max(1, gallery.offsetHeight - window.innerHeight);
      if (currentY >= galleryStart - 3 && currentY <= galleryStart + galleryTravel + 3) {
        const currentProject = Math.round(clamp((currentY - galleryStart) / galleryTravel) * (works.length - 1));
        const nextProject = currentProject + direction;
        event.preventDefault();
        if (scrollSnapping) return;
        if (nextProject < 0) snapTo(profileStart, 1.15);
        else if (nextProject >= works.length) snapTo(contact.offsetTop, 1.2);
        else snapTo(galleryStart + galleryTravel * (nextProject / (works.length - 1)), .95);
      }
    };
    const onScrollSettled = () => {
      window.clearTimeout(settleTimer);
      if (window.innerWidth <= 1000 || scrollSnapping) return;
      settleTimer = window.setTimeout(() => {
        if (scrollSnapping) return;
        const hero = heroRef.current;
        const gallery = galleryRef.current;
        if (!hero || !gallery) return;
        const currentY = window.scrollY;
        const heroTravel = Math.max(1, hero.offsetHeight - window.innerHeight);
        if (currentY >= hero.offsetTop && currentY <= hero.offsetTop + heroTravel) {
          const step = Math.round(clamp((currentY - hero.offsetTop) / heroTravel) * (chapters.length - 1));
          const target = hero.offsetTop + heroTravel * step / (chapters.length - 1);
          if (Math.abs(target - currentY) > 3) snapTo(target, .72);
          return;
        }
        const galleryTravel = Math.max(1, gallery.offsetHeight - window.innerHeight);
        if (currentY >= gallery.offsetTop && currentY <= gallery.offsetTop + galleryTravel) {
          const step = Math.round(clamp((currentY - gallery.offsetTop) / galleryTravel) * (works.length - 1));
          const target = gallery.offsetTop + galleryTravel * step / (works.length - 1);
          if (Math.abs(target - currentY) > 3) snapTo(target, .72);
        }
      }, 150);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('scroll', onScrollSettled, { passive: true });
    lenis.on('scroll', onScrollSettled);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(snapTimer);
      window.clearTimeout(settleTimer);
      lenis.off('scroll', onScrollSettled);
      lenis.destroy();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('scroll', onScrollSettled);
    };
  }, []);

  return (
    <main className="home-page">
      <EntryPrelude content={homeContent.entry} />
      <div className="cursor" aria-hidden="true"><span /></div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="LJH 首页"><SiteMark /></a>
        <p>{homeContent.header.practice}<br />{homeContent.header.locationYear}</p>
        <p className="local-time">{homeContent.header.discipline}</p>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="打开菜单"><i /><i /></button>
      </header>

      <aside className={`menu-panel ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <button onClick={() => setMenuOpen(false)} aria-label="关闭菜单">{menuContent.closeLabel}</button>
        <nav>{menuContent.items.map((item, i) => <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{item.label}</a>)}</nav>
        <p>{menuContent.footer}</p>
      </aside>

      <div className="intro-sequence">
      <div className="intro-continuous-scene"><LjhScene words={homeContent.sceneWords} /><div className="scanlines" /></div>
      <section className="hero-scroll" id="top" ref={heroRef}>
        <div className="hero-stage">
          <div className="target target-a">[</div><div className="target target-b">]</div>
          <div className="hero-chapters">
            {chapters.map((chapter, i) => <div className={`hero-chapter ${i === 0 ? 'intro-manifesto' : ''} ${chapter.layout !== 'statement' ? `glyph-copy-chapter ${chapter.layout}-chapter` : ''}`} key={chapter.tag} ref={el => { chapterRefs.current[i] = el; }}>
              <p className="chapter-tag">{chapter.tag}</p><h1>{chapter.title}</h1>{chapter.copy && <p className="chapter-copy">{chapter.copy}</p>}
            </div>)}
          </div>
          <div className="stage-foot">{homeContent.stageFooter.map(item => <span key={item}>{item}</span>)}</div>
        </div>
      </section>

      <section className="profile-section" id="profile" ref={profileRef}>
        <div className="profile-head">{profileContent.header.map(item => <span key={item}>{item}</span>)}</div>
        <div className="profile-room-content">
          <aside className="profile-wall profile-wall-left">
            <div className="profile-wall-inner">
            <div className="room-info-section"><span>■ 教育背景&nbsp; Education</span><div className="room-education"><b>{profileContent.education.school}</b><b>{profileContent.education.major}</b><small>{profileContent.education.period}</small><p>{profileContent.education.score}</p><p>{profileContent.education.ranking}</p></div></div>
            <div className="room-info-section"><span>■ 荣誉奖项&nbsp; Honors</span><ul className="room-simple-list">{profileContent.honors.map(item => <li key={`${item.year}-${item.title}`}><time>{item.year}</time><b>{item.title}</b></li>)}</ul></div>
            <div className="room-info-section"><span>■ 软件技能&nbsp; Skills</span><div className="room-skills">{profileContent.skills.map(skill => <b key={skill}>{skill}</b>)}</div></div>
            <div className="room-info-section"><span>■ 校园经历&nbsp; Campus Experiences</span><ul className="room-simple-list">{profileContent.campusExperiences.map(item => <li key={`${item.year}-${item.title}`}><time>{item.year}</time><b>{item.title}</b></li>)}</ul></div>
            </div>
          </aside>
          <div className="profile-wall profile-wall-back">
            <div className="profile-back-card">
              <figure className="profile-portrait"><img src={profileContent.portrait} alt={`${profileContent.name}个人肖像`} /><figcaption>{profileContent.portraitCaption}</figcaption></figure>
              <div className="profile-intro"><div className="profile-name"><p>{profileContent.name}</p><h2>{profileContent.nameEnglish}</h2></div><p className="profile-role">{profileContent.role}</p><p>{profileContent.introduction}</p><p className="profile-intro-en">{profileContent.introductionEnglish}</p></div>
            </div>
          </div>
          <aside className="profile-wall profile-wall-right">
            <div className="profile-wall-inner">
            <div className="room-info-section"><span>■ 学术经历&nbsp; Academic Experience</span><ul className="room-award-list">{profileContent.academicAwards.map(item => <li key={`${item.title}-${item.award}`}><b>{item.title}</b><em>{item.award}</em></li>)}</ul></div>
            <div className="room-info-section room-practice"><span>■ 科研与实践经历&nbsp; Research & Practice</span><ul>{profileContent.practice.map(item => <li key={item.title}><b>{item.title}</b><em>{item.role}</em><p>{item.description}</p></li>)}</ul></div>
            </div>
          </aside>
        </div>
      </section>
      </div>

      <section className="gallery-scroll" id="work" ref={galleryRef}>
        <MobileProjectSwiper projects={works} />
        <div className="gallery-stage">
          <ProjectCarouselScene projects={works} />
          <div className="gallery-backdrop" aria-hidden="true"><div className="gallery-backdrop-track">{Array.from({ length: 12 }, (_, i) => <span key={i}>{homeContent.gallery.marquee}</span>)}</div></div>
          <div className="gallery-head"><span>{homeContent.gallery.heading}</span><span>{homeContent.gallery.interaction}</span><span>({String(works.length).padStart(2,'0')})</span></div>
          <div className="card-space">
            {works.map((work, i) => <article className="project-card" key={work.no} ref={el => { cardRefs.current[i] = el; }}>
              <a className="project-card-link" href={`/projects/${work.slug}`} aria-label={`查看 ${work.fullTitle} 项目详情`} />
              <div className="card-label"><span>{work.no}</span><div><h2>{work.title}</h2><p>{work.en}</p></div><small>{work.type}</small></div>
            </article>)}
          </div>
          <div className="gallery-progress"><i /><span>{homeContent.gallery.progress}</span></div>
        </div>
      </section>
      <div ref={contactRef}>
        <ContactClient embedded />
      </div>
    </main>
  );
}
