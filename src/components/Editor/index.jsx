import { useEffect } from 'react';

function createAutoList(type = 'ul') {
  const list = document.createElement(type);
  const item = document.createElement('li');
  item.innerHTML = '<br>';
  list.appendChild(item);
  return { list, item };
}

function getTextBeforeCaret(node, offset) {
  if (node.nodeType !== Node.TEXT_NODE) return '';
  return node.textContent.slice(0, offset);
}

function replaceTextAtCaret(selection, replacementText) {
  const anchorNode = selection.anchorNode;
  const offset = selection.anchorOffset;

  if (!anchorNode || anchorNode.nodeType !== Node.TEXT_NODE) return false;

  const before = anchorNode.textContent.slice(0, offset);
  const after = anchorNode.textContent.slice(offset);
  anchorNode.textContent = `${before}${replacementText}${after}`;
  const caretOffset = before.length + replacementText.length;

  const range = document.createRange();
  range.setStart(anchorNode, caretOffset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);

  return true;
}

function handleMarkdownListShortcut(event) {
  if (event.key !== ' ' && event.key !== 'Spacebar') return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const anchorNode = selection.anchorNode;
  if (!anchorNode) return;

  const beforeCaret = getTextBeforeCaret(anchorNode, selection.anchorOffset);
  const matchesBullet = /(?:^|\s)[*-]$/.test(beforeCaret);
  const matchesNumber = /(?:^|\s)\d+\.$/.test(beforeCaret);

  if (!matchesBullet && !matchesNumber) return;

  event.preventDefault();

  const cleanedText = beforeCaret.replace(/(?:\s)?[*-]$/, '').replace(/(?:\s)?\d+\.$/, '');
  const textNode = anchorNode.nodeType === Node.TEXT_NODE ? anchorNode : document.createTextNode('');

  if (anchorNode.nodeType === Node.TEXT_NODE) {
    const afterText = anchorNode.textContent.slice(selection.anchorOffset);
    anchorNode.textContent = `${cleanedText}${afterText}`;
  }

  const range = document.createRange();
  const { list, item } = createAutoList(matchesNumber ? 'ol' : 'ul');

  if (textNode.nodeType === Node.TEXT_NODE) {
    range.setStart(textNode, cleanedText.length);
    range.collapse(true);
  }

  range.insertNode(list);

  const caretRange = document.createRange();
  caretRange.selectNodeContents(item);
  caretRange.collapse(true);

  selection.removeAllRanges();
  selection.addRange(caretRange);
}

function handleMarkdownBlockShortcut(event) {
  if (event.key !== 'Enter') return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const anchorNode = selection.anchorNode;
  if (!anchorNode) return;

  const container = anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode;
  const content = container?.textContent || '';
  const trimmed = content.trim();

  if (!trimmed) return;

  if (trimmed === '>') {
    event.preventDefault();
    const blockquote = document.createElement('blockquote');
    blockquote.innerHTML = '<br>';
    container.replaceWith(blockquote);
    const caretRange = document.createRange();
    caretRange.selectNodeContents(blockquote);
    caretRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caretRange);
    return;
  }

  if (trimmed === '```') {
    event.preventDefault();
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.innerHTML = '<br>';
    pre.appendChild(code);
    container.replaceWith(pre);
    const caretRange = document.createRange();
    caretRange.selectNodeContents(code);
    caretRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caretRange);
    return;
  }

  if (/^-{3,}$/.test(trimmed)) {
    event.preventDefault();
    const hr = document.createElement('hr');
    container.replaceWith(hr);
    const paragraph = document.createElement('p');
    paragraph.innerHTML = '<br>';
    hr.after(paragraph);
    const caretRange = document.createRange();
    caretRange.selectNodeContents(paragraph);
    caretRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caretRange);
  }
}

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
        onKeyDown={(event) => {
          handleMarkdownListShortcut(event);
          handleMarkdownBlockShortcut(event);
        }}
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
