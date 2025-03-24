import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export const meetRouter = createTRPCRouter({
  generateMeetLink: protectedProcedure
    .input(z.object({ 
      dateTime: z.string(),
      duration : z.number().int(),
      attendees: z.array(z.object({ email: z.string().email() })),
    
    }))
    .mutation(async ({ input }) => {
      // //console.log("--------------------------------------")
      // //console.log(input.dateTime)
      try {
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
          throw new Error('Missing Google service account credentials');
        }

        const auth = new JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/calendar'],
          subject: 'talha@distanceconnect.in',
        });

        const calendar = google.calendar({ version: 'v3', auth });

        // Create event payload
        const startDateTime = new Date(input.dateTime);
        const endDateTime = new Date(startDateTime.getTime() + input.duration * 60000); // 60 minutes later

        
        const event = {
          summary: "Meeting",
          description: 'Virtual meeting via Google Meet',
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'Asia/Kolkata', // IANA time zone format
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'Asia/Kolkata',
          },
          conferenceData: {
            createRequest: {
              requestId: Math.random().toString(36).substring(2, 15), // Simple random ID
              conferenceSolutionKey:{ type: "hangoutsMeet" } , // Correct type
            }
          },
            conferenceSolution: {
              key: {
                  type: "hangoutsMeet"
      }
          },
          attendees: input.attendees,
        };

        // Insert event into calendar
        const response = await calendar.events.insert({
          calendarId: 'talha@distanceconnect.in', // Ensure the service account has write access
          requestBody: event,
          conferenceDataVersion: 1,
        });
        // //console.log("Response", response)
        // Return the Google Meet link
        return { meetLink: response.data.hangoutLink || '' };

      } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to generate Google Meet link');
      }
    }),
});