'use client';

import { useState } from 'react';
import BrandMarquee from './BrandMarquee';

export default function ContactClient() {
  const [copied, setCopied] = useState(false);
  const copyWechat = async () => {
    await navigator.clipboard.writeText('15513488747');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return <main className="contact-page">
    <header className="contact-header">
      <a href="/" className="project-brand">LJH<span>®</span></a>
      <span>CONTACT / 联系</span>
      <a href="/" aria-label="返回首页">BACK ×</a>
    </header>

    <section className="contact-hero">
      <div className="contact-grid" aria-hidden="true" />
      <p className="contact-kicker">OPEN TO COLLABORATION · 2026</p>
      <h1>LET&apos;S<br /><em>CREATE</em></h1>
      <p className="contact-intro">让空间、视觉与想法<br />在一次真诚的交流中发生。</p>
      <span className="contact-scroll">SCROLL TO CONNECT ↓</span>
    </section>

    <section className="contact-directory">
      <div className="contact-directory-head"><span>DIRECT CONTACT</span><span>CHENGDU · CHINA</span></div>
      <button type="button" className="contact-row" onClick={copyWechat}>
        <span>01</span><small>WECHAT / 微信</small><strong>15513488747</strong><i>{copied ? '已复制' : 'COPY ↗'}</i>
      </button>
      <a className="contact-row" href="tel:15513488747">
        <span>02</span><small>PHONE / 手机</small><strong>15513488747</strong><i>CALL ↗</i>
      </a>
      <a className="contact-row" href="mailto:2425527779@qq.com">
        <span>03</span><small>EMAIL / 邮箱</small><strong>2425527779@qq.com</strong><i>WRITE ↗</i>
      </a>
    </section>

    <section className="contact-brand-stage">
      <BrandMarquee />
      <div className="contact-end"><span>LJH © 2026</span><a href="/">RETURN HOME ↑</a></div>
    </section>
  </main>;
}
