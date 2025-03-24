"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import HighSchoolForm from "./HighSchoolForm"
import CollegeForm from "./CollegeForm"
import WorkingForm from "./WorkingForm"


export default function StudentForm({user} : {user : {firstName : string, lastName : string}}) {
  const [studentRole, setStudentRole] = useState<string>("")
  const [step, setStep] = useState<number>(2)

  

  return (
    <div>
        {step === 2 &&<div className="mx-auto w-full   flex justify-center items-center flex-col  text-[#8A8A8A] font-inter text-[15px] xl:text-[20px] font-normal leading-[16px]">
        <h1 className="text-black xl:mb-12  flex justify- font-inter text-[22px] xl:text-[32px] font-normal leading-[36px] ">
            <div>How would you like to get started?</div>
        </h1>
        <div className="xl:grid xl:grid-cols-2  xl:gap-x-16 xl:gap-y-10 flex flex-wrap gap-y-6   mt-4">
            <button onClick={()=> {
              setStudentRole("HIGHSCHOOL")
              setStep(3)
              }} className="focus:border-blue-400 focus:text-[#0A64BC] xl:w-[233.003px] xl:h-[65.66px] w-[104px] h-[40px] flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)]">High School</button>
            <button onClick={()=> {
              setStudentRole("COLLEGE")
              setStep(3)
              }} className=" focus:text-[#0A64BC] focus:border-blue-400 xl:w-[233.003px] ml-10 xl:ml-0 xl:h-[65.66px] w-[153px] h-[40px]  flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)]">College</button>
            <button onClick={()=> {
              setStudentRole("WORKING")
              setStep(3)
            }} className=" focus:text-[#0A64BC] focus:border-blue-400 xl:w-[233.003px] xl:h-[65.66px] w-[188px] h-[40px]  flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)]">Working</button>
        </div>
        </div>}
      {/* High ScHool Form  */}
      {studentRole === "HIGHSCHOOL" && step === 3 && <div>
        <HighSchoolForm user={user}/>
        </div>}
        {/* College Form  */}
        {studentRole === "COLLEGE" && step === 3 && <div>
            <CollegeForm user={user}/>
        </div>}
        {/* Working Form  */}
        {studentRole === "WORKING" && step === 3 && <div>
            <WorkingForm user={user}/>
        </div>}
    </div>
  )
}

