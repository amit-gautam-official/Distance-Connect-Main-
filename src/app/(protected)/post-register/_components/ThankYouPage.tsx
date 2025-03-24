"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl text-center">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Thank You!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">You have successfully joined the waitlist.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>Go to Homepage</Button>
        </CardContent>
      </Card>
    </div>
  );
}
