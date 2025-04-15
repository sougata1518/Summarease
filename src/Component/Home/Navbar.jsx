import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "../Services/User";
import { doLogin } from "../Localstorage";
import { useNavigate } from "react-router-dom";
const CLIENT_ID = "1063873795909-9du6s0hvtl0gf27gqvncvqsnprforg2j.apps.googleusercontent.com";
//const REDIRECT_URI = "http://localhost:5173";
const REDIRECT_URI = "https://summarease-eight.vercel.app";

const Navbar = () => {

    const navigate = useNavigate()

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const code = decodeURIComponent(urlParams.get('code'));
        if(code!=null && code.length>5){
            // call server
            loginUser({codeStr:code}).then(response=>{
                doLogin(response,()=>{navigate("/")})
            }).catch(error => console.log(error))
        }
    },[]);

    const [showLogin, setShowLogin] = useState(false);

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleClose = () => {
        setShowLogin(false);
    };

    const handleGoogleLogin = () => {
        const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent`;

        window.location.href = googleAuthURL;
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
                            <button className="google-btn" onClick={handleGoogleLogin}>
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
