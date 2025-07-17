import React from "react";
import "./Footer.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faArrowUp } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <p className="footer-credit">Designed & Developed by <strong>Parth Sharma</strong></p>
  
        <div className="footer-icons">
          <div className="tooltip">
            <a href="https://github.com/ParthShxrma" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-icon github">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <span className="tooltip-text">GitHub</span>
          </div>
  
          <div className="tooltip">
            <a href="https://www.linkedin.com/in/parth-sharma-176b3a2aa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon linkedin">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <span className="tooltip-text">LinkedIn</span>
          </div>
  
          <div className="tooltip">
            <a href="mailto:psharma66846@gmail.com" aria-label="Email" className="social-icon gmail">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
            <span className="tooltip-text">Email</span>
          </div>
        </div>
  
        <button className="back-to-top" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} /> Back to Top
        </button>
  
        <small>© {new Date().getFullYear()} InvoPro. All rights reserved.</small>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
