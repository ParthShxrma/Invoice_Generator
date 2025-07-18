import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaSun, FaMoon, FaBars, FaChevronDown } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "./AuthContext";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, login, logout } = useAuth();

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const tabs = ["/", "/dashboard"];
  const activeIndex = tabs.indexOf(location.pathname);

  return (
    <nav className="navbar" style={{ backgroundColor: darkMode ? "#181818" : "#fff" }}>
      <div className="navbar-container">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          Invo<span>Pro</span>
        </NavLink>

        <div className={`tab-nav ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={`tab-link ${location.pathname === "/" ? "active-tab" : ""}`}
            onClick={closeMenu}
          >
            <AiFillHome className="tab-icon" /> Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={`tab-link ${location.pathname === "/dashboard" ? "active-tab" : ""}`}
            onClick={closeMenu}
          >
            <MdDashboard className="tab-icon" /> Dashboard
          </NavLink>
          <span
            className="tab-slider"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
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
            <div className="user-dropdown" ref={dropdownRef}>
              <button
                className="user-toggle"
                onClick={toggleDropdown}
                style={{ color: darkMode ? "#f1f1f1" : "#333" }}
              >
                {user.displayName.split(" ")[0]} <FaChevronDown />
              </button>
              {showDropdown && (
                <div className="dropdown-menu animate-dropdown">
                  <button onClick={() => navigate("/profile")} className="dropdown-item">
                    View Profile
                  </button>
                  <button onClick={() => navigate("/dashboard")} className="dropdown-item">
                    My Invoices
                  </button>
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