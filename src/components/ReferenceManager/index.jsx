export default function ReferenceManager({ references, search, onSearchChange, onAddReference, onEditReference, onDeleteReference, onOpenUrl, onJumpToCitation }) {
  const filtered = references.filter((ref) => {
    const haystack = `${ref.title} ${ref.author} ${ref.website} ${ref.notes}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <aside className="w-full border-t border-slate-200 bg-white p-4 lg:w-80 lg:border-l lg:border-t-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">References</h2>
        <button onClick={onAddReference} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500">Add</button>
      </div>

      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search references"
        className="mb-4 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded border border-dashed border-slate-300 p-3 text-sm text-slate-500">No matching references.</div>
        ) : (
          filtered.map((ref, index) => (
            <div key={ref.id} className="rounded border border-slate-200 p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <button onClick={() => onJumpToCitation(ref.id)} className="text-left text-sm font-semibold text-blue-700 hover:underline">
                  [{index + 1}] {ref.title || 'Untitled source'}
                </button>
              </div>

              <div className="text-xs text-slate-600">
                {ref.author || 'Unknown author'}
                {ref.website ? ` • ${ref.website}` : ''}
              </div>

              {ref.url ? (
                <a href={ref.url} target="_blank" rel="noreferrer" className="mt-2 block break-all text-xs text-blue-600 hover:underline">
                  {ref.url}
                </a>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => onJumpToCitation(ref.id)} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">Jump</button>
                <button onClick={() => onEditReference(ref)} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">Edit</button>
                <button onClick={() => onOpenUrl(ref.url)} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50" disabled={!ref.url}>Open</button>
                <button onClick={() => onDeleteReference(ref.id)} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
