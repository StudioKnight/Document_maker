# Document Maker

A research-focused document editor built with React, Vite, and Tailwind CSS. It includes a lightweight Google Docs-style editor, localStorage persistence, citation numbering, a generated references section, import/export, and a reference manager.

## Features

- Google Docs-like rich text editing
- Bold, italic, underline, strikethrough, headings, lists, alignment, and links
- Wikipedia-style numbered citations like [1], [2], [3]
- Auto-generated References section
- Clickable citation navigation and return links
- Local document dashboard with create, duplicate, and delete actions
- JSON/HTML export and JSON import
- Print to PDF support
- Autosave with browser localStorage
- Responsive layout for desktop and smaller screens

## Getting started

1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev
3. Open the app in the browser at the Vite preview URL, typically http://localhost:5173

## GitHub Codespaces

When running in GitHub Codespaces, the app is ready to be served on the forwarded port from Vite. The project config already exposes the Vite server on host 0.0.0.0 and port 5173, which works with Codespaces port forwarding.

## Citation system

The citation logic is centered around the document reference objects stored alongside each document. Each citation inserted into the content is a span with a unique `data-ref-id` and `data-citation-id`, and the references section is generated from the same reference list. Deleting or editing a source renumbers the references and updates the visible citations automatically.

## Future backend integration

The current data model is intentionally separated from the UI so a backend can be added later without rewriting the editor. A future service can replace the localStorage adapter with an API layer that stores documents and references by ID while keeping the same document schema.

## Quick verification checklist

- Add a new reference and insert a citation
- Confirm the citation displays as [1], [2], etc.
- Click the citation and ensure it jumps to the matching reference entry
- Click the reference return arrow and ensure it goes back to the matching citation
- Delete a reference and verify the remaining numbers renumber correctly
- Export as JSON/HTML and import the file again
- Confirm autosave keeps changes after refresh
