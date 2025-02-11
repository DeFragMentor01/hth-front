import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  countryIdAtom,
  provinceIdAtom,
  districtIdAtom,
  villageIdAtom,
  darkModeAtom,
  isFilterModalVisibleAtom,
  isFilterButtonVisibleAtom
} from '../atoms';
import { FiSearch, FiMapPin, FiX, FiChevronDown, FiFilter, FiRefreshCw } from 'react-icons/fi';
import useDebounce from '../hooks/useDebounce';

interface Location {
  id: string;
  name: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: Location[];
  onChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  onClear,
  disabled = false,
  placeholder = 'Select...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div ref={dropdownRef} className="relative">
      <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 text-left rounded-lg border transition-all duration-200
            flex items-center justify-between
            ${darkMode 
              ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-600' 
              : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
            }
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'focus:ring-2 focus:ring-blue-500/20'
            }
          `}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <div className="flex items-center">
            {value && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onClear();
                }}
                className={`
                  p-1 rounded-full mr-1 transition-colors
                  ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                `}
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
            <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                absolute z-50 w-full mt-1 rounded-lg shadow-lg
                max-h-60 overflow-auto border backdrop-blur-sm
                ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}
              `}
            >
              {options.length > 0 ? (
                options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-2.5 text-left transition-colors
                      ${darkMode 
                        ? 'hover:bg-gray-700 text-gray-200' 
                        : 'hover:bg-gray-50 text-gray-900'
                      }
                      ${option.id === value 
                        ? darkMode 
                          ? 'bg-gray-700' 
                          : 'bg-gray-100'
                        : ''
                      }
                    `}
                  >
                    {option.name}
                  </button>
                ))
              ) : (
                <div className={`
                  px-4 py-2.5 text-sm
                  ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  No options available
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MapFilters: React.FC = () => {
  const [countries, setCountries] = useState<Location[]>([]);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [villageSearchTerm, setVillageSearchTerm] = useState('');
  const [villageSuggestions, setVillageSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const darkMode = useRecoilValue(darkModeAtom);
  const [, setIsFilterModalVisible] = useRecoilState(isFilterModalVisibleAtom);
  const [, setIsFilterButtonVisible] = useRecoilState(isFilterButtonVisibleAtom);

  const [selectedCountry, setSelectedCountry] = useRecoilState(countryIdAtom);
  const [selectedProvince, setSelectedProvince] = useRecoilState(provinceIdAtom);
  const [selectedDistrict, setSelectedDistrict] = useRecoilState(districtIdAtom);
  const [selectedVillage, setSelectedVillage] = useRecoilState(villageIdAtom);

  const debouncedVillageSearch = useDebounce(villageSearchTerm, 300);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/countries`);
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      if (selectedCountry) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/provinces/${selectedCountry}`);
          setProvinces(response.data);
        } catch (error) {
          console.error('Error fetching provinces:', error);
        }
      } else {
        setProvinces([]);
      }
    };
    fetchProvinces();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/districts/${selectedProvince}`);
          setDistricts(response.data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      } else {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchVillageSuggestions = async () => {
      if (debouncedVillageSearch.trim()) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/villages/search?term=${debouncedVillageSearch}&district=${selectedDistrict || ''}`
          );
          setVillageSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching village suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setVillageSuggestions([]);
      }
    };
    fetchVillageSuggestions();
  }, [debouncedVillageSearch, selectedDistrict]);

  const handleReset = () => {
    setSelectedCountry(null);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setVillageSearchTerm('');
  };

  const handleClose = () => {
    setIsFilterModalVisible(false);
    setIsFilterButtonVisible(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className={`
          w-full max-w-lg p-6 rounded-2xl shadow-xl
          ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`
              p-2 rounded-lg
              ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}
            `}>
              <FiFilter className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Location Filters
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select location details to filter the map
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleClose}
              className={`
                p-1.5 rounded-lg transition-colors duration-200
                ${darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <FilterDropdown
            label="Country"
            value={selectedCountry !== null ? String(selectedCountry) : ''}
            options={countries}
            onChange={(val: string) => setSelectedCountry(Number(val))}
            onClear={() => setSelectedCountry(null)}
            placeholder="Select a country"
          />

          <FilterDropdown
            label="Province"
            value={selectedProvince !== null ? String(selectedProvince) : ''}
            options={provinces}
            onChange={(val: string) => setSelectedProvince(Number(val))}
            onClear={() => setSelectedProvince(null)}
            disabled={!selectedCountry}
            placeholder={selectedCountry ? 'Select a province' : 'Select a country first'}
          />

          <FilterDropdown
            label="District"
            value={selectedDistrict !== null ? String(selectedDistrict) : ''}
            options={districts}
            onChange={(val: string) => setSelectedDistrict(Number(val))}
            onClear={() => setSelectedDistrict(null)}
            disabled={!selectedProvince}
            placeholder={selectedProvince ? 'Select a district' : 'Select a province first'}
          />

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Village Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={villageSearchTerm}
                onChange={(e) => setVillageSearchTerm(e.target.value)}
                placeholder="Search for a village..."
                className={`
                  w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all duration-200
                  ${darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20
                `}
              />
              <FiSearch className={`
                absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
                ${darkMode ? 'text-gray-500' : 'text-gray-400'}
              `} />
              {isLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <FiRefreshCw className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {villageSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`
                    mt-1 max-h-60 overflow-auto rounded-lg shadow-lg border backdrop-blur-sm
                    ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}
                  `}
                >
                  {villageSuggestions.map((village) => (
                    <button
                      key={village.id}
                      onClick={() => {
                        setSelectedVillage(Number(village.id));
                        setVillageSearchTerm(village.name);
                        setVillageSuggestions([]);
                      }}
                      className={`
                        w-full px-4 py-2.5 text-left flex items-center space-x-2 transition-colors
                        ${darkMode 
                          ? 'hover:bg-gray-700 text-gray-200' 
                          : 'hover:bg-gray-50 text-gray-900'
                        }
                      `}
                    >
                      <FiMapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{village.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MapFilters;
