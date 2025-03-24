import { z } from "zod";
import React from "react";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import Email from "../../../../emails/index"
import { Resend } from 'resend';

  const resend = new Resend("re_eH5AoK4d_4vFE5qH9yDuH89yM7bXkvK2a");

export const emailRouter = createTRPCRouter({

   
  sendEmail: protectedProcedure
    .input(z.object({ 
     date : z.string(),
        mentorName : z.string(),
        duration : z.string(),
        meetingTime : z.string(),
        meetingUrl : z.string().url(),
        
      
     }))
    .mutation(async ({ ctx, input }) => {
        try {
            const toEmail = ctx.user.email!
            //console.log(toEmail)
            await resend.emails.send({
                to: 'talhanadeem1826@gmail.com',
                react: React.createElement(Email, {
                    businessName: input.mentorName,
                    date: input.date,
                    duration: input.duration,
                    meetingTime: input.meetingTime,
                    meetingUrl: input.meetingUrl,
                    userFirstName: ctx.dbUser!.name!,
                }),
                from: 'onboarding@resend.dev',
                subject: "Meeting Schedul Details",
            })
                  } catch (error) {
                    //console.log('error in sending email')
                    //console.log(error)
                  }
        
    }),

   

  })