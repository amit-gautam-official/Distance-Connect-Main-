import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import { generateMeetLink } from "@/lib/services/generate-meet-link";
import { PaymentEmailService } from "@/lib/emails/payment-failure-email";

// It's good practice to ensure environment variables are checked at startup or early in the process.
if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
  console.error("FATAL ERROR: RAZORPAY_WEBHOOK_SECRET is not defined.");
  // Depending on your error handling strategy, you might want to throw an error here
  // or ensure the application doesn't start/webhook doesn't process without it.
}

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
    const paymentEntity = event.payload.payment?.entity;
    const orderId = paymentEntity?.order_id;

    if (!orderId) {
      console.error("Webhook error: order_id missing in payment entity", event.payload);
      return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
    }

    // Fetch the order from DB to determine if it's for a workshop or scheduled meeting
    const dbOrder = await db.razorpayOrder.findUnique({
      where: { razorpayOrderId: orderId },
      include: {
        scheduledMeeting: true, 
        workshopEnrollment: {      
          include: {
            student: { 
              include: { 
                user: { select: { email: true, name: true } } // Corrected path to user details
              }
            },
            workshop: { select: { name: true } },
          }
        },
      },
    });

    if (!dbOrder) {
      console.error(`Webhook error: RazorpayOrder not found for order_id: ${orderId}`);
      return NextResponse.json({ error: "Order not found in DB" }, { status: 404 });
    }

    if (event.event === "payment.captured") {
      const payment = paymentEntity;

      await db.razorpayOrder.update({
        where: { razorpayOrderId: payment.order_id }, // Corrected: use payment.order_id
        data: {
          razorpayPaymentId: payment.id,
          status: "completed",
        },
      });

      if (dbOrder.workshopEnrollmentId && dbOrder.workshopEnrollment) {
        // This is a workshop payment
        await db.workshopEnrollment.update({
          where: { id: dbOrder.workshopEnrollmentId },
          data: { paymentStatus: true },
        });
        console.log(`Payment captured for workshop enrollment: ${dbOrder.workshopEnrollmentId}`);
        // TODO: Optionally send a payment success email to the student for the workshop
        // if (dbOrder.workshopEnrollment.student?.user?.email && dbOrder.workshopEnrollment.workshop?.name) {
        //   const emailService = new PaymentEmailService(); // Assuming you might create a generic one or adapt existing
        //   await emailService.sendWorkshopPaymentSuccessEmail(
        //     dbOrder.workshopEnrollment.student.user.email,
        //     {
        //       studentName: dbOrder.workshopEnrollment.student.user.name || 'Student',
        //       workshopName: dbOrder.workshopEnrollment.workshop.name,
        //     }
        //   );
        // }

      } else if (dbOrder.scheduledMeetingId && dbOrder.scheduledMeeting) {
        // This is a scheduled meeting payment (existing logic)
        const scheduledMeeting = dbOrder.scheduledMeeting; // Now this is safe due to the check above
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
          attendees: [{ email: scheduledMeeting.userEmailForMeet }, { email: scheduledMeeting.mentorEmailForMeet }],
        });

        await db.scheduledMeetings.update({
          where: { id: scheduledMeeting.id },
          data: {
            meetUrl: meet.meetLink,
            paymentStatus: true,
            isFreeSession: false, // Mark as paid session
          },
        });
      }
    }
    if (event.event === "payment.failed") {
      const payment = paymentEntity; // Use the already defined paymentEntity

      await db.razorpayOrder.updateMany({
        where: {
          razorpayOrderId: payment.order_id, // Corrected
        },
        data: {
          status: "failed",
        },
      });

      if (dbOrder.workshopEnrollmentId && dbOrder.workshopEnrollment && dbOrder.workshopEnrollment.student?.user) {
        // Workshop payment failed
        await db.workshopEnrollment.update({
          where: { id: dbOrder.workshopEnrollmentId },
          data: { paymentStatus: false },
        });
        console.log(`Payment failed for workshop enrollment: ${dbOrder.workshopEnrollmentId}`);
        
        // Optionally send payment failure email for workshop
        if (dbOrder.workshopEnrollment.student.user.email && dbOrder.workshopEnrollment.workshop?.name) {
          const paymentEmailService = new PaymentEmailService();
          // Assuming you'd create a method like sendWorkshopPaymentFailureEmail
          // or adapt sendPaymentFailureEmail if its signature is flexible enough.
          // For now, let's log, as sendPaymentFailureEmail expects meeting-specific details.
          console.log(`TODO: Send workshop payment failure email to ${dbOrder.workshopEnrollment.student.user.email} for workshop ${dbOrder.workshopEnrollment.workshop.name}`);
          // await paymentEmailService.sendWorkshopPaymentFailureEmail(
          //   dbOrder.workshopEnrollment.student.user.email,
          //   {
          //     workshopName: dbOrder.workshopEnrollment.workshop.name,
          //     studentName: dbOrder.workshopEnrollment.student.user.name || 'Student',
          //     reason: payment.error_description,
          //   }
          // );
        }

      } else if (dbOrder.scheduledMeetingId && dbOrder.scheduledMeeting) {
        // Scheduled meeting payment failed (existing logic)
        const scheduledMeeting = dbOrder.scheduledMeeting; // Safe due to check
        await db.scheduledMeetings.update({ 
          where: { id: scheduledMeeting.id }, // Use scheduledMeeting.id
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
      const paymentIdForRefund = refund.payment_id;

      // Find the order using payment_id as refund entity doesn't directly give order_id
      const orderForRefund = await db.razorpayOrder.findFirst({
        where: { razorpayPaymentId: paymentIdForRefund },
        include: {
          scheduledMeeting: true,
          workshopEnrollment: { 
            include: {
              student: { 
                include: { 
                  user: { select: { email: true, name: true } } // Corrected path
                }
              },
              workshop: { select: { name: true } },
            }
          },
        },
      });

      if (!orderForRefund) {
        console.error(`Webhook error: Order not found for refund payment_id: ${paymentIdForRefund}`);
        return NextResponse.json({ error: "Order for refund not found" }, { status: 404 });
      }
      
      await db.razorpayOrder.update({
        where: { id: orderForRefund.id },
        data: {
          status: 'refunded',
        },
      });

      if (orderForRefund.workshopEnrollmentId && orderForRefund.workshopEnrollment) {
        // Workshop refund
        await db.workshopEnrollment.update({
          where: { id: orderForRefund.workshopEnrollmentId },
          data: { paymentStatus: false }, // Mark as not paid
        });
        console.log(`Refund processed for workshop enrollment: ${orderForRefund.workshopEnrollmentId}`);
        // TODO: Optionally send refund email for workshop
        // if (orderForRefund.workshopEnrollment.student?.user?.email && orderForRefund.workshopEnrollment.workshop?.name) {
        //   // ... send email ...
        // }

      } else if (orderForRefund.scheduledMeetingId && orderForRefund.scheduledMeeting) {
        // Scheduled meeting refund (existing logic)
        const scheduledMeetingForRefund = orderForRefund.scheduledMeeting; // Safe due to check
        await db.scheduledMeetings.update({
          where: { id: scheduledMeetingForRefund.id }, // Use scheduledMeetingForRefund.id
          data: {
            meetUrl: null,
            paymentStatus: false,
          },
        });

        // Send refund email
        const emailService = new PaymentEmailService();
        await emailService.sendPaymentFailureEmail(scheduledMeetingForRefund.userEmailForMeet, { // Use scheduledMeetingForRefund
          date: scheduledMeetingForRefund.selectedDate.toDateString(),
          time: scheduledMeetingForRefund.selectedTime,
          mentorEmail: scheduledMeetingForRefund.mentorEmailForMeet,
          reason: 'Refund issued by Razorpay',
        });
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}