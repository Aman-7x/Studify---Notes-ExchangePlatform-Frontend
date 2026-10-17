import React from "react";
import "./landing.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useLocation } from "react-router-dom";
const ContactSection = () => {
  const location = useLocation();
  return (
    <>
      {location?.pathname == "/contact" && (
        <div style={{ margin: "40px" }}>
          <Header />
        </div>
      )}
      <main className="landing-page">
        <section id="contact" className="contact-section">
          <div className="section-container">
            <h2>
              Contact <span className="highlight-text">Us</span>
            </h2>
            <p className="section-subtitle">
              We’d love to hear from you! Get in touch.
            </p>
            <div className="contact-wrapper">
              <form className="contact-form">
                <input type="text" placeholder="Your Name *" required />
                <input type="email" placeholder="Your Email *" required />
                <input type="text" placeholder="Subject *" required />
                <textarea
                  placeholder="Your Message *"
                  rows="5"
                  required
                ></textarea>
                <button type="submit" className="glow-button">
                  Send Message
                </button>
              </form>
              <div className="contact-info">
                <h3>Get in Touch</h3>
                <p>
                  <strong>Phone:</strong> +91 91114-40529
                </p>
                <p>
                  <strong>Email:</strong> support@studify.com
                </p>
                <p>
                  <strong>Address:</strong> Dewas, MP, India
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {location?.pathname == "/contact" && (
        <div style={{ margin: "40px" }}>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ContactSection;
