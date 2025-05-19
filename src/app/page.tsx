
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/home/HeroSection";
import AboutSection from "@/components/sections/home/AboutSection";
import ServicesSection from "@/components/sections/home/ServicesSection";
import PointsSystemSection from "@/components/sections/home/PointsSystemSection";
import GetQuoteBanner from "@/components/sections/home/GetQuoteBanner";
import PricingSection from "@/components/sections/home/PricingSection";
import ContactFormSection from "@/components/sections/home/ContactSection";
import MapContactSection from "@/components/sections/home/MapContactSection";
import BlogSection from "@/components/sections/home/BlogSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PointsSystemSection />
        <GetQuoteBanner />
        <PricingSection />
        <MapContactSection />
        <BlogSection />
        <ContactFormSection /> {/* Moved to be last content section */}
      </main>
      <Footer />
    </>
  );
}
