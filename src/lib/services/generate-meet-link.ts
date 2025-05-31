import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

interface Attendee {
  email: string;
}

interface GenerateMeetLinkInput {
  dateTime: string;
  duration: number;
  attendees: Attendee[];
}

export async function generateMeetLink(input: GenerateMeetLinkInput): Promise<{ meetLink: string }> {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing Google service account credentials');
    }

    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: 'support@distanceconnect.in',
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const startDateTime = new Date(input.dateTime);
    const endDateTime = new Date(startDateTime.getTime() + input.duration * 60000);

    const event = {
      summary: "Meeting",
      description: 'Virtual meeting via Google Meet',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(2, 15),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      attendees: input.attendees,
    };

    const response = await calendar.events.insert({
      calendarId: 'support@distanceconnect.in',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return { meetLink: response.data.hangoutLink || '' };
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to generate Google Meet link');
  }
}
