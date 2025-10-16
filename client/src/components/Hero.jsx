import "./Hero.css";
import bgImage from "../assets/wardrobe.jpg";

export default function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Vastraa Vogue</h1>
        <p className="hero-caption">"Your Style, Your Size, Delivered"</p>
      </div>
    </section>
  );
}
