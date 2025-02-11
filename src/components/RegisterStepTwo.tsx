import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRecoilValue, useRecoilState } from "recoil";
import { currentStepAtom, darkModeAtom, registrationDataState } from "../atoms";
import { FiMapPin, FiHome, FiGlobe, FiMap, FiUsers, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';

// Define the props for the input component, including an onChange handler
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: "text" | "select";
  options?: string[];
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
}

// Move the InputField component outside of RegisterStepTwo.
// It uses the darkMode from recoil for styling.
const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  icon,
  placeholder,
  type = "text",
  options,
  onChange,
}) => {
  const darkMode = useRecoilValue(darkModeAtom);
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
    <div>
      <label htmlFor={name} className={labelClasses}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {type === "text" ? (
          <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputClasses} pl-10`}
          />
        ) : (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`${inputClasses} pl-10`}
          >
            <option value="">{placeholder}</option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

const villages: string[] = [
  "Reuben", "Simeon", "Levi", "Judah", "Dan", "Naphtali",
  "Gad", "Asher", "Issachar", "Zebulun", "Joseph", "Benjamin",
];

const RegisterStepTwo: React.FC = () => {
  const darkMode = useRecoilValue(darkModeAtom);
  const [currentForm, setCurrentForm] = useRecoilState(currentStepAtom);
  const [formData, setFormData] = useRecoilState(registrationDataState);
  const [errors, setErrors] = useState({
    country: "",
    city: "",
    village: "",
    state: "",
    community: "",
  });

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: "",
    }));
  };

  const handlePrevious = () => {
    setCurrentForm((prevForm) => prevForm - 1);
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    let newErrors = {
      country: "",
      city: "",
      village: "",
      community: "",
      state: "",
    };
    let hasErrors = false;

    if (!formData.country?.trim()) {
      newErrors.country = "Please select your country";
      hasErrors = true;
    }
    if (!formData.city?.trim()) {
      newErrors.city = "Please enter your city";
      hasErrors = true;
    }
    if (!formData.village) {
      newErrors.village = "Please select your village";
      hasErrors = true;
    }
    if (!formData.state?.trim()) {
      newErrors.state = "Please enter your state";
      hasErrors = true;
    }
    if (!formData.community?.trim()) {
      newErrors.community = "Please enter your community";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      setCurrentForm((prevForm) => prevForm + 1);
    }
  };

  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Country"
            name="country"
            value={formData.country || ""}
            icon={<FiGlobe className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />}
            placeholder="Enter your country"
            onChange={handleInput}
          />
          
          <InputField
            label="State/Province"
            name="state"
            value={formData.state || ""}
            icon={<FiMap className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />}
            placeholder="Enter your state"
            onChange={handleInput}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="City"
            name="city"
            value={formData.city || ""}
            icon={<FiMapPin className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />}
            placeholder="Enter your city"
            onChange={handleInput}
          />
          
          <InputField
            label="Tribe"
            name="village"
            value={formData.village || ""}
            icon={<FiHome className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />}
            placeholder="Select your village"
            type="select"
            options={villages}
            onChange={handleInput}
          />
        </div>

        <InputField
          label="Community"
          name="community"
          value={formData.community || ""}
          icon={<FiUsers className={`h-5 w-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />}
          placeholder="Enter your community"
          onChange={handleInput}
        />

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

export default RegisterStepTwo;
