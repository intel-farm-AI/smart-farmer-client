import FloatingAboutButton from "../components/modal/aboutModal";
import { MainLayout } from "../layout/main";
import { Banner } from "./section/main/banner";
import { Describe } from "./section/main/describe";
import { Feature } from "./section/main/feature";
import { Howitworks } from "./section/main/howItWorks";
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
      <Howitworks />
      {/* Testimonial*/}
      <Testimoni />
      {/* Let's Join Us */}
      <Join />

      {/* about modal */}
      <div className="fixed bottom-4 right-4 z-50">
        <FloatingAboutButton />
      </div>

    </MainLayout>
  );
}