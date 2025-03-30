"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Key, Loader2, Calendar, User } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User as UserType, Mentor } from "@prisma/client";
import { useRouter } from "next/navigation";
import AvailabilitySettings from "./AvailabilitySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

enum CompanyType {
  STARTUP = "STARTUP",
  SME = "SME",
  ENTERPRISE = "ENTERPRISE",
}

const UserSettings = () => {
  const { data: user, isLoading } = api.user.getMe.useQuery(undefined, {
    // Reduce retries to avoid rate limit issues
    retry: 1,
    // Increase staleTime to reduce refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const { data: mentor } = api.mentor.getMentorDataById.useQuery(undefined, {
    // Reduce retries to avoid rate limit issues
    retry: 1,
    // Increase staleTime to reduce refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile Settings
        </TabsTrigger>
        <TabsTrigger value="availability" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Availability
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileSettings user={user!} mentor={mentor!} />
      </TabsContent>
      <TabsContent value="availability">
        <AvailabilitySettings />
      </TabsContent>
    </Tabs>
  );
};

// Profile Settings Component
const ProfileSettings = ({
  user,
  mentor,
}: {
  user: UserType;
  mentor: Mentor;
}) => {
  const router = useRouter();
  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: () => {
      toast.success("User updated successfully");
      // Force a hard refresh of the page to ensure data is reloaded
      window.location.reload();

      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });
  const updateMentorMutation = api.mentor.updateMentor.useMutation({
    onSuccess: () => {
      toast.success("Mentor updated successfully");
      router.refresh();
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("Failed to update mentor");
    },
  });

  // Use empty default values for initial server render to avoid hydration mismatch
  const [companyType, setCompanyType] = useState<CompanyType>(
    CompanyType?.STARTUP as any,
  );
  const [formData, setFormData] = useState({
    name: user?.name || "",
    location: mentor?.state || "",
    linkedinUrl: mentor?.linkedinUrl || "",
    currentCompany: mentor?.currentCompany || "",
    pinCode: mentor?.pinCode?.toString() || "",
    state: mentor?.state || "",
    hiringFields: mentor?.hiringFields.join(", ") || "",
    jobTitle: mentor?.jobTitle || "",
    experience: mentor?.experience || "",
    industry: mentor?.industry || "",
  });

  // Initialize state with user data after component mounts (client-side only)
  useEffect(() => {
    if (user && mentor) {
      setCompanyType((mentor?.companyType as any) || CompanyType.STARTUP);
      setFormData({
        name: user?.name || "",
        location: mentor?.state || "",
        linkedinUrl: mentor?.linkedinUrl || "",
        currentCompany: mentor?.currentCompany || "",
        pinCode: mentor?.pinCode?.toString() || "",
        state: mentor?.state || "",
        hiringFields: Array.isArray(mentor?.hiringFields)
          ? mentor?.hiringFields.join(", ")
          : "",
        jobTitle: mentor?.jobTitle || "",
        experience: mentor?.experience || "",
        industry: mentor?.industry || "",
      });
    }
  }, [user, mentor]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyTypeChange = (value: string) => {
    setCompanyType(value as CompanyType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    updateUserMutation.mutate({
      name: formData.name,
    });

    updateMentorMutation.mutate({
      companyType,
      currentCompany: formData.currentCompany,
      pinCode: parseInt(formData.pinCode),
      hiringFields: formData.hiringFields.split(", "),
      state: formData.state,
      linkedinUrl: formData.linkedinUrl,
      jobTitle: formData.jobTitle,
      experience: formData.experience,
      industry: formData.industry,
      mentorName: formData.name,
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile information visible to others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input
                  id="pinCode"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="PIN Code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* Company Type Selection */}
            <div className="space-y-3">
              <Label>Company Type</Label>
              <RadioGroup
                value={companyType}
                onValueChange={handleCompanyTypeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={CompanyType.STARTUP} id="startup" />
                  <Label htmlFor="startup">Startup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={CompanyType.SME} id="sme" />
                  <Label htmlFor="sme">SME</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={CompanyType.ENTERPRISE}
                    id="enterprise"
                  />
                  <Label htmlFor="enterprise">Enterprise</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Professional Details */}
            <div className="space-y-4 rounded-md border p-4">
              <h3 className="font-medium">Professional Details</h3>

              <div className="space-y-2">
                <Label htmlFor="currentCompany">Company Name</Label>
                <Input
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  placeholder="Name of your company"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Your job title"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Years of experience"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="Your industry"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiringFields">Hiring Fields</Label>
              <Textarea
                id="hiringFields"
                name="hiringFields"
                value={formData.hiringFields}
                onChange={handleChange}
                placeholder="List fields you are hiring for (comma separated)"
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500">
                Separate each field with a comma. For example: "Software
                Engineering, Data Science, Product Management"
              </p>
            </div>

            <Button
              type="submit"
              className="mt-2 w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account security and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">
                  Update your account password
                </p>
              </div>
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
