'use server';

import { storeOtp } from '@/lib/otpStore';
import { gemini } from '@/lib/services/gemini';
import { OtpEmailService, OtpRequest} from '@/lib/services/otp-email-service';


export async function verifyCompanyEmail(company: string, email: string) {

    
    
    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
    if (!company) {
        throw new Error('Company name is required');
    }
    if (!email) {
        throw new Error('Email is required');
    }
    
    const otpEmailService  = new OtpEmailService();
    
    // Email is already validated above, but we need to handle potential undefined values
    const parts = email.split('@');
    if (parts.length < 2) {
        throw new Error('Invalid email format');
    }
    
    const domainParts = parts[1]!.split('.');
    if (domainParts.length < 1) {
        throw new Error('Invalid email format');
    }
    
    const domain = domainParts[0]?.toLowerCase() || '';
    
    if (!domain) {
        throw new Error('Invalid email format');
    }

    // console.log(domain);
    // console.log(company);
    
    
    
    const genAI = gemini;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // const prompt = `Is "${email}" a valid email for the company "${company}"? Reply with only "yes" or "no".`;
    const prompt = `
I am verifying a mentor's company email during registration.

Given the following:
- Company Name: "${company}"
- Email: "${email}"

Can this email plausibly belong to someone working at the company "${company}"?
Reply strictly with only one word: "yes" or "no". Do not include any explanation or extra text.
`;

    // console.log(`Prompt: ${prompt}`);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResult = response?.text()?.split('\n')[0]?.trim().toLowerCase() || '';
    console.log(`Response from Gemini: ${textResult}`);

    if (textResult !== 'yes') {
        throw new Error('Company email domain does not match the company name');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    storeOtp(email, otp);
    const otpRequest : OtpRequest = {
        toEmail: email,
        otp: otp
        };

    await otpEmailService.sendOtpEmail(otpRequest);
    return { status: 'otp_sent' };
}
