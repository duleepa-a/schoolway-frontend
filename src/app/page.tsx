
import HeroSection from "./homeComponents/HeroSection";
import WhatWeOffer from "./homeComponents/WhatWeOffer";
import AppDetails from "./homeComponents/AppDetails";
import HomeInsightBanner from "./homeComponents/HomeInsightBanner";
import HomeInfoCards from "./homeComponents/HomeInfoCards";
import HomeTestimonials from "./homeComponents/HomeTestimonials";
import Footer from "./components/Footer";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppLink from "./homeComponents/AppLink";
import Navbar from "./components/Navbar";

import Authprovider from "./AuthenticatorComp/provider";


export default function Home() {
  // const session = await getServerSession(authOptions)
  return (
    <main>
      <Authprovider>
        <Navbar/>
      </Authprovider>
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
