import projectContent from '../content/projects.json';

export type Project = {
  no: string;
  slug: string;
  year: string;
  title: string;
  fullTitle: string;
  en: string;
  type: string;
  image: string;
  video?: string;
  location: string;
  role: string;
  summary: string;
  concept: string;
  keywords: string[];
};

export const projects = projectContent.projects as Project[];

export function getProject(slug: string) {
  return projects.find(project => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex(project => project.slug === slug);
  return projects[(index + 1 + projects.length) % projects.length];
}
