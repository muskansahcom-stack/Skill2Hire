import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#06090f] text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
