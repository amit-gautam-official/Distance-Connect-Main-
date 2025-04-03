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

const hiringFields = [
  { label: "Python", value: "python" },
  { label: "UX/UI", value: "uxui" },
  { label: "Machine Learning", value: "machine-learning" },
  { label: "Soft Skills", value: "soft-skills" },
] as const;

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  companyName: z.string().min(2, "Current company is required"),
  companyUrl: z.string().min(2, "Company URL is required"),
  industry: z.string().min(2, "Industry is required"),
  pinCode: z.string().min(2, "Pincode is required"),
  state: z.string().min(2, "State is required"),
  role: z.string().min(2, "Role is required"),
  interestFields: z
    .array(z.string())
    .min(1, "Please select at least one hiring field"),
});

export default function StartupForm({
  user,
}: {
  user: { firstName: string; lastName: string; id: string };
}) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const router = useRouter();
  const createStudentUpdateUser =
    api.startup.createStartupUpdateUser.useMutation({
      onSuccess: () => {
        //console.log("Student created successfully")
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const checkUsernameAvailability =
    api.user.checkUsernameAvailabilityMutation.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      companyName: "",
      companyUrl: "",
      industry: "",
      pinCode: "",
      state: "",
      role: "STARTUP",
      interestFields: [],
    },
  });

  //nice
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

  function onSubmit(input: z.infer<typeof formSchema>) {
    if (usernameError) {
      return;
    }

    const role: "STARTUP" = "STARTUP";
    const startupUserData = {
      username: input.username,
      comapanyName: input.companyName,
      companyUrl: input.companyUrl,
      industry: input.industry,
      pinCode: Number(input.pinCode),
      state: input.state,
      interestFields: input.interestFields,
      role: role,
      isRegistered: true,
    };

    try {
      createStudentUpdateUser.mutate(startupUserData);
      router.push("/startup-dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  const toggleField = (field: string) => {
    setSelectedFields((current) => {
      const newFields = current.includes(field)
        ? current.filter((f) => f !== field)
        : [...current, field];

      // Defer `form.setValue` to after `setSelectedFields` completes
      setTimeout(() => {
        form.setValue("interestFields", newFields);
      });

      return newFields;
    });
  };

  const removeField = (field: string) => {
    setSelectedFields((current) => {
      const newFields = current.filter((f) => f !== field);

      // Defer `form.setValue` to after `setSelectedFields` completes
      setTimeout(() => {
        form.setValue("interestFields", newFields);
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
            <div className="mb-6">
              <ImageUpload
                userId={user.id}
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
                name="companyName"
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
                name="companyUrl"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Comapany URL
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

              <FormField
                control={form.control}
                name="interestFields"
                render={() => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Select your interest fields
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
                                      hiringFields.find(
                                        (f) => f.value === field,
                                      )?.label
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
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
