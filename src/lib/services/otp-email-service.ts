import { EmailService } from './email-service';
import { SendMailOptions } from 'nodemailer';

// Interface for support request data
export interface OtpRequest {
  toEmail : string;
  otp : string;
}

export class OtpEmailService extends EmailService {
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

    async sendOtpEmail(requestData: OtpRequest): Promise<any> {
        const { toEmail, otp } = requestData;
    
        // Create HTML content for email
        const htmlContent = this.generateOtpEmailHtml(requestData);
        
        // Email options
        const mailOptions: SendMailOptions = {
        from: this.fromEmail,
        to: toEmail,
        subject: 'Your OTP Code',
        html: htmlContent,
        // Additional text version for email clients that don't support HTML
        text: `Your OTP code is ${otp}`,
        };
    
        // Send the email
        return this.sendEmail(mailOptions);
    }

    generateOtpEmailHtml(data: OtpRequest): string {
        const { toEmail, otp } = data;

        return `
     <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        color: #333;
        margin: 0;
        padding: 20px;
      }

      .container {
        max-width: 600px;
        background-color: #ffffff;
        margin: 40px auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #e0e0e0;
      }

      h1 {
        text-align: center;
        color: #004aad;
        margin-bottom: 24px;
        font-size: 26px;
      }

      .info {
        margin-bottom: 16px;
        font-size: 16px;
      }

      .info .label {
        font-weight: 600;
        color: #555;
      }

      .otp-box {
        background-color: #f0f7ff;
        color: #004aad;
        font-size: 24px;
        text-align: center;
        padding: 18px;
        border-radius: 8px;
        font-weight: bold;
        letter-spacing: 2px;
        margin-top: 12px;
        border: 1px dashed #004aad;
      }

      .note {
        margin-top: 20px;
        font-size: 14px;
        color: #777;
        text-align: center;
      }

      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #aaa;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Verify Your Email</h1>

      <div class="info">
        <div><span class="label">Recipient:</span> ${toEmail}</div>
      </div>

      <div class="label">Your One-Time Password (OTP):</div>
      <div class="otp-box">${otp}</div>

      <div class="note">
        This OTP is valid for the next 10 minutes. Please do not share it with anyone.
      </div>
    </div>

    <div class="footer">
      &copy; 2024 Distance Connect. All rights reserved.<br />
      <strong>Email:</strong> support@distanceconnect.in<br />
      <strong>Phone:</strong> +91 8750307740<br />
      <strong>Address:</strong> IIF, Room No: 808, 8th Floor,<br />
      Academic Block 4, Delhi Technological University,<br />
      Bhavana Road, Delhi - 110042
    </div>
  </body>
</html>


        `;


 
} 
}