import { useState, useEffect } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isFilterModalVisibleAtom,
  isFilterButtonVisibleAtom,
  countryIdAtom,
  provinceIdAtom,
  districtIdAtom,
  villageIdAtom,
  countryNameAtom,
  provinceNameAtom,
  districtNameAtom,
  villageNameAtom,
  searchedVillageAtom
} from "../atoms";

type Location = {
  id: number;
  name: string;
};

interface LocationData {
  id: number;
  no: number;
  province: string;
  district: string;
  name: string;
  latitude: string;
  longitude: string;
  area_square_meter: string;
  hectares: string;
  shape_length: string;
  population: number;
  district_id: number;
}

const MapFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVillageName, setSelectedVillageName] = useRecoilState<string | null>(
    villageNameAtom
  );  
  const [countries, setCountries] = useState<Location[]>([]);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [villages, setVillages] = useState<Location[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedCountryName, setSelectedCountryName] = useRecoilState<
    string | null
  >(countryNameAtom);
  const [selectedProvinceName, setSelectedProvinceName] = useRecoilState<
    string | null
  >(provinceNameAtom);
  const [selectedDistrictName, setSelectedDistrictName] = useRecoilState<
    string | null
  >(districtNameAtom);
  const [isFilterModalVisible, setIsFilterModalVisible] = useRecoilState(
    isFilterModalVisibleAtom
  );
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useRecoilState(
    isFilterButtonVisibleAtom
  );
  const [searchedVillage, setSearchedVillage] = useRecoilState(searchedVillageAtom);

  const [selectedCountryId, setSelectedCountryId] = useRecoilState<
    number | null
  >(countryIdAtom);
  const [selectedProvinceId, setSelectedProvinceId] = useRecoilState<
    number | null
  >(provinceIdAtom);
  const [selectedDistrictId, setSelectedDistrictId] = useRecoilState<
    number | null
  >(districtIdAtom);
  const [selectedVillageId, setSelectedVillageId] = useRecoilState<
    number | null
  >(villageIdAtom);

  const [tempSelectedCountryId, setTempSelectedCountryId] = useState<
    number | null
  >(selectedCountryId);
  const [tempSelectedProvinceId, setTempSelectedProvinceId] = useState<
    number | null
  >(selectedProvinceId);
  const [tempSelectedDistrictId, setTempSelectedDistrictId] = useState<
    number | null
  >(selectedDistrictId);
  const [tempSelectedVillageId, setTempSelectedVillageId] = useState<
    number | null
  >(selectedVillageId);

  const getData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<Location[]>>,
    queryParams?: Record<string, any>
  ) => {
    try {
      const res = await axios.get(url, { params: queryParams });
      setData(res.data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };  

  useEffect(() => {
    getData(`${process.env.REACT_APP_BASE_URL}/countries`, setCountries);
  }, []);

  useEffect(() => {
    if (tempSelectedCountryId) {
      getData(
        `${process.env.REACT_APP_BASE_URL}/provinces/${tempSelectedCountryId}`,
        setProvinces
      );
    } else {
      setProvinces([]);
    }
  }, [tempSelectedCountryId]);

  useEffect(() => {
    if (tempSelectedProvinceId) {
      getData(
        `${process.env.REACT_APP_BASE_URL}/districts/${tempSelectedProvinceId}`,
        setDistricts
      );
    } else {
      setDistricts([]);
    }
  }, [tempSelectedProvinceId]);

  useEffect(() => {
    if (tempSelectedDistrictId) {
      getData(
        `${process.env.REACT_APP_BASE_URL}/villages/${tempSelectedDistrictId}`,
        setVillages
      );
    } else {
      setVillages([]);
    }
  }, [tempSelectedDistrictId]);

  const getVillagesBySearchTerm = async (): Promise<boolean> => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/villages/search`,
        {
          params: { village_name: searchTerm },
        }
      );
  
      const village = res.data[0];
      if (village) {
        setSearchedVillage(village);
        setTempSelectedVillageId(village.id);
        setVillages([village]); // Update villages state
        setErrorMessage(""); // Clear any error message
        return true;
      } else {
        setTempSelectedVillageId(null);
        setVillages([]); // Clear villages state
        return false;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data?.message || 'An error occurred');
      } else {
        setErrorMessage('An error occurred');
      }
      return false;
    }
  };  

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    // If search term is empty then we are allowed to update other filters
    if (!searchTerm) {
      const selectedValue = e.target.value !== "" ? +e.target.value : null;
      setState(selectedValue);
    }
  };

  const resetFilters = () => {
    setTempSelectedCountryId(null);
    setTempSelectedProvinceId(null);
    setTempSelectedDistrictId(null);
    setTempSelectedVillageId(null);
  };

  const applyFilters = () => {
    if (searchTerm) {
      console.log("Fetching villages by search term", searchTerm);
      getVillagesBySearchTerm().then((villageFound) => {
        if (villageFound) {
          setSelectedVillageId(tempSelectedVillageId);
          setSelectedVillageName(searchTerm);

          // Hide filter modal and show filter button
          setIsFilterModalVisible(false);
          setIsFilterButtonVisible(true);
        } else {
          setErrorMessage("Village not found");
        }
      });
    } else {
      setErrorMessage("");
      setSelectedCountryId(tempSelectedCountryId);
      setSelectedProvinceId(tempSelectedProvinceId);
      setSelectedDistrictId(tempSelectedDistrictId);
      setSelectedVillageId(tempSelectedVillageId);
  
      const selectedCountryName =
        countries.find((c) => c.id === tempSelectedCountryId)?.name || "";
      const selectedProvinceName =
        provinces.find((p) => p.id === tempSelectedProvinceId)?.name || "";
      const selectedDistrictName =
        districts.find((d) => d.id === tempSelectedDistrictId)?.name || "";
      const selectedVillageName =
        villages.find((v) => v.id === tempSelectedVillageId)?.name || "";
  
      setSelectedCountryName(selectedCountryName);
      setSelectedProvinceName(selectedProvinceName);
      setSelectedDistrictName(selectedDistrictName);
      // Update village name
      setSelectedVillageName(selectedVillageName);
  
      setIsFilterModalVisible(false);
      setIsFilterButtonVisible(true);
    }
  };

  const closeHandler = () => {
    setIsFilterModalVisible(false);
    setIsFilterButtonVisible(true);
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="modal-content w-3/4 max-w-2xl p-6 bg-white rounded-lg shadow-lg relative">
      <MdClose
        className="absolute right-4 top-4 cursor-pointer"
        size={24}
        onClick={closeHandler}
      />
      {errorMessage && (
        <div className="text-red-500 mb-4">{errorMessage}</div>
      )}
      <div className="flex items-center justify-between w-full max-w-md p-2 mb-4 mx-auto bg-white rounded-full shadow-md">
        <AiOutlineSearch className="text-gray-400" />
        <input
           type="text"
           placeholder="Find a village"
           className="w-full px-2 py-1 outline-none"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
        <div className="mb-8">
          <label
            className="block text-gray-700 text-sm font-bold mb-4"
            htmlFor="country-select"
          >
            Select Country
          </label>
          <select
            id="country-select"
            value={tempSelectedCountryId || ""}
            onChange={(e) => handleSelectChange(e, setTempSelectedCountryId)}
            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label
            className="block text-gray-700 text-sm font-bold mb-4"
            htmlFor="province-select"
          >
            Select Province
          </label>
          <select
            id="province-select"
            value={tempSelectedProvinceId || ""}
            onChange={(e) => handleSelectChange(e, setTempSelectedProvinceId)}
            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3"
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label
            className="block text-gray-700 text-sm font-bold mb-4"
            htmlFor="district-select"
          >
            Select District
          </label>
          <select
            id="district-select"
            value={tempSelectedDistrictId || ""}
            onChange={(e) => handleSelectChange(e, setTempSelectedDistrictId)}
            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label
            className="block text-gray-700 text-sm font-bold mb-4"
            htmlFor="village-select"
          >
            Select Village
          </label>
          <select
            id="village-select"
            value={tempSelectedVillageId || ""}
            onChange={(e) => handleSelectChange(e, setTempSelectedVillageId)}
            className="block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3"
          >
            <option value="">Select Village</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={applyFilters}
          >
            Apply
          </button>

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;