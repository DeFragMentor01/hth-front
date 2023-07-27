import React, { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { darkModeAtom, countryIdAtom, provinceIdAtom, districtIdAtom, countryNameAtom, provinceNameAtom, districtNameAtom } from '../atoms';

const InformationBox: FunctionComponent = () => {
  const darkMode = useRecoilValue(darkModeAtom);
  const countryId = useRecoilValue(countryIdAtom);
  const provinceId = useRecoilValue(provinceIdAtom);
  const districtId = useRecoilValue(districtIdAtom);
  
  const [countryVillageCount, setCountryVillageCount] = useState<number | null>(null);
  const [provinceVillageCount, setProvinceVillageCount] = useState<number | null>(null);
  const [districtVillageCount, setDistrictVillageCount] = useState<number | null>(null);

  const countryName = useRecoilValue(countryNameAtom);
  const provinceName = useRecoilValue(provinceNameAtom);
  const districtName = useRecoilValue(districtNameAtom);

  useEffect(() => {
    if (countryId) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/villages/count/country/${countryId}`)
        .then(response => {
          console.log('Country data:', response.data);
          setCountryVillageCount(response.data.count)
        });
    }

    if (provinceId) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/villages/count/province/${provinceId}`)
        .then(response => {
          console.log('Province data:', response.data);
          setProvinceVillageCount(response.data.count)
        });
    }

    if (districtId) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/villages/count/district/${districtId}`)
        .then(response => {
          console.log('District data:', response.data);
          setDistrictVillageCount(response.data.count)
        });
    }
  }, [countryId, provinceId, districtId]);

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${darkMode ? 'text-green-500' : 'text-black'} divide-y divide-gray-200`}>
    <div className="py-4">
        <h2 className="text-2xl font-bold">Country: {countryName}</h2>
        <p className="text-lg">Villages: {countryVillageCount}</p>
    </div>
    <div className="py-4">
        <h2 className="text-2xl font-bold">Province: {provinceName}</h2>
        <p className="text-lg">Villages: {provinceVillageCount}</p>
    </div>
    <div className="py-4">
        <h2 className="text-2xl font-bold">District: {districtName}</h2>
        <p className="text-lg">Villages: {districtVillageCount}</p>
    </div>
</div>
  );
};

export default InformationBox;