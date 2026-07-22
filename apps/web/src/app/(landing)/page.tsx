import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingPage(): React.JSX.Element {
  return (
    <>
      <HeroSection />

      <FeaturesSection />

      <DashboardPreview />

      <WorkflowSection />

      <CTASection />
    </>
  );
}