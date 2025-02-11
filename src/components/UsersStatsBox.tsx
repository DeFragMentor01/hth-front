import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { darkModeAtom } from '../atoms';
import { FiUsers, FiCheckCircle, FiXCircle, FiTrendingUp } from 'react-icons/fi';

interface UserCounts {
  verifiedCount: number;
  nonVerifiedCount: number;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  darkColor: string;
}> = ({ title, value, icon, color, darkColor }) => {
  const darkMode = useRecoilValue(darkModeAtom);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        p-4 rounded-xl backdrop-blur-sm
        ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'}
        border
        ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}
        transition-all duration-200
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          p-3 rounded-lg
          ${darkMode ? darkColor : color}
          ${darkMode ? 'bg-opacity-20' : 'bg-opacity-10'}
        `}>
          {icon}
        </div>
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const UsersStatsBox: React.FC = () => {
  const [userCounts, setUserCounts] = useState<UserCounts>({ verifiedCount: 0, nonVerifiedCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/verified/count`);
        setUserCounts(response.data);
      } catch (error) {
        console.error('Error fetching user counts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserCounts();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-300 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalUsers = userCounts.verifiedCount + userCounts.nonVerifiedCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <FiUsers className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            User Statistics
          </h2>
        </div>
        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Overview of user verification status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<FiUsers className="w-5 h-5 text-blue-600" />}
          color="text-blue-600 bg-blue-100"
          darkColor="text-blue-400 bg-blue-900"
        />
        
        <StatCard
          title="Verified Users"
          value={userCounts.verifiedCount}
          icon={<FiCheckCircle className="w-5 h-5 text-green-600" />}
          color="text-green-600 bg-green-100"
          darkColor="text-green-400 bg-green-900"
        />
        
        <StatCard
          title="Non-verified Users"
          value={userCounts.nonVerifiedCount}
          icon={<FiXCircle className="w-5 h-5 text-red-600" />}
          color="text-red-600 bg-red-100"
          darkColor="text-red-400 bg-red-900"
        />
      </div>

      <div className={`
        mt-6 p-4 rounded-xl backdrop-blur-sm
        ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/50 border border-gray-200/50'}
      `}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <FiTrendingUp className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Verification Rate
            </span>
          </div>
          <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {totalUsers > 0
              ? `${((userCounts.verifiedCount / totalUsers) * 100).toFixed(1)}%`
              : '0%'}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalUsers > 0 ? (userCounts.verifiedCount / totalUsers) * 100 : 0}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default UsersStatsBox;