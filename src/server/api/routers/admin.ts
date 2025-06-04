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



  getMeetingLogs: adminProcedure
  .input(z.object({
    date: z.date().optional(),
    status: z.enum(['paid', 'failed']).optional(),
  }))
  .query(async ({ ctx, input }) => {
    // Build the where clause based on input filters
    const where: any = {};
    
    if (input.date) {
      where.selectedDate = input.date;
    }
    
    if (input.status === 'paid') {
      where.paymentStatus = true;
    } else if (input.status === 'failed') {
      where.paymentStatus = false;
    }
    
    // Get all scheduled meetings with their details
    const meetings = await ctx.db.scheduledMeetings.findMany({
      where ,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        student: {
          select: {
            id: true, // Include student database ID
            studentName: true,
            userId: true, // This is the reference to the User table
            hasUsedFreeSession: true,
            scheduledMeetings: {
              where : {
                paymentStatus : true
              },
              orderBy: {
                createdAt: 'asc'
              },
              take: 2,
              select: {
                id: true,
                createdAt: true
              }
            }
          },
        },
        mentor: {
          select: {
            id: true, // Include mentor database ID
            mentorName: true,
            userId: true, // This is the reference to the User table
          },
        },
      },
    });
    
    // Process the meetings to determine if each is a first session
    return meetings.map(meeting => {
      // Check if this is the student's first meeting
      const isFirstSession = meeting.student?.scheduledMeetings?.[0]?.id === meeting.id;
      
      // Remove the scheduledMeetings array from the response to keep it clean
      const { student, ...rest } = meeting;
      const { scheduledMeetings, ...studentRest } = student;
      
      return {
        ...rest,
        student: studentRest,
        studentId: student.id, // Add studentId to the top level
        mentorId: meeting.mentor.id, // Add mentorId to the top level
        isFirstSession
      };
    });
  }),

getWorkshopLogs : adminProcedure
  .query(async ({ ctx }) => {
    return ctx.db.workshop.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        mentor: true,
        enrollments: {
          include :{
            student : true,
          }
        },
      },
    })})
})
