import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LJH 内容管理',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
