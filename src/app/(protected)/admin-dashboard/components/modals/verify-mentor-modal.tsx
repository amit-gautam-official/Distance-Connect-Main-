"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import MentorTierPrice from "../MentorTierPrice";

interface Mentor {
  user: {
    id: string;
    username: string | null;
    email: string;
    image: string | null;
  };
  userId: string;
  industry: string | null;
  linkedinUrl: string | null;
  currentCompany: string | null;
  mentorName: string | null;
  verified: boolean;
  wholeExperience: any[];
  companyEmailVerified: boolean;
  companyEmail: string | null;
  mentorSessionPriceRange: string | null;
  mentorTier: string | null;
  tierReasoning: string | null;
}

interface VerifyMentorModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function VerifyMentorModal({
  mentor,
  isOpen,
  setIsOpen,
}: VerifyMentorModalProps) {
  const [message, setMessage] = useState("");
  const [verifyingMentor, setVerifyingMentor] = useState(false);
  const [rejectingMentor, setRejectingMentor] = useState(false);
  const [deverifyingMentor, setDeverifyingMentor] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const utils = api.useUtils();
  const updateFromAdminMutation = api.admin.updateFromAdmin.useMutation({
    onSuccess: () => {
      utils.mentor.getMentorsForAdmin.invalidate();
      toast.success("Mentor updated successfully!");
    },
    onError: (error) => {
      toast.error("Error updating mentor: " + error.message);
    },
  });

  if (!mentor) return null;

  const handleVerify = async () => {
    setVerifyingMentor(true);
    try {
      await updateFromAdminMutation.mutateAsync({
        userId: mentor.user.id,
        verified: true,
        messageFromAdmin: message || "",
        companyEmailVerified: mentor.companyEmailVerified,
      });
      setIsOpen(false);
      setMessage("");
    } finally {
      setVerifyingMentor(false);
    }
  };

  const handleReject = async () => {
    setRejectingMentor(true);
    try {
      await updateFromAdminMutation.mutateAsync({
        userId: mentor.user.id,
        verified: false,
        messageFromAdmin: message || "Mentor rejected",
        companyEmailVerified: mentor.companyEmailVerified,
      });
      setIsOpen(false);
      setMessage("");
    } finally {
      setRejectingMentor(false);
    }
  };

  const handleDeverify = async () => {
    setDeverifyingMentor(true);
    try {
      await updateFromAdminMutation.mutateAsync({
        userId: mentor.user.id,
        verified: false,
        messageFromAdmin: message || "Mentor has been deverified",
        companyEmailVerified: mentor.companyEmailVerified,
      });
      setIsOpen(false);
      setMessage("");
    } finally {
      setDeverifyingMentor(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    try {
      await updateFromAdminMutation.mutateAsync({
        userId: mentor.user.id,
        verified: mentor.verified,
        messageFromAdmin: "",
        companyEmailVerified: true,
      });
    } finally {
      setVerifyingEmail(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-[90dvh] max-w-4xl rounded-lg p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">
            {mentor.verified ? "Mentor Profile" : "Verify Mentor Profile"}
          </DialogTitle>
          <DialogDescription>
            {mentor.verified
              ? `${mentor.mentorName} is currently verified as a mentor.`
              : `Are you sure you want to verify ${mentor.mentorName} as a mentor? This will show their profile in the Mentos Page.`}
          </DialogDescription>
        </DialogHeader>

        <div
          className="my-4 overflow-y-auto rounded-md bg-gray-50 p-3 md:p-4"
          style={{ maxHeight: "50vh" }}
        >
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Basic Information</h3>
                <p><strong>Name:</strong> {mentor.mentorName}</p>
                <p><strong>Industry:</strong> {mentor.industry}</p>
                <p><strong>Email:</strong> {mentor.user.email}</p>
                <p><strong>Username:</strong> {mentor.user.username}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {mentor.verified ? (
                    <span className="font-medium text-green-600">Verified</span>
                  ) : (
                    <span className="font-medium text-orange-600">Pending Verification</span>
                  )}
                </p>
              </div>

              {/* Company Email / LinkedIn */}
              <div className="space-y-3">
                {mentor.companyEmailVerified ? (
                  <div className="rounded-md bg-green-50 p-3">
                    <h4 className="mb-1 text-sm font-semibold text-green-700">
                      Company Email Verified
                    </h4>
                    <p className="text-sm"><strong>Email:</strong> {mentor.companyEmail}</p>
                    <p className="text-sm"><strong>Company:</strong> {mentor.currentCompany}</p>
                  </div>
                ) : (
                  <div className="rounded-md bg-red-50 p-3">
                    <h4 className="mb-1 text-sm font-semibold text-red-700">
                      Company Email Not Verified
                    </h4>
                    {mentor.companyEmail && (
                      <p className="text-sm"><strong>Email:</strong> {mentor.companyEmail}</p>
                    )}
                    {mentor.currentCompany && (
                      <p className="text-sm"><strong>Company:</strong> {mentor.currentCompany}</p>
                    )}
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={handleVerifyEmail}
                      disabled={verifyingEmail}
                    >
                      {verifyingEmail ? (
                        <>
                          <Loader className="size-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>
                    <p className="text-xs font-light text-gray-400">
                      Manually verify company email
                    </p>
                  </div>
                )}

                {mentor.linkedinUrl && (
                  <div className="rounded-md bg-blue-50 p-3">
                    <h4 className="mb-1 text-sm font-semibold text-blue-700">
                      LinkedIn Profile
                    </h4>
                    <a
                      href={mentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm text-blue-600 hover:underline"
                    >
                      {mentor.linkedinUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Experience</h3>
              {mentor.wholeExperience && mentor.wholeExperience.length > 0 ? (
                <div className="space-y-3">
                  {mentor.wholeExperience.map((exp, index) => (
                    <div key={index} className="rounded-md border border-gray-200 p-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-base font-medium">{exp.position}</p>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 sm:mt-0">
                          {exp.startDate} to {exp.current ? "Present" : exp.endDate}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
                      {exp.proofUrl && (
                        <div className="mt-2">
                          <a
                            href={exp.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            View Documentation
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                  <MentorTierPrice
                  tierReasoning={mentor.tierReasoning}
                   mentorTier={mentor.mentorTier}
                   mentorSessionPriceRange={mentor.mentorSessionPriceRange}
                   mentorUserId={mentor.userId} wholeExperience={mentor.wholeExperience} />
                </div>
              ) : (
                <p className="text-sm italic text-gray-500">
                  No experience information available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-4">
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
            {mentor.verified
              ? "Message (Reason for deverification)"
              : "Message (Optional for verification, required for rejection)"}
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              mentor.verified
                ? "Please provide a reason for deverifying this mentor..."
                : "Add any comments or feedback for the mentor..."
            }
            className="h-20 w-full resize-none"
          />
        </div>

        {/* Action Buttons */}
        <DialogFooter>
          <div className="flex w-full flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            {mentor.verified ? (
              <Button
                onClick={handleDeverify}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={!message.trim() || deverifyingMentor}
              >
                {deverifyingMentor ? (
                  <>
                    <Loader className="mr-2 size-4 animate-spin" />
                    Deverifying...
                  </>
                ) : (
                  "Deverify Mentor"
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleReject}
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={!message.trim() || rejectingMentor}
                >
                  {rejectingMentor ? (
                    <>
                      <Loader className="mr-2 size-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    "Reject Verification"
                  )}
                </Button>
                <Button
                  onClick={handleVerify}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={verifyingMentor}
                >
                  {verifyingMentor ? (
                    <>
                      <Loader className="mr-2 size-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Mentor"
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
