import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import DocumentList from './components/DocumentList';
import ReferenceDialog from './components/ReferenceDialog';
import ReferenceManager from './components/ReferenceManager';
import ReferencesSection from './components/ReferencesSection';
import {
  createDocument,
  createReference,
  deleteReference,
  ensureReferenceIds,
  exportDocumentAsHtml,
  exportDocumentAsJson,
  getCharacterCount,
  getReferenceNumber,
  importDocumentJson,
  renumberReferences,
  updateReference,
  getWordCount,
} from './utils/documentUtils';
import { readActiveDocumentId, readDocuments, writeActiveDocumentId, writeDocuments } from './storage/documentStorage';

function createSampleDocument() {
  const createdAt = new Date().toISOString();
  return {
    id: 'doc-sample-1',
    title: 'History of Philippine Basketball',
    content: `
      <h2>History of Philippine Basketball</h2>
      <p>Basketball became one of the major sports in the Philippines during the twentieth century <span class="citation" data-ref-id="ref-sample-1" data-citation-id="citation-1" contenteditable="false">[1]</span>. The country later developed one of Asia's most established basketball traditions <span class="citation" data-ref-id="ref-sample-2" data-citation-id="citation-2" contenteditable="false">[2]</span>.</p>
      <p>Major leagues, school competitions, and international success gave the sport a lasting cultural importance in the archipelago.</p>
    `,
    references: [
      {
        id: 'ref-sample-1',
        title: 'Philippine basketball',
        author: 'Wikipedia contributors',
        website: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Philippine_basketball',
        publicationDate: '',
        accessDate: '2026-09-29',
        notes: 'Overview of the sport in the Philippines.',
      },
      {
        id: 'ref-sample-2',
        title: 'Basketball in the Philippines',
        author: 'National Basketball Association',
        website: 'NBA.com',
        url: 'https://www.nba.com/',
        publicationDate: '',
        accessDate: '2026-09-29',
        notes: 'Background on basketball culture and commercial reach.',
      },
    ],
    createdAt,
    updatedAt: createdAt,
  };
}

function App() {
  const initialDocuments = useMemo(() => {
    const existing = readDocuments();
    if (existing.length > 0) return existing.map(ensureReferenceIds);

    const sample = createSampleDocument();
    writeDocuments([sample]);
    return [sample];
  }, []);

  const [documents, setDocuments] = useState(initialDocuments);
  const [activeDocId, setActiveDocId] = useState(() => readActiveDocumentId() || initialDocuments[0]?.id || '');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showReferenceManager, setShowReferenceManager] = useState(true);
  const [referenceDialogOpen, setReferenceDialogOpen] = useState(false);
  const [referenceDraft, setReferenceDraft] = useState(null);
  const [editingReferenceId, setEditingReferenceId] = useState(null);
  const [referenceSearch, setReferenceSearch] = useState('');
  const [status, setStatus] = useState('Saved');
  const [searchValue, setSearchValue] = useState('');
  const [activeRibbonTab, setActiveRibbonTab] = useState('Home');
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('document-maker-theme') === 'dark');
  const editorRef = useRef(null);
  const citationRangeRef = useRef(null);

  const activeDocument = useMemo(
    () => documents.find((document) => document.id === activeDocId) || documents[0] || null,
    [documents, activeDocId],
  );

  useEffect(() => {
    if (!activeDocument) return;
    writeActiveDocumentId(activeDocument.id);
  }, [activeDocument]);

  useEffect(() => {
    localStorage.setItem('document-maker-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (!documents.length) {
      const sample = createSampleDocument();
      setDocuments([sample]);
      setActiveDocId(sample.id);
      writeDocuments([sample]);
      return;
    }

    if (!activeDocId && documents[0]) {
      setActiveDocId(documents[0].id);
    }
  }, [documents, activeDocId]);

  useEffect(() => {
    if (!activeDocument) return;
    const timer = setTimeout(() => {
      writeDocuments(documents);
      setStatus('Saved');
    }, 250);
    return () => clearTimeout(timer);
  }, [documents, activeDocument]);

  useEffect(() => {
    if (editorRef.current && activeDocument) {
      editorRef.current.innerHTML = activeDocument.content || '<p></p>';
    }
  }, [activeDocument?.id]);

  const updateDocument = (updater) => {
    setStatus('Saving...');
    setDocuments((previous) => {
      const next = previous.map((document) => (document.id === activeDocId ? updater(document) : document));
      writeDocuments(next);
      return next;
    });
  };

  const persistDocument = (nextDocument) => {
    setStatus('Saving...');
    setDocuments((previous) => {
      const next = previous.map((document) => (document.id === activeDocument.id ? nextDocument : document));
      writeDocuments(next);
      return next;
    });
  };

  const createNewDocument = () => {
    const newDoc = createDocument({ title: 'Untitled document' });
    setDocuments((previous) => {
      const next = [...previous, newDoc];
      writeDocuments(next);
      return next;
    });
    setActiveDocId(newDoc.id);
    setShowDashboard(false);
    setReferenceSearch('');
    setStatus('Saved');
  };

  const deleteDocument = (documentId) => {
    const remaining = documents.filter((document) => document.id !== documentId);
    setDocuments(remaining);
    writeDocuments(remaining);

    if (documentId === activeDocId) {
      const fallback = remaining[0];
      if (fallback) {
        setActiveDocId(fallback.id);
      } else {
        setActiveDocId('');
      }
    }
  };

  const duplicateDocument = (documentId) => {
    const source = documents.find((document) => document.id === documentId);
    if (!source) return;

    const copied = {
      ...source,
      id: `doc-copy-${Date.now()}`,
      title: `${source.title || 'Untitled document'} Copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      references: (source.references || []).map((ref) => ({ ...ref, id: `ref-${Date.now()}-${Math.random().toString(16).slice(2)}` })),
      content: source.content,
    };

    const referenceIdMap = new Map((source.references || []).map((ref, index) => [ref.id, copied.references[index].id]));
    const parser = new DOMParser();
    const copiedContent = parser.parseFromString(copied.content || '<p></p>', 'text/html');
    copiedContent.querySelectorAll('[data-ref-id]').forEach((citation) => {
      const copiedRefId = referenceIdMap.get(citation.dataset.refId);
      if (copiedRefId) citation.dataset.refId = copiedRefId;
    });
    copied.content = copiedContent.body.innerHTML;

    const next = [...documents, copied];
    setDocuments(next);
    writeDocuments(next);
    setActiveDocId(copied.id);
    setShowDashboard(false);
  };

  const insertHtmlAtCursor = (html) => {
    const editor = editorRef.current;
    if (!editor) return activeDocument?.content || '<p></p>';

    editor.focus();
    const selection = window.getSelection();
    const savedRange = citationRangeRef.current;
    if (savedRange && editor.contains(savedRange.commonAncestorContainer) && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
    citationRangeRef.current = null;

    if (!selection || selection.rangeCount === 0) {
      editor.innerHTML = `${editor.innerHTML}${html}`;
      return editor.innerHTML;
    }

    const range = selection.getRangeAt(0);
    const fragment = range.createContextualFragment(html);
    range.deleteContents();
    range.insertNode(fragment);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    return editor.innerHTML;
  };

  const handleReferenceSave = (form) => {
    if (!activeDocument) return;

    const normalized = {
      title: form.title || 'Untitled source',
      author: form.author || '',
      website: form.website || '',
      url: form.url || '',
      publicationDate: form.publicationDate || '',
      accessDate: form.accessDate || '',
      notes: form.notes || '',
    };

    if (editingReferenceId) {
      const updatedDoc = updateReference(activeDocument, editingReferenceId, normalized);
      persistDocument(updatedDoc);
      setReferenceDialogOpen(false);
      setEditingReferenceId(null);
      setReferenceDraft(null);
      return;
    }

    const normalizeKey = (value) => value.trim().toLowerCase();
    const existingReference = (activeDocument.references || []).find((reference) => {
      if (normalized.url && reference.url) {
        return normalizeKey(normalized.url) === normalizeKey(reference.url);
      }
      return normalizeKey(reference.title) === normalizeKey(normalized.title)
        && normalizeKey(reference.author || '') === normalizeKey(normalized.author)
        && normalizeKey(reference.website || '') === normalizeKey(normalized.website);
    });

    if (existingReference) {
      insertCitation(existingReference);
      setReferenceDialogOpen(false);
      setReferenceDraft(null);
      return;
    }

    const nextReference = createReference(normalized);
    const refs = [...(activeDocument.references || []), nextReference];
    const nextDoc = renumberReferences({ ...activeDocument, references: refs });
    const number = getReferenceNumber(nextDoc, nextReference.id);
    const citationId = `citation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const citationMarkup = `<span class="citation" data-ref-id="${nextReference.id}" data-citation-id="${citationId}" contenteditable="false">[${number}]</span>&nbsp;`;
    const updatedContent = insertHtmlAtCursor(citationMarkup);
    const finalizedDoc = { ...nextDoc, content: updatedContent, updatedAt: new Date().toISOString() };
    persistDocument(finalizedDoc);
    setReferenceDialogOpen(false);
    setReferenceDraft(null);
  };

  const insertCitation = (reference) => {
    if (!activeDocument || !reference) return;
    const number = getReferenceNumber(activeDocument, reference.id);
    if (!number) return;
    const citationId = `citation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const citationMarkup = `<span class="citation" data-ref-id="${reference.id}" data-citation-id="${citationId}" contenteditable="false">[${number}]</span>&nbsp;`;
    const updatedContent = insertHtmlAtCursor(citationMarkup);
    persistDocument({ ...activeDocument, content: updatedContent, updatedAt: new Date().toISOString() });
  };

  const openReferenceDialog = (reference = null) => {
    if (!reference && editorRef.current) {
      const selection = window.getSelection();
      if (selection?.rangeCount && editorRef.current.contains(selection.anchorNode)) {
        citationRangeRef.current = selection.getRangeAt(0).cloneRange();
      }
    }
    setEditingReferenceId(reference?.id || null);
    setReferenceDraft(reference || null);
    setReferenceDialogOpen(true);
  };

  const handleDeleteReference = (refId) => {
    if (!activeDocument) return;
    const nextDocument = deleteReference(activeDocument, refId);
    persistDocument(nextDocument);
  };

  const handleEditReference = (reference) => {
    openReferenceDialog(reference);
  };

  const jumpToCitation = (refId, citationId = null) => {
    const target = citationId
      ? document.querySelector(`[data-citation-id="${citationId}"]`)
      : document.querySelector(`[data-ref-id="${refId}"]`);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('ring-2', 'ring-blue-400');
      setTimeout(() => target.classList.remove('ring-2', 'ring-blue-400'), 1200);
    }
  };

  const handleCitationClick = (refId) => {
    const refNumber = getReferenceNumber(activeDocument, refId);
    const referenceCard = document.getElementById(`reference-${refNumber}`);
    if (referenceCard) {
      referenceCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      referenceCard.classList.add('ring-2', 'ring-blue-400');
      setTimeout(() => referenceCard.classList.remove('ring-2', 'ring-blue-400'), 1200);
    }
  };

  const applyFormatting = (command, value = null) => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (citationRangeRef.current && selection) {
      selection.removeAllRanges();
      selection.addRange(citationRangeRef.current);
    }
    citationRangeRef.current = null;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    const currentHtml = editorRef.current.innerHTML;
    updateDocument((documentData) => ({ ...documentData, content: currentHtml, updatedAt: new Date().toISOString() }));
  };

  const handleHeading = (value) => {
    if (!value) return;
    applyFormatting('formatBlock', value);
  };

  const handleInsertList = () => applyFormatting('insertUnorderedList');
  const handleInsertNumberedList = () => applyFormatting('insertOrderedList');
  const handleAlignLeft = () => applyFormatting('justifyLeft');
  const handleAlignCenter = () => applyFormatting('justifyCenter');
  const handleAlignRight = () => applyFormatting('justifyRight');
  const handleIndent = () => applyFormatting('indent');
  const handleOutdent = () => applyFormatting('outdent');
  const handleBold = () => applyFormatting('bold');
  const handleItalic = () => applyFormatting('italic');
  const handleUnderline = () => applyFormatting('underline');
  const handleStrike = () => applyFormatting('strikeThrough');
  const handleHorizontalRule = () => applyFormatting('insertHorizontalRule');
  const handleFontSize = (size) => applyFormatting('fontSize', size);
  const handleTextColor = (color) => applyFormatting('foreColor', color);

  const handleHistoryCommand = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command);
    const currentHtml = editorRef.current.innerHTML;
    updateDocument((documentData) => ({ ...documentData, content: currentHtml, updatedAt: new Date().toISOString() }));
  };

  const captureEditorSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      citationRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const handleLinkInsert = () => {
    const url = window.prompt('Enter URL', 'https://');
    if (!url) return;
    applyFormatting('createLink', url);
  };

  const handleFind = () => {
    if (searchValue.trim()) {
      window.find(searchValue.trim());
    }
  };

  const handleEditorChange = (html) => {
    if (!activeDocument) return;
    const nextDoc = renumberReferences({
      ...activeDocument,
      content: html,
      updatedAt: new Date().toISOString(),
    });
    persistDocument(nextDoc);
  };

  const handleDocumentTitleChange = (newTitle) => {
    if (!activeDocument) return;
    const nextDoc = { ...activeDocument, title: newTitle, updatedAt: new Date().toISOString() };
    persistDocument(nextDoc);
  };

  const handleExportJson = () => {
    if (!activeDocument) return;
    const blob = new Blob([exportDocumentAsJson(activeDocument)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(activeDocument.title || 'document').replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHtml = () => {
    if (!activeDocument) return;
    const html = exportDocumentAsHtml(activeDocument);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(activeDocument.title || 'document').replace(/\s+/g, '-').toLowerCase()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = importDocumentJson(text);
      const normalized = ensureReferenceIds(imported);
      const next = [...documents, normalized];
      setDocuments(next);
      writeDocuments(next);
      setActiveDocId(normalized.id);
      setShowDashboard(false);
      event.target.value = '';
    } catch (error) {
      window.alert('The imported file is not valid JSON for this application.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenSample = () => {
    const sample = createSampleDocument();
    const next = [...documents, sample];
    setDocuments(next);
    writeDocuments(next);
    setActiveDocId(sample.id);
    setShowDashboard(false);
  };

  const wordCount = activeDocument ? getWordCount(activeDocument.content) : 0;
  const characterCount = activeDocument ? getCharacterCount(activeDocument.content) : 0;

  return (
    <div className={`word-app ${isDarkMode ? 'theme-dark' : ''}`}>
      <Header
        documentTitle={activeDocument?.title || 'Untitled document'}
        setTitle={handleDocumentTitleChange}
        activeTab={activeRibbonTab}
        onTabChange={setActiveRibbonTab}
        saveStatus={status}
        onNewDocument={createNewDocument}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((current) => !current)}
        onUndo={() => handleHistoryCommand('undo')}
        onRedo={() => handleHistoryCommand('redo')}
        onDashboard={() => setShowDashboard(true)}
        onExportJson={handleExportJson}
        onExportHtml={handleExportHtml}
        onImportJson={() => document.getElementById('import-file')?.click()}
        onPrint={handlePrint}
        onToggleReferenceManager={() => setShowReferenceManager((value) => !value)}
        onOpenSample={handleOpenSample}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFind={handleFind}
      />

      <input id="import-file" type="file" accept="application/json" className="hidden" onChange={handleImportJson} />

      {!activeDocument || showDashboard ? (
        <DocumentList
          documents={documents}
          onNewDocument={createNewDocument}
          onOpenDocument={(documentId) => {
            setActiveDocId(documentId);
            setShowDashboard(false);
          }}
          onDeleteDocument={deleteDocument}
          onDuplicateDocument={duplicateDocument}
        />
      ) : (
        <>
          <Toolbar
              activeTab={activeRibbonTab}
              canUndo
              canRedo
              onUndo={() => handleHistoryCommand('undo')}
              onRedo={() => handleHistoryCommand('redo')}
              onBold={handleBold}
              onItalic={handleItalic}
              onUnderline={handleUnderline}
              onStrike={handleStrike}
              onHeading={handleHeading}
              onInsertList={handleInsertList}
              onInsertNumberedList={handleInsertNumberedList}
              onAlignLeft={handleAlignLeft}
              onAlignCenter={handleAlignCenter}
              onAlignRight={handleAlignRight}
              onIndent={handleIndent}
              onOutdent={handleOutdent}
              onLink={handleLinkInsert}
              onInsertReference={() => openReferenceDialog()}
              onPrepareInsertReference={captureEditorSelection}
              onInsertHorizontalRule={handleHorizontalRule}
              onPreserveSelection={captureEditorSelection}
              onFontSize={handleFontSize}
              onTextColor={handleTextColor}
              onFind={handleFind}
              wordCount={wordCount}
              characterCount={characterCount}
              onToggleReferenceManager={() => setShowReferenceManager((value) => !value)}
          />

          <div className={`word-workspace ${showReferenceManager ? 'word-workspace--with-panel' : ''}`}>
            <main className="word-editor-main">
              <div className="vertical-ruler" aria-hidden="true">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
              </div>
              <div className="page-column" style={{ zoom: `${zoom}%` }}>
                <div className="horizontal-ruler" aria-hidden="true">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
                </div>
                <Editor
                  editorRef={editorRef}
                  content={activeDocument.content || '<p></p>'}
                  onChange={handleEditorChange}
                  onClickCitation={handleCitationClick}
                />
                <ReferencesSection
                  document={activeDocument}
                  onJumpToCitation={jumpToCitation}
                  onEditReference={handleEditReference}
                  onDeleteReference={handleDeleteReference}
                  onOpenUrl={(url) => url && window.open(url, '_blank', 'noopener,noreferrer')}
                />
              </div>
            </main>

            {showReferenceManager && (
              <ReferenceManager
                references={activeDocument.references || []}
                search={referenceSearch}
                onSearchChange={setReferenceSearch}
                onAddReference={() => openReferenceDialog()}
                onEditReference={handleEditReference}
                onDeleteReference={handleDeleteReference}
                onOpenUrl={(url) => url && window.open(url, '_blank', 'noopener,noreferrer')}
                onJumpToCitation={(refId, citationId) => jumpToCitation(refId, citationId)}
                onInsertCitation={insertCitation}
                onPrepareInsertCitation={captureEditorSelection}
              />
            )}
          </div>
          <footer className="word-statusbar">
            <div className="word-statusbar__left"><span>Page 1 of 1</span><span>{wordCount} words</span><span>English (United States)</span><span>{status}</span></div>
            <div className="word-statusbar__zoom">
              <button onClick={() => setZoom((current) => Math.max(70, current - 10))} aria-label="Zoom out">−</button>
              <input aria-label="Zoom" type="range" min="70" max="130" step="10" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
              <button onClick={() => setZoom((current) => Math.min(130, current + 10))} aria-label="Zoom in">＋</button>
              <span>{zoom}%</span>
            </div>
          </footer>
        </>
      )}

      <ReferenceDialog
        open={referenceDialogOpen}
        initialData={referenceDraft || {}}
        onClose={() => {
          setReferenceDialogOpen(false);
          setReferenceDraft(null);
          setEditingReferenceId(null);
          citationRangeRef.current = null;
        }}
        onSave={handleReferenceSave}
      />
    </div>
  );
}

export default App;
