import { EmailService } from '../services/email-service';
import { SendMailOptions } from 'nodemailer';

interface PaymentFailureDetails {
  date: string;
  time: string;
  mentorEmail?: string;
  reason?: string;
}

export class PaymentEmailService extends EmailService {
  constructor() {
    super();
  }

  /**
   * Sends a payment failure email to the user
   * @param userEmail - The email address of the user
   * @param meetingDetails - Meeting details like date, time, mentor, reason
   */
  async sendPaymentFailureEmail(userEmail: string, meetingDetails: PaymentFailureDetails): Promise<any> {
    const { date, time, mentorEmail, reason } = meetingDetails;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fc;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="color: #d32f2f;">Payment Failed</h2>
          <p>Dear user,</p>
          <p>We regret to inform you that your payment for the scheduled meeting on <strong>${date}</strong> at <strong>${time}</strong> could not be completed.</p>
          ${mentorEmail ? `<p>Mentor: <strong>${mentorEmail}</strong></p>` : ''}
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>You may try the payment again or contact our support for assistance.</p>
          <p style="margin-top: 30px;">Thanks,<br />Distance Connect Team</p>
        </div>
      </div>
    `;

    const mailOptions: SendMailOptions = {
      from: this.fromEmail,
      to: userEmail,
      subject: 'Your Payment Failed — Distance Connect',
      html: htmlContent,
      text: `Payment failed for your meeting on ${date} at ${time}. ${reason ? 'Reason: ' + reason : ''}`,
    };

    return this.sendEmail(mailOptions);
  }
}
