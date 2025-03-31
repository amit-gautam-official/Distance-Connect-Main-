import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

// Define the new type for day availability with start and end times
const dayAvailabilitySchema = z.object({
  enabled: z.boolean().default(false),
  timeSlots: z.array(
    z.object({
      startTime: z.string(),
      endTime: z.string(),
    })
  ).default([]),
});

// Define the schema for all days
const daysAvailabilitySchema = z.object({
  Sunday: dayAvailabilitySchema,
  Monday: dayAvailabilitySchema,
  Tuesday: dayAvailabilitySchema,
  Wednesday: dayAvailabilitySchema,
  Thursday: dayAvailabilitySchema,
  Friday: dayAvailabilitySchema,
  Saturday: dayAvailabilitySchema,
});

export const availabilityRouter = createTRPCRouter({
  getAvailability: protectedProcedure
    .query(async ({ ctx }) => {
      const availability = await ctx.db.availability.findUnique({
        where: {
          mentorUserId: ctx.dbUser!.id,
        },
        select: {
          daysAvailable: true,
          bufferTime: true,
        },
      });

      // Return default values if no availability is found
      if (!availability) {
        return {
          daysAvailable: {
            Sunday: { enabled: false, timeSlots: [] },
            Monday: { enabled: false, timeSlots: [] },
            Tuesday: { enabled: false, timeSlots: [] },
            Wednesday: { enabled: false, timeSlots: [] },
            Thursday: { enabled: false, timeSlots: [] },
            Friday: { enabled: false, timeSlots: [] },
            Saturday: { enabled: false, timeSlots: [] },
          },
          bufferTime: 15,
        };
      }

      return availability;
    }),

  createAndUpdateAvailability: protectedProcedure
    .input(z.object({ 
      daysAvailable: daysAvailabilitySchema,
      bufferTime: z.number().min(0).default(15)
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.availability.upsert({
        where: {
          mentorUserId: ctx.dbUser!.id
        },
        create: {
          daysAvailable: input.daysAvailable,
          bufferTime: input.bufferTime,
          mentorUserId: ctx.dbUser!.id
        },
        update: {
          daysAvailable: input.daysAvailable,
          bufferTime: input.bufferTime
        }
      });
    }),

   

  })