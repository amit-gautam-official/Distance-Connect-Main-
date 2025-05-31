'use server';

import { verifyOtp } from '@/lib/otpStore';

export async function validateOtp(email: string, otp: string) {
    // console.log('Validating OTP:', { email, otp });
  const valid = await verifyOtp(email, otp);
    // console.log('OTP validation result:', valid);
  if (!valid) {
    throw new Error('Invalid or expired OTP');
  }
  return { verified: true };
}
