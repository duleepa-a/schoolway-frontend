import Navbar from  "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhatWeOffer from "./components/WhatWeOffer";
import AppDetails from "./components/AppDetails";
import HomeInsightBanner from "./components/HomeInsightBanner";
import HomeInfoCards from "./components/HomeInfoCards";
import HomeTestimonials from "./components/HomeTestimonials";
import Footer from "./components/Footer";
import AppLink from "./components/AppLink";


export default function Home() {
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
