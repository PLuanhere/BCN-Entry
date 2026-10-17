import type { BcnDocument, DocumentSection } from "../documents";
import { photoUrl } from "../photoAlbums";

export function DocumentSections({
  sections,
}: {
  sections: DocumentSection[];
}) {
  return (
    <div className="doc-sections">
      {sections.map((section, index) => (
        <section
          className={`doc-section ${section.wide ? "is-wide" : ""}`}
          key={section.title}
        >
          <span className="doc-section-number mono" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{section.title}</h3>
            {section.text && <p>{section.text}</p>}
            {section.points && (
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
export default function DocumentContent({
  document,
  titleId = "dialog-title",
}: {
  document: BcnDocument;
  titleId?: string;
}) {
  return (
    <div className="document-content">
      <span className="content-label mono">{document.code}</span>
      <h2 id={titleId} tabIndex={-1}>
        {document.title}
      </h2>
      <div className={document.image ? "doc-identity-intro" : undefined}>
        <p className="doc-intro body-copy">{document.intro}</p>
        {document.image && (
          <figure className="doc-brand-image">
            <img
              src={photoUrl(document.image)}
              alt="Ban Công Nghệ — School Life Stories"
              width="2048"
              height="2048"
              decoding="async"
            />
          </figure>
        )}
      </div>
      <DocumentSections sections={document.sections} />
      {document.note && <p className="doc-note">{document.note}</p>}
    </div>
  );
}
