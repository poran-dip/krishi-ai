import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/landing/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <HeroSection />
      
      <main className="flex flex-col items-center space-y-4">
        
      </main>
      <Footer />
    </div>
  );
}
