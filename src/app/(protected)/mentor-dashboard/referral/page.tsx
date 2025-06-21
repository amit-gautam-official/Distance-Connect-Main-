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
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  FileUp,
  Send,
  CreditCard,
  Briefcase,
  Users,
  CheckCheck,
  AlertCircle,
  Plus,
  Settings,
  Loader,
  Trash,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

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

// Form schemas
const requestChangesSchema = z.object({
  feedback: z.string().min(10, {
    message: "Feedback must be at least 10 characters.",
  }),
  changes: z.string().min(10, {
    message: "Please specify the changes needed.",
  }),
});

const sendReferralSchema = z.object({
  proofUrl: z.string().url({
    message: "Please enter a valid URL for the referral proof.",
  }),
  finalFeeAmount: z.string().transform((val) => parseInt(val) * 100), // Convert to paise
});

const updateReferralStatusSchema = z.object({
  proofUrl: z.string().url({
    message: "Please enter a valid URL for the proof.",
  }),
  finalFeeAmount: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) * 100 : undefined)), // Convert to paise
});

// Schema for referral offering form
const referralOfferingSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  companiesCanReferTo: z.string().min(3, {
    message: "Add at least one company.",
  }),
  positions: z.string().min(3, {
    message: "Add at least one position.",
  }),
  initiationFeeAmount: z.number().default(99), // Default ₹99
  finalFeeAmount: z.number().default(1999), // Default ₹1999
  isActive: z.boolean().default(true),
});

const MentorReferralPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [isOfferingDialogOpen, setIsOfferingDialogOpen] = useState(false);
  const [isEditOfferingDialogOpen, setIsEditOfferingDialogOpen] =
    useState(false);
  const [editingOffering, setEditingOffering] = useState<any>(null);
  const { toast } = useToast();

  // Add delete offering dialog state
  const [isDeletingOffering, setIsDeletingOffering] = useState(false);
  const [offeringToDelete, setOfferingToDelete] = useState<any>(null);

  // Fetch mentor's referral requests
  const {
    data: referralRequests,
    isLoading,
    refetch,
  } = api.referral.getMentorReferralRequests.useQuery();

  // Fetch mentor's referral offerings
  const {
    data: referralOfferings,
    isLoading: offeringsLoading,
    refetch: refetchOfferings,
  } = api.referral.getMentorReferralOfferings.useQuery();

  // Fetch mentor stats
  const { data: stats, isLoading: statsLoading } =
    api.referral.getMentorReferralStats.useQuery();

  // Mutations
  const updateStatusMutation = api.referral.updateReferralStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const updateReferralOfferingMutation =
    api.referral.updateReferralOffering.useMutation({
      onSuccess: () => {
        refetchOfferings();
        setIsEditOfferingDialogOpen(false);
        setEditingOffering(null);
        toast({
          title: "Success",
          description: "Referral offering updated successfully.",
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const createOfferingMutation =
    api.referral.createReferralOffering.useMutation({
      onSuccess: () => {
        refetchOfferings();
        setIsOfferingDialogOpen(false);
        toast({
          title: "Success",
          description: "Referral offering created successfully.",
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  // Add delete mutation
  const deleteOfferingMutation =
    api.referral.deleteReferralOffering.useMutation({
      onSuccess: () => {
        refetchOfferings();
        setIsDeletingOffering(false);
        setOfferingToDelete(null);
        toast({
          title: "Success",
          description: "Referral offering deleted successfully.",
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  // Forms
  const requestChangesForm = useForm<z.infer<typeof requestChangesSchema>>({
    resolver: zodResolver(requestChangesSchema),
    defaultValues: {
      feedback: "",
      changes: "",
    },
  });

  const sendReferralForm = useForm<z.infer<typeof sendReferralSchema>>({
    resolver: zodResolver(sendReferralSchema),
    defaultValues: {
      proofUrl: "",
      finalFeeAmount: 999, // Default ₹999
    },
  });

  const updateStatusForm = useForm<z.infer<typeof updateReferralStatusSchema>>({
    resolver: zodResolver(updateReferralStatusSchema),
    defaultValues: {
      proofUrl: "",
    },
  });
  const referralOfferingForm = useForm<z.infer<typeof referralOfferingSchema>>({
    resolver: zodResolver(referralOfferingSchema),
    defaultValues: {
      title: "",
      description: "",
      companiesCanReferTo: "",
      positions: "",
      initiationFeeAmount: 99, // Default ₹99
      finalFeeAmount: 1999, // Default ₹1999
      isActive: true,
    },
  });
  // Add a form for editing offerings
  const editOfferingForm = useForm<z.infer<typeof referralOfferingSchema>>({
    resolver: zodResolver(referralOfferingSchema),
    defaultValues: {
      title: "",
      description: "",
      companiesCanReferTo: "",
      positions: "",
      initiationFeeAmount: 99, // Default ₹99
      finalFeeAmount: 1999, // Default ₹1999
      isActive: true,
    },
  });

  // Handle dialog submission
  const onRequestChanges = (values: z.infer<typeof requestChangesSchema>) => {
    if (!selectedReferral) return;

    updateStatusMutation.mutate({
      referralRequestId: selectedReferral.id,
      status: "CHANGES_REQUESTED",
      mentorFeedback: values.feedback,
      mentorChangesRequested: values.changes,
    });
  };
  const onCreateReferralOffering = (
    values: z.infer<typeof referralOfferingSchema>,
  ) => {
    // Convert the comma-separated string to an array
    const companies = values.companiesCanReferTo
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const positions = values.positions
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    createOfferingMutation.mutate({
      title: values.title,
      description: values.description,
      companiesCanReferTo: companies,
      positions: positions,
      initiationFeeAmount: values.initiationFeeAmount * 100, // Convert to paise
      finalFeeAmount: values.finalFeeAmount * 100, // Convert to paise
      isActive: values.isActive,
    });
  };

  // Function to open the edit dialog with the offering data
  const handleEditOffering = (offering: any) => {
    setEditingOffering(offering);

    // Convert arrays back to comma-separated strings for the form
    const companiesStr = offering.companiesCanReferTo.join(", ");
    const positionsStr = offering.positions.join(", ");

    editOfferingForm.reset({
      title: offering.title,
      description: offering.description,
      companiesCanReferTo: companiesStr,
      positions: positionsStr,
      initiationFeeAmount: offering.initiationFeeAmount / 100, // Convert from paise to rupees
      finalFeeAmount: offering.finalFeeAmount / 100, // Convert from paise to rupees
      isActive: offering.isActive,
    });

    setIsEditOfferingDialogOpen(true);
  };

  // Function to handle edit form submission
  const onEditReferralOffering = (
    values: z.infer<typeof referralOfferingSchema>,
  ) => {
    if (!editingOffering) return;

    // Convert the comma-separated string to an array
    const companies = values.companiesCanReferTo
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const positions = values.positions
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    updateReferralOfferingMutation.mutate({
      offeringId: editingOffering.id,
      title: values.title,
      description: values.description,
      companiesCanReferTo: companies,
      positions: positions,
      initiationFeeAmount: values.initiationFeeAmount * 100, // Convert to paise
      finalFeeAmount: values.finalFeeAmount * 100, // Convert to paise
      isActive: values.isActive,
    });
  };

  // Function to handle delete confirmation
  const handleDeleteOffering = (offering: any) => {
    setOfferingToDelete(offering);
    setIsDeletingOffering(true);
  };

  // Function to confirm delete
  const confirmDeleteOffering = () => {
    if (!offeringToDelete) return;

    deleteOfferingMutation.mutate({
      offeringId: offeringToDelete.id,
    });
  };

  // Filter referrals by category
  const pendingReferrals =
    referralRequests?.filter((ref) =>
      ["INITIATED", "RESUME_REVIEW"].includes(ref.status),
    ) || [];

  const inProgressReferrals =
    referralRequests?.filter((ref) =>
      [
        "CHANGES_REQUESTED",
        "APPROVED_FOR_REFERRAL",
        "REFERRAL_SENT",
        "UNDER_REVIEW",
        "REFERRAL_ACCEPTED",
        "PAYMENT_PENDING",
      ].includes(ref.status),
    ) || [];

  const completedReferrals =
    referralRequests?.filter((ref) =>
      ["COMPLETED", "REFERRAL_REJECTED"].includes(ref.status),
    ) || [];

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
      <h1 className="mb-2 text-2xl font-bold">Referrals Management</h1>
      <p className="mb-6 text-gray-600">
        Review and manage student referral requests.
      </p>

      {/* Stats Cards */}
      {!statsLoading && stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="mb-2 rounded-full bg-blue-100 p-3">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
              <p className="text-2xl font-bold">
                {stats.totalReferralRequests}
              </p>
              <p className="text-sm text-gray-500">Total Requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="mb-2 rounded-full bg-yellow-100 p-3">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
              <p className="text-2xl font-bold">{stats.pendingReview}</p>
              <p className="text-sm text-gray-500">Pending Review</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="mb-2 rounded-full bg-purple-100 p-3">
                <Briefcase className="h-5 w-5 text-purple-700" />
              </div>
              <p className="text-2xl font-bold">{stats.referralsSent}</p>
              <p className="text-sm text-gray-500">Referrals Sent</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="mb-2 rounded-full bg-green-100 p-3">
                <CheckCheck className="h-5 w-5 text-green-700" />
              </div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="offerings">Referral Offerings</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingReferrals.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No pending referrals</h3>
              <p className="mt-2 text-gray-500">
                You do not have any referrals waiting for your review.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pendingReferrals.map((referral) => (
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
                  <CardContent className="p-4 pt-0">
                    <div className="mt-4 flex items-center">
                      <Avatar className="mr-3 h-10 w-10">
                        <AvatarImage
                          src={referral.student.user.image || ""}
                          alt={referral.student.user.name || "Student"}
                        />
                        <AvatarFallback>
                          {referral.student.user.name?.[0] || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {referral.student.user.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.student.studentRole === "WORKING"
                            ? `${referral.student.companyName} • ${referral.student.jobTitle}`
                            : referral.student.institutionName}
                        </p>
                      </div>
                    </div>

                    {referral.resumeUrl && (
                      <div className="mt-4">
                        <a
                          href={referral.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          View Resume
                        </a>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedReferral(referral)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Request Changes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Resume Changes</DialogTitle>
                          <DialogDescription>
                            Provide feedback and request specific changes to the
                            student&apos;s resume.
                          </DialogDescription>
                        </DialogHeader>

                        <Form {...requestChangesForm}>
                          <form
                            onSubmit={requestChangesForm.handleSubmit(
                              onRequestChanges,
                            )}
                            className="space-y-4"
                          >
                            <FormField
                              control={requestChangesForm.control}
                              name="feedback"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>General Feedback</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Provide overall feedback on the resume"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={requestChangesForm.control}
                              name="changes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Requested Changes</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Specify what changes are needed"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <DialogFooter>
                              <Button type="submit">Send Feedback</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>{" "}
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => {
                        setSelectedReferral(referral);
                        updateStatusMutation.mutate({
                          referralRequestId: referral.id,
                          status: "APPROVED_FOR_REFERRAL",
                          mentorFeedback:
                            "Your resume looks good! I'll proceed with the referral.",
                        });
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress">
          {inProgressReferrals.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                No referrals in progress
              </h3>
              <p className="mt-2 text-gray-500">
                Referrals that are in progress will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {inProgressReferrals.map((referral) => (
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
                  <Progress value={75} className="h-1" />
                  <CardContent className="p-4 pt-0">
                    <div className="mt-4 flex items-center">
                      <Avatar className="mr-3 h-10 w-10">
                        <AvatarImage
                          src={referral.student.user.image || ""}
                          alt={referral.student.user.name || "Student"}
                        />
                        <AvatarFallback>
                          {referral.student.user.name?.[0] || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {referral.student.user.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.student.studentRole === "WORKING"
                            ? `${referral.student.companyName} • ${referral.student.jobTitle}`
                            : referral.student.institutionName}
                        </p>
                      </div>
                    </div>

                    {referral.resumeUrl && (
                      <div className="mt-4">
                        <a
                          href={referral.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          View Resume
                        </a>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                    {/* Action buttons based on status */}
                    {referral.status === "APPROVED_FOR_REFERRAL" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={() => setSelectedReferral(referral)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Mark as Sent & Upload Proof
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Referral Proof</DialogTitle>
                            <DialogDescription>
                              Upload a screenshot or link to prove you have sent
                              the referral.
                            </DialogDescription>
                          </DialogHeader>{" "}
                          <Form {...sendReferralForm}>
                            <form
                              onSubmit={sendReferralForm.handleSubmit(
                                (values) => {
                                  if (!selectedReferral) return;

                                  updateStatusMutation.mutate({
                                    referralRequestId: selectedReferral.id,
                                    status: "REFERRAL_SENT",
                                    referralProofUrl: values.proofUrl,
                                    finalFeeAmount: values.finalFeeAmount,
                                  });
                                },
                              )}
                              className="space-y-4"
                            >
                              <FormField
                                control={sendReferralForm.control}
                                name="proofUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Proof URL</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="https://drive.google.com/file/proof"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={sendReferralForm.control}
                                name="finalFeeAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Final Fee Amount (₹)</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <DialogFooter>
                                <Button type="submit">Submit</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    )}

                    {referral.status === "REFERRAL_SENT" && (
                      <div className="flex w-full gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              className="flex-1"
                              onClick={() => setSelectedReferral(referral)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark as Accepted
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Confirm Referral Acceptance
                              </DialogTitle>
                              <DialogDescription>
                                Upload proof that the referral was accepted by
                                the company.
                              </DialogDescription>
                            </DialogHeader>

                            <Form {...updateStatusForm}>
                              {" "}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  updateStatusForm.handleSubmit((values) => {
                                    if (!selectedReferral) return;

                                    updateStatusMutation.mutate({
                                      referralRequestId: selectedReferral.id,
                                      status: "REFERRAL_ACCEPTED",
                                      acceptanceProofUrl: values.proofUrl,
                                      finalFeeAmount: values.finalFeeAmount,
                                    });
                                  })();
                                }}
                                className="space-y-4"
                              >
                                <FormField
                                  control={updateStatusForm.control}
                                  name="proofUrl"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Acceptance Proof URL
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="https://drive.google.com/file/acceptance-proof"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <DialogFooter>
                                  <Button type="submit">
                                    Confirm Acceptance
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setSelectedReferral(referral)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark as Rejected
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Confirm Referral Rejection
                              </DialogTitle>
                              <DialogDescription>
                                Upload proof that the referral was rejected by
                                the company.
                              </DialogDescription>
                            </DialogHeader>

                            <Form {...updateStatusForm}>
                              {" "}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  updateStatusForm.handleSubmit((values) => {
                                    if (!selectedReferral) return;

                                    updateStatusMutation.mutate({
                                      referralRequestId: selectedReferral.id,
                                      status: "REFERRAL_REJECTED",
                                      acceptanceProofUrl: values.proofUrl,
                                      finalFeeAmount: values.finalFeeAmount,
                                    });
                                  })();
                                }}
                                className="space-y-4"
                              >
                                <FormField
                                  control={updateStatusForm.control}
                                  name="proofUrl"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Rejection Proof URL</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="https://drive.google.com/file/rejection-proof"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <DialogFooter>
                                  <Button variant="destructive" type="submit">
                                    Confirm Rejection
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        router.push(`/mentor-dashboard/referral/${referral.id}`)
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
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                No completed referrals
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Completed referrals will be shown here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedReferrals.map((referral) => (
                <Card key={referral.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {referral.companyName || "Referral Request"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {referral.positionName || "Position not specified"}
                        </p>
                      </div>
                      {getReferralStatusBadge(referral.status)}
                    </div>
                  </CardHeader>
                  <Progress value={100} className="h-1" />
                  <CardContent className="p-4 pt-0">
                    <div className="mt-2 flex items-center">
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage
                          src={referral.student.user.image || ""}
                          alt={referral.student.user.name || "Student"}
                        />
                        <AvatarFallback>
                          {referral.student.user.name?.[0] || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {referral.student.user.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/mentor-dashboard/referral/${referral.id}`,
                          )
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="offerings">
          <div className="mb-6 flex justify-between">
            <h2 className="text-2xl font-bold">Your Referral Offerings</h2>
            <Dialog
              open={isOfferingDialogOpen}
              onOpenChange={setIsOfferingDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Offering
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create a Referral Offering</DialogTitle>
                  <DialogDescription>
                    Define the companies and positions you can refer to. This
                    will be visible to students.
                  </DialogDescription>
                </DialogHeader>
                <Form {...referralOfferingForm}>
                  <form
                    onSubmit={referralOfferingForm.handleSubmit(
                      onCreateReferralOffering,
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={referralOfferingForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Tech Referrals for FAANG Companies"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A short, catchy title for your referral service
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={referralOfferingForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your referral service, experience, and success rate..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={referralOfferingForm.control}
                        name="companiesCanReferTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Companies</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Google, Meta, Amazon, etc. (comma-separated)"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Companies you can refer to (comma-separated)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={referralOfferingForm.control}
                        name="positions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Positions</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Software Engineer, Product Manager, etc. (comma-separated)"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Positions you can refer for (comma-separated)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={referralOfferingForm.control}
                        name="initiationFeeAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Initiation Fee (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Initial fee for resume review (recommended: ₹99)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={referralOfferingForm.control}
                        name="finalFeeAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Final Fee (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Fee charged after referral acceptance
                              (recommended: ₹1999)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={referralOfferingForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>
                              Make this referral offering available to students
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOfferingDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createOfferingMutation.isPending}
                      >
                        {createOfferingMutation.isPending ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Offering"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {offeringsLoading ? (
            <div className="py-12 text-center">
              <Loader className="mx-auto h-12 w-12 animate-spin text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                Loading your offerings...
              </h3>
            </div>
          ) : referralOfferings?.length === 0 ? (
            <div className="py-12 text-center">
              <Settings className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">
                No referral offerings yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Create your first referral offering to get started.
              </p>
              <Button
                className="mt-4"
                onClick={() => setIsOfferingDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Offering
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {referralOfferings?.map((offering) => (
                <Card key={offering.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{offering.title}</p>
                        <p className="text-sm text-gray-500">
                          {offering.companiesCanReferTo.length} companies,{" "}
                          {offering.positions.length} positions
                        </p>
                      </div>
                      <Badge
                        variant={offering.isActive ? "default" : "outline"}
                      >
                        {offering.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="mb-4 line-clamp-3 text-sm text-gray-700">
                      {offering.description}
                    </p>
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-500">
                        COMPANIES
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {offering.companiesCanReferTo
                          .slice(0, 3)
                          .map((company, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {company}
                            </Badge>
                          ))}
                        {offering.companiesCanReferTo.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{offering.companiesCanReferTo.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500">
                        POSITIONS
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {offering.positions.slice(0, 3).map((position, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {position}
                          </Badge>
                        ))}
                        {offering.positions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{offering.positions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">
                          ₹{offering.initiationFeeAmount / 100}
                        </span>{" "}
                        <span className="text-gray-500">initial</span>
                      </div>
                      <div>
                        <span className="font-medium">
                          ₹{offering.finalFeeAmount / 100}
                        </span>{" "}
                        <span className="text-gray-500">final</span>
                      </div>
                      <div>
                        <span className="font-medium">
                          {offering.referralSuccess}
                        </span>{" "}
                        <span className="text-gray-500">successful</span>
                      </div>
                    </div>{" "}
                    <div className="mt-4 flex justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOffering(offering)}
                        >
                          <Settings className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteOffering(offering)}
                        >
                          <Trash className="mr-2 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                      <Button
                        variant={offering.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => {
                          // Toggle active status
                          updateReferralOfferingMutation.mutate({
                            offeringId: offering.id,
                            isActive: !offering.isActive,
                          });
                        }}
                      >
                        {offering.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Offering Dialog */}
      <Dialog
        open={isOfferingDialogOpen}
        onOpenChange={setIsOfferingDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Referral Offering</DialogTitle>
            <DialogDescription>
              Define the details of the referral offering you want to create.
            </DialogDescription>
          </DialogHeader>

          <Form {...referralOfferingForm}>
            <form
              onSubmit={referralOfferingForm.handleSubmit(
                onCreateReferralOffering,
              )}
              className="space-y-4"
            >
              <FormField
                control={referralOfferingForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Software Engineer Referral"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={referralOfferingForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the referral offering"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={referralOfferingForm.control}
                name="companiesCanReferTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Companies</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Google, Microsoft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={referralOfferingForm.control}
                name="positions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Positions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Frontend Developer, Backend Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={referralOfferingForm.control}
                name="initiationFeeAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiation Fee (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={referralOfferingForm.control}
                name="finalFeeAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Fee Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={referralOfferingForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="ml-2">Is Active</FormLabel>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Create Offering</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Offering Dialog */}
      <Dialog
        open={isEditOfferingDialogOpen}
        onOpenChange={setIsEditOfferingDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Referral Offering</DialogTitle>
            <DialogDescription>
              Update your referral offering details. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <Form {...editOfferingForm}>
            <form
              onSubmit={editOfferingForm.handleSubmit(onEditReferralOffering)}
              className="space-y-4"
            >
              <FormField
                control={editOfferingForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Senior Software Engineer Referral"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editOfferingForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I can refer to the engineering team. I worked there for 5 years and know the hiring process well."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={editOfferingForm.control}
                  name="companiesCanReferTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Companies</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Google, Meta, Microsoft"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of companies
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editOfferingForm.control}
                  name="positions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Positions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SDE, ML Engineer, Product Manager"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of positions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={editOfferingForm.control}
                  name="initiationFeeAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initiation Fee (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editOfferingForm.control}
                  name="finalFeeAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Fee (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editOfferingForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Make this offering visible to students
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOfferingDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateReferralOfferingMutation.isPending}
                >
                  {updateReferralOfferingMutation.isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Offering Confirmation Dialog */}
      <Dialog open={isDeletingOffering} onOpenChange={setIsDeletingOffering}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Referral Offering</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this referral offering? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {offeringToDelete && (
            <div className="py-4">
              <h4 className="font-medium">{offeringToDelete.title}</h4>
              <p className="mt-1 text-sm text-gray-500">
                This will permanently remove the offering and it will no longer
                be visible to students.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeletingOffering(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteOffering}
              disabled={deleteOfferingMutation.isPending}
            >
              {deleteOfferingMutation.isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Offering"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorReferralPage;
