import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
 


  

  updateUser: protectedProcedure
  .input(z.object({
    name: z.string().optional(),
  
    image: z.string()
      .url("Please provide a valid avatar URL")
      .optional(),
  
    role: z.enum(["USER", "STUDENT", "MENTOR", "STARTUP"], {
      errorMap: () => ({ message: "Invalid role selected" })
    }).optional(),
  
    isRegistered: z.boolean().optional(),
  
    username: z.string()
      .min(3, "Username must be at least 3 characters long")
      .optional(),
  }))
  
  
  .mutation(async ({ ctx, input }) => {
    // Use id if available, otherwise fall back to email
    const userId = ctx?.user?.id;
    const userEmail = ctx?.user?.email;
    console.log("userId", userId);
    console.log("userEmail", userEmail);
    if (!userId && !userEmail) {
      throw new Error("User not authenticated");
    }
    
    return ctx.db.user.update({
      where: userId ? { id: userId } : { email: userEmail as string },
      data: input,
    });
  }
  ),

  getUserRole: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx?.dbUser?.role;
  }
  
  ),


  deleteUser: protectedProcedure
  
  .mutation(async ({ ctx }) => {


    if (!ctx.user) {
      throw new Error("User not authenticated");
    }

    return ctx.db.user.delete({
      where: { id: ctx?.user?.id as string },
    });
  }
  ),

  getMe: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx?.dbUser;
  }
  ),
  
  getUserById: protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    return ctx?.db?.user.findUnique({
      where: { id: input.id },
    });
  }
  ),

  checkUser: protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    //console.log("input")
    return ctx?.db?.user.findUnique({
      where: { id: input.id },
    });
  }
  ),

  checkUsernameAvailability: publicProcedure
  .input(z.object({
    username: z.string().min(3),
  }))
  .query(async ({ ctx, input }) => {
    const existingUser = await ctx?.db?.user.findFirst({
      where: { username: input.username },
    });
    return { available: !existingUser };
  }),

  checkUsernameAvailabilityMutation: publicProcedure
  .input(z.object({
    username: z.string().min(3),
  }))
  .mutation(async ({ ctx, input }) => {
    const existingUser = await ctx?.db?.user.findFirst({
      where: { username: input.username },
    });
    return { available: !existingUser };
  }),
  
  })

