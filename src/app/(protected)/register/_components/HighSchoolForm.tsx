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

import { hiringFields } from "@/constants/hiringFirlds";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  institutionName: z.string().min(2, "Current company is required"),
  pinCode: z.string().min(2, "Pincode is required"),
  state: z.string().min(2, "State is required"),
  role: z.string().min(2, "Role is required"),
  interstFields: z
    .array(z.string())
    .min(1, "Please select at least one hiring field"),
});

export default function HighSchoolForm({
  user,
}: {
  user: { firstName: string; lastName: string };
}) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const router = useRouter();
  const createStudentUpdateUser =
    api.student.createStudentUpdateUser.useMutation({
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
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      institutionName: "",
      pinCode: "",
      state: "",
      role: "STUDENT",
      interstFields: [],
    },
  });

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
        }, 500);

        return () => clearTimeout(timer);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function onSubmit(input: z.infer<typeof formSchema>) {
    if (usernameError) {
      return;
    }

    const role: "STUDENT" = "STUDENT";
    const studentRole: "HIGHSCHOOL" = "HIGHSCHOOL";
    const studentUserData = {
      username: input.username,
      studentRole: studentRole,
      institutionName: input.institutionName,
      pinCode: Number(input.pinCode),
      state: input.state,
      interestFields: input.interstFields,
      companyName: "",
      jobTitle: "",
      experience: "",
      industry: "",
      courseSpecialization: "",
      role: role,
      isRegistered: true,
      avatarUrl: "",
      name: input.firstName + " " + input.lastName,
    };

    //console.log(studentUserData)
    try {
      createStudentUpdateUser.mutate(studentUserData);
      // router.push("/student-dashboard");
      router.push("/post-register");
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
        form.setValue("interstFields", newFields);
      });

      return newFields;
    });
  };

  const removeField = (field: string) => {
    setSelectedFields((current) => {
      const newFields = current.filter((f) => f !== field);

      // Defer `form.setValue` to after `setSelectedFields` completes
      setTimeout(() => {
        form.setValue("interstFields", newFields);
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
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="institutionName"
                render={({ field }) => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Institution Name
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
                name="interstFields"
                render={() => (
                  <FormItem className="relative flex flex-col">
                    <FormLabel className="absolute left-[10px] top-[0px] bg-white px-1 font-inter text-[14px] font-normal leading-[16px] text-[#8A8A8A] peer-focus:text-black">
                      Select your Interest fields
                    </FormLabel>
                    <FormControl className="floating-input peer w-[300px] text-[#8A8A8A]">
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
