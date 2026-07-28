import Nav from "@/app/components/Nav";
import AboutStrip from "@/app/components/AboutStrip";
import Hero from "@/app/components/Hero";
import AccessOptions from "@/app/components/AccessOptions";
import Objective from "@/app/components/Objective";
import Products from "@/app/components/Products";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <AccessOptions />
      <AboutStrip />
      <Objective />
      <Products />
      <Footer />
    </main>
  );
}
