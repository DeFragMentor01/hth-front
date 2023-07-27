import React from "react";
import NavBar from "../components/NavBar";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useRecoilValue } from "recoil";
import { showLoginFormAtom } from "../atoms";
import LogoutButton from "../components/LogoutButton";
const HomePage: React.FC = () => {
  const showLoginForm = useRecoilValue(showLoginFormAtom);

  return (
    <div>
      <NavBar />
      {showLoginForm ? (
        <LoginForm />
      ) : (
        <RegisterForm />
      )}
    </div>
  );
};

export default HomePage;
