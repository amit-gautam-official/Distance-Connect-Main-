import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const availabilityRouter = createTRPCRouter({

  createAndUpdateAvailability: protectedProcedure
    .input(z.object({ 
      daysAvailable : z.object({
        Sunday : z.boolean().optional(),
        Monday : z.boolean().optional(),
        Tuesday : z.boolean().optional(),
        Wednesday : z.boolean().optional(),
        Thursday : z.boolean().optional(),
        Friday : z.boolean().optional(),
        Saturday : z.boolean().optional()
      }),
      startTime : z.string(),
      endTime : z.string()
      
     }))
    .mutation(async ({ ctx, input }) => {

        return ctx.db.availability.upsert({
            where :{
                mentorUserId : ctx.dbUser!.id
            },
            create: {
              daysAvailable: input.daysAvailable,
              startTime: input.startTime,
              endTime: input.endTime,
              mentorUserId: ctx.dbUser!.id
            },
            update: {
              daysAvailable: input.daysAvailable,
              startTime: input.startTime,
              endTime: input.endTime
            
            }
          });
    }),

   

  })