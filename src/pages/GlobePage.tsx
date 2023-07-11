import React, { FunctionComponent, useEffect, useState } from "react";
// import axios from "axios";
import NavBar from "../components/NavBar";
import InteractiveGlobe from "../components/InteractiveGlobe";
// import FilterOptions from "../components/FilterOptions";
import InformationBox from "../components/InformationBox";
import UsersStatsBox from "../components/UsersStatsBox";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  darkModeAtom,
  filteredCommunitiesDataAtom,
  selectedFiltersAtom,
} from "../atoms";

// interface FilterOption {
//   label: string;
//   value: string;
// }

// interface FilterData {
//   countries: FilterOption[];
//   provinces: FilterOption[];
//   districts: FilterOption[];
//   villages: FilterOption[]; // Updated property name
// }

// interface CommunityData {
//   province: string;
//   district: string;
//   village_name: string;
//   longitude: number;
//   latitude: number;
//   population: number; // Added population field
// }

// interface TribeInfo {
//   name: string;
//   population: number;
//   country: string;
//   city: string;
//   community: string;
// }

interface GlobePageProps {}

const GlobePage: FunctionComponent<GlobePageProps> = () => {
  // const [selectedTribe, setSelectedTribe] = useState<CommunityData | null>(null);

  // const [selectedFilters, setSelectedFilters] =
  //   useRecoilState(selectedFiltersAtom);
  // const [filteredOptions, setFilteredOptions] = useState<
  //   Record<string, FilterOption[]>
  // >({});
  const darkMode = useRecoilValue(darkModeAtom);
  // const [communitiesData, setCommunitiesData] = useState<Community[]>([]);
  // const [filteredCommunitiesData, setFilteredCommunitiesData] = useRecoilState(
  //   filteredCommunitiesDataAtom
  // );

  // useEffect(() => {
  //   axios
  //     .get<CommunityData[]>(process.env.REACT_APP_BASE_URL + '/villages-info')
  //     .then((response) => {
  //       const { data } = response;

  //       const updatedFilteredOptions: Record<string, FilterOption[]> = {};

  //       updatedFilteredOptions["provinces"] = Array.from(
  //         new Set(data.map((community) => community.province))
  //       ).map((province) => ({ label: province, value: province }));

  //       updatedFilteredOptions["districts"] = Array.from(
  //         new Set(data.map((community) => community.district))
  //       ).map((district) => ({ label: district, value: district }));

  //       updatedFilteredOptions["villages"] = Array.from( // Updated property name
  //         new Set(data.map((community) => community.village_name))
  //       ).map((villageName) => ({ label: villageName, value: villageName }));

  //       setFilteredOptions(updatedFilteredOptions);
  //       setCommunitiesData(data);
  //       setFilteredCommunitiesData(data); // Set initial filteredCommunitiesData

  //       if (data.length > 0) {
  //         setSelectedTribe(data[0]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data: ", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (communitiesData.length > 0) {
  //     setSelectedTribe(communitiesData[0]);
  //   }
  // }, [communitiesData]);

  // useEffect(() => {
  //   // Update dependent filter options based on selected filters
  //   const updatedFilteredOptions: Record<string, FilterOption[]> = {
  //     ...filteredOptions,
  //   };

  //   if (selectedFilters.provinces) {
  //     updatedFilteredOptions["districts"] = Array.from(
  //       new Set(
  //         communitiesData
  //           .filter(
  //             (community) => community.province === selectedFilters.provinces
  //           )
  //           .map((community) => community.district)
  //       )
  //     ).map((district) => ({ label: district, value: district }));
  //   }

  //   if (selectedFilters.districts) {
  //     updatedFilteredOptions["villages"] = Array.from( // Updated property name
  //       new Set(
  //         communitiesData
  //           .filter(
  //             (community) => community.district === selectedFilters.districts
  //           )
  //           .map((community) => community.village_name)
  //       )
  //     ).map((villageName) => ({ label: villageName, value: villageName }));
  //   }

  //   setFilteredOptions(updatedFilteredOptions);
  // }, [communitiesData, selectedFilters]);

  // const filterData: FilterData = {
  //   countries: [{ label: "Afghanistan", value: "Afghanistan" }], // Only Afghanistan is available
  //   provinces: [],
  //   districts: [],
  //   villages: [], // Updated property name
  // };

  // const handleMarkerClick = (tribeInfo: TribeInfo | null) => {
  //   const community = communitiesData.find(
  //     (c) =>
  //       c.province === tribeInfo?.country &&
  //       c.district === tribeInfo?.city &&
  //       c.village_name === tribeInfo?.community
  //   );
  //   setSelectedTribe(community || null);
  // };

  return (
    <div
      className={`h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-green-300" : "bg-white text-green-700"
      }`}
    >
      <div>
        <NavBar />
      </div>

      <div className="flex-grow flex">
        <div
          className={`w-1/3 h-full overflow-auto p-4 space-y-4 ${
            darkMode
              ? "bg-gray-800 text-green-300"
              : "bg-green-200 text-green-700"
          }`}
        >
          {/* <FilterOptions
            filteredOptions={filteredOptions}
            selectedFilters={selectedFilters}
            handleFilterChange={handleFilterChange}
            handleApplyFilters={handleApplyFilters}
            handleResetFilters={handleResetFilters}
          /> */}

          
          <UsersStatsBox /> {/* Here is where you add the new component */}
        </div>

        <div className="flex-grow h-full relative">
          <InteractiveGlobe
            // communitiesData={filteredCommunitiesData}
            // handleMarkerClick={handleMarkerClick} // Update this line
          />
        </div>
      </div>
    </div>
  );
};

export default GlobePage;
