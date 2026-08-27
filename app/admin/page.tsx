"use client";

import Script from 'next/script';

export default function AdminPage() {
  return (
    <>
      <link
        rel="cms-config-url"
        type="text/yaml"
        href="/admin/config.yml"
      />
      <style>{`
        html, body {
          margin: 0;
          min-height: 100%;
          background: #080608;
          color: #f2eef1;
          font-family: Arial, "Microsoft YaHei", sans-serif;
        }

        #cms-loading {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: #080608;
          color: #c65b91;
          font: 12px monospace;
          letter-spacing: 0.16em;
        }
      `}</style>
      <div id="cms-loading">LJH CONTENT STUDIO · 正在加载</div>
      <Script
        src="https://unpkg.com/decap-cms@3.8.3/dist/decap-cms.js"
        strategy="afterInteractive"
        onLoad={() => document.getElementById('cms-loading')?.remove()}
      />
    </>
  );
}
