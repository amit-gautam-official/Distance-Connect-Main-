import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { scheduledMeetingsRouter } from "./scheduledMeeting";
import Razorpay from "razorpay";

// Helper function to initialize Razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay Key ID or Key Secret is not defined in environment variables.");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

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
      

      const razorpay = getRazorpayInstance();

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

  createWorkshopPaymentOrder: protectedProcedure
    .input(z.object({
      workshopId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.dbUser || !ctx.dbUser.id) {
        throw new Error("User not authenticated.");
      }

      // 1. Fetch workshop details and enrollment status
      const workshop = await ctx.db.workshop.findUnique({
        where: { id: input.workshopId },
        select: { price: true, name: true },
      });

      if (!workshop) {
        throw new Error("Workshop not found.");
      }
      if (workshop.price === null || workshop.price <= 0) {
        throw new Error("Workshop is free or price not set.");
      }

      const enrollment = await ctx.db.workshopEnrollment.findUnique({
        where: {
          workshopId_studentUserId: {
            workshopId: input.workshopId,
            studentUserId: ctx.dbUser.id,
          },
        },
        select: { id: true, paymentStatus: true },
      });

      if (!enrollment) {
        throw new Error("User is not enrolled in this workshop.");
      }
      if (enrollment.paymentStatus) {
        throw new Error("Payment already completed for this workshop enrollment.");
      }

      const amount = workshop.price; // Price is already in paise
      const razorpay = getRazorpayInstance();

      // 2. Create Razorpay order
      // Using enrollment.id as receipt for uniqueness and traceability
      const order = await razorpay.orders.create({
        amount: amount, // Amount in paise
        currency: "INR",
        receipt: enrollment.id, 
        notes: {
          userId: ctx.dbUser.id,
          workshopId: input.workshopId,
          workshopName: workshop.name,
          enrollmentId: enrollment.id,
        },
      });

      if (!order) {
        throw new Error("Failed to create Razorpay order.");
      }

      // 3. Create RazorpayOrder record in DB
      const razorpayDbOrder = await ctx.db.razorpayOrder.create({
        data: {
          workshopEnrollmentId: enrollment.id, // Link to the specific enrollment
          razorpayOrderId: order.id,
          amount: typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount,
          studentUserId: ctx.dbUser.id, // Redundant if linked via enrollment, but can be useful
          status: 'pending', // Initial status
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID, // Send key to frontend
        workshopName: workshop.name,
        notes: order.notes,
      };
    }),
});
