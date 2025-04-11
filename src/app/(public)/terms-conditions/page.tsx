"use client";
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TermsAndConditionsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Terms and conditions sections data
  const sections = [
    {
      id: "agreement",
      title: "AGREEMENT TO OUR LEGAL TERMS",
      content: (
        <>
          <p className="mb-4">
            We are SKILLZIA EDUCATION TECHNOLOGIES PRIVATE LIMITED, doing business as Distance Connect (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;), 
            a company registered in India at C/o UmedSinghRana Vill &, PO Shahbad Daulatpur City, Shahbad Daulatpur, 
            North West Delhi- 110042, support@distanceconnect.in, Shahbad Daulatpur, Delhi 110042.
          </p>
          <p className="mb-4">
            We operate the website https://distanceconnect.in (the &ldquo;Site&rdquo;), the mobile application Distance Connect (the &ldquo;App&rdquo;), 
            as well as any other related products and services that refer or link to these legal terms (the &ldquo;Legal Terms&rdquo;) 
            (collectively, the &ldquo;Services&rdquo;).
          </p>
          <p className="mb-4">
            Distance Connect is an AI-powered career development and mentorship platform designed to bridge the gap between 
            students and industry professionals. The platform provides personalized mentorship, career counseling, interview 
            preparation, and internship opportunities to students, primarily from Tier 2 and Tier 3 colleges, helping them 
            enhance their employability and secure placements in top companies. The Distance Connect website and mobile application 
            serve as an interactive hub where:
          </p>
          <ol className="list-decimal ml-6 mb-4 space-y-2">
            <li>
              Students can access mentorship sessions, AI-powered career counseling, skill assessments, job opportunities, 
              and learning resources to enhance their career prospects.
            </li>
            <li>
              Mentors can offer guidance, conduct career-building sessions, and provide industry insights to students while 
              earning through a session-based payment system.
            </li>
            <li>
              Startups and Companies can post internships, job opportunities, and interact with potential candidates directly 
              through the platform.
            </li>
          </ol>
          <p className="mb-4">
            The platform operates as a marketplace that facilitates seamless connections between students and industry experts, 
            ensuring a structured and efficient career development process while incorporating AI-driven recommendations to 
            tailor experiences for each user.
          </p>
          <p className="mb-4">
            You can contact us by phone at (+91)7678163826, email at support@distanceconnect.in, or by mail to C/o UmedSinghRana Vill &, 
            PO Shahbad Daulatpur City, Shahbad Daulatpur, North West Delhi- 110042, support@distanceconnect.in, Shahbad Daulatpur, 
            Delhi 110042, India.
          </p>
          <p className="mb-4">
            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an 
            entity (&quot;you&quot;), and SKILLZIA EDUCATION TECHNOLOGIES PRIVATE LIMITED, concerning your access to and use of the Services. 
            You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. 
            IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU 
            MUST DISCONTINUE USE IMMEDIATELY.
          </p>
          <p className="mb-4">
            We will provide you with prior notice of any scheduled changes to the Services you are using. The modified Legal Terms 
            will become effective upon posting or notifying you by support@distanceconnect.in, as stated in the email message. 
            By continuing to use the Services after the effective date of any changes, you agree to be bound by the modified terms.
          </p>
          <p className="mb-4">
            All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission 
            of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your 
            parent or guardian read and agree to these Legal Terms prior to you using the Services.
          </p>
          <p className="mb-4">
            We recommend that you print a copy of these Legal Terms for your records.
          </p>
        </>
      )
    },
    {
      id: "services",
      title: "1. OUR SERVICES",
      content: (
        <p className="mb-4">
          The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable. <br/>

The Services are not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA).

        </p>
      )
    },
    {
      id: "intellectual-property",
      title: "2. INTELLECTUAL PROPERTY RIGHTS",
      content: (
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Our intellectual property</h2>
  <p>
    We are the owner or the licensee of all intellectual property rights in our Services, including all source code,
    databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services
    (collectively, the &quot;Content&quot;), as well as the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;).
  </p>
  <p>
    Our Content and Marks are protected by copyright and trademark laws and treaties in the United States and around
    the world.
  </p>
  <p>The Content and Marks are provided &quot;AS IS&quot; for your personal, non-commercial use only.</p>

  <h2 className="text-lg font-semibold">Your use of our Services</h2>
  <p>
    Subject to your compliance with these Legal Terms, including the &quot;PROHIBITED ACTIVITIES&quot; section below, we grant
    you a non-exclusive, non-transferable, revocable license to:
  </p>
  <ul className="list-disc pl-5 space-y-1">
    <li>Access the Services</li>
    <li>Download or print any part of the Content for personal, non-commercial use</li>
  </ul>
  <p>
    No part of the Services, Content, or Marks may be reused or reproduced for commercial purposes without written
    permission.
  </p>
  <p>
    For permissions, contact:{" "}
    <a href="mailto:support@distanceconnect.in" className="text-blue-600 underline">support@distanceconnect.in</a>
  </p>

  <h2 className="text-lg font-semibold">Your submissions and contributions</h2>
  <p>Understand your rights and responsibilities when you upload or post content on our Services.</p>

  <h3 className="font-medium">Submissions</h3>
  <p>
    By sending us any ideas or feedback, you assign all rights to us and agree that we can use it without any
    obligation to you.
  </p>

  <h3 className="font-medium">Contributions</h3>
  <p>
    Contributions include any content you post through forums, blogs, or social features. They may be viewable by
    others.
  </p>

  <h3 className="font-medium">License to Use</h3>
  <p>
    You grant us full rights to use, modify, and share your Contributions in any format, for any purpose, including
    commercial use.
  </p>

  <h3 className="font-medium">Responsibility</h3>
  <p>
    You are responsible for ensuring your content is lawful and does not infringe on others&apos; rights. You agree to
    compensate us for any violations.
  </p>

  <h3 className="font-medium">Content Moderation</h3>
  <p>
    We may remove or edit content at our discretion. Repeated violations can lead to account suspension or legal
    action.
  </p>

  <h2 className="text-lg font-semibold">Copyright infringement</h2>
  <p>
    If you believe content on our Services infringes your copyright, please refer to the &quot;COPYRIGHT INFRINGEMENTS&quot;
    section.
  </p>
</div>

      )
    },
    {
      id: "user-representations",
      title: "3. USER REPRESENTATIONS",
      content: (
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">User Representations</h2>
  <p>
    By using the Services, you represent and warrant that:
  </p>
  <ul className="list-decimal pl-5 space-y-1">
    <li>All registration information you submit will be true, accurate, current, and complete.</li>
    <li>You will maintain the accuracy of such information and promptly update it as necessary.</li>
    <li>You have the legal capacity and you agree to comply with these Legal Terms.</li>
    <li>You are not a minor in your jurisdiction, or if you are, you have parental permission to use the Services.</li>
    <li>You will not access the Services through automated or non-human means (e.g., bots or scripts).</li>
    <li>You will not use the Services for any illegal or unauthorized purpose.</li>
    <li>Your use of the Services will not violate any applicable laws or regulations.</li>
  </ul>
  <p>
    If you provide any information that is untrue, inaccurate, not current, or incomplete, we reserve the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any part of them).
  </p>
</div>

      )
    },
    {
      id: "user-registration",
      title: "4. USER REGISTRATION",
      content: (
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Account Registration</h2>
  <p>
    You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password.
  </p>
  <p>
    We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
  </p>
</div>

      )
    },
    {
      id: "purchases",
      title: "5. PURCHASES AND PAYMENT",
      content: (
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
        <h2 className="text-lg font-semibold">Payment Terms</h2>
        <p>We accept the following forms of payment:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Visa</li>
          <li>Mastercard</li>
          <li>American Express</li>
          <li>PayPal</li>
          <li>Discover</li>
          <li>UPI</li>
          <li>Net Banking</li>
        </ul>
        <p>
          You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in INR.
        </p>
        <p>
          You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping fees, and you authorize us to charge your chosen payment provider for any such amounts upon placing your order. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.
        </p>
        <p>
          We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers, or distributors.
        </p>
      </div>
      
      )
    },
    {
      id: "policy",
      title: "6. POLICY",
      content: (
        <p className="mb-4">
          Please review our Return Policy posted on the Services prior to making any purchases.
        </p>
      )
    },
    {
      id: "prohibited-activities",
      title: "7. PROHIBITED ACTIVITIES",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Prohibited Activities</h2>
  <p>
    You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
  </p>
  <p>As a user of the Services, you agree not to:</p>
  <ul className="list-disc pl-5 space-y-1">
    <li>Systematically retrieve data or other content from the Services to create or compile a database or directory without written permission.</li>
    <li>Trick, defraud, or mislead us or other users, especially to obtain sensitive account info such as passwords.</li>
    <li>Circumvent or interfere with security-related features of the Services or Content.</li>
    <li>Disparage, tarnish, or otherwise harm us or the Services in our opinion.</li>
    <li>Use the Services to harass, abuse, or harm another person.</li>
    <li>Misuse support services or submit false abuse reports.</li>
    <li>Use the Services in violation of any applicable laws or regulations.</li>
    <li>Engage in unauthorized framing or linking to the Services.</li>
    <li>Upload or transmit viruses, Trojan horses, or other malicious material.</li>
    <li>Use automated scripts, bots, or data mining tools.</li>
    <li>Delete copyright or proprietary notices from any Content.</li>
    <li>Impersonate another user or use someone else’s username.</li>
    <li>Upload or transmit spyware or passive data collection mechanisms.</li>
    <li>Disrupt or create an undue burden on the Services or networks.</li>
    <li>Harass, annoy, intimidate, or threaten our employees or agents.</li>
    <li>Bypass measures preventing or restricting access to the Services.</li>
    <li>Copy or adapt the Services’ software or code.</li>
    <li>Reverse engineer or disassemble any software used in the Services.</li>
    <li>Use unauthorized automated systems like scrapers or offline readers.</li>
    <li>Use a buying or purchasing agent to make purchases on the Services.</li>
    <li>Collect user data (like emails/usernames) for spam or unauthorized accounts.</li>
    <li>Use the Services for competing or commercial endeavors.</li>
    <li>Use the Services to advertise or sell goods/services.</li>
    <li>Sell or transfer your user profile without authorization.</li>
  </ul>
</div>

        </>
      )
    },
    {
      id: "user-contributions",
      title: "8. USER GENERATED CONTRIBUTIONS",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">User Contributions</h2>
  <p>
    The Services may invite you to chat, contribute to, or participate in blogs, message boards, forums, and other interactive features. You may be able to submit content such as text, writings, video, audio, photographs, graphics, comments, suggestions, personal information, or other materials (“Contributions”).
  </p>
  <p>
    Contributions may be viewable by other users and through third-party websites. Any Contributions you transmit may be treated as non-confidential and non-proprietary.
  </p>
  <p>By submitting Contributions, you represent and warrant that:</p>
  <ul className="list-disc pl-5 space-y-1">
    <li>Your Contributions do not infringe on any third party’s intellectual property or proprietary rights.</li>
    <li>You own or have the necessary permissions to use and authorize us to use your Contributions.</li>
    <li>You have consent from all identifiable individuals appearing in your Contributions.</li>
    <li>Your Contributions are not false, inaccurate, or misleading.</li>
    <li>Your Contributions are not unauthorized advertisements or spam.</li>
    <li>Your Contributions are not obscene, harassing, or otherwise objectionable.</li>
    <li>Your Contributions do not ridicule, mock, intimidate, or abuse anyone.</li>
    <li>Your Contributions do not promote violence or harassment of others.</li>
    <li>Your Contributions do not violate any applicable laws or regulations.</li>
    <li>Your Contributions do not infringe on anyone’s privacy or publicity rights.</li>
    <li>Your Contributions do not include or promote child exploitation or harm to minors.</li>
    <li>Your Contributions do not contain offensive comments about race, gender, sexual orientation, or disabilities.</li>
    <li>Your Contributions do not link to content that violates these Legal Terms or applicable laws.</li>
  </ul>
  <p>
    Any use of the Services in violation of the above may result in suspension or termination of your access to the Services.
  </p>
</div>

</>
      )
    },
    {
      id: "contribution-license",
      title: "9. CONTRIBUTION LICENSE",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">License and Responsibility for Contributions</h2>
  <p>
    By posting your Contributions to any part of the Services or by linking your account to any of your social media accounts, you grant us an unrestricted, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide license to use, host, reproduce, disclose, publish, broadcast, retitle, store, publicly display and perform, reformat, translate, excerpt, and distribute your Contributions for any purpose, including commercial and advertising uses. This includes the right to create derivative works and sublicense these rights.
  </p>
  <p>
    This license applies to any form, media, or technology now known or developed in the future. It includes our use of your name, company name, franchise name, and any trademarks, logos, or images you provide. You waive all moral rights in your Contributions and confirm that no such rights have been asserted.
  </p>
  <p>
    We do not claim ownership over your Contributions. You retain full rights to any intellectual property and proprietary rights associated with your Contributions. We are not responsible for any statements or representations made by you through your Contributions, and you agree to hold us harmless from any claims related to them.
  </p>
  <p>
    We reserve the right, at our sole discretion, to:
  </p>
  <ul className="list-disc pl-5 space-y-1">
    <li>Edit, redact, or otherwise modify any Contributions</li>
    <li>Re-categorize Contributions to more appropriate sections</li>
    <li>Pre-screen or delete any Contributions at any time and for any reason, without notice</li>
  </ul>
  <p>
    We are not obligated to monitor your Contributions.
  </p>
</div>

</>
      )
    },
    {
      id: "review-guidelines",
      title: "10. GUIDELINES FOR REVIEWS",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">User Reviews</h2>
  <p>
    We may provide you areas on the Services to leave reviews or ratings. When posting a review, you agree to follow these guidelines:
  </p>
  <ul className="list-decimal pl-5 space-y-1">
    <li>You should have firsthand experience with the person or entity being reviewed.</li>
    <li>Reviews should not contain offensive language, profanity, or hateful/abusive content.</li>
    <li>Reviews must not include discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability.</li>
    <li>Do not include references to illegal activity.</li>
    <li>You must not be affiliated with a competitor when posting a negative review.</li>
    <li>Do not make legal conclusions about others’ conduct.</li>
    <li>Do not post false or misleading information.</li>
    <li>Do not organize campaigns encouraging others to post reviews, whether positive or negative.</li>
  </ul>
  <p>
    We may accept, reject, or remove reviews at our sole discretion. We are not obligated to screen or delete reviews, even if someone finds them objectionable or inaccurate.
  </p>
  <p>
    Reviews are not endorsed by us and do not necessarily reflect our views or the views of our affiliates or partners. We are not liable for any review or for any claims, liabilities, or losses resulting from any review.
  </p>
  <p>
    By posting a review, you grant us a perpetual, non-exclusive, worldwide, royalty-free, fully paid, assignable, and sublicensable license to use, reproduce, modify, translate, transmit, display, perform, and distribute your review content.
  </p>
</div>

</>
      )
    },
    {
      id: "mobile-app",
      title: "11. MOBILE APPLICATION LICENSE",
      content: (
        <>
          <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Use License</h2>
  <p>
    If you access the Services via the App, we grant you a revocable, non-exclusive, non-transferable, limited right to install and use the App on wireless electronic devices owned or controlled by you. This right is granted strictly in accordance with these Legal Terms.
  </p>
  <p>You agree not to:</p>
  <ul className="list-decimal pl-5 space-y-1">
    <li>Decompile, reverse engineer, disassemble, derive source code from, or decrypt the App, except as permitted by law.</li>
    <li>Modify, adapt, enhance, translate, or create derivative works from the App.</li>
    <li>Violate any applicable laws while accessing or using the App.</li>
    <li>Remove or obscure proprietary notices such as copyright or trademark information.</li>
    <li>Use the App for commercial or revenue-generating purposes not intended by us.</li>
    <li>Make the App accessible over a network allowing simultaneous use by multiple devices or users.</li>
    <li>Create a product or service that competes with or substitutes the App.</li>
    <li>Send automated queries or unsolicited commercial emails using the App.</li>
    <li>Use our proprietary content or interfaces to develop any other software, accessories, or applications.</li>
  </ul>

  <h3 className="text-md font-medium mt-4">Apple and Android Devices</h3>
  <p>The following terms apply when using the App via Apple Store or Google Play (each, an “App Distributor”):</p>
  <ul className="list-decimal pl-5 space-y-1">
    <li>
      The license is limited to use on a device that runs Apple iOS or Android OS, per the App Distributor’s usage rules.
    </li>
    <li>
      We are responsible for App support and maintenance unless otherwise required by law. App Distributors have no such obligations.
    </li>
    <li>
      In case of a warranty issue, you may contact the App Distributor for a refund (if applicable). No further warranty obligations are assumed by the Distributor.
    </li>
    <li>
      You confirm that (i) you are not located in a country under US embargo or designated as a &quot;terrorist supporting&quot; country and (ii) you are not listed on any US government restricted parties list.
    </li>
    <li>
      You agree to follow applicable third-party terms when using the App (e.g., mobile data agreements).
    </li>
    <li>
      App Distributors are third-party beneficiaries to these terms and may enforce them against you.
    </li>
  </ul>
</div>

        </>
      )
    },
    {
      id: "social-media",
      title: "12. SOCIAL MEDIA",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Third-Party Account Integration</h2>
  <p>
    As part of the functionality of the Services, you may link your account with third-party service provider accounts (each a “Third-Party Account”) by either:
  </p>
  <ul className="list-decimal pl-5 space-y-1">
    <li>Providing your Third-Party Account login information through the Services; or</li>
    <li>Allowing us to access your Third-Party Account, as permitted by its applicable terms.</li>
  </ul>
  <p>
    You represent and warrant that you have the right to share your Third-Party Account credentials or grant us access, and doing so will not violate any terms of the Third-Party Account or require us to pay any fees or comply with additional limitations.
  </p>
  <p>
    By linking a Third-Party Account, you acknowledge and agree that:
  </p>
  <ul className="list-disc pl-5 space-y-1">
    <li>
      We may access, make available, and store content from your Third-Party Account (e.g., friend lists or posts) to integrate with the Services.
    </li>
    <li>
      We may exchange information with the Third-Party Account depending on what is disclosed at the time of connection.
    </li>
    <li>
      Information you post on your Third-Party Accounts may appear on the Services, subject to your privacy settings with the Third-Party provider.
    </li>
  </ul>
  <p>
    If a Third-Party Account becomes unavailable or access is terminated, any linked content may no longer be accessible via the Services. You can disable the connection between your account and any Third-Party Accounts at any time.
  </p>
  <p className="font-semibold uppercase text-xs">
    Please note:
  </p>
  <p>
    Your relationship with any third-party service provider is governed solely by your agreement(s) with them. We do not review Social Network Content and are not responsible for its accuracy, legality, or appropriateness.
  </p>
  <p>
    You agree that we may access your email contacts or mobile device contacts to identify connections using the Services. You may request deactivation of these connections via account settings or by contacting us. We will attempt to delete any related data stored on our servers, excluding your username and profile picture.
  </p>
</div>

</>
      )
    },
    {
      id: "management",
      title: "13. SERVICES MANAGEMENT",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Our Rights</h2>
  <p>
    We reserve the right, but not the obligation, to:
  </p>
  <ul className="list-decimal pl-5 space-y-1">
    <li>
      Monitor the Services for violations of these Legal Terms;
    </li>
    <li>
      Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including reporting such users to law enforcement;
    </li>
    <li>
      In our sole discretion and without limitation, restrict access to, limit the availability of, or disable any of your Contributions, to the extent technologically feasible;
    </li>
    <li>
      Remove or disable files and content from the Services that are excessive in size or otherwise burdensome to our systems, without prior notice or liability;
    </li>
    <li>
      Manage the Services to protect our rights, property, and to ensure the proper functioning of the platform.
    </li>
  </ul>
</div>

</>
      )
    },
    {
      id: "privacy",
      title: "14. PRIVACY POLICY",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Privacy Policy</h2>
  <p>
    We care about data privacy and security. Please review our{" "}
    <a
      href="https://distanceconnect.in/privacy-policy"
      className="text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Privacy Policy
    </a>.
  </p>
  <p>
    By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.
  </p>
  <p>
    Please note that the Services are hosted in India. If you access the Services from any other region with laws or regulations governing personal data collection, use, or disclosure that differ from those of India, you acknowledge and agree that your data is being transferred to and processed in India. Your continued use of the Services constitutes your express consent to such transfer and processing.
  </p>
</div>

</>
      )
    },
    {
      id: "copyright",
      title: "15. COPYRIGHT INFRINGEMENTS",
      content: (
       <>
       <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Copyright Infringement Notification</h2>
  <p>
    We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us using the contact information provided below (a &quot;Notification&quot;).
  </p>
  <p>
    A copy of your Notification will be sent to the person who posted or stored the material addressed in the Notification.
  </p>
  <p>
    Please be advised that, pursuant to applicable law, you may be held liable for damages if you make material misrepresentations in a Notification. Therefore, if you are unsure whether the material located on or linked to by the Services infringes your copyright, you should consider first consulting with an attorney.
  </p>
</div>

</>
      )
    },
    {
      id: "term",
      title: "16. TERM AND TERMINATION",
      content: (
       <>
       <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Termination</h2>
  <p>
    These Legal Terms shall remain in full force and effect while you use the Services. <span className="font-semibold">WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES</span> (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
  </p>
  <p>
    If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party.
  </p>
  <p>
    In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.
  </p>
</div>

</>
      )
    },
    {
      id: "modifications",
      title: "17. MODIFICATIONS AND INTERRUPTIONS",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Modifications and Interruptions</h2>
  <p>
    We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We also reserve the right to modify or discontinue all or part of the Services without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.
  </p>
  <p>
    We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you.
  </p>
  <p>
    You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.
  </p>
</div>

</>
      )
    },
    {
      id: "governing-law",
      title: "18. GOVERNING LAW",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Governing Law</h2>
  <p>
    These Legal Terms shall be governed by and defined following the laws of India. <span className="font-medium">SKILLZIA EDUCATION TECHNOLOGIES PRIVATE LIMITED</span> and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
  </p>
</div>

</>
      )
    },
    {
      id: "dispute",
      title: "19. DISPUTE RESOLUTION",
      content: (
        <>
          <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-6">
  <h2 className="text-lg font-semibold">Dispute Resolution</h2>

  <div>
    <h3 className="font-medium">Informal Negotiations</h3>
    <p>
      To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a &ldquo;Dispute&rdquo; and collectively, the &ldquo;Disputes&rdquo;) brought by either you or us (individually, a &ldquo;Party&rdquo; and collectively, the &ldquo;Parties&rdquo;), the Parties agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least thirty (30) days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.
    </p>
  </div>

  <div>
    <h3 className="font-medium">Binding Arbitration</h3>
    <p>
      Any dispute arising out of or in connection with these Legal Terms, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by the International Commercial Arbitration Court under the European Arbitration Chamber (Belgium, Brussels, Avenue Louise, 146) according to the Rules of this ICAC, which, as a result of referring to it, is considered part of this clause. The number of arbitrators shall be three (3). The seat or legal place of arbitration shall be New Delhi, India. The language of the proceedings shall be English. The governing law of these Legal Terms shall be the substantive law of India.
    </p>
  </div>

  <div>
    <h3 className="font-medium">Restrictions</h3>
    <p>
      The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law:
    </p>
    <ul className="list-disc pl-6 mt-2 space-y-1">
      <li>No arbitration shall be joined with any other proceeding;</li>
      <li>There is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures;</li>
      <li>There is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.</li>
    </ul>
  </div>

  <div>
    <h3 className="font-medium">Exceptions to Informal Negotiations and Arbitration</h3>
    <p>
      The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations and binding arbitration:
    </p>
    <ul className="list-disc pl-6 mt-2 space-y-1">
      <li>Any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party;</li>
      <li>Any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use;</li>
      <li>Any claim for injunctive relief.</li>
    </ul>
    <p className="mt-2">
      If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.
    </p>
  </div>
</div>

        </>
      )
    },
    {
      id: "corrections",
      title: "20. CORRECTIONS",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Errors and Omissions</h2>
  <p>
    There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. 
    We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.
  </p>
</div>

</>
      )
    },
    {
      id: "disclaimer",
      title: "21. DISCLAIMER",
      content: (
       <>
       <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Disclaimer of Warranties</h2>
  <p>
    THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, 
    WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, 
    THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
  </p>
  <p>
    WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES&apos; CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES 
    AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY:
  </p>
  <ul className="list-disc pl-6 space-y-1">
    <li>Errors, mistakes, or inaccuracies of content and materials</li>
    <li>Personal injury or property damage resulting from your access to and use of the Services</li>
    <li>Unauthorized access to or use of our secure servers and/or any and all personal or financial information stored therein</li>
    <li>Interruption or cessation of transmission to or from the Services</li>
    <li>Bugs, viruses, Trojan horses, or the like transmitted by any third party</li>
    <li>Errors or omissions in any content or materials, or loss or damage from use of any content made available via the Services</li>
  </ul>
  <p>
    WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, 
    ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, 
    AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS.
  </p>
  <p>
    AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
  </p>
</div>
</>
      )
    },
    {
      id: "liability",
      title: "22. LIMITATIONS OF LIABILITY",
      content: (
       <>
       <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Limitation of Liability</h2>
  <p>
    IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, 
    SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, 
    EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
  </p>
  <p>
    NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, 
    WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.
  </p>
  <p>
    CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. 
    IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
  </p>
</div>

</>
      )
    },
    {
      id: "indemnification",
      title: "23. INDEMNIFICATION",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Indemnification</h2>
  <p>
    You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, 
    from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of:
  </p>
  <ul className="list-decimal list-inside space-y-2 pl-4">
    <li>Your Contributions;</li>
    <li>Use of the Services;</li>
    <li>Breach of these Legal Terms;</li>
    <li>Any breach of your representations and warranties set forth in these Legal Terms;</li>
    <li>Your violation of the rights of a third party, including but not limited to intellectual property rights;</li>
    <li>Any overt harmful act toward any other user of the Services with whom you connected via the Services.</li>
  </ul>
  <p>
    Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, 
    and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, 
    action, or proceeding which is subject to this indemnification upon becoming aware of it.
  </p>
</div>

</>
      )
    },
    {
      id: "user-data",
      title: "24. USER DATA",
      content: (
       <>
       <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Data Backup and Responsibility</h2>
  <p>
    We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. 
    Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services.
  </p>
  <p>
    You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us 
    arising from any such loss or corruption of such data.
  </p>
</div>

</>
      )
    },
    {
      id: "electronic",
      title: "25. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Electronic Communications, Transactions, and Signatures</h2>
  <p>
    Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing.
  </p>
  <p className="font-medium uppercase text-gray-700">
    YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES.
  </p>
  <p>
    You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.
  </p>
</div>

</>
      )
    },
    {
      id: "sms",
      title: "26. SMS TEXT MESSAGING",
      content: (
        <>
          <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Opting Out</h2>
  <p>
    If at any time you wish to stop receiving SMS messages from us, simply reply to the text with &ldquo;<span className="font-semibold">STOP</span>.” You may receive an SMS message confirming your opt out.
  </p>

  <h2 className="text-lg font-semibold">Message and Data Rates</h2>
  <p>
    Please be aware that message and data rates may apply to any SMS messages sent or received. The rates are determined by your carrier and the specifics of your mobile plan.
  </p>

  <h2 className="text-lg font-semibold">Support</h2>
  <p>
    If you have any questions or need assistance regarding our SMS communications, please email us at <a href="mailto:support@distanceconnect.in" className="text-blue-600 hover:underline">support@distanceconnect.in</a> or call at <a href="tel:+917678163826" className="text-blue-600 hover:underline">(+91) 7678163826</a>.
  </p>

</div>

        </>
      )
    },
    {
      id: "california",
      title: "27. CALIFORNIA USERS AND RESIDENTS",
      content: (
        <>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">California Users and Residents</h2>
  <p>
    If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at:
  </p>
  <p className="pl-4">
    1625 North Market Blvd., Suite N 112,<br />
    Sacramento, California 95834
  </p>
  <p>
    Or by telephone at <a href="tel:8009525210" className="text-blue-600 hover:underline">(800) 952-5210</a> or <a href="tel:9164451254" className="text-blue-600 hover:underline">(916) 445-1254</a>.
  </p>
</div>

</>
      )
    },
    {
      id: "miscellaneous",
      title: "28. MISCELLANEOUS",
      content: (
      <>
      <div className="text-sm sm:text-base leading-relaxed text-gray-800 space-y-4">
  <h2 className="text-lg font-semibold">Entire Agreement</h2>
  <p>
    These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision.
  </p>
  <p>
    These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control.
  </p>
  <p>
    If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions.
  </p>
  <p>
    There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them.
  </p>
  <p>
    You hereby waive any and all defenses you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.
  </p>
</div>

</>
      )
    },
    {
      id: "contact",
      title: "29. CONTACT US",
      content: (
        <>
          <p className="mb-4">
            In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, 
            please contact us at:
          </p>
          <address className="not-italic mb-4 leading-relaxed">
            SKILLZIA EDUCATION TECHNOLOGIES PRIVATE LIMITED<br />
            C/o UmedSinghRana Vill &, PO Shahbad Daulatpur City, Shahbad Daulatpur, North West Delhi- 110042<br />
            support@distanceconnect.in<br />
            Shahbad Daulatpur, Delhi 110042<br />
            India<br />
            Phone: (+91)7678163826<br />
            Email: support@distanceconnect.in
          </address>
        </>
      )
    },
  ];

  // Handle section click in the sidebar
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-[80%] mx-auto px-4 pt-[100px] py-12">
      <Card className="mb-6">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-3xl font-bold">TERMS AND CONDITIONS</CardTitle>
        </CardHeader>
      </Card>

      {/* Mobile navigation */}
      <div className="md:hidden mb-6">
        <Select onValueChange={(value) => handleSectionClick(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Jump to section..." />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-[300px] shrink-0">
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">TABLE OF CONTENTS</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-2">
              <ScrollArea className="h-[70vh] pr-4">
                <div className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={cn(
                        "flex items-center w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors",
                        activeSection === section.id ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                      )}
                    >
                      <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
                      <span className="truncate">{section.title}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-6">
              {/* Desktop version: All sections visible */}
              <div className="hidden md:block space-y-8">
                {sections.map((section) => (
                  <div 
                    key={section.id} 
                    id={section.id}
                    className="scroll-mt-4"
                  >
                    <h2 className="text-xl font-semibold mb-4 text-primary">{section.title}</h2>
                    <div>{section.content}</div>
                  </div>
                ))}
              </div>

              {/* Mobile version: Accordion */}
              <div className="md:hidden">
                <Accordion type="single" collapsible className="w-full">
                  {sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id} id={section.id} className="border-b">
                      <AccordionTrigger className="text-left font-medium">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {section.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;