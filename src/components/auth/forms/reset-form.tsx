"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CardWrapper from "../card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "../../ui/button";
import { useState } from "react";
import { FormError } from "../form-error";
import { login } from "@/actions/login";
import { changePassword } from "@/actions/changePassword";
import { FormSuccess } from "../form-success";
import { forgetPassword } from "@/actions/forget-password";


const ResetForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await forgetPassword(form.getValues("email"));
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccess(res.success);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <CardWrapper
      headerLabel="Reset your password"
      title="Distance Connect"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe@email.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <FormError message={error}  />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full">
            {loading ? "Loading..." : "Reset Password"}
          </Button>

       
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;