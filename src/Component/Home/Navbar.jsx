import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser } from "../Services/User";
import { doLogin, isLoggedIn, doLogout } from "../Localstorage";
import { useAccessCard } from "../Globalvariable/Accessprovider";

const CLIENT_ID = "1063873795909-9du6s0hvtl0gf27gqvncvqsnprforg2j.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173";

const Navbar = () => {
    const { setNotification } = useAccessCard();
    const [showLogin, setShowLogin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const showNotification = (msg,type) => {
        setNotification({message:msg,type})
        setTimeout(() => setNotification(null),3000);
    }

    useEffect(() => {
        const data = localStorage.getItem("user-innovator");
        if (data) setUser(JSON.parse(data));
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = decodeURIComponent(urlParams.get("code") || "");
        if (code && code.length > 5) {
            loginUser({ codeStr: code })
                .then((response) => {
                    doLogin(response, () => {
                        setUser(response);
                        showNotification("Login Successful","success")
                        navigate("/");
                    });
                })
                .catch((err) => showNotification("Login failed...", "error"));
        }
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGoogleLogin = () => {
        const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent`;
        window.location.href = googleAuthURL;
    };

    const handleLogout = () => {
        doLogout();
        setUser(null);
        setMenuOpen(!menuOpen)
        showNotification("Logout Successful","success")
        navigate("/");
    };

    return (
        <>
            <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between relative">
                <div className="text-xl font-bold">My Dashboard</div>

                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer">
                        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                    </button>
                </div>

                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6 items-center">
                    <NavLinks />
                </div>

                <div className="hidden md:block">
                    {!user ? (
                        <button
                            onClick={() => setShowLogin(true)}
                            className="bg-slate-700 px-4 py-1.5 rounded hover:bg-slate-600"
                        >
                            Login
                        </button>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <img
                                src={user.pfpLink}
                                alt="profile"
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-4 z-50">
                                    <div className="font-semibold mb-2">{user.username}</div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-slate-800 text-white px-6 py-4 flex flex-col gap-4 z-30"
                    >
                        {user ? (
                            <div className="flex items-center gap-3 border-t pt-4 border-slate-600">
                                <img
                                    src={user.pfpLink}
                                    alt="profile"
                                    className="w-10 h-10 rounded-full border border-white"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold text-white">{user.username}</p>
                                    <p className="text-sm text-slate-400">{user.email}</p>
                                </div>
                            </div>
                        ) : null}
                        <NavLinks />
                        {!user ? (
                            <button
                                onClick={() => { setShowLogin(true); setMenuOpen(!menuOpen); }}
                                className="bg-slate-700 px-5 py-2 rounded hover:bg-slate-600"
                            >
                                Login
                            </button>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 px-5 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {showLogin && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50"
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
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => setShowLogin(false)}
                        >
                            ✖
                        </button>
                        <h3 className="text-xl font-semibold mb-4">Login</h3>
                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                        >
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
        <NavLink
            to="/"
            onClick={() => setMenuOpen(!menuOpen)}
            className={({ isActive }) =>
                `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`
            }
        >
            Home
        </NavLink>
        <NavLink
            to="/edit-text"
            onClick={() => setMenuOpen(!menuOpen)}
            className={({ isActive }) =>
                `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`
            }
        >
            Text Editor
        </NavLink>
        <NavLink
            to="/enhance"
            onClick={() => setMenuOpen(!menuOpen)}
            className={({ isActive }) =>
                `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`
            }
        >
            Enhance with AI
        </NavLink>
    </>
);

export default Navbar;