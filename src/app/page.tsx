import { redirect } from "next/navigation";
import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import LogoStrip from "./_components/LogoStrip";
import KeyBenefits from "./_components/KeyBenefits";
import Solutions from "./_components/Solutions";
import Guide from "./_components/Guide";
import FeatureMentor from "./_components/FeatureMentor";
import OurStory from "./_components/OurStory";
import Potential from "./_components/Potential";
import Testimonials from "./_components/Testimonials";
import Faq from "./_components/Faq";
import Footer from "./_components/Footer";
import client from "@/lib/contentful";
import { auth } from "@/server/auth";
import { getUserById } from "@/data/user";

export default async function Home() {

  let loggedIn = false;
  let role = "USER";
  const session = await auth()
  // console.log(session)
  const user = session?.user;

  if(user){
    const dbUser = await getUserById(user?.id as string);
    if(dbUser?.isRegistered){
      loggedIn = true;
      role = dbUser?.role;
    }else{
      redirect("/register")
    }

  }

  
  

  const response = await client?.getEntries({ content_type: "pageBlogPost" });
  const initialBlogs = response?.items?.sort(
    (a, b) =>
      new Date(b?.sys?.updatedAt).getTime() -
      new Date(a?.sys?.updatedAt).getTime(),
  );

  return (
    <div className="relative h-[4000px]">

      <div className="relative flex w-full items-center justify-center">
        <Navbar role={role} blogs={initialBlogs} loggedId={loggedIn} />
      </div>

      <HeroSection />
      <LogoStrip />
      <KeyBenefits />
      <Solutions />
      <div id="roadmap" className="relative">
        <Guide />
      </div>
      <div className="relative mt-20">
        {" "}
        {/* Increased top margin for FeatureMentor */}
        <FeatureMentor />
      </div>
      <OurStory />
      <Potential />
      <Testimonials />
      <Faq />
      <div className="lg:mt-10">
        <Footer />
      </div>
    </div>
  );
}
