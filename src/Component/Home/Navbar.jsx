import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleClose = () => {
    setShowLogin(false);
  };

  return (
    <>
      <nav className="navbar">
        <h2>My Dashboard</h2>
        <button className="login-btn" onClick={handleLoginClick}>
          Login
        </button>
      </nav>

      {showLogin && (
        <div className="login-overlay">
          <motion.div 
            className="login-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button className="close-icon" onClick={handleClose}>✖</button>
            <h3>Login</h3>
            <div className="google-login">
              <button className="google-btn">
                <FcGoogle size={22} className="google-icon" />
                Login with Google
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Navbar;
