import React from "react";

interface RegisterButtonProps {
  type?: "button" | "submit" | "reset";
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
  type = "button",
  label,
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-gray-200 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline `}
    >
      {label}
    </button>
  );
};

export default RegisterButton;
