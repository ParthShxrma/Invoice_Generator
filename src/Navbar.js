import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { FaSun, FaMoon, FaBars, FaChevronDown } from "react-icons/fa";
import { useAuth } from "./AuthContext";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, login, logout } = useAuth();

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <nav className="navbar" style={{ backgroundColor: darkMode ? "#181818" : "#fff" }}>
      <div className="navbar-container">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          Invo<span>Pro</span>
        </NavLink>

        <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu} className="nav-link">
            Home
          </NavLink>
          <NavLink to="/dashboard" onClick={closeMenu} className="nav-link">
            Dashboard
          </NavLink>
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            style={{ color: darkMode ? "#f1f1f1" : "#333" }}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {user ? (
            <div className="user-dropdown">
              <button
                className="user-toggle"
                onClick={toggleDropdown}
                style={{ color: darkMode ? "#f1f1f1" : "#333" }}
              >
                {user.displayName.split(" ")[0]} <FaChevronDown />
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={logout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={login}
              className="auth-btn"
              style={{ color: darkMode ? "#f1f1f1" : "#333" }}
            >
              Login
            </button>
          )}

          <button
            className="menu-toggle"
            onClick={toggleMobileMenu}
            style={{ color: darkMode ? "#f1f1f1" : "#333" }}
          >
            <FaBars />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;