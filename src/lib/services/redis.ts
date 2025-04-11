import { env } from "@/env";
import { Redis } from "@upstash/redis";

export const redis =new Redis({
    url: env.UPSTASH_REDIS_REST_URL || 'https://intense-oarfish-11594.upstash.io',
    token: env.UPSTASH_REDIS_REST_TOKEN || 'AS1KAAIjcDExMmY0ZDRlNjUyZTI0MjgwYjZkYThiOTkzZDk2OTcwZHAxMA',
  });