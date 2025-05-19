import React from "react";
import Hero from "../_components/Hero";
import LogoStrip from "@/app/_components/LogoStrip";
import AltHero from "../_components/AltHero";

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
    },
  ];

  return (
    <div className="min-h-screen">
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
          <button className="mb-12 flex h-9 w-[135px] flex-shrink-0 items-center justify-center gap-[10px] rounded-[30px] bg-[#D9D9D9] px-[18px] py-[2px]">
            Get Started
          </button>
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
            <button className="flex h-9 w-[135px] flex-shrink-0 items-center justify-center gap-[10px] rounded-[30px] bg-[#D9D9D9] px-[18px] py-[2px]">
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentSolutionsPage;
