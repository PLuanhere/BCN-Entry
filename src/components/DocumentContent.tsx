import type { BcnDocument, DocumentSection } from "../documents";
import { useState } from "react";
import { photoUrl } from "../photoAlbums";
import ContentIcon from "./ContentIcon";

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
            <ContentIcon name={/thời gian|lịch/i.test(section.title) ? "calendar" : index === 0 ? "layers" : "people"} />
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
  const [page, setPage] = useState(0);
  const pageSize = document.sections.length > 2 ? 1 : 2;
  const pageCount = Math.ceil(document.sections.length / pageSize);
  return (
    <div className="document-content">
      <header className="document-heading">
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
      </header>
      <DocumentSections sections={document.sections.slice(page * pageSize, (page + 1) * pageSize)} />
      {pageCount > 1 && <div className="document-pagination"><button className="text-action" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>← Phần trước</button><span>{page + 1} / {pageCount}</span><button className="text-action" disabled={page === pageCount - 1} onClick={() => setPage((value) => value + 1)}>Phần tiếp →</button></div>}
      {document.note && <p className="doc-note">{document.note}</p>}
    </div>
  );
}
