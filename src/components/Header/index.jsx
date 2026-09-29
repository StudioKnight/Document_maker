export default function Header({ documentTitle, onNewDocument, onDashboard, onExportJson, onExportHtml, onImportJson, onPrint, onToggleReferenceManager, onOpenSample }) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={onDashboard} className="rounded bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200">Home</button>
          <div className="text-sm text-slate-600">Documents</div>
        </div>

        <div className="hidden items-center gap-3 text-sm text-slate-600 md:flex">
          <button className="nav-item">File</button>
          <button className="nav-item">Edit</button>
          <button className="nav-item">View</button>
          <button className="nav-item">Insert</button>
          <button className="nav-item">Format</button>
          <button className="nav-item">Tools</button>
          <button className="nav-item">Help</button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onNewDocument} className="bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">New</button>
          <button onClick={onOpenSample} className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Sample</button>
          <button onClick={onExportJson} className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Export JSON</button>
          <button onClick={onExportHtml} className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Export HTML</button>
          <button onClick={onImportJson} className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Import JSON</button>
          <button onClick={onPrint} className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Print</button>
          <button onClick={onToggleReferenceManager} className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">References</button>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
        {documentTitle || 'Untitled document'}
      </div>
    </header>
  );
}
