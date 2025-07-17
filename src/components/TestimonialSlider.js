import React, { useEffect, useRef, useState } from "react";
import "../App.css"; // Adjusted path

const testimonials = [
  {
    name: "Aryan Singh",
    text: "InvoPro made my freelancing life so much easier. Simple, fast, and elegant!",
    rating: 5
  },
  {
    name: "Priya Desai",
    text: "Beautiful UI and flawless PDF invoices. Highly recommended for small businesses!",
    rating: 4
  },
  {
    name: "Rahul Mehta",
    text: "The dashboard and invoice generator are perfect. Love the dark mode support!",
    rating: 4
  },
  {
    name: "Sneha Kapoor",
    text: "Invoices look so professional now! And I love how responsive the app is.",
    rating: 5
  },
  {
    name: "Vikram Iyer",
    text: "Everything is stored perfectly with Firebase. Peace of mind guaranteed!",
    rating: 5
  },
];

function TestimonialSlider() {
  const sliderRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    let scrollAmount = 0;

    const slide = () => {
      if (!slider || paused) return;
      scrollAmount += 0.5; 
      if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
        scrollAmount = 0;
      }
      slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
    };

    const intervalId = setInterval(slide, 16);
    return () => clearInterval(intervalId);
  }, [paused]);

  return (
    <section
      className="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="section-title">What Our Users Say</h2>
      <div className="testimonial-slider-bar" ref={sliderRef}>
      {[...testimonials, ...testimonials].map((item, index) => (
       <div className="testimonial-card" key={index}>
      <p>"{item.text}"</p>
      <strong style={{ display: "block", marginTop: "10px" }}>
        – {item.name}
        </strong>
        <div style={{ marginTop: "8px", fontSize: "1.2rem", color: "#FFD700"}}>
            {"⭐️".repeat(item.rating)}
        </div>
     </div>
  ))}
    </div>
    </section>
  );
}

export default TestimonialSlider;