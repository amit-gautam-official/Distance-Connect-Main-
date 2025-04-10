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
import { Key, Loader2, Calendar, User, Plus, Trash, Ban } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User as PrismaUser, Mentor } from "@prisma/client";
import { useRouter } from "next/navigation";
import AvailabilitySettings from "./AvailabilitySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {ImageUpload} from "@/app/(protected)/register/_components/ImageUpload";
import {BannerUpload} from "@/app/(protected)/register/_components/BannerUpload";
import { useProfile } from "../context";
import { errorMonitor } from "node:stream";

// Define CompanyType enum locally
enum CompanyType {
  STARTUP = "STARTUP",
  SME = "SME",
  ENTERPRISE = "ENTERPRISE",
}

// Define interfaces for Education and Experience
interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

interface Experience {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
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
  user: PrismaUser;
  mentor: Mentor;
}) => {
  const router = useRouter();
  const { updateAvatar, updateProfileField } = useProfile();

  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: (data) => {
      // toast.success("User updated successfully");
      // Don't force reload as it interrupts image upload
      setIsSubmitting(false);
    },
    onError: (error) => {
      const fieldErrors = error?.data?.zodError?.fieldErrors;
      const firstErrorMessage = fieldErrors
        ? Object.values(fieldErrors)[0]?.[0]
        : "Something went wrong";
      toast.error(firstErrorMessage || "Failed to update user");      
      setIsSubmitting(false);
    },
  });
  const updateMentorMutation = api.mentor.updateMentor.useMutation({
    onSuccess: () => {
      toast.success("Mentor updated successfully");
      router.refresh();
      setIsSubmitting(false);
    },
    onError: (error) => {
      const fieldErrors = error?.data?.zodError?.fieldErrors;
      const firstErrorMessage = fieldErrors
        ? Object.values(fieldErrors)[0]?.[0]
        : "Something went wrong";
  
      toast.error(firstErrorMessage || "Failed to update mentor");
      
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
    skills : mentor?.skills.join(", ") || "",
    jobTitle: mentor?.jobTitle || "",
    experience: mentor?.experience || "",
    industry: mentor?.industry || "",
    bio: mentor?.bio || "",
  });

  // Initialize education data
  const [educationList, setEducationList] = useState<Education[]>([]);
  // Initialize experience data
  const [experienceList, setExperienceList] = useState<Experience[]>([]);

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
        skills: Array.isArray(mentor?.skills)
          ? mentor?.skills.join(", ")
          : "",
        hiringFields: Array.isArray(mentor?.hiringFields)
          ? mentor?.hiringFields.join(", ")
          : "",
        jobTitle: mentor?.jobTitle || "",
        experience: mentor?.experience || "",
        industry: mentor?.industry || "",
        bio: mentor?.bio || "",
      });

      // Parse education JSON data if available
      if (mentor?.education) {
        try {
          const parsedEducation = typeof mentor.education === 'string' 
            ? JSON.parse(mentor.education) 
            : mentor.education;
          setEducationList(Array.isArray(parsedEducation) ? parsedEducation : []);
        } catch (error) {
          console.error("Failed to parse education data:", error);
          setEducationList([]);
        }
      }

      // Parse experience JSON data if available
      if (mentor?.wholeExperience) {
        try {
          const parsedExperience = typeof mentor.wholeExperience === 'string'
            ? JSON.parse(mentor.wholeExperience)
            : mentor.wholeExperience;
          setExperienceList(Array.isArray(parsedExperience) ? parsedExperience : []);
        } catch (error) {
          console.error("Failed to parse experience data:", error);
          setExperienceList([]);
        }
      }
    }
  }, [user, mentor]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update context state for immediate UI updates
    if (name === "name") {
      updateProfileField("name", value);
    } else if (name === "currentCompany") {
      updateProfileField("currentCompany", value);
    } else if (name === "jobTitle") {
      updateProfileField("jobTitle", value);
    } else if (name === "experience") {
      updateProfileField("experience", value);
    } else if (name === "industry") {
      updateProfileField("industry", value);
    } else if (name === "state") {
      updateProfileField("state", value);
    } else if (name === "bio") {
      updateProfileField("bio", value);
    } else if (name === "hiringFields") {
      // Split by comma and trim spaces for array fields
      const fields = value.split(",").map((field) => field.trim());
      updateProfileField("hiringFields", fields);
    }
    else if (name === "skills") {
      // Split by comma and trim spaces for array fields
      const fields = value.split(",").map((field) => field.trim());
      updateProfileField("skills", fields);
    }
  };

  const handleCompanyTypeChange = (value: string) => {
    setCompanyType(value as CompanyType);
    updateProfileField("companyType", value);
  };

  // Handle education changes
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducationList = [...educationList];
    const updatedEducation = {
      institution: newEducationList[index]?.institution || '',
      degree: newEducationList[index]?.degree || '',
      field: newEducationList[index]?.field || '',
      startYear: newEducationList[index]?.startYear || '',
      endYear: newEducationList[index]?.endYear || '',
      [field]: value
    };
    newEducationList[index] = updatedEducation;
    setEducationList(newEducationList);
  };

  // Add new education entry
  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        institution: "",
        degree: "",
        field: "",
        startYear: "",
        endYear: "",
      },
    ]);
  };

  // Remove education entry
  const removeEducation = (index: number) => {
    const newEducationList = [...educationList];
    newEducationList.splice(index, 1);
    setEducationList(newEducationList);
  };

  // Handle experience changes
  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string | boolean
  ) => {
    const newExperienceList = [...experienceList];
    // Create a properly typed complete experience object by using the existing object and updating just one field
    const updatedExperience = {
      company: newExperienceList[index]?.company || '',
      position: newExperienceList[index]?.position || '',
      description: newExperienceList[index]?.description || '',
      startDate: newExperienceList[index]?.startDate || '',
      endDate: newExperienceList[index]?.endDate || '',
      current: newExperienceList[index]?.current || false,
      [field]: value,
      // If current is set to true, clear the end date
      ...(field === 'current' && value === true ? { endDate: '' } : {})
    };
    newExperienceList[index] = updatedExperience;
    setExperienceList(newExperienceList);
  };

  // Add new experience entry
  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ]);
  };

  // Remove experience entry
  const removeExperience = (index: number) => {
    const newExperienceList = [...experienceList];
    newExperienceList.splice(index, 1);
    setExperienceList(newExperienceList);
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
      skills: formData.skills.split(", "),
      state: formData.state,
      linkedinUrl: formData.linkedinUrl,
      jobTitle: formData.jobTitle,
      experience: formData.experience,
      industry: formData.industry,
      mentorName: formData.name,
      bio: formData.bio,
      education: educationList,
      wholeExperience: experienceList,
    });
  };

  return (
    <div className="space-y-6 py-4">
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
            <div className="flex flex-col justify-center md:items-center md:flex-row md:justify-between">

            <div className="mb-6 flex justify-center">
              <ImageUpload
                userId={user.id}
                isSubmitting={isSubmitting}
                onAvatarUpdate={updateAvatar}
                initialAvatarUrl={user.avatarUrl || undefined}
              />
            </div>

            <div className="mb-6 w-full  flex justify-center">
              <BannerUpload
                userId={user.id}
                isSubmitting={isSubmitting}
                initialBannerUrl={mentor?.profileBanner || ""}
              />
            </div>
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

            {/* Bio Section */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short bio about yourself and your professional journey"
                className="min-h-[120px]"
              />
              <p className="text-xs text-gray-500">
                This bio will be displayed on your profile page to potential mentees.
              </p>
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
            <div className="space-y-4 rounded-md">
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

            {/* Education Section */}
            <div className="space-y-4 rounded-md ">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Education</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addEducation}
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Education
                </Button>
              </div>

              {educationList.map((edu, index) => (
                <div key={index} className="space-y-4 rounded-md border p-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Education #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                    <Input
                      id={`edu-institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      placeholder="University or Institution name"
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                      <Input
                        id={`edu-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        placeholder="Bachelor's, Master's, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                      <Input
                        id={`edu-field-${index}`}
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        placeholder="Computer Science, Business, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`edu-start-${index}`}>Start Year</Label>
                      <Input
                        id={`edu-start-${index}`}
                        value={edu.startYear}
                        onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                        placeholder="2010"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edu-end-${index}`}>End Year</Label>
                      <Input
                        id={`edu-end-${index}`}
                        value={edu.endYear}
                        onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                        placeholder="2014 (or Present)"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {educationList.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  No education records added. Click &quot;Add Education&quot; to add your educational background.
                </p>
              )}
            </div>

            {/* Experience Section */}
            <div className="space-y-4 rounded-md ">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Work Experience</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addExperience}
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Experience
                </Button>
              </div>

              {experienceList.map((exp, index) => (
                <div key={index} className="space-y-4 rounded-md border p-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Experience #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exp-company-${index}`}>Company</Label>
                    <Input
                      id={`exp-company-${index}`}
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exp-position-${index}`}>Position</Label>
                    <Input
                      id={`exp-position-${index}`}
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                      placeholder="Your job title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`exp-description-${index}`}>Description</Label>
                    <Textarea
                      id={`exp-description-${index}`}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                      <Input
                        id={`exp-start-${index}`}
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        placeholder="2020-01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                      <Input
                        id={`exp-end-${index}`}
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        placeholder="2023-01"
                        disabled={exp.current}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`exp-current-${index}`}
                      checked={exp.current}
                      onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`exp-current-${index}`} className="text-sm">
                      I currently work here
                    </Label>
                  </div>
                </div>
              ))}
              
              {experienceList.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  No experience records added. Click &quot;Add Experience&quot; to add your work history.
                </p>
              )}
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
                Separate each field with a comma. For example: &quot;Software
                Engineering, Data Science, Product Management&quot;
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="List your current set of skills (comma separated)"
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500">
                Separate each field with a comma. For example: &quot; Java, Sql, Nodejs&quot;
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