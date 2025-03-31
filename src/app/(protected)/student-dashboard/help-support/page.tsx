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
        <h2 className="mb-4 text-xl font-semibold">Send us a Message</h2>
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
                placeholder="Username"
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
              Why is this the best nocode tool?
            </AccordionTrigger>
            <AccordionContent>
              UI artists and startup strategists widely trust our
              internationally recommended convenient and time-clear solution.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-medium">
              How to launch a Webflow website?
            </AccordionTrigger>
            <AccordionContent>
              To launch a Webflow website, you need to finalize your design,
              connect a custom domain, review for mobile responsiveness, and
              publish it through the Webflow dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-medium">
              Who founded BRix Templates?
            </AccordionTrigger>
            <AccordionContent>
              BRix Templates was founded by a team of experienced designers and
              developers who wanted to make professional web design accessible
              to everyone.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left font-medium">
              When did Webflow was founded?
            </AccordionTrigger>
            <AccordionContent>
              Webflow was founded in 2013 by Vlad Magdalin, Sergie Magdalin, and
              Bryant Chou.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left font-medium">
              Is NoCode the future of the web?
            </AccordionTrigger>
            <AccordionContent>
              NoCode is emerging as an important part of the web&apos;s future,
              democratizing web development and enabling more people to create
              digital products without traditional coding skills.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
