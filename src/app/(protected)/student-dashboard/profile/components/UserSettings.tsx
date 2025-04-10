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
import { Key, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Student } from "@prisma/client";
import { useRouter } from "next/navigation";
import {ImageUpload} from "@/app/(protected)/register/_components/ImageUpload";
import { useProfile } from "../context";

enum StudentRole {
  HIGHSCHOOL = "HIGHSCHOOL",
  COLLEGE = "COLLEGE",
  WORKING = "WORKING",
}

const UserSettings = () => {
  const { data: user, isLoading } = api.user.getMe.useQuery(undefined, {
    // Reduce retries to avoid rate limit issues
    retry: 1,
    // Increase staleTime to reduce refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const { data: student } = api.student.getStudentOnly.useQuery(undefined, {
    // Reduce retries to avoid rate limit issues
    retry: 1,
    // Increase staleTime to reduce refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // console.log("student", student);
  return (
    <div className="space-y-6">
      <ProfileSettings user={user!} student={student!} />
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({
  user,
  student,
}: {
  user: User;
  student: Student;
}) => {
  const router = useRouter();
  const { updateAvatar, updateProfileField } = useProfile();

  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: () => {
      toast.success("User updated successfully");
      // Don't force reload as it interrupts image upload
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("Failed to update user");
      setIsSubmitting(false);
    },
  });
  const updateStudentMutation = api.student.updateStudent.useMutation({
    onSuccess: () => {
      toast.success("Student updated successfully");
      router.refresh();
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("Failed to update student");
      setIsSubmitting(false);
    },
  });
  // Use empty default values for initial server render to avoid hydration mismatch
  const [studentRole, setStudentRole] = useState<StudentRole>(
    StudentRole?.HIGHSCHOOL as any,
  );
  const [formData, setFormData] = useState({
    name: user?.name || "",
    location: student?.state || "",
    linkedinUrl: student?.linkedinUrl || "",
    institutionName: student?.institutionName || "",
    pinCode: student?.pinCode?.toString() || "",
    state: student?.state || "",
    interestFields: student?.interestFields.join(", ") || "",
    courseSpecialization: student?.courseSpecialization || "",
    companyName: student?.companyName || "",
    jobTitle: student?.jobTitle || "",
    experience: student?.experience || "",
    industry: student?.industry || "",
  });

  // Initialize state with user data after component mounts (client-side only)
  useEffect(() => {
    if (user && student) {
      setStudentRole(student?.studentRole as any);
      setFormData({
        name: user?.name || "",
        location: student?.state || "",
        linkedinUrl: student?.linkedinUrl || "",
        institutionName: student?.institutionName || "",
        pinCode: student?.pinCode?.toString() || "",
        state: student?.state || "",
        interestFields: Array.isArray(student?.interestFields)
          ? student?.interestFields.join(", ")
          : "",
        courseSpecialization: student?.courseSpecialization || "",
        companyName: student?.companyName || "",
        jobTitle: student?.jobTitle || "",
        experience: student?.experience || "",
        industry: student?.industry || "",
      });
    }
  }, [user, student]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update context state for immediate UI updates
    if (name === "name") {
      updateProfileField("name", value);
    } else if (name === "institutionName") {
      updateProfileField("institutionName", value);
    } else if (name === "state") {
      updateProfileField("state", value);
    } else if (name === "interestFields") {
      // Split by comma and trim spaces for array fields
      const fields = value.split(",").map((field) => field.trim());
      updateProfileField("interestFields", fields);
    } else if (name === "courseSpecialization") {
      updateProfileField("courseSpecialization", value);
    } else if (name === "companyName") {
      updateProfileField("companyName", value);
    } else if (name === "jobTitle") {
      updateProfileField("jobTitle", value);
    } else if (name === "experience") {
      updateProfileField("experience", value);
    } else if (name === "industry") {
      updateProfileField("industry", value);
    }
  };

  const handleRoleChange = (value: string) => {
    setStudentRole(value as StudentRole);
    updateProfileField("studentRole", value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    updateUserMutation.mutate({
      name: formData.name,
    });

    updateStudentMutation.mutate({
      studentRole,
      institutionName: formData.institutionName,
      pinCode: parseInt(formData.pinCode),
      interestFields: formData.interestFields.split(", "),
      state: formData.state,
      linkedinUrl: formData.linkedinUrl,
      courseSpecialization: formData.courseSpecialization,
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      experience: formData.experience,
      industry: formData.industry,
      studentName: formData.name,
    });
  };

  return (
    <div className="space-y-6 md:mb-0 mb-20">
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
            {/* Profile Picture */}
            <div className="mb-6 flex justify-center">
              <ImageUpload
                userId={user.id}
                isSubmitting={isSubmitting}
                onAvatarUpdate={updateAvatar}
                initialAvatarUrl={user.avatarUrl || undefined}
              />
            </div>

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

            {/* Student Role Selection */}
            <div className="space-y-3">
              <Label>I am a</Label>
              <RadioGroup
                value={studentRole}
                onValueChange={handleRoleChange}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={StudentRole.HIGHSCHOOL}
                    id="highschool"
                    
                  />
                  <Label className="text-sm" htmlFor="highschool">High School Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={StudentRole.COLLEGE} id="college" />
                  <Label className="text-sm" htmlFor="college">College Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={StudentRole.WORKING} id="working" />
                  <Label className="text-sm" htmlFor="working">Working Professional</Label>
                </div>
              </RadioGroup>
            </div>

            {/* High School specific fields */}
            {studentRole === StudentRole.HIGHSCHOOL && (
              <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-medium">High School Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="institutionName">School Name</Label>
                  <Input
                    id="institutionName"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="Name of your school"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pinCode">PIN Code</Label>
                    <Input
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="Your area PIN code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Your state"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestFields">
                    Fields of Interest (comma separated)
                  </Label>
                  <Input
                    id="interestFields"
                    name="interestFields"
                    value={formData.interestFields}
                    onChange={handleChange}
                    placeholder="Science, Math, Arts, etc."
                  />
                </div>
              </div>
            )}

            {/* College specific fields */}
            {studentRole === StudentRole.COLLEGE && (
              <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-medium">College Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="institutionName">
                    College/University Name
                  </Label>
                  <Input
                    id="institutionName"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="Name of your college or university"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseSpecialization">
                    Course/Specialization
                  </Label>
                  <Input
                    id="courseSpecialization"
                    name="courseSpecialization"
                    value={formData.courseSpecialization}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science, Business Administration"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Your state"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interestFields">
                      Fields of Interest (comma separated)
                    </Label>
                    <Input
                      id="interestFields"
                      name="interestFields"
                      value={formData.interestFields}
                      onChange={handleChange}
                      placeholder="AI, Web Development, Finance, etc."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Working professional specific fields */}
            {studentRole === StudentRole.WORKING && (
              <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-medium">Professional Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="Your job title or position"
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
                      placeholder="e.g., 2 years"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="e.g., Technology, Healthcare, Finance"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestFields">
                    Professional Interests (comma separated)
                  </Label>
                  <Input
                    id="interestFields"
                    name="interestFields"
                    value={formData.interestFields}
                    onChange={handleChange}
                    placeholder="Project Management, Data Science, Leadership"
                  />
                </div>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
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
            Manage your account details and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={user?.email || ""}
              readOnly
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              To change your email, please contact support
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Password</h3>
            <Button variant="outline">
              <Key size={16} className="mr-2" />
              Change Password
            </Button>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Account Type</h3>
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              <p>
                <span className="font-medium">Current plan: </span>
                {user?.role === "STUDENT" ? "Student" : "User"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-red-600">
              Danger Zone
            </h3>
            <Button variant="destructive" size="sm">
              Deactivate Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
