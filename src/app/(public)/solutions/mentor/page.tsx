"use client";
import React from "react";
import Hero from "../_components/Hero";
import LogoStrip from "@/app/_components/LogoStrip";
import AltHero from "../_components/AltHero";
import Link from "next/link";
import Image from "next/image";

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
      image: "/bg10.png",
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
      image: "/bg9.png",
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
      image: "/personalBrand.jpg",
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
      image: "/time.webp",
    },
  ];

  return (
    <div className="min-h-[100dvh]">
      {/* Hero Section with Illustration */}
      <div className="bg-gradient-to-br from-blue-50 to-[#5580D6]/10 pt-[30px] lg:pt-[130px]">
        <div className="mx-auto flex w-[90%] max-w-7xl flex-col items-center lg:flex-row">
          <div className="mb-5 lg:mb-0 lg:w-1/2">
            <h1 className="mb-6 font-inter text-4xl font-bold leading-tight text-black lg:text-5xl">
              {sections[0]?.title}
            </h1>
            <h2 className="mb-4 font-inter text-2xl font-semibold leading-snug text-[#3D568F] lg:text-3xl">
              {sections[0]?.headline}
            </h2>
            <p className="mb-8 font-inter text-lg font-normal leading-relaxed text-gray-600">
              {sections[0]?.subheading}
            </p>
            <div className="prose mb-8 ml-4">
              <ul className="font-inter text-lg font-normal leading-relaxed text-gray-600">
                {sections[0]?.features.map((feature, index) => (
                  <li key={index} className="mb-4 flex items-center">
                    <span className="mr-2 text-xl text-green-500">✓</span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/auth/login"
              className="mb-12 flex h-12 w-[160px] flex-shrink-0 items-center justify-center gap-[10px] rounded-[30px] bg-[#5580D6] px-[18px] py-[2px] font-medium text-white shadow-lg transition-colors hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>

          <div className="flex justify-center lg:w-1/2">
            <Image
              src={sections[0]?.image || "/images/illustrations/default.svg"}
              alt="Mentor Journey"
              width={500}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="h-[50px] lg:h-[100px]"></div>
        <LogoStrip />
      </div>

      {sections.slice(1).map((section, index) => (
        <div
          key={section.id}
          className={`my-10 lg:my-24 ${index % 2 === 0 ? "bg-white" : "bg-gradient-to-br from-indigo-50 to-purple-50"} rounded-lg py-8 lg:py-16`}
        >
          <div className="mx-auto flex w-[90%] max-w-7xl flex-col-reverse items-center gap-5 lg:flex-row lg:gap-10">
            <div className={`lg:w-1/2 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <h2 className="mb-3 font-inter text-2xl font-bold leading-tight text-black lg:mb-4 lg:text-3xl lg:text-4xl">
                {section.title}
              </h2>
              <h3 className="mb-2 font-inter text-xl font-semibold leading-snug text-[#3D568F] lg:mb-3 lg:text-2xl">
                {section.headline}
              </h3>
              <p className="mb-4 font-inter text-base font-normal leading-relaxed text-gray-600 lg:mb-6 lg:text-lg">
                {section.subheading}
              </p>
              <div className="prose mb-5 ml-4 lg:mb-8">
                <ul className="font-inter text-base font-normal leading-relaxed text-gray-600 lg:text-lg">
                  {section.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="mb-2 flex items-center lg:mb-4"
                    >
                      <span className="mr-2 text-lg text-green-500 lg:text-xl">
                        ✓
                      </span>{" "}
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/mentor-dashboard"
                className="flex h-10 w-[140px] flex-shrink-0 items-center justify-center gap-[10px] rounded-[30px] bg-[#5580D6] px-[18px] py-[2px] font-medium text-white shadow-lg transition-colors hover:bg-indigo-700 lg:h-12 lg:w-[160px]"
              >
                Learn More
              </Link>
            </div>

            <div
              className={`mb-5 flex justify-center lg:mb-0 lg:w-1/2 ${index % 2 === 1 ? "lg:order-1" : ""}`}
            >
              <Image
                src={section.image || "/images/illustrations/default.svg"}
                alt={section.title}
                width={450}
                height={350}
                className="h-auto max-w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentorSolutionsPage;
