import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const meetingEventRouter = createTRPCRouter({

  createMeetingEvent: protectedProcedure
    .input(z.object({ 
      eventName : z.string(),
      duration : z.number(),
      description : z.string().optional(),
      meetEmail : z.string().email(),
      price : z.number()      
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.meetingEvent.create({
        data: {
          eventName: input.eventName,
          duration: input.duration,
          description: input.description || '',
          meetEmail : input.meetEmail,
          eventPrice : input.price,
          mentorUserId: ctx.dbUser!.id,
        },
      });
      
     
      
    }),

 

  getMeetingEventById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.meetingEvent.findUnique({
        where: {
          id: input.id,
        },
      });
    }),




  
  getMeetingEventList: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.meetingEvent.findMany({
        where: {
          mentorUserId: ctx.dbUser!.id,
        },

      });
    }),

  
  deleteMeetingEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.meetingEvent.delete({
        where: {
          id: input.id,
        },
      });
    }),

  updateMeetingEvent: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      eventName : z.string(),
      duration : z.number(),
      description : z.string().optional(),
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.meetingEvent.update({
        where: {
          id: input.id,
        },
        data: {
          eventName: input.eventName,
          duration: input.duration,
          description: input.description || '',
        },
      });
    }),
  })