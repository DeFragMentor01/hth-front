import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRecoilValue, useRecoilState } from "recoil";
import { darkModeAtom, currentStepAtom, registrationDataState } from "../atoms";
import { FiUser, FiMail, FiMapPin, FiCalendar, FiHome, FiCheck, FiX, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmationField: React.FC<{
  label: string;
  value: string | undefined;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => {
  const darkMode = useRecoilValue(darkModeAtom);
  
  return (
    <div className={`
      p-4 rounded-lg border
      ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
    `}>
      <div className="flex items-center space-x-3">
        <div className={`
          p-2 rounded-lg
          ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}
        `}>
          {icon}
        </div>
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {label}
          </p>
          <p className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value || 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const darkMode = useRecoilValue(darkModeAtom);
  const [currentForm, setCurrentForm] = useRecoilState(currentStepAtom);
  const formData = useRecoilValue(registrationDataState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrevious = () => {
    setCurrentForm((prevForm) => prevForm - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "/register",
        formData
      );

      if (response.data && response.data.message === "User registered successfully!") {
        setCurrentForm((prevForm) => prevForm + 1);
      } else {
        setError(response.data?.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message || 
        "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = () => {
    if (!formData.date || !formData.month || !formData.year) return undefined;
    return `${formData.date}/${formData.month}/${formData.year}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Review Your Information
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Please verify that all your information is correct before proceeding
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfirmationField
            label="First Name"
            value={formData.firstname}
            icon={<FiUser className="w-5 h-5" />}
          />
          <ConfirmationField
            label="Last Name"
            value={formData.lastname}
            icon={<FiUser className="w-5 h-5" />}
          />
        </div>

        <ConfirmationField
          label="Username"
          value={formData.username}
          icon={<FiUser className="w-5 h-5" />}
        />

        <ConfirmationField
          label="Email"
          value={formData.email}
          icon={<FiMail className="w-5 h-5" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfirmationField
            label="Date of Birth"
            value={formatDate()}
            icon={<FiCalendar className="w-5 h-5" />}
          />
          <ConfirmationField
            label="Gender"
            value={formData.gender}
            icon={<FiUser className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfirmationField
            label="Country"
            value={formData.country}
            icon={<FiMapPin className="w-5 h-5" />}
          />
          <ConfirmationField
            label="State/Province"
            value={formData.state}
            icon={<FiMapPin className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConfirmationField
            label="City"
            value={formData.city}
            icon={<FiMapPin className="w-5 h-5" />}
          />
          <ConfirmationField
            label="Tribe"
            value={formData.village}
            icon={<FiHome className="w-5 h-5" />}
          />
        </div>

        <ConfirmationField
          label="Community"
          value={formData.community}
          icon={<FiHome className="w-5 h-5" />}
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 p-4 text-red-600 text-sm"
        >
          <div className="flex items-center space-x-2">
            <FiAlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handlePrevious}
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
          onClick={handleSubmit}
          disabled={isLoading}
          className={`
            flex-1 py-3 px-4 rounded-lg font-medium text-white
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-700 hover:to-indigo-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            flex items-center justify-center space-x-2
            ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <span>Confirm & Register</span>
              <FiChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default RegisterConfirmation;
