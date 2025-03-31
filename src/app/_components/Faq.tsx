import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-[#3D568F]">
          Frequently Asked Questions
        </h2>

        <div className="mb-8 text-center font-inter text-[15px] leading-6 text-[#9795B5]">
          Find answers to common questions about Distance Connect
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-medium">
              What is Distance Connect and how does it work?
            </AccordionTrigger>
            <AccordionContent>
              Distance Connect is a mentorship platform that connects students
              with experienced industry professionals. Students can choose
              mentors based on their expertise, schedule one-on-one sessions,
              and receive career guidance, resume reviews, mock interviews, and
              skill development advice.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-medium">
              How do I find the right mentor for me?
            </AccordionTrigger>
            <AccordionContent>
              You can use our advanced filters to find a mentor based on domain,
              experience, industry, availability, and pricing. Simply browse
              profiles, check their expertise, and book a session that suits
              your needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-medium">
              How are mentors verified on Distance Connect?
            </AccordionTrigger>
            <AccordionContent>
              All our mentors go through a strict verification process, which
              includes checking their professional experience, LinkedIn
              profiles, and industry credibility to ensure students receive
              quality mentorship.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left font-medium">
              What is the payment process for booking a mentor?
            </AccordionTrigger>
            <AccordionContent>
              Mentors set their own prices for sessions. Students can pay
              securely through our platform using various payment methods.
              Distance Connect ensures a smooth and transparent payment process,
              with secure transactions for both students and mentors.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left font-medium">
              Who can join this platform?
            </AccordionTrigger>
            <AccordionContent>
              Distance Connect is designed primarily for students and early
              career professionals looking for mentorship and career guidance.
              If you&apos;re a student seeking industry connections, career
              advice, or skill development, our platform is perfect for you.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Faq;
