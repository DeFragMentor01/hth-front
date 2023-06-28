import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { animated, useSpring } from "react-spring";
import { darkModeAtom, currentStepAtom, registrationDataState } from "../atoms";

const RegisterUserType: React.FC = () => {
  const [memberType, setMemberType] = useRecoilState(registrationDataState);
  const [currentState, setCurrentState] = useRecoilState(currentStepAtom);
  const [darkMode] = useRecoilState(darkModeAtom);
  const [error, setError] = useState("");

  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });

  useEffect(() => {
    // No need to set formValid as it's derived from memberType
  }, [memberType]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMemberType = event.target.value as "community member" | "community leader";
    setMemberType((prevState) => ({
      ...prevState,
      memberType: selectedMemberType,
    }));
    setError("");
  };

  const handleNext = () => {
    if (!memberType.memberType) {
      setError("Please select a member type.");
      return;
    }
    setError("");
    setCurrentState((prevState) => prevState + 1);
  };

  const darkModeStyles = darkMode
    ? "bg-gray-800 text-white"
    : "bg-gray-200 text-green-700";
  const cardStyles = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-100 text-black";
  const buttonStyles = `bg-green-500 hover:bg-green-600 text-white ${
    darkMode ? "" : "dark"
  }`;
  const titleColor = "text-green-700";
  const errorStyles = error ? "border-red-500" : "";

  return (
    <animated.div
      className={`flex flex-col items-center justify-center h-screen ${darkModeStyles}`}
      style={fadeIn}
    >
      <div className={`w-full max-w-md p-8 rounded-md shadow-lg ${cardStyles}`}>
        <h2 className={`font-bold text-2xl mb-6 ${titleColor}`}>
          Select Member Type
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="mb-6">
          <label
            htmlFor="memberType"
            className="block text-sm font-bold mb-2"
          >
            I am registering as a:
          </label>
          <select
            name="memberType"
            value={memberType.memberType}
            onChange={handleSelectChange}
            className={`appearance-none border-2 rounded-md w-full py-2 px-4 leading-tight focus:outline-none focus:border-green-500 ${
              darkMode ? "text-black" : "text-green-700"
            } ${errorStyles}`}
          >
            <option value="">Select...</option>
            <option value="community member">Community Member</option>
            <option value="community leader">Community Leader</option>
          </select>
        </div>
        <button
          onClick={handleNext}
          className={`${buttonStyles} py-2 px-4 rounded-md w-full`}
        >
          Next
        </button>
      </div>
    </animated.div>
  );
};

export default RegisterUserType;
