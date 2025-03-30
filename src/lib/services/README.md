# Email Services

This directory contains services for sending emails using Nodemailer.

## Structure

- `email-service.ts` - Base Email Service class for nodemailer configuration
- `support-email-service.ts` - Support email service for handling support requests

## Setup

To use the email services:

1. Configure your email settings in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=support@distanceconnect.com
SUPPORT_EMAIL=support@distanceconnect.com
```

### Notes for Gmail

If using Gmail as your email provider:

1. Enable 2-Factor Authentication for your Gmail account
2. Generate an App Password: Google Account > Security > App Passwords
3. Use that App Password as the `EMAIL_PASSWORD` in your .env file

## Usage Example

```typescript
import { SupportEmailService } from "@/lib/services/support-email-service";

// Create support email service instance
const supportEmailService = new SupportEmailService();

// Send a support email
const result = await supportEmailService.sendSupportEmail({
  name: "User Name",
  email: "user@example.com",
  username: "username123", // Optional
  message: "This is a support request message",
});
```

## Extending Email Services

To create a new email service type:

1. Create a new file `your-service.ts`
2. Extend the base `EmailService` class
3. Add specific methods for your email type

Example:

```typescript
import { EmailService } from "./email-service";
import { SendMailOptions } from "nodemailer";

export class YourEmailService extends EmailService {
  constructor() {
    super();
  }

  async sendYourEmail(data: YourDataType): Promise<any> {
    // Create email options
    const mailOptions: SendMailOptions = {
      from: this.fromEmail,
      to: "recipient@example.com",
      subject: "Your Email Subject",
      html: this.generateEmailHtml(data),
      text: this.generateEmailText(data),
    };

    // Send the email
    return this.sendEmail(mailOptions);
  }

  private generateEmailHtml(data: YourDataType): string {
    // Generate HTML content
    return `<html>...</html>`;
  }

  private generateEmailText(data: YourDataType): string {
    // Generate plain text content
    return "Plain text version";
  }
}
```
