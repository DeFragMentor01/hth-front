import React, { FunctionComponent, ChangeEvent, useEffect } from 'react';
import FilterButton from './FilterButton';
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeAtom, selectedFiltersAtom, fetchedDataAtom } from '../atoms';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterOptionsProps {
  filteredOptions: Record<string, FilterOption[]>;
  selectedFilters: Record<string, string | string[]>;
  handleFilterChange: (filterKey: string, value: string | string[]) => void;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
}

const FilterOptions: FunctionComponent<FilterOptionsProps> = ({
  filteredOptions,
  handleFilterChange,
  handleApplyFilters,
  handleResetFilters,
}) => {
  const darkMode = useRecoilValue(darkModeAtom);
  const [selectedFilters, setSelectedFilters] = useRecoilState(selectedFiltersAtom);
  const fetchedData = useRecoilValue(fetchedDataAtom);

  useEffect(() => {
    if (fetchedData.length > 0) {
      const districts: string[] = [];
      const provinces: string[] = [];
      const villages: string[] = [];

      fetchedData.forEach((community) => {
        if (!districts.includes(community.district)) {
          districts.push(community.district);
        }
        if (!provinces.includes(community.province)) {
          provinces.push(community.province);
        }
        if (!villages.includes(community.village_name)) {
          villages.push(community.village_name);
        }
      });

      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        districts,
        provinces,
        villages,
      }));
    }
  }, [fetchedData, setSelectedFilters]);

  const handleSelectChange = (filterKey: string, event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterKey]: event.target.value,
    });
  };

  return (
    <div className={`bg-gray-200 p-4 rounded-lg shadow-md ${darkMode ? 'text-green-500' : ''}`}>
      <h2 className={`text-lg mb-2 font-bold ${darkMode ? 'text-green-500' : ''}`}>Filter Options</h2>
      {Object.entries(filteredOptions).map(([filterKey, filterValues]) => (
        <div className="mb-2" key={filterKey}>
          <select
            className="w-full"
            value={selectedFilters[filterKey] || ''}
            onChange={(e) => handleSelectChange(filterKey, e)}
          >
            <option value="">All {filterKey}</option>
            {filterValues.map((filterValue) => (
              <option key={filterValue.value} value={filterValue.value}>
                {filterValue.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <FilterButton onApply={handleApplyFilters} onReset={handleResetFilters} />
    </div>
  );
};

export default FilterOptions;
