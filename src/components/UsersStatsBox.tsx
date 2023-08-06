import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UsersStatsBoxProps {}

interface UserCounts {
  verifiedCount: number;
  nonVerifiedCount: number;
}

const UsersStatsBox: React.FC<UsersStatsBoxProps> = () => {
  const [userCounts, setUserCounts] = useState<UserCounts>({ verifiedCount: 0, nonVerifiedCount: 0 });

  const formatNumber = (num: number) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/verified/count`);
        setUserCounts(response.data);
      } catch (error) {
        console.error('Error fetching user counts:', error);
      }
    };
    fetchUserCounts();
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-200 via-green-300 to-green-400 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
    <h2 className="text-3xl font-extrabold text-gray-800">User Stats</h2>
    <div className="w-full bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-600">Verified Users:</h3>
        <p className="text-lg font-bold text-green-700">{formatNumber(userCounts.verifiedCount)}</p>
    </div>
    <div className="w-full bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-600">Non-Verified Users:</h3>
        <p className="text-lg font-bold text-red-600">{formatNumber(userCounts.nonVerifiedCount)}</p>
    </div>
</div>

  );
};

export default UsersStatsBox;