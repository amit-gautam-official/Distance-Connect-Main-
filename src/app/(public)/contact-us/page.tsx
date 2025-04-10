"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          phone,
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
      setPhone("");
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
    <div className="relative pt-[150px]">
      <div className="max-w-6x mx-auto hidden min-h-[calc(100dvh-450px)] w-[80%] justify-center px-4 py-12 lg:flex xl:flex-col">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-3xl bg-[#EEF3FF] p-6 md:p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="John"
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="border-0 bg-white placeholder:text-muted-foreground"
              />
              <Input
                type="email"
                placeholder="example@email.com"
                className="border-0 bg-white placeholder:text-muted-foreground"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <Input
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                placeholder="(123) 456 - 789"
                className="border-0 bg-white placeholder:text-muted-foreground"
              />
              <Textarea
                placeholder="Please type your message here..."
                className="min-h-[120px] border-0 bg-white placeholder:text-muted-foreground"
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                className="w-full bg-[#3B5998] text-white hover:bg-[#3B5998]/90"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 lg:px-6">
            <div className="space-y-2">
              <p className="font-inter text-[18px] font-bold uppercase leading-[20px] tracking-[1.8px] text-[var(--Neutral-Colors-Color-900,#8D8BA7)]">
                CONTACT US
              </p>
              <h2 className="font-inter text-[44px] font-bold leading-[50px] text-[#3D568F]">
                Get in touch today
              </h2>
              <p className="font-inter text-[18px] font-normal leading-[30px] text-[var(--Neutral-Colors-Text-Gray,#9795B5)]">
                Have questions or need support? We&apos;re here to help.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-center font-inter text-[18px] font-normal leading-[18px] text-[var(--Neutral-Colors-Color-900,#8D8BA7)]">
                <Mail className="h-5 w-5" />
                <span>support@distanceconnect.in</span>
              </div>
              <div className="flex items-center gap-3 text-center font-inter text-[18px] font-normal leading-[18px] text-[var(--Neutral-Colors-Color-900,#8D8BA7)]">
                <Phone className="h-5 w-5" />
                <span>+91 8750307740</span>
              </div>
              <div className="flex gap-3 font-inter text-[18px] font-normal leading-[22px] text-[var(--Neutral-Colors-Color-900,#8D8BA7)]">
                <MapPin className="h-5 w-5" />
                <span>
                  IIF, Room No: 808, 8th Floor, <br />
                  Academic Block 4, Delhi <br />
                  Technological University, <br />
                  Bhavana Road, Delhi - 110042
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 grid gap-4 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-inter text-[30px] font-normal leading-[38px] text-[#0A0A0A]">
              Join 2,000+ subscribers
            </h3>
            <p className="text-muted-foreground">
              Stay in the loop with everything you need to know.
            </p>
          </div>
          <div className="flex gap-2">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                className="shadow-xs flex items-center gap-2 self-stretch rounded-[48px] border border-[var(--Gray-300,#D0D5DD)] bg-[#3D568F] px-4 py-3 font-inter text-[16px] font-normal leading-6 text-white"
              />
              <p className="font-inter text-[14px] font-normal leading-5 text-[#0A0A0A]">
                We care about your data in our
                <a href="#" className="underline">
                  privacy policy
                </a>
              </p>
            </div>
            <Button className="shadow-xs flex items-center justify-center gap-2 rounded-full border border-[#EDFB90] bg-[#EDFB90] px-5 py-3 font-inter text-[16px] font-semibold leading-6 text-[#3D568F]">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-[100dvh] lg:hidden">
        <div>
          <img
            src="/img.jpg"
            alt="contactus"
            className="left-0 top-0 h-full w-full rotate-180 object-cover"
          />
          {/* Contact Form */}
          <div className="relative z-10 mx-auto mt-[-200px] grid w-[335px] gap-8 md:w-[500px] lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 md:p-8">
              <form className="space-y-4">
                <Input
                  type="text"
                  placeholder="John"
                  className="border-0 bg-[#EEF3FF] placeholder:text-muted-foreground"
                />
                <Input
                  type="email"
                  placeholder="example@email.com"
                  className="border-0 bg-[#EEF3FF] placeholder:text-muted-foreground"
                />
                <Input
                  type="tel"
                  placeholder="(123) 456 - 789"
                  className="border-0 bg-[#EEF3FF] placeholder:text-muted-foreground"
                />
                <Textarea
                  placeholder="Please type your message here..."
                  className="min-h-[120px] border-0 bg-[#EEF3FF] placeholder:text-muted-foreground"
                />
                <Button className="w-full bg-[#3B5998] text-white hover:bg-[#3B5998]/90">
                  Send message
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-[-100px] h-[506px] w-full flex-shrink-0 bg-[#9FBAF1]">
            <div className="flex flex-col pt-[150px] text-center">
              <div className="font-[DM Sans] text-center text-[22px] font-bold leading-[28px] text-white">
                Visit Us
              </div>
              <div className="font-[DM Sans] text-center text-[18px] font-normal leading-[30px] text-white">
                58 rohini Rd <br />
                Delhi, 110042
              </div>
            </div>
            <div className="flex flex-col pt-[60px] text-center">
              <div className="font-[DM Sans] text-center text-[22px] font-bold leading-[28px] text-white">
                Contact Us
              </div>
              <div className="font-[DM Sans] text-center text-[18px] font-normal leading-[30px] text-white">
                (123) 456 - 789 <br />
                (123) 456 - 789 <br />
                contact@company.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
