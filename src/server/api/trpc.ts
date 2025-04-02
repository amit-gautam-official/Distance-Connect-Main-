/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { auth0 } from "@/lib/auth0";
import { limiters } from "@/lib/rateLimit";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 * 
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  
  return {
    db,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */

const rateLimiter = t.middleware(async ({ ctx, next }) => {
  // Authenticated user
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
 
  const dbUser = await ctx.db.user.findUnique({
    where: { kindeId: user?.sub },
  });
 
  if (!user.sub) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid user ID',
    });
  }

  // Use premium tier for all users regardless of role
  const userTier = 'premium';
  
  // Apply short-term rate limit (quick burst protection)
  const shortTermLimit = await limiters.local.limitTier(`user:${user.sub}`, userTier, 'shortWindow');
  if (!shortTermLimit.success) {
    throw new TRPCError({ 
      code: "TOO_MANY_REQUESTS",
      message: `Rate limit exceeded. Try again in ${Math.ceil(shortTermLimit.pending/1000)}s`
    });
  }

  // Apply medium-term rate limit (sustained usage)
  const mediumTermLimit = await limiters.global.limitTier(`user:${user.sub}`, userTier, 'mediumWindow');
  if (!mediumTermLimit.success) {
    throw new TRPCError({ 
      code: "TOO_MANY_REQUESTS",
      message: `Sustained usage limit exceeded. Please slow down your requests.`
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user,
      dbUser,
    },
  });
});

const anonymousRatelimitMiddleware = t.middleware(async ({ ctx, next }) => {
  // Default to a generic identifier
  const identifier = 'anonymous-user';
  
  // Apply rate limiting using tiered system with premium tier
  try {
    // Short-term burst protection using premium tier
    const shortTermLimit = await limiters.local.limitTier(identifier, 'premium', 'shortWindow');
    if (!shortTermLimit.success) {
      throw new TRPCError({ 
        code: "TOO_MANY_REQUESTS",
        message: `Rate limit exceeded. Try again in ${Math.ceil(shortTermLimit.pending/1000)}s`
      });
    }
    
    // Medium-term usage protection using premium tier
    const mediumTermLimit = await limiters.global.limitTier(identifier, 'premium', 'mediumWindow');
    if (!mediumTermLimit.success) {
      throw new TRPCError({ 
        code: "TOO_MANY_REQUESTS",
        message: `Rate limit exceeded. Please slow down your requests.`
      });
    }
    
    return next({
      ctx: {
        ...ctx,
        anonymousId: identifier,
      },
    });
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    
    console.error("Rate limiting error:", error);
    throw new TRPCError({ 
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to apply rate limiting"
    });
  }
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const protectedProcedure = t.procedure.use(rateLimiter);
export const publicProcedure = t.procedure.use(anonymousRatelimitMiddleware);
