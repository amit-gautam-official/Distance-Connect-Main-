"use server"
import { EmailWaitlistService } from "@/lib/emails/email-waitlist";


export const sendWaitlistEmail = async (email: string, name: string) => {
  try {
    const waitlistService = new EmailWaitlistService();

    const isConnected = await waitlistService.verifyConnection();
    if (!isConnected) {
      console.error('Email service connection failed');
      return { error: 'Email service connection failed' };
    }

    const result = await waitlistService.sendWaitlistEmail({ email, name });
    return result;
  } catch (error) {
    console.error('Error sending waitlist email:', error);
    return { error: 'Failed to send waitlist email' };
  }
}