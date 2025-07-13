import { list } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const result = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN, // required locally
    });

    res.status(200).json(result.blobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list blobs' });
  }
}
