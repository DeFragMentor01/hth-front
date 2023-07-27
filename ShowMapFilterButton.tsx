import React from 'react';
import { useRecoilState } from 'recoil';
import { FiFilter } from 'react-icons/fi';
import { isFilterModalVisibleAtom, isFilterButtonVisibleAtom } from '../atoms';

const ShowMapFilterButton: React.FC = () => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useRecoilState(isFilterModalVisibleAtom);
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useRecoilState(isFilterButtonVisibleAtom);

  const handleClick = () => {
    setIsFilterModalVisible(true);
    setIsFilterButtonVisible(false);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
    >
      <FiFilter className="mr-2" />
      Filters
    </button>
  );
};

export default ShowMapFilterButton;