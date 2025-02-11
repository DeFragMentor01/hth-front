import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeAtom, userIsAuth, loginEmailAtom, loginPasswordAtom, rememberMeAtom } from "../atoms";
import axios, { AxiosError } from 'axios';
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const darkMode = useRecoilValue(darkModeAtom);
  const setUserAuth = useSetRecoilState(userIsAuth);
  const [email, setEmail] = useRecoilState(loginEmailAtom);
  const [password, setPassword] = useRecoilState(loginPasswordAtom);
  const [rememberMe, setRememberMe] = useRecoilState(rememberMeAtom);
  const [errors, setErrors] = useState<string[]>([]);
  const isAuthenticated = useRecoilValue(userIsAuth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const rememberMeStatus = localStorage.getItem("rememberMe");
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (rememberMeStatus === "true" && storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, [setEmail, setPassword, setRememberMe]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const errors: string[] = [];

    if (!email.trim()) {
      errors.push("Email is required");
    }

    if (!password.trim()) {
      errors.push("Password is required");
    }

    if (errors.length === 0) {
      try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL + '/login', {
          email: email,
          password: password
        });

        if (response.data && response.data.message === 'User authenticated successfully!') {
          setUserAuth(true);

          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
          } else {
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("email");
            localStorage.removeItem("password");
          }

          navigate("/dashboard");
        } else {
          setErrors([response.data?.message || "Authentication failed"]);
          setEmail("");
          setPassword("");
        }
      } catch (error: unknown) {
        console.log('Login error:', error);
        const axiosError = error as AxiosError;
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          setErrors([
            typeof errorData === 'string' 
              ? errorData 
              : (errorData as any).message || "An error occurred during login"
          ]);
        } else {
          setErrors(["An error occurred during login"]);
        }
        setEmail("");
        setPassword("");
      }
    } else {
      setErrors(errors);
    }
    setIsLoading(false);
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    ${darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}
  `;

  const labelClasses = `
    block text-sm font-medium mb-1
    ${darkMode ? "text-gray-300" : "text-gray-700"}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
      `}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Sign in to continue to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors([]);
              }}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors([]);
              }}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-50 p-4 text-red-600 text-sm"
          >
            <div className="flex items-center space-x-2">
              <FiAlertCircle className="h-5 w-5" />
              <div>
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className={`ml-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Remember me
            </span>
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
            onClick={() => alert("Forgot password?")}
          >
            Forgot password?
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-700 hover:to-indigo-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transform transition-all duration-200
            flex items-center justify-center
            ${isLoading ? "opacity-75 cursor-not-allowed" : ""}
          `}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Sign In"
          )}
        </motion.button>

        <div className="text-center mt-6">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Don't have an account?{" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => alert("Register")}
            >
              Create an account
            </motion.button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;
