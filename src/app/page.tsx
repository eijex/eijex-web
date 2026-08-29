import Nav from "@/app/components/Nav";
import AboutStrip from "@/app/components/AboutStrip";
import Hero from "@/app/components/Hero";
import Ecosystem from "@/app/components/Ecosystem";
import ImplementationStatus from "@/app/components/ImplementationStatus";
import Products from "@/app/components/Products";
import Research from "@/app/components/Research";
import ResearchNotesPreview from "@/app/components/ResearchNotesPreview";
import DataBoundary from "@/app/components/DataBoundary";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <AboutStrip />
      <Ecosystem />
      <ImplementationStatus />
      <Products />
      <Research />
      <ResearchNotesPreview />
      <DataBoundary />
      <Footer />
    </main>
  );
}
