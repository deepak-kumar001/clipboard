'use client';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const [file, setFile] = useState(null);
  const [blobs, setBlobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // for resetting file input

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setFile(null); // clear file state
    if (fileInputRef.current) fileInputRef.current.value = ''; // clear input field

    await fetchBlobs();
    setLoading(false);
  };

  const fetchBlobs = async () => {
    const res = await fetch('/api/list');
    const data = await res.json();
    setBlobs(data);
  };

  const handleDelete = async (pathname) => {
    await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathname }),
    });

    await fetchBlobs();
  };

  const extractFilename = (pathname) => {
    // Strip "/store/file__random.txt" → "file.txt"
    const base = pathname.split('/').pop();
    const extension = base.split('.').pop();
    const parts = base.split('-');
    const name = parts.length > 1 ? parts.slice(0, -1).join('__') : base;
    return `${name}.${extension}`;
  };

  useEffect(() => {
    fetchBlobs();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 p-8 font-sans">
      <div className="max-w-[68rem] mx-auto">
        <h1 className="text-3xl font-bold mb-6">📋 Temporary Clipboard</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => setFile(e.target.files[0])}
            className="w-108 bg-zinc-800 text-sm text-zinc-300 cursor-pointer rounded border border-zinc-700 file:bg-zinc-700 file:border-none file:px-4 file:py-1 file:text-sm file:text-zinc-200 hover:file:bg-zinc-600"
          />
          <button
            onClick={upload}
            disabled={!file || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer px-4 py-2 rounded text-white transition"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">🗂 Uploaded Files</h2>

        {blobs.length === 0 ? (
          <p className="text-zinc-400">No files uploaded yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {blobs.map((blob) => (
              <div
                key={blob.url}
                className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 w-full sm:w-64 flex flex-col justify-between"
              >
                <div className="mb-2">
                  <a
                    href={blob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline break-all"
                  >
                    {extractFilename(blob.pathname)}
                  </a>
                  <p className="text-sm text-zinc-400">
                    {(blob.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(blob.pathname)}
                  className="mt-2 bg-red-700 hover:bg-red-600 px-3 py-1 cursor-pointer rounded text-white text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
