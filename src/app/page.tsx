import Nav from "@/app/components/Nav";
import AboutStrip from "@/app/components/AboutStrip";
import Hero from "@/app/components/Hero";
import AccessOptions from "@/app/components/AccessOptions";
import StatsBar from "@/app/components/StatsBar";
import Products from "@/app/components/Products";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <AboutStrip />
      <Hero />
      <AccessOptions />
      <StatsBar />
      <Products />
      <Footer />
    </main>
  );
}
