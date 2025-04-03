import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export const fileRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        bucketName: z.string(),
        fileName: z.string(),
        fileType: z.string(),
        fileContent: z.string(), // Base64 encoded file content
      })
    )
    .mutation(async ({ input }) => {
      const { bucketName, fileName, fileType, fileContent } = input;
      const bucket = storage.bucket(bucketName);

      // Convert base64 to buffer
      const buffer = Buffer.from(fileContent, "base64");

      // Process image with Sharp
      const processedBuffer = await sharp(buffer)
        .webp({ quality: 80 }) // Convert to WebP with 80% quality
        .resize(800, 800, { // Resize to max 800x800 while maintaining aspect ratio
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();

      // Use userId as filename with .webp extension

      const uniqueFileName = `${fileName}-${uuidv4()}.webp`;
      const file = bucket.file(uniqueFileName);

      // Upload processed file
      await file.save(processedBuffer, {
        contentType: 'image/webp',
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      // Get the public URL (without making the file public)
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;

      return {
        success: true,
        url: publicUrl,
        filePath: uniqueFileName,
      };
    }),

  getSignedUrl: protectedProcedure
    .input(
      z.object({
        bucketName: z.string(),
        imagePath: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { bucketName, imagePath } = input;
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(imagePath);

      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        throw new Error("File not found");
      }

      // Generate signed URL
      const [signedUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        success: true,
        signedUrl,
      };
    }),
}); 