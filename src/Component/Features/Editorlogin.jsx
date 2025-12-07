import React, { useState } from 'react';
import { useAccessCard } from '../Globalvariable/Accessprovider';
import { useNavigate } from 'react-router-dom';
import { createEditor } from '../Services/Editor';
import { isLoggedIn } from '../Localstorage'

const Editorlogin = () => {
  const [code, setCode] = useState("");
  // const { generatedLink, setGeneratedLink } = useAccessCard();
  const navigate = useNavigate();
  const { setNotification } = useAccessCard();
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);

  const showNotification = (msg, type) => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleJoin = () => {
    if (!isLoggedIn()) {
      showNotification("Login first", "warning")
      return
    }
    if (code.trim()) {
      navigate(`/text-editor/${code.trim()}`);
    }
  };

  const handleCreateLater = () => {
    if (!isLoggedIn()) {
      showNotification("Login first", "warning")
      return
    }
    const newLink =
      Math.random().toString(36).substring(2, 6) + "-" +
      Math.random().toString(36).substring(2, 6) + "-" +
      Math.random().toString(36).substring(2, 6);

    console.log(newLink)

    createEditor({
      editorId: newLink,
      deltaJson: "{\"ops\":[{\"insert\":\"\\n\"}]}"
    }, () => navigate(`/text-editor/${newLink}`));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 w-full max-w-md md:max-w-lg lg:max-w-xl text-center flex flex-col space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Create new document</h1>
        <p className="text-gray-600 text-sm sm:text-base">Connect, collaborate, and start writing</p>
        <button onClick={handleCreateLater} className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
          New Document
        </button>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input type="text" placeholder="Enter a code or link" value={code} onChange={(e) => setCode(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none"
          />
          <button onClick={handleJoin} disabled={!code.trim()} className={`px-4 py-2 rounded-md text-white ${code.trim() ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editorlogin;
