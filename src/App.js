import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import InvoiceForm from "./components/InvoiceForm";

function App() {
  const [posts] = useState([
    {
      username: "By- Parth Sharma",
      timestamp: new Date(),
    },
  ]);

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Homepage Route */}
        <Route
          path="/"
          element={
            <div>
              <center>
                <h1>Invoice Generation Software</h1>
              </center>

              <img
                src="logo512.png"
                alt="Secure and Reliable"
                style={{ maxWidth: "40%", borderRadius: "8px", float: "right" }}
              />

              <section className="features">
                <div className="feature">
                  <h2>Easy to Use</h2>
                  <p>Intuitive and user-friendly interface for quick invoicing.</p>
                </div>
                <div className="feature">
                  <h2>Customizable Templates</h2>
                  <p>Create professional invoices with customizable templates.</p>
                </div>
                <div className="feature text-with-image">
                  <div style={{ float: "left", marginRight: "20px" }}>
                    <h2>Secure and Reliable</h2>
                    <p>Your data is safe and transactions are securely processed.</p>
                  </div>
                </div>
              </section>

              <section className="testimonials">
                <h2>What Our Users Say</h2>
                <p>
                  "The invoice generation software has streamlined our billing process.
                  It's a game-changer!"
                </p>
              </section>

              <section className="cta">
                <h2>Start Invoicing Today</h2>
                <p>
                  Experience the convenience of our invoice generation software. Get
                  started now!
                </p>

                {/* Link to Invoice Generator Page */}
                <Link to="/invoice">
                  <button style={{ marginTop: "20px", padding: "10px 20px" }}>
                    Go to Invoice Generator
                  </button>
                </Link>
              </section>
            </div>
          }
        />

        {/* Invoice Generator Page */}
        <Route
          path="/invoice"
          element={
            <div className="App">
              <h2 style={{ textAlign: "center", marginTop: "20px" }}>Generate Your Invoice</h2>
              <InvoiceForm />
            </div>
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;