import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { darkModeAtom, userIsAuth, loginEmailAtom, loginPasswordAtom, rememberMeAtom } from "../atoms";
import axios, { AxiosError } from 'axios';
import { useNavigate } from "react-router-dom";

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();
  const darkMode = useRecoilValue(darkModeAtom);
  const setUserAuth = useSetRecoilState(userIsAuth);
  const [email, setEmail] = useRecoilState(loginEmailAtom);
  const [password, setPassword] = useRecoilState(loginPasswordAtom);
  const [rememberMe, setRememberMe] = useRecoilState(rememberMeAtom);
  const [errors, setErrors] = useState<string[]>([]);
  const isAuthenticated = useRecoilValue(userIsAuth);

  useEffect(() => {
    const rememberMeStatus = localStorage.getItem("rememberMe");
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (rememberMeStatus === "true" && storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, [setEmail, setPassword, setRememberMe]);

  useEffect(() => {
    console.log('Authentication status:', isAuthenticated);
  }, [isAuthenticated]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const errors: string[] = [];
  
    if (!email.trim()) {
      errors.push("Email is required");
    }
  
    if (!password.trim()) {
      errors.push("Password is required");
    }
  
    if (errors.length === 0) {
      try {
        const response = await axios.post(process.env.baseURL +'/login', {
          email: email,
          password: password
        });
  
        if (response.data && response.data.message === 'User authenticated successfully!') {
          setUserAuth(true);
  
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
          } else {
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("email");
            localStorage.removeItem("password");
          }
  
          navigate("/dashboard");
        } else {
          if (response.data && response.data.message) {
            setErrors([response.data.message]);
          } else {
            setErrors(["Authentication failed"]);
          }

          // Reset input fields only when the login fails
          setEmail("");
          setPassword("");
        }
      } catch (error: unknown) {
        console.log('Login error:', error);

        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data) {
          const errorData = axiosError.response.data;

          if (typeof errorData === 'string') {
            setErrors([errorData]);
          } else if (typeof errorData === 'object' && 'message' in errorData) {
            setErrors([(errorData as Record<string, unknown>).message as string]);
          } else {
            setErrors(["An error occurred during login"]);
          }
        } else {
          setErrors(["An error occurred during login"]);
        }
        
        // Reset input fields when an error occurs
        setEmail("");
        setPassword("");
      }
    } else {
      setErrors(errors);
    }
  };

  const handleForgotPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    alert("Forgot password");
  };

  const handleRegister = (event: React.MouseEvent<HTMLButtonElement>) => {
    alert("Register");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-green-700"
      } h-screen`}
    >
      <h2 className="font-bold text-xl mb-4">Login</h2>
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className={`block ${
              darkMode ? "text-white" : "text-gray-700"
            } font-bold mb-2`}
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`appearance-none border ${
              darkMode
                ? "border-green-300 text-green-300"
                : "border-green-500 text-green-700"
            } rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
              setErrors([]);
            }}
          />
        </div>
        <div className="mb-4">
          <label
            className={`block ${
              darkMode ? "text-white" : "text-gray-700"
            } font-bold mb-2`}
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={`appearance-none border ${
              darkMode
                ? "border-green-300 text-green-300"
                : "border-green-500 text-green-700"
            } rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
              setErrors([]);
            }}
          />
        </div>
        {errors.length > 0 && (
          <div className="mb-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}
        <div className="mb-4">
          <input
            className={`mr-2 leading-tight`}
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.currentTarget.checked)}
          />
          <label
            className={`${darkMode ? "text-white" : "text-gray-700"} font-bold`}
            htmlFor="rememberMe"
          >
            Remember me
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            className={`bg-green-500 ${
              darkMode
                ? "hover:bg-green-400 text-green-800"
                : "hover:bg-green-600 text-white"
            } font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
          >
            Login
          </button>
          <button
            className={`text-green-500 font-bold hover:text-green-700`}
            type="button"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
        </div>
      </form>
      <div className="mt-4">
        <p className={darkMode ? "text-white" : "text-black"}>
          Don't have an account?{" "}
          <button
            className={`text-green-500 font-bold hover:text-green-700 ${
              darkMode ? "text-green-300" : "text-green-700"
            }`}
            type="button"
            onClick={handleRegister}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
