import { auth0 } from "@/lib/auth0";
import { api } from "@/trpc/server";
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

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();
  const user = session?.user;
  let loggedId = false;

  if (user) {
    const dbUser = await api.user.checkUser({ kindeId: user?.sub! });
    //console.log("DB User", dbUser)

    if (dbUser) {
      loggedId = true;
      if (!dbUser.isRegistered) {
        //console.log("User is not registered")
        return redirect("/register");
      }
    } else {
      return redirect("/sync-user-to-db");
    }
  }

  const response = await client.getEntries({ content_type: "pageBlogPost" });
  const initialBlogs = response?.items?.sort(
    (a, b) =>
      new Date(b?.sys?.updatedAt).getTime() -
      new Date(a?.sys?.updatedAt).getTime(),
  );

  return (
    <div className="relative h-[4000px]">
      {/* <img src="/bg.png" alt="bg" className="absolute right-[0] top-0" /> */}

      <div className="relative flex w-full items-center justify-center">
        <Navbar blogs={initialBlogs} loggedId={loggedId} />
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
