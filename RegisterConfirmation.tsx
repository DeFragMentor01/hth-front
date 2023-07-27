import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  registrationDataState,
  darkModeAtom,
  currentStepAtom,
} from "../atoms";
import axios from "axios";
import { animated, useSpring } from "react-spring";

const RegisterConfirmation = () => {
  const [userRegistrationData, setUserRegistrationData] = useRecoilState(
    registrationDataState
  );
  const [currentForm, setCurrentForm] = useRecoilState<number>(currentStepAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Combine the date, month, and year fields into a single date string
    const dateOfBirth = `${userRegistrationData.year}-${userRegistrationData.month}-${userRegistrationData.date}`;

    // Prepare the data to send in the request
    const requestData = {
      ...userRegistrationData,
      dateofbirth: dateOfBirth,
    };
    console.log(requestData);
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(process.env.REACT_APP_BASE_URL +'/register', requestData);

      if (response.data.message.includes("User registered successfully!")) {
        setCurrentForm((prevForm) => prevForm + 1); // Increment the currentStep by 1
      } else {
        setError("Registration unsuccessful");
      }
    } catch (error) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setUserRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrevious = () => {
    setCurrentForm((prevForm) => prevForm - 1);
  };

  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });

  const darkMode = useRecoilValue<boolean>(darkModeAtom);
  const darkModeStyles = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-200 text-green-700";

  return (
    <div className={`flex justify-center items-center ${darkMode ? "bg-gray-900" : "bg-gray-200"}`}>
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <animated.div className={`flex flex-col items-center py-8 px-8 ${darkModeStyles}`} style={fadeIn}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="w-1/2 pr-2 mb-4">
            <label htmlFor="firstName" className="block text-sm font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.firstname || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="w-1/2 pl-2 mb-4">
            <label htmlFor="lastName" className="block text-sm font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.lastname || ""}
              onChange={handleInput}
              required
            />
          </div>
          {/* Rest of the form fields */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.username || ""}
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
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.email || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.password || ""}
              onChange={handleInput}
              required
            />
          </div>
          {/* Date of Birth Fields */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-bold mb-2">
              Date of Birth
            </label>
            <div className="flex space-x-2">
              <select
                name="date"
                id="date"
                className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
                value={userRegistrationData?.date || ""}
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
                className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
                value={userRegistrationData?.month || ""}
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
                className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
                value={userRegistrationData?.year || ""}
                onChange={handleInput}
                required
              >
                {/* Year options */}
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Gender Field */}
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
                checked={userRegistrationData?.gender === "male"}
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
                checked={userRegistrationData?.gender === "female"}
              />
              Female
            </label>
            {/* Add other gender options if needed */}
          </div>
          {/* Tribe Field */}
          <div className="mb-4">
            <label htmlFor="village" className="block text-sm font-bold mb-2">
              Village
            </label>
            <input
              type="text"
              name="village"
              id="village"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.village || ""}
              onChange={handleInput}
              required
            />
          </div>
          {/* Community Field */}
          <div className="mb-4">
            <label htmlFor="community" className="block text-sm font-bold mb-2">
              Community
            </label>
            <input
              type="text"
              name="community"
              id="community"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.community || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-bold mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.city || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="state" className="block text-sm font-bold mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.state || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-bold mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${darkMode ? "border-green-300 text-black" : "border-green-500 text-green-700"}`}
              value={userRegistrationData?.country || ""}
              onChange={handleInput}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Loading..." : "Confirm"}
            </button>
          </div>
        </animated.div>
      </form>
    </div>
  );
};

export default RegisterConfirmation;
