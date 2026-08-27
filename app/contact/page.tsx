import type { Metadata } from 'next';
import ContactClient from '../ContactClient';

export const metadata: Metadata = {
  title:'联系李建华 — LJH Portfolio',
  description:'联系李建华：微信、手机与邮箱。',
};

export default function ContactPage() {
  return <ContactClient />;
}
