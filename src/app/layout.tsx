import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script";
import MicrosoftClarity from "./metrics/MicrosoftClarity";
import { SessionProvider } from "next-auth/react";

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

    <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      <body>

        <TRPCReactProvider>
          <SessionProvider>

          {children}
          </SessionProvider>
          <MicrosoftClarity />
       
        <GoogleAnalytics gaId="G-D2RLQDYV1B" />
        <Toaster />
        <Script id="zoho-salesiq-init" strategy="afterInteractive">
        {`
          window.$zoho = window.$zoho || {};
          $zoho.salesiq = $zoho.salesiq || { ready: function() {} };
        `}
      </Script>

      <Script
        id="zsiqscript"
        src="https://salesiq.zohopublic.in/widget?wc=siqf82bfb0a40b0fcc4bd5d0860829e420252f20700c01aff1d782b85216cb830e2"
        strategy="afterInteractive"
        defer
      />
       </TRPCReactProvider>
      </body>
    </html>
  );
}
