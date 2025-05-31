import {  userRouter } from "@/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { studentRouter } from "./routers/student";
import { mentorRouter } from "./routers/mentor";
import { startupRouter } from "./routers/startup";
import { meetingEventRouter } from "./routers/meetingEvent";
import { availabilityRouter } from "./routers/availability";
import { scheduledMeetingsRouter } from "./routers/scheduledMeeting";
import { meetRouter } from "./routers/meet";
import { chatRouter } from "./routers/chat";
import { chatRoomRouter } from "./routers/chatRoom";
import { fileRouter } from "./routers/file";
import { adminRouter } from "./routers/admin";
import { razorpayOrderRouter } from "./routers/razorpayOrder";
import { workshopRouter } from "./routers/workshop";

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
  meet : meetRouter,
  chat : chatRouter,
  chatRoom : chatRoomRouter,
  file: fileRouter,
  admin : adminRouter,
  razorpayOrder: razorpayOrderRouter,
  workshop: workshopRouter
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
