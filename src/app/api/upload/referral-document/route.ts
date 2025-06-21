'use server';

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/server/auth';
import { Storage } from '@google-cloud/storage';

// Initialize GCP Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL!,
    private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, '\n'), // Replace escaped newlines
  },
});
            
const bucket = storage.bucket("dc-public-files");

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileType } = await req.json();

    if (!fileType) {
      return NextResponse.json({ error: 'Missing file type' }, { status: 400 });
    }

    if (!fileType.startsWith('application/pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const fileId = uuidv4();
    const key = `referrals/${session.user.id}/${fileId}.pdf`;
    const file = bucket.file(key);

    const expiresAtMs = Date.now() + 60 * 60 * 1000; // 1 hour from now

    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: expiresAtMs,
      contentType: fileType,
    });

    const fileUrl = `https://storage.googleapis.com/dc-public-files/${key}`;

    return NextResponse.json({
      uploadUrl,
      fileUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
