import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../Services/User";
import { doLogin } from "../Localstorage";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const REDIRECT_URI = "http://localhost:5173";

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = decodeURIComponent(urlParams.get("code"));
        if (code && code.length > 5) {
            loginUser({ codeStr: code })
                .then((response) => doLogin(response, () => navigate("/")))
                .catch(console.error);
        }
    }, []);

    const handleGoogleLogin = () => {
        const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent`;
        window.location.href = googleAuthURL;
    };

    return (
        <>
            <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between relative">
                <div className="text-xl font-bold">My Dashboard</div>
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FaTimes className="cursor-pointer" size={22} /> : <FaBars className="cursor-pointer" size={22} />}
                    </button>
                </div>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6 items-center">
                    <NavLinks />
                </div>
                <div className="hidden md:block">
                    <button onClick={() => {setShowLogin(true);}} className="bg-slate-700 px-4 py-1.5 rounded hover:bg-slate-600">
                        Login
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-slate-800 text-white px-6 py-4 flex flex-col gap-4 z-30 overflow-hidden"
                    >
                        <NavLinks />
                        <button
                            onClick={() => setShowLogin(true)}
                            className="bg-slate-700 px-5 py-2 rounded hover:bg-slate-600 min-w-[100px] cursor-pointer"
                        >
                            Login
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {showLogin && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.3)]  flex items-center justify-center z-50"
                    onClick={() => setShowLogin(false)}
                >
                    <motion.div
                        className="bg-white rounded-lg p-6 w-80 text-center shadow-xl relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-gray-800 text-lg" onClick={() => setShowLogin(false)} aria-label="Close Login Modal">✖</button>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Login</h3>
                        <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer">
                            <FcGoogle size={22} /> Login with Google
                        </button>
                    </motion.div>
                </div>
            )}
        </>
    );
};

const NavLinks = () => (
    <>
        <NavLink to="/" className={({ isActive }) => `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`}>
            Home
        </NavLink>
        <NavLink to="/edit-text" className={({ isActive }) => `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`}>
            Text Editor
        </NavLink>
        <NavLink to="/enhance" className={({ isActive }) => `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`}>
            Enhance with AI
        </NavLink>
    </>
);

export default Navbar;
