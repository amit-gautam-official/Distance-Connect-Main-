import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="lg:bg-[#3D568F] bg-white text-[#B4B9C9] lg:text-white py-10">
      <div className="container w-[80%] mx-auto  lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-2  gap-3 lg:grid-cols-6 lg:gap-6">
        
        
        <div className="w-full  lg:hidden  col-span-2 flex justify-center items-center">
            <div className=" w-[330px] text-white flex  p-[32px_24px] items-center gap-[56px] self-stretch rounded-[15px] bg-[#3D568F] shadow-[0px_1px_4px_0px_rgba(25,33,61,0.08)] col-span-2">
          
          <div className="flex flex-col gap-2 justify-center">
              
              <div className="w-full flex justify-center items-center">
              <img src="/news.png" alt="news" className="w-[50px] h-[50px] rounded-[11px]"/>
              </div>
              <div className="text-white text-center font-[Inter] text-[16px] font-semibold leading-[22px]">
              Subscribe to our newsletter
              </div>
              <div className="text-white text-center font-[Inter] text-[14px] font-normal leading-[22px]">
              Donec eget dignissim id sit egestas in consequat volutpat elementum donec et.
              </div>
              <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="w-full text-white font-[Inter] text-[14px] font-normal leading-[20px]" />
              <Button className="ml-2 bg-[#EDFB90] text-[#3D568F]">Subscribe</Button>
              </div>
          </div>
          </div>
        </div>

          {/* Contact Us */}
          <div className="flex justify-center items-center flex-col">
            <ul className="mt-3 space-y-2 ">
            <h3 className="lg:text-[#EAF3B2] text-[#3D568F] font-inter text-[16px] font-semibold leading-[22px]
">Contact us</h3>
              <li>Information</li>
              <li>Request a quote</li>
              <li>Consultation</li>
              <li>Help center</li>
              <li>Terms and conditions</li>
            </ul>
          </div>

          {/* About Us */}
          <div className="flex justify-center items-center flex-col">
            <ul className="mt-3 space-y-2">
            <h3 className="lg:text-[#EAF3B2] text-[#3D568F] font-inter text-[16px] font-semibold leading-[22px]
">About us</h3>
              <li>Mission</li>
              <li>Our team</li>
              <li>Awards</li>
              <li>Testimonials</li>
              <li>Privacy policy</li>
            </ul>
          </div>

          {/* Services */}
          <div className="flex justify-center items-center flex-col">
            <ul className="mt-3 space-y-2">
            <h3 className="lg:text-[#EAF3B2] text-[#3D568F]  font-inter text-[16px] font-semibold leading-[22px]
">Services</h3>
              <li>Web design</li>
              <li>Web development</li>
              <li>Mobile design</li>
              <li>UI/UX design</li>
              <li>Branding design</li>
            </ul>
          </div>

          {/* Portfolio */}
          <div className="flex justify-center items-center flex-col">
            <ul className="mt-3 space-y-2">
            <h3 className="lg:text-[#EAF3B2] text-[#3D568F] font-inter text-[16px] font-semibold leading-[22px]
">Portfolio</h3>
              <li>Websites</li>
              <li>E-commerce</li>
              <li>Mobile apps</li>
              <li>Landing pages</li>
              <li>UI/UX projects</li>
            </ul>
          </div>
            {/* Newsletter */}
        <div className=" w-[354px] hidden lg:flex p-[32px_24px] items-center gap-[56px] self-stretch rounded-[15px] bg-[#FDFDF5] shadow-[0px_1px_4px_0px_rgba(25,33,61,0.08)]">
          
        <div className="flex flex-col gap-2 justify-center">
            
            <div className="w-full flex justify-center items-center">
            <img src="/news.png" alt="news" className="w-[50px] h-[50px] rounded-[11px]"/>
            </div>
            <div className="text-[#3D568F] text-center font-[Inter] text-[16px] font-semibold leading-[22px]">
            Subscribe to our newsletter
            </div>
            <div className="text-[#3D568F] text-center font-[Inter] text-[14px] font-normal leading-[22px]">
            Donec eget dignissim id sit egestas in consequat volutpat elementum donec et.
            </div>
            <div className="flex gap-2">
            <Input type="email" placeholder="Enter your email" className="w-full text-[#3D568F] font-[Inter] text-[14px] font-normal leading-[20px]" />
            <Button className="ml-2 bg-[#3D568F]">Subscribe</Button>
            </div>
        </div>
        </div>
        </div>

      

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-400 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">Copyright &copy; 2025 Distance Connect | All Rights Reserved</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Facebook className="cursor-pointer hover:text-[#EAF3B2] " />
            <Twitter className="cursor-pointer hover:text-[#EAF3B2] " />
            <Instagram className="cursor-pointer hover:text-[#EAF3B2] " />
            <Linkedin className="cursor-pointer hover:text-[#EAF3B2] " />
            <Youtube className="cursor-pointer hover:text-[#EAF3B2] " />
          </div>
        </div>
      </div>
    </footer>
  );
}
