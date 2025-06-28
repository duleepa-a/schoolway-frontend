
import HeroSection from "./homeComponents/HeroSection";
import WhatWeOffer from "./homeComponents/WhatWeOffer";
import AppDetails from "./homeComponents/AppDetails";
import HomeInsightBanner from "./homeComponents/HomeInsightBanner";
import HomeInfoCards from "./homeComponents/HomeInfoCards";
import HomeTestimonials from "./homeComponents/HomeTestimonials";
import Footer from "./components/Footer";
import AppLink from "./homeComponents/AppLink";
import Navbar from "./components/Navbar";


export default function Home() {
  return (
    <main>
      <Navbar/>
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
