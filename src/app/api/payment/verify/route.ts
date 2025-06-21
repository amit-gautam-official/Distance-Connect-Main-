import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/server/db';
import { generateMeetLink } from '@/lib/services/generate-meet-link';
import { PaymentEmailService } from '@/lib/emails/payment-failure-email';
import { ReferralStatus } from '@prisma/client';


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
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      
            
      
            const order = await db.razorpayOrder.update({
              where: { razorpayOrderId: razorpay_order_id },
              data: {
                razorpayPaymentId: razorpay_payment_id,
                status: "completed",
              },
            });
      
            // Handle referral payment
            if (order && order.referralRequestId) {
              const referralRequest = await db.razorpayOrder.findUnique({
                where: { id: order.id },
                include: {
                  referralRequest: true,
                },
              });
              
              if (referralRequest?.referralRequest) {
                // Check if this is initiation fee or final fee
                const isInitiationFee = referralRequest.amount === referralRequest.referralRequest.initiationFeeAmount;
                
                await db.referralRequest.update({
                  where: { id: referralRequest.referralRequestId! },
                  data: {
                    initiationFeePaid: isInitiationFee ? true : referralRequest.referralRequest.initiationFeePaid,
                    finalFeePaid: !isInitiationFee ? true : referralRequest.referralRequest.finalFeePaid,
                    status: isInitiationFee ? ReferralStatus.RESUME_REVIEW : ReferralStatus.COMPLETED,
                  }
                });
                
                // Create a chat room between student and mentor if this is the final payment
                if (!isInitiationFee) {
                  const existingChatRoom = await db.chatRoom.findFirst({
                    where: {
                      mentorUserId: referralRequest.referralRequest.mentorUserId,
                      studentUserId: referralRequest.referralRequest.studentUserId,
                    }
                  });
                  
                  if (!existingChatRoom) {
                    await db.chatRoom.create({
                      data: {
                        mentorUserId: referralRequest.referralRequest.mentorUserId,
                        studentUserId: referralRequest.referralRequest.studentUserId,
                        lastMessage: "Chat started for referral process.",
                        mentorUnreadCount: 1,
                        studentUnreadCount: 0,
                      }
                    });
                  }
                }
              }
            }
      
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
                  return NextResponse.json({ message: "Payment already processed", verified: true });
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
                      paymentStatus: true,
                      isFreeSession: false, // Mark as paid session

                  },
                });
              }
      return NextResponse.json({ verified: true });
    } else {
       
              
            // 1. Update your DB
            await db.razorpayOrder.updateMany({
                where: {
                razorpayOrderId: razorpay_order_id
                },
                data: {
                status: "failed",
                },
            });
            
            // 2. Optionally update related meeting record
            const relatedOrder = await db.razorpayOrder.findFirst({
                where: { razorpayOrderId: razorpay_order_id }
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
                reason: "Payment failed due to unknown reasons.",
            }
            );
        }
              
      return NextResponse.json({ verified: false, error: 'Invalid signature' }, { status: 400 });
    }

  }} catch (err) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
