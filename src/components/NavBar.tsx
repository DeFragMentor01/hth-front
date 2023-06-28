import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkModeAtom, showLoginFormAtom, userIsAuth } from "../atoms";
import LogoutButton from "./LogoutButton";
import { FaUser, FaTable, FaSun, FaMoon, FaTachometerAlt, FaPoll } from 'react-icons/fa';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const navigate = useNavigate(); // Get the useNavigate hook
  const [darkMode, setDarkMode] = useRecoilState(darkModeAtom);
  const [showLoginForm, setShowLoginForm] = useRecoilState(showLoginFormAtom);
  const isAuthenticated = useRecoilValue(userIsAuth);

  const handleLogin = () => {
    setShowLoginForm(true);
    navigate("/home"); // Redirect to "/home" on login
  };

  const handleRegister = () => {
    setShowLoginForm(false);
    navigate("/home"); // Redirect to "/home" on register
  };

  const handleToggleTheme = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const getButtonClassNames = () => {
    let classNames = `px-4 py-2 rounded-md hover:bg-green-600 hover:text-white inline-flex items-center space-x-2`;

    if (darkMode) {
      classNames += " bg-gray-700 text-gray-100";
    } else {
      classNames += " bg-green-500 text-white";
    }

    return classNames;
  };

  return (
    <nav className={`flex justify-between items-center p-4 ${
      darkMode ? "bg-gray-900 text-white" : "bg-green-700 text-white"
    }`}>
      <Link to="/" className="font-bold text-xl">
        iTribe
      </Link>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={getButtonClassNames()} title="Dashboard">
              <FaTachometerAlt size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/userslist" className={getButtonClassNames()} title="Users List">
              <FaTable size={20} />
              <span>Users List</span>
            </Link>
            <Link to="/polls" className={getButtonClassNames()} title="Polls">
              <FaPoll size={20} />
              <span>Polls</span>
            </Link>
          </>
        ) : (
          <>
            <button className={getButtonClassNames()} onClick={handleLogin} title="Login">
              <span>Login</span>
            </button>
            <button className={getButtonClassNames()} onClick={handleRegister} title="Register">
              <span>Register</span>
            </button>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button
          className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            darkMode ? "bg-gray-700 text-gray-100" : "bg-green-500 text-white"
          } hover:bg-green-600`}
          onClick={handleToggleTheme}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>
        {isAuthenticated && <LogoutButton />}
      </div>
    </nav>
  );
};

export default NavBar;
