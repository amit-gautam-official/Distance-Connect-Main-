import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-10 text-[#B4B9C9] lg:bg-[#3D568F] lg:text-white">
      <div className="container mx-auto w-[80%] lg:px-16">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          <div className="col-span-2 flex w-full items-center justify-center lg:hidden">
            <div className="col-span-2 flex w-[330px] items-center gap-[56px] self-stretch rounded-[15px] bg-[#3D568F] p-[32px_24px] text-white shadow-[0px_1px_4px_0px_rgba(25,33,61,0.08)]">
              <div className="flex flex-col justify-center gap-2">
                <div className="flex w-full items-center justify-center">
                  <img
                    src="/news.png"
                    alt="news"
                    className="h-[50px] w-[50px] rounded-[11px]"
                  />
                </div>
                <div className="text-center font-[Inter] text-[16px] font-semibold leading-[22px] text-white">
                  Subscribe to our newsletter
                </div>
                <div className="text-center font-[Inter] text-[14px] font-normal leading-[22px] text-white">
                  Donec eget dignissim id sit egestas in consequat volutpat
                  elementum donec et.
                </div>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full font-[Inter] text-[14px] font-normal leading-[20px] text-white"
                  />
                  <Button className="ml-2 bg-[#EDFB90] text-[#3D568F]">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col items-center justify-center">
            <ul className="mt-3 space-y-2">
              <h3 className="font-inter text-[16px] font-semibold leading-[22px] text-[#3D568F] lg:text-[#EAF3B2]">
                Contact us
              </h3>
              <li>Information</li>
              <li>Request a quote</li>
              <li>Consultation</li>
              <li>Help center</li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="hover:text-[#EAF3B2] hover:underline"
                >
                  Terms and conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/payment-refund-policy"
                  className="hover:text-[#EAF3B2] hover:underline"
                >
                  Payment & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div className="flex flex-col items-center justify-center">
            <ul className="mt-3 space-y-2">
              <h3 className="font-inter text-[16px] font-semibold leading-[22px] text-[#3D568F] lg:text-[#EAF3B2]">
                About us
              </h3>
              <li>Mission</li>
              <li>Our team</li>
              <li>Awards</li>
              <li>
                <Link
                  href="/code-of-conduct"
                  className="hover:text-[#EAF3B2] hover:underline"
                >
                  Code of Conduct
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#EAF3B2] hover:underline"
                >
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center justify-center">
            <ul className="mt-3 space-y-2">
              <h3 className="font-inter text-[16px] font-semibold leading-[22px] text-[#3D568F] lg:text-[#EAF3B2]">
                Services
              </h3>
              <li>Web design</li>
              <li>Web development</li>
              <li>Mobile design</li>
              <li>UI/UX design</li>
              <li>Branding design</li>
            </ul>
          </div>

          {/* Portfolio */}
          <div className="flex flex-col items-center justify-center">
            <ul className="mt-3 space-y-2">
              <h3 className="font-inter text-[16px] font-semibold leading-[22px] text-[#3D568F] lg:text-[#EAF3B2]">
                Portfolio
              </h3>
              <li>Websites</li>
              <li>E-commerce</li>
              <li>Mobile apps</li>
              <li>Landing pages</li>
              <li>UI/UX projects</li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="hidden w-[354px] items-center gap-[56px] self-stretch rounded-[15px] bg-[#FDFDF5] p-[32px_24px] shadow-[0px_1px_4px_0px_rgba(25,33,61,0.08)] lg:flex">
            <div className="flex flex-col justify-center gap-2">
              <div className="flex w-full items-center justify-center">
                <img
                  src="/news.png"
                  alt="news"
                  className="h-[50px] w-[50px] rounded-[11px]"
                />
              </div>
              <div className="text-center font-[Inter] text-[16px] font-semibold leading-[22px] text-[#3D568F]">
                Subscribe to our newsletter
              </div>
              <div className="text-center font-[Inter] text-[14px] font-normal leading-[22px] text-[#3D568F]">
                Donec eget dignissim id sit egestas in consequat volutpat
                elementum donec et.
              </div>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full font-[Inter] text-[14px] font-normal leading-[20px] text-[#3D568F]"
                />
                <Button className="ml-2 bg-[#3D568F]">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col items-center justify-between border-t border-gray-400 pt-6 md:flex-row">
          <p className="text-sm">
            Copyright &copy; 2025 Distance Connect | All Rights Reserved
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <Facebook className="cursor-pointer hover:text-[#EAF3B2]" />
            <Twitter className="cursor-pointer hover:text-[#EAF3B2]" />
            <Instagram className="cursor-pointer hover:text-[#EAF3B2]" />
            <Linkedin className="cursor-pointer hover:text-[#EAF3B2]" />
            <Youtube className="cursor-pointer hover:text-[#EAF3B2]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
