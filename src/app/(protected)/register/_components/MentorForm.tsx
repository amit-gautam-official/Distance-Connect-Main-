"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
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
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";

import { hiringFields } from "@/constants/hiringFirlds";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters",
  }),
  currentCompany: z.string().min(2, {
    message: "Company name is required",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title is required",
  }),
  experience: z.string().min(2, {
    message: "Experience is required",
  }),
  industry: z.string().min(2, {
    message: "Industry is required",
  }),
  pinCode: z.string().min(2, {
    message: "Pin code is required",
  }),
  state: z.string().min(2, {
    message: "State is required",
  }),
  role: z.string().min(2, {
    message: "Role is required",
  }),
  hiringFields: z.array(z.string()).min(1, {
    message: "At least one hiring field is required",
  }),
  companyType: z.string().min(2, {
    message: "Company type is required",
  }),
});

export default function MentorForm({
  user,
}: {
  user: { firstName: string; lastName: string; id: string };
}) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      currentCompany: "",
      jobTitle: "",
      experience: "",
      industry: "",
      pinCode: "",
      state: "",
      role: "MENTOR",
      companyType: "",
      hiringFields: [],
    },
  });

  const createMentorUpdateUser = api.mentor.createMentorUpdateUser.useMutation({
    onSuccess: () => {
      router.push("/mentor-dashboard");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const checkUsernameAvailability =
    api.user.checkUsernameAvailabilityMutation.useMutation();

  // Watch for username changes and validate
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "username" && value.username && value.username.length >= 3) {
        setIsCheckingUsername(true);

        const timer = setTimeout(async () => {
          try {
            // Make sure username exists and is a string before passing to the mutation
            if (value.username) {
              const result = await checkUsernameAvailability.mutateAsync({
                username: value.username,
              });

              if (!result.available) {
                setUsernameError("This username is already taken");
              } else {
                setUsernameError(null);
              }
            }
          } catch (error) {
            console.error("Error checking username:", error);
          } finally {
            setIsCheckingUsername(false);
          }
        }, 1000);

        return () => clearTimeout(timer);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (usernameError) {
      return;
    }

    const role: "MENTOR" = "MENTOR";

    const mentorUserData = {
      username: values.username,
      name: values?.firstName + " " + values?.lastName,
      currentCompany: values?.currentCompany,
      jobTitle: values?.jobTitle,
      experience: values?.experience,
      industry: values?.industry,
      pinCode: Number(values?.pinCode),
      state: values?.state,
      role: role,
      hiringFields: selectedFields,
      isRegistered: true,
      companyType: values?.companyType,
    };

    try {
      createMentorUpdateUser.mutate(mentorUserData);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to create mentor profile");
    }
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
        <CardTitle className="text-center font-inter text-2xl font-medium leading-tight text-black sm:text-left sm:text-[28px] sm:leading-[36px] md:text-[32px]">
          Give your Brief Introduction
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6"
          >
            <div className="mb-4 flex  items-center md:justify-center sm:mb-6 justify-start">
              <ImageUpload
                userId={user?.id}
                isSubmitting={form.formState.isSubmitting}
              />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                    Username
                  </FormLabel>
                  <FormControl className="floating-input peer w-full">
                    <Input placeholder={""} type="text" {...field} required />
                  </FormControl>
                  {isCheckingUsername && (
                    <p className="text-sm text-gray-500">
                      Checking username...
                    </p>
                  )}
                  {usernameError && (
                    <p className="text-sm text-red-500">{usernameError}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        <SelectItem value="0-2">
                          0-2 years (Entry-Level)
                        </SelectItem>
                        <SelectItem value="3-5">
                          3-5 years (Mid-Level)
                        </SelectItem>
                        <SelectItem value="6-10">
                          6-10 years (Senior-Level)
                        </SelectItem>
                        <SelectItem value="10+">
                          10+ years (Expert / Executive)
                        </SelectItem>
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
                        <SelectItem value="Software Development">
                          Software Development
                        </SelectItem>
                        <SelectItem value="Artificial Intelligence / Machine Learning">
                          Artificial Intelligence / Machine Learning
                        </SelectItem>
                        <SelectItem value="Data Science & Analytics">
                          Data Science & Analytics
                        </SelectItem>
                        <SelectItem value="Cloud Computing & DevOps">
                          Cloud Computing & DevOps{" "}
                        </SelectItem>
                        <SelectItem value="Cybersecurity">
                          Cybersecurity
                        </SelectItem>
                        <SelectItem value="Blockchain & Web3">
                          Blockchain & Web3
                        </SelectItem>
                        <SelectItem value="IoT & Embedded Systems">
                          IoT & Embedded Systems
                        </SelectItem>
                        <SelectItem value="UI/UX Design">
                          UI/UX Design
                        </SelectItem>
                        <SelectItem value="Product Management">
                          Product Management
                        </SelectItem>
                        <SelectItem value="Digital Marketing">
                          Digital Marketing
                        </SelectItem>
                        <SelectItem value="Finance & Investment Banking">
                          Finance & Investment Banking
                        </SelectItem>
                        <SelectItem value="Consulting & Strategy">
                          Consulting & Strategy
                        </SelectItem>
                        <SelectItem value="Mechanical & Automotive Engineering">
                          Mechanical & Automotive Engineering
                        </SelectItem>
                        <SelectItem value="Civil & Construction Engineering">
                          Civil & Construction Engineering
                        </SelectItem>
                        <SelectItem value="Electrical & Electronics Engineering">
                          Electrical & Electronics Engineering
                        </SelectItem>
                        <SelectItem value="Biomedical & Healthcare Technology">
                          Biomedical & Healthcare Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Company Type
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
                        <SelectItem value="FAANG">
                          FAANG (Facebook, Apple, Amazon, Netflix, Google)
                        </SelectItem>
                        <SelectItem value="Top Tech Companies">
                          Top Tech Companies (Microsoft, Tesla, Adobe, IBM,
                          Oracle, etc.)
                        </SelectItem>
                        <SelectItem value="Unicorn Startups">
                          Unicorn Startups (Byju&apos;s, Paytm, Zomato, etc.)
                        </SelectItem>
                        <SelectItem value="Consulting Firms">
                          Consulting Firms (McKinsey, BCG, Bain, etc.)
                        </SelectItem>
                        <SelectItem value="Investment Banks & Financial Institutions">
                          Investment Banks & Financial Institutions
                        </SelectItem>
                        <SelectItem value="Indian Startups & SMEs">
                          Indian Startups & SMEs
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentCompany"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Company Name
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
                      Job Role / Designation
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
                        <SelectItem value="Software Engineer / Developer">
                          Software Engineer / Developer
                        </SelectItem>
                        <SelectItem value="Data Scientist / Data Analyst">
                          Data Scientist / Data Analyst
                        </SelectItem>
                        <SelectItem value="Machine Learning Engineer">
                          Machine Learning Engineer
                        </SelectItem>
                        <SelectItem value="Cloud Engineer / DevOps Engineer">
                          Cloud Engineer / DevOps Engineer
                        </SelectItem>
                        <SelectItem value="Cybersecurity Analyst">
                          Cybersecurity Analyst
                        </SelectItem>
                        <SelectItem value="UI/UX Designer">
                          UI/UX Designer
                        </SelectItem>
                        <SelectItem value="Product Manager">
                          Product Manager
                        </SelectItem>
                        <SelectItem value="Digital Marketing Specialist">
                          Digital Marketing Specialist
                        </SelectItem>
                        <SelectItem value="Financial Analyst">
                          Financial Analyst
                        </SelectItem>
                        <SelectItem value="Management Consultant">
                          Management Consultant
                        </SelectItem>
                        <SelectItem value="Mechanical Engineer">
                          Mechanical Engineer
                        </SelectItem>
                        <SelectItem value="Electrical Engineer">
                          Electrical Engineer
                        </SelectItem>
                        <SelectItem value="Business Analyst">
                          Business Analyst
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.value === "other" && (
                      <FormControl className="mt-2">
                        <Input placeholder="Please specify" />
                      </FormControl>
                    )}
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
                        <SelectItem value="andaman-nicobar-islands">
                          Andaman and Nicobar Islands
                        </SelectItem>
                        <SelectItem value="andhra-pradesh">
                          Andhra Pradesh
                        </SelectItem>
                        <SelectItem value="arunachal-pradesh">
                          Arunachal Pradesh
                        </SelectItem>
                        <SelectItem value="assam">Assam</SelectItem>
                        <SelectItem value="bihar">Bihar</SelectItem>
                        <SelectItem value="chandigarh">Chandigarh</SelectItem>
                        <SelectItem value="chhattisgarh">
                          Chhattisgarh
                        </SelectItem>
                        <SelectItem value="dadra-nagar-haveli-daman-diu">
                          Dadra and Nagar Haveli and Daman and Diu
                        </SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="goa">Goa</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="himachal-pradesh">
                          Himachal Pradesh
                        </SelectItem>
                        <SelectItem value="jammu-kashmir">
                          Jammu and Kashmir
                        </SelectItem>
                        <SelectItem value="jharkhand">Jharkhand</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                        <SelectItem value="ladakh">Ladakh</SelectItem>
                        <SelectItem value="lakshadweep">Lakshadweep</SelectItem>
                        <SelectItem value="madhya-pradesh">
                          Madhya Pradesh
                        </SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="manipur">Manipur</SelectItem>
                        <SelectItem value="meghalaya">Meghalaya</SelectItem>
                        <SelectItem value="mizoram">Mizoram</SelectItem>
                        <SelectItem value="nagaland">Nagaland</SelectItem>
                        <SelectItem value="odisha">Odisha</SelectItem>
                        <SelectItem value="puducherry">Puducherry</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="sikkim">Sikkim</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                        <SelectItem value="tripura">Tripura</SelectItem>
                        <SelectItem value="uttar-pradesh">
                          Uttar Pradesh
                        </SelectItem>
                        <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                        <SelectItem value="west-bengal">West Bengal</SelectItem>
                      </SelectContent>
                    </Select>
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
