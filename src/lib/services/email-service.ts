import nodemailer from 'nodemailer';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';

// Base Email Service class for nodemailer configuration
export class EmailService {
  protected transporter: Transporter;
  protected fromEmail: string;

  constructor() {
    // Get environment variables
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '587');
    const user = process.env.EMAIL_USER || '';
    const pass = process.env.EMAIL_PASSWORD || '';
    this.fromEmail = process.env.EMAIL_FROM || 'support@distanceconnect.com';

    // Create nodemailer transporter
    this.transporter = createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }

  // Method to send email with default options
  async sendEmail(options: SendMailOptions): Promise<any> {
    try {
      // Set default from email if not provided
      if (!options.from) {
        options.from = this.fromEmail;
      }

      // Send mail with defined transport object
      const info = await this.transporter.sendMail(options);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Verify transporter configuration
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection error:', error);
      return false;
    }
  }
} 