import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="hero-content">
          <h1>Vastraa Vogue</h1>
          <p className="theme">"Your Style, Your Size, Delivered!"</p>
        </div>
      </section>

      <section className="about-story">
        <h2>Bridging Tradition with Modern Convenience</h2>
        <p>
          Vastraa Vogue was born from a simple yet powerful idea: to merge the
          timeless art of traditional tailoring with the ease of modern
          e-commerce. We believe that everyone deserves to wear clothes that are
          made exclusively for them, fitting their body and their style
          perfectly. We eliminate the guesswork of standard sizes and bring the
          personalized experience of a boutique tailor right to your fingertips.
        </p>
      </section>

      <section className="how-it-works">
        <h2>How It Works: A Seamless Experience</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Select Your Style</h3>
            <p>
              Browse our diverse collection of clothing for men and women and
              choose the product you love.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Provide Your Measurements</h3>
            <p>
              When you proceed to buy, our intuitive online form will guide you
              in providing your precise measurements.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Order & Relax</h3>
            <p>
              Once your order is accepted, our expert tailors get to work,
              stitching your garment to perfection.
            </p>
          </div>
        </div>
      </section>

      <section className="our-promise">
        <h2>Our Unwavering Promise</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Precise Measurements</h3>
            <p>
              Every garment is crafted based on your unique measurements for a
              flawless, comfortable fit.
            </p>
          </div>
          <div className="feature-card">
            <h3>Expert Craftsmanship</h3>
            <p>
              Our skilled artisans, both men and women, bring years of
              tailoring experience to every stitch.
            </p>
          </div>
          <div className="feature-card">
            <h3>Quality Assurance</h3>
            <p>
              From the finest fabrics to the final stitch, each piece undergoes
              rigorous quality checks.
            </p>
          </div>
          <div className="feature-card">
            <h3>Timely Delivery</h3>
            <p>
              Your custom-made outfit is carefully packaged and delivered right
              to your doorstep, right on time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;