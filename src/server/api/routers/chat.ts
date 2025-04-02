import { z } from 'zod';
import { createTRPCRouter, protectedProcedure,  } from '@/server/api/trpc';
import { storage } from '@/lib/gcp-storage';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid'


const bucket = storage.bucket("chat-image-storage")
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const ACCEPTED_FILE_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


const getSignedUrl = async (path: string) => {
  const [url] = await storage.bucket("chat-image-storage")
    .file(path)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 3600 * 1000 // 1 hour
    });
  return url;
};

export const chatRouter = createTRPCRouter({
  
  sendMessage: protectedProcedure
  .input(z.object({
    message: z.string().optional(),
    chatRoomId: z.string(),
    file: z.string().refine((val) => {
      const header = val.split(',')[0];
      const mime = header?.match(/:(.*?);/)?.[1];
      return ACCEPTED_FILE_TYPES.includes(mime || '');
    }, "Unsupported file type").optional(),
    fileName: z.string().optional(),
    fileType: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { message, chatRoomId, file, fileName, fileType } = input;

    // Ensure the user is authenticated
    if (!ctx.dbUser) {
      throw new Error("User not authenticated");
    }
  
    const chatRoom = await ctx.db.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new Error("Chat room not found");
    }
    if (![chatRoom.studentUserId, chatRoom.mentorUserId].includes(ctx.dbUser.id)) {
      throw new Error("Not part of this chat");
    }
 
   
    let imagePath = null;
    let type = "TEXT";
    
    // Upload the file to GCP
    if (file) {
      const base64Data = file.split(',')[1];
      const buffer = Buffer.from(base64Data!, 'base64');
      const header = file.split(',')[0];
      const mime = header?.match(/:(.*?);/)?.[1] || '';

      if (buffer.length > MAX_FILE_SIZE) {
        throw new Error("Max file size is 5MB");
      }
      
      let processedBuffer = buffer;
      let finalFileName = fileName || `${uuidv4()}`;
      let contentType = mime;
      
      // Process image if it's an image type
      if (ACCEPTED_IMAGE_TYPES.includes(mime)) {
        processedBuffer = await sharp(buffer)
          .resize({ width: 1920, height: 1080, fit: 'inside' })
          .webp()
          .toBuffer();
        finalFileName = `${uuidv4()}.webp`;
        contentType = 'image/webp';
        type = "IMAGE";
      } else if (ACCEPTED_DOCUMENT_TYPES.includes(mime)) {
        // For documents, use the original extension or determine from MIME type
        const extension = fileName ? fileName.split('.').pop() : 
          mime === 'application/pdf' ? 'pdf' : 
          mime === 'application/msword' ? 'doc' : 
          mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'docx' : 'doc';
        
        finalFileName = `${uuidv4()}.${extension}`;
        type = "DOCUMENT";
      }

      const fileRef = bucket.file(`chats/${chatRoomId}/${finalFileName}`);

      await fileRef.save(processedBuffer, {
        metadata: {
          contentType: contentType,
          metadata: {
            uploadedBy: ctx.dbUser!.id!,
            chatRoomId: chatRoomId,
          }
        }
      });

      imagePath = fileRef.name;
    }

    // Determine message text based on file type
    let messageText = message;
    if (!message && imagePath) {
      if (type === "IMAGE") {
        messageText = "📷 Image";
      } else if (type === "DOCUMENT") {
        messageText = "📄 Document";
      }
    }

    // Use a transaction for database writes
    const [chatMessage] = await ctx.db.$transaction([
      
      ctx.db.chatMessage.create({
        data: {
          senderId: ctx.dbUser.id,
          senderRole: ctx.dbUser.role,
          message: messageText || null,
          chatRoomId,
          imagePath: imagePath || null, 
          type: type,
          fileName: fileName || null,
        },
      }),

      ctx.db.chatRoom.update({
        where: { id: chatRoomId },
        data: {
          lastMessage: messageText || "File",
          mentorUnreadCount: ctx.dbUser.role === "STUDENT" ? { increment: 1 } : { set: 0 },
          studentUnreadCount: ctx.dbUser.role === "MENTOR" ? { increment: 1 } : { set: 0 },
        },
      }),
    ]);

    return chatMessage;
  }),


    getMessages: protectedProcedure
    .input(z.object({
      chatRoomId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { chatRoomId } = input;

      // Get the messages from the database
      const messageHistory = await ctx.db.chatMessage.findMany({
        where: {
          chatRoomId : chatRoomId,
        },
      
        select:{
          message: true,
          senderRole: true,
          createdAt: true,
          id: true,
          imagePath: true,
          type: true,
          fileName: true,
        }
      });
      const messages = await Promise.all(
        messageHistory.map(async (message) => {
          if (message?.imagePath) {
            const signedUrl = await getSignedUrl(message.imagePath);
            return { ...message, imageUrl: signedUrl };
          }
          return message;
        })
      );

      return messages;
      
    }),
});