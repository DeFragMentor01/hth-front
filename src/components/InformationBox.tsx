import React, { FunctionComponent, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { darkModeAtom, countryIdAtom, provinceIdAtom, districtIdAtom, countryNameAtom, provinceNameAtom, districtNameAtom } from '../atoms';
import { FiMapPin, FiUsers, FiHome, FiCheckCircle, FiXCircle, FiChevronRight } from 'react-icons/fi';

interface LocationStatsProps {
  title: string;
  name: string | null;
  villageCount: number | null;
  userCounts: { verifiedCount: number; nonVerifiedCount: number };
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const LocationStats: React.FC<LocationStatsProps> = ({
  title,
  name,
  villageCount,
  userCounts,
  icon,
  isExpanded,
  onToggle,
}) => {
  const darkMode = useRecoilValue(darkModeAtom);

  return (
    <div className={`
      rounded-lg overflow-hidden transition-all duration-200 backdrop-blur-sm
      ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/50 border border-gray-200/50'}
      ${isExpanded ? 'shadow-lg' : 'shadow'}
    `}>
      <motion.button
        onClick={onToggle}
        className={`
          w-full px-6 py-4 flex items-center justify-between
          ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'}
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-lg
            ${darkMode ? 'bg-gray-700/50 text-blue-400' : 'bg-blue-50/50 text-blue-600'}
          `}>
            {icon}
          </div>
          <div className="text-left">
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {title}
            </p>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {name || 'Not Selected'}
            </h3>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              px-6 pb-4 space-y-3
              ${darkMode ? 'text-gray-300' : 'text-gray-600'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <FiHome className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Villages</span>
              </div>
              <span className="font-semibold ml-2">{villageCount || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <FiCheckCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
                <span className="truncate">Verified Users</span>
              </div>
              <span className="font-semibold ml-2">{userCounts.verifiedCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <FiXCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span className="truncate">Non-verified Users</span>
              </div>
              <span className="font-semibold ml-2">{userCounts.nonVerifiedCount}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30">
              <div className="flex items-center justify-between">
                <span className="truncate">Total Users</span>
                <span className="font-semibold ml-2">
                  {userCounts.verifiedCount + userCounts.nonVerifiedCount}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InformationBox: FunctionComponent = () => {
  const darkMode = useRecoilValue(darkModeAtom);
  const countryId = useRecoilValue(countryIdAtom);
  const provinceId = useRecoilValue(provinceIdAtom);
  const districtId = useRecoilValue(districtIdAtom);
  
  const [countryVillageCount, setCountryVillageCount] = useState<number | null>(null);
  const [provinceVillageCount, setProvinceVillageCount] = useState<number | null>(null);
  const [districtVillageCount, setDistrictVillageCount] = useState<number | null>(null);

  const [countryUserCounts, setCountryUserCounts] = useState({ verifiedCount: 0, nonVerifiedCount: 0 });
  const [provinceUserCounts, setProvinceUserCounts] = useState({ verifiedCount: 0, nonVerifiedCount: 0 });
  const [districtUserCounts, setDistrictUserCounts] = useState({ verifiedCount: 0, nonVerifiedCount: 0 });

  const [expandedSection, setExpandedSection] = useState<'country' | 'province' | 'district' | null>('country');

  const countryName = useRecoilValue(countryNameAtom);
  const provinceName = useRecoilValue(provinceNameAtom);
  const districtName = useRecoilValue(districtNameAtom);

  useEffect(() => {
    const fetchCounts = async (locationType: 'country' | 'province' | 'district', userType: 'country' | 'state' | 'community', name: string | null, id: number | null) => {
      if (name && id) {
        try {
          const villageResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/villages/count/${locationType}/${id}`);
          const userResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/verified/count`, { params: { [userType]: name } });

          switch(locationType) {
            case 'country':
              setCountryVillageCount(villageResponse.data.count);
              setCountryUserCounts(userResponse.data);
              break;
            case 'province':
              setProvinceVillageCount(villageResponse.data.count);
              setProvinceUserCounts(userResponse.data);
              break;
            case 'district':
              setDistrictVillageCount(villageResponse.data.count);
              setDistrictUserCounts(userResponse.data);
              break;
          }
        } catch (error) {
          console.error(`Error fetching ${locationType} data:`, error);
        }
      }
    };

    fetchCounts('country', 'country', countryName, countryId);
    fetchCounts('province', 'state', provinceName, provinceId);
    fetchCounts('district', 'community', districtName, districtId);
  }, [countryId, provinceId, districtId, countryName, provinceName, districtName]);

  const handleSectionToggle = (section: 'country' | 'province' | 'district') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Location Information
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Select a location to view detailed statistics
        </p>
      </div>

      <div className="space-y-4">
        <LocationStats
          title="Country"
          name={countryName}
          villageCount={countryVillageCount}
          userCounts={countryUserCounts}
          icon={<FiMapPin className="w-5 h-5" />}
          isExpanded={expandedSection === 'country'}
          onToggle={() => handleSectionToggle('country')}
        />

        <LocationStats
          title="Province/State"
          name={provinceName}
          villageCount={provinceVillageCount}
          userCounts={provinceUserCounts}
          icon={<FiMapPin className="w-5 h-5" />}
          isExpanded={expandedSection === 'province'}
          onToggle={() => handleSectionToggle('province')}
        />

        <LocationStats
          title="District/Community"
          name={districtName}
          villageCount={districtVillageCount}
          userCounts={districtUserCounts}
          icon={<FiMapPin className="w-5 h-5" />}
          isExpanded={expandedSection === 'district'}
          onToggle={() => handleSectionToggle('district')}
        />
      </div>
    </motion.div>
  );
};

export default InformationBox;
