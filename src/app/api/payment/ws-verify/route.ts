import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/server/db';
import { PaymentEmailService } from '@/lib/emails/payment-failure-email'; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // workshopId from body is not strictly needed if razorpay_order_id is the sole key for lookup
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not set in ws-verify');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      const dbOrder = await db.razorpayOrder.findUnique({
        where: { razorpayOrderId: razorpay_order_id },
        include: { workshopEnrollment: { include: { student: { include: { user: true } }, workshop: true } } },
      });

      if (!dbOrder) {
        console.warn(`Order not found for razorpay_order_id: ${razorpay_order_id} in ws-verify`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Idempotency: If already processed by webhook or a previous call
      if (dbOrder.status === 'completed' && dbOrder.workshopEnrollment?.paymentStatus) {
        return NextResponse.json({ message: 'Payment already processed and verified', verified: true });
      }

      // Update order status
      await db.razorpayOrder.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          status: 'completed',
        },
      });

      // Update workshop enrollment status if linked and not already paid
      if (dbOrder.workshopEnrollmentId && dbOrder.workshopEnrollment) {
        if (!dbOrder.workshopEnrollment.paymentStatus) { // Check if not already true
            await db.workshopEnrollment.update({
                where: { id: dbOrder.workshopEnrollmentId },
                data: { paymentStatus: true },
            });
        } 
      } else {
        // This case should ideally not happen if orders are correctly linked
        console.warn(`RazorpayOrder ${razorpay_order_id} is missing workshopEnrollmentId or workshopEnrollment data in ws-verify`);
      }

      return NextResponse.json({ verified: true });

    } else {
      // Signature is invalid
      console.warn(`Invalid signature for order ${razorpay_order_id} in ws-verify`);
      const orderToFail = await db.razorpayOrder.findUnique({
        where: { razorpayOrderId: razorpay_order_id },
        include: { workshopEnrollment: { include: { student: { include: { user: true } }, workshop: true } } },
      });

      if (orderToFail) {
        // Update order to failed, store payment_id for records
        await db.razorpayOrder.update({
          where: { razorpayOrderId: razorpay_order_id },
          data: { status: 'failed', razorpayPaymentId: razorpay_payment_id },
        });

        // Update enrollment to failed if linked
        if (orderToFail.workshopEnrollmentId && orderToFail.workshopEnrollment) {
          if (orderToFail.workshopEnrollment.paymentStatus !== false) { // Check if not already false
            await db.workshopEnrollment.update({
              where: { id: orderToFail.workshopEnrollmentId },
              data: { paymentStatus: false }, 
            });
          }

          // Send failure email
          if (orderToFail.workshopEnrollment.student?.user?.email && orderToFail.workshopEnrollment.workshop?.name) {
            const paymentEmailService = new PaymentEmailService();
            // Consider adding a flag to prevent sending duplicate emails if webhook also sends one
            await paymentEmailService.sendWorkshopPaymentFailureEmail(
              orderToFail.workshopEnrollment.student.user.email,
              {
                workshopName: orderToFail.workshopEnrollment.workshop.name,
                studentName: orderToFail.workshopEnrollment.student.user.name ?? 'Student',
                reason: 'Payment verification failed (invalid signature).',
              }
            );
          }
        }
      }
      return NextResponse.json({ verified: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (err) {
    console.error('Workshop Payment verification error (ws-verify):', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}