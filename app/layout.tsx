import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { IntroSequence } from "@/components/ui/IntroSequence";
import { PageTransitionWrapper } from "@/components/ui/PageTransitionWrapper";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { BiometricGateProvider } from "@/components/providers/BiometricGateContext";
import { BiometricGate } from "@/components/ui/BiometricGate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Austin Karki | Faceless Ancient Portfolio",
  description: "Official portfolio of Austin Karki (Faceless Ancient). Explore projects in AI, Machine Learning, and High-End Web Development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <BiometricGateProvider>
          <BiometricGate />
          <IntroSequence />
          <PageTransitionWrapper>
            <SmoothScrollProvider>
              <Navbar />
              {children}
              <ScrollToTop />
            </SmoothScrollProvider>
          </PageTransitionWrapper>
        </BiometricGateProvider>
      </body>
    </html>
  );
}
