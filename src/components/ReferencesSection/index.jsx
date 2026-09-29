export default function ReferencesSection({ document, onJumpToCitation, onEditReference, onDeleteReference, onOpenUrl }) {
  const references = document.references || [];

  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 pt-6">
      <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">References</h2>

        <div className="space-y-4">
          {references.length === 0 ? (
            <div className="text-slate-500">No references yet.</div>
          ) : (
            references.map((ref, index) => {
              const number = index + 1;
              const occurrenceIds = [...new DOMParser().parseFromString(document.content || '<p></p>', 'text/html').querySelectorAll(`[data-ref-id="${ref.id}"]`)].map((node) => node.dataset.citationId).filter(Boolean);

              return (
                <div key={ref.id} id={`reference-${number}`} className="reference-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-base leading-relaxed">
                      <span className="font-semibold">[{number}]</span>{' '}
                      {ref.author ? `${ref.author}. ` : ''}
                      {ref.title ? `<em>${ref.title}</em>`.replace(/<em>/g, '"').replace(/<\/em>/g, '"') : ''}
                      {ref.website ? `${ref.website}. ` : ''}
                      {ref.url ? (
                        <a href={ref.url} target="_blank" rel="noreferrer" className="text-blue-700 underline">{ref.url}</a>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {occurrenceIds.map((citationId, occurrenceIndex) => (
                        <button key={citationId} onClick={() => onJumpToCitation(ref.id, citationId)} className="text-xs text-blue-700 hover:underline">
                          [↑{occurrenceIndex + 1}]
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                    <button onClick={() => onEditReference(ref)} className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-50">Edit</button>
                    <button onClick={() => onDeleteReference(ref.id)} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100">Delete</button>
                    {ref.url ? <button onClick={() => onOpenUrl(ref.url)} className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-50">Open URL</button> : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
