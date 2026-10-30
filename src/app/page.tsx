import HeroSection from "@/app/home/HeroSection";
import ImpactSection from "@/home/ImpactSection";
import CategoriesSection from "@home/CategoriesSection";
import UpcomingEventsSection from "@/home/UpcomingEventsSection";
import HowItWorksSection from "/home/HowItWorksSection";
import CommunityGallerySection from "@/home/CommunityGallerySection";
import CommunityStoriesSection from "@/home/CommunityStoriesSection";
import CTASection from "@/home/CTASection";
import NewsletterSection from "@/home/NewsletterSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ImpactSection />
      <CategoriesSection />
      <UpcomingEventsSection />
      <HowItWorksSection />
      <CommunityGallerySection />
      <CommunityStoriesSection />
      <CTASection />
      <NewsletterSection />
    </main>
  );
}