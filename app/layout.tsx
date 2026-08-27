import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LJH — Spatial & Environmental Designer',
  description: 'LJH 环境、室内、空间与景观设计作品集。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mobile-orientation-gate" role="status" aria-label="请将手机横屏观看">
          <div className="orientation-device" aria-hidden="true"><i /></div>
          <p>请横屏观看</p>
          <span>ROTATE YOUR DEVICE · 横向体验空间</span>
        </div>
        {children}
      </body>
    </html>
  );
}
