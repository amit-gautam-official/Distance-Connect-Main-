import { EmailService } from '../services/email-service';
import { type SendMailOptions } from 'nodemailer';

export interface EmailVerificationData {
  email: string;
  verificationToken: string;
}

export class EmailVerificationService extends EmailService {
  private fromName = 'Distance Connect Team';

  /**
   * Sends an email verification message
   * @param data - Email verification data
   * @returns Promise with email send result
   */
  async sendVerificationEmail(data: EmailVerificationData): Promise<any> {
    const { email, verificationToken } = data;
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`;

    const htmlContent = this.generateVerificationEmailHtml(data);

    const mailOptions: SendMailOptions = {
      from: this.fromEmail,
      to: email,
      subject: 'Verify Your Email Address',
      html: htmlContent,
      text: `Hi ${email},\n\nPlease verify your email address by clicking the following link:\n${verificationUrl}\n\nYour verification code is: ${verificationToken}`,
    };

    return this.sendEmail(mailOptions);
  }

  /**
   * Generates HTML content for the email verification
   * @param data - Email verification data
   * @returns HTML string
   */
  private generateVerificationEmailHtml(data: EmailVerificationData): string {
    const { email, verificationToken } = data;
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f3f6fa;
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

        .verify-button {
          display: inline-block;
          background-color: white;
          color: black;
          border: 2px solid black;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
        }

        .code-box {
          background-color: #f1f5ff;
          border-left: 4px solid #2e5aac;
          padding: 12px;
          font-family: monospace;
          font-size: 16px;
          margin-top: 10px;
          display: inline-block;
        }

        .footer {
          font-size: 12px;
          color: #999;
          text-align: center;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://storage.googleapis.com/dc-public-files/profile-images/logo.jpeg" alt="Distance Connect Logo" style="display: block; margin: 0 auto 20px; width: 150px; height: auto;" />
        <h2>Email Verification</h2>
        <p>Hi ${email},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="verify-button">Verify Email</a>
        </p>
        <p>If the button above doesn't work, you can also use the following url:</p>
        <p class="code-box">${verificationUrl}</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">
        &copy; 2024 Distance Connect. All rights reserved.
      </div>
    </body>
    </html>
    `;
  }
}

export const sendVerificationEmail = async (email :string, verificationToken: string) => {

    try{
        const verifyEmailService = new EmailVerificationService();
    
      // Verify email service connection
      const isConnected = await verifyEmailService.verifyConnection();
      if (!isConnected) {
        console.error("Email service connection failed");
        return { error: "Email service connection failed" };
      }
      const result = await verifyEmailService.sendVerificationEmail({
        email,
        verificationToken,
      });

      return result;
    }catch(error){
        console.error("Error sending verification email:", error);
        return { error: "Error sending verification email" };
    }
}
