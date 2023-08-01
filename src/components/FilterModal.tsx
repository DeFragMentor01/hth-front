import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaFilter } from "react-icons/fa";
import { useRecoilState } from "recoil";
import {
  filterState,
  darkModeAtom,
  totalUsersAtom,
  filtersAppliedAtom,
  countryFilterState,
  stateFilterState,
  cityFilterState,
  communityFilterState,
  villageFilterState,
  genderFilterState,
  specificAgeFilterState, // Add this
  ageRangeFilterState, // Add this
  verifiedFilterState,
} from "../atoms";
import axios from "axios";

type FilterStateType = {
  country: string;
  state: string;
  city: string;
  community: string;
  village: string;
  gender: string;
  specificAge: string; // Add this
  ageRange: string; // Add this
  verified: string;
};

// Initialize the filter state.
const initialFilterState: FilterStateType = {
  country: "",
  state: "",
  city: "",
  community: "",
  village: "",
  gender: "",
  specificAge: "", // Add this
  ageRange: "", // Add this
  verified: "",
};

const FilterModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useRecoilState(filterState);
  const [tempFilter, setTempFilter] =
    useState<FilterStateType>(initialFilterState);
  const [filtersApplied, setFiltersApplied] =
    useRecoilState(filtersAppliedAtom);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [communities, setCommunities] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  const [isAfghanistan, setIsAfghanistan] = useState(false);
  // global variables to store user's selection
  const [specificAgeFilter, setSpecificAgeFilter] = useRecoilState(
    specificAgeFilterState
  ); // Add this
  const [ageRangeFilter, setAgeRangeFilter] =
    useRecoilState(ageRangeFilterState);
  const [countryFilter, setCountryFilter] = useRecoilState(countryFilterState);
  const [genderFilter, setGenderFilter] = useRecoilState(genderFilterState);
  const [stateFilter, setStateFilter] = useRecoilState(stateFilterState);
  const [cityFilter, setCityFilter] = useRecoilState(cityFilterState);
  const [communityFilter, setCommunityFilter] =
    useRecoilState(communityFilterState);
  const [villageFilter, setVillageFilter] = useRecoilState(villageFilterState);
  const [verifiedFilter, setVerifiedFilter] =
    useRecoilState(verifiedFilterState);
  const [darkMode] = useRecoilState(darkModeAtom);

  useEffect(() => {
    const fetchData = async () => {
      if (!tempFilter.country) {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user-countries`
        );
        setCountries(response.data);
        return;
      }

      if (tempFilter.country && !tempFilter.state) {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user-states`,
          { params: { country: tempFilter.country } }
        );
        setStates(response.data);
        return;
      }

      if (tempFilter.state && !tempFilter.city && !tempFilter.community) {
        const cityResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user-cities`,
          { params: { state: tempFilter.state } }
        );
        setCities(cityResponse.data);
        const communityResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user-communities`,
          { params: { state: tempFilter.state } }
        );
        setCommunities(communityResponse.data);
        return;
      }

      if (tempFilter.community && !tempFilter.village) {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user-villages`,
          { params: { community: tempFilter.community } }
        );
        setVillages(response.data);
        return;
      }
    };
    fetchData();
  }, [tempFilter]);

  useEffect(() => {
    if (tempFilter.country === "Afghanistan") {
      setIsAfghanistan(true);
    } else {
      setIsAfghanistan(false);
    }
  }, [tempFilter.country]);

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      setTempFilter((prevFilter) => {
        const newFilter = { ...prevFilter, [name]: value };
        return newFilter;
      });
    },
    []
  );

  const closeModal = () => {
    // Ensure at least one filter is set before allowing the modal to close
    if (
      filter.country ||
      filter.state ||
      filter.city ||
      filter.community ||
      filter.village
    ) {
      setIsOpen(false);
    } else {
      alert("Please set at least one filter before closing.");
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const applyFilters = useCallback(() => {
    // Update the global filter state when applying filters
    setFilter(tempFilter);
    setFiltersApplied(true);
    setCountryFilter(tempFilter.country);
    setStateFilter(tempFilter.state);
    setCityFilter(tempFilter.city);
    setCommunityFilter(tempFilter.community);
    setVillageFilter(tempFilter.village);
    setGenderFilter(tempFilter.gender);
    setSpecificAgeFilter(Number(tempFilter.specificAge));
    setAgeRangeFilter(tempFilter.ageRange);
    setVerifiedFilter(tempFilter.verified); // Add this
    setIsOpen(false);
  }, [
    tempFilter,
    setFilter,
    setFiltersApplied,
    setCountryFilter,
    setStateFilter,
    setCityFilter,
    setCommunityFilter,
    setVillageFilter,
    setGenderFilter,
    setSpecificAgeFilter,
    setAgeRangeFilter,
    setVerifiedFilter,
    setIsOpen,
  ]);

  const resetFilters = useCallback(() => {
    // Also reset the temporary filter state
    setFilter(initialFilterState);
    setTempFilter(initialFilterState);
  }, [setFilter, setTempFilter]);

  return (
    <div>
      {!isOpen && (
        <button
          onClick={openModal}
          className={`px-3 py-1 border border-green-700 rounded-lg self-start ml-auto ${
            darkMode ? "bg-green-500 text-gray-900" : "bg-green-700 text-white"
          } font-semibold focus:outline-none`}
        >
          <FaFilter className="inline-block mr-2" />
          Filter Options
        </button>
      )}

      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Filters
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Specific Age
                    </label>
                    <input
                      type="number"
                      name="specificAge"
                      value={tempFilter.specificAge}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Age Range
                    </label>
                    <select
                      name="ageRange"
                      value={tempFilter.ageRange}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select an Age Range</option>
                      <option value="0-20">0-20</option>
                      <option value="21-40">21-40</option>
                      <option value="41-60">41-60</option>
                      <option value="61-80">61-80</option>
                      <option value="81-100">81-100</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      name="country"
                      value={tempFilter.country}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {isAfghanistan ? "Province" : "State"}
                    </label>
                    <select
                      name="state"
                      value={tempFilter.state}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">
                        {isAfghanistan ? "Select a Province" : "Select a State"}
                      </option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!isAfghanistan && (
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <select
                        name="city"
                        value={tempFilter.city}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a City</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {isAfghanistan ? "District" : "Community"}
                    </label>
                    <select
                      name="community"
                      value={tempFilter.community}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">{isAfghanistan ? "Select a District" : "Select a Community"}</option>
                      {communities.map((community) => (
                        <option key={community} value={community}>
                          {community}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Village
                    </label>
                    <select
                      name="village"
                      value={tempFilter.village}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a Village</option>
                      {villages.map((village) => (
                        <option key={village} value={village}>
                          {village}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={tempFilter.gender}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Verified
                    </label>
                    <select
                      name="verified"
                      value={tempFilter.verified}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All</option>
                      <option value="true">Verified Users</option>
                      <option value="false">Unverified Users</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={applyFilters}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Reset Filters
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterModal;
