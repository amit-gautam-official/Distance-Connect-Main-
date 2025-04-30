"use client";
import { classifyMentorTier } from '@/actions/mentor-tier-classify';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
};

interface Data {
  experience: string;
  companies: string[];
  roles: string[];
}

const MentorTierPrice: React.FC<Props> = ({ wholeExperience }) => {
  const [tier, setTier] = useState<string>("");
  const [recommendedPriceRange, setRecommendedPriceRange] = useState<number[]>([0, 0]);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [isCustomPrice, setIsCustomPrice] = useState<boolean>(false);
  
  const tierOptions = [
    "Junior",
    "Mid-Level A",
    "Mid-Level B",
    "Senior A",
    "Senior B",
    "Expert",
  ];
  
  const priceRangeOptions = [
    "200-700",
    "700-1200",
    "1200-2000",
    "1500-2500",
    "2500-4000",
    "4000+",
  ];

  function calculateTotalExperience(experiences: WholeExperience): number {
    const validExperiences = experiences.filter(exp => {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
    });

    let totalMonths = 0;
    for (const exp of validExperiences) {
      const start = new Date(exp.startDate);
      const end = exp.current ? new Date() : new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += months;
    }

    return totalMonths / 12;
  }

  function prepareLLMInput(experiences: WholeExperience): Data {
    const companies = experiences.map(exp => exp.company);
    const roles = experiences.map(exp => exp.position);
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
      const result = await classifyMentorTier({ data: prepareLLMInput(wholeExperience) });
      if (result && result.tier) {
        setTier(result.tier);
        setRecommendedPriceRange(result.recommendedPriceRange || [0, 0]);
        setReason(result.reason || "");
      }
    } catch (error) {
      console.error('Error classifying mentor tier:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResult();
  }, [wholeExperience]);
  
  useEffect(() => {
    if (tier && recommendedPriceRange.length === 2) {
      // Set the initial selected price based on recommended range
      const priceStr = `${recommendedPriceRange[0]}-${recommendedPriceRange[1]}`;
      
      // Check if the recommended price matches any of our predefined options
      const matchedOption = priceRangeOptions.find(option => {
        if (option === "4000+") {
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

  const handleTierChange = () => {
    // Logic to update the tier in your system
    console.log('Tier updated to:', tier);
  };

  const handlePriceChange = () => {
    // Logic to update the price in your system
    const finalPrice = isCustomPrice ? customPrice : selectedPrice;
    console.log('Price updated to:', finalPrice);
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
    
    switch(tier.toLowerCase()) {
      case 'junior':
        return "bg-blue-100 text-blue-800";
      case 'mid-level a':
      case 'mid-level b':
        return "bg-green-100 text-green-800";
      case 'senior a':
      case 'senior b':
        return "bg-purple-100 text-purple-800";
      case 'expert':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl flex items-center gap-2">
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
                <p className="text-sm font-medium text-gray-500">Your Mentor Tier</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getTierBadgeColor(tier)}>
                    {tier || "Unclassified"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price Range</p>
                <p className="font-medium">
                  ₹{recommendedPriceRange[0]} - ₹{recommendedPriceRange[1]}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium">Classification Reasoning</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                {reason}
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tier" className="text-sm flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  Modify Tier Classification
                </Label>
                <Select
                  value={tier}
                  onValueChange={(value) => setTier(value)}
                >
                  <SelectTrigger className="w-full focus-visible:ring-blue-500">
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  Modify Price Range (₹)
                </Label>
                <Select
                  value={selectedPrice}
                  onValueChange={handlePriceSelection}
                >
                  <SelectTrigger className="w-full focus-visible:ring-blue-500">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRangeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option === "4000+" ? "₹4000+" :`₹${option}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
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
      
      <CardFooter className="flex gap-2 pt-2 pb-4">
        <Button 
          variant="outline" 
          className="w-1/2" 
          onClick={handleTierChange}
          disabled={loading}
        >
          Update Tier
        </Button>
        <Button 
          className="w-1/2 bg-blue-600 hover:bg-blue-700" 
          onClick={handlePriceChange}
          disabled={loading}
        >
          Update Price
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorTierPrice;