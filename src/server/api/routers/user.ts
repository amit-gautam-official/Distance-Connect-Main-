import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
 

  createUser: publicProcedure
    .input(z.object({ 
      kindeId : z.string(),
      name: z.string(),
      email : z.string().email(),
      avatarUrl : z.string().url().optional(),
      username: z.string().min(3),
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx?.db?.user.create({
        data: {
          kindeId : input.kindeId,
          name: input.name,
          email: input.email,
          avatarUrl: input.avatarUrl,
          username: input.username,
        },
      });
    }),

  updateUser: protectedProcedure
  .input(z.object({
    name: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    role: z.enum(["USER", "STUDENT", "MENTOR", "STARTUP"]).optional(),
    isRegistered : z.boolean().optional(),
    username: z.string().min(3).optional(),
  }))
  
  .mutation(async ({ ctx, input }) => {
    return ctx.db.user.update({
      where: { id: ctx?.dbUser?.id },
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
    kindeId: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    //console.log("input")
    return ctx?.db?.user.findUnique({
      where: { kindeId: input.kindeId },
    });
  }
  ),

  checkUsernameAvailability: publicProcedure
  .input(z.object({
    username: z.string().min(3),
  }))
  .query(async ({ ctx, input }) => {
    const existingUser = await ctx?.db?.user.findUnique({
      where: { username: input.username },
    });
    return { available: !existingUser };
  }),

  checkUsernameAvailabilityMutation: publicProcedure
  .input(z.object({
    username: z.string().min(3),
  }))
  .mutation(async ({ ctx, input }) => {
    const existingUser = await ctx?.db?.user.findUnique({
      where: { username: input.username },
    });
    return { available: !existingUser };
  }),
  
  })

