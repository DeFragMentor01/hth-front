import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { motion, AnimatePresence } from "framer-motion";
import { darkModeAtom, showLoginFormAtom, userIsAuth } from "../atoms";
import LogoutButton from "./LogoutButton";
import { FiUser, FiMenu, FiX, FiHome, FiGrid, FiBarChart2, FiSun, FiMoon, FiLogIn, FiUserPlus } from 'react-icons/fi';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useRecoilState(darkModeAtom);
  const [showLoginForm, setShowLoginForm] = useRecoilState(showLoginFormAtom);
  const isAuthenticated = useRecoilValue(userIsAuth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    setShowLoginForm(true);
    navigate("/home");
    setIsMobileMenuOpen(false);
  };

  const handleRegister = () => {
    setShowLoginForm(false);
    navigate("/home");
    setIsMobileMenuOpen(false);
  };

  const handleToggleTheme = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ 
    to, 
    icon, 
    children 
  }) => (
    <Link
      to={to}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 text-gray-600"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <span className="text-xl">{icon}</span>
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                iTribe
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={<FiGrid />}>Dashboard</NavLink>
                <NavLink to="/userslist" icon={<FiUser />}>Users</NavLink>
                <NavLink to="/polls" icon={<FiBarChart2 />}>Polls</NavLink>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <FiLogIn />
                  <span>Login</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegister}
                  className="flex items-center space-x-2 px-6 py-2 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <FiUserPlus />
                  <span>Register</span>
                </motion.button>
              </>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
            </motion.button>

            {isAuthenticated && <LogoutButton />}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-4 py-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" icon={<FiGrid />}>Dashboard</NavLink>
                  <NavLink to="/userslist" icon={<FiUser />}>Users</NavLink>
                  <NavLink to="/polls" icon={<FiBarChart2 />}>Polls</NavLink>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <FiLogIn />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={handleRegister}
                    className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <FiUserPlus />
                    <span>Register</span>
                  </button>
                </>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleToggleTheme}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
                </button>
                {isAuthenticated && <LogoutButton />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
