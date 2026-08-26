import ProjectCursor from './ProjectCursor';

type MediaSection = {
  id: string;
  title: string;
  en: string;
  images: string[];
  layout?: 'wide' | 'portrait' | 'plans';
};

const path = '/projects/salt-lake-sequence';

const sections: MediaSection[] = [
  {
    id:'01', title:'效果图', en:'RENDERED VIEWS', layout:'wide',
    images:Array.from({ length:11 }, (_,index) => `${path}/effects/${String(index + 1).padStart(2,'0')}.webp`),
  },
  {
    id:'02', title:'项目1.pdf', en:'PROJECT DOCUMENT', layout:'wide',
    images:Array.from({ length:6 }, (_,index) => `${path}/project-pdf/${String(index + 1).padStart(2,'0')}.webp`),
  },
  {
    id:'03', title:'四季导览图', en:'FOUR-SEASON GUIDE', layout:'grid',
    images:Array.from({ length:4 }, (_,index) => `${path}/seasons/${String(index + 1).padStart(2,'0')}.webp`),
  },
  {
    id:'04', title:'展板', en:'DESIGN BOARDS', layout:'portrait',
    images:Array.from({ length:4 }, (_,index) => `${path}/boards/${String(index + 1).padStart(2,'0')}.webp`),
  },
  {
    id:'05', title:'总平图', en:'MASTERPLAN', layout:'wide',
    images:[`${path}/masterplan.webp`],
  },
  {
    id:'06', title:'项目平面', en:'PLAN STUDIES', layout:'plans',
    images:Array.from({ length:4 }, (_,index) => `${path}/plans/${String(index + 1).padStart(2,'0')}.webp`),
  },
];

export default function SaltLakeStory() {
  return (
    <div className="salt-sequence">
      <ProjectCursor variant="flamingo" />
      {sections.map(section => (
        <section className={`salt-media-section salt-layout-${section.layout}`} key={section.id}>
          <header className="salt-media-head">
            <span>{section.id} / 06</span>
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
