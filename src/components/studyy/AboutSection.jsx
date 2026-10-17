import React from "react";
import aboutImage from "./imageOpti03.png";
import { FaBookOpen, FaBolt, FaUsers } from "react-icons/fa";
import "./landing.css";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { useLocation } from "react-router-dom";
const SpotlightCard = ({ icon, title, children }) => {
  const handleMouseMove = (e) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="feature-card" onMouseMove={handleMouseMove}>
      <div className="feature-card-content">
        {icon}
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname == "/about" && (
        <div style={{ margin: "40px" }}>
          <Header />
        </div>
      )}
      <main className="landing-page">
        <section id="about" className="about-section">
          <div className="section-container">
            <h2>
              About <span className="highlight-text">Us</span>
            </h2>
            <p className="section-subtitle">Your Learning, Our Mission.</p>
            <div className="about-grid">
              <div className="about-image-container">
                <img src={aboutImage} alt="Studify platform" />
              </div>
              <div className="about-features">
                <SpotlightCard icon={<FaBookOpen />} title="Organized Notes">
                  Structured notes and guides that save you time.
                </SpotlightCard>
                <SpotlightCard icon={<FaBolt />} title="Fast & Easy">
                  Quick access to resources for hassle-free learning.
                </SpotlightCard>
                <SpotlightCard icon={<FaUsers />} title="Student Friendly">
                  A platform built keeping students’ needs in mind.
                </SpotlightCard>
              </div>
            </div>
          </div>
        </section>
      </main>

      {location.pathname == "/about" && (
        <div style={{ margin: "40px" }}>
          <Footer />
        </div>
      )}
    </>
  );
};

export default AboutSection;
