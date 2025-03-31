import React from "react";
import Hero from "../_components/Hero";
import LogoStrip from "@/app/_components/LogoStrip";
import AltHero from "../_components/AltHero";

const StartupSolutionsPage = () => {
  const sections = [
    {
      id: 1,
      title: "Find the Right Talent to Scale Your Startup",
      headline: "Connect with Skilled Students and Experienced Mentors",
      subheading:
        "Distance Connect helps startups connect with skilled students and experienced mentors, making hiring and guidance easier than ever.",
      features: [
        "Hire top student talent for internships and full-time roles",
        "Get expert mentorship for business growth",
        "Build a strong network of professionals and industry leaders",
      ],
    },
    {
      id: 2,
      title: "Hire Smart, Grow Faster",
      headline: "Access a Pool of Skilled & Job-Ready Candidates",
      subheading:
        "Find students who have the right skills and mindset to contribute to your startup's success.",
      features: [
        "Filter and hire candidates based on your exact needs",
        "Connect with students who are trained in real-world skills",
        "Reduce hiring costs and streamline your recruitment process",
      ],
    },
    {
      id: 3,
      title: "Gain Expert Guidance for Your Startup",
      headline: "Mentorship That Fuels Startup Growth",
      subheading:
        "Get personalized guidance from industry mentors to overcome challenges and accelerate your success.",
      features: [
        "Access experienced professionals for advice",
        "Get insights on funding, product development, and scaling",
        "Learn from mentors who have built successful startups",
      ],
    },
    {
      id: 4,
      title: "Build a Strong Professional Network",
      headline: "Connect with a Thriving Startup Ecosystem",
      subheading:
        "Join a community of entrepreneurs, mentors, and skilled professionals who can help your startup grow.",
      features: [
        "Network with like-minded founders and mentors",
        "Discover collaboration and funding opportunities",
        "Stay updated with the latest industry trends and best practices",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="pt-[170px]">
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

export default StartupSolutionsPage;
