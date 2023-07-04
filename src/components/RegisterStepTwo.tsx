import { useState, useMemo, useCallback } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { currentStepAtom, darkModeAtom, registrationDataState } from "../atoms";
import RegisterButton from "./RegisterButton";
import { animated, useSpring } from "react-spring";

interface StepTwoFormData {
  village: string;
  community: string;
  city: string;
  state: string;
  country: string;
}

const villages: string[] = [
  "Reuben",
  "Simeon",
  "Levi",
  "Judah",
  "Dan",
  "Naphtali",
  "Gad",
  "Asher",
  "Issachar",
  "Zebulun",
  "Joseph",
  "Benjamin",
];

const RegisterStepTwo: React.FC = () => {
  const darkMode = useRecoilValue(darkModeAtom);
  const [currentForm, setCurrentForm] = useRecoilState(currentStepAtom);
  const [formData, setFormData] = useRecoilState(registrationDataState);
  const { country, city, village, community, state } = formData;

  const [errors, setErrors] = useState({
    country: "",
    city: "",
    village: "",
    state: "",
    community: "",
  });

  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handlePrevious = () => {
    setCurrentForm((prevForm) => prevForm - 1);
  };

  const handleSubmit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();

      let newErrors = {
        country: "",
        city: "",
        village: "",
        community: "",
        state: "",
      };
      let hasErrors = false;

      if (!country) {
        newErrors.country = "Please select your country";
        hasErrors = true;
      }

      if (!city) {
        newErrors.city = "Please enter your city";
        hasErrors = true;
      }

      if (!village) {
        newErrors.village = "Please select your village";
        hasErrors = true;
      }

      if (!state) {
        newErrors.state = "Please enter your state";
        hasErrors = true;
      }

      if (!community) {
        newErrors.community = "Please enter your community";
        hasErrors = true;
      }

      setErrors(newErrors);

      if (!hasErrors) {
        setCurrentForm((prevForm) => prevForm + 1);
      }
    },
    [city, community, country, setCurrentForm, state, village]
  );

  const tribeOptions = useMemo(
    () =>
      villages.map((village) => (
        <option key={village} value={village}>
          {village}
        </option>
      )),
    []
  );

  const darkModeStyles = darkMode
    ? "bg-gray-800 text-white"
    : "bg-gray-200 text-green-700";
  const inputStyles = darkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-green-700";
  const buttonStyles = `bg-green-500 hover:bg-green-600 text-white ${
    darkMode ? "dark" : ""
  }`;
  const titleColor = "text-green-700";
  const errorStyles = "text-red-500 text-sm";

  return (
    <animated.div
      className={`flex flex-col items-center py-40 px-8 ${darkModeStyles}`}
      style={fadeIn}
    >
      <h2 className={`font-bold text-2xl mb-6 ${titleColor}`}>
        Step Two: Location and Village
      </h2>
      <form className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-bold mb-2">
            Country:
          </label>
          <input
            type="text"
            name="country"
            value={country}
            onChange={handleInput}
            className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
          />
          {errors.country && <p className={errorStyles}>{errors.country}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="state" className="block text-sm font-bold mb-2">
            State:
          </label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={handleInput}
            className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
          />
          {errors.state && <p className={errorStyles}>{errors.state}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-bold mb-2">
            City:
          </label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={handleInput}
            className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
          />
          {errors.city && <p className={errorStyles}>{errors.city}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="village" className="block text-sm font-bold mb-2">
            Village:
          </label>
          <select
            name="village"
            value={village}
            onChange={handleInput}
            className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
          >
            <option value="">Select...</option>
            {tribeOptions}
          </select>
          {errors.village && <p className={errorStyles}>{errors.village}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="community" className="block text-sm font-bold mb-2">
            Community:
          </label>
          <input
            type="text"
            name="community"
            value={community}
            onChange={handleInput}
            className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${inputStyles}`}
          />
          {errors.community && (
            <p className={errorStyles}>{errors.community}</p>
          )}
        </div>
      </form>
      <div className="mt-8 flex">
        <RegisterButton
          onClick={handlePrevious}
          label="Previous"
          className="mr-4"
        />
        <RegisterButton
          label="Next"
          onClick={handleSubmit}
          className={buttonStyles}
        />
      </div>
    </animated.div>
  );
};

export default RegisterStepTwo;
