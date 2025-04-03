"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import HighSchoolForm from "./HighSchoolForm";
import CollegeForm from "./CollegeForm";
import WorkingForm from "./WorkingForm";

export default function StudentForm({
  user,
}: {
  user: { firstName: string; lastName: string; id: string };
}) {
  const [studentRole, setStudentRole] = useState<string>("");
  const [step, setStep] = useState<number>(2);

  return (
    <div>
      {step === 2 && (
        <div className="mx-auto flex w-full flex-col items-center justify-center font-inter text-[15px] font-normal leading-[16px] text-[#8A8A8A] xl:text-[20px]">
          <h1 className="justify- flex font-inter text-[22px] font-normal leading-[36px] text-black xl:mb-12 xl:text-[32px]">
            <div>How would you like to get started?</div>
          </h1>
          <div className="mt-4 flex flex-wrap gap-y-6 xl:grid xl:grid-cols-2 xl:gap-x-16 xl:gap-y-10">
            <button
              onClick={() => {
                setStudentRole("HIGHSCHOOL");
                setStep(3);
              }}
              className="h-[40px] w-[104px] flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] focus:border-blue-400 focus:text-[#0A64BC] xl:h-[65.66px] xl:w-[233.003px]"
            >
              High School
            </button>
            <button
              onClick={() => {
                setStudentRole("COLLEGE");
                setStep(3);
              }}
              className="ml-10 h-[40px] w-[153px] flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] focus:border-blue-400 focus:text-[#0A64BC] xl:ml-0 xl:h-[65.66px] xl:w-[233.003px]"
            >
              College
            </button>
            <button
              onClick={() => {
                setStudentRole("WORKING");
                setStep(3);
              }}
              className="h-[40px] w-[188px] flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] focus:border-blue-400 focus:text-[#0A64BC] xl:h-[65.66px] xl:w-[233.003px]"
            >
              Working
            </button>
          </div>
        </div>
      )}
      {/* High ScHool Form  */}
      {studentRole === "HIGHSCHOOL" && step === 3 && (
        <div>
          <HighSchoolForm user={user} />
        </div>
      )}
      {/* College Form  */}
      {studentRole === "COLLEGE" && step === 3 && (
        <div>
          <CollegeForm user={user} />
        </div>
      )}
      {/* Working Form  */}
      {studentRole === "WORKING" && step === 3 && (
        <div>
          <WorkingForm user={user} />
        </div>
      )}
    </div>
  );
}
