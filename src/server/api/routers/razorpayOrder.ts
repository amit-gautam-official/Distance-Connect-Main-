import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { scheduledMeetingsRouter } from "./scheduledMeeting";
import Razorpay from "razorpay";



export const razorpayOrderRouter = createTRPCRouter({

  createRazorpayOrder: protectedProcedure
    .input(z.object({ 
      scheduledMeetingId: z.string(),
      eventId: z.string(),

    }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.meetingEvent.findUnique({
        where: {
          id: input.eventId,
        },
        select: {
          eventPrice: true,
          eventName: true,
        },
      });

      if(!input.scheduledMeetingId){
        throw new Error("Scheduled meeting ID is required.");
      }

      if (!event || event.eventPrice === null) {
        throw new Error("Event not found or has no price set.");
      }

      const amount = Number(event.eventPrice);
      if (isNaN(amount)) {
        throw new Error("Invalid event price format.");
      }

      const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const order = await razorpay.orders.create({
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: input.scheduledMeetingId,
        notes: {
          userId: String(ctx.dbUser!.id),
          scheduledMeetingId: String(input.scheduledMeetingId),
          eventName: String(event.eventName),
        },
      });

      if (!order) {
        throw new Error("Failed to create Razorpay order.");
      }

      const razorpayDbOrder = await ctx.db.razorpayOrder.create({
        data: {
          scheduledMeetingId: input.scheduledMeetingId,
          razorpayOrderId: order.id,
          amount: typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount,
          studentUserId: ctx.dbUser!.id,
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        razorpayDbOrderId: razorpayDbOrder.id,
        notes: order.notes,
        status: order.status,
        receipt: order.receipt,
      };
    }),
});
