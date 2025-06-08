
import { type Metadata } from "next";


export const metadata: Metadata = {
    title: "Mentors",
    description: "Find a mentor to help you in your career",
    openGraph: {
      title: "Mentors",
      description: "Find a mentor to help you in your career",
      url: `https://distanceconnect.in/mentors`,
      images: [
        {
          url: `/logo.png`,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      title: "Mentors",
      description: "Find a mentor to help you in your career",
      card: "summary_large_image",
      images: [
        {
          url: `/logo.png`,
          width: 800,
          height: 600,
        },
      ],
    },
    
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <>
        {children}
      </>
        
  );
}
