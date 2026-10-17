// Incorrect import
// Correct imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import videoSrc from "./video3.mp4";
import Search from "../search/Search";
import Footer from "../footer/Footer";
import Header from "../header/Header";

const HeroSection = () => {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() !== "") {
      navigate(`/home?q=${query}`);
    }
  };

  return (
    <>
      <section id="home" className="hero-section">
        <video autoPlay muted loop playsInline preload="metadata" poster="/path-to-lightweight-preview-image.jpg" className="hero-back-video">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight-text">Studify</span>
          </h1>
          <p className="hero-subtitle">
            A modern hub for notes, organized material, and a hassle-free
            learning experience.
          </p>
          <div className="hero-search-wrapper">
            <Search value={query} onChange={setQuery} onSubmit={handleSearch} />
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
