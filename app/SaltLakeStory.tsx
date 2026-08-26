import ProjectCursor from './ProjectCursor';

type MediaSection = {
  id: string;
  title: string;
  en: string;
  images: string[];
  layout?: 'wide' | 'stack' | 'pair' | 'portrait' | 'plans';
};

const path = '/projects/salt-lake-sequence';

const sections: MediaSection[] = [
  {
    id:'01', title:'效果展示', en:'RENDERED VIEWS', layout:'wide',
    images:Array.from({ length:11 }, (_,index) => `${path}/effects/${String(index + 1).padStart(2,'0')}.webp`),
  },
  {
    id:'02', title:'项目概况', en:'PROJECT OVERVIEW', layout:'stack',
    images:Array.from({ length:6 }, (_,index) => `${path}/project-pdf/${String(index + 1).padStart(2,'0')}.webp`),
  },
  {
    id:'03', title:'四季导览图', en:'FOUR-SEASON GUIDE', layout:'pair',
    images:Array.from({ length:4 }, (_,index) => `${path}/seasons/${String(index + 1).padStart(2,'0')}.webp`),
  },
  {
    id:'04', title:'项目展板', en:'DESIGN BOARDS', layout:'portrait',
    images:Array.from({ length:4 }, (_,index) => `${path}/boards/${String(index + 1).padStart(2,'0')}.webp`),
  },
  {
    id:'05', title:'平面图', en:'MASTERPLAN / PLAN STUDIES', layout:'plans',
    images:[
      `${path}/masterplan.webp`,
      ...Array.from({ length:4 }, (_,index) => `${path}/plans/${String(index + 1).padStart(2,'0')}.webp`),
    ],
  },
];

export default function SaltLakeStory() {
  return (
    <div className="salt-sequence">
      <ProjectCursor variant="flamingo" />
      {sections.map(section => (
        <section className={`salt-media-section salt-layout-${section.layout}`} key={section.id}>
          <header className="salt-media-head">
            <span>{section.id} / 05</span>
            <h2>{section.title}</h2>
            <p>{section.en}</p>
          </header>
          <div className="salt-media-grid">
            {section.images.map((image,index) => (
              <figure key={image}>
                <img src={image} alt={`${section.title} ${index + 1}`} loading={section.id === '01' && index < 2 ? 'eager' : 'lazy'} />
                <figcaption>{String(index + 1).padStart(2,'0')} / {String(section.images.length).padStart(2,'0')}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
