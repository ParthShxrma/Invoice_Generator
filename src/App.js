import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InvoiceForm from "./components/InvoiceForm";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./AuthContext";
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />

      <Routes>
        
        <Route
          path="/"
          element={
            <div className="landing-page">
              <div
                className="hero"
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/hero.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  minHeight: "80vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 20px",
                  position: "relative",
                }}
              >
                <div className="hero-overlay">
                  {user && <h3 className="user-name">Hi there, {user.displayName}</h3>}
                  <h1>Welcome to InvoPro</h1>
                  <p>The easiest way to generate clean, professional invoices.</p>
                </div>
              </div>

              
              <section className="features">
                <div className="feature">
                  <h2>Easy to Use</h2>
                  <p>No learning curve. Fill in your details and generate invoices instantly.</p>
                </div>

                <div className="feature">
                  <h2>Secure and Reliable</h2>
                  <p>Your invoice data stays on your device. No cloud storage, full control.</p>
                  <img src={`${process.env.PUBLIC_URL}/features.jpg`} alt="Secure and Reliable" />
                </div>

                <div className="feature">
                  <h2>Customizable Templates</h2>
                  <p>Personalize your invoice layout, colors, and branding in seconds.</p>
                </div>
              </section>

              
              <section className="testimonials">
                <h2>What Our Users Say</h2>
                <p>
                  "InvoPro saves me hours of formatting invoices every month. It's
                  clean, efficient, and professional!"
                </p>
              </section>
            </div>
          }
        />

        
        <Route
          path="/invoice"
          element={
            <div className="App">
              <InvoiceForm />
            </div>
          }
        />

        
        <Route
          path="/dashboard"
          element={
            <div className="App">
              <Dashboard />
            </div>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;