"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function HelpSupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Send data to our API endpoint
      const response = await fetch("/api/send-support-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          username,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send support request");
      }

      // Success message
      toast.success("Your support request has been submitted successfully.");

      // Reset form
      setName("");
      setEmail("");
      setUsername("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting support request:", error);
      toast.error(
        "Failed to send your support request. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Contact Form Section */}
      <div className="mx-auto mb-12 max-w-3xl rounded-lg bg-yellow-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Create a Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Mentor Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Describe..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-32 w-full"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-bold">FAQ</h2>
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
    <AccordionItem value="item-1">
      <AccordionTrigger className="text-left font-medium">
        How do I pay for a mentorship session on Distance Connect?
      </AccordionTrigger>
      <AccordionContent>
        You can easily pay using UPI, Debit/Credit Cards, Net Banking, or Wallets while booking a session. Just select your preferred payment method at checkout.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger className="text-left font-medium">
        Will I get an invoice or payment receipt after booking a session?
      </AccordionTrigger>
      <AccordionContent>
        Yes, once your payment is successful, you’ll automatically receive an invoice & payment receipt on your registered email.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger className="text-left font-medium">
        What happens if my payment fails but the amount is deducted?
      </AccordionTrigger>
      <AccordionContent>
        Don&apos;t worry! In case of any failed payment, the deducted amount (if any) will be automatically refunded by your bank within 5-7 working days.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-4">
      <AccordionTrigger className="text-left font-medium">
        Are there any hidden charges apart from the mentor&apos;s session price?
      </AccordionTrigger>
      <AccordionContent>
        Absolutely not! The final amount shown during checkout is all you need to pay. No hidden or extra charges.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-5">
      <AccordionTrigger className="text-left font-medium">
        How does Distance Connect handle refunds or cancellations?
      </AccordionTrigger>
      <AccordionContent>
        Refunds are only applicable if the mentor cancels the session or doesn’t show up. In such cases, your full amount will be refunded within 5-7 working days.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
      </div>
    </div>
  );
}
