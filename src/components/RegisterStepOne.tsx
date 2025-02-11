import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRecoilValue, useRecoilState } from "recoil";
import { darkModeAtom, currentStepAtom, registrationDataState } from "../atoms";
import { FiUser, FiMail, FiCalendar, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';

const RegisterStepOne: React.FC = () => {
  const [currentForm, setCurrentForm] = useRecoilState(currentStepAtom);
  const [formData, setFormData] = useRecoilState(registrationDataState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const darkMode = useRecoilValue(darkModeAtom);

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrorMessage(null);
  };

  const validateInput = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (!formData.firstname?.trim()) {
      return "First name is required";
    }
    if (!formData.lastname?.trim()) {
      return "Last name is required";
    }
    if (!emailRegex.test(formData.email || "")) {
      return "Invalid email address";
    }
    if (!formData.date || !formData.month || !formData.year) {
      return "Date of birth is required";
    }
    if (formData.gender !== "male" && formData.gender !== "female") {
      return "Gender is required";
    }

    return null;
  };

  const handlePrevious = () => {
    setCurrentForm((prevForm) => prevForm - 1);
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const validationResult = validateInput();
    if (validationResult === null) {
      setCurrentForm((prevForm) => prevForm + 1);
      setErrorMessage(null);
    } else {
      setErrorMessage(validationResult);
    }
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
    <div className="space-y-6">
      <form className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstname" className={labelClasses}>
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              </div>
              <input
                type="text"
                name="firstname"
                id="firstname"
                placeholder="Enter your first name"
                className={`${inputClasses} pl-10`}
                value={formData.firstname || ""}
                onChange={handleInput}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastname" className={labelClasses}>
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              </div>
              <input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Enter your last name"
                className={`${inputClasses} pl-10`}
                value={formData.lastname || ""}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>

        {/* Username Field */}
        <div>
          <label htmlFor="username" className={labelClasses}>
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Choose a username"
              className={`${inputClasses} pl-10`}
              value={formData.username || ""}
              onChange={handleInput}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className={`${inputClasses} pl-10`}
              value={formData.email || ""}
              onChange={handleInput}
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="date" className={labelClasses}>
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              </div>
              <select
                name="date"
                id="date"
                className={`${inputClasses} pl-10`}
                value={formData.date || ""}
                onChange={handleInput}
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <select
              name="month"
              className={inputClasses}
              value={formData.month || ""}
              onChange={handleInput}
            >
              <option value="">Month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
            <select
              name="year"
              className={inputClasses}
              value={formData.year || ""}
              onChange={handleInput}
            >
              <option value="">Year</option>
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gender Selection */}
        <div>
          <label className={labelClasses}>Gender</label>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInput({ target: { name: 'gender', value: 'male' } } as any)}
              className={`
                p-4 rounded-lg text-left transition-all duration-200 flex items-center space-x-3
                ${formData.gender === 'male'
                  ? 'bg-blue-600 text-white'
                  : `${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
                border-2 ${formData.gender === 'male' ? 'border-blue-600' : 'border-transparent'}
              `}
            >
              <FiUser className="w-5 h-5" />
              <span>Male</span>
            </motion.button>
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInput({ target: { name: 'gender', value: 'female' } } as any)}
              className={`
                p-4 rounded-lg text-left transition-all duration-200 flex items-center space-x-3
                ${formData.gender === 'female'
                  ? 'bg-blue-600 text-white'
                  : `${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}
                border-2 ${formData.gender === 'female' ? 'border-blue-600' : 'border-transparent'}
              `}
            >
              <FiUser className="w-5 h-5" />
              <span>Female</span>
            </motion.button>
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
            type="button"
            onClick={handleNext}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium text-white
              bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              flex items-center justify-center space-x-2
            `}
          >
            <span>Continue</span>
            <FiChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default RegisterStepOne;
