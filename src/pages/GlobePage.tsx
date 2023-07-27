import { FunctionComponent, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import InteractiveGlobe from "../components/InteractiveGlobe";
import MapFilters from "../components/MapFilters";
import InformationBox from "../components/InformationBox";
import ShowMapFilterButton from "../components/ShowMapFilterButton";
import UsersStatsBox from "../components/UsersStatsBox";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  darkModeAtom,
  locationDataAtom,
  isFilterModalVisibleAtom,
  isFilterButtonVisibleAtom,
  countryIdAtom,
  provinceIdAtom,
  districtIdAtom,
  villageIdAtom,
} from "../atoms";

interface Params {
  country_id: number;
  province_id: number;
  district_id: number;
  village_id?: number; // Add the village_id as an optional property
}

interface GlobePageProps {}

const GlobePage: FunctionComponent<GlobePageProps> = () => {
  const isFilterModalVisible = useRecoilValue(isFilterModalVisibleAtom);
  const isFilterButtonVisible = useRecoilValue(isFilterButtonVisibleAtom);
  const selectedCountryId = useRecoilValue(countryIdAtom);
  const selectedProvinceId = useRecoilValue(provinceIdAtom);
  const selectedDistrictId = useRecoilValue(districtIdAtom);
  const selectedVillageId = useRecoilValue(villageIdAtom);
  const setLocationData = useSetRecoilState(locationDataAtom);
  const darkMode = useRecoilValue(darkModeAtom);

  useEffect(() => {
    if (selectedCountryId && selectedProvinceId && selectedDistrictId) {
      // Create the params object with the specific keys
      const params: Params = {
        country_id: selectedCountryId,
        province_id: selectedProvinceId,
        district_id: selectedDistrictId,
      };
  
      // Use assertion to handle the optional property
      if (selectedVillageId) {
        params.village_id = selectedVillageId;
      }
  
      console.log("Fetching data with params:", params); // Add this log statement to see the data being fetched
  
      axios
      .get(`${process.env.REACT_APP_BASE_URL}/villages`, {
        params: params,
      })
      .then((response) => {
        console.log("Data received:", response.data); // log statement to see the fetched data
        setLocationData(response.data); // replace setVillagesData with setLocationData
      })
      .catch((error) => {
        console.error("Error fetching villages:", error);
      });
    }
  }, [selectedCountryId, selectedProvinceId, selectedDistrictId]);  

  return (
    <>
      {isFilterModalVisible && <MapFilters />}
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
            {isFilterButtonVisible && <ShowMapFilterButton />}
            <UsersStatsBox />
            <InformationBox />
          </div>

          <div className="flex-grow h-full relative">
            <InteractiveGlobe />
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobePage;