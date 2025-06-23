'use client';
import { useState, useEffect } from 'react';

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    currency: 'US Dollar',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:8000/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    alert(data.status || data.detail);
  };

  const fetchProfile = async () => {
    const res = await fetch(`http://localhost:8000/profile/${profile.email}`);
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20, border: '1px solid #ccc', borderRadius: 10 }}>
      <h2 style={{ textAlign: 'center' }}>Settings</h2>

      <label>User Profile</label>
      <input type="text" name="name" value={profile.name} onChange={handleChange} placeholder="Name" style={inputStyle} />
      <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Email" style={inputStyle} />

      <label>Change Password</label>
      <input type="password" name="password" value={profile.password} onChange={handleChange} placeholder="Password" style={inputStyle} />

      <label>Preferences</label>
      <select name="currency" value={profile.currency} onChange={handleChange} style={inputStyle}>
        <option value="US Dollar">US Dollar</option>
        <option value="INR">INR</option>
        <option value="Euro">Euro</option>
      </select>

      <button onClick={handleSubmit} style={buttonStyle}>Save</button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '6px 0',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '12px',
  backgroundColor: '#1E3A8A',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
