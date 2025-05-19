"use client";
import { classifyMentorTier } from "@/actions/mentor-tier-classify";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, ChevronsUpDown, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/trpc/react";

export type ExperienceEntry = {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  proofUrl?: string;
  verified?: boolean;
};

export type WholeExperience = ExperienceEntry[];

type Props = {
  wholeExperience: WholeExperience;
  mentorUserId: string;
  mentorSessionPriceRange: string | null;
  mentorTier: string | null;
  tierReasoning: string | null;
};

interface Data {
  experience: string;
  companies: string[];
  roles: string[];
}

const MentorTierPrice: React.FC<Props> = ({
  wholeExperience,
  mentorUserId,
  mentorSessionPriceRange,
  mentorTier,
  tierReasoning,
}) => {
  const [tier, setTier] = useState<
    | "Junior"
    | "Mid-Level A"
    | "Mid-Level B"
    | "Senior A"
    | "Senior B"
    | "Expert"
    | ""
  >("");
  const [recommendedPriceRange, setRecommendedPriceRange] = useState<number[]>([
    0, 0,
  ]);
  const [reason, setReason] = useState<string | null>(tierReasoning)
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [isCustomPrice, setIsCustomPrice] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const updateMentorTierMuatation = api.mentor.updateMentorTier.useMutation({
    onSuccess: () => {
      toast.success("Mentor tier updated successfully!");
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error("Error updating mentor tier and price:", error);
    },
  });

  const updateMentorPriceMutation = api.mentor.updateMentorPrice.useMutation({
    onSuccess: () => {
      toast.success("Mentor price updated successfully!");
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error("Error updating mentor price:", error);
    },
  });

  const updateMentorTierReasoningMutation =
    api.mentor.updateMentorTierReasoning.useMutation({
      onSuccess: () => {
        toast.success("Mentor tier reasoning updated successfully!");
      },
      onError: (error) => {
        // Handle error (e.g., show an error message)
        console.error("Error updating mentor tier reasoning:", error);
      },
    });

  const tierOptions = [
    "Junior",
    "Mid-Level A",
    "Mid-Level B",
    "Senior A",
    "Senior B",
    "Expert",
  ];

  const priceRangeOptions = [
    "200-500",
    "500-800",
    "800-1100",
    "1100-1300",
    "1300-1500",
    "1500+",
  ];

  function calculateTotalExperience(experiences: WholeExperience): number {
    const validExperiences = experiences.filter((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
    });

    let totalMonths = 0;
    for (const exp of validExperiences) {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += months;
    }

    return totalMonths / 12;
  }

  function prepareLLMInput(experiences: WholeExperience): Data {
    const companies = experiences.map((exp) => exp.company);
    const roles = experiences.map((exp) => exp.position);
    const totalExp = calculateTotalExperience(experiences);

    return {
      experience: `${totalExp.toFixed(1)} years`,
      companies,
      roles,
    };
  }

  const totalExperienceYears = calculateTotalExperience(wholeExperience);

  const getResult = async () => {
    try {
      setLoading(true);
      const result = await classifyMentorTier({
        data: prepareLLMInput(wholeExperience),
      });
      if (result && result.tier) {
        setTier(result.tier);
        setRecommendedPriceRange(result.recommendedPriceRange || [0, 0]);
        setReason(result.reason || "");
      }
    } catch (error) {
      console.error("Error classifying mentor tier:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!mentorTier && !mentorSessionPriceRange) {

        getResult();

    }
    setLoading(false);
  }, [wholeExperience]);

  useEffect(() => {
    if (tier && recommendedPriceRange.length === 2) {
      // Set the initial selected price based on recommended range
      const priceStr = `${recommendedPriceRange[0]}-${recommendedPriceRange[1]}`;

      // Check if the recommended price matches any of our predefined options
      const matchedOption = priceRangeOptions.find((option) => {
        if (option === "1500+") {
          if (!recommendedPriceRange[0]) {
            return true;
          }
          return recommendedPriceRange[0] >= 4000;
        } else {
          return option === priceStr;
        }
      });

      if (matchedOption) {
        setSelectedPrice(matchedOption);
        setIsCustomPrice(false);
      } else {
        setSelectedPrice("Custom");
        setCustomPrice(priceStr);
        setIsCustomPrice(true);
      }
    }
  }, [tier, recommendedPriceRange, priceRangeOptions]);

  const handleTierChange = async () => {
    // Logic to update the tier in your system
    await updateMentorTierMuatation.mutateAsync({
      mentorTier: tier || undefined,
      mentorUserId: mentorUserId,
    });
    await updateMentorTierReasoningMutation.mutateAsync({
    tierReasoning: reason!,
      mentorUserId: mentorUserId!,
    });
  };

  const handlePriceChange = async () => {
    // Logic to update the price in your system
    const finalPrice = isCustomPrice ? customPrice : selectedPrice;

    await updateMentorPriceMutation.mutateAsync({
      price: finalPrice,
      mentorUserId: mentorUserId,
    });
    await updateMentorTierReasoningMutation.mutateAsync({
      tierReasoning: reason!,
      mentorUserId: mentorUserId,
    });
  };

  const handlePriceSelection = (value: string) => {
    setSelectedPrice(value);
    setIsCustomPrice(value === "Custom");

    if (value !== "Custom") {
      // Parse the selected price range
      if (value === "4000+") {
        setRecommendedPriceRange([4000, 10000]); // Example upper limit
      } else {
        const [minStr, maxStr] = value.split("-");
        const min = Number(minStr) || 0;
        const max = Number(maxStr) || 0;

        setRecommendedPriceRange([min, max]);
      }
    }
  };

  // Function to determine badge color based on tier
  const getTierBadgeColor = (tier?: string) => {
    if (!tier) return "bg-gray-200 text-gray-700";

    switch (tier.toLowerCase()) {
      case "junior":
        return "bg-blue-100 text-blue-800";
      case "mid-level a":
      case "mid-level b":
        return "bg-green-100 text-green-800";
      case "senior a":
      case "senior b":
        return "bg-purple-100 text-purple-800";
      case "expert":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ChevronsUpDown className="h-5 w-5 text-blue-600" />
          Mentor Tier Classification
        </CardTitle>
        <CardDescription>
          Based on {totalExperienceYears.toFixed(1)} years of experience
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Your Mentor Tier
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getTierBadgeColor(
                      mentorTier ? mentorTier : tier,
                    )}
                  >
                    {mentorTier ? mentorTier : tier || "Unclassified"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price Range</p>
                <p className="font-medium">
                  {mentorSessionPriceRange
                    ? mentorSessionPriceRange
                    : `₹${recommendedPriceRange[0]} - ₹${recommendedPriceRange[1]}`}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium">Classification Reasoning</p>
              </div>
              <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                {reason}
              </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full border text-xs shadow-sm hover:shadow-md"
                >
                  Get details about the tier classification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-md overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Mentor Pricing Tiers</DialogTitle>
                  <DialogDescription>
                    Detailed information about each mentor tier and pricing
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-green-500"></span>
                      <span className="font-semibold">
                        Tier 1: Junior Mentor
                      </span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-sm">
                      <li>
                        Experience: 0–2 years total (including internships)
                      </li>
                      <li>
                        Typical Roles: Final-year students, interns, entry-level
                        developers
                      </li>
                      <li>
                        Ideal For: Students who want relatable guidance from
                        someone recently placed
                      </li>
                      <li>Price Range: ₹200 – ₹700 per session</li>
                      <li>
                        Subscription: ₹1,500/month for 4 sessions + unlimited
                        queries
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                      <span className="font-semibold">
                        Tier 2A: Mid-Level A Mentor
                      </span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-sm">
                      <li>
                        Experience: 3–6 years in service-based companies /
                        early-stage startups
                      </li>
                      <li>
                        Typical Roles: Software engineers, SDE-IIs, tech
                        contributors in stable teams
                      </li>
                      <li>
                        Ideal For: Mentees who need solid support on interviews,
                        DSA, or job prep
                      </li>
                      <li>Price Range: ₹700 – ₹1,200 per session</li>
                      <li>
                        Subscription: ₹3,000/month for 4 sessions + unlimited
                        queries
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                      <span className="font-semibold">
                        Tier 2B: Mid-Level B Mentor
                      </span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-sm">
                      <li>
                        Experience: 3–6 years in FAANG/top product/startups with
                        strong impact
                      </li>
                      <li>
                        Typical Roles: SDE-II/III at Google, Meta, Flipkart,
                        Razorpay, etc.
                      </li>
                      <li>
                        Ideal For: Serious candidates targeting product-based
                        companies or tech strategy
                      </li>
                      <li>Price Range: ₹1,200 – ₹2,000 per session</li>
                      <li>
                        Subscription: ₹4,800/month for 4 sessions + unlimited
                        queries
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                      <span className="font-semibold">
                        Tier 3A: Senior A Mentor
                      </span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-sm">
                      <li>
                        Experience: 7–15 years in non-FAANG companies
                        (service/startups)
                      </li>
                      <li>
                        Typical Roles: Team leads, senior engineers, managers
                      </li>
                      <li>
                        Ideal For: Career direction, long-term project guidance,
                        leadership tracks
                      </li>
                      <li>Price Range: ₹1,500 – ₹2,500 per session</li>
                      <li>
                        Subscription: ₹6,000/month for 4 sessions + unlimited
                        queries
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                      <span className="font-semibold">
                        Tier 3B: Senior B Mentor
                      </span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-sm">
                      <li>Experience: 7–15 years in FAANG/product companies</li>
                      <li>
                        Typical Roles: Staff+ engineers, senior tech leads,
                        architects
                      </li>
                      <li>
                        Ideal For: Deep tech mentorship, system design prep,
                        career transition
                      </li>
                      <li>Price Range: ₹2,500 – ₹4,000 per session</li>
                      <li>
                        Subscription: ₹8,000/month for 4 sessions + unlimited
                        queries
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-red-500"></span>
                      <span className="font-semibold">
                        Tier 4: Expert Mentor
                      </span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-sm">
                      <li>
                        Experience: 15+ years OR deep niche expertise (AI PhDs,
                        hiring managers, founders)
                      </li>
                      <li>
                        Typical Roles: Directors, VPs, principal engineers, ML
                        leads
                      </li>
                      <li>
                        Ideal For: Executives, PhD applicants, tech founders,
                        top 1% prep
                      </li>
                      <li>Price Range: Custom pricing (starts from ₹4,000)</li>
                      <li>Subscription: ₹12,000+/month – customizable</li>
                    </ul>
                  </div>
                </div>

                <DialogClose asChild>
                  <Button className="mt-2">Close</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="tier"
                  className="flex items-center gap-1 text-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  Modify Tier Classification
                </Label>
                <Select
                  value={mentorTier || tier}
                  onValueChange={(value) =>
                    setTier(
                      value as
                        | ""
                        | "Junior"
                        | "Mid-Level A"
                        | "Mid-Level B"
                        | "Senior A"
                        | "Senior B"
                        | "Expert",
                    )
                  }
                >
                  <SelectTrigger className="w-full focus-visible:ring-blue-500">
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="flex items-center gap-1 text-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  Modify Price Range (₹)
                </Label>
                <Select
                  value={
                    mentorSessionPriceRange
                      ? mentorSessionPriceRange
                      : selectedPrice
                  }
                  defaultValue={
                    mentorSessionPriceRange
                      ? mentorSessionPriceRange
                      : selectedPrice
                  }
                  onValueChange={handlePriceSelection}
                >
                  <SelectTrigger className="w-full focus-visible:ring-blue-500">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRangeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option === "4000+" ? "₹4000+" : `₹${option}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor="reasoning" className="flex items-center gap-1 text-xs pt-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />

                  Enter reason for changing the tier or price
                </Label> 
                <Input
                    id="reasoning"
                    value={reason ?? ''}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for changing the tier or price"
                    className="focus-visible:ring-blue-500"
                />

                {isCustomPrice && (
                  <div className="mt-2">
                    <Input
                      id="customPrice"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder="Enter custom range (e.g. 500-1000)"
                      className="focus-visible:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pb-4 pt-2">
        <Button
          variant="outline"
          className="w-1/2"
          onClick={handleTierChange}
          disabled={updateMentorTierMuatation.isPending}
        >
          Update Tier
        </Button>
        <Button
          className="w-1/2"
          onClick={handlePriceChange}
          disabled={updateMentorPriceMutation.isPending}
        >
          Update Price
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorTierPrice;
