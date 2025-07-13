import { del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { pathname } = req.body;

    if (!pathname) return res.status(400).json({ error: 'Missing pathname' });

    await del(pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete blob' });
  }
}
