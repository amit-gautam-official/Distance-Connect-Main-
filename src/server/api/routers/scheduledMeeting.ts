import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const scheduledMeetingsRouter = createTRPCRouter({

  createScheduledMeeting: protectedProcedure
    .input(z.object({ 
       mentorUserId : z.string(),
       selectedTime : z.string(),
        selectedDate : z.date(),
        formatedDate : z.string(),
        formatedTimeStamp : z.string(),
        duration : z.number(),
        meetUrl : z.string().url(),
        eventId : z.string(),
        userNote : z.string(),
        eventName : z.string()
      
     }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.scheduledMeetings.create({
        data : {
            mentorUserId : input.mentorUserId,
            selectedTime : input.selectedTime,
            selectedDate : input.selectedDate,
            formatedDate : input.formatedDate,
            formatedTimeStamp : input.formatedTimeStamp,
            duration : input.duration,
            meetUrl : input.meetUrl,
            eventId : input.eventId,
            userNote : input.userNote,
            studentUserId : ctx.dbUser!.id,
            eventName : input.eventName
        }
      })
    }),

    getScheduledMeetingsList: protectedProcedure
    .input(z.object({ 
        selectedDate : z.date(),
        eventId : z.string()
     }))
    .query(async ({ ctx, input }) => {
      return ctx.db.scheduledMeetings.findMany({
        where: {
          selectedDate: input.selectedDate, 
            eventId: input.eventId,
        },
      });
    }),

    getScheduledMeetingsListByMentor: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.scheduledMeetings.findMany({
        where: {
          mentorUserId: ctx.dbUser!.id
        },
        include: {
          student: true,
        },
      });
    }),


    getScheduledMeetingsListByStudent: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.scheduledMeetings.findMany({
        where: {
          studentUserId: ctx.dbUser!.id
        },
        include: {
          mentor: true,
        },
      });
    }),

    // New procedure to get scheduled meetings for the mentor dashboard
    getMentorScheduledMeetings: protectedProcedure
    .query(async ({ ctx }) => {
      const meetings = await ctx.db.scheduledMeetings.findMany({
        where: {
          mentorUserId: ctx.dbUser!.id,
          completed: false,
        },
        orderBy: {
          selectedDate: 'asc',
        },
        include: {
          student: true,
        },
        take: 3, // Limit to 3 most recent upcoming meetings
      });

      // Transform the data to match our ScheduledSessions component format
      return meetings.map(meeting => {
        const date = new Date(meeting.selectedDate);
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        
        return {
          id: meeting.id,
          title: meeting.eventName,
          description: meeting.userNote || `Meeting with ${meeting.student.studentName || 'Student'}`,
          date: `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`,
          time: meeting.selectedTime,
          meetUrl: meeting.meetUrl
        };
      });
    }),

    markMeetingCompleted: protectedProcedure
    .input(z.object({ meetingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.db.scheduledMeetings.update({
        where: { id: input.meetingId },
        data: { completed: true },
      });

      return meeting;
    }),

    addFeedback: protectedProcedure
    .input(z.object({ 
      meetingId: z.string(),
      feedback: z.string().min(1, "Feedback cannot be empty"),
      starRating: z.number().min(1).max(5, "Rating must be between 1 and 5 stars")
    }))
    .mutation(async ({ ctx, input }) => {
      // First verify that the meeting exists and belongs to the student
      const meeting = await ctx.db.scheduledMeetings.findFirst({
        where: {
          id: input.meetingId,
          studentUserId: ctx.dbUser!.id,
          completed: true
        }
      });

      if (!meeting) {
        throw new Error("Meeting not found or you don't have permission to add feedback");
      }

      // Check if feedback already exists
      if (meeting.feedback) {
        throw new Error("Feedback has already been submitted for this meeting");
      }

      // Update the meeting with feedback and star rating
      return await ctx.db.scheduledMeetings.update({
        where: { id: input.meetingId },
        data: { 
          feedback: input.feedback,
          star: input.starRating
        },
      });
    }),
  })