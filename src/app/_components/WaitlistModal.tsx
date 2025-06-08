"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addToWaitlist, getWaitlistByEmail } from "@/actions/waitlist";
import { toast } from "sonner";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const waitlistEntry = await getWaitlistByEmail(email)
    if (waitlistEntry) {
      toast("You are already on the waitlist!");
      return;
    }
    
    const waitListEntry = await addToWaitlist(email, name);
    if (!waitListEntry) {
      toast.error("Failed to join waitlist. Please try again later.");
      return;
    }
    toast.success("Successfully joined the waitlist!");

    console.log("Submitted:", { name, email });
    setSubmitted(true);
  };

  const goToLogin = () => {
    router.push("/auth/login"); 
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden rounded-xl bg-white p-0 sm:max-w-xl md:max-w-3xl">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Form */}
          <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#3D568F]">
                  Distance Connect
                </DialogTitle>
                <DialogDescription className="mt-2 text-gray-600">
                  Join the waitlist to get personalized guidance from industry
                  experts who have walked the path you aspire to follow.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="border-gray-300 focus:border-[#3D568F] focus:ring-[#3D568F]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="border-gray-300 focus:border-[#3D568F] focus:ring-[#3D568F]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#3D568F] py-2 font-semibold text-white hover:bg-[#2e4270]"
                    >
                      Join Waitlist
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 text-center"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-medium text-gray-900">
                      Thank you for joining!
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We will connect you with the perfect mentor when we
                      launch.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-4">
              <p className="text-center text-sm text-gray-600">
                Are you a mentor?{" "}
                <button
                  onClick={goToLogin}
                  className="font-medium text-[#3D568F] hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>

          {/* Right side - Education/Mentorship Illustration */}
          <div className="hidden w-1/2 bg-gradient-to-br from-[#3D568F]/10 to-[#f5f7fb] p-8 md:block">
            <div className="flex h-full flex-col justify-center">
              <h3 className="mb-2 text-xl font-semibold text-[#3D568F]">
                Learn from industry experts
              </h3>
              <p className="mb-6 text-gray-600">
                Connect with mentors who can provide personalized guidance for
                your academic and career journey.
              </p>
              <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale  items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://storage.googleapis.com/dc-profile-image/6828b596fb786cad8f5f5f9b-1f652fc4-1fb1-4282-b34b-330c003eaff5.webp"
                    alt="@shadcn"
                  />
                  <AvatarFallback>Ayush Sharma</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://storage.googleapis.com/dc-profile-image/682433b61ab42f201ca85e68-60e6e867-e3cb-413f-8e02-39aabef6a101.webp"
                    alt="@leerob"
                  />
                  <AvatarFallback>Shivam Gupta</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://storage.googleapis.com/dc-profile-image/6842ba5764612ca9a943230c-0bd1798b-1cbc-4c6b-9f0f-5303aa70695f.webp"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>Dishank Bhan</AvatarFallback>
                </Avatar>
                <span
                  className="flex items-center text-xs text-gray-600 pl-4">
                  Mentors who have been in your shoes and
                  understand the challenges you face.
                </span>
              </div>

              <div className="mt-auto hidden md:block">
                <div className="relative w-full max-w-xs overflow-hidden rounded-lg">
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-yellow-300/30"></div>
                  <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-[#3D568F]/20"></div>
                  <div className="relative z-10">
                    <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-[#3D568F]/5">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-end space-x-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3D568F]/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-[#3D568F]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3D568F]/30">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-[#3D568F]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-center text-sm font-medium text-[#3D568F]">
                          Distance Connect Mentorship
                        </p>
                      </div>
                    </div>
                    {/* <Image
                      src="/images/student-mentor.svg"
                      alt="Student mentorship illustration"
                      width={300}
                      height={200}
                      className="h-auto w-full"
                      onError={(e) => {
                        // Fallback for missing image - show placeholder with icons
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex h-[200px] w-full items-center justify-center bg-[#3D568F]/5 rounded-lg">
                              <div class="flex flex-col items-center space-y-4">
                                <div class="flex items-end space-x-2">
                                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#3D568F]/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#3D568F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                  <div class="h-16 w-16 rounded-full bg-[#3D568F]/30 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#3D568F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                  </div>
                                </div>
                                <p class="text-center text-sm font-medium text-[#3D568F]">Distance Connect Mentorship</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
