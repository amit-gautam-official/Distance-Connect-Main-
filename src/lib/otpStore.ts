import { redis } from "./services/redis";

export async function storeOtp(email: string, otp: string) {
    const key = `otp:${email}`;
    await redis.set(key, otp, { ex: 300 }); // 300 seconds = 5 min
  }
  
  // Verify OTP and delete it after successful match
export async function verifyOtp(email: string, otp: string): Promise<boolean> {
    const key = `otp:${email}`;
    const storedOtp = await redis.get<string>(key);
    console.log('Verifying OTP:', { email, otp, storedOtp });
    if (storedOtp?.toString() === otp) {
      console.log('OTP verified successfully');
      await redis.del(key); // Delete OTP once verified
      return true;
    }
    return false;
  }
  