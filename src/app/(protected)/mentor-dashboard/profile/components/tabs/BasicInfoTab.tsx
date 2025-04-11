// tabs/BasicInfoTab.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUpload } from "@/app/(protected)/register/_components/ImageUpload";
import { BannerUpload } from "@/app/(protected)/register/_components/BannerUpload";
import CompanyEmail from "../CompanyEmail";
import { User as PrismaUser, Mentor } from "@prisma/client";
import { CompanyType } from "../types";

interface BasicInfoTabProps {
  formData: {
    name: string;
    location: string;
    linkedinUrl: string;
    currentCompany: string;
    pinCode: string;
    state: string;
    bio: string;
    jobTitle: string;
    experience: string;
    industry: string;
  };
  companyType: CompanyType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCompanyTypeChange: (value: string) => void;
  user: PrismaUser;
  mentor: Mentor;
  updateAvatar: (url: string) => void;
  isSubmitting: boolean;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  formData,
  companyType,
  handleChange,
  handleCompanyTypeChange,
  user,
  mentor,
  updateAvatar,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6 w-full">
      <div className="flex w-full  flex-col justify-center md:items-center md:flex-row md:justify-between">
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

      <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default BasicInfoTab;