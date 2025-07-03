import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import VisualPreview from '@/components/sections/VisualPreview';
import Testimonials from '@/components/sections/Testimonials';
// import Pricing from '@/components/sections/Pricing';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <VisualPreview />
      <Features />
      <Testimonials />
      {/* <Pricing /> */}
      <Footer />
    </main>
  );
}
