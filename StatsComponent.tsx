// StatsComponent.tsx
import React, { useState } from 'react';
import { AiOutlinePushpin } from "react-icons/ai";
import { useRecoilValue } from 'recoil';
import { darkModeAtom } from '../atoms';

interface ListItem {
  itemName: string;
  percentage: number;
}

interface StatProps {
  title: string;
  count?: number;
  growth?: number;
  items?: ListItem[];
}

export const StatsComponent: React.FC<StatProps> = ({ title, count, growth, items }) => {
  const [isPinned, setIsPinned] = useState(false);
  const darkMode = useRecoilValue(darkModeAtom);

  return (
    <div className={`rounded-lg shadow-md p-6 max-w-md mx-4 my-2 border-l-4 border-primary-1 flex-none ${darkMode ? 'bg-secondary-10 text-secondary-1' : 'bg-white text-primary-1'}`}>
      <div className="flex items-start justify-between">
        <AiOutlinePushpin 
          className={`cursor-pointer text-3xl ${isPinned ? "text-secondary-1" : "text-primary-1"} mt-1`}
          onClick={() => setIsPinned(!isPinned)}
        />
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      
      {count && <p className="text-lg mt-4">Total: {count}</p>}
      {growth && <p className="text-lg mt-4">Growth: {growth}%</p>}
      
      {items && items.map((item, idx) => (
        <p key={idx} className="text-lg mt-4">{item.itemName}: {item.percentage}%</p>
      ))}
    </div>
  );
};

export default StatsComponent;
