import { z } from "zod";

import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({



  updateFromAdmin: adminProcedure
  .input(z.object({
    userId: z.string(),
    messageFromAdmin: z.string().optional(),
    verified: z.boolean().optional(),
    companyEmailVerified: z.boolean().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    //remove userId from input
    const { userId, ...data } = input;

    return ctx.db.mentor.update({
      where: { userId: input.userId },
      data: { ...data },
    });
  }),

  getMentorsForAdmin: adminProcedure
  .query(async ({ ctx }) => {
    return ctx.db.mentor.findMany({
      select: {
        userId: true,
        mentorName: true,
        currentCompany: true,
        companyEmail: true,
        companyEmailVerified: true,
        verified: true,
        linkedinUrl: true,
        wholeExperience: true,
        industry: true,
        user:{
          select: {
            id: true,
            email: true,
            username: true,
            image: true,
          },
        }
      }
    })
  }),



  getStudentsForAdmin: adminProcedure
  .query(async ({ ctx }) => {
    return ctx.db.student.findMany({
      select: {
        userId: true,
        studentName: true,
        studentRole: true,
        linkedinUrl: true,
        user:{
          select: {
            id: true,
            email: true,
            username: true,
            image: true,
          },
        }
      },
    });
  }),



    
  })

