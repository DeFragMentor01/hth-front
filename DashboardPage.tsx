// DashboardPage.tsx
import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { darkModeAtom, userStatState } from '../atoms';
import NavBar from '../components/NavBar';
import StatsComponent from '../components/StatsComponent';
import Banner from '../components/Banner';

const DashboardPage: React.FC = () => {
  const darkMode = useRecoilValue(darkModeAtom);
  const [userStats] = useRecoilState(userStatState);

  return (
    <div className={`flex flex-col items-start ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} min-h-screen`}>
      <div className={`w-full ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <NavBar />
      </div>

      <Banner>
        <h1 className="text-5xl font-extrabold text-white font-sans">Dashboard</h1>
      </Banner>

      <div className="flex flex-wrap justify-start items-start w-full px-8 py-4">
        {userStats.map((stat, idx) => (
          <StatsComponent 
            key={idx}
            title={stat.title}
            count={stat.count}
            growth={stat.growth}
            items={stat.items}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
