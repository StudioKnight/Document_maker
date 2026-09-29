const makeId = (prefix) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const stripHtml = (html = '') => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ').trim();
};

export function createDocument({ title = 'Untitled document' } = {}) {
  const now = new Date().toISOString();

  return {
    id: makeId('doc'),
    title,
    content: '<p></p>',
    references: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createReference({ title = '', author = '', website = '', url = '', publicationDate = '', accessDate = '', notes = '' } = {}) {
  return {
    id: makeId('ref'),
    title,
    author,
    website,
    url,
    publicationDate,
    accessDate,
    notes,
  };
}

export function getReferenceNumber(doc, refId) {
  const refs = Array.isArray(doc.references) ? doc.references : [];
  const index = refs.findIndex((ref) => ref.id === refId);
  return index >= 0 ? index + 1 : null;
}

export function getReferenceById(doc, refId) {
  return (doc.references || []).find((ref) => ref.id === refId) || null;
}

export function renumberReferences(doc) {
  const nextDoc = { ...doc, references: Array.isArray(doc.references) ? [...doc.references] : [] };
  nextDoc.references = nextDoc.references.map((ref, index) => ({ ...ref, number: index + 1 }));
  nextDoc.content = syncCitationNumbersInContent(nextDoc.content, nextDoc.references);
  nextDoc.updatedAt = new Date().toISOString();
  return nextDoc;
}

export function syncCitationNumbersInContent(content = '', references = []) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content || '<p></p>', 'text/html');
  const refMap = new Map((references || []).map((ref) => [ref.id, ref]));

  const citationNodes = [...doc.querySelectorAll('[data-ref-id]')];
  citationNodes.forEach((node) => {
    const refId = node.dataset.refId;
    const reference = refMap.get(refId);

    if (!reference) {
      node.remove();
      return;
    }

    const number = getReferenceNumber({ references }, refId);
    node.textContent = `[${number}]`;
    node.dataset.referenceNumber = String(number);
    node.setAttribute('title', `Citation ${number}`);
    node.classList.add('citation');
  });

  return doc.body.innerHTML;
}

export function addCitationToContent(content = '', refId, number) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content || '<p></p>', 'text/html');
  const target = doc.body;
  const span = doc.createElement('span');
  span.className = 'citation';
  span.dataset.refId = refId;
  span.dataset.referenceNumber = String(number);
  span.setAttribute('contenteditable', 'false');
  span.textContent = `[${number}]`;
  span.title = `Jump to reference ${number}`;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);
    range.setStartAfter(span);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    target.appendChild(span);
  }

  return target.innerHTML;
}

export function removeReferenceCitations(content = '', refId) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content || '<p></p>', 'text/html');
  const nodes = [...doc.querySelectorAll(`[data-ref-id="${refId}"]`)];
  nodes.forEach((node) => node.remove());
  return doc.body.innerHTML;
}

export function updateReference(doc, refId, updates) {
  const nextDoc = { ...doc, references: (doc.references || []).map((ref) => {
    if (ref.id !== refId) return ref;
    return { ...ref, ...updates };
  }) };
  nextDoc.content = syncCitationNumbersInContent(nextDoc.content, nextDoc.references);
  nextDoc.updatedAt = new Date().toISOString();
  return nextDoc;
}

export function deleteReference(doc, refId) {
  const filtered = (doc.references || []).filter((ref) => ref.id !== refId);
  const nextDoc = {
    ...doc,
    references: filtered,
    content: removeReferenceCitations(doc.content, refId),
    updatedAt: new Date().toISOString(),
  };

  return renumberReferences(nextDoc);
}

export function getCitationIdsForReference(doc, refId) {
  const parser = new DOMParser();
  const docFragment = parser.parseFromString(doc.content || '<p></p>', 'text/html');
  return [...docFragment.querySelectorAll(`[data-ref-id="${refId}"]`)].map((el) => el.dataset.citationId || '');
}

export function serializeDocument(doc) {
  return {
    id: doc.id,
    title: doc.title,
    content: doc.content,
    references: doc.references,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function deserializeDocument(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid document data');
  }

  return {
    id: data.id || makeId('doc'),
    title: data.title || 'Untitled document',
    content: data.content || '<p></p>',
    references: Array.isArray(data.references) ? data.references.map((ref) => ({
      id: ref.id || makeId('ref'),
      title: ref.title || '',
      author: ref.author || '',
      website: ref.website || '',
      url: ref.url || '',
      publicationDate: ref.publicationDate || '',
      accessDate: ref.accessDate || '',
      notes: ref.notes || '',
      number: typeof ref.number === 'number' ? ref.number : undefined,
    })) : [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export function exportDocumentAsHtml(doc) {
  const references = doc.references || [];
  const citationDoc = new DOMParser().parseFromString(doc.content || '<p></p>', 'text/html');
  const citationCounts = new Map();
  const referenceNumbers = new Map(references.map((ref, index) => [ref.id, index + 1]));

  citationDoc.querySelectorAll('[data-ref-id]').forEach((citation) => {
    const refId = citation.dataset.refId;
    const number = referenceNumbers.get(refId);
    if (!number) {
      citation.remove();
      return;
    }

    const occurrence = (citationCounts.get(refId) || 0) + 1;
    citationCounts.set(refId, occurrence);
    const citationId = citation.dataset.citationId || `citation-${number}-${occurrence}`;
    const link = citationDoc.createElement('a');
    link.id = citationId;
    link.href = `#reference-${number}`;
    link.textContent = `[${number}]`;
    citation.replaceWith(link);
  });

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? escapeHtml(value)
      : escapeHtml(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  };
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? escapeHtml(url.href) : '';
    } catch {
      return '';
    }
  };

  const referencesHtml = references.map((ref, index) => {
    const number = index + 1;
    const backlinks = [...citationDoc.querySelectorAll(`[id][href="#reference-${number}"]`)]
      .map((citation, occurrenceIndex) => `<a href="#${escapeHtml(citation.id)}" aria-label="Return to citation ${occurrenceIndex + 1}">^<sup>${occurrenceIndex + 1}</sup></a>`)
      .join(' ');
    const url = safeUrl(ref.url || '');
    const title = ref.title
      ? (url ? `<a href="${url}" target="_blank" rel="noreferrer">&ldquo;${escapeHtml(ref.title)}&rdquo; ↗</a>` : `&ldquo;${escapeHtml(ref.title)}&rdquo;`)
      : '';
    const author = ref.author ? escapeHtml(ref.author) : '';
    const datedAuthor = author ? `${author}${ref.publicationDate ? ` (${formatDate(ref.publicationDate)})` : ''}. ` : '';
    const website = ref.website ? `<cite>${escapeHtml(ref.website)}</cite>. ` : '';
    const retrieved = ref.accessDate ? `Retrieved ${formatDate(ref.accessDate)}.` : '';
    const titleSeparator = title && ref.website ? '. ' : '';

    return `<li id="reference-${number}"><span class="ref-number">${number}.</span> ${backlinks} ${datedAuthor}${title}${titleSeparator}${website}${retrieved}</li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(doc.title)}</title>
    <style>
      body { max-width: 760px; margin: 48px auto; padding: 0 24px; color: #111; font: 16px/1.65 Georgia, serif; }
      .ref-number { display: inline-block; width: 1.5em; text-align: right; margin-right: .25em; }
      ol { list-style: none; padding: 0; }
      li { padding-left: 2em; text-indent: -2em; margin: .45em 0; }
      a { color: #0645ad; text-decoration: none; }
      a:hover { text-decoration: underline; }
      @media print { body { margin: 0 auto; } }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(doc.title)}</h1>
    <div>${citationDoc.body.innerHTML}</div>
    <h2>References</h2>
    <ol>${referencesHtml}</ol>
  </body>
</html>`;
}

export function exportDocumentAsJson(doc) {
  return JSON.stringify(serializeDocument(doc), null, 2);
}

export function importDocumentJson(jsonText) {
  const parsed = JSON.parse(jsonText);
  return deserializeDocument(parsed);
}

export function getPlainText(content = '') {
  return stripHtml(content);
}

export function getWordCount(content = '') {
  const text = getPlainText(content);
  return text ? text.split(/\s+/).length : 0;
}

export function getCharacterCount(content = '') {
  return getPlainText(content).length;
}

export function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function injectReferenceAtSelection(doc, refId) {
  const number = getReferenceNumber(doc, refId);
  const template = `<span class="citation" data-ref-id="${refId}" data-citation-id="${makeId('citation')}" data-reference-number="${number}" contenteditable="false">[${number}]</span>`;
  return template;
}

export function removeBrokenCitationIds(content = '') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content || '<p></p>', 'text/html');
  [...doc.querySelectorAll('.citation')].forEach((node) => {
    if (!node.dataset.refId) {
      node.replaceWith(document.createTextNode(node.textContent || ''));
    }
  });
  return doc.body.innerHTML;
}

export function ensureReferenceIds(doc) {
  const nextDoc = { ...doc, references: (doc.references || []).map((ref) => ({ ...ref, id: ref.id || makeId('ref') })) };
  nextDoc.content = removeBrokenCitationIds(nextDoc.content);
  nextDoc.updatedAt = new Date().toISOString();
  return renumberReferences(nextDoc);
}
