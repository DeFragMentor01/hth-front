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

  const [countryUserCounts, setCountryUserCounts] = useState({ verifiedCount: 0, nonVerifiedCount: 0 });
  const [provinceUserCounts, setProvinceUserCounts] = useState({ verifiedCount: 0, nonVerifiedCount: 0 });
  const [districtUserCounts, setDistrictUserCounts] = useState({ verifiedCount: 0, nonVerifiedCount: 0 });

  const countryName = useRecoilValue(countryNameAtom);
  const provinceName = useRecoilValue(provinceNameAtom);
  const districtName = useRecoilValue(districtNameAtom);

    console.log('InformationBox component rendered'); 

   useEffect(() => {
    console.log('Base URL:', process.env.REACT_APP_BASE_URL);  // Log base URL

    const fetchCounts = async (locationType: 'country' | 'province' | 'district', userType: 'country' | 'state' | 'community', name: string | null, id: number | null) => {
      if (name && id) {
        try {
          const villageResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/villages/count/${locationType}/${id}`);
          console.log(`${locationType} village response data:`, villageResponse.data);  // Log village response data

          const userResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/verified/count`, { params: { [userType]: name } });
          console.log(`${locationType} user response data:`, userResponse.data);  // Log user response data

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
            default:
              break;
          }
        } catch (error) {
          console.error(`${locationType} fetch error:`, error);  // Log any errors
        }
      }
    };

    fetchCounts('country', 'country', countryName, countryId);
    fetchCounts('province', 'state', provinceName, provinceId);
    fetchCounts('district', 'community', districtName, districtId);
  }, [countryId, provinceId, districtId]);
  
    console.log('Country Village Count:', countryVillageCount); 

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${darkMode ? 'text-green-500' : 'text-black'} divide-y divide-gray-300`}>
    <div className="py-4 space-y-2">
        <h2 className="text-2xl font-semibold tracking-wide">Country: {countryName}</h2>
{/*         <p className="text-lg">Villages: <span className="font-medium">{countryVillageCount}</span></p> */}
      <p className="text-lg">Villages: <span className="font-medium">7888</span></p>
        <p className="text-lg">Verified users: <span className="font-medium">{countryUserCounts.verifiedCount}</span></p>
        <p className="text-lg">Non-verified users: <span className="font-medium">{countryUserCounts.nonVerifiedCount}</span></p>
    </div>
    <div className="py-4 space-y-2">
        <h2 className="text-2xl font-semibold tracking-wide">Province: {provinceName}</h2>
        <p className="text-lg">Villages: <span className="font-medium">{provinceVillageCount}</span></p>
        <p className="text-lg">Verified Users: <span className="font-medium">{provinceUserCounts.verifiedCount}</span></p>
        <p className="text-lg">Non-Verified Users: <span className="font-medium">{provinceUserCounts.nonVerifiedCount}</span></p>
    </div>
    <div className="py-4 space-y-2">
        <h2 className="text-2xl font-semibold tracking-wide">District: {districtName}</h2>
        <p className="text-lg">Villages: <span className="font-medium">{districtVillageCount}</span></p>
        <p className="text-lg">Verified Users: <span className="font-medium">{districtUserCounts.verifiedCount}</span></p>
        <p className="text-lg">Non-Verified Users: <span className="font-medium">{districtUserCounts.nonVerifiedCount}</span></p>
    </div>
</div>
  );
};

export default InformationBox;
