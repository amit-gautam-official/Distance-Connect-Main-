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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

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
  const [isMarkAsSentModalOpen, setIsMarkAsSentModalOpen] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

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

  // Handle payment with Razorpay for mentors (usually for admin purposes)
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
                description:
                  "Payment has been processed successfully on behalf of the student.",
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
                "An error occurred during payment verification. We'll update the status soon via webhook if payment was successful.",
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
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
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
  // Mutations
  const updateStatusMutation = api.referral.updateReferralStatus.useMutation({
    onSuccess: () => {
      refetch();
      toast({
        title: "Status Updated",
        description: "The referral status has been successfully updated.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update referral status.",
        variant: "destructive",
      });
    },
  });

  // File upload mutation
  const fileUploadMutation = api.file.upload.useMutation({
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
    },
  });

  // Action handlers for mentor
  const handleApproveReferral = () => {
    updateStatusMutation.mutate({
      referralRequestId: referralId,
      status: "APPROVED_FOR_REFERRAL",
      mentorFeedback: "Your resume looks good! I'll proceed with the referral.",
    });
  };
  const handleRequestChanges = () => {
    router.push(`/mentor-dashboard/referral/${referralId}/request-changes`);
  };
  const handleMarkAsSent = () => {
    setIsMarkAsSentModalOpen(true);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        setProofFile(file);
      }
    }
  };
  const handleUploadProof = async () => {
    if (!proofFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (proofFile.size > 5 * 1024 * 1024) {
      // 5MB max size
      toast({
        title: "Error",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingProof(true);
    try {
      // Convert file to base64 for upload
      const fileBase64 = await convertFileToBase64(proofFile);
      if (!fileBase64) {
        throw new Error("Failed to process file");
      } // Extract the base64 data part (after the comma)
      const base64Data = fileBase64.split(",")[1];
      if (!base64Data) {
        throw new Error("Invalid file data format");
      }

      // Upload the file using the TRPC router
      const uploadResult = await fileUploadMutation.mutateAsync({
        bucketName: "dc-public-files",
        folderName: "referral-proofs",
        fileName: `referral-${referralId}`,
        fileType: proofFile.type,
        fileContent: base64Data,
        initialAvatarUrl: undefined, // No initial URL to replace
      });

      if (!uploadResult.success) {
        throw new Error("Failed to upload file");
      }

      // Update the referral status with the proof URL
      await updateStatusMutation.mutateAsync({
        referralRequestId: referralId,
        status: "REFERRAL_SENT",
        mentorFeedback: additionalNotes.trim() || undefined,
        referralProofUrl: uploadResult.url,
      });

      toast({
        title: "Success",
        description: "Referral marked as sent and proof uploaded successfully",
        variant: "default",
      });

      setIsMarkAsSentModalOpen(false);
      setProofFile(null);
      setAdditionalNotes("");
      refetch();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description:
          error.message || "Failed to upload proof. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingProof(false);
    }
  };
  // Helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Error reading file"));
    });
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
          onClick={() => router.push("/mentor-dashboard/referral")}
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
          onClick={() => router.push("/mentor-dashboard/referral")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Referral Details</h1>
      </div>

      {/* Show resume update notification for mentors */}
      {referral.status === "RESUME_REVIEW" && (
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
                      src={referral.student.user.image || ""}
                      alt={referral.student.user.name || "Student"}
                    />
                    <AvatarFallback>
                      {referral.student.user.name?.[0] || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">
                      {referral.student.user.name || "Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {referral.student.studentRole === "WORKING"
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
                          ? "You requested changes to the resume"
                          : "You approved the resume"}
                      </p>
                      {referral.mentorFeedback && (
                        <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm">
                          <p className="mb-1 font-medium">Your Feedback:</p>
                          <p className="text-gray-700">
                            {referral.mentorFeedback}
                          </p>
                        </div>
                      )}
                      {referral.mentorChangesRequested && (
                        <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm">
                          <p className="mb-1 font-medium text-yellow-800">
                            Changes You Requested:
                          </p>
                          <p className="text-gray-700">
                            {referral.mentorChangesRequested}
                          </p>
                        </div>
                      )}
                    </div>
                  )}{" "}
                  {(referral.status === "REFERRAL_SENT" ||
                    referral.status === "PAYMENT_PENDING" ||
                    referral.status === "COMPLETED") && (
                    <div className="relative mb-8">
                      <div className="absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white bg-indigo-500"></div>
                      <p className="font-medium">Referral Sent</p>
                      <p className="text-sm text-gray-500">
                        You have sent the referral to the company
                      </p>
                      {referral.referralProofUrl && (
                        <a
                          href={referral.referralProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          View Referral Proof
                        </a>
                      )}
                    </div>
                  )}
                  {(referral.status === "PAYMENT_PENDING" ||
                    referral.status === "COMPLETED") && (
                    <div className="relative mb-8">
                      <div className="absolute -left-[30px] mt-1.5 h-4 w-4 rounded-full border border-white bg-orange-500"></div>
                      <p className="font-medium">Payment Pending</p>
                      <p className="text-sm text-gray-500">
                        Waiting for final fee payment from student
                      </p>
                    </div>
                  )}{" "}
                  {/* Removed "Referral Rejected" step as it's no longer part of the flow */}
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
              {/* Mentor-specific action buttons */}{" "}
              {referral.status === "RESUME_REVIEW" && (
                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleRequestChanges}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Request Changes
                  </Button>

                  <Button
                    variant="default"
                    className="relative flex-1 overflow-hidden bg-green-600 hover:bg-green-700"
                    onClick={handleApproveReferral}
                  >
                    <div className="absolute inset-0 animate-pulse bg-white opacity-10 duration-1000"></div>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}{" "}
              {referral.status === "APPROVED_FOR_REFERRAL" && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleMarkAsSent}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Mark as Sent & Upload Proof
                </Button>
              )}{" "}
              {/* "Mark as Accepted" and "Mark as Rejected" buttons removed as they are no longer needed */}
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p>{referral.student.user.name || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{referral.student.user.email || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p>{referral.student.studentRole || "Not specified"}</p>
                </div>

                {referral.student.studentRole === "WORKING" && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Current Company
                      </p>
                      <p>{referral.student.companyName || "Not specified"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Job Title
                      </p>
                      <p>{referral.student.jobTitle || "Not specified"}</p>
                    </div>
                  </>
                )}

                {referral.student.studentRole !== "WORKING" && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Institution
                    </p>
                    <p>{referral.student.institutionName || "Not specified"}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
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
                </div>{" "}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Initiation Fee
                  </p>
                  <p>
                    {referral.initiationFeePaid
                      ? "✅ Paid (₹99)"
                      : "❌ Not Paid (₹99)"}
                  </p>
                  {!referral.initiationFeePaid && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handlePayment(true)}
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
                          Process Payment
                        </>
                      )}
                    </Button>
                  )}
                </div>{" "}
                {(referral.status === "PAYMENT_PENDING" ||
                  referral.status === "COMPLETED") && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Final Fee
                    </p>
                    <p>
                      {referral.finalFeePaid
                        ? `✅ Paid (₹${referral.finalFeeAmount ? ( parseInt(referral.finalFeeAmount) / 100).toFixed(2) : "---"})`
                        : `❌ Not Paid (₹${referral.finalFeeAmount ? ( parseInt(referral.finalFeeAmount) / 100).toFixed(2) : "---"})`}
                    </p>
                    {!referral.finalFeePaid && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
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
                            Process Payment
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>{" "}
          {/* Payment information card for final status */}
          {(referral.status === "PAYMENT_PENDING" ||
            referral.status === "COMPLETED") &&
            !referral.finalFeePaid && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
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

                    <Button
                      variant="outline"
                      className="mt-4 w-full"
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
                          Process Payment on Behalf of Student
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          {referral.status === "COMPLETED" && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-green-200 bg-green-50 p-4">
                  <p className="font-medium text-green-800">Process Complete</p>
                  <p className="mt-1 text-sm text-green-700">
                    All payments have been completed. You can now communicate
                    directly with the student.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => router.push("/mentor-dashboard/chat")}
                  >
                    Go to Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal for marking referral as sent and uploading proof */}
      <Dialog
        open={isMarkAsSentModalOpen}
        onOpenChange={setIsMarkAsSentModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark Referral as Sent</DialogTitle>{" "}
            <DialogDescription>
              Upload proof that you&apos;ve sent the referral (e.g., screenshot
              of email, referral confirmation) and provide any additional notes
              for the student.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="proof">Upload Proof*</Label>
              <Input
                id="proof"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Accepted formats: JPG, PNG, PDF. Max size: 5MB.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about the referral for the student..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[100px] w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMarkAsSentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleUploadProof}
              disabled={isUploadingProof || !proofFile}
            >
              {isUploadingProof ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Proof & Mark as Sent"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralDetailPage;
