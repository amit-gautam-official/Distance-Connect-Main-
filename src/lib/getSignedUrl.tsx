"use server"
import { storage } from "./gcp-storage";


export const getSignedUrl = async (path: string) => {
    const [url] = await storage.bucket("chat-image-storage")
      .file(path)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 3600 * 1000 // 1 hour
      });
    return url;
  };