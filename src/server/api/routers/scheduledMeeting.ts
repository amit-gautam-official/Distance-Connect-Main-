import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

const getDateTimeFromDateAndTime = (date: Date, time: string): Date => {
  const [hours, minutesPart] = time.split(":");

  const minutesArray = minutesPart ? minutesPart.split(" ") : ["0", "AM"];
  const [minutes, period] = minutesArray;
  let hour = parseInt(hours!);
  const minute = parseInt(minutes!);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
};



export const scheduledMeetingsRouter = createTRPCRouter({

  createScheduledMeeting: protectedProcedure
    .input(z.object({ 
       mentorUserId : z.string(),
       selectedTime : z.string(),
        selectedDate : z.date(),
        formatedDate : z.string(),
        formatedTimeStamp : z.string(),
        duration : z.number(),
        eventId : z.string(),
        userNote : z.string(),
        eventName : z.string(),
        userEmailForMeet : z.string().email(),
        mentorEmailForMeet : z.string().email()
      
     }))
    .mutation(async ({ ctx, input }) => {


      const prevBooking = await ctx.db.scheduledMeetings.findMany({
        where :{
          selectedDate: input.selectedDate, 
          mentorUserId: input.mentorUserId,
        }
      })

      const checkTimeSlot = (time: string) => {
        const selectedStart = getDateTimeFromDateAndTime(input.selectedDate, time);
        const selectedEnd = new Date(selectedStart.getTime() + 30 * 60 * 1000);
      
        return prevBooking.some((booking) => {
          const bookingStart = getDateTimeFromDateAndTime(new Date(booking.selectedDate), booking.selectedTime);
          const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60 * 1000);
      
          // Check for overlap
          const isOverlapping = selectedStart < bookingEnd && selectedEnd > bookingStart;
          return isOverlapping;
        });
      };

      const isOverlapping = checkTimeSlot(input.selectedTime);

      if (isOverlapping) {
        throw new Error("Selected time slot is already booked. Please choose another time.");
      }

      

      return await ctx.db.scheduledMeetings.create({
        data : {
            mentorUserId : input.mentorUserId,
            selectedTime : input.selectedTime,
            selectedDate : input.selectedDate,
            formatedDate : input.formatedDate,
            formatedTimeStamp : input.formatedTimeStamp,
            duration : input.duration,
            eventId : input.eventId,
            userNote : input.userNote,
            studentUserId : ctx.dbUser!.id,
            eventName : input.eventName,
            userEmailForMeet : input.userEmailForMeet,
            mentorEmailForMeet : input.mentorEmailForMeet,
        }
      })
    }),

    getScheduledMeetingsList: protectedProcedure
    .input(z.object({ 
        selectedDate : z.date(),
        eventId : z.string(),
        mentorUserId : z.string()
     }))
    .query(async ({ ctx, input }) => {
      return ctx.db.scheduledMeetings.findMany({
        where: {
          selectedDate: input.selectedDate, 
          paymentStatus : true,
          // eventId: input.eventId,
          mentorUserId: input.mentorUserId,
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
          studentUserId: ctx.user.id,
          paymentStatus : true,
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
        },
        orderBy: {
          selectedDate: 'asc',
        },
        
        select: {
          id: true,
          selectedDate: true,
          selectedTime: true,
          eventName: true,
          userNote: true,
          meetUrl: true,
          completed: true,
          formatedTimeStamp: true,
          student : {
            select : {
              studentName : true,
            }
          }
        }
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
          meetUrl: meeting.meetUrl,
          completed: meeting.completed,
          formatedTimeStamp: meeting.formatedTimeStamp,
          selectedDate: meeting.selectedDate,
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