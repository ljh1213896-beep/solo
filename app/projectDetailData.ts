import saltLake from '../content/project-details/salt-lake-habitat.json';
import tidalMoon from '../content/project-details/tidal-moon-library.json';
import qixiang from '../content/project-details/myriad-formless.json';
import medievalPirate from '../content/project-details/medieval-pirate.json';
import digitalNomad from '../content/project-details/digital-nomad.json';
import autumnMarket from '../content/project-details/autumn-market.json';
import otherWorks from '../content/project-details/experiments.json';

export type ProjectDetailMedia = {
  image: string;
  caption?: string;
  paired?: boolean;
};

export type ProjectDetailMeta = {
  label: string;
  value: string;
};

export type ProjectDetailSection = {
  id: string;
  title: string;
  en: string;
  layout?: string;
  label?: string;
  text?: string;
  video?: string;
  meta?: ProjectDetailMeta[];
  media: ProjectDetailMedia[];
};

export type ProjectDetail = {
  slug: string;
  hero: {
    image?: string;
    video?: string;
    poster?: string;
    alt?: string;
  };
  marquee?: string[];
  sections: ProjectDetailSection[];
};

const projectDetails = {
  'salt-lake-habitat': saltLake,
  'tidal-moon-library': tidalMoon,
  'myriad-formless': qixiang,
  'medieval-pirate': medievalPirate,
  'digital-nomad': digitalNomad,
  'autumn-market': autumnMarket,
  experiments: otherWorks,
} as Record<string, ProjectDetail>;

export function getProjectDetail(slug: string) {
  return projectDetails[slug];
}
