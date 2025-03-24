import { z } from 'zod';
import { createTRPCRouter, protectedProcedure,  } from '@/server/api/trpc';
import { getAblyChannel } from '@/lib/ably';
import { storage } from '@/lib/gcp-storage';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid'


const bucket = storage.bucket("chat-image-storage")
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
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
      return ACCEPTED_IMAGE_TYPES.includes(mime || '');
    }, "Unsupported file type").optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { message, chatRoomId ,  file } = input;

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
    // Upload the image to GCP
    if (file) {
      const base64Data = file.split(',')[1];
      const buffer = Buffer.from(base64Data!, 'base64');

      if (buffer.length > MAX_FILE_SIZE) {
        throw new Error("Max image size is 5MB");
      }
         // Process image
      const processedBuffer = await sharp(buffer)
      .resize({ width: 1920, height: 1080, fit: 'inside' })
      .webp()
      .toBuffer();

      
      const fileName = `${uuidv4()}.webp`

      const fileRef = bucket.file(`chats/${chatRoomId}/${fileName}`) 

      await fileRef.save(processedBuffer, {
          metadata: {
            contentType: 'image/webp',
            metadata: {
              uploadedBy: ctx.dbUser!.id!,
              chatRoomId: chatRoomId,
            }
          }
        })

        imagePath = fileRef.name;
    }




    
    // Use a transaction for database writes
    const [chatMessage] = await ctx.db.$transaction([
      ctx.db.chatMessage.create({
        data: {
          senderId: ctx.dbUser.id,
          senderRole: ctx.dbUser.role,
          message : message ? message : null,
          chatRoomId,
          imagePath : imagePath ? imagePath : null, 
          type : imagePath ? "IMAGE" : "TEXT",
        },
      }),

      ctx.db.chatRoom.update({
        where: { id: chatRoomId },
        data: {
          lastMessage: message ? message : "Image",
          mentorUnreadCount: ctx.dbUser.role === "STUDENT" ? { increment: 1 } : 0,
          studentUnreadCount: ctx.dbUser.role === "MENTOR" ? {set : chatRoom.studentUnreadCount + 1} : 0,
        },
      }),
    ]);

   
    

    // Publish the message to Ably  
    try {
      const channel = getAblyChannel(chatRoomId);
      
      await channel.publish("message", {
        message: chatMessage.message ? chatMessage.message : "Image",
        senderRole: chatMessage.senderRole,
        createdAt: chatMessage.createdAt,
        imageUrl : chatMessage.imagePath ? await getSignedUrl(chatMessage?.imagePath) : null,
        type : chatMessage.type,
      });
    } catch (error) {
      console.error("Failed to publish message:", error);
    }

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
        }
      });
      const messages = await Promise.all(
        messageHistory.map(async (message) => {
          if (message?.type === 'IMAGE') {
            if (!message?.imagePath) {
              return message;
            }
            const signedUrl = await getSignedUrl(message?.imagePath!);
            return { ...message, imageUrl: signedUrl };
          }
          // //console.log("message", message)
          return message;
        })
      );

      return messages;
      
    }),
});