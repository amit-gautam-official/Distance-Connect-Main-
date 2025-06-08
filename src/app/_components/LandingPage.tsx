"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import LogoStrip from "./LogoStrip";
import KeyBenefits from "./KeyBenefits";
import Solutions from "./Solutions";
import Guide from "./Guide";
import FeatureMentor from "./FeatureMentor";
import OurStory from "./OurStory";
import Potential from "./Potential";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import Footer from "./Footer";
import WaitlistModal from "./WaitlistModal";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";

// AnimatedSection component for reusable animations
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  id?: string;
}

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  distance = 50,
  id,
}: AnimatedSectionProps) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered animation for children elements
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );
};

// Fade-in animation for elements
interface FadeInElementProps {
  children: ReactNode;
  className?: string;
}

const FadeInElement = ({ children, className = "" }: FadeInElementProps) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage({
  role,
  blogs,
  loggedId,
}: {
  role: string;
  blogs: any[];
  loggedId: boolean;
}) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);




  return (
    <div className="relative h-[4000px]">
      <div className="relative flex w-full items-center justify-center">
        <Navbar
          role={role}
          blogs={blogs}
          loggedId={loggedId}
        />
      </div>

      {/* Use motion directly for Hero since it's the first thing users see */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSection />
      </motion.div>



      <AnimatedSection delay={0.1}>
        <LogoStrip />
      </AnimatedSection>

      <AnimatedSection>
        <KeyBenefits />
      </AnimatedSection>

      <AnimatedSection>
        <Solutions />
      </AnimatedSection>

      <AnimatedSection id="roadmap" className="relative">
        <Guide />
      </AnimatedSection>

      <AnimatedSection className="relative mt-20" delay={0.1}>
        <FeatureMentor />
      </AnimatedSection>

      <AnimatedSection>
        <OurStory />
      </AnimatedSection>

      <AnimatedSection>
        <Potential />
      </AnimatedSection>

      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>

      <AnimatedSection>
        <Faq />
      </AnimatedSection>

      <AnimatedSection className="lg:mt-10" delay={0.1}>
        <Footer />
      </AnimatedSection>
    </div>
  );
}
