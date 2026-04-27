export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { pathname } = req.body;

  if (!pathname) return res.status(400).json({ error: 'Missing pathname' });

  if (!global.blobQueue) global.blobQueue = [];
  global.blobQueue.push({ path: pathname, expiresAt: Date.now() + 30 * 60 * 1000 });

  res.status(200).json({ success: true });
}