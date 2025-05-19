import { EmailService } from './email-service';
import { SendMailOptions } from 'nodemailer';

// Interface for support request data
export interface SupportRequest {
  name: string;
  email: string;
  username?: string;
  message: string;
  phone?: string; 
}

export class SupportEmailService extends EmailService {
  private supportEmailAddress: string;

  constructor() {
    super();
    // Get the support email address from environment variable or use default
    this.supportEmailAddress = process.env.SUPPORT_EMAIL || 'talha@distanceconnect.in';
  }

  /**
   * Sends a support request email
   * @param requestData - Support request data
   * @returns Promise with email send result
   */
  async sendSupportEmail(requestData: SupportRequest): Promise<any> {
    const { name, email, username, message, phone } = requestData;

    // Create HTML content for email
    const htmlContent = this.generateSupportEmailHtml(requestData);
    
    // Email options
    const mailOptions: SendMailOptions = {
      from: this.fromEmail,
      to: this.supportEmailAddress,
      cc: [email], // CC the user so they have a copy of their request
      subject: 'New Support Request',
      html: htmlContent,
      // Additional text version for email clients that don't support HTML
      text: `Support Request from ${name} (${email})
Username: ${username || 'Not provided'}
Message: ${message}`,
    };

    // Send the email
    return this.sendEmail(mailOptions);
  }

  /**
   * Generates HTML content for support request email
   * @param data - Support request data
   * @returns HTML string
   */
  private generateSupportEmailHtml(data: SupportRequest): string {
    const { name, email, username, message, phone } = data;
    
    return `
     <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>New Support Request</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f3f6fa;
        margin: 0;
        padding: 20px;
        color: #333;
      }

      .container {
        max-width: 650px;
        background-color: #ffffff;
        margin: 40px auto;
        padding: 30px 40px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
        border: 1px solid #e0e0e0;
      }

      h1 {
        text-align: center;
        font-size: 26px;
        margin-bottom: 30px;
        color: #2e5aac;
      }

      .field {
        margin-bottom: 16px;
        font-size: 15px;
        line-height: 1.5;
      }

      .label {
        font-weight: 600;
        display: inline-block;
        margin-bottom: 4px;
        color: #555;
      }

      .message-box {
        background: linear-gradient(to right, #f5f8ff, #e9f0ff);
        padding: 18px;
        border-left: 4px solid #2e5aac;
        border-radius: 8px;
        color: #333;
        font-size: 15px;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .optional {
        margin-top: 10px;
        font-size: 14px;
        color: #444;
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
      <h1>New Support Request</h1>

      <div class="field">
        <div class="label">Name:</div>
        ${name}
      </div>

      ${username || phone ? `
        <div class="field optional">
          ${username ? `<div><span class="label">Username:</span> ${username}</div>` : ''}
          ${phone ? `<div><span class="label">Phone:</span> ${phone}</div>` : ''}
        </div>
      ` : ''}

      <div class="field">
        <div class="label">Email:</div>
        ${email}
      </div>

      <div class="field">
        <div class="label">Message:</div>
        <div class="message-box">
          ${message.replace(/\n/g, '<br />')}
        </div>
      </div>
    </div>

    <div class="footer">
      &copy; 2024 Distance Connect. All rights reserved.
    </div>
  </body>
</html>

    `;
  }
} 