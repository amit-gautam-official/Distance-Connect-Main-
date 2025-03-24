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

export default function HelpSupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ name, email, message });
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Hi, how can we help you today?
        </h1>
        <div className="mx-auto max-w-xl">
          <Input
            type="search"
            placeholder="Search our articles"
            className="w-full rounded-full"
          />
        </div>
      </div>

      {/* Card Section */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                <path d="M7 21h10" />
                <path d="M12 3v6" />
              </svg>
            </div>
            <h3 className="mb-2 font-bold">Getting Started</h3>
            <p className="text-sm text-gray-500">
              Start off right by learning the basics
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 font-bold">Live Chat Support</h3>
            <p className="text-sm text-gray-500">
              Get help in real-time from our support agents
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <h3 className="mb-2 font-bold">Report Bugs</h3>
            <p className="text-sm text-gray-500">
              Found an issue? Help us improve by reporting a bug report
            </p>
          </CardContent>
        </Card>
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
              NoCode is emerging as an important part of the web's future,
              democratizing web development and enabling more people to create
              digital products without traditional coding skills.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Contact Form Section */}
      <div className="mx-auto max-w-3xl rounded-lg bg-yellow-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Send us a Message</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Textarea
                placeholder="Describe..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-32 w-full"
              />
            </div>
            <div>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Send Message
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
