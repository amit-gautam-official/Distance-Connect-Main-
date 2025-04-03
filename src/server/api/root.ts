import {  userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { studentRouter } from "./routers/student";
import { mentorRouter } from "./routers/mentor";
import { startupRouter } from "./routers/startup";
import { meetingEventRouter } from "./routers/meetingEvent";
import { availabilityRouter } from "./routers/availability";
import { scheduledMeetingsRouter } from "./routers/scheduledMeeting";
import { emailRouter } from "./routers/email";
import { meetRouter } from "./routers/meet";
import { chatRouter } from "./routers/chat";
import { chatRoomRouter } from "./routers/chatRoom";
import { blogRouter } from "./routers/blog";
import { fileRouter } from "./routers/file";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  student : studentRouter,
  mentor: mentorRouter,
  startup : startupRouter,
  meetingEvent : meetingEventRouter,
  availability : availabilityRouter,
  scheduledMeetings : scheduledMeetingsRouter,
  email : emailRouter,
  meet : meetRouter,
  chat : chatRouter,
  chatRoom : chatRoomRouter,
  blog : blogRouter,
  file: fileRouter,
  
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
