import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import { generateMeetLink } from "@/lib/services/generate-meet-link";
import { PaymentEmailService } from "@/lib/emails/payment-failure-email";


 function convertToDateTime(date: Date, time: string): Date {
    const year = date.getFullYear();
    const month = date.getMonth(); // Month is 0-based
    const day = date.getDate();

    // Extract time components from the "hh:mm AM/PM" format
    const [timePart, modifier] = time.split(" ");
    let [hours = 0, minutes = 0] = timePart?.split(":").map(Number) ?? [0, 0];

    // Convert 12-hour format to 24-hour format
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    // Create new Date object with the specified date and time
    return new Date(year, month, day, hours, minutes);
  }

export async function POST(req: NextRequest) {
  try {
    const body = await req.text(); // Raw body required for signature check
const signature = req.headers.get("x-razorpay-signature");

const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
  .update(body)
  .digest("hex");

console.log("Raw webhook body:", body);
console.log("Webhook Secret Used:", process.env.RAZORPAY_WEBHOOK_SECRET);
console.log("Calculated Signature:", expectedSignature);
console.log("Received Signature:", signature);

if (signature !== expectedSignature) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
}


    console.log("Webhook signature verified successfully");

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const order = await db.razorpayOrder.update({
        where: { razorpayOrderId: payment.order_id },
        data: {
          razorpayPaymentId: payment.id,
          status: "completed",
        },
      });


      if (order && order.scheduledMeetingId) {

        const scheduledMeeting = await db.scheduledMeetings.findUnique({
          where: { id: order.scheduledMeetingId },
            select: {
                id: true,
                selectedDate: true,
                selectedTime: true,
                duration: true,
                userEmailForMeet: true,
                eventId: true,
                mentorEmailForMeet: true,
                paymentStatus: true,
                meetUrl: true,
            },
        });
       

        if (scheduledMeeting) {

        if (scheduledMeeting.meetUrl || scheduledMeeting.paymentStatus) {
            return NextResponse.json({ message: "Payment already processed" });
            }

        if (!scheduledMeeting.selectedDate || !scheduledMeeting.selectedTime) {
            throw new Error("Missing meeting date/time");
            }

          const startDateTime = convertToDateTime(
            scheduledMeeting.selectedDate,
            scheduledMeeting.selectedTime
          );

          const meet = await generateMeetLink({
            dateTime: startDateTime.toISOString(),
            duration: scheduledMeeting.duration,
            attendees: [{ email: scheduledMeeting.userEmailForMeet }, {email : scheduledMeeting.mentorEmailForMeet }],
          });

          await db.scheduledMeetings.update({
            where: { id: scheduledMeeting.id },
            data: {
                meetUrl: meet.meetLink,
                paymentStatus: true
            },
          });
        }
       
    }
    if (event.event === "payment.failed") {
        const payment = event.payload.payment.entity;
      
        // 1. Update your DB
        await db.razorpayOrder.updateMany({
          where: {
            razorpayOrderId: payment.order_id
          },
          data: {
            status: "failed",
          },
        });
      
        // 2. Optionally update related meeting record
        const relatedOrder = await db.razorpayOrder.findFirst({
          where: { razorpayOrderId: payment.order_id }
        });
      
        if (relatedOrder?.scheduledMeetingId) {
          const scheduledMeeting = await db.scheduledMeetings.update({
            where: { id: relatedOrder.scheduledMeetingId },
            data: {
              paymentStatus: false,
              meetUrl: null // remove any pre-generated link if you had it
            }
          });
        


      
        // 3. Optional: Send user an email about the failure
        const paymentEmailService = new PaymentEmailService();

        await paymentEmailService.sendPaymentFailureEmail(
        scheduledMeeting.userEmailForMeet,
        {
            date: scheduledMeeting.selectedDate.toDateString(),
            time: scheduledMeeting.selectedTime,
            mentorEmail: scheduledMeeting.mentorEmailForMeet,
            reason: payment.error_description,
        }
        );
    }
      
        return NextResponse.json({ received: true });
    }
    if (event.event === 'refund.created') {
        const refund = event.payload.refund.entity;
  
        // Lookup payment and related order
        const order = await db.razorpayOrder.findFirst({
          where: { razorpayPaymentId: refund.payment_id },
          include: {
            scheduledMeeting: true,
          },
        });
  
        if (order && order.scheduledMeeting) {
          // Soft cancel the scheduled meeting
          await db.scheduledMeetings.update({
            where: { id: order.scheduledMeeting.id },
            data: {
              meetUrl: null,
              paymentStatus: false,
            },
          });
  
          // Optionally update order status
          await db.razorpayOrder.update({
            where: { id: order.id },
            data: {
              status: 'refunded',
              
            },
          });
  
          // Send refund email
          const emailService = new PaymentEmailService();
          await emailService.sendPaymentFailureEmail(order.scheduledMeeting.userEmailForMeet, {
            date: order.scheduledMeeting.selectedDate.toDateString(),
            time: order.scheduledMeeting.selectedTime,
            mentorEmail: order.scheduledMeeting.mentorEmailForMeet,
            reason: 'Refund issued by Razorpay',
          });
        }
  
        return NextResponse.json({ received: true });
      }
      

    return NextResponse.json({ received: true });
}
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}