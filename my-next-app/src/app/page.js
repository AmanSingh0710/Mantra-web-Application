//src/app/page.js
"use client";


import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TopPicks from "@/components/TopPicks";
import ShopBy from "@/components/ShopBy";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import StoryPage from "./story/page";
import Blogs from "@/components/Blogs";
import ShopByCategory from "@/components/ShopByCategory";
import Newsletter from "@/components/Newsletter";
import Reviews from "@/components/Reviews";




export default function Home() {

  return (
    <>
      <Header />
     
      <Hero />
      <TopPicks />
       <ShopByCategory />
      <ShopBy />
      <Banner />
       <StoryPage />
       <Reviews />
       <Blogs />
       <Newsletter />
       <Footer />  
    </>
  );
}
