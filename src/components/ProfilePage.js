// ProfilePage.js
import React from 'react';
import { useAuth } from '../AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, darkMode } = useAuth();

  if (!user) {
    return <div className="profile-container">Please log in to view your profile.</div>;
  }

  const firstName = user.displayName?.split(' ')[0]?.toLowerCase() || '';
  const isFemale = ['sarah', 'emma', 'priya', 'anita', 'meena', 'isha', 'rachel'].includes(firstName);

  const fallbackAvatar = isFemale
    ? `${process.env.PUBLIC_URL}/female-avatar.png`
    : `${process.env.PUBLIC_URL}/male-avatar.png`;

  return (
    <div
      className="profile-page">
      <div className="profile-card">
        <img src={fallbackAvatar} alt="User Avatar" className="avatar" />
        <h2>{user.displayName}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
        <p><strong>Last Login:</strong> {user.metadata?.lastSignInTime || 'N/A'}</p>

        <button
          className="logout-button"
          onClick={logout}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: darkMode ? '#333' : '#007bff',
            color: '#fff',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;