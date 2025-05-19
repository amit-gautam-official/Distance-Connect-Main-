import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const startupRouter = createTRPCRouter({
 
  // comapanyName   String?
  // companyUrl     String?
  // industry       String?
  // pinCode        Int?
  // State          String?
  // interestFields String[]


  createStartupUpdateUser: protectedProcedure
    .input(z.object({ 
      username: z.string().min(3),
      comapanyName  : z.string(),
      companyUrl    : z.string().url(),
      industry      : z.string(),
      pinCode       : z.number(),
      state         : z.string(),
      interestFields: z.array(z.string()),
      role : z.enum(["STUDENT", "MENTOR", "STARTUP"]),
      image : z.string().optional(),
     }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction([
        ctx.db.startup.create({
          data: {
            comapanyName: input.comapanyName,
            companyUrl: input.companyUrl,
            industry: input.industry,
            pinCode: input.pinCode,
            state: input.state,
            interestFields: input.interestFields,
            userId: ctx?.dbUser?.id!,
          },
        }),
        ctx.db.user.update({
          where: { id: ctx?.dbUser?.id! },
          data: {
            username: input.username,
            name: ctx.user.name,
            image: input.image,
            role: "STARTUP",
            isRegistered: true,
          },
        }),
      ])
    }),

  // updateStartup: protectedProcedure
  // .input(z.object({
  //   startupName : z.string(),
  //   startupEmail : z.string().email(),
  //   industry : z.string(),
  //   website : z.string().url(),
  //   linkedInUrl : z.string().url(),
  // }))
  // .mutation(async ({ ctx, input }) => {
  //   return ctx.db.startup.update({
  //     where: { userId: ctx?.dbUser?.id },
  //     data: input,
  //   });
  // }
  // ),

  // deleteStartup: protectedProcedure
  // .mutation(async ({ ctx }) => {
  //   return ctx.db.startup.delete({
  //     where: { userId: ctx?.dbUser?.id },
  //   });
  // }
  // ),

  // getStartup: protectedProcedure
  // .query(async ({ ctx }) => {
  //   return ctx.db.startup.findUnique({
  //     where: { userId: ctx?.dbUser?.id },
  //   });
  // }
  // ),


    
  })

