"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  FileUp,
  Send,
  CreditCard,
  ExternalLink,
  Download,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileSelector from "@/components/file-selector";
import { convertFileToBase64 } from "@/lib/file-utils";

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

// Calculate progress percentage based on status
const getProgressPercentage = (status: string) => {
  const statusValues: Record<string, number> = {
    INITIATED: 10,
    RESUME_REVIEW: 20,
    CHANGES_REQUESTED: 30,
    APPROVED_FOR_REFERRAL: 40,
    REFERRAL_SENT: 60,
    PAYMENT_PENDING: 80,
    COMPLETED: 100,
  };

  return statusValues[status] || 0;
};

const ReferralDetailPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  // const referralId = params.id;
  const [isStudent, setIsStudent] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isUpdateResumeModalOpen, setIsUpdateResumeModalOpen] = useState(false);
  const [isUpdatingResume, setIsUpdatingResume] = useState(false);

  const params = useParams<{ id: string }>();
  const referralId = params.id;

  // Fetch referral details
  const {
    data: referral,
    isLoading,
    refetch,
  } = api.referral.getReferralRequestById.useQuery({
    referralRequestId: referralId,
  });

  // Get current user role
  const { data: user, isLoading: userLoading } = api.user.getMe.useQuery();

  useEffect(() => {
    if (user && !userLoading) {
      setIsStudent(user.role === "STUDENT");
    }
  }, [user, userLoading]);
  // Handle payment with Razorpay
  const handlePayment = async (isInitiationFee: boolean) => {
    if (!referral) {
      toast({
        title: "Error",
        description: "Referral details not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Create a payment order on the server
      const response = await fetch("/api/payment/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralRequestId: referralId,
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
        handler: async function (response: any) {
          setIsProcessingPayment(true); // Keep loading indicator active during verification
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.verified) {
              toast({
                title: "Payment Successful",
                description: "Your payment has been processed successfully.",
                variant: "default",
              });
              refetch();
            } else {
              toast({
                title: "Verification Error",
                description:
                  verifyData.error ||
                  "Payment verification failed. Please contact support.",
                variant: "destructive",
              });
            }
          } catch (err) {
            console.error("Verification API error:", err);
            toast({
              title: "Verification Error",
              description:
                "An error occurred during payment verification. We'll update your status soon via webhook if payment was successful.",
              variant: "destructive",
            });
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name || undefined,
          email: user?.email || undefined,
        },
        notes: {
          referralRequestId: referralId,
          isInitiationFee: isInitiationFee.toString(),
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment Canceled",
              description:
                "Payment window closed. If you made a payment, it will be processed.",
              variant: "default",
            });
            setIsProcessingPayment(false);
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description:
          error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    }
  };
  // Define form schema for update resume
  const updateResumeSchema = z.object({
    resumeUrl: z.string().optional(),
    resumeFile: z.any().optional(),
    coverLetterUrl: z.string().optional(),
    coverLetterFile: z.any().optional(),
    positionName: z.string().min(2, {
      message: "Position name must be at least 2 characters.",
    }),
    jobLink: z.string().url({
      message: "Please enter a valid job link URL.",
    }),
  });

  // Add update referral documents mutation
  const updateReferralDocumentsMutation =
    api.referral.updateReferralDocuments.useMutation({
      onSuccess: () => {
        setIsUpdatingResume(false);
        setIsUpdateResumeModalOpen(false);
        refetch();
        toast({
          title: "Success",
          description:
            "Your resume has been updated successfully. The mentor will be notified of your changes.",
          variant: "default",
        });
      },
      onError: (error) => {
        setIsUpdatingResume(false);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  // Initialize form with default values
  const updateResumeForm = useForm<z.infer<typeof updateResumeSchema>>({
    resolver: zodResolver(updateResumeSchema),
    defaultValues: {
      resumeUrl: referral?.resumeUrl || "",
      resumeFile: undefined,
      coverLetterUrl: referral?.coverLetterUrl || "",
      coverLetterFile: undefined,
      positionName: referral?.positionName || "",
      jobLink: referral?.jobLink || "",
    },
  });

  // Reset form values when referral data changes
  useEffect(() => {
    if (referral) {
      updateResumeForm.reset({
        resumeUrl: referral.resumeUrl || "",
        resumeFile: undefined,
        coverLetterUrl: referral.coverLetterUrl || "",
        coverLetterFile: undefined,
        positionName: referral.positionName || "",
        jobLink: referral.jobLink || "",
      });
    }
  }, [referral, updateResumeForm]);
  // File upload mutation
  const fileUploadMutation = api.file.upload.useMutation({
    onError: (error) => {
      toast({
        title: "Upload failed",
        description:
          error.message || "An error occurred while uploading your file.",
        variant: "destructive",
      });
      setIsUpdatingResume(false);
    },
  });

  // Handle update resume form submission
  const onUpdateResume = async (values: z.infer<typeof updateResumeSchema>) => {
    setIsUpdatingResume(true);

    try {
      // Upload resume file if selected
      let resumeUrl = values.resumeUrl;
      if (values.resumeFile) {
        const base64 = await convertFileToBase64(values.resumeFile as File);
        const result = await fileUploadMutation.mutateAsync({
          fileContent: base64,
          fileType: "application/pdf",
          fileName: (values.resumeFile as File).name,
          bucketName: "distance-connect-user-uploads",
          folderName: "referrals/resumes",
        });
        resumeUrl = result.url;
      }

      // Upload cover letter file if selected
      let coverLetterUrl = values.coverLetterUrl;
      if (values.coverLetterFile) {
        const base64 = await convertFileToBase64(
          values.coverLetterFile as File,
        );
        const result = await fileUploadMutation.mutateAsync({
          fileContent: base64,
          fileType: "application/pdf",
          fileName: (values.coverLetterFile as File).name,
          bucketName: "distance-connect-user-uploads",
          folderName: "referrals/cover-letters",
        });
        coverLetterUrl = result.url;
      }

      // Update referral with new URLs
      await updateReferralDocumentsMutation.mutateAsync({
        referralRequestId: referralId,
        resumeUrl: resumeUrl || "",
        coverLetterUrl: coverLetterUrl || "",
        positionName: values.positionName,
        jobLink: values.jobLink,
        status: "RESUME_REVIEW",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while updating your referral.",
        variant: "destructive",
      });
      setIsUpdatingResume(false);
    }
  };

  if (isLoading || userLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Referral Details</h1>
        <p>Loading referral details...</p>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Referral Details</h1>
        <p className="text-red-500">
          Referral request not found or you do not have access to view it.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() =>
            router.push(
              isStudent
                ? "/student-dashboard/referral"
                : "/mentor-dashboard/referral",
            )
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Referrals
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="mr-4"
          onClick={() =>
            router.push(
              isStudent
                ? "/student-dashboard/referral"
                : "/mentor-dashboard/referral",
            )
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Referral Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-1 text-xl">
                    {referral.companyName || "Referral Request"} -{" "}
                    {referral.positionName || "Position not specified"}
                  </CardTitle>
                  <CardDescription>
                    Referral request submitted on{" "}
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                {getReferralStatusBadge(referral.status)}
              </div>
            </CardHeader>
            <Progress
              value={getProgressPercentage(referral.status)}
              className="h-2"
            />
            <CardContent className="p-6 pt-4">
              <div className="mb-6 mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 flex items-center md:mb-0">
                  <Avatar className="mr-4 h-12 w-12">
                    <AvatarImage
                      src={
                        isStudent
                          ? referral.mentor.user.image || ""
                          : referral.student.user.image || ""
                      }
                      alt={
                        isStudent
                          ? referral.mentor.user.name || "Mentor"
                          : referral.student.user.name || "Student"
                      }
                    />
                    <AvatarFallback>
                      {isStudent
                        ? referral.mentor.user.name?.[0] || "M"
                        : referral.student.user.name?.[0] || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">
                      {isStudent
                        ? referral.mentor.user.name || "Mentor"
                        : referral.student.user.name || "Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isStudent
                        ? `${referral.mentor.currentCompany} • ${referral.mentor.jobTitle}`
                        : referral.student.studentRole === "WORKING"
                          ? `${referral.student.companyName} • ${referral.student.jobTitle}`
                          : referral.student.institutionName || ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {referral.resumeUrl && (
                    <a
                      href={referral.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Resume
                    </a>
                  )}

                  {referral.coverLetterUrl && (
                    <a
                      href={referral.coverLetterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Cover Letter
                    </a>
                  )}

                  {referral.jobLink && (
                    <a
                      href={referral.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Job Link
                    </a>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Status timeline */}
              <div className="mt-6">
                <h3 className="mb-4 text-lg font-medium">
                  Referral Status Timeline
                </h3>
                <div className="relative ml-4 border-l-2 border-gray-200 pb-2 pl-6">
                  <div className="relative mb-8">
                    <div className="absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white bg-blue-500"></div>
                    <p className="font-medium">Referral Initiated</p>
                    <p className="text-sm text-gray-500">
                      Waiting for payment and review
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(referral.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {referral.initiationFeePaid && (
                    <div className="relative mb-8">
                      <div className="absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white bg-purple-500"></div>
                      <p className="font-medium">Payment Received</p>
                      <p className="text-sm text-gray-500">
                        ₹99 initiation fee paid
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {/* Use a recent order date if available */}
                        {referral.orders.length > 0 && referral.orders[0]
                          ? new Date(
                              referral?.orders[0].createdAt,
                            ).toLocaleString()
                          : new Date(referral.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {referral.status !== "INITIATED" && (
                    <div className="relative mb-8">
                      <div
                        className={`absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white ${
                          referral.status === "CHANGES_REQUESTED"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <p className="font-medium">
                        {referral.status === "CHANGES_REQUESTED"
                          ? "Changes Requested"
                          : "Resume Reviewed"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {referral.status === "CHANGES_REQUESTED"
                          ? "Mentor requested changes to your resume"
                          : "Mentor approved your resume"}
                      </p>
                      {referral.mentorFeedback && (
                        <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm">
                          <p className="mb-1 font-medium">Mentor Feedback:</p>
                          <p className="text-gray-700">
                            {referral.mentorFeedback}
                          </p>
                        </div>
                      )}
                      {referral.mentorChangesRequested && (
                        <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm">
                          <p className="mb-1 font-medium text-yellow-800">
                            Changes Requested:
                          </p>
                          <p className="text-gray-700">
                            {referral.mentorChangesRequested}
                          </p>
                        </div>
                      )}
                    </div>
                  )}{" "}
                  {(referral.status === "REFERRAL_SENT" ||
                    referral.status === "UNDER_REVIEW" ||
                    referral.status === "REFERRAL_ACCEPTED" ||
                    referral.status === "REFERRAL_REJECTED" ||
                    referral.status === "PAYMENT_PENDING" ||
                    referral.status === "COMPLETED") && (
                    <div className="relative mb-8">
                      <div className="absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white bg-indigo-500"></div>
                      <p className="font-medium">Referral Sent</p>
                      <p className="text-sm text-gray-500">
                        Mentor has sent your referral to the company
                      </p>
                      {referral.referralProofUrl && (
                        <div className="mt-2 flex flex-col gap-2">
                          <a
                            href={referral.referralProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            View Referral Proof
                          </a>

                          {referral.status === "REFERRAL_SENT" &&
                            !referral.finalFeePaid &&
                            isStudent && (
                              <div className="mt-2 rounded-md border border-green-200 bg-green-50 p-3">
                                <p className="mb-2 text-sm font-medium text-green-800">
                                  Your referral has been sent! You can now
                                  complete the process by paying the final fee.
                                </p>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="w-full bg-green-600 hover:bg-green-700"
                                  onClick={() => handlePayment(false)}
                                  disabled={isProcessingPayment}
                                >
                                  {isProcessingPayment ? (
                                    <>
                                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard className="mr-2 h-3 w-3" />
                                      Pay Final Fee (₹
                                      {referral.finalFeeAmount
                                        ? (
                                            parseInt(referral.finalFeeAmount) /
                                            100
                                          ).toFixed(2)
                                        : "---"}
                                      )
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}
                  {(referral.status === "REFERRAL_ACCEPTED" ||
                    referral.status === "PAYMENT_PENDING" ||
                    referral.status === "COMPLETED") && (
                    <div className="relative mb-8">
                      <div className="absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white bg-emerald-500"></div>
                      <p className="font-medium">Referral Accepted</p>
                      <p className="text-sm text-gray-500">
                        Your referral has been accepted by the company
                      </p>
                      {referral.acceptanceProofUrl && (
                        <a
                          href={referral.acceptanceProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          View Acceptance Proof
                        </a>
                      )}
                    </div>
                  )}
                  {referral.status === "REFERRAL_REJECTED" && (
                    <div className="relative mb-8">
                      <div className="absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white bg-red-500"></div>
                      <p className="font-medium">Referral Rejected</p>
                      <p className="text-sm text-gray-500">
                        Unfortunately, the company rejected the referral
                      </p>
                    </div>
                  )}
                  {referral.status === "COMPLETED" && (
                    <div className="relative">
                      <div className="absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white bg-green-500"></div>
                      <p className="font-medium">Process Completed</p>
                      <p className="text-sm text-gray-500">
                        Referral process successfully completed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 p-6 pt-0">
              {/* Student-specific action buttons */}
              {isStudent && (
                <>
                  {" "}
                  {referral.status === "INITIATED" &&
                    !referral.initiationFeePaid && (
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => handlePayment(true)}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay ₹99 Initiation Fee
                          </>
                        )}{" "}
                      </Button>
                    )}{" "}
                  {referral.status === "CHANGES_REQUESTED" && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsUpdateResumeModalOpen(true)}
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Update Resume
                    </Button>
                  )}{" "}
                  {(referral.status === "REFERRAL_SENT" ||
                    referral.status === "REFERRAL_ACCEPTED") &&
                    !referral.finalFeePaid && (
                      <Button
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handlePayment(false)}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay Final Fee (₹
                            {referral.finalFeeAmount
                              ? (
                                  parseInt(referral.finalFeeAmount) / 100
                                ).toFixed(2)
                              : "---"}
                            )
                          </>
                        )}
                      </Button>
                    )}
                </>
              )}

              {/* Mentor-specific action buttons */}
              {!isStudent && (
                <>
                  {referral.status === "RESUME_REVIEW" && (
                    <div className="flex w-full gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          router.push(
                            `/mentor-dashboard/referral/${referralId}/request-changes`,
                          )
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Request Changes
                      </Button>{" "}
                      <Button
                        variant="default"
                        className="relative flex-1 overflow-hidden bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          router.push(
                            `/mentor-dashboard/referral/${referralId}/approve`,
                          )
                        }
                      >
                        <div className="absolute inset-0 animate-pulse bg-white opacity-10 duration-1000"></div>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  )}

                  {referral.status === "APPROVED_FOR_REFERRAL" && (
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() =>
                        router.push(
                          `/mentor-dashboard/referral/${referralId}/send`,
                        )
                      }
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Mark as Sent & Upload Proof
                    </Button>
                  )}

                  {referral.status === "REFERRAL_SENT" && (
                    <div className="flex w-full gap-2">
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() =>
                          router.push(
                            `/mentor-dashboard/referral/${referralId}/accepted`,
                          )
                        }
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Accepted
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          router.push(
                            `/mentor-dashboard/referral/${referralId}/rejected`,
                          )
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Mark as Rejected
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Referral Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Company</p>
                  <p>{referral.companyName || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Position</p>
                  <p>{referral.positionName || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current Status
                  </p>
                  <div className="mt-1">
                    {getReferralStatusBadge(referral.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Initiation Fee
                  </p>
                  <p>
                    {referral.initiationFeePaid
                      ? "✅ Paid (₹99)"
                      : "❌ Not Paid (₹99)"}
                  </p>
                </div>{" "}
                {(referral.status === "REFERRAL_SENT" ||
                  referral.status === "REFERRAL_ACCEPTED" ||
                  referral.status === "PAYMENT_PENDING" ||
                  referral.status === "COMPLETED") && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Final Fee
                    </p>
                    <p>
                      {referral.finalFeePaid
                        ? `✅ Paid (₹${referral.finalFeeAmount ? (parseInt(referral.finalFeeAmount) / 100).toFixed(2) : "---"})`
                        : `❌ Not Paid (₹${referral.finalFeeAmount ? (parseInt(referral.finalFeeAmount) / 100).toFixed(2) : "---"})`}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Created On
                  </p>
                  <p>{new Date(referral.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Updated
                  </p>
                  <p>{new Date(referral.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Payment information card */}
          {(referral.status === "REFERRAL_SENT" ||
            referral.status === "REFERRAL_ACCEPTED" ||
            referral.status === "PAYMENT_PENDING" ||
            referral.status === "COMPLETED") && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                {isStudent && !referral.finalFeePaid ? (
                  <div className="rounded-md border border-green-200 bg-green-50 p-4">
                    <p className="font-medium text-green-800">
                      {referral.status === "REFERRAL_SENT"
                        ? "Referral Sent!"
                        : "Good News!"}
                    </p>
                    <p className="mt-1 text-sm text-green-700">
                      {referral.status === "REFERRAL_SENT"
                        ? "Your mentor has sent your referral. Please pay the final fee to complete the process and unlock direct communication with your mentor."
                        : "Your referral has been accepted. Please pay the final fee to complete the process and unlock direct communication with your mentor."}
                    </p>
                    <Button
                      variant="default"
                      className="mt-4 w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handlePayment(false)}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Final Fee (₹
                          {referral.finalFeeAmount
                            ? (parseInt(referral.finalFeeAmount) / 100).toFixed(
                                2,
                              )
                            : "---"}
                          )
                        </>
                      )}
                    </Button>
                  </div>
                ) : referral.finalFeePaid ? (
                  <div className="rounded-md border border-green-200 bg-green-50 p-4">
                    <p className="font-medium text-green-800">
                      Payment Complete
                    </p>
                    <p className="mt-1 text-sm text-green-700">
                      All payments have been completed. You can now communicate
                      directly with your {isStudent ? "mentor" : "student"}.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() =>
                        router.push(
                          isStudent
                            ? "/student-dashboard/chat"
                            : "/mentor-dashboard/chat",
                        )
                      }
                    >
                      Go to Chat
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                    <p className="font-medium text-yellow-800">
                      Waiting for Payment
                    </p>
                    <p className="mt-1 text-sm text-yellow-700">
                      Waiting for the student to complete the final payment of ₹
                      {referral.finalFeeAmount
                        ? (parseInt(referral.finalFeeAmount) / 100).toFixed(2)
                        : "---"}
                      .
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Update Resume Modal */}
      <Dialog
        open={isUpdateResumeModalOpen}
        onOpenChange={setIsUpdateResumeModalOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Resume & Documents</DialogTitle>
            <DialogDescription>
              Make the requested changes to your resume and documents for this
              referral request.
            </DialogDescription>
          </DialogHeader>

          {referral && referral.mentorChangesRequested && (
            <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm">
              <p className="mb-1 font-medium text-yellow-800">
                Changes Requested by Mentor:
              </p>
              <p className="text-gray-700">{referral.mentorChangesRequested}</p>
            </div>
          )}

          <Form {...updateResumeForm}>
            <form
              onSubmit={updateResumeForm.handleSubmit(onUpdateResume)}
              className="space-y-4"
            >
              {" "}
              <FormField
                control={updateResumeForm.control}
                name="resumeFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Resume <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <FileSelector
                          fileType="resume"
                          onFileSelected={(file) => {
                            field.onChange(file);
                            // Clear resumeUrl if a new file is selected
                            if (file) {
                              updateResumeForm.setValue("resumeUrl", "");
                            }
                          }}
                          currentUrl={updateResumeForm.getValues("resumeUrl")}
                          required={true}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your resume as a PDF file (max 5MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={updateResumeForm.control}
                name="coverLetterFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <FileSelector
                          fileType="coverLetter"
                          onFileSelected={(file) => {
                            field.onChange(file);
                            // Clear coverLetterUrl if a new file is selected
                            if (file) {
                              updateResumeForm.setValue("coverLetterUrl", "");
                            }
                          }}
                          currentUrl={updateResumeForm.getValues(
                            "coverLetterUrl",
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your cover letter as a PDF file (max 5MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <FormField
                  control={updateResumeForm.control}
                  name="positionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Software Engineer, Product Manager, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>{" "}
              <FormField
                control={updateResumeForm.control}
                name="jobLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Link <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://jobs.google.com/job-posting"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Link to the job posting</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="my-6 rounded-md border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-800">
                  Important Information
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  You can upload new files or provide URLs to your documents.
                  Your files will be uploaded when you submit the form. Make
                  sure your resume and job link are provided.
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateResumeModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingResume}>
                  {isUpdatingResume ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Submit Updates"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Show resume update notification for mentors */}
      {!isStudent && referral.status === "RESUME_REVIEW" && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm">
          <div className="flex items-start">
            <FileUp className="mr-2 h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Resume Updated</p>
              <p className="mt-1 text-gray-700">
                The student has{" "}
                {referral.updatedAt &&
                new Date(referral.updatedAt).toLocaleString() !==
                  new Date(referral.createdAt).toLocaleString()
                  ? `updated their resume on ${new Date(referral.updatedAt).toLocaleString()}`
                  : "submitted their resume"}
                . Please review and approve the referral request or request
                changes if needed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralDetailPage;
