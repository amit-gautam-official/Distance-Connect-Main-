"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import FileSelector from "@/components/file-selector";
import { useToast } from "@/components/ui/use-toast";
import { convertFileToBase64 } from "@/lib/file-utils";

// Form schema
const referralRequestSchema = z.object({
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

const RequestReferralPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mentorId = searchParams.get("mentorId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  // Fetch mentor details
  const { data: mentor, isLoading: mentorLoading } =
    api.mentor.getMentorByUserId.useQuery(
      {
        userId: mentorId || "",
      },
      {
        enabled: !!mentorId,
      },
    );

  // File upload mutation
  const fileUploadMutation = api.file.upload.useMutation({
    onError: (error) => {
      toast({
        title: "Upload failed",
        description:
          error.message || "An error occurred while uploading your file.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const requestReferralMutation = api.referral.requestReferral.useMutation({
    onSuccess: (data) => {
      setIsSubmitting(false);
      toast({
        title: "Request submitted successfully",
        description:
          "Your referral request has been submitted. You'll be redirected to the payment page.",
      });
      router.push(`/student-dashboard/referral/${data.id}`);
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Error submitting request",
        description:
          error.message || "An error occurred while submitting your request.",
        variant: "destructive",
      });
    },
  });
  const form = useForm<z.infer<typeof referralRequestSchema>>({
    resolver: zodResolver(referralRequestSchema),
    defaultValues: {
      resumeUrl: "",
      resumeFile: undefined,
      coverLetterUrl: "",
      coverLetterFile: undefined,
      positionName: "",
      jobLink: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof referralRequestSchema>) => {
    if (!mentorId) {
      toast({
        title: "Error",
        description:
          "Mentor ID is missing. Please select a mentor from the referral page.",
        variant: "destructive",
      });
      return;
    }

    // Validate resume is provided either as URL or file
    if (!values.resumeUrl && !values.resumeFile) {
      toast({
        title: "Missing resume",
        description: "Please upload your resume before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload resume file if selected
      let resumeUrl = values.resumeUrl;
      if (values.resumeFile) {
        const base64 = await convertFileToBase64(values.resumeFile as File);
        const result = await fileUploadMutation.mutateAsync({
          fileContent: base64,
          fileType: "application/pdf",
          fileName: (values.resumeFile as File).name,
          bucketName: "dc-public-files",
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
          bucketName: "dc-public-files",
          folderName: "referrals/cover-letters",
        });
        coverLetterUrl = result.url;
      } // Submit the referral request with uploaded file URLs
      await requestReferralMutation.mutateAsync({
        mentorUserId: mentorId,
        resumeUrl: resumeUrl || "",
        coverLetterUrl: coverLetterUrl || "",
        positionName: values.positionName,
        jobLink: values.jobLink || "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while processing your request.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (mentorLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Request Referral</h1>
        <p>Loading mentor details...</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Request Referral</h1>
        <p className="text-red-500">
          Mentor not found. Please select a mentor from the referral page.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/student-dashboard/referral")}
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
          onClick={() => router.push("/student-dashboard/referral")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Request Referral</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Details</CardTitle>
              <CardDescription>
                You are requesting a referral from this mentor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center">
                <Avatar className="mr-4 h-16 w-16">
                  <AvatarImage
                    src={mentor.user.image || ""}
                    alt={mentor.user.name || "Mentor"}
                  />
                  <AvatarFallback>
                    {mentor.user.name?.[0] || "M"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-bold">
                    {mentor.user.name || "Mentor"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {mentor.currentCompany} • {mentor.jobTitle}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Company:</span>{" "}
                  {mentor.currentCompany}
                </p>
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {mentor.experience}
                </p>
                <p>
                  <span className="font-medium">Industry:</span>{" "}
                  {mentor.industry}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Referral Process</CardTitle>
            </CardHeader>
            <CardContent>
              {" "}
              <ol className="list-decimal space-y-3 pl-5 text-sm">
                <li>Upload your resume and job details</li>
                <li>Pay ₹99 initiation fee</li>
                <li>Mentor reviews your resume</li>
                <li>Make changes if requested</li>
                <li>Mentor submits your referral</li>
                <li>Pay final fee when mentor uploads proof</li>
                <li>Get direct contact with mentor</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Referral Request Form</CardTitle>
              <CardDescription>
                Please provide your resume and job details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {" "}
                  <FormField
                    control={form.control}
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
                                  form.setValue("resumeUrl", "");
                                }
                              }}
                              currentUrl={form.getValues("resumeUrl")}
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
                  />
                  <FormField
                    control={form.control}
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
                                  form.setValue("coverLetterUrl", "");
                                }
                              }}
                              currentUrl={form.getValues("coverLetterUrl")}
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
                  <FormField
                    control={form.control}
                    name="positionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Position Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The position you are applying for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  <FormField
                    control={form.control}
                    name="jobLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job Link <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://company.com/careers/job-posting"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Link to the job posting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  <div className="my-6 rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-800">
                      Important Information
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      Please select your resume as a PDF file and provide the
                      job link for the position you&apos;re applying for. Your
                      files will be uploaded when you submit the form. After
                      submission, you will need to pay a ₹99 initiation fee to
                      start the referral process. The mentor will review your
                      resume and may request changes before proceeding with the
                      referral.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading & Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestReferralPage;
