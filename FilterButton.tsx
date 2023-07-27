import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { darkModeAtom } from '../atoms';

interface FilterButtonProps {
  onApply: () => void;
  onReset: () => void;
}

const FilterButton: FunctionComponent<FilterButtonProps> = ({ onApply, onReset }) => {
  const darkMode = useRecoilValue(darkModeAtom);

  return (
    <div className="flex justify-end">
      <button
        className={`mr-2 px-4 py-2 rounded-md ${darkMode ? 'bg-green-600 text-white' : 'bg-green-200 text-green-700'}`}
        onClick={onApply}
      >
        Apply
      </button>
      <button
        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-red-600 text-white' : 'bg-red-200 text-red-700'}`}
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
};

export default FilterButton;
