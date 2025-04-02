import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TRPCClientError } from "@trpc/client";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error);
  }, [error]);

  // Handle unauthorized errors
  if (
    error.message.includes("UNAUTHORIZED") ||
    error.message.includes("You must be logged in") ||
    error.message.includes("Authentication required")
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mb-6 text-center text-gray-600">
          You must be logged in to access this page.
        </p>
        <button
          onClick={() => router.push("/api/auth/login")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-2xl font-bold text-red-600">
        Something went wrong!
      </h2>
      <p className="mb-6 text-center text-gray-600">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
