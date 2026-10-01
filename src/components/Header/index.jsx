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
  onSave,
  onExportJson,
  onExportHtml,
  onImportJson,
  onPrint,
  onToggleReferenceManager,
  onOpenSample,
}) {
  return (
    <header className="word-header">
      <div className="word-titlebar">
        <div className="word-quick-access">
          <button onClick={onSave} title="Save document" aria-label="Save document">💾</button>
          <button onClick={onUndo} title="Undo" aria-label="Undo">↶</button>
          <button onClick={onRedo} title="Redo" aria-label="Redo">↷</button>
          <span className="quick-access-divider" />
        </div>

        <div className="word-titlebar-center">
          <input
            className="word-document-name"
            value={documentTitle || ''}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Document title"
            placeholder="Document1"
          />
          <span className="word-save-status"><span aria-hidden="true">✓</span> {saveStatus}</span>
        </div>
        <button
          className="word-theme-toggle"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDarkMode}
        >
          {isDarkMode ? '☀' : '☾'}
        </button>
        <div className="window-controls" aria-label="Window controls">
          <button type="button" aria-label="Minimize window">—</button>
          <button type="button" aria-label="Restore window">□</button>
          <button type="button" aria-label="Close window" className="window-controls__close">×</button>
        </div>
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
