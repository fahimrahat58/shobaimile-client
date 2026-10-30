import HeroSection from "@/app/home/HeroSection";
import ImpactSection from "@/app/home/ImpactSection";
import CategoriesSection from "@/app/home/CategoriesSection";
import UpcomingEventsSection from "@/app/home/UpcomingEventsSection";
import HowItWorksSection from "@/app/home/HowItWorksSection";
import CommunityGallerySection from "@/app/home/CommunityGallerySection";
import CommunityStoriesSection from "@/app/home/CommunityStoriesSection";
import CTASection from "@/app/home/CTASection";
import NewsletterSection from "@/app/home/NewsletterSection";

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
