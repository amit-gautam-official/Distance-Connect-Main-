"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import CardWrapper from "./auth/card-wrapper";
import { FormSuccess } from "./auth/form-success";
import { FormError } from "./auth/form-error";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePasswordToken } from "@/actions/change-password-token-verificationt";

const ChangePasswordForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const validatePassword = (password: string): string | undefined => {
    const minLength = 8;
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!password) return "Password is required.";
    if (password.length < minLength)
      return `Password must be at least ${minLength} characters long.`;
    if (!strongRegex.test(password))
      return "Password must include uppercase, lowercase, number, and special character.";

    return undefined;
  };

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(undefined);
    setSuccess(undefined);

    try {
      const res = await changePasswordToken({ token, newPassword: password });

      if (res.success) {
        setSuccess(res.success);
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }, [token, password]);

  return (
    <CardWrapper
      headerLabel="Change your password"
      title="Reset Password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Dashboard"
    >
     <div className="space-y-4">
  <Input
    type="password"
    placeholder="Enter new password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    disabled={submitting || !!success}
  />

  {/* Password requirements */}
  <p className="text-sm text-muted-foreground">
    Password must be at least 8 characters long and include:
    <br />• One uppercase letter
    <br />• One lowercase letter
    <br />• One number
    <br />• One special character
  </p>

  <Button
    onClick={onSubmit}
    disabled={submitting || !!success}
    className="w-full"
  >
    {submitting ? "Submitting..." : "Change Password"}
  </Button>

  <FormSuccess message={success} />
  {!success && <FormError message={error} />}
</div>
    </CardWrapper>
  );
};

export default ChangePasswordForm;
