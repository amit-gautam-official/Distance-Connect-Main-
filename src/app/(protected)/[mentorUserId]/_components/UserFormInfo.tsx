import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

interface UserFormInfoProps {
  setUserName: (value: string) => void;
  setUserEmail: (value: string) => void;
  setUserNote: (value: string) => void;
}

function UserFormInfo({
  setUserName,
  setUserEmail,
  setUserNote,
}: UserFormInfoProps) {
  const [emailError, setEmailError] = useState<string>("");
  const [emailTouched, setEmailTouched] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required");
      setUserEmail("");
      return;
    }

    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
      setUserEmail("");
      return;
    }

    const isGmail = email.toLowerCase().endsWith("@gmail.com");

    if (!isGmail) {
      setEmailError("Google Meet requires a Gmail address");
      setUserEmail("");
    } else {
      setEmailError("");
      setUserEmail(email);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!emailTouched) {
      setEmailTouched(true);
    }

    // For a better user experience, only validate complete emails
    if (emailTouched && (value.includes("@") || value === "")) {
      validateEmail(value);
    } else if (value) {
      // Store the value temporarily but don't show errors yet
      setUserEmail(value);
    }
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setEmailTouched(true);
    validateEmail(e.target.value);
  };

  return (
    <div className="w-full p-3 sm:p-4 md:p-6">
      <h2 className="mb-4 text-xl font-bold">Enter Your Details</h2>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Your Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            onChange={(event) => setUserName(event.target.value)}
            className="h-12 w-full rounded-md border-gray-300 px-4 py-2 shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
            required
            autoComplete="name"
            aria-required="true"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email for Google Meet <span className="text-red-500">*</span>
            <span className="ml-1 text-xs text-gray-500">
              (must be a Gmail address)
            </span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="username@gmail.com"
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className={`h-12 w-full rounded-md px-4 py-2 shadow-sm transition-colors focus:ring-2 focus:ring-primary ${
              emailTouched && emailError
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            required
            autoComplete="email"
            aria-required="true"
            inputMode="email"
            aria-invalid={!!(emailTouched && emailError)}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailTouched && emailError && (
            <p
              id="email-error"
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
              {emailError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Notes
          </label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Share any information or questions for the meeting"
            onChange={(event) => setUserNote(event.target.value)}
            className="min-h-[120px] w-full rounded-md border-gray-300 p-4 shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>
      </form>
    </div>
  );
}

export default UserFormInfo;
