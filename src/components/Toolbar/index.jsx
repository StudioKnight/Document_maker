function ToolButton({ children, onClick, onMouseDown, title, active = false }) {
  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      onClick={onClick}
      title={title}
      className={`ribbon-tool ${active ? 'ribbon-tool--primary' : ''}`}
    >
      {children}
    </button>
  );
}

function ToolGroup({ label, children }) {
  return (
    <div className="word-ribbon-group">
      <div className="word-ribbon-group__tools">{children}</div>
      <span className="word-ribbon-group__label">{label}</span>
    </div>
  );
}

export default function Toolbar({
  activeTab,
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
  onPrepareInsertReference,
  onInsertHorizontalRule,
  onPreserveSelection,
  onFontSize,
  onTextColor,
  onFind,
  onToggleReferenceManager,
  searchValue,
  wordCount,
  characterCount,
}) {
  return (
    <div className="word-ribbon">
      {activeTab === 'Home' && (
        <div className="word-ribbon__content">
          <ToolGroup label="Clipboard">
            <ToolButton title="Undo" onMouseDown={onPreserveSelection} onClick={onUndo}>↶</ToolButton>
            <ToolButton title="Redo" onMouseDown={onPreserveSelection} onClick={onRedo}>↷</ToolButton>
          </ToolGroup>
          <ToolGroup label="Font">
            <select aria-label="Text style" className="word-select word-select--style" onMouseDown={onPreserveSelection} onChange={(event) => onHeading(event.target.value)} defaultValue="">
              <option value="">Normal</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option>
            </select>
            <select aria-label="Font size" className="word-select word-select--size" onMouseDown={onPreserveSelection} onChange={(event) => onFontSize(event.target.value)} defaultValue="3">
              <option value="2">10</option><option value="3">12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option>
            </select>
            <div className="word-icon-row">
              <ToolButton title="Bold" onMouseDown={onPreserveSelection} onClick={onBold}><strong>B</strong></ToolButton>
              <ToolButton title="Italic" onMouseDown={onPreserveSelection} onClick={onItalic}><em>I</em></ToolButton>
              <ToolButton title="Underline" onMouseDown={onPreserveSelection} onClick={onUnderline}><u>U</u></ToolButton>
              <ToolButton title="Strikethrough" onMouseDown={onPreserveSelection} onClick={onStrike}><s>S</s></ToolButton>
              <label className="word-color-tool" title="Text color">
                A<input aria-label="Text color" type="color" onMouseDown={onPreserveSelection} onChange={(event) => onTextColor(event.target.value)} />
              </label>
            </div>
          </ToolGroup>
          <ToolGroup label="Paragraph">
            <div className="word-icon-row">
              <ToolButton title="Align left" onMouseDown={onPreserveSelection} onClick={onAlignLeft}>☰</ToolButton>
              <ToolButton title="Center" onMouseDown={onPreserveSelection} onClick={onAlignCenter}>≡</ToolButton>
              <ToolButton title="Align right" onMouseDown={onPreserveSelection} onClick={onAlignRight}>☷</ToolButton>
              <ToolButton title="Indent" onMouseDown={onPreserveSelection} onClick={onIndent}>⇥</ToolButton>
              <ToolButton title="Outdent" onMouseDown={onPreserveSelection} onClick={onOutdent}>⇤</ToolButton>
              <ToolButton title="Bulleted list" onMouseDown={onPreserveSelection} onClick={onInsertList}>•≡</ToolButton>
              <ToolButton title="Numbered list" onMouseDown={onPreserveSelection} onClick={onInsertNumberedList}>1≡</ToolButton>
            </div>
            <ToolButton title="Insert link" onMouseDown={onPreserveSelection} onClick={onLink}>Link</ToolButton>
          </ToolGroup>
          <ToolGroup label="References">
            <ToolButton active title="Insert reference at cursor" onMouseDown={onPrepareInsertReference} onClick={onInsertReference}>＋ Citation</ToolButton>
          </ToolGroup>
        </div>
      )}

      {activeTab === 'Insert' && (
        <div className="word-ribbon__content">
          <ToolGroup label="Links">
            <ToolButton onMouseDown={onPreserveSelection} onClick={onLink}>Link</ToolButton>
            <ToolButton onMouseDown={onPreserveSelection} onClick={onInsertHorizontalRule}>Horizontal line</ToolButton>
          </ToolGroup>
          <ToolGroup label="Citations">
            <ToolButton active onMouseDown={onPrepareInsertReference} onClick={onInsertReference}>＋ Insert reference</ToolButton>
            <ToolButton onClick={onToggleReferenceManager}>Reference manager</ToolButton>
          </ToolGroup>
        </div>
      )}

      {activeTab === 'Layout' && (
        <div className="word-ribbon__content">
          <ToolGroup label="Paragraph">
            <ToolButton onMouseDown={onPreserveSelection} onClick={onAlignLeft}>Align left</ToolButton>
            <ToolButton onMouseDown={onPreserveSelection} onClick={onAlignCenter}>Center</ToolButton>
            <ToolButton onMouseDown={onPreserveSelection} onClick={onAlignRight}>Align right</ToolButton>
            <ToolButton onMouseDown={onPreserveSelection} onClick={onIndent}>Increase indent</ToolButton>
            <ToolButton onMouseDown={onPreserveSelection} onClick={onOutdent}>Decrease indent</ToolButton>
          </ToolGroup>
          <ToolGroup label="Lists">
            <ToolButton onMouseDown={onPreserveSelection} onClick={onInsertList}>Bullets</ToolButton>
            <ToolButton onMouseDown={onPreserveSelection} onClick={onInsertNumberedList}>Numbering</ToolButton>
          </ToolGroup>
        </div>
      )}

      {activeTab === 'References' && (
        <div className="word-ribbon__content">
          <ToolGroup label="Sources">
            <ToolButton active onMouseDown={onPrepareInsertReference} onClick={onInsertReference}>＋ Insert reference</ToolButton>
            <ToolButton onClick={onToggleReferenceManager}>Manage references</ToolButton>
          </ToolGroup>
        </div>
      )}

      {activeTab === 'Review' && (
        <div className="word-ribbon__content">
          <ToolGroup label="Proofing">
            <ToolButton onClick={onFind}>Find “{searchValue || 'text'}”</ToolButton>
            <span className="word-ribbon-note">{wordCount} words · {characterCount} characters</span>
          </ToolGroup>
        </div>
      )}

      {activeTab === 'View' && (
        <div className="word-ribbon__content">
          <ToolGroup label="Show">
            <ToolButton onClick={onToggleReferenceManager}>Toggle references panel</ToolButton>
            <span className="word-ribbon-note">Print layout · 100%</span>
          </ToolGroup>
        </div>
      )}
    </div>
  );
}
