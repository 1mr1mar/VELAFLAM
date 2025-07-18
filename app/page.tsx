import { HeroSection } from "@/components/hero-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { NewArrivals } from "@/components/new-arrivals"
import { FeaturedProducts } from "@/components/featured-products"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhyChooseUs />
      <NewArrivals />
      <FeaturedProducts />
      <ContactSection />
    </div>
  )
}
