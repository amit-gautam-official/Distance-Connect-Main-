"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircleIcon,
  BanknoteIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Create the schema with account number confirmation
const formSchema = z
  .object({
    accountHolderName: z.string().min(2, {
      message: "Account holder name must be at least 2 characters.",
    }),
    bankName: z.string().min(2, {
      message: "Bank name must be at least 2 characters.",
    }),
    accountNumber: z
      .string()
      .min(9, {
        message: "Account number must be at least 9 digits.",
      })
      .max(18, {
        message: "Account number must not exceed 18 digits.",
      })
      .regex(/^\d+$/, {
        message: "Account number must contain only digits.",
      }),
    confirmAccountNumber: z.string().min(9, {
      message: "Account number must be at least 9 digits.",
    }),
    ifscCode: z
      .string()
      .length(11, {
        message: "IFSC code must be exactly 11 characters.",
      })
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
        message: "IFSC code must be in valid format (e.g., HDFC0001234).",
      }),
    panNumber: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
        message: "PAN number must be in valid format (e.g., ABCDE1234F).",
      }),
    bankBranch: z
      .string()
        .min(2, {
            message: "Bank branch must be at least 2 characters.",
        })
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: "Account numbers do not match",
    path: ["confirmAccountNumber"],
  });

type BankDetailsFormValues = z.infer<typeof formSchema>;

interface PaymentBillingFormProps {
  initialData: any;
  userId: string;
}

export function PaymentBillingForm({
  initialData,
  userId,
}: PaymentBillingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  // Prepare default values with confirmAccountNumber added
  const defaultValues = initialData
    ? {
        ...initialData,
        confirmAccountNumber: initialData.accountNumber || "",
      }
    : {
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifscCode: "",
        panNumber: "",
        bankBranch: "",
      };

  const form = useForm<BankDetailsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: BankDetailsFormValues) => {
    try {
      setIsLoading(true);

      // Remove confirmAccountNumber before sending to API
      const { confirmAccountNumber, ...dataToSubmit } = values;

      // Update or create bank details
      await axios.post("/api/mentor/bank-details", {
        ...dataToSubmit,
        mentorUserId: userId,
      });

      toast.success("Bank details saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <BanknoteIcon className="h-5 w-5 text-[#3D568F]" />
        <h2 className="text-xl font-semibold text-[#3D568F]">
          Your Payment Details
        </h2>
      </div>

      <Alert className="mb-6 border-[#5580D6]/20 bg-[#5580D6]/5">
        <ShieldCheckIcon className="h-4 w-4 text-[#3D568F]" />
        <AlertTitle>Secure Information</AlertTitle>
        <AlertDescription>
          Please ensure your banking details are accurate. These details will be
          used to transfer your earnings.
          Your information is securely stored and protected.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Account Holder Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name as per Bank Account"
                      {...field}
                      className="border-input/50 focus-visible:ring-[#5580D6]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Bank Name"
                      {...field}
                      className="border-input/50 focus-visible:ring-[#5580D6]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankBranch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Branch Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Branch Name"
                      {...field}
                      className="border-input/50 focus-visible:ring-[#5580D6]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Account Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="XXXXXXXXXXXXXXXX"
                        type={showAccountNumber ? "text" : "password"}
                        {...field}
                        className="border-input/50 focus-visible:ring-[#5580D6]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-xs"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                      >
                        {showAccountNumber ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Confirm Account Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Re-enter account number"
                        type={showAccountNumber ? "text" : "password"}
                        {...field}
                        className="border-input/50 focus-visible:ring-[#5580D6]"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Please re-enter your account number to confirm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">IFSC Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="HDFC0000123"
                      {...field}
                      className="border-input/50 focus-visible:ring-[#5580D6]"
                      autoCapitalize="characters"
                      onChange={(e) => {
                        // Convert to uppercase automatically
                        field.onChange(e.target.value.toUpperCase());
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The 11-character IFSC code of your bank branch
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    PAN Number (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCDE1234F"
                      {...field}
                      className="border-input/50 focus-visible:ring-[#5580D6]"
                      autoCapitalize="characters"
                      onChange={(e) => {
                        // Convert to uppercase automatically
                        field.onChange(e.target.value.toUpperCase());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#5580D6] text-white hover:bg-[#5580D6]/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Payment Details"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
