import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { PageTransitionWrapper } from "@/components/ui/PageTransitionWrapper";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

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
  metadataBase: new URL("https://karkiaustin.com.np"),
  title: "Austin Karki | Interactive ML Portfolio",
  description: "High-end interactive portfolio of Austin Karki. Specialist in Machine Learning, Data Science, and Next.js development.",
  keywords: ["Austin Karki", "Interactive Portfolio", "Machine Learning Developer", "Data Scientist", "Next.js 15 Portfolio"],
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
        <PageTransitionWrapper>
          <SmoothScrollProvider>
            <Navbar />
            {children}
            <ScrollToTop />
          </SmoothScrollProvider>
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
