import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  return (
    <div className="py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="mb-4 text-center text-xl font-bold text-[#3D568F] sm:mb-6 sm:text-2xl">
          Frequently Asked Questions
        </h2>

        <div className="mb-6 text-center font-inter text-sm leading-5 text-[#9795B5] sm:mb-8 sm:text-[15px] sm:leading-6">
          Find answers to common questions about Distance Connect
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
              What is Distance Connect and how does it work?
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base">
              Distance Connect is a mentorship platform that connects students
              with experienced industry professionals. Students can choose
              mentors based on their expertise, schedule one-on-one sessions,
              and receive career guidance, resume reviews, mock interviews, and
              skill development advice.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
              How do I find the right mentor for me?
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base">
              You can use our advanced filters to find a mentor based on domain,
              experience, industry, availability, and pricing. Simply browse
              profiles, check their expertise, and book a session that suits
              your needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
              How are mentors verified on Distance Connect?
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base">
              All our mentors go through a strict verification process, which
              includes checking their professional experience, LinkedIn
              profiles, and industry credibility to ensure students receive
              quality mentorship.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
              What is the payment process for booking a mentor?
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base">
              Mentors set their own prices for sessions. Students can pay
              securely through our platform using various payment methods.
              Distance Connect ensures a smooth and transparent payment process,
              with secure transactions for both students and mentors.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
              Who can join this platform?
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base">
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
