import React, { useState } from 'react';
import { useAccessCard } from '../Globalvariable/Accessprovider';
import { useNavigate } from 'react-router-dom';
import { createEditor } from '../Services/Editor';

const Editorlogin = () => {
  const [code, setCode] = useState("");
  const { generatedLink, setGeneratedLink } = useAccessCard();
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);

  const handleJoin = () => {
    if (code.trim()) {
      // alert(`Joining meeting with code/link: ${code}`);
      navigate(`/text-editor/${code.trim()}`)
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
    // createEditor({
    //   "editorId": newLink,
    //   "deltaJson": "{\"ops\":[{\"insert\":\"\\n\"}]}"
    // },()=>{navigate(`/text-editor/${newLink}`)})

    // change
    navigate(`/text-editor/${newLink}`)
  };



  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
  };

  return (
    <div className="video-meeting-page">
    <div className="meeting-card">
      <h1 className="heading">Meetings for everyone</h1>
      <p className="description">Connect, collaborate, and start writing</p>

      <div className="meeting-controls">
        <button onClick={handleCreateLater} className="new-meeting-btn">
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
  </div>
  );
};

export default Editorlogin;
