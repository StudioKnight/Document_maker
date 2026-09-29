import { useEffect } from 'react';

export default function Editor({ content, onChange, onClickCitation, onFocus, onBlur, editorRef }) {
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content, editorRef]);

  return (
    <div className="doc-page">
      <div
        ref={editorRef}
        className="editor-pane"
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        onClick={(event) => {
          const citation = event.target.closest('.citation');
          if (citation) {
            onClickCitation(citation.dataset.refId, citation.dataset.citationId);
          }
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
