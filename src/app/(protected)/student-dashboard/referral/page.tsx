"use client";

import React, { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  FileUp,
  Send,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Helper function to get status badge
const getReferralStatusBadge = (status: string) => {
  switch (status) {
    case "INITIATED":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          Initiated
        </Badge>
      );
    case "RESUME_REVIEW":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800">
          Resume Review
        </Badge>
      );
    case "CHANGES_REQUESTED":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Changes Requested
        </Badge>
      );
    case "APPROVED_FOR_REFERRAL":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Approved for Referral
        </Badge>
      );
    case "REFERRAL_SENT":
      return (
        <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
          Referral Sent
        </Badge>
      );
    case "UNDER_REVIEW":
      return (
        <Badge variant="outline" className="bg-cyan-100 text-cyan-800">
          Under Review
        </Badge>
      );
    case "REFERRAL_ACCEPTED":
      return (
        <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
          Referral Accepted
        </Badge>
      );
    case "REFERRAL_REJECTED":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Referral Rejected
        </Badge>
      );
    case "PAYMENT_PENDING":
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800">
          Payment Pending
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const StudentReferralPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");

  // Fetch student's referral requests
  const { data: referralRequests, isLoading } =
    api.referral.getStudentReferralRequests.useQuery();

  // Fetch mentors available for referrals
  const { data: mentors, isLoading: mentorsLoading } =
    api.referral.getMentorsForReferral.useQuery();

  const initiatePaymentMutation =
    api.razorpayOrder.createRazorpayOrder.useMutation();

  // Placeholder function for handling payment
  const handlePayment = async (
    referralRequestId: string,
    isInitiationFee: boolean,
  ) => {
    try {
      // Create a payment order on the server
      const response = await fetch("/api/payment/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralRequestId,
          isInitiationFee,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await response.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Distance Connect",
        description: isInitiationFee
          ? "Referral Initiation Fee"
          : "Referral Final Fee",
        order_id: orderData.orderId,
        handler: function (response: any) {
          // Verify the payment
          verifyPayment(response);
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  const verifyPayment = async (paymentResponse: any) => {
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      // Refresh data
      await router.refresh();

      alert("Payment successful!");
    } catch (error) {
      console.error("Verification error:", error);
      alert("Payment verification failed. Please contact support.");
    }
  };

  // Function to browse mentors and request referral
  const requestReferral = (mentorId: string) => {
    router.push(`/student-dashboard/referral/request?mentorId=${mentorId}`);
  };

  // Get active and completed referrals
  const activeReferrals =
    referralRequests?.filter((ref) => ref.status !== "COMPLETED") || [];

  const completedReferrals =
    referralRequests?.filter((ref) => ref.status === "COMPLETED") || [];

  // Calculate progress percentage based on status
  const getProgressPercentage = (status: string) => {
    const statusValues: Record<string, number> = {
      INITIATED: 10,
      RESUME_REVIEW: 20,
      CHANGES_REQUESTED: 30,
      APPROVED_FOR_REFERRAL: 40,
      REFERRAL_SENT: 60,
      UNDER_REVIEW: 70,
      REFERRAL_ACCEPTED: 80,
      PAYMENT_PENDING: 90,
      COMPLETED: 100,
      REFERRAL_REJECTED: 100,
    };

    return statusValues[status] || 0;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Referrals</h1>
        <p>Loading your referral requests...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-2 text-2xl font-bold">Referrals</h1>
      <p className="mb-6 text-gray-600">
        Request and manage referrals from our verified mentors.
      </p>

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="mb-6 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Referrals</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
          </TabsList>

          {activeTab === "browse" && (
            <p className="text-sm text-gray-500">
              Choose a mentor to request a referral (₹99 initiation fee)
            </p>
          )}
        </div>
        <TabsContent value="active">
          {activeReferrals.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No active referrals</h3>
              <p className="mt-2 text-gray-500">
                Browse our mentors to request a referral.
              </p>
              <Button className="mt-4" onClick={() => setActiveTab("browse")}>
                Browse Mentors
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {activeReferrals.map((referral) => (
                <Card key={referral.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {referral.companyName || "Referral Request"}
                        </CardTitle>
                        <CardDescription>
                          {referral.positionName || "Position not specified"}
                        </CardDescription>
                      </div>
                      {getReferralStatusBadge(referral.status)}
                    </div>
                  </CardHeader>
                  <Progress
                    value={getProgressPercentage(referral.status)}
                    className="h-1"
                  />
                  <CardContent className="p-4 pt-0">
                    <div className="mb-2 mt-4 flex items-center">
                      <Avatar className="mr-3 h-10 w-10">
                        <AvatarImage
                          src={referral.mentor.user.image || ""}
                          alt={referral.mentor.user.name || "Mentor"}
                        />
                        <AvatarFallback>
                          {referral.mentor.user.name?.[0] || "M"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {referral.mentor.user.name || "Mentor"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.mentor.currentCompany} •{" "}
                          {referral.mentor.jobTitle}
                        </p>
                      </div>
                    </div>

                    {referral.mentorFeedback && (
                      <div className="mt-3 rounded-md bg-gray-50 p-3 text-sm">
                        <p className="mb-1 font-medium">Mentor Feedback:</p>
                        <p className="text-gray-700">
                          {referral.mentorFeedback}
                        </p>
                      </div>
                    )}

                    {referral.mentorChangesRequested && (
                      <div className="mt-3 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm">
                        <p className="mb-1 font-medium text-yellow-800">
                          Changes Requested:
                        </p>
                        <p className="text-gray-700">
                          {referral.mentorChangesRequested}
                        </p>
                      </div>
                    )}

                    {referral.status === "REFERRAL_ACCEPTED" &&
                      !referral.finalFeePaid && (
                        <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm">
                          <p className="mb-1 font-medium text-green-800">
                            Great News!
                          </p>
                          <p className="text-gray-700">
                            Your referral has been accepted. Complete the final
                            payment to unlock direct chat with your mentor.
                          </p>
                        </div>
                      )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                    {/* Action buttons based on status */}
                    {referral.status === "INITIATED" &&
                      !referral.initiationFeePaid && (
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => handlePayment(referral.id, true)}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay ₹99 Initiation Fee
                        </Button>
                      )}

                    {referral.status === "CHANGES_REQUESTED" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          router.push(
                            `/student-dashboard/referral/${referral.id}/update`,
                          )
                        }
                      >
                        <FileUp className="mr-2 h-4 w-4" />
                        Update Resume
                      </Button>
                    )}

                    {referral.status === "REFERRAL_ACCEPTED" &&
                      !referral.finalFeePaid && (
                        <Button
                          variant="default"
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handlePayment(referral.id, false)}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Final Fee (₹
                          {referral.finalFeeAmount
                            ? (referral.finalFeeAmount / 100).toFixed(2)
                            : "---"}
                          )
                        </Button>
                      )}

                    <Button
                      variant="outline"
                      className="w-full md:flex-1"
                      onClick={() =>
                        router.push(
                          `/student-dashboard/referral/${referral.id}`,
                        )
                      }
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          {completedReferrals.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                No completed referrals
              </h3>
              <p className="mt-2 text-gray-500">
                Your completed referrals will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {completedReferrals.map((referral) => (
                <Card key={referral.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {referral.companyName || "Referral"}
                        </CardTitle>
                        <CardDescription>
                          {referral.positionName || "Position not specified"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="mt-4 flex items-center">
                      <Avatar className="mr-3 h-10 w-10">
                        <AvatarImage
                          src={referral.mentor.user.image || ""}
                          alt={referral.mentor.user.name || "Mentor"}
                        />
                        <AvatarFallback>
                          {referral.mentor.user.name?.[0] || "M"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {referral.mentor.user.name || "Mentor"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.mentor.currentCompany} •{" "}
                          {referral.mentor.jobTitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        router.push(
                          `/student-dashboard/referral/${referral.id}`,
                        )
                      }
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>{" "}
        <TabsContent value="browse">
          {mentorsLoading ? (
            <div className="py-12 text-center">
              <Clock className="mx-auto h-12 w-12 animate-spin text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Loading mentors...</h3>
            </div>
          ) : mentors?.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No mentors available</h3>
              <p className="mt-2 text-gray-500">
                There are no mentors offering referrals at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mentors?.map((mentor: any) => (
                <Card
                  key={mentor.userId}
                  className="flex flex-col overflow-hidden"
                >
                  <CardHeader className="flex-row items-start gap-4 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={mentor.user.image || ""}
                        alt={mentor.user.name || "Mentor"}
                      />
                      <AvatarFallback>
                        {mentor.user.name?.[0] || "M"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {mentor.user.name || "Mentor"}
                      </CardTitle>
                      <CardDescription>
                        {mentor.currentCompany} • {mentor.jobTitle}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-4 pt-0">
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="line-clamp-3">
                        {mentor.bio ||
                          `${mentor.mentorName || "Mentor"} works at ${mentor.currentCompany} as ${mentor.jobTitle}.`}
                      </p>
                    </div>

                    {mentor.referralOfferings &&
                      mentor.referralOfferings.length > 0 && (
                        <>
                          <Separator className="my-3" />
                          <div className="mb-3">
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              REFERRAL OFFERINGS:
                            </p>
                            {mentor.referralOfferings.map((offering : any, idx : number) => (
                              <div
                                key={idx}
                                className="mb-2 rounded-md border p-3"
                              >
                                <p className="font-medium">{offering.title}</p>
                                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                  {offering.description}
                                </p>

                                <div className="mt-2">
                                  <p className="text-xs font-medium text-gray-500">
                                    COMPANIES:
                                  </p>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {offering.companiesCanReferTo
                                      .slice(0, 3)
                                      .map((company : any , i : any) => (
                                        <Badge
                                          key={i}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {company}
                                        </Badge>
                                      ))}
                                    {offering.companiesCanReferTo.length >
                                      3 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        +
                                        {offering.companiesCanReferTo.length -
                                          3}{" "}
                                        more
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-2">
                                  <p className="text-xs font-medium text-gray-500">
                                    POSITIONS:
                                  </p>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {offering.positions
                                      .slice(0, 3)
                                      .map((position : any, i : any) => (
                                        <Badge
                                          key={i}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {position}
                                        </Badge>
                                      ))}
                                    {offering.positions.length > 3 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        +{offering.positions.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-xs">
                                  <div>
                                    <span className="font-medium">
                                      ₹{offering.initiationFeeAmount / 100}
                                    </span>{" "}
                                    <span className="text-gray-500">
                                      initial
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      ₹{offering.finalFeeAmount / 100}
                                    </span>{" "}
                                    <span className="text-gray-500">final</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                    <div className="mt-3">
                      <p className="mb-1 text-xs text-gray-500">SKILLS:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.skills?.slice(0, 3).map((skill : any, i: any) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.skills?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      onClick={() => requestReferral(mentor.userId)}
                    >
                      Request Referral
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentReferralPage;
