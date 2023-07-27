import { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { darkModeAtom, currentStepAtom, registrationDataState } from "../atoms";
import RegisterButton from "./RegisterButton";
import { animated, useSpring } from "react-spring";

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
  };

  const validateInput = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (formData.firstname.trim().length === 0) {
      return "First name is required";
    }
    if (formData.lastname.trim().length === 0) {
      return "Last name is required";
    }
    if (!emailRegex.test(formData.email || "")) {
      return "Invalid email address";
    }
    if (formData.date === "" || formData.month === "" || formData.year === "") {
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
    ? "bg-gray-800 text-white"
    : "bg-green-500 hover:bg-green-600 text-white dark";
  const titleColor = "text-green-700";
  const errorStyles = errorMessage ? "border-red-500" : "";

  return (
    <>
      <animated.div
        className={`flex flex-col items-center py-40 px-8 ${darkModeStyles}`}
        style={fadeIn}
      >
        <h2 className={`font-bold text-2xl mb-6 ${titleColor}`}>Register</h2>
        <form className="w-full max-w-md">
          <div className="flex flex-wrap mb-4">
            <div className="w-1/2 pr-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-bold mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstName"
                className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
                value={formData?.firstname || ""}
                onChange={handleInput}
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-bold mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastName"
                className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
                value={formData?.lastname || ""}
                onChange={handleInput}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
              value={formData?.username || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
              value={formData?.email || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-bold mb-2">
              Date of Birth
            </label>
            <div className="flex space-x-2">
              <select
                name="date"
                id="date"
                className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
                value={formData?.date || ""}
                onChange={handleInput}
                required
              >
                {/* Date options */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              <select
                name="month"
                id="month"
                className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
                value={formData?.month || ""}
                onChange={handleInput}
                required
              >
                {/* Month options */}
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="year"
                id="year"
                className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
                value={formData?.year || ""}
                onChange={handleInput}
                required
              >
                {/* Year options */}
                {Array.from(
                  { length: 100 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <span className="block text-sm font-bold mb-2">Gender</span>
            <label htmlFor="male" className="mr-4">
              <input
                type="radio"
                name="gender"
                id="male"
                value="male"
                className={`mr-1 ${darkModeStyles}`}
                onChange={handleInput}
              />
              Male
            </label>
            <label htmlFor="female">
              <input
                type="radio"
                name="gender"
                id="female"
                value="female"
                className={`mr-1 ${darkModeStyles}`}
                onChange={handleInput}
              />
              Female
            </label>
            {/* Add other gender options if needed */}
          </div>
          {errorMessage && (
            <div className="mb-4">
              <p className="text-red-500 text-sm">{errorMessage}</p>
            </div>
          )}
        </form>
        <div className="mt-8 flex justify-between">
          <div className="w-1/2 pr-2">
            <RegisterButton
              onClick={handlePrevious}
              label="Previous"
              className="w-full"
            />
          </div>
          <div className="w-1/2 pl-2">
            <RegisterButton
              label="Next"
              onClick={handleNext}
              className={`w-full ${buttonStyles}`}
            />
          </div>
        </div>
      </animated.div>
    </>
  );
};

export default RegisterStepOne;
