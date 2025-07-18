import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./ProfileDropdown.css";
import { FaUser, FaFileInvoice, FaSignOutAlt } from "react-icons/fa"; // ⬅️ Icons imported

const ProfileDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen(!open);

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button className="profile-toggle" onClick={toggleDropdown}>
        👤 {user.displayName} ▼
      </button>
      {open && (
        <div className="dropdown-menu">
          <div onClick={() => navigate("/profile")}>
            <FaUser className="dropdown-icon" /> View Profile
          </div>
          <div onClick={() => navigate("/dashboard")}>
            <FaFileInvoice className="dropdown-icon" /> My Invoices
          </div>
          <div onClick={logout}>
            <FaSignOutAlt className="dropdown-icon" /> Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;