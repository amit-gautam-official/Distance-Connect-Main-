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
      image : z.string().optional(),
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
            image: input.image,
          },
        })
      ])
      
    }),

  updateMentorBanner : protectedProcedure
  .input(z.object({
    profileBanner : z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.mentor.update({
      where: { userId: ctx?.dbUser?.id },
      data: {
        profileBanner : input.profileBanner,
      },
    });
  }
  ),

  
   

  updateMentorCompanyEmail : protectedProcedure
  .input(z.object({
    companyEmail : z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.mentor.update({
      where: { userId: ctx?.dbUser?.id },
      data: {
        companyEmailVerified : true,
        companyEmail : input.companyEmail,
      },
    });
  }),


  updateMentor: protectedProcedure
  .input(
    z.object({
      linkedinUrl: z
        .string({ required_error: "LinkedIn URL is required" })
        .url("Please enter a valid LinkedIn URL").optional(),
      companyType: z.string({ required_error: "Company type is required" }).optional(),
      currentCompany: z.string({ required_error: "Current company is required" }).optional(),
      pinCode: z
        .number({ required_error: "Pin code is required" })
        .min(100000, "Pin code must be at least 6 digits")
        .max(999999, "Pin code must be at most 6 digits").optional(),
      state: z.string({ required_error: "State is required" }).optional(),
      skills: z
        .array(z.string({ required_error: "Skill must be a string" }))
        .min(1, "Please provide at least one skill").optional(),
      hiringFields: z
        .array(z.string({ required_error: "Hiring field must be a string" }))
        .min(1, "Please provide at least one hiring field").optional(),
      jobTitle: z.string({ required_error: "Job title is required" }).optional(),
      experience: z.string({ required_error: "Experience is required" }).optional(),
      mentorName: z.string({ required_error: "Mentor name is required" }).optional(),
      industry: z.string({ required_error: "Industry is required" }).optional(),
      bio: z.string().optional(),
      companyEmail: z
        .string({ required_error: "Company email is required" })
        .email("Please enter a valid email address")
        .optional(),
  
      education: z
        .array(
          z.object({
            institution: z.string({ required_error: "Institution name is required" }),
            degree: z.string({ required_error: "Degree is required" }),
            field: z.string({ required_error: "Field of study is required" }),
            startYear: z.string({ required_error: "Start year is required" }),
            endYear: z.string({ required_error: "End year is required" }),
          })
        )
        .optional(),
  
      wholeExperience: z
        .array(
          z.object({
            company: z.string({ required_error: "Company name is required" }),
            position: z.string({ required_error: "Position is required" }),
            description: z.string({ required_error: "Description is required" }),
            startDate: z.string({ required_error: "Start date is required" }),
            endDate: z.string({ required_error: "End date is required" }),
            current: z.boolean({ required_error: "Current employment status is required" }),
            proofUrl : z.string().optional(),
            verified : z.boolean().optional(),
          })
        )
        .optional(),
    })
  )
  
  .mutation(async ({ ctx, input }) => {



   if(input?.currentCompany){
    const currentCompany = await ctx.db.mentor.findUnique({
      where: { userId: ctx?.dbUser?.id },
      select: { currentCompany: true },
    });

    if(currentCompany){
      if(currentCompany.currentCompany !== input.currentCompany){
        await ctx.db.mentor.update({
          where: { userId: ctx?.dbUser?.id },
          data: {
            companyEmailVerified : false,
          },
        });
      }
    }
   }

    return ctx.db.mentor.update({
      where: { userId: ctx?.dbUser?.id },
      data: input,
    });
  }
  ),


  updateMentorTier: protectedProcedure
    .input(
      z.object({

        mentorUserId : z.string(),
        mentorTier: z.enum([
          "Junior",
          "Mid-Level A",
          "Mid-Level B",
          "Senior A",
          "Senior B",
          "Expert",
        ]).optional(),
        

      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input) return null;
      
      return ctx.db.mentor.update({
        where: { userId: input.mentorUserId },
        data: {
          mentorTier : input.mentorTier,
        },
      });
    }
  ),

  updateMentorPrice : protectedProcedure
  .input(
    z.object({
      mentorUserId : z.string(),
      price: z.string()
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!input) return null;
    
    return ctx.db.mentor.update({
      where: { userId: input.mentorUserId },
      data: {
        mentorSessionPriceRange : input.price,
      },
    });
  }
  ),

  updateMentorTierReasoning : protectedProcedure
  .input(
    z.object({
      mentorUserId : z.string(),
      tierReasoning: z.string()
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!input) return null;
    
    return ctx.db.mentor.update({
      where: { userId: input.mentorUserId },
      data: {
        tierReasoning : input.tierReasoning,
      },
    });
  }
  ),

  updateFromAdmin: protectedProcedure
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

  getMentorsForAdmin: protectedProcedure
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
        mentorTier: true,
        mentorSessionPriceRange: true,
        tierReasoning: true,
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



  // deleteMentor: protectedProcedure
  // .mutation(async ({ ctx }) => {
  //   return ctx.db.student.delete({
  //     where: { userId: ctx?.dbUser?.id },
  //   });
  // }
  // ),

  getMentor: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.mentor.findUnique({
      where: { userId: ctx?.dbUser?.id },
    });
  }
  ),

  getAllMentors: publicProcedure
  .query(async ({ ctx }) => {
    return ctx.db.mentor.findMany({
      where:{
        AND: [
          { companyEmailVerified: true },
          { verified: true },
        ]
      },
      select: {
        companyEmailVerified: true,
        availability: true,
        userId: true,
        bio: true,
        mentorName: true,
        currentCompany: true,
        jobTitle: true,
        experience: true,
        industry: true,
        hiringFields: true,
        companyType: true,
        state : true,
        user : {
          select : {
            image : true,
          }
        },
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

