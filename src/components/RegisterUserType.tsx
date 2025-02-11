import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkModeAtom, currentStepAtom, registrationDataState } from "../atoms";
import { FiUser, FiUsers, FiStar, FiAlertCircle } from 'react-icons/fi';

const RegisterUserType: React.FC = () => {
  const [memberType, setMemberType] = useRecoilState(registrationDataState);
  const [currentState, setCurrentState] = useRecoilState(currentStepAtom);
  const darkMode = useRecoilValue(darkModeAtom);
  const [error, setError] = useState("");

  const handleTypeSelect = (type: "community member" | "community leader") => {
    setMemberType((prevState) => ({
      ...prevState,
      memberType: type,
    }));
    setError("");
  };

  const handleNext = () => {
    if (!memberType.memberType) {
      setError("Please select a member type to continue");
      return;
    }
    setError("");
    setCurrentState((prevState) => prevState + 1);
  };

  const TypeCard: React.FC<{
    type: "community member" | "community leader";
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = ({ type, title, description, icon }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleTypeSelect(type)}
      className={`
        w-full p-6 rounded-xl text-left transition-all duration-200
        ${memberType.memberType === type
          ? 'bg-blue-600 text-white shadow-lg'
          : `${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} 
             ${darkMode ? 'text-white' : 'text-gray-900'}`
        }
        ${error && !memberType.memberType ? 'border-2 border-red-500' : 'border-2 border-transparent'}
      `}
    >
      <div className="flex items-start space-x-4">
        <div className={`
          p-3 rounded-lg
          ${memberType.memberType === type
            ? 'bg-white/20'
            : `${darkMode ? 'bg-gray-700' : 'bg-white'}`
          }
        `}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className={`text-sm ${
            memberType.memberType === type
              ? 'text-white/80'
              : (darkMode ? 'text-gray-400' : 'text-gray-600')
          }`}>
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <TypeCard
          type="community member"
          title="Community Member"
          description="Join as a regular member to connect with others and participate in community activities."
          icon={<FiUsers className="w-6 h-6" />}
        />
        
        <TypeCard
          type="community leader"
          title="Community Leader"
          description="Join as a leader to create and manage communities, organize events, and guide members."
          icon={<FiStar className="w-6 h-6" />}
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

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-white
          bg-gradient-to-r from-blue-600 to-indigo-600
          hover:from-blue-700 hover:to-indigo-700
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          transform transition-all duration-200
          flex items-center justify-center space-x-2
        `}
      >
        <span>Continue</span>
        <FiUser className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default RegisterUserType;
