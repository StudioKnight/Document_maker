export default function Toolbar({
  onCut,
  onCopy,
  onPaste,
  onFormatPainter,
  onFontFamily,
  onFontSize,
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
  onTextColor,
  onFind,
  onReplace,
  onSelectAll,
  onLink,
  onInsertReference,
  onInsertHorizontalRule,
  onPrint,
  onPreserveSelection,
}) {
  return (
    <div className="document-toolbar border-b border-slate-200 bg-white">
      <div className="document-toolbar__groups">
        <section className="document-toolbar__group">
          <div className="document-toolbar__group-controls ribbon-clipboard">
            <button type="button" onMouseDown={onPreserveSelection} onClick={onPaste} title="Paste" aria-label="Paste" className="ribbon-button ribbon-button--icon-only ribbon-button--paste-grid">
              <span className="ribbon-button__icon" aria-hidden="true">▤</span>
            </button>
            <button type="button" onMouseDown={onPreserveSelection} onClick={onCut} title="Cut" aria-label="Cut" className="ribbon-button ribbon-button--icon-only ribbon-button--cut-grid">
              <span className="ribbon-button__icon" aria-hidden="true">✂</span>
            </button>
            <button type="button" onMouseDown={onPreserveSelection} onClick={onCopy} title="Copy" aria-label="Copy" className="ribbon-button ribbon-button--icon-only ribbon-button--copy-grid">
              <span className="ribbon-button__icon" aria-hidden="true">⧉</span>
            </button>
            <button type="button" onMouseDown={onPreserveSelection} onClick={onFormatPainter} title="Copy formatting, then select text to apply it" aria-label="Format painter" className="ribbon-button ribbon-button--icon-only ribbon-button--format-grid">
              <span className="ribbon-button__icon" aria-hidden="true">▱</span>
            </button>
          </div>
          <span className="document-toolbar__group-label">Clipboard</span>
        </section>

        <section className="document-toolbar__group">
          <div className="document-toolbar__group-controls ribbon-font">
            <div className="ribbon-font__selects">
              <select aria-label="Font family" className="ribbon-select ribbon-select--family" onMouseDown={onPreserveSelection} onChange={(event) => onFontFamily(event.target.value)} defaultValue="Calibri">
              <option value="Calibri">Calibri</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              </select>
              <select aria-label="Font size" className="ribbon-select ribbon-select--size" onMouseDown={onPreserveSelection} onChange={(event) => onFontSize(event.target.value)} defaultValue="3">
                <option value="2">10</option>
                <option value="3">12</option>
                <option value="4">14</option>
                <option value="5">18</option>
                <option value="6">24</option>
              </select>
            </div>
            <div className="ribbon-tool-row ribbon-font__tools">
              <button type="button" onMouseDown={onPreserveSelection} onClick={onBold} title="Bold" aria-label="Bold" className="ribbon-button ribbon-icon-button font-bold">B</button>
              <button type="button" onMouseDown={onPreserveSelection} onClick={onItalic} title="Italic" aria-label="Italic" className="ribbon-button ribbon-icon-button italic">I</button>
              <button type="button" onMouseDown={onPreserveSelection} onClick={onUnderline} title="Underline" aria-label="Underline" className="ribbon-button ribbon-icon-button underline">U</button>
              <button type="button" onMouseDown={onPreserveSelection} onClick={onStrike} title="Strikethrough" aria-label="Strikethrough" className="ribbon-button ribbon-icon-button line-through">S</button>
              <label className="ribbon-color-control" title="Text color">
                <span aria-hidden="true">A</span>
                <input aria-label="Text color" type="color" onMouseDown={onPreserveSelection} onChange={(event) => onTextColor(event.target.value)} />
              </label>
            </div>
          </div>
          <span className="document-toolbar__group-label">Font</span>
        </section>

        <section className="document-toolbar__group">
          <div className="document-toolbar__group-controls ribbon-paragraph">
            <div className="ribbon-tool-row">
              <button type="button" onMouseDown={onPreserveSelection} onClick={onInsertList} title="Bulleted list" aria-label="Bulleted list" className="ribbon-button ribbon-icon-button">•≡</button>
              <button type="button" onMouseDown={onPreserveSelection} onClick={onInsertNumberedList} title="Numbered list" aria-label="Numbered list" className="ribbon-button ribbon-icon-button">1≡</button>
              <button type="button" onMouseDown={onPreserveSelection} onClick={onOutdent} title="Decrease indent" aria-label="Decrease indent" className="ribbon-button ribbon-icon-button">⇤</button>
              <button type="button" onMouseDown={onPreserveSelection} onClick={onIndent} title="Increase indent" aria-label="Increase indent" className="ribbon-button ribbon-icon-button">⇥</button>
            </div>
            <div className="ribbon-tool-row">
              <button type="button" onMouseDown={onPreserveSelection} onClick={onAlignLeft} title="Align left" aria-label="Align left" className="ribbon-button ribbon-icon-button">≡</button>
              <button type="button" onMouseDown={onPreserveSelection} onClick={onAlignCenter} title="Center" aria-label="Center" className="ribbon-button ribbon-icon-button">☰</button>
              <button type="button" onMouseDown={onPreserveSelection} onClick={onAlignRight} title="Align right" aria-label="Align right" className="ribbon-button ribbon-icon-button">☷</button>
            </div>
          </div>
          <span className="document-toolbar__group-label">Paragraph</span>
        </section>

        <section className="document-toolbar__group">
          <div className="document-toolbar__group-controls ribbon-style-gallery">
            <button type="button" onMouseDown={onPreserveSelection} onClick={() => onHeading('p')} className="ribbon-style-card">
              <span className="ribbon-style-card__sample ribbon-style-card__sample--normal">Normal</span>
            </button>
            <button type="button" onMouseDown={onPreserveSelection} onClick={() => onHeading('h1')} className="ribbon-style-card">
              <span className="ribbon-style-card__sample ribbon-style-card__sample--heading-one">Heading 1</span>
            </button>
            <button type="button" onMouseDown={onPreserveSelection} onClick={() => onHeading('h2')} className="ribbon-style-card">
              <span className="ribbon-style-card__sample ribbon-style-card__sample--heading-two">Heading 2</span>
            </button>
            <button type="button" onMouseDown={onPreserveSelection} onClick={() => onHeading('h3')} className="ribbon-style-card">
              <span className="ribbon-style-card__sample ribbon-style-card__sample--heading-three">Heading 3</span>
            </button>
          </div>
          <span className="document-toolbar__group-label">Styles</span>
        </section>

        <section className="document-toolbar__group">
          <div className="document-toolbar__group-controls ribbon-editing ribbon-editing--icon-grid">
            <button onClick={() => {
              const searchText = window.prompt('Find text');
              if (searchText !== null) onFind(searchText);
            }} className="ribbon-edit-button ribbon-button--icon-only" title="Find text" aria-label="Find text"><span aria-hidden="true">⌕</span></button>
            <button onClick={() => {
              const searchText = window.prompt('Text to find');
              if (searchText === null) return;
              const replacementText = window.prompt('Replace with', '');
              if (replacementText !== null) onReplace(searchText, replacementText);
            }} className="ribbon-edit-button ribbon-button--icon-only" title="Replace text" aria-label="Replace text"><span aria-hidden="true">↔</span></button>
            <button onClick={onSelectAll} className="ribbon-edit-button ribbon-button--icon-only" title="Select all text" aria-label="Select all text"><span aria-hidden="true">▤</span></button>
            <button onMouseDown={onPreserveSelection} onClick={onLink} className="ribbon-edit-button ribbon-button--icon-only" title="Insert link" aria-label="Insert link"><span aria-hidden="true">↗</span></button>
          </div>
          <span className="document-toolbar__group-label">Editing</span>
        </section>

        <section className="document-toolbar__group">
          <div className="document-toolbar__group-controls ribbon-export ribbon-export--icon-grid">
            <button type="button" onClick={onPrint} className="ribbon-pdf-button ribbon-button--icon-only ribbon-pdf-button--icon-only" title="Print or save as PDF" aria-label="Print or save as PDF">
              <span className="ribbon-pdf-button__icon" aria-hidden="true">📄</span>
            </button>
            <button type="button" onMouseDown={onPreserveSelection} onClick={onInsertHorizontalRule} className="ribbon-button ribbon-button--icon-only" title="Insert horizontal line" aria-label="Insert horizontal line">
              <span className="ribbon-button__icon" aria-hidden="true">―</span>
            </button>
            <button type="button" onMouseDown={onPreserveSelection} onClick={onInsertReference} className="ribbon-button ribbon-button--icon-only ribbon-reference-button" title="Insert reference" aria-label="Insert reference">
              <span className="ribbon-button__icon" aria-hidden="true">[1]</span>
            </button>
          </div>
          <span className="document-toolbar__group-label">Export</span>
        </section>
      </div>
    </div>
  );
}
