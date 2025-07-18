import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InvoiceForm from "./components/InvoiceForm";
import Dashboard from "./components/Dashboard";
import TestimonialSlider from "./components/TestimonialSlider";
import ProfilePage from "./components/ProfilePage"; 
import { useAuth } from "./AuthContext";
import { AiFillCheckCircle, AiFillLock, AiFillSetting } from "react-icons/ai";
import "./App.css";

function App() {
  const { user, darkMode } = useAuth();

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
                  backgroundColor: darkMode ? "#181818" : "#f0f8ff",
                  minHeight: "60vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 20px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="shape shape1"></div>
                <div className="shape shape2"></div>
                <div className="shape shape3"></div>
                <div className="shape shape4"></div>

                <div className="hero-overlay">
                  {user && (
                    <h3 className="user-name">
                      {(() => {
                        const hour = new Date().getHours();
                        const greeting =
                          hour < 12
                            ? "Good Morning"
                            : hour < 18
                            ? "Good Afternoon"
                            : "Good Evening";
                        return `${greeting}, ${user.displayName}`;
                      })()}
                    </h3>
                  )}
                  <h1>Welcome to InvoPro</h1>
                  <p>The easiest way to generate clean, professional invoices.</p>
                </div>
              </div>

              <section className="features">
                <div className="feature">
                  <AiFillCheckCircle className="feature-icon" />
                  <h2>Easy to Use</h2>
                  <p>No learning curve. Fill in your details and generate invoices instantly.</p>
                  <img
                    src={`${process.env.PUBLIC_URL}/easy-to-use.jpg`}
                    alt="Easy To Use"
                    className="feature-image"
                  />
                </div>

                <div className="feature">
                  <AiFillLock className="feature-icon" />
                  <h2>Secure and Reliable</h2>
                  <p>Your invoice data stays on your device. No cloud storage, full control.</p>
                  <img
                    src={`${process.env.PUBLIC_URL}/features.jpg`}
                    alt="Secure and Reliable"
                    className="feature-image"
                  />
                </div>

                <div className="feature">
                  <AiFillSetting className="feature-icon" />
                  <h2>Customizable Templates</h2>
                  <p>Personalize your invoice layout, colors, and branding in seconds.</p>
                  <img
                    src={`${process.env.PUBLIC_URL}/customizable-templates.jpg`}
                    alt="Customizable Templates"
                    className="feature-image"
                  />
                </div>
              </section>

              
              <TestimonialSlider />
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

        
        <Route
          path="/profile"
          element={
            <div className="App">
              <ProfilePage />
            </div>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;