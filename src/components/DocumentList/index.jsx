export default function DocumentList({ documents, onNewDocument, onOpenDocument, onDeleteDocument, onDuplicateDocument }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Documents</h1>
        <button onClick={onNewDocument} className="bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">New Document</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.length === 0 ? (
          <div className="col-span-full rounded border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No documents yet. Create a new one to begin.
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.id} className="rounded border border-slate-200 bg-white p-4 shadow-sm">
              <button onClick={() => onOpenDocument(document.id)} className="w-full text-left">
                <div className="mb-2 text-lg font-semibold text-slate-800">{document.title || 'Untitled document'}</div>
                <div className="text-sm text-slate-500">Last edited {new Date(document.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </button>

              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => onDuplicateDocument(document.id)} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">Duplicate</button>
                <button onClick={() => onDeleteDocument(document.id)} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
