// import React, { useState, useEffect } from "react";
// import "./Home.css";
import Hero from "../components/Hero"; 
import About from "../components/About";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";


// import NotificationBox from "../components/NotificationBox";


const Home = () => {
  

  return (
    <>
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <Contact />
    </>
  );
};

export default Home;