import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import RegisterStepOne from './RegisterStepOne';
import RegisterStepTwo from './RegisterStepTwo';
import { registrationDataState, currentStepAtom } from "../atoms";
import RegisterConfirmation from './RegisterConfirmation';
import RegisterUserType from './RegisterUserType';
import RegisterCompleteSuccess from './RegisterCompleteSucess';
import RegisterPassword from './RegisterPassword';

const RegisterForm: React.FC = () => {
  const formData = useRecoilValue(registrationDataState);
  const currentStep = useRecoilValue(currentStepAtom);
  
  
  return (
    <div>
      {currentStep === 0 && <RegisterUserType />}
      {currentStep === 1 && <RegisterStepOne />}
      {currentStep === 2 && <RegisterStepTwo />}
      {currentStep === 3 && <RegisterPassword />}
      {currentStep === 4 && <RegisterConfirmation />}
      {currentStep === 5 && <RegisterCompleteSuccess />}
    </div>
  );
};

export default RegisterForm;
