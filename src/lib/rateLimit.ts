// lib/rateLimit.ts
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// 1. Pure In-Memory Limiter (No Redis)
class LocalRateLimiter {
  private cache = new Map<string, number>();
  
  async limit(identifier: string, windowMs: number, max: number) {
    const key = `local_${identifier}`;
    const current = this.cache.get(key) || 0;

    if (current >= max) return { success: false, pending: 0 };

    this.cache.set(key, current + 1);
    setTimeout(() => {
      const updated = (this.cache.get(key) || 0) - 1;
      updated > 0 ? this.cache.set(key, updated) : this.cache.delete(key);
    }, windowMs);

    return { success: true, pending: max - current - 1 };
  }
}

// 2. Redis-Based Global Limiter
let globalLimiter: Ratelimit;

try {


    const redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    globalLimiter = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
    });
} catch (err) {
    console.error("Failed to create global rate limiter", err);
    (() => { throw err; })();
}


export const limiters = {
  local: new LocalRateLimiter(),
  global: globalLimiter
};