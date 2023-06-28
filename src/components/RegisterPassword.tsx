import { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  darkModeAtom,
  currentStepAtom,
  registrationDataState,
} from "../atoms";
import RegisterButton from "./RegisterButton";
import { animated, useSpring } from "react-spring";

const RegisterPassword: React.FC = () => {
  const [currentForm, setCurrentForm] = useRecoilState(currentStepAtom);
  const [formData, setFormData] = useRecoilState(registrationDataState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const darkMode = useRecoilValue(darkModeAtom);

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setFormData((prevState) => ({ ...prevState, password }));
    setCurrentForm(currentForm + 1);
    setErrorMessage(null);
    setPassword("");
    setConfirmPassword("");
  };

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
  });

  const darkModeStyles = darkMode
    ? "bg-gray-800 text-white"
    : "bg-gray-200 text-green-700";
  const inputStyles = darkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-green-700";
    const buttonStyles = darkMode
    ? "bg-green-500 hover:bg-green-600 text-white"
    : "bg-green-200 hover:bg-green-300 text-green-700";
  
  const titleColor = "text-green-700";
  const errorStyles = "text-red-500 text-sm";

  return (
    <animated.div
      className={`flex flex-col items-center justify-center h-screen py-40 px-8 ${darkModeStyles}`}
      style={fadeIn}
    >
      <h2 className={`font-bold text-2xl mb-6 ${titleColor}`}>Register</h2>
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        {errorMessage && (
          <div className="mb-4">
            <p className={errorStyles}>{errorMessage}</p>
          </div>
        )}
        <div className="mt-8 flex justify-between">
          <RegisterButton
            onClick={() => setCurrentForm(currentForm - 1)}
            label="Previous"
            className={`mr-4 ${buttonStyles}`}
          />
          <RegisterButton
            label="Next"
            type="submit"
            className={`ml-auto ${buttonStyles}`}
          />
        </div>
      </form>
    </animated.div>
  );
};

export default RegisterPassword;
