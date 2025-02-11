import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { registrationDataState, currentStepAtom, darkModeAtom } from "../atoms";
import RegisterStepOne from './RegisterStepOne';
import RegisterStepTwo from './RegisterStepTwo';
import RegisterConfirmation from './RegisterConfirmation';
import RegisterUserType from './RegisterUserType';
import RegisterCompleteSuccess from './RegisterCompleteSucess';
import RegisterPassword from './RegisterPassword';
import { FiUser, FiMail, FiLock, FiCheck } from 'react-icons/fi';

const steps = [
  { title: 'Account Type', icon: FiUser },
  { title: 'Personal Info', icon: FiMail },
  { title: 'Additional Info', icon: FiUser },
  { title: 'Security', icon: FiLock },
  { title: 'Confirmation', icon: FiCheck }
];

const RegisterForm: React.FC = () => {
  const formData = useRecoilValue(registrationDataState);
  const currentStep = useRecoilValue(currentStepAtom);
  const darkMode = useRecoilValue(darkModeAtom);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <RegisterUserType />;
      case 1:
        return <RegisterStepOne />;
      case 2:
        return <RegisterStepTwo />;
      case 3:
        return <RegisterPassword />;
      case 4:
        return <RegisterConfirmation />;
      case 5:
        return <RegisterCompleteSuccess />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-xl
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
      `}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create Your Account
        </h2>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Join our community and start your journey
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.slice(0, 5).map((step, index) => (
            <React.Fragment key={step.title}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: index <= currentStep ? 
                      (darkMode ? '#3B82F6' : '#2563EB') : 
                      (darkMode ? '#374151' : '#E5E7EB'),
                    scale: index === currentStep ? 1.1 : 1
                  }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${index <= currentStep ? 'text-white' : 'text-gray-400'}
                  `}
                >
                  <step.icon className="w-5 h-5" />
                </motion.div>
                <span className={`
                  mt-2 text-xs font-medium
                  ${index <= currentStep ? 
                    (darkMode ? 'text-blue-400' : 'text-blue-600') : 
                    (darkMode ? 'text-gray-500' : 'text-gray-400')}
                `}>
                  {step.title}
                </span>
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: index < currentStep ? 
                      (darkMode ? '#3B82F6' : '#2563EB') : 
                      (darkMode ? '#374151' : '#E5E7EB')
                  }}
                  className="flex-1 h-1 mx-4"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          custom={currentStep}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Step Indicator */}
      {currentStep < 5 && (
        <div className="mt-8 text-center">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Step {currentStep + 1} of 5
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RegisterForm;
