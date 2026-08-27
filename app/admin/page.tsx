import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LJH 内容管理',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <>
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
      <script src="https://unpkg.com/decap-cms@3.8.3/dist/decap-cms.js" />
      <script
        dangerouslySetInnerHTML={{
          __html: "document.getElementById('cms-loading')?.remove();",
        }}
      />
    </>
  );
}
