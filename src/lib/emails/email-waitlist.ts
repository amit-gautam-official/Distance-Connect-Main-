import { EmailService } from '../services/email-service';
import { type SendMailOptions } from 'nodemailer';

export interface EmailWaitlistData {
  email: string;
    name?: string;
}

export class EmailWaitlistService extends EmailService {
  private fromName = 'Distance Connect Team';

  /**
   * Sends a waitlist confirmation email with an image
   * @param data - Email waitlist data
   * @returns Promise with email send result
   */
  async sendWaitlistEmail(data: EmailWaitlistData): Promise<any> {
    const { email,name } = data;

    const htmlContent = this.generateWaitlistEmailHtml(data);

    const mailOptions: SendMailOptions = {
      from: this.fromEmail,
      to: email,
      subject: 'You’re on the Waitlist!',
      html: htmlContent,
      text: `Hi ${name},\n\nThanks for joining the waitlist. We'll be in touch soon!`,
    };

    return this.sendEmail(mailOptions);
  }

  /**
   * Generates HTML content for the waitlist email
   * @param data - Email waitlist data
   * @returns HTML string
   */
  private generateWaitlistEmailHtml(data: EmailWaitlistData): string {
    const { email, name } = data;

    const imageUrl = `https://storage.googleapis.com/dc-public-files/email-images/waitlist.png`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Waitlist Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9fafc;
          margin: 0;
          padding: 20px;
          color: #333;
        }

        .container {
          max-width: 600px;
          background-color: #ffffff;
          margin: 40px auto;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
          border: 1px solid #e0e0e0;
        }

        h2 {
          text-align: center;
          font-size: 24px;
          color: #2e5aac;
          margin-bottom: 20px;
        }

        p {
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .footer {
          font-size: 12px;
          color: #999;
          text-align: center;
          margin-top: 30px;
        }

        .center-image {
          display: block;
          margin: 0 auto;
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>You're on the Waitlist 🎉</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining our waitlist! We're excited to have you on board. Stay tuned — you'll be the first to know when we launch!</p>
        <img src="${imageUrl}" alt="You're on the waitlist" class="center-image" />
        <p>If you have any questions, feel free to reply to this email.</p>
      </div>
      <div class="footer">
        &copy; 2025 Distance Connect. All rights reserved.
      </div>
    </body>
    </html>
    `;
  }
}

export const sendWaitlistEmail = async (email: string) => {
  try {
    const waitlistService = new EmailWaitlistService();

    const isConnected = await waitlistService.verifyConnection();
    if (!isConnected) {
      console.error('Email service connection failed');
      return { error: 'Email service connection failed' };
    }

    const result = await waitlistService.sendWaitlistEmail({ email });
    return result;
  } catch (error) {
    console.error('Error sending waitlist email:', error);
    return { error: 'Error sending waitlist email' };
  }
};
