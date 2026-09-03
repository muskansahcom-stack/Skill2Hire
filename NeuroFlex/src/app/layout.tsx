import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "NeuroFlex - AI-Powered Adaptive Micro-Learning Platform",
  description:
    "Learn differently. Understand deeply. NeuroFlex transforms complex STEM concepts into visual explanations, real-world analogies and interactive questions.",
  keywords: [
    "EdTech",
    "Micro-Learning",
    "STEM Education",
    "Mermaid Diagrams",
    "Socratic Method",
    "Adaptive Learning",
    "WCAG Accessible",
  ],
  icons: {
    icon: "/neuroflex-logo.png",
    apple: "/neuroflex-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark text-size-normal">
      <body className="min-h-screen flex flex-col bg-[#06090f] text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <AccessibilityProvider>
            {/* Accessible Skip-to-Content Link */}
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>

            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
