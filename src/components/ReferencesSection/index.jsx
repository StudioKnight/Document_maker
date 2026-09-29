export default function ReferencesSection({ document, onJumpToCitation, onEditReference, onDeleteReference, onOpenUrl }) {
  const references = document.references || [];
  const citationDocument = new DOMParser().parseFromString(document.content || '<p></p>', 'text/html');

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 pt-6">
      <div className="references-page">
        <h2 className="references-heading">References</h2>

        <ol className="reference-list">
          {references.length === 0 ? (
            <li className="text-slate-500">No references yet.</li>
          ) : (
            references.map((ref, index) => {
              const number = index + 1;
              const occurrenceIds = [...citationDocument.querySelectorAll(`[data-ref-id="${ref.id}"]`)]
                .map((node) => node.dataset.citationId)
                .filter(Boolean);

              return (
                <li key={ref.id} id={`reference-${number}`} className="reference-entry">
                  <span className="reference-number">{number}.</span>
                  <div className="reference-entry__body">
                    <div className="reference-entry__text">
                      <span className="reference-backlinks" aria-label="Return to citation">
                      {occurrenceIds.map((citationId, occurrenceIndex) => (
                          <button
                            key={citationId}
                            onClick={() => onJumpToCitation(ref.id, citationId)}
                            aria-label={`Return to citation ${occurrenceIndex + 1}`}
                            title={`Return to citation ${occurrenceIndex + 1}`}
                          >
                            ^<sup>{occurrenceIndex + 1}</sup>
                          </button>
                      ))}
                      </span>{' '}
                      {ref.author ? <>{ref.author}{ref.publicationDate ? ` (${formatDate(ref.publicationDate)})` : ''}. </> : null}
                      {ref.title ? (
                        ref.url
                          ? <a href={ref.url} target="_blank" rel="noreferrer" className="reference-link">“{ref.title}”<span className="external-mark" aria-hidden="true"> ↗</span></a>
                          : <span>“{ref.title}”</span>
                      ) : null}
                      {ref.title && ref.website ? '. ' : ''}
                      {ref.website ? <><cite>{ref.website}</cite>. </> : ''}
                      {ref.accessDate ? <>Retrieved {formatDate(ref.accessDate)}.</> : null}
                      {!ref.author && ref.publicationDate ? <> {formatDate(ref.publicationDate)}.</> : null}
                    </div>

                    <div className="reference-entry__actions">
                      <button onClick={() => onEditReference(ref)}>Edit</button>
                      <button onClick={() => onDeleteReference(ref.id)}>Delete</button>
                      {ref.url ? <button onClick={() => onOpenUrl(ref.url)}>Open URL</button> : null}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ol>
      </div>
    </section>
  );
}
