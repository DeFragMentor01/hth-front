// Banner.tsx
import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import { darkModeAtom } from '../atoms';

interface BannerProps {
  children: ReactNode;
}

const Banner: React.FC<BannerProps> = ({ children }) => {
  const darkMode = useRecoilValue(darkModeAtom);

  return (
    <div className="relative w-full mb-8 flex justify-start">
      <svg height="80" viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="scale(-1, 1)">
        <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#33CF7A"/>
          <stop offset="100%" stop-color="#654EEB"/>
        </linearGradient>
        <path d="M0 40C0 17.909 17.909 0 40 0H400V80H40C17.909 80 0 62.091 0 40Z" fill="url(#bannerGradient)"/>
      </svg>
      <div className={`absolute top-0 left-0 h-full flex items-center pl-10 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {children}
      </div>
    </div>
  );
};

export default Banner;
