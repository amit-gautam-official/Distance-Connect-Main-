import React from "react";
import Hero from "../_components/Hero";
import LogoStrip from "@/app/_components/LogoStrip";
import AltHero from "../_components/AltHero";
import Link from "next/link";

const MentorSolutionsPage = () => {
  const sections = [
    {
      id: 1,
      title: "Empower Your Mentorship Journey",
      headline: "Monetize Your Expertise & Build Your Personal Brand",
      subheading:
        "Distance Connect provides a platform for mentors to share knowledge, earn through paid sessions, and grow their influence—all on their terms.",
      features: [
        "Earn an additional income by mentoring students",
        "Build a strong personal brand and industry recognition",
        "Enjoy complete flexibility to set your own schedule and pricing",
      ],
    },
    {
      id: 2,
      title: "Monetize Your Expertise with Paid Mentorship",
      headline: "Turn Your Knowledge into an Income Stream",
      subheading:
        "Distance Connect enables mentors to earn by sharing their expertise through personalized, paid sessions with students.",
      features: [
        "Set your own session prices and earn flexibly",
        "Get paid for one-on-one mentorship and career guidance",
        "Expand your professional network while helping students succeed",
      ],
    },
    {
      id: 3,
      title: "Build Your Personal Brand as a Mentor",
      headline: "Establish Yourself as an Industry Expert",
      subheading:
        "Distance Connect helps mentors grow their personal brand by connecting them with students seeking guidance in their field.",
      features: [
        "Showcase your expertise and attract more mentees",
        "Gain recognition as a thought leader in your industry",
        "Expand your influence and build credibility through mentorship",
      ],
    },
    {
      id: 4,
      title: "Mentor on Your Terms with Full Flexibility",
      headline: "Your Time, Your Rules – Mentor at Your Convenience",
      subheading:
        "Distance Connect gives mentors complete control over their availability, pricing, and session format, ensuring a seamless experience.",
      features: [
        "Set your own schedule and availability",
        "Decide your session pricing and duration",
        "Conduct mentorship sessions in a way that suits you best",
      ],
    },
  ];

  return (
    <div className="min-h-[100dvh]">
      <div className="lg:pt-[130px] pt-[50px]">
        <div className="mx-auto w-[80%]">
          <h1 className="mb-6 font-inter text-5xl font-semibold leading-[46px] text-black">
            {sections[0]?.title}
          </h1>
          <h2 className="mb-2 font-inter text-3xl font-semibold leading-[36px] text-black">
            {sections[0]?.headline}
          </h2>
          <p className="mb-8 font-inter text-[18px] font-normal leading-6 text-[#9795B5]">
            {sections[0]?.subheading}
          </p>
          <div className="prose mb-8 ml-4">
            <ul className="font-inter text-lg font-normal leading-[21px] text-[#9795B5]">
              {sections[0]?.features.map((feature, index) => (
                <li key={index} className="mb-4">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/auth/login" className="mb-12 flex h-9 w-[135px] flex-shrink-0 items-center justify-center gap-[10px] rounded-[30px] bg-[#D9D9D9] px-[18px] py-[2px]">
            Get Started
          </Link>
        </div>
        <div className="h-[100px]"></div>
        <LogoStrip />
      </div>

      {sections.slice(1).map((section, index) => (
        <div
          key={section.id}
          className={`my-24 ${index % 2 === 0 ? "" : "bg-gray-50 py-16"}`}
        >
          <div className="mx-auto w-[80%]">
            <h2 className="mb-4 font-inter text-4xl font-semibold leading-[42px] text-black">
              {section.title}
            </h2>
            <h3 className="mb-2 font-inter text-2xl font-semibold leading-[32px] text-black">
              {section.headline}
            </h3>
            <p className="mb-6 font-inter text-[16px] font-normal leading-6 text-[#9795B5]">
              {section.subheading}
            </p>
            <div className="prose mb-8 ml-4">
              <ul className="font-inter text-lg font-normal leading-[21px] text-[#9795B5]">
                {section.features.map((feature, index) => (
                  <li key={index} className="mb-4">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/mentor-dashboard" className="flex h-9 w-[135px] flex-shrink-0 items-center justify-center gap-[10px] rounded-[30px] bg-[#D9D9D9] px-[18px] py-[2px]">
              Learn More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentorSolutionsPage;
