// src/pages/LandingPage/LandingPage.js
import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import HeroSection from "./HeroSection";
import PlansSection from "./PlansSection";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import "./landing.css";

const LandingPage = () => {
  return (
    <>
      <Header />
      <main className="landing-page">
        <HeroSection />
        <AboutSection />
        <PlansSection />
        <ContactSection />
      </main>
      <div style={{ margin: "40px" }}>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
