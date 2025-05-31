// tabs/AccountSecurityTab.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

const AccountSecurityTab: React.FC = () => {
  return (
    <div className="space-y-6">


      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h4 className="font-medium">Change Password</h4>
            <p className="text-sm text-gray-500">
              Update your account password for security
            </p>
          </div>
          <Button type="button" variant="outline">
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </div>


      </div>
    </div>
  );
};

export default AccountSecurityTab;