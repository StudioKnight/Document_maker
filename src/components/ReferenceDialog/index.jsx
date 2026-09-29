import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  author: '',
  website: '',
  url: '',
  publicationDate: '',
  accessDate: '',
  notes: '',
};

export default function ReferenceDialog({ open, initialData, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialData });
    }
  }, [open, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reference</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">Close</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Title
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Author
            <input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Website/Publications
            <input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>

          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            URL
            <input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Publication date
            <input type="date" value={form.publicationDate} onChange={(event) => setForm({ ...form, publicationDate: event.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Access date
            <input type="date" value={form.accessDate} onChange={(event) => setForm({ ...form, accessDate: event.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>

          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Notes
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={() => onSave(form)} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Save</button>
        </div>
      </div>
    </div>
  );
}
