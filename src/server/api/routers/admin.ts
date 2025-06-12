import { z } from "zod";

import { createTRPCRouter, adminProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  verified: z.enum(["all", "verified", "unverified"]).default("all"),
});

const studentPaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});
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

  // getMentorsForAdmin: adminProcedure
  // .query(async ({ ctx }) => {
  //   return ctx.db.mentor.findMany({
  //     select: {
  //       userId: true,
  //       mentorName: true,
  //       currentCompany: true,
  //       companyEmail: true,
  //       companyEmailVerified: true,
  //       verified: true,
  //       linkedinUrl: true,
  //       wholeExperience: true,
  //       industry: true,
  //       user:{
  //         select: {
  //           id: true,
  //           email: true,
  //           username: true,
  //           image: true,
  //         },
  //       }
  //     }
  //   })
  // }),
  getMentorsForExport: adminProcedure
  .input(z.object({
    search: z.string().optional(),
    verified: z.enum(["all", "verified", "unverified"]).default("all"),
  }))
  .query(async ({ ctx, input }) => {
    const { search, verified } = input;

    // Build where clause (same as pagination query)
    const whereClause: any = {};

    if (search && search.trim()) {
      whereClause.OR = [
        {
          mentorName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (verified !== "all") {
      whereClause.verified = verified === "verified";
    }

    return ctx.db.mentor.findMany({
      where: whereClause,
      select: {
        userId: true,
        industry: true,
        linkedinUrl: true,
        currentCompany: true,
        mentorName: true,
        verified: true,
        wholeExperience: true,
        companyEmailVerified: true,
        companyEmail: true,
        mentorTier: true,
        mentorSessionPriceRange: true,
        tierReasoning: true,
        mentorPhoneNumber: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
        scheduledMeetings: {
          select: {
            id: true,
            isFreeSession: true,
          },
        },
      },
      orderBy: [
        { verified: 'asc' },
        { mentorName: 'asc' },
      ],
    });
  }),

  getMentorsForAdmin: adminProcedure
  .input(paginationSchema)
  .query(async ({ ctx, input }) => {
    const { page, limit, search, verified } = input;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    // Add search filters
    if (search && search.trim()) {
      whereClause.OR = [
        {
          mentorName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Add verification filter
    if (verified !== "all") {
      whereClause.verified = verified === "verified";
    }

    // Get total count for pagination
    const totalCount = await ctx.db.mentor.count({
      where: whereClause,
    });

    // Get paginated mentors
    const mentors = await ctx.db.mentor.findMany({
      where: whereClause,
      skip,
      take: limit,
      select: {
        userId: true,
        industry: true,
        linkedinUrl: true,
        currentCompany: true,
        mentorName: true,
        verified: true,
        wholeExperience: true,
        companyEmailVerified: true,
        companyEmail: true,
        mentorTier: true,
        mentorSessionPriceRange: true,
        tierReasoning: true,
        mentorPhoneNumber: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
        },
        scheduledMeetings: {
          select: {
            id: true,
            isFreeSession: true,
          },
        },
      },
      orderBy: [
        { verified: 'asc' }, // Show unverified first
        { mentorName: 'asc' },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      mentors,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }),


  // getStudentsForAdmin: adminProcedure
  // .query(async ({ ctx }) => {
  //   return ctx.db.student.findMany({
  //     select: {
  //       userId: true,
  //       studentName: true,
  //       studentRole: true,
  //       linkedinUrl: true,
  //       phoneNumber: true,
  //       user:{
  //         select: {
  //           id: true,
  //           email: true,
  //           username: true,
  //           image: true,
  //         },
  //       }
  //     },
  //   });
  // }),

  // Updated student procedure with pagination
getStudentsForAdmin: adminProcedure
  .input(studentPaginationSchema)
  .query(async ({ ctx, input }) => {
    const { page, limit, search } = input;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    // Add search filters
    if (search && search.trim()) {
      whereClause.OR = [
        {
          studentName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Get total count for pagination
    const totalCount = await ctx.db.student.count({
      where: whereClause,
    });

    // Get paginated students
    const students = await ctx.db.student.findMany({
      where: whereClause,
      skip,
      take: limit,
      select: {
        userId: true,
        studentName: true,
        studentRole: true,
        linkedinUrl: true,
        phoneNumber: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: [
        { studentName: 'asc' },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      students,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }),


  getStudentsForExport: adminProcedure
  .input(z.object({
    search: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    const { search } = input;

    const whereClause: any = {};

    if (search && search.trim()) {
      whereClause.OR = [
        {
          studentName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          studentRole: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    return ctx.db.student.findMany({
      where: whereClause,
      select: {
        userId: true,
        studentName: true,
        studentRole: true,
        linkedinUrl: true,
        phoneNumber: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: [
        { studentName: 'asc' },
      ],
    });
  }),



  // getMeetingLogs: adminProcedure
  // .input(z.object({
  //   date: z.date().optional(),
  //   status: z.enum(['paid', 'failed']).optional(),
  // }))
  // .query(async ({ ctx, input }) => {
  //   // Build the where clause based on input filters
  //   const where: any = {};
    
  //   if (input.date) {
  //     where.selectedDate = input.date;
  //   }
    
  //   if (input.status === 'paid') {
  //     where.paymentStatus = true;
  //   } else if (input.status === 'failed') {
  //     where.paymentStatus = false;
  //   }
    
  //   // Get all scheduled meetings with their details
  //   const meetings = await ctx.db.scheduledMeetings.findMany({
  //     where ,
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //     include: {
  //       student: {
  //         select: {
  //           id: true, // Include student database ID
  //           studentName: true,
  //           userId: true, // This is the reference to the User table
  //           hasUsedFreeSession: true,
  //           scheduledMeetings: {
  //             where : {
  //               paymentStatus : true
  //             },
  //             orderBy: {
  //               createdAt: 'asc'
  //             },
  //             take: 2,
  //             select: {
  //               id: true,
  //               createdAt: true
  //             }
  //           }
  //         },
  //       },
  //       mentor: {
  //         select: {
  //           id: true, // Include mentor database ID
  //           mentorName: true,
  //           userId: true, // This is the reference to the User table
  //         },
  //       },
  //     },
  //   });
    
  //   // Process the meetings to determine if each is a first session
  //   return meetings.map(meeting => {
  //     // Check if this is the student's first meeting
  //     const isFirstSession = meeting.student?.scheduledMeetings?.[0]?.id === meeting.id;
      
  //     // Remove the scheduledMeetings array from the response to keep it clean
  //     const { student, ...rest } = meeting;
  //     const { scheduledMeetings, ...studentRest } = student;
      
  //     return {
  //       ...rest,
  //       student: studentRest,
  //       studentId: student.id, // Add studentId to the top level
  //       mentorId: meeting.mentor.id, // Add mentorId to the top level
  //       isFirstSession
  //     };
  //   });
  // }),
  getMeetingLogs: adminProcedure
  .input(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    date: z.date().optional(),
    status: z.enum(['paid', 'failed']).optional(),
  }))
  .query(async ({ ctx, input }) => {
    const { page, limit, date, status } = input;
    const skip = (page - 1) * limit;

    // Build the where clause based on input filters
    const where: any = {};
    
    if (date) {
      where.selectedDate = date;
    }
    
    if (status === 'paid') {
      where.paymentStatus = true;
    } else if (status === 'failed') {
      where.paymentStatus = false;
    }
    
    // Get total count for pagination
    const totalCount = await ctx.db.scheduledMeetings.count({
      where,
    });

    // Get paginated meetings with their details
    const meetings = await ctx.db.scheduledMeetings.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        student: {
          select: {
            id: true,
            studentName: true,
            userId: true,
            hasUsedFreeSession: true,
            scheduledMeetings: {
              where: {
                paymentStatus: true
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
            id: true,
            mentorName: true,
            userId: true,
          },
        },
      },
    });
    
    // Process the meetings to determine if each is a first session
    const processedMeetings = meetings.map(meeting => {
      // Check if this is the student's first meeting
      const isFirstSession = meeting.student?.scheduledMeetings?.[0]?.id === meeting.id;
      
      // Remove the scheduledMeetings array from the response to keep it clean
      const { student, ...rest } = meeting;
      const { scheduledMeetings, ...studentRest } = student || {};
      
      return {
        ...rest,
        student: studentRest,
        studentId: student?.id || '', // Add studentId to the top level
        mentorId: meeting.mentor?.id || '', // Add mentorId to the top level
        isFirstSession
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      meetings: processedMeetings,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }),

// Additional procedure for getting all meeting logs for export (without pagination)
getMeetingLogsForExport: adminProcedure
  .input(z.object({
    date: z.date().optional(),
    status: z.enum(['paid', 'failed']).optional(),
  }))
  .query(async ({ ctx, input }) => {
    const { date, status } = input;

    // Build the where clause based on input filters
    const where: any = {};
    
    if (date) {
      where.selectedDate = date;
    }
    
    if (status === 'paid') {
      where.paymentStatus = true;
    } else if (status === 'failed') {
      where.paymentStatus = false;
    }
    
    // Get all meetings for export
    const meetings = await ctx.db.scheduledMeetings.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        student: {
          select: {
            id: true,
            studentName: true,
            userId: true,
            hasUsedFreeSession: true,
            scheduledMeetings: {
              where: {
                paymentStatus: true
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
            id: true,
            mentorName: true,
            userId: true,
          },
        },
      },
    });
    
    // Process the meetings to determine if each is a first session
    return meetings.map(meeting => {
      const isFirstSession = meeting.student?.scheduledMeetings?.[0]?.id === meeting.id;
      
      const { student, ...rest } = meeting;
      const { scheduledMeetings, ...studentRest } = student || {};
      
      return {
        ...rest,
        student: studentRest,
        studentId: student?.id || '',
        mentorId: meeting.mentor?.id || '',
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
    })}),

  // Get pending mentor payments
  getPendingMentorPayments: adminProcedure
    .query(async ({ ctx }) => {
      const { db } = ctx;
      
      // Get all session payments that are completed but not paid to mentor
      const sessionPayments = await db.scheduledMeetings.findMany({
        where: {
          paymentStatus: true,
          completed: true,
          receivedPaymentFromAdmin: false,
          isFreeSession: false,
        },
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
              bankDetails: true,
            },
          },
          RazorpayOrder: true,
        },
      });
      
      // Get all workshop payments that are completed but not paid to mentor
      const workshopPayments = await db.workshopEnrollment.findMany({
        where: {
          paymentStatus: true,
          receivedPaymentFromAdmin: false,
        },
        include: {
          workshop: {
            include: {
              mentor: {
                include: {
                  user: {
                    select: {
                      email: true,
                    },
                  },
                  bankDetails: true,
                },
              },
            },
          },
          orders: true,
        },
      });
      
      // Format session payments
      const formattedSessionPayments = sessionPayments.map((meeting) => {
        const order = meeting.RazorpayOrder[0];
        if (!order) return null;
        
        return {
          id: meeting.id,
          type: "session",
          title: meeting.eventName,
          mentorId: meeting.mentorUserId,
          mentorName: meeting.mentor.mentorName,
          mentorEmail: meeting.mentor.user.email,
          amount: order.amount,
          date: meeting.selectedDate,
          bankDetails: meeting.mentor.bankDetails,
        };
      }).filter(Boolean);
      
      // Format workshop payments
      const formattedWorkshopPayments = workshopPayments.map((enrollment) => {
        const order = enrollment.orders[0];
        if (!order) return null;
        
        return {
          id: enrollment.id,
          type: "workshop",
          title: enrollment.workshop.name,
          mentorId: enrollment.workshop.mentorUserId,
          mentorName: enrollment.workshop.mentor.mentorName,
          mentorEmail: enrollment.workshop.mentor.user.email,
          amount: order.amount,
          date: enrollment.createdAt,
          bankDetails: enrollment.workshop.mentor.bankDetails,
        };
      }).filter(Boolean);
      console.log("Formatted Session Payments:", formattedSessionPayments);
      console.log("Formatted Workshop Payments:", formattedWorkshopPayments);
      return [...formattedSessionPayments, ...formattedWorkshopPayments];
    }),

  // Get completed mentor payments
  getCompletedMentorPayments: adminProcedure
  .query(async ({ ctx }) => {
    const {  db } = ctx;
    
    // Get all session payments that are completed and paid to mentor
    const sessionPayments = await db.scheduledMeetings.findMany({
      where: {
        paymentStatus: true,
        completed: true,
        receivedPaymentFromAdmin: true,
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        RazorpayOrder: true,
      },
    });
    
    // Get all workshop payments that are completed and paid to mentor
    const workshopPayments = await db.workshopEnrollment.findMany({
      where: {
        paymentStatus: true,
        receivedPaymentFromAdmin: true,
      },
      include: {
        workshop: {
          include: {
            mentor: {
              include: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        },
        orders: true,
      },
    });
    
    // Format session payments
    const formattedSessionPayments = sessionPayments.map((meeting) => {
      const order = meeting.RazorpayOrder[0];
      if (!order) return null;
      
      return {
        id: meeting.id,
        type: "session",
        title: meeting.eventName,
        mentorId: meeting.mentorUserId,
        mentorName: meeting.mentor.mentorName,
        mentorEmail: meeting.mentor.user.email,
        amount: order.amount,
        date: meeting.selectedDate,
        paymentDate: meeting.updatedAt, // Using updatedAt as the payment date
      };
    }).filter(Boolean);
    
    // Format workshop payments
    const formattedWorkshopPayments = workshopPayments.map((enrollment) => {
      const order = enrollment.orders[0];
      if (!order) return null;
      
      return {
        id: enrollment.id,
        type: "workshop",
        title: enrollment.workshop.name,
        mentorId: enrollment.workshop.mentorUserId,
        mentorName: enrollment.workshop.mentor.mentorName,
        mentorEmail: enrollment.workshop.mentor.user.email,
        amount: order.amount,
        date: enrollment.createdAt,
        paymentDate: enrollment.updatedAt, // Using updatedAt as the payment date
      };
    }).filter(Boolean);
    
    return [...formattedSessionPayments, ...formattedWorkshopPayments];
  }),

  // Mark a payment as paid to mentor
  markMentorPaymentAsPaid: adminProcedure
  .input(
    z.object({
      type: z.enum(["session", "workshop"]),
      id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const {  db } = ctx;

    
    if (input.type === "session") {
      await db.scheduledMeetings.update({
        where: { id: input.id },
        data: { receivedPaymentFromAdmin: true },
      });
    } else if (input.type === "workshop") {
      await db.workshopEnrollment.update({
        where: { id: input.id },
        data: { receivedPaymentFromAdmin: true },
      });
    }
    
    return { success: true };
  }),
});
