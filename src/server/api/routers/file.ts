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
  "image/jpg",
  "image/png", 
  "image/webp",
  "delete"
];
const ALLOWED_PDF_TYPE = "application/pdf";
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov files
  "video/x-msvideo", // .avi files - though less common for web
  "delete"
];

export const fileRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        initialAvatarUrl: z.string().optional(), 
        bucketName: z.string(),
        fileName: z.string(),
        fileType: z.string(),
        folderName: z.string().optional(),
        fileContent: z.string(), 
      })
    )
    .mutation(async ({ input }) => {
      const { bucketName, fileName, fileType, fileContent, folderName, initialAvatarUrl } = input;

      if(fileContent === initialAvatarUrl) {
        return {
          success: true,
          url: initialAvatarUrl,
          filePath: "", 
        };
      }

      // Validate file type
      const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPE, ...ALLOWED_VIDEO_TYPES];
      if (!ALL_ALLOWED_TYPES.includes(fileType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid file type. Allowed types: ${ALL_ALLOWED_TYPES.join(", ")}`,
        });
      }

      //fileType == vide0 then allow 50MB if fileType == image then allow 5MB
      let MAX_FILE_SIZE = 50 * 1024 * 1024;
      if(fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/webp") {
        MAX_FILE_SIZE = 5 * 1024 * 1024;
      }
      if(fileType === "application/pdf") {
        MAX_FILE_SIZE = 5 * 1024 * 1024;
      }
      
      // Validate file size (Base64 is ~33% larger than binary)
      const estimatedFileSize = Math.ceil((fileContent.length * 3) / 4);
      if (estimatedFileSize > MAX_FILE_SIZE) {
        // console.log("File size:", estimatedFileSize);
        // console.log("Max file size:", MAX_FILE_SIZE);
        throw new TRPCError({
          code: "BAD_REQUEST", 
          message: `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        });
      }

      const bucket = storage.bucket(bucketName);
      if (!bucket) {
        // console.log("Bucket not found");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bucket not found",
        });
      }



      // Delete initial image if exists
      if (initialAvatarUrl) {
        const url = new URL(initialAvatarUrl);
        const pathname = decodeURIComponent(url.pathname);
        // console.log("Pathname:", pathname);
        //check if bucket name is present in the url
        if (pathname.includes(`/${bucketName}/`)) {
          
        
        // Remove leading slash and bucket name to get the full object path
        
        const objectPath = pathname.replace(`/${bucketName}/`, '');

        // console.log("Object path:", objectPath);

        const initialFile = bucket.file(objectPath);

        await initialFile.delete()
          .then(() => {
            // console.log("Initial image deleted successfully");
          })
          .catch((err) => {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error deleting initial image: " + err.message,
            });
          });
        }
      }

      if (fileType === "delete") {
        return {
          success: true,
          url: "",
          filePath: "", 
        };
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(fileContent, "base64");
      
      let processedBuffer, uniqueFileName, fileExtension, finalContentType;
      
      // Process differently based on file type
      if (fileType === ALLOWED_PDF_TYPE) {
        // For PDFs, no processing needed
        processedBuffer = buffer;
        fileExtension = 'pdf';
        finalContentType = ALLOWED_PDF_TYPE;
      } else if (ALLOWED_IMAGE_TYPES.includes(fileType)) {
        // Process image with Sharp
        try {
          processedBuffer = await sharp(buffer)
            .webp({ quality: 80 }) 
            .resize(800, 800, { 
              fit: 'inside',
              withoutEnlargement: true
            })
            .toBuffer();
          fileExtension = 'webp';
          finalContentType = 'image/webp';
        } catch (error) {
          console.log("Error processing image:", error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid image file. The file could not be processed.",
          });
        }
      } else if (ALLOWED_VIDEO_TYPES.includes(fileType)) {
        // For Videos, no processing needed, upload as is
        processedBuffer = buffer;
        // Determine extension from fileType
        const typeParts = fileType.split('/');
        fileExtension = typeParts.length > 1 ? typeParts[1] : 'mp4'; 
        if (fileType === 'video/quicktime') fileExtension = 'mov';
        finalContentType = fileType;
      } else {
        // Should not happen due to earlier validation, but as a fallback:
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unsupported file type for processing.",
        });
      }

      // Create unique filename
      // Sanitize fileName input to prevent issues, remove extension if present
      const sanitizedFileName = fileName.split('.').slice(0, -1).join('.') || fileName;
      uniqueFileName = `${sanitizedFileName}-${uuidv4()}.${fileExtension}`;
      const filePath = folderName ? `${folderName}/${uniqueFileName}` : uniqueFileName;
      const file = bucket.file(filePath);

      // Upload processed file
      try {
      await file.save(processedBuffer, {
        contentType: finalContentType, 
        metadata: {
          cacheControl: "public, max-age=31536000", 
        },
      });
      } catch (error) {
        console.log("Error uploading file:", error);
        
      }
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
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
      });

      return {
        success: true,
        signedUrl,
      };
    }),
    
  // Generate a signed URL for direct file uploads to the bucket
  getSignedUploadUrl: protectedProcedure
    .input(
      z.object({
        bucketName: z.string(),
        folderName: z.string(),
        fileName: z.string(),
        fileType: z.string(),
        initialVideoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { bucketName, folderName, fileName, fileType, initialVideoUrl } = input;
      
      // Validate file type for videos
      if (!ALLOWED_VIDEO_TYPES.includes(fileType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid file type. Allowed types: ${ALLOWED_VIDEO_TYPES.join(", ")}`,
        });
      }
      
      const bucket = storage.bucket(bucketName);
      
      // Delete the initial video if it exists
      if (initialVideoUrl) {
        try {
          const url = new URL(initialVideoUrl);
          const pathname = decodeURIComponent(url.pathname);
          
          if (pathname.includes(`/${bucketName}/`)) {
            const objectPath = pathname.replace(`/${bucketName}/`, '');
            const initialFile = bucket.file(objectPath);
            
            await initialFile.delete()
              .then(() => {
                // console.log("Initial video deleted successfully");
              })
              .catch((err) => {
                console.error("Error deleting initial video:", err.message);
                // Continue anyway, don't block the new upload
              });
          }
        } catch (error) {
          console.error("Error processing initial video URL:", error);
          // Continue anyway, don't block the new upload
        }
      }
      
      // Create a unique filename
      const sanitizedFileName = fileName.split('.').slice(0, -1).join('.') || fileName;
      const fileExtension = fileType.split('/')[1] || 'mp4';
      const uniqueFileName = `${sanitizedFileName}-${uuidv4()}.${fileExtension}`;
      const filePath = `${folderName}/${uniqueFileName}`;
      
      const file = bucket.file(filePath);
      
      
      // Generate a signed URL for uploading
      const [signedUrl] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes expiration
        contentType: fileType,
        extensionHeaders: {
          "x-goog-content-length-range": "0,52428800", // 0-50MB range
        },
      });
      
      // Generate the public URL that will be accessible after upload
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
      
      return {
        success: true,
        signedUrl,
        publicUrl,
        filePath,
      };
    }),
});