"use client";
import { useState } from 'react';
import { Info, Clock, Calendar, AlertCircle, Mail, Phone, MapPin, Book, ChevronDown, ChevronUp } from 'lucide-react';

export default function ShippingPolicy() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (sectionId : number) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  const sections = [
    {
      id: 1,
      title: "Scope of Policy",
      icon: <Info size={20} />,
      content: "Distance Connect exclusively provides digital educational and mentorship services, including but not limited to mentorship sessions, career guidance, mock interviews, resume reviews, and job referral services. No physical products or tangible items are sold or shipped through our platform."
    },
    {
      id: 2,
      title: "Delivery of Digital Services",
      icon: <Book size={20} />,
      content: "All services offered are delivered digitally via electronic means, including video conferencing platforms, email, or through our online platform interface. Users will receive confirmation of their scheduled session or service upon successful booking and payment."
    },
    {
      id: 3,
      title: "Delivery Timeline",
      icon: <Clock size={20} />,
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Mentorship sessions, mock interviews, and live consultations will be provided according to the scheduled appointment chosen at the time of booking.</li>
          <li>Resume reviews, feedback reports, and similar asynchronous services will typically be delivered electronically within 2-5 business days from the date of purchase unless explicitly stated otherwise.</li>
        </ul>
      )
    },
    {
      id: 4,
      title: "No Physical Shipment",
      icon: <AlertCircle size={20} />,
      content: "As Distance Connect operates purely as a digital service provider, there is no involvement in the shipping or handling of physical goods. Consequently, no shipping fees or tracking details will be applicable or provided."
    },
    {
      id: 5,
      title: "User Responsibilities",
      icon: <Info size={20} />,
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Ensure their availability and reliable internet connectivity at the scheduled session time.</li>
          <li>Verify that their contact details and booking information are accurate to avoid disruptions or failed service delivery.</li>
        </ul>
      )
    },
    {
      id: 6,
      title: "Missed or Unattended Sessions",
      icon: <Calendar size={20} />,
      content: "Sessions unattended by the user without prior notice of cancellation or rescheduling (at least 24 hours before the scheduled time) will be considered delivered and completed. Such sessions will not be eligible for refunds."
    },
    {
      id: 7,
      title: "Rescheduling and Cancellations",
      icon: <Calendar size={20} />,
      content: "Users may request session rescheduling up to 24 hours before the scheduled service time. Rescheduling is subject to mentor availability. Cancellations requested within the allowed timeframe may be eligible for refunds as defined by our Refund Policy."
    },
    {
      id: 8,
      title: "Service Interruptions",
      icon: <AlertCircle size={20} />,
      content: "In circumstances where Distance Connect or mentors are unable to fulfill scheduled services due to technical or unforeseen issues, users will be notified promptly. Users may choose to reschedule the session or request a refund in accordance with our Refund Policy."
    },
    {
      id: 9,
      title: "Contact and Customer Support",
      icon: <Mail size={20} />,
      content: (
        <div className="space-y-2">
          <p>For assistance related to service delivery or any concerns under this policy, please contact our customer support team:</p>
          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-blue-600" />
            <span>Email: support@distanceconnect.in</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-blue-600" />
            <span>Address: C/o UmedSinghRana Vill &, PO Shahbad Daulatpur City, Shahbad Daulatpur, Delhi, North West Delhi- 110042, Delhi</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={16} className="text-blue-600" />
            <span>Phone: +91 76781 63826</span>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "Governing Law and Jurisdiction",
      icon: <Book size={20} />,
      content: "This Policy shall be governed by and construed under the laws of India. Any disputes arising out of or in connection with this policy will be subject to the exclusive jurisdiction of the competent courts located in New Delhi, India."
    },
    {
      id: 11,
      title: "Amendments",
      icon: <AlertCircle size={20} />,
      content: "Distance Connect reserves the right to update or modify this policy at its discretion. Changes will be effective immediately upon posting on our website. By continuing to use our services after any changes, you acknowledge acceptance of the revised policy."
    },
  ];

  return (
    <div className="min-h-[100dvh] md:pt-[100px] bg-gray-50">
      {/* Header */}
   

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <h2 className="text-2xl font-bold text-blue-800">Shipping and Delivery Policy</h2>
            <p className="text-gray-600 mt-2">Effective Date: 01 Feb 2025 | Saturday</p>
            <p className="mt-4 text-gray-700">
              This Shipping and Delivery Policy (&quot;Policy&quot;) clearly outlines the terms governing the delivery of services 
              provided by Distance Connect (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By using the services provided through 
              our website (https://distanceconnect.in/), you acknowledge and agree to the terms set forth in this Policy.
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {sections.map((section) => (
              <div key={section.id} className="p-0">
                <button 
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-blue-600">{section.icon}</div>
                    <span className="font-medium text-gray-800">{section.id}. {section.title}</span>
                  </div>
                  {expandedSection === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {expandedSection === section.id && (
                  <div className="px-6 py-4 bg-gray-50 text-gray-700">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

    
    </div>
  );
}