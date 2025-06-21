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
import { FileText, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

// Form schema
const referralRequestSchema = z.object({
  resumeUrl: z.string().url({
    message: "Please enter a valid URL for your resume.",
  }),
  coverLetterUrl: z
    .string()
    .url({
      message: "Please enter a valid URL for your cover letter.",
    })
    .optional(),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  positionName: z.string().min(2, {
    message: "Position name must be at least 2 characters.",
  }),
  jobLink: z
    .string()
    .url({
      message: "Please enter a valid job link URL.",
    })
    .optional(),
});

const RequestReferralPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mentorId = searchParams.get("mentorId");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const requestReferralMutation = api.referral.requestReferral.useMutation({
    onSuccess: (data) => {
      setIsSubmitting(false);
      router.push(`/student-dashboard/referral/${data.id}`);
    },
    onError: (error) => {
      setIsSubmitting(false);
      alert(`Error: ${error.message}`);
    },
  });

  const form = useForm<z.infer<typeof referralRequestSchema>>({
    resolver: zodResolver(referralRequestSchema),
    defaultValues: {
      resumeUrl: "",
      coverLetterUrl: "",
      companyName: "",
      positionName: "",
      jobLink: "",
    },
  });

  const onSubmit = (values: z.infer<typeof referralRequestSchema>) => {
    if (!mentorId) {
      alert("Mentor ID is missing");
      return;
    }

    setIsSubmitting(true);
    requestReferralMutation.mutate({
      mentorUserId: mentorId,
      ...values,
    });
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
              <ol className="list-decimal space-y-3 pl-5 text-sm">
                <li>Submit your resume and job details</li>
                <li>Pay ₹99 initiation fee</li>
                <li>Mentor reviews your resume</li>
                <li>Make changes if requested</li>
                <li>Mentor submits your referral</li>
                <li>Company reviews your application</li>
                <li>Pay final fee if referral is accepted</li>
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
                  <FormField
                    control={form.control}
                    name="resumeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Resume URL <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input
                              placeholder="https://drive.google.com/file/resume"
                              {...field}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="ml-2"
                              onClick={() => {
                                // This is where you might open a file uploader dialog
                                // For now, we'll just simulate it
                                alert(
                                  "File uploader would open here. Implement FileUploader component.",
                                );
                              }}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Provide a link to your resume (Google Drive, Dropbox,
                          etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverLetterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Letter URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input
                              placeholder="https://drive.google.com/file/cover-letter"
                              {...field}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="ml-2"
                              onClick={() => {
                                // Same as above
                                alert("File uploader would open here.");
                              }}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Provide a link to your cover letter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Google" {...field} />
                        </FormControl>
                        <FormDescription>
                          The company you are applying to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                  />

                  <FormField
                    control={form.control}
                    name="jobLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Link (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://company.com/careers/job-posting"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Link to the job posting if available
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="my-6 rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-800">
                      Important Information
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      After submission, you will need to pay a ₹99 initiation fee
                      to start the referral process. The mentor will review your
                      resume and may request changes before proceeding with the
                      referral.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
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
