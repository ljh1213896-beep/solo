import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailClient from '../../ProjectDetailClient';
import { getNextProject, getProject, projects } from '../../projectData';

export function generateStaticParams() {
  return projects.map(project => ({ slug:project.slug }));
}

export async function generateMetadata({ params }: { params:Promise<{ slug:string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title} — LJH Portfolio`;
  const description = `${project.summary} ${project.concept}`;
  const image = `https://ljh-0408.pages.dev${project.image}`;
  return {
    title,
    description,
    openGraph:{ title, description, images:[image] },
    twitter:{ card:'summary_large_image', title, description, images:[image] },
  };
}

export default async function ProjectPage({ params }: { params:Promise<{ slug:string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} next={getNextProject(slug)} />;
}
