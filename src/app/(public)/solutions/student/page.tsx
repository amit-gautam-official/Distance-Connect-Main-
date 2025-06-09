import React from "react";
import Hero from "../_components/Hero";
import LogoStrip from "@/app/_components/LogoStrip";
import AltHero from "../_components/AltHero";
import Link from "next/link";
import Image from "next/image";

const StudentSolutionsPage = () => {
  const sections = [
    {
      id: 1,
      title: "Unlock Your Career Potential with Distance Connect",
      headline: "Your Path to Success Starts Here",
      subheading:
        "From AI-driven career guidance to expert mentorship and interview preparation, Distance Connect equips you with everything you need to land your dream job.",
      features: [
        "Get AI-powered career recommendations tailored to your skills and goals",
        "Connect with experienced mentors for 1:1 personalized guidance",
        "Ace your job interviews with expert-led mock interview sessions",
      ],
      image: "/s1.jpg",
    },
    {
      id: 2,
      title: "AI Career Assistant – Personalized Guidance for Your Future",
      headline: "Let AI Guide You to the Right Career Path",
      subheading:
        "Distance Connect's AI-powered Career Assistant helps you explore the best opportunities based on your skills, interests, and goals.",
      features: [
        "Get AI-driven recommendations for jobs, internships, and courses",
        "Receive personalized career roadmaps tailored to your aspirations",
        "Stay updated with industry trends and required skills",
      ],
      image: "/ai.jpg",
    },
    {
      id: 3,
      title: "1:1 Mentorship – Personalized Guidance for Your Success",
      headline: "Get Direct Access to Industry Experts & Mentors",
      subheading:
        "Distance Connect offers 1:1 mentorship sessions where students can learn, get career advice, and solve doubts from professionals in their field.",
      features: [
        "Connect with experienced mentors for career guidance",
        "Get personalized advice on skills, jobs, and internships",
        "Learn industry insights to stay ahead in your career",
      ],
      image: "/int.jpg",
    },
    {
      id: 4,
      title: "Mock Interviews & Interview Preparation – Boost Your Confidence",
      headline: "Practice, Improve & Ace Your Job Interviews",
      subheading:
        "Distance Connect offers mock interviews and expert feedback to help you build confidence and perform well in real interviews.",
      features: [
        "Get real-time interview simulations with industry experts",
        "Receive constructive feedback to improve responses",
        "Learn key strategies to handle tough questions",
      ],
      image: "/men2.jpg",
    },
  ];

  return (
    <div className="min-h-[100dvh]">
      {/* Hero Section with Illustration */}
      <div className="bg-gradient-to-br from-blue-50 to-[#5580D6]/10 pt-[30px] lg:pt-[130px]">
        <div className="mx-auto flex w-[90%] max-w-7xl flex-col items-center lg:flex-row">
          <div className="mb-5 lg:mb-0 lg:w-1/2">
            <h1 className="mb-4 font-inter text-4xl font-bold leading-tight text-black lg:text-5xl">
              {sections[0]?.title}
            </h1>
            <h2 className="mb-3 font-inter text-2xl font-semibold leading-snug text-[#3D568F] lg:text-3xl">
              {sections[0]?.headline}
            </h2>
            <p className="mb-6 font-inter text-base font-normal leading-relaxed text-gray-600 lg:text-lg">
              {sections[0]?.subheading}
            </p>
            <div className="prose mb-6 ml-4">
              <ul className="font-inter text-base font-normal leading-relaxed text-gray-600 lg:text-lg">
                {sections[0]?.features.map((feature, index) => (
                  <li key={index} className="mb-2 flex items-center lg:mb-4">
                    <span className="mr-2 text-lg text-green-500 lg:text-xl">
                      ✓
                    </span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/auth/login"
              className="mb-8 flex h-10 w-[140px] flex-shrink-0 items-center justify-center gap-[10px] rounded-[30px] bg-[#5580D6] px-[18px] py-[2px] font-medium text-white shadow-lg transition-colors hover:bg-indigo-700 lg:mb-12 lg:h-12 lg:w-[160px]"
            >
              Get Started
            </Link>
          </div>

          <div className="flex justify-center lg:w-1/2">
            <img
              src={sections[0]?.image}
              alt="Career Development"
              width={500}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
        <div className="h-[50px] lg:h-[100px]"></div>
        <LogoStrip />
      </div>

      {sections.slice(1).map((section, index) => (
        <div
          key={section.id}
          className={`my-10 lg:my-24 ${
            index % 2 === 0
              ? "bg-white"
              : "bg-gradient-to-br from-indigo-50 to-purple-50"
          } rounded-lg py-8 lg:py-16`}
        >
          <div className="mx-auto flex w-[90%] max-w-7xl flex-col-reverse items-center gap-5 lg:flex-row lg:gap-10">
            <div className={`lg:w-1/2 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <h2 className="mb-3 font-inter text-2xl font-bold leading-tight text-black lg:mb-4 lg:text-3xl">
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
                href="/student-dashboard"
                className="flex h-10 w-[140px] flex-shrink-0 items-center justify-center gap-[10px] rounded-[30px] bg-[#5580D6] px-[18px] py-[2px] font-medium text-white shadow-lg transition-colors hover:bg-indigo-700 lg:h-12 lg:w-[160px]"
              >
                Learn More
              </Link>
            </div>

            <div
              className={`mb-5 flex justify-center lg:mb-0 lg:w-1/2 ${
                index % 2 === 1 ? "lg:order-1" : ""
              }`}
            >
              <Image
                src={section.image}
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

export default StudentSolutionsPage;
