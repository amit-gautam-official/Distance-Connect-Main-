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

const hiringFields = [
  { label: "Python", value: "python" },
  { label: "UX/UI", value: "uxui" },
  { label: "Machine Learning", value: "machine-learning" },
  { label: "Soft Skills", value: "soft-skills" },
] as const;

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  currentCompany: z.string().min(2, "Current company is required"),
  jobTitle: z.string().min(2, "Position title is required"),
  experience: z.string().min(2, "Industry experience is required"),
  industry: z.string().min(2, "Industry is required"),
  pinCode: z.string().min(2, "Pincode is required"),
  state: z.string().min(2, "State is required"),
  role: z.string().min(2, "Role is required"),
  hiringFields: z
    .array(z.string())
    .min(1, "Please select at least one hiring field"),
});

export default function MentorForm({
  user,
}: {
  user: { firstName: string; lastName: string };
}) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      currentCompany: "",
      jobTitle: "",
      experience: "",
      industry: "",
      pinCode: "",
      state: "",
      role: "",
      hiringFields: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    //console.log("submittingg")
    //console.log(values)
  }

  const toggleField = (field: string) => {
    setSelectedFields((current) => {
      const newFields = current.includes(field)
        ? current.filter((f) => f !== field)
        : [...current, field];

      // Defer `form.setValue` to after `setSelectedFields` completes
      setTimeout(() => {
        form.setValue("hiringFields", newFields);
      });

      return newFields;
    });
  };

  const removeField = (field: string) => {
    setSelectedFields((current) => {
      const newFields = current.filter((f) => f !== field);

      // Defer `form.setValue` to after `setSelectedFields` completes
      setTimeout(() => {
        form.setValue("hiringFields", newFields);
      });

      return newFields;
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-inter text-[32px] font-medium leading-[36px] text-black">
          Give your Brief Introduction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Previous form fields remain unchanged */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      First Name
                    </FormLabel>
                    <FormControl className="floating-input peer w-[300px]">
                      <Input placeholder={""} type="text" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Last Name
                    </FormLabel>
                    <FormControl className="floating-input peer w-[300px]">
                      <Input placeholder={""} type="text" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="currentCompany"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Current Company
                    </FormLabel>
                    <FormControl className="floating-input peer w-[300px]">
                      <Input placeholder={""} type="text" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Job Title
                    </FormLabel>
                    <FormControl className="floating-input peer w-[300px] text-[#8A8A8A]">
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Experience
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="floating-input peer w-[300px] text-[#8A8A8A]">
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="4-6">4-6 years</SelectItem>
                        <SelectItem value="7-10">7-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Industry
                    </FormLabel>
                    <FormControl className="floating-input peer w-[300px] text-[#8A8A8A]">
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pinCode"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Pin Code
                    </FormLabel>
                    <FormControl className="floating-input peer w-[300px] text-[#8A8A8A]">
                      <Input
                        className="remove"
                        type="number"
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      State
                    </FormLabel>
                    <FormControl className="floating-input peer w-[300px] text-[#8A8A8A]">
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="hiringFields"
              render={() => (
                <FormItem className="relative flex flex-col">
                  <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                    Select your hiring fields
                  </FormLabel>
                  <FormControl className="floating-input peer w-[110%] text-[#8A8A8A]">
                    <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={`h-auto min-h-[2.5rem] w-full justify-start ${
                            selectedFields.length > 0 ? "h-auto" : ""
                          }`}
                        >
                          {selectedFields.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedFields.map((field) => (
                                <Badge
                                  key={field}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {
                                    hiringFields.find((f) => f.value === field)
                                      ?.label
                                  }
                                  {/* <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent interaction with the Popover
                                    removeField(field); // Remove the field
                                  }}
                                /> */}
                                  <div
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent interaction with the Popover
                                      removeField(field); // Remove the field
                                    }}
                                  >
                                    X
                                  </div>
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search fields..." />
                          <CommandList>
                            <CommandEmpty>No fields found.</CommandEmpty>
                            <CommandGroup>
                              {hiringFields.map((field) => (
                                <CommandItem
                                  key={field.value}
                                  onSelect={() => {
                                    toggleField(field.value);
                                    setCommandOpen(false);
                                  }}
                                >
                                  {field.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
