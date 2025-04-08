import React, { useState } from 'react';

const Editorlogin = () => {
  const [code, setCode] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const handleJoin = () => {
    if (code.trim()) {
      alert(`Joining meeting with code/link: ${code}`);
    }
  };

  const handleCreateLater = () => {
    // Simulate generating a link
    // const newLink = "https://meet.google.com/" + Math.random().toString(36).substring(2, 6) + "-" +
    const newLink = Math.random().toString(36).substring(2, 6) + "-" +
      Math.random().toString(36).substring(2, 6) + "-" +
      Math.random().toString(36).substring(2, 6);
    setGeneratedLink(newLink);
    setShowLinkDropdown(true);
    setShowDropdown(false);
  };

  const handleCreateNow = () => {
    alert("Creating an instant meeting...");
    setShowDropdown(false);
  };

  const handleNewMeeting = () => {
    setShowDropdown(!showDropdown);
    setShowLinkDropdown(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="video-meeting-page">
      <h1 className="heading">Meetings for everyone</h1>
      <p className="description">Connect, collaborate, and start writing</p>

      <div className="meeting-controls">
        <button onClick={handleNewMeeting} className="new-meeting-btn">
          New meeting
        </button>

        <div className="join-container">
          <input
            type="text"
            placeholder="Enter a code or link"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="join-input"
          />
          <button
            onClick={handleJoin}
            disabled={!code.trim()}
            className="join-btn"
          >
            Join
          </button>
        </div>

        {showDropdown && (
          <div className="dropdown-menu">
            <button onClick={handleCreateLater} className="dropdown-item">
              📅 Create a meeting for later
            </button>
            <hr />
            <button onClick={handleCreateNow} className="dropdown-item">
              ⚡ Create an instant meeting
            </button>
          </div>
        )}

        {showLinkDropdown && (
          <>
            <div className="overlay" />
            <div className="link-dropdown">
              <button className="close-btn" onClick={() => setShowLinkDropdown(false)}>✖</button>
              <p><strong>Here's your joining info</strong></p>
              <p>Send this to people you want to meet with. Be sure to save it so you can use it later.</p>
              <div className="link-box">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="meeting-link-input"
                />
                <button onClick={handleCopy} className="copy-btn">📋</button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Editorlogin;
