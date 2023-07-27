import React from 'react';
import NavBar from '../components/NavBar';
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../atoms";
import { Link } from 'react-router-dom';

function LandingPage() {
  const darkMode = useRecoilValue(darkModeAtom);

  const getContainerClassName = () => {
    let classNames = "flex flex-col h-screen justify-between ";

    if (darkMode) {
      classNames += "bg-gray-900 text-white";
    } else {
      classNames += "bg-gray-100 text-black";
    }

    return classNames;
  };

  const getSectionClassName = () => {
    let classNames = "max-w-2xl mx-auto p-4 text-center ";

    if (darkMode) {
      classNames += "text-gray-200";
    } else {
      classNames += "text-gray-700";
    }

    return classNames;
  };

  const getButtonClassName = () => {
    let classNames = "px-10 py-4 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-green-600 transition duration-200";

    if (darkMode) {
      classNames += " bg-green-200";
    } else {
      classNames += " bg-green-500";
    }

    return classNames;
  };

  return (
    <div className={getContainerClassName()}>
      <NavBar />

      <main className={`flex-grow overflow-y-auto ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <section className={getSectionClassName() + " mt-10"}>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Welcome to iTribe</h2>
              <p className={`mb-4 text-lg ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                iTribe is a community dedicated to connecting the lost tribes of Israel.
                We believe in fostering unity, understanding, and mutual respect among all tribes.
              </p>
              <p className={`text-lg ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Our platform offers a variety of features to enhance your journey of discovery and connection. These include our interactive map, 
                in-depth community profiles, and interactive forums for members to share their experiences and learn from each other.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Link to="/interactivemap" className={getButtonClassName()}>
                Explore Interactive Map
              </Link>
              <Link to="/home" className={getButtonClassName()}>
                Join Us Today
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
