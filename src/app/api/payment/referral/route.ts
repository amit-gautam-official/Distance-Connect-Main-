import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from '@/server/db';
import { ReferralStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { referralRequestId, isInitiationFee } = body;

    if (!referralRequestId) {
      return NextResponse.json({ error: 'Missing referral request ID' }, { status: 400 });
    }

    const referralRequest = await db.referralRequest.findUnique({
      where: { id: referralRequestId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        mentor: {
          include: {
            user: true,
          },
        },
      },
    });

    console.log('Referral Request:', referralRequest);
    if (!referralRequest) {
      return NextResponse.json({ error: 'Referral request not found' }, { status: 404 });
    }

    // Determine the amount based on whether it's initiation fee or final fee
    let amount: number;
    let description: string;
    
    if (isInitiationFee) {
      amount = parseInt(referralRequest.initiationFeeAmount);
      description = 'Referral Request Initiation Fee';
    } else {
      if (!referralRequest.finalFeeAmount) {
        return NextResponse.json({ error: 'Final fee amount not set' }, { status: 400 });
      }
      amount = parseInt(referralRequest.finalFeeAmount);
      description = 'Referral Final Fee';
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `referral_${referralRequestId}_${isInitiationFee ? 'init' : 'final'}}`,
      notes: {
        referralRequestId,
        studentEmail: referralRequest.student.user.email,
        mentorEmail: referralRequest.mentor.user.email,
        isInitiationFee: isInitiationFee.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // Create a record in the database
    const dbOrder = await db.razorpayOrder.create({
      data: {
        razorpayOrderId: order.id,
        amount: amount,
        status: 'pending',
        studentUserId: referralRequest.studentUserId,
        referralRequestId: referralRequestId,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      dbOrderId: dbOrder.id,
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
