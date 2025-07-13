import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    image:
      "/carausel1.png",
    title: "Stripy Zig Zag Jigsaw Pillow and Duvet Set",
  },
  {
    image:
      "/carausel2.png",
    title: "Real Bamboo Wall Clock",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?auto=format&fit=crop&w=1600&q=80",
    title: "Brown and Blue Hardbound Book",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Otomatis berganti slide setiap 5 detik
  useEffect(() => {
    let slideInterval;
    
    if (isAutoPlaying) {
      slideInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };
  }, [isAutoPlaying]);

  // Pause autoplay saat user berinteraksi dengan carousel
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    
    // Restart autoplay setelah 10 detik tidak ada interaksi
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full  h-[70vh] overflow-hidden bg-gray-100">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center flex items-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="ml-8 md:ml-20 lg:ml-32">
              <h2 className="text-2xl md:text-3xl font-medium text-[#606C38] mb-2">
                {slide.title}
              </h2>
              <a
                href="#"
                className="text-[#606C38] border-b border-gray-600 hover:text-black"
              >
                view product
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Arrow Left */}
      <button
        onClick={() => {
          prevSlide();
          handleUserInteraction();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black hover:bg-black hover:text-white p-2 rounded-full shadow-md z-20"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Arrow Right */}
      <button
        onClick={() => {
          nextSlide();
          handleUserInteraction();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black hover:bg-black hover:text-white p-2 rounded-full shadow-md z-20"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full ${
              idx === current ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => {
              setCurrent(idx);
              handleUserInteraction();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
