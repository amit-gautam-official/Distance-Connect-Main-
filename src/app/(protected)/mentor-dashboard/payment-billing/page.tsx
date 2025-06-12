//This is payment and billing page for the mentor dashboard
// It has two components- 1. Payment and Billing 2. Payment History
//1. Payment and Billing component is used to add or update payment details - form that takes Account details(bank name, account number, IFSC code, etc.)
//2. Payment History component is used to view the payment history of the mentor from the database RazorpayOrder (scheduledMeeting - for the orders related to schedule meeting and workshopEnrollment<workshop<mentor - for the orders related to workshop enrollment)
// Use prisma query in the server component to fetch the payment history from the database

import { redirect } from "next/navigation";
import { PaymentBillingForm } from "./_components/payment-billing-form";
import { PaymentHistory } from "./_components/payment-history";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

async function getPaymentData(userId: string) {
  // Get mentor details
  const mentor = await db.mentor.findUnique({
    where: { userId },
    include: { bankDetails: true },
  });

  if (!mentor) {
    return { bankDetails: null, paymentHistory: [] };
  }

  // Get payment history from scheduled meetings
  const scheduledMeetingsPayments = await db.razorpayOrder.findMany({
    where: {
      scheduledMeeting: {
        mentorUserId: userId,
      },
    },
    include: {
      scheduledMeeting: {
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get payment history from workshops
  const workshopPayments = await db.razorpayOrder.findMany({
    where: {
      workshopEnrollment: {
        workshop: {
          mentorUserId: userId,
        },
      },
    },
    include: {
      workshopEnrollment: {
        include: {
          workshop: true,
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Combine both payment histories
  const paymentHistory = [
    ...scheduledMeetingsPayments.map((order: any) => ({
      ...order,
      type: "session",
      title: order.scheduledMeeting?.eventName || "Mentoring Session",
      studentName: order.scheduledMeeting?.student?.user?.name || "Student",
      studentEmail: order.scheduledMeeting?.student?.user?.email || "",
      date: order.scheduledMeeting?.selectedDate || order.createdAt,
      receivedPaymentFromAdmin:
        order.scheduledMeeting?.receivedPaymentFromAdmin || false,
    })),
    ...workshopPayments.map((order: any) => ({
      ...order,
      type: "workshop",
      title: order.workshopEnrollment?.workshop?.name || "Workshop",
      studentName: order.workshopEnrollment?.student?.user?.name || "Student",
      studentEmail: order.workshopEnrollment?.student?.user?.email || "",
      date: order.createdAt,
      receivedPaymentFromAdmin:
        order.workshopEnrollment?.receivedPaymentFromAdmin || false,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    bankDetails: mentor.bankDetails,
    paymentHistory,
  };
}

export default async function PaymentAndBillingPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const { bankDetails, paymentHistory } = await getPaymentData(userId);

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-[#3D568F]">
        Payment & Billing
      </h1>

      <div className="mb-8">
        <p className="text-muted-foreground">
          Manage your payment details and view your payment history. Any
          payments received from your mentoring sessions and workshops will be
          processed based on the account details provided here.
        </p>
      </div>

      <Tabs defaultValue="payment-details" className="w-full">
        <TabsList className="mb-6 w-full border-b bg-background md:w-1/2">
          <TabsTrigger
            value="payment-details"
            className="flex-1 data-[state=active]:bg-[#5580D6]/10 data-[state=active]:text-[#3D568F]"
          >
            Payment Details
          </TabsTrigger>
          <TabsTrigger
            value="payment-history"
            className="flex-1 data-[state=active]:bg-[#5580D6]/10 data-[state=active]:text-[#3D568F]"
          >
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment-details">
          <Card className="border-[#5580D6]/20 shadow-sm">
            <CardContent className="pt-6">
              <PaymentBillingForm initialData={bankDetails} userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-history">
          <Card>
            <CardContent className="pt-6">
              <PaymentHistory paymentHistory={paymentHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
