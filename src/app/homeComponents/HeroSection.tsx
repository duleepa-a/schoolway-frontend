'use client';

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <div
      className="absolute -right-25 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <svg
        className="w-6 h-6 text-gray-700 hover:text-gray-900"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <div
      className="absolute -left-25 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <svg
        className="w-6 h-6 text-gray-700 hover:text-gray-900"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
}

const heroSlides = [
  {
    title: "Welcome to SchoolWay",
    subtitle: "Secure, Tracked, and Smiling All the Way!",
    description: "Find your trusted van provider and track your child's journey live.",
    image: "/illustrations/heroimage.png",
  },
  {
    title: "Streamline Your School Rides",
    subtitle: "Efficient routes. Verified drivers.",
    description: "Make school transport safer and easier than ever.",
    image: "/illustrations/heroimage.png",
  },
  {
    title: "Stay Notified. Stay Relaxed.",
    subtitle: "Real-time alerts & tracking",
    description: "Parents and schools get notified instantly.",
    image: "/illustrations/heroimage.png",
  },
];

export default function HeroSection() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3300,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="bg-gray-50 py-16 px-4 md:px-20 relative w-full">
      <div className="max-w-7xl mx-auto">
        <Slider {...settings}>
          {heroSlides.map((slide, index) => (
            <div key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold text-gray-800">{slide.title}</h1>
                  <p className="text-xl font-semibold text-gray-700">{slide.subtitle}</p>
                  <p className="text-gray-600">{slide.description}</p>
                  <Link href="/register">
                    <button className="btn-primary">
                      Register
                    </button>
                  </Link>
                </div>
                <div className="flex justify-center">
                  <Image
                    src={slide.image}
                    alt="Hero Slide"
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
