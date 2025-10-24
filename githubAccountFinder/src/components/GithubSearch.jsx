import React, { useState } from 'react';
import axios from 'axios';
import './GithubSearch.css';

// Utility function to format date from 'YYYY-MM-DDTHH:MM:SSZ' to 'M/D/YYYY'
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

const GithubSearch = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username.');
      setUserData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);

    try {
      const url = `https://api.github.com/users/${username.trim()}`;
      const response = await axios.get(url);
      setUserData(response.data);
      
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`User "${username.trim()}" not found.`);
      } else {
        setError('Error fetching data. Check your network or try again.');
        console.error('API Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchUserProfile();
    }
  };

  const ProfileCard = ({ user }) => {
    // Fallback for null values, as shown in the screenshot
    const name = user.name || user.login || 'N/A';
    const login = user.login || 'N/A';
    const joinedDate = formatDate(user.created_at);
    const location = user.location || 'N/A';
    const twitterUsername = user.twitter_username ? `@${user.twitter_username}` : 'N/A';
    const blog = user.blog || 'N/A';
    
    // Check if the user has a GitHub URL before showing the button
    const githubProfileUrl = user.html_url;

    return (
      <div className="profile-card">
        {/* Header/Basic Info */}
        <div className="profile-header">
          <img src={user.avatar_url} alt={`${name}'s avatar`} className="avatar" />
          <div className="info">
            <h2 className="profile-name">{name}</h2>
            <p className="profile-login">@{login}</p>
          </div>
          <span className="joined-date">Joined: {joinedDate}</span>
        </div>

        {/* Stats Section */}
        <div className="stats-box">
          <div className="stat-item">
            <span className="stat-label">Repositories</span>
            <span className="stat-value">{user.public_repos ?? 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Followers</span>
            <span className="stat-value">{user.followers ?? 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Following</span>
            <span className="stat-value">{user.following ?? 0}</span>
          </div>
        </div>

        {/* Location & Links */}
        <div className="links-section">
          {/* Location */}
          <div className="link-item">
            <i className="fas fa-map-marker-alt"></i> {/* Font Awesome location icon */}
            <span>{location}</span>
          </div>
          {/* Twitter (or Blog if Twitter is not available, following common detective layouts) */}
          <div className="link-item">
             <i className="fab fa-twitter"></i> {/* Font Awesome Twitter icon */}
            <span>{twitterUsername}</span>
          </div>
          
           {/* Company/Blog (using a simple placeholder for the company icon for now) */}
          <div className="link-item">
            <i className="fas fa-building"></i> {/* Font Awesome building icon */}
            <span>{user.company || 'N/A'}</span>
          </div>
          
           {/* Blog URL */}
          <div className="link-item">
            <i className="fas fa-link"></i> {/* Font Awesome link icon */}
            <span>{blog || 'N/A'}</span>
          </div>
        </div>

        {/* View Profile Button */}
        {githubProfileUrl && (
          <a 
            href={githubProfileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="view-profile-button"
          >
            <i className="fab fa-github"></i> View Profile
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="github-search-container">
       {/* NOTE: You need to include Font Awesome in your index.html 
          for the icons (fas fa-...) to work, e.g.:
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
       */}
      
      <h1 className="title">GitHub Profile Detective</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Github Username...."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <button
          onClick={fetchUserProfile}
          className="search-button"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <p className="message">Fetching profile...</p>}
      {error && <p className="message error">{error}</p>}
      
      {/* Render the Profile Card if data is available */}
      {userData && <ProfileCard user={userData} />}
      
    </div>
  );
};

export default GithubSearch;