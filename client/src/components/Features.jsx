import "./Features.css";

export default function Features() {
  const features = [
    {
      title: "Precise Measurements",
      description:
        "Our master tailors take detailed measurements to ensure the perfect fit for your unique body shape.",
    },
    {
      title: "Expert Craftsmanship",
      description:
        "Skilled artisans craft your garment using traditional techniques and premium materials.",
    },
    {
      title: "Quality Assurance",
      description:
        "Every piece undergoes rigorous quality checks to meet our exceptional standards.",
    },
    {
      title: "Timely Delivery",
      description:
        "Your custom garment is carefully packaged and delivered to your doorstep.",
    },
  ];

  return (
    <section className="features">
      <h2>Why Choose Us?</h2>
      <div className="feature-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
