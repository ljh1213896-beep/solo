import ProjectCursor from './ProjectCursor';
import type { ProjectDetail } from './projectDetailData';

export default function SaltLakeStory({ detail }:{ detail:ProjectDetail }) {
  return (
    <div className="salt-sequence">
      <ProjectCursor variant="flamingo" />
      {detail.sections.map(section => (
        <section className={`salt-media-section salt-layout-${section.layout}`} key={section.id}>
          <header className="salt-media-head">
            <span>{section.id} / {String(detail.sections.length).padStart(2,'0')}</span>
            <h2>{section.title}</h2>
            <p>{section.en}</p>
          </header>
          <div className="salt-media-grid">
            {section.media.map((media,index) => (
              <figure key={`${media.image}-${index}`}>
                <img src={media.image} alt={`${section.title} ${index + 1}`} loading={section.id === '01' && index < 2 ? 'eager' : 'lazy'} />
                <figcaption>{media.caption || `${String(index + 1).padStart(2,'0')} / ${String(section.media.length).padStart(2,'0')}`}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
