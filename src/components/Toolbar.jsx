export default function Toolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onBold,
  onItalic,
  onUnderline,
  onStrike,
  onHeading,
  onInsertList,
  onInsertNumberedList,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onIndent,
  onOutdent,
  onLink,
  onInsertReference,
  onInsertHorizontalRule,
  onSearch,
  searchValue,
  onSearchChange,
  onFind,
  wordCount,
  characterCount,
  title,
  setTitle,
}) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full max-w-md border border-slate-200 bg-slate-50 px-3 py-2 text-lg font-semibold outline-none focus:border-blue-500"
          placeholder="Document title"
        />
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{characterCount} chars</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
        <button onClick={onUndo} disabled={!canUndo} className="toolbar-button disabled:opacity-40">Undo</button>
        <button onClick={onRedo} disabled={!canRedo} className="toolbar-button disabled:opacity-40">Redo</button>
        <select className="toolbar-button" onChange={(event) => onHeading(event.target.value)} defaultValue="">
          <option value="">Heading</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <button onClick={onBold} className="toolbar-button font-bold">B</button>
        <button onClick={onItalic} className="toolbar-button italic">I</button>
        <button onClick={onUnderline} className="toolbar-button underline">U</button>
        <button onClick={onStrike} className="toolbar-button line-through">S</button>
        <button onClick={onAlignLeft} className="toolbar-button">Align Left</button>
        <button onClick={onAlignCenter} className="toolbar-button">Center</button>
        <button onClick={onAlignRight} className="toolbar-button">Right</button>
        <button onClick={onIndent} className="toolbar-button">Indent</button>
        <button onClick={onOutdent} className="toolbar-button">Outdent</button>
        <button onClick={onInsertList} className="toolbar-button">Bullets</button>
        <button onClick={onInsertNumberedList} className="toolbar-button">Numbers</button>
        <button onClick={onLink} className="toolbar-button">Link</button>
        <button onClick={onInsertHorizontalRule} className="toolbar-button">Line</button>
        <button onClick={onInsertReference} className="toolbar-button bg-blue-600 text-white hover:bg-blue-500">Insert Reference</button>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 px-4 py-2">
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search in document"
          className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-1.5 outline-none focus:border-blue-500"
        />
        <button onClick={onFind} className="toolbar-button">Find</button>
      </div>
    </div>
  );
}
