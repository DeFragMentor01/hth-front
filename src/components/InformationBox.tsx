import React, { FunctionComponent } from 'react';
import { useRecoilValue } from 'recoil';
import { darkModeAtom, CommunityData } from '../atoms';

interface InformationBoxProps {
  selectedTribe: CommunityData | null;
}

const InformationBox: FunctionComponent<InformationBoxProps> = ({ selectedTribe }) => {
  const darkMode = useRecoilValue(darkModeAtom);

  return (
    selectedTribe && (
      <div className={`bg-white p-4 rounded-lg shadow-md ${darkMode ? 'text-green-500' : ''}`}>
        <h2 className={`text-lg mb-2 font-bold ${darkMode ? 'text-green-500' : ''}`}>{selectedTribe.village_name}</h2>
        <p>District: {selectedTribe.district}</p>
        <p>Province: {selectedTribe.province}</p>
        <p>Population: {selectedTribe.population}</p> {/* Add the population field */}
      </div>
    )
  );
};

export default InformationBox;
