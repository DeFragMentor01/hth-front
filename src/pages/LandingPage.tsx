import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useRecoilValue } from "recoil";
import { darkModeAtom } from "../atoms";
import { FiMap, FiUsers, FiGlobe, FiArrowRight, FiHeart, FiMessageCircle } from 'react-icons/fi';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="text-3xl text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

function LandingPage() {
  const darkMode = useRecoilValue(darkModeAtom);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"}`}>
      <NavBar />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 font-heading">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Welcome to iTribe
              </span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-xl lg:text-2xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover your heritage, connect with your roots, and join a vibrant community dedicated to 
              preserving and celebrating the rich traditions of the lost tribes of Israel.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-lg lg:text-xl mb-12 text-gray-500 dark:text-gray-400">
              Experience a unique journey of discovery through our interactive features, connect with 
              community members worldwide, and be part of a movement that bridges past and present.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/interactivemap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <FiMap className="text-xl" />
                <span>Explore Interactive Map</span>
                <FiArrowRight className="ml-2" />
              </motion.button>
            </Link>

            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors"
              >
                <FiUsers className="text-xl" />
                <span>Join Our Community</span>
                <FiArrowRight className="ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <FeatureCard
            icon={<FiGlobe />}
            title="Global Community"
            description="Connect with members from around the world, sharing stories and experiences."
          />
          <FeatureCard
            icon={<FiHeart />}
            title="Cultural Heritage"
            description="Explore and preserve your cultural identity through shared traditions and history."
          />
          <FeatureCard
            icon={<FiMessageCircle />}
            title="Meaningful Connections"
            description="Engage in discussions, share insights, and build lasting relationships."
          />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-20"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of members who are discovering their heritage and building connections.
          </p>
          <Link to="/home">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium inline-flex items-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <span>Start Your Journey</span>
              <FiArrowRight />
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

export default LandingPage;
