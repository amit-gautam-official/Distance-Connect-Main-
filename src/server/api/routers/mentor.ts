import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const mentorRouter = createTRPCRouter({
 

  createMentorUpdateUser: protectedProcedure
    .input(z.object({ 
      username: z.string().min(3),
      currentCompany : z.string(),
      jobTitle : z.string(),
      experience : z.string(),
      industry : z.string(),
      pinCode : z.number(),
      state : z.string(),
      name : z.string(),
      role : z.enum(["STUDENT", "MENTOR", "STARTUP"]),
      isRegistered : z.boolean(),
      avatarUrl : z.string(),
      companyType : z.string(),
      hiringFields : z.array(z.string()),
     }))


    .mutation(async ({ ctx, input }) => {

      return await ctx.db.$transaction([
        ctx.db.mentor.create({
          data: {
            currentCompany : input.currentCompany,
            jobTitle : input.jobTitle,
            experience : input.experience,
            industry : input.industry,
              pinCode : input.pinCode,
              state : input.state,
              userId: ctx?.dbUser?.id!, 
              mentorName : input.name,
              hiringFields : input.hiringFields,
              companyType : input.companyType,
          },  
        }),
        ctx.db.user.update({
          where: { id: ctx?.dbUser?.id! },
          data: {
            username: input.username,
            name: input.name,
            role: input.role,
            isRegistered: input.isRegistered,
            avatarUrl: input.avatarUrl,
          },
        })
      ])
      
    }),

  updateMentor: protectedProcedure
  .input(z.object({
    linkedinUrl : z.string(),
    companyType : z.string(),
    currentCompany : z.string(),
    pinCode : z.number(),
    state : z.string(),
  hiringFields : z.array(z.string()),
  jobTitle : z.string(),
  experience : z.string(),
  mentorName : z.string(),
  industry : z.string(),
 
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.mentor.update({
      where: { userId: ctx?.dbUser?.id },
      data: input,
    });
  }
  ),

  // deleteMentor: protectedProcedure
  // .mutation(async ({ ctx }) => {
  //   return ctx.db.student.delete({
  //     where: { userId: ctx?.dbUser?.id },
  //   });
  // }
  // ),

  // getMentor: protectedProcedure
  // .query(async ({ ctx }) => {
  //   return ctx.db.student.findUnique({
  //     where: { userId: ctx?.dbUser?.id },
  //   });
  // }
  // ),

  getAllMentors: publicProcedure
  .query(async ({ ctx }) => {
    return ctx.db.mentor.findMany({
      select: {
        userId: true,
        mentorName: true,
        currentCompany: true,
        jobTitle: true,
        experience: true,
        industry: true,
        hiringFields: true,
        companyType: true,
        state : true,
        meetingEvents: {
          select: {
            id: true,
            eventName: true,
          }
        }
      }
    })
  }),

  getMentorByUserId: publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.db.mentor.findUnique({
      where: { userId: input.userId },
      select : {
        userId: true,
        mentorName: true,
        currentCompany: true,
        jobTitle: true,
        experience: true,
        industry: true,
        hiringFields: true,
        companyType: true,
        state : true,
        meetingEvents : {
          select : {
            id : true,
            eventName : true,
          }
        }
      }
    });

  }),

  getMentorData: publicProcedure
  .input(z.object({ mentorId: z.string() }))
  .query(async ({ ctx, input }) => {
    const mentor = await ctx.db.mentor.findFirst({
      where: {
        userId: input.mentorId,
      },
      include: {
        user: true, // Include related User data
        meetingEvents: true, // Include meeting events
        availability: true, // Include availability
        scheduledMeetings: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        }, // Include scheduled meetings with student info
      },
    });
  }),


  getMentorDataById: protectedProcedure
  .query(async ({ ctx }) => {
    const mentor = await ctx.db.mentor.findFirst({
      where: {
        userId: ctx?.dbUser?.id!,
      },
      include: {
        user: true, // Include related User data
        meetingEvents: true, // Include meeting events
        availability: true, // Include availability
        scheduledMeetings: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        }, // Include scheduled meetings with student info
      },
    });
    return mentor;
  })



    
  })

