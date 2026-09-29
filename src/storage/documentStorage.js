const DOCS_KEY = 'document-maker-documents';
const ACTIVE_KEY = 'document-maker-active-doc';

export function readDocuments() {
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeDocuments(docs) {
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

export function readActiveDocumentId() {
  return localStorage.getItem(ACTIVE_KEY) || '';
}

export function writeActiveDocumentId(id) {
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
}
