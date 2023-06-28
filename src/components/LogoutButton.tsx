import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userIsAuth } from "../atoms";
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton: React.FC = () => {
  const setUserAuth = useSetRecoilState(userIsAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("email");
    localStorage.removeItem("userIsAuth");
    setUserAuth(false);
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      className="text-red-500 hover:text-red-700"
    >
      <FaSignOutAlt size={25} />
    </button>
  );
};

export default LogoutButton;
