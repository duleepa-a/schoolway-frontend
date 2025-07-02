import Navbar from  "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhatWeOffer from "./components/WhatWeOffer";
import AppDetails from "./components/AppDetails";
import HomeInsightBanner from "./components/HomeInsightBanner";
import HomeInfoCards from "./components/HomeInfoCards";
import HomeTestimonials from "./components/HomeTestimonials";
import Footer from "./components/Footer";
import AppLink from "./components/AppLink";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default function Home() {
  // const session = await getServerSession(authOptions)
  return (
    <main>

      <HeroSection />
      <WhatWeOffer/>
      <AppDetails/>
      <HomeInsightBanner/>
      <HomeInfoCards/>
      <HomeTestimonials/>
      <AppLink/>
      <Footer/>
    </main>
  );
}
