import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiUsers, FiGlobe, FiBarChart2 } from "react-icons/fi";
import NavBar from "../components/NavBar";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useRecoilValue } from "recoil";
import { showLoginFormAtom } from "../atoms";

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="text-3xl text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 font-heading">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const HomePage: React.FC = () => {
  const showLoginForm = useRecoilValue(showLoginFormAtom);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 mb-10 lg:mb-0"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-heading bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Connect with Your Global Community
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our platform to connect, share, and grow with people from around the world who share your interests and values.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors">
                <span>Get Started</span>
                <FiArrowRight />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            {showLoginForm ? (
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <LoginForm />
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <RegisterForm />
              </div>
            )}
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<FiUsers />}
            title="Connect Globally"
            description="Build meaningful connections with people from diverse backgrounds and cultures."
          />
          <FeatureCard
            icon={<FiGlobe />}
            title="Explore Communities"
            description="Discover and join communities that align with your interests and values."
          />
          <FeatureCard
            icon={<FiBarChart2 />}
            title="Track Growth"
            description="Monitor your community engagement and personal growth journey."
          />
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;
