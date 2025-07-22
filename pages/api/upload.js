// import { put } from '@vercel/blob';
// import { IncomingForm } from 'formidable';
// import fs from 'fs/promises';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const form = new IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const file = files.file[0];
//     const data = await fs.readFile(file.filepath);

//     const blob = await put(file.originalFilename, data, {
//       access: 'public',
//       addRandomSuffix: true,
//     });

//     // TEMP memory store (use Upstash/DB for real use)
//     if (!global.blobQueue) global.blobQueue = [];
//     global.blobQueue.push({ path: blob.pathname, expiresAt: Date.now() + 30 * 60 * 1000 });

//     res.status(200).json({ url: blob.url });
//   });
// }


// /api/upload.js
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, // Allow raw binary data
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers);

  const filename = req.headers['x-filename'] || 'upload.bin';

  const blob = await put(filename, data, {
    access: 'public',
    addRandomSuffix: true,
  });

  // TEMP memory store (use DB in real apps)
  if (!global.blobQueue) global.blobQueue = [];
  global.blobQueue.push({ path: blob.pathname, expiresAt: Date.now() + 30 * 60 * 1000 });

  res.status(200).json({ url: blob.url });
}
