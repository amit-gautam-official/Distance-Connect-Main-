import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const studentRouter = createTRPCRouter({
 

  createStudentUpdateUser: protectedProcedure
    .input(z.object({ 
      username: z.string().min(3),
      studentRole: z.enum(["HIGHSCHOOL", "COLLEGE", "WORKING"]),
      institutionName : z.string(),
      pinCode : z.number(),
      state : z.string(),
      interestFields : z.array(z.string()),
      companyName : z.string(),
      jobTitle : z.string(),
      experience : z.string(),
      industry : z.string(),
      courseSpecialization : z.string(),
      role : z.enum(["STUDENT", "MENTOR", "STARTUP"]),
      isRegistered : z.boolean(),
      avatarUrl : z.string(),
      name : z.string(),
     }))
    .mutation(async ({ ctx, input }) => {

      return await ctx.db.$transaction([
        ctx.db.student.create({
          data: {
              userId : ctx?.dbUser?.id!,
              studentRole : input.studentRole,
              institutionName : input.institutionName,
              pinCode : input.pinCode,
              state : input.state,
              interestFields : input.interestFields,
              companyName : input.companyName,
              jobTitle : input.jobTitle,
              experience : input.experience,
              industry : input.industry,
              courseSpecialization : input.courseSpecialization,
              studentName : input.name,
              
            
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
        }),
      ])
    }),

  // updateStudent: protectedProcedure
  // .input(z.object({
  //     university : z.string(),
  //     course : z.string(),
  //     yearOfStudy : z.enum(["FIRST", "SECOND", "THIRD", "FOURTH"]),
  //     linkedInUrl : z.string(),
  // }))
  // .mutation(async ({ ctx, input }) => {
  //   return ctx.db.student.update({
  //     where: { userId: ctx?.dbUser?.id },
  //     data: input,
  //   });
  // }
  // ),

  // deleteStudent: protectedProcedure
  // .mutation(async ({ ctx }) => {
  //   return ctx.db.student.delete({
  //     where: { userId: ctx?.dbUser?.id },
  //   });
  // }
  // ),

  getStudentOnly: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.student.findUnique({
      where: { userId: ctx?.dbUser?.id },
    });
  }
  ),

  updateStudent: protectedProcedure
  .input(z.object({
    studentRole: z.enum(["HIGHSCHOOL", "COLLEGE", "WORKING"]),
    institutionName : z.string(),
    pinCode : z.number(),
    interestFields : z.array(z.string()),
    state : z.string(),

    
    linkedinUrl : z.string(),
    courseSpecialization : z.string(),
    companyName : z.string(),
    jobTitle : z.string(),
    experience : z.string(),
    industry : z.string(),
 
    studentName : z.string(),
    
    
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.student.update({
      where: { userId: ctx?.dbUser?.id },
      data: input,
    });
  }
  ),

  getStudent: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.student.findUnique({
      where: { userId: ctx?.dbUser?.id },
      include: {
        chatRooms: true,
        scheduledMeetings: {
          include: {
            mentor: {
              include: {
                user: true,
              
              },
            },
          },
        },
        user: true,
      },
    });
  }
  ),

  getStudentByUserId: protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.db.student.findUnique({
      where: { userId: input.userId },
      select: {
        userId: true,
        studentName: true,
        institutionName: true,
        interestFields: true,
        studentRole: true,
      }
    });
  }),

    
  })

