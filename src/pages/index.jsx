import FloatingAboutButton from "../components/modal/aboutModal";
import { MainLayout } from "../layout/main";
import { Banner } from "./section/main/banner";
import { Describe } from "./section/main/describe";
import { Feature } from "./section/main/feature";
import { HowItWorks } from "./section/main/howItWorks";
import Join from "./section/main/join";
import { Testimoni } from "./section/main/Testimoni";

export function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <Banner />
      {/* Main Feature */}
      <Feature />
      {/* About Smart Farm */}
      <Describe />
      {/* How It Works */}
      <HowItWorks />
      {/* Testimonial*/}
      <Testimoni />
      {/* Let's Join Us */}
      <Join />

      {/* Floating About Button - Positioned to avoid interference */}
      <div className="fixed bottom-6 right-6 z-[9999] lg:bottom-8 lg:right-8">
        {/* Safe zone container to prevent overlap with other floating elements */}
        <div className="relative">
          {/* Invisible collision detection area */}
          <div className="absolute -inset-4 pointer-events-none" />
          
          <FloatingAboutButton />
        </div>
      </div>

      {/* Optional: Add some padding to main content to ensure button doesn't cover important content on smaller screens */}
      <div className="h-20 sm:h-16 md:h-0" />
    </MainLayout>
  );
}