import React from "react";
import "./landing.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useLocation } from "react-router-dom";
const PlansSection = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname == "/plans" && (
        <div style={{ margin: "40px" }}>
          <Header />
        </div>
      )}
      <main className="landing-page">
        <section id="plans" className="plans-section">
          <div className="section-container">
            <h2>
              Upgrade Your <span className="highlight-text">Learning</span>
            </h2>
            <p className="section-subtitle">
              Take your study experience to the next level with our premium
              features.
            </p>
            <div className="plan-card-container">
              <div className="magic-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h3>Premium Plan</h3>
                    <p>Hover to see details</p>
                    <div className="price-tag">$9.99/mo</div>
                  </div>
                  <div className="flip-card-back">
                    <h3>What You Get</h3>
                    <ul>
                      <li>Access to all exclusive notes</li>
                      <li>Ad-free experience</li>
                      <li>Priority support</li>
                      <li>Downloadable resources</li>
                    </ul>
                    <a href="#contact" className="glow-button">
                      Upgrade Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {location.pathname == "/plans" && (
        <div style={{ margin: "40px" }}>
          <Footer />
        </div>
      )}
    </>
  );
};

export default PlansSection;
