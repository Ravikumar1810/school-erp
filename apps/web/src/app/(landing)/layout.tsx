import type { ReactNode } from "react";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({
  children,
}: LandingLayoutProps): React.JSX.Element {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-20">
        {children}
      </main>

      <Footer />
    </>
  );
}