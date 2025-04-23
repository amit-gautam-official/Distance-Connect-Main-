import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';
import { TRPCError } from "@trpc/server";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

// Valid mime types to accept
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg", 
  "image/png", 
  "image/webp"
];
const ALLOWED_PDF_TYPE = "application/pdf";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const fileRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        initialAvatarUrl: z.string().optional(),
        bucketName: z.string(),
        fileName: z.string(),
        fileType: z.string(),
        folderName: z.string().optional(),
        fileContent: z.string(), // Base64 encoded file content
      })
    )
    .mutation(async ({ input }) => {
      const { bucketName, fileName, fileType, fileContent, folderName, initialAvatarUrl } = input;
      
      // Validate file type
      if (![...ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPE].includes(fileType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid file type. Only images (JPEG, PNG, WebP, GIF, SVG) and PDFs are allowed.",
        });
      }
      
      // Validate file size (Base64 is ~33% larger than binary)
      const estimatedFileSize = Math.ceil((fileContent.length * 3) / 4);
      if (estimatedFileSize > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: "BAD_REQUEST", 
          message: "File exceeds maximum size of 10MB.",
        });
      }

      const bucket = storage.bucket(bucketName);
      if (!bucket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bucket not found",
        });
      }

      // Delete initial image if exists
      if (initialAvatarUrl) {
        const url = new URL(initialAvatarUrl);
        console.log("URL:", url);
        const pathname = url.pathname;

        // Remove leading slash and bucket name to get the full object path
        const objectPath = pathname.replace(`/${bucketName}/`, '');

        console.log("Object path to delete:", objectPath);

        const initialFile = bucket.file(objectPath);

        await initialFile.delete()
          .then(() => {
            console.log("Initial image deleted successfully");
          })
          .catch((err) => {
            console.error("Error deleting initial image:", err);
          });
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(fileContent, "base64");
      
      let processedBuffer, uniqueFileName, fileExtension;
      
      // Process differently based on file type
      if (fileType === ALLOWED_PDF_TYPE) {
        // For PDFs, no processing needed
        processedBuffer = buffer;
        fileExtension = 'pdf';
      } else {
        // Process image with Sharp
        try {
          processedBuffer = await sharp(buffer)
            .webp({ quality: 80 }) // Convert to WebP with 80% quality
            .resize(800, 800, { // Resize to max 800x800 while maintaining aspect ratio
              fit: 'inside',
              withoutEnlargement: true
            })
            .toBuffer();
          fileExtension = 'webp';
        } catch (error) {
          console.error("Error processing image:", error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid image file. The file could not be processed.",
          });
        }
      }

      // Create unique filename
      uniqueFileName = `${fileName}-${uuidv4()}.${fileExtension}`;
      const filePath = folderName ? `${folderName}/${uniqueFileName}` : uniqueFileName;
      const file = bucket.file(filePath);

      // Upload processed file
      await file.save(processedBuffer, {
        contentType: fileType === ALLOWED_PDF_TYPE ? ALLOWED_PDF_TYPE : 'image/webp',
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      // Get the public URL (without making the file public)
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;

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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
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