import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  keywords: ["Distance Connect", "Mentorship", "Education"],
  icons: [{ rel: "icon", url: "/smallLogo.png" }],
  openGraph: {
    title: "Distance Connect",
    description: "A platform for connecting students and mentors.",
    url: "https://distanceconnect.in",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Distance Connect",
    description: "A platform for connecting students and mentors.",
    images: ["/logo.png"],
    creator: "@distanceconnect",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: false,
    noarchive: false,
    nosnippet: false,
  },
  appleWebApp: {
    title: "Distance Connect",
    statusBarStyle: "default",
    capable: true,
    startupImage: [
      {
        url: "/logo.png",
       
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
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
