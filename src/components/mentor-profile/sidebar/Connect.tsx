import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
interface ConnectProps {
  mentorName: string;
  mentorUserId: string;
}


export async function Connect({ mentorName , mentorUserId}: ConnectProps) {
  const session =  await auth0.getSession();
  return (
    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">
        Connect with {mentorName}
      </h3>
      <p className="mb-4 text-gray-600">
        Get personalized guidance and mentorship to accelerate your career
        growth.
      </p>
      <div className="space-y-3">
        <Link href="#offerings" className="block mb-2 w-full">
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Schedule a Call
          </Button>
        </Link>
        <Link
          href={session?.user?.email ? `/chat?mentorId=${mentorUserId}` : "/auth/login"}
              >
        <Button
          variant="outline"
          className="w-full  border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Send a Message
        </Button>

              </Link>
      </div>
    </div>
  );
}
