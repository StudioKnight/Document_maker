const tabs = ['File', 'Home', 'Insert', 'Layout', 'References', 'Review', 'View'];

export default function Header({
  documentTitle,
  setTitle,
  activeTab,
  onTabChange,
  saveStatus,
  onNewDocument,
  isDarkMode,
  onToggleDarkMode,
  onUndo,
  onRedo,
  onDashboard,
  onExportJson,
  onExportHtml,
  onImportJson,
  onPrint,
  onToggleReferenceManager,
  onOpenSample,
  searchValue,
  onSearchChange,
  onFind,
}) {
  return (
    <header className="word-header">
      <div className="word-titlebar">
        <div className="word-quick-access">
          <button onClick={onDashboard} title="My documents" aria-label="My documents">⌂</button>
          <button onClick={onUndo} title="Undo" aria-label="Undo">↶</button>
          <button onClick={onRedo} title="Redo" aria-label="Redo">↷</button>
          <span className="quick-access-divider" />
          <span className="word-app-mark" aria-hidden="true">W</span>
        </div>

        <input
          className="word-document-name"
          value={documentTitle || ''}
          onChange={(event) => setTitle(event.target.value)}
          aria-label="Document title"
          placeholder="Untitled document"
        />
        <span className="word-title-suffix">- Word</span>

        <label className="word-command-search">
          <span aria-hidden="true">⌕</span>
          <input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && onFind()} placeholder="Tell me what you want to do" />
        </label>

        <span className="word-save-status"><span aria-hidden="true">✓</span> {saveStatus}</span>
        <button
          className="word-theme-toggle"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDarkMode}
        >
          {isDarkMode ? '☀' : '☾'}
        </button>
        <button className="word-share-button" onClick={onNewDocument}>＋ New</button>
      </div>

      <nav className="word-tabs" aria-label="Document tools">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`word-tab ${activeTab === tab ? 'is-active' : ''} ${tab === 'File' ? 'word-tab--file' : ''}`}
            onClick={() => tab === 'File' ? onDashboard() : onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
        <div className="word-tab-actions">
          <button onClick={onToggleReferenceManager} title="Toggle references panel">References panel</button>
          <details className="word-file-menu">
            <summary aria-label="File actions" title="File actions">•••</summary>
            <div className="word-file-menu__items">
              <button onClick={onOpenSample}>Open sample</button>
              <button onClick={onImportJson}>Import JSON</button>
              <button onClick={onExportJson}>Export JSON</button>
              <button onClick={onExportHtml}>Export HTML</button>
              <button onClick={onPrint}>Print / Save as PDF</button>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
