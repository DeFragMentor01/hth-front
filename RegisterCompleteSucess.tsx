import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../atoms";
import { animated, useSpring } from "react-spring";
import RegisterButton from "./RegisterButton";

const RegisterCompleteSuccess: React.FC = () => {
  const darkMode = useRecoilValue(darkModeAtom);

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
  });

  const containerStyles = `flex flex-col items-center justify-center h-screen py-40 px-8 ${
    darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-green-700"
  }`;
  

  const headingStyles = `font-bold text-3xl mb-6`;
  const paragraphStyles = `text-xl mb-12`;

  const handleGoToLogin = () => {
    window.location.href = "/home";
  };

  return (
    <animated.div className={containerStyles} style={fadeIn}>
      <h2 className={headingStyles}>Registration Successful!</h2>
      <p className={paragraphStyles}>Welcome to our community.</p>
      <button onClick={handleGoToLogin}>Go To Login</button>
    </animated.div>
  );
};

export default RegisterCompleteSuccess;
