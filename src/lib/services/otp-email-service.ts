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
                <meta charset="utf-8">
                <title>Your OTP Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    .container {
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        border-radius: 5px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    h1 {
                        font-size: 24px;
                        color: #333;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .field {
                        margin-bottom: 10px;
                    }
                    .label {
                        font-weight: bold;
                    }
                    .message-box {
                        background-color: #f5f5f5;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 10px 0;
                        white-space: pre-wrap;
                    }
                    .footer {
                        font-size: 12px;
                        color: rgba(0, 0, 0, 0.7);
                        text-align: center;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Your OTP Code</h1>
                    
                    <div class="field">
                        <span class="label">Email:</span> ${toEmail}
                    </div>
                    
                    <div class="field">
                        <span class="label">OTP Code:</span>
                    </div>
                    
                    <div class="message-box">
                        ${otp}
                    </div>
                </div>
                
                <div class="footer">
                    &copy; 2024 | Distance Connect
                </div>
            </body>
        </html>
        `;


 
} 
}