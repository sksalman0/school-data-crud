import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const filename = req.headers['x-filename'];

  if (!filename) {
    return res.status(400).json({ error: 'Filename not provided' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ 
      error: 'Storage credentials not configured. Please set BLOB_READ_WRITE_TOKEN in your .env.local file.' 
    });
  }

  try {
    const blob = await put(filename, req, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    res.status(200).json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    res.status(500).json({ 
      error: 'Error uploading file',
      details: error.message 
    });
  }
}
