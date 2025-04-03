// lib/rateLimit.ts

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { env } from "@/env";
// Common rate limit configurations
type RateLimitTier = {
  name: string;
  shortWindow: { max: number; window: number }; // Short bursts (e.g., 10 per 10s)
  mediumWindow: { max: number; window: number }; // Medium usage (e.g., 50 per minute)
  longWindow: { max: number; window: number }; // Sustained usage (e.g., 1000 per hour)
};

// Define rate limit tiers
const rateLimitTiers: Record<string, RateLimitTier> = {
  default: {
    name: "Default",
    shortWindow: { max: 10, window: 10000 },  // 10 requests per 10 seconds
    mediumWindow: { max: 100, window: 60000 }, // 100 requests per minute
    longWindow: { max: 1000, window: 3600000 } // 1000 requests per hour
  },
  premium: {
    name: "Premium",
    shortWindow: { max: 50, window: 10000 },   // 50 requests per 10 seconds
    mediumWindow: { max: 500, window: 60000 }, // 500 requests per minute
    longWindow: { max: 5000, window: 3600000 } // 5000 requests per hour
  },
  admin: {
    name: "Admin",
    shortWindow: { max: 100, window: 10000 },   // 100 requests per 10 seconds
    mediumWindow: { max: 1000, window: 60000 }, // 1000 requests per minute
    longWindow: { max: 10000, window: 3600000 } // 10000 requests per hour
  },
  anonymous: {
    name: "Anonymous",
    shortWindow: { max: 5, window: 10000 },  // 5 requests per 10 seconds
    mediumWindow: { max: 30, window: 60000 }, // 30 requests per minute
    longWindow: { max: 300, window: 3600000 } // 300 requests per hour
  }
};

// 1. Pure In-Memory Limiter (No Redis)
class LocalRateLimiter {
  private caches = new Map<string, Map<string, number>>();
  
  async limit(identifier: string, windowMs: number, max: number) {
    const cacheKey = `${windowMs}_${max}`;
    
    if (!this.caches.has(cacheKey)) {
      this.caches.set(cacheKey, new Map());
    }
    
    const cache = this.caches.get(cacheKey)!;
    const key = `local_${identifier}`;
    const current = cache.get(key) || 0;

    if (current >= max) return { success: false, pending: windowMs };

    cache.set(key, current + 1);
    setTimeout(() => {
      const updated = (cache.get(key) || 0) - 1;
      updated > 0 ? cache.set(key, updated) : cache.delete(key);
    }, windowMs);

    return { success: true, pending: max - current - 1 };
  }
  
  async limitTier(identifier: string, tier = 'default', windowType: 'shortWindow' | 'mediumWindow' | 'longWindow' = 'shortWindow') {
    const tierConfig = (rateLimitTiers[tier] ?? rateLimitTiers.default) as RateLimitTier;
    const config = tierConfig[windowType];
    return this.limit(`${tier}_${windowType}_${identifier}`, config.window, config.max);
  }
}

// 2. Redis-Based Global Limiter
class GlobalRateLimiter {
  private redisClient: Redis;
  private limiters: Record<string, Ratelimit> = {};
  
  constructor() {
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error("Missing Redis credentials. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.");
    }

    this.redisClient = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  
  private getLimiter(windowMs: number, max: number): Ratelimit {
    const key = `${windowMs}_${max}`;
    if (!this.limiters[key]) {
      this.limiters[key] = new Ratelimit({
        redis: this.redisClient,
        limiter: Ratelimit.slidingWindow(max, `${windowMs / 1000} s`),
      });
    }
    return this.limiters[key];
  }
  
  async limit(identifier: string, windowMs = 10000, max = 10) {
    const limiter = this.getLimiter(windowMs, max);
    return limiter.limit(identifier);
  }
  
  async limitTier(identifier: string, tier = 'default', windowType: 'shortWindow' | 'mediumWindow' | 'longWindow' = 'shortWindow') {
    const tierConfig = (rateLimitTiers[tier] ?? rateLimitTiers.default) as RateLimitTier;
    const config = tierConfig[windowType];
    const key = `${tier}_${windowType}`;
    
    const limiter = this.getLimiter(config.window, config.max);
    return limiter.limit(`${key}_${identifier}`);
  }
}

let globalLimiter: GlobalRateLimiter;

try {
  globalLimiter = new GlobalRateLimiter();
} catch (err) {
  console.error("Failed to create global rate limiter", err);
  throw err;
}

export const limiters = {
  local: new LocalRateLimiter(),
  global: globalLimiter,
  tiers: rateLimitTiers
};