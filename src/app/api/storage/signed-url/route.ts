import { NextResponse } from 'next/server';
import { storage } from '@/lib/gcp-storage';



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const path = body.imagePath;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const [url] = await storage.bucket("chat-image-storage")
      .file(path)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 3600 * 1000 // 1 hour
      });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
} 