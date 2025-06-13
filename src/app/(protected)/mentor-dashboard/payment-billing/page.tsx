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


const scheduledMeetingsPayments = await db.scheduledMeetings.findMany({
    where: {
        mentorUserId: userId,
        },
    include: {
        RazorpayOrder: true,
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
  // For each meeting, map Razorpay orders if they exist; else, add a fallback entry
  ...scheduledMeetingsPayments.flatMap((meeting: any) => {
    const orders = meeting.RazorpayOrder || [];

    // If there are no Razorpay orders, return a fallback entry
    if (orders.length === 0) {
      return [{
        type: "session",
        title: meeting.eventName || "Mentoring Session",
        studentName: meeting.student?.user?.name || "Student",
        studentEmail: meeting.student?.user?.email || "",
        date: meeting.selectedDate || meeting.createdAt,
        receivedPaymentFromAdmin: meeting.receivedPaymentFromAdmin ?? false,
        createdAt: meeting.createdAt || new Date(),
        completed: meeting.completed || false,
        // Add default fields that would come from a Razorpay order
        id: meeting.id,
        amount: 5000,
        status: "Pending Admin Payment- Free Session",
      }];
    }

    // Map existing orders
    return orders.map((order: any) => ({
      ...order,
      type: "session",
      title: meeting.eventName || "Mentoring Session",
      studentName: meeting.student?.user?.name || "Student",
      studentEmail: meeting.student?.user?.email || "",
      date: meeting.selectedDate || order.createdAt || meeting.createdAt,
      completed: meeting.completed || false,
      receivedPaymentFromAdmin: order.receivedPaymentFromAdmin ?? meeting.receivedPaymentFromAdmin ?? false,
      createdAt: order.createdAt || meeting.createdAt || new Date(),
    }));
  }),

  // For workshop payments
  ...workshopPayments.map((order: any) => ({
    ...order,
    type: "workshop",
    title: order.workshopEnrollment?.workshop?.name || "Workshop",
    studentName: order.workshopEnrollment?.student?.user?.name || "Student",
    studentEmail: order.workshopEnrollment?.student?.user?.email || "",
    date: order.createdAt,
    receivedPaymentFromAdmin: order.workshopEnrollment?.receivedPaymentFromAdmin || false,
    createdAt: order.createdAt,
  })),
].sort((a, b) => {
  const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
  const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
  return bTime - aTime;
});


  return {
    bankDetails: mentor.bankDetails,
    paymentHistory,
  };
}

export default async function PaymentAndBillingPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const userId = session.user.id;
  const { bankDetails, paymentHistory } = await getPaymentData(userId);

  return (
    <div className=" mx-auto md:px-6 py-10 pb-16 md:pb-0">
      <h1 className="mb-8 text-3xl font-bold text-[#3D568F]">
        Payment & Billing
      </h1>

      <div className="mb-8">
        <p className="text-muted-foreground">
          Manage your payment details and view your payment history. Any
          payments received from your mentoring sessions, workshops, referral or any other services will be
          processed based on the account details provided here.
        </p>
      </div>

      <Tabs defaultValue={bankDetails? "payment-history" : "payment-details"} className="w-full">
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
