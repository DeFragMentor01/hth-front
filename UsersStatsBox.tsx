import React from 'react';

interface UsersStatsBoxProps {}

const UsersStatsBox: React.FC<UsersStatsBoxProps> = () => {
  const registeredUsers = 2534754; // Example data
  const verifiedUsers = 1938242; // Example data
  
  const formatNumber = (num: number) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }
  
  return (
    <div className="bg-gray-100 p-4 text-gray-400 rounded shadow-md">
      <h2 className="font-bold text-xl mb-2">User Stats</h2>
      <div className="border-b-2 border-gray-200 py-2">
        <h3 className="font-semibold">Registered Users:</h3>
        <p>{formatNumber(registeredUsers)}</p>
      </div>
      <div className="py-2">
        <h3 className="font-semibold">Verified Users:</h3>
        <p>{formatNumber(verifiedUsers)}</p>
      </div>
    </div>
  );
};

export default UsersStatsBox;
