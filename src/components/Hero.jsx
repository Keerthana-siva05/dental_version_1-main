"use client"

import { useState, useEffect } from "react"
import image1 from "/src/assets/images/image1.png";
import teethImage from "/src/assets/images/teeth.jpg";
import envi from "/src/assets/images/eniv.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { image: image1, title: "Welcome to Dental Hospital", subtitle: "Your Health, Our Priority" },
    { image: teethImage, title: "Expert Dental Care", subtitle: "State-of-the-Art Facilities" },
    { image: envi, title: "Comfortable Environment", subtitle: "Relaxing Atmosphere for All Patients" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative h-screen">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">{slide.title}</h2>
              <p className="text-xl md:text-2xl animate-fade-in-up animation-delay-300">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Hero

