// tabs/AccountSecurityTab.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

const AccountSecurityTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h3 className="text-lg font-medium">Account Security</h3>
        <p className="text-sm text-gray-500">
          Manage your account security and preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h4 className="font-medium">Change Password</h4>
            <p className="text-sm text-gray-500">
              Update your account password for security
            </p>
          </div>
          <Button variant="outline">
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </div>

        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline">
            Enable 2FA
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Session Management</h4>
            <p className="text-sm text-gray-500">
              View and manage your active sessions
            </p>
          </div>
          <Button variant="outline">
            View Sessions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurityTab;