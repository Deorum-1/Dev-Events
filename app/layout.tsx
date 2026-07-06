import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dev Events",
  description: "The Hub for Every Dev Event You Mustn't Miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "min-h-screen",
        "h-full",
        "antialiased",
        schibstedGrotesk.variable,
        martianMono.variable,
        geist.variable,
        "font-sans",
      )}
    >
      <body className="relative min-h-full flex flex-col overflow-x-hidden">
        <Navbar />
        <div className="absolute inset-0 top-0 z-[-1]">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0}
            distortion={0.01}
          />
        </div>
        <main className="flex-1 px-6 py-8 md:px-10 lg:px-16">{children}</main>
      </body>
    </html>
  );
}
