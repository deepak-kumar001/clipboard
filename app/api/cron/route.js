import { del } from '@vercel/blob';

export async function GET() {
  if (!global.blobQueue) return Response.json({ deleted: 0 });

  const now = Date.now();
  const expired = global.blobQueue.filter(x => x.expiresAt <= now);

  for (const blob of expired) {
    await del(blob.path);
  }

  global.blobQueue = global.blobQueue.filter(x => x.expiresAt > now);

  return Response.json({ deleted: expired.length });
}
