import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    APP_BASE_URL: z.string().url(),
    GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string(),
    GOOGLE_PRIVATE_KEY: z.string(),
    ABLY_API_KEY: z.string(),
    GCP_PROJECT_ID: z.string(),
    GCP_CHAT_IMAGE_BUCKET_NAME: z.string(),
    GCP_CLIENT_EMAIL: z.string(),
    GCP_PRIVATE_KEY: z.string(),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    SKIP_ENV_VALIDATION: z.number().optional(),
    CF_DELIVERY_ACCESS_TOKEN: z.string().optional(),
    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.number(),
    EMAIL_USER: z.string(),
    EMAIL_PASSWORD: z.string(),
    EMAIL_FROM: z.string(),
    SUPPORT_EMAIL: z.string(),
    CF_SPACE_ID: z.string(),
    AUTH_GOOGLE_CLIENT_ID : z.string(),
    AUTH_GOOGLE_CLIENT_SECRET : z.string(),
    AUTH_SECRET : z.string(),
    AUTH_URL : z.string(),

  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_GEMINI_API_KEY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    APP_BASE_URL: process.env.APP_BASE_URL,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    ABLY_API_KEY: process.env.ABLY_API_KEY,
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCP_CLIENT_EMAIL: process.env.GCP_CLIENT_EMAIL,
    GCP_CHAT_IMAGE_BUCKET_NAME: process.env.GCP_CHAT_IMAGE_BUCKET_NAME,
    GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
    CF_DELIVERY_ACCESS_TOKEN: process.env.CF_DELIVERY_ACCESS_TOKEN,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    CF_SPACE_ID: process.env.CF_SPACE_ID,
    AUTH_GOOGLE_CLIENT_ID : process.env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET : process.env.AUTH_GOOGLE_CLIENT_SECRET,
    AUTH_SECRET : process.env.AUTH_SECRET,
    AUTH_URL : process.env.AUTH_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
