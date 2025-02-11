import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  darkModeAtom,
  currentStepAtom,
  registrationDataState,
} from "../atoms";
import { FiLock, FiEye, FiEyeOff, FiChevronLeft, FiChevronRight, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

const RegisterPassword: React.FC = () => {
  const [currentForm, setCurrentForm] = useRecoilState(currentStepAtom);
  const [formData, setFormData] = useRecoilState(registrationDataState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const darkMode = useRecoilValue(darkModeAtom);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrorMessage(null);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setErrorMessage(null);
  };

  const validatePassword = (password: string) => {
    const requirements = [
      { test: /.{8,}/, message: "At least 8 characters" },
      { test: /[A-Z]/, message: "One uppercase letter" },
      { test: /[a-z]/, message: "One lowercase letter" },
      { test: /[0-9]/, message: "One number" },
      { test: /[^A-Za-z0-9]/, message: "One special character" },
    ];

    return requirements.map(req => ({
      message: req.message,
      valid: req.test.test(password)
    }));
  };

  const handleNext = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const validationResults = validatePassword(password);
    if (validationResults.some(result => !result.valid)) {
      setErrorMessage("Password does not meet all requirements");
      return;
    }

    setFormData((prevState) => ({ ...prevState, password }));
    setCurrentForm(currentForm + 1);
    setErrorMessage(null);
    setPassword("");
    setConfirmPassword("");
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

  const passwordRequirements = validatePassword(password);

  return (
    <div className="space-y-6">
      <form onSubmit={handleNext} className="space-y-6">
        {/* Password Field */}
        <div>
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className={`${inputClasses} pl-10 pr-10`}
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <motion.div 
          initial={false}
          animate={{ height: password ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            {passwordRequirements.map((req, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 text-sm
                  ${req.valid 
                    ? (darkMode ? 'text-green-400' : 'text-green-600')
                    : (darkMode ? 'text-gray-400' : 'text-gray-600')
                  }`}
              >
                {req.valid ? (
                  <FiCheck className="h-4 w-4" />
                ) : (
                  <FiX className="h-4 w-4" />
                )}
                <span>{req.message}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className={labelClasses}>
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your password"
              className={`${inputClasses} pl-10 pr-10`}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-50 p-4 text-red-600 text-sm"
          >
            <div className="flex items-center space-x-2">
              <FiAlertCircle className="h-5 w-5" />
              <span>{errorMessage}</span>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setCurrentForm(currentForm - 1)}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium
              border-2 border-blue-600 text-blue-600
              hover:bg-blue-50 transition-colors
              flex items-center justify-center space-x-2
            `}
          >
            <FiChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium text-white
              bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              flex items-center justify-center space-x-2
              ${!passwordRequirements.every(req => req.valid) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!passwordRequirements.every(req => req.valid)}
          >
            <span>Continue</span>
            <FiChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPassword;
