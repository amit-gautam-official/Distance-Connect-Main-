import {storage} from './gcp-storage';

export async function configureCORS() {
  const bucketName = "chat-image-storage";

  await storage.bucket(bucketName).setCorsConfiguration([
    {
      maxAgeSeconds: 3600,
      method: ['GET', 'POST', 'PUT'],  // Allowed HTTP methods
      origin: [
        'https://yourdomain.com',     // Production domain
        'http://localhost:3000',      // Next.js dev server
        'http://127.0.0.1:3000'       // Alternative localhost
      ],
      responseHeader: [
        'Content-Type',
        'Content-Length',
        'Authorization'
      ],
    }
  ]);

  //console.log(`✅ CORS configured for bucket ${bucketName}`);
}

// Run only when needed (not in production runtime!)
if (process.env.NODE_ENV === 'development') {
  configureCORS().catch(console.error);
}