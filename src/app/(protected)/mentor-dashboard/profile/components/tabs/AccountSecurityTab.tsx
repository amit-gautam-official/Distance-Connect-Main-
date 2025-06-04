"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { changePassword } from "@/actions/changePassword";

const AccountSecurityTab: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await changePassword();
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
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h4 className="font-medium">Add/Change Password</h4>
            <p className="text-sm text-gray-500">
              Update your account password or add a new one (if loggedIn via Google).
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Add/Change Password
              </>
            )}
          </Button>
        </div>

        {/* Success Message */}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountSecurityTab;
