import { EmailService } from '../services/email-service';
import { type SendMailOptions } from 'nodemailer';

export interface ChangePasswordVerificationData {
  email: string;
  verificationToken: string;
}

export class ChangePasswordVerificationEmail extends EmailService {
  private fromName = 'Distance Connect Team';

  async sendChangePasswordVerificationEmail(data: ChangePasswordVerificationData): Promise<any> {
    const { email, verificationToken } = data;
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${verificationToken}`;

    const htmlContent = this.generateHtml(email, verificationToken, resetUrl);

    const mailOptions: SendMailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent,
      text: `Hi ${email},

You requested a password reset. Click the link below to reset your password:

${resetUrl}

If you did not request this, please ignore this email.`,
    };

    return this.sendEmail(mailOptions);
  }

  private generateHtml(email: string, token: string, resetUrl: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f3f6fa;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          background-color: #fff;
          margin: 40px auto;
          padding: 30px 40px;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
        }
        h2 {
          text-align: center;
          color: #2e5aac;
        }
        p {
          font-size: 15px;
          line-height: 1.6;
        }
        .reset-button {
          background-color: white;
          border: 2px solid #2e5aac;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          display: inline-block;
          font-weight: bold;
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
        <h2>Password Reset</h2>
        <p>Hi ${email},</p>
        <p>You requested to reset/change your password. Click the button below:</p>
        <p style="text-align:center;">
          <a href="${resetUrl}" class="reset-button">Reset Password</a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 10 minutes.</p>
      </div>
      <div class="footer">
        &copy; 2025 Distance Connect. All rights reserved.
      </div>
    </body>
    </html>
    `;
  }
}

export const sendChangePasswordVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  try {
    const emailService = new ChangePasswordVerificationEmail();
    const isConnected = await emailService.verifyConnection();
    if (!isConnected) {
      return { error: 'Email service connection failed' };
    }

    return await emailService.sendChangePasswordVerificationEmail({
      email,
      verificationToken,
    });
  } catch (err) {
    console.error('Error sending reset password email:', err);
    return { error: 'Failed to send reset password email' };
  }
};
