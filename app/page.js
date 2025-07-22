'use client';
import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CircularProgress from './components/CircularProgress'; // Adjust the import path as needed

export default function Page() {
  const [file, setFile] = useState(null);
  const [blobs, setBlobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  // const upload = async () => {
  //   if (!file) return;
  //   setLoading(true);
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   await fetch('/api/upload', {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   setFile(null); // clear file state
  //   if (fileInputRef.current) fileInputRef.current.value = ''; // clear input field

  //   await fetchBlobs();
  //   setLoading(false);
  // };

  const upload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('X-Filename', file.name);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadProgress(100);
          setFile(null);
          fetchBlobs(); // call your function to refresh file list
        } else {
          console.error('Upload failed');
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        console.error('Upload error');
        setLoading(false);
      };

      setLoading(true);
      xhr.send(data);
    };

    reader.readAsArrayBuffer(file);
  };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const cancel = () => {
    setFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });


  const fetchBlobs = async () => {
    const res = await fetch('/api/list');
    const data = await res.json();
    setBlobs(data);
  };

  const handleDelete = async (pathname) => {

    let validation = confirm("Do you want to delete it?");
    if (!validation) return;

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

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-6 mb-4 cursor-pointer transition ${isDragActive ? 'border-blue-400 bg-zinc-800' : 'border-zinc-600'
            }`}
        >
          <input {...getInputProps()} />
          <p className="text-center text-zinc-400">
            {isDragActive
              ? '📂 Drop the file here...'
              : '📁 Drag & drop a file here, or click to select'}
          </p>
        </div>

        {file && (
          <div className="bg-zinc-800 rounded-lg p-4 mb-6 flex items-center justify-between shadow-md border border-zinc-700">
            <div>
              <p className="text-zinc-200 font-medium">{file.name}</p>
              <p className="text-sm text-zinc-400">{(file.size / 1024).toFixed(2)} KB</p>
            </div>

            <div className="flex gap-3">

              {uploadProgress > 0 && (
                // <div className="w-full bg-zinc-700 rounded mt-2 h-2 overflow-hidden">
                //   <div
                //     className="bg-blue-500 h-full transition-all"
                //     style={{ width: `${uploadProgress}%` }}
                //   ></div>
                // </div>
                <div className="flex justify-center items-center">
                  <CircularProgress progress={uploadProgress} />
                </div>
              )}


              <button
                onClick={upload}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded transition disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={cancel}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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
