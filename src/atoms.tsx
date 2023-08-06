import { atom } from "recoil";


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

interface VillageData {
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

interface FormData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  date: string;
  month: string;
  year: string;
  gender: string;
  village: string;
  community: string;
  city: string;
  state: string;
  country: string;
  memberType: 'community member' | 'community leader';
}

export interface CommunityData {
  village_name: string;
  province: string;
  district: string;
  longitude: number;
  latitude: number;
  population: number; // Add the population field
}


export interface Community {
  village_name: string;
  province: string;
  district: string;
  longitude: number;
  latitude: number;
}


export interface Poll {
  id: string;
  title: string;
  question: string;
  options: string[];
  status: 'active' | 'closed';
  results: { [key: string]: number };
  votersCount: number;
  votesCount: number;
  timeCreated: string;
}

export interface FilterData {
  countries: string[];
  cities: Record<string, string[]>;
  communities: string[];
  villages: Record<string, CommunityData[]>;
}

type FilterStateType = {
  country: string;
  state: string;
  city: string;
  community: string;
  village: string;
  gender: string;
};


const initialFilterState: FilterStateType = {
  country: '',
  state: '',
  city: '',
  community: '',
  village: '',
  gender: '',
};

export const darkModeAtom = atom<boolean>({
  key: "darkMode",
  default: false,
});

export const fetchedDataAtom = atom<CommunityData[]>({
  key: "fetchedDataAtom",
  default: [],
});

export const selectedFiltersAtom = atom<Record<string, string | string[]>>({
  key: 'selectedFilters',
  default: {},
});

export const districtIdAtom = atom<number | null>({
  key: 'districtId',
  default: null,
});

export const villageIdAtom = atom<number | null>({
  key: 'villageId',
  default: null,
});

export const countryIdAtom = atom<number | null>({
  key: 'countryId',
  default: null,
});

export const provinceIdAtom = atom<number | null>({
  key: 'provinceId',
  default: null,
});

export const locationDataAtom = atom<LocationData[]>({
  key: 'locationData',
  default: [],
});

export const villageAtom = atom({
  key: 'villageAtom', // unique ID
  default: null, // default value
});

export const searchedVillageAtom = atom({
  key: 'searchedVillage',
  default: null,
});

export const villageNameAtom = atom<string | null>({
  key: "villageNameAtom",
  default: null,
});


export const countryNameAtom = atom<string | null>({
  key: "countryName",
  default: null,
});

export const provinceNameAtom = atom<string | null>({
  key: "provinceName",
  default: null,
});

export const districtNameAtom = atom<string | null>({
  key: "districtName",
  default: null,
});

export const filterState = atom<FilterStateType>({
  key: 'filterState',
  default: initialFilterState,
});

export const genderFilterState = atom({
  key: 'genderFilterState',
  default: "",
});

export const specificAgeFilterState = atom<number>({
  key: "specificAgeFilterState",
  default: 0,
});

export const ageRangeFilterState = atom<string>({
  key: "ageRangeFilterState",
  default: "",
});

export const verifiedFilterState = atom({
  key: "verifiedFilterState",
  default: "",
});


export const countryFilterState = atom<string>({
  key: 'countryFilterState',
  default: '',
});

export const stateFilterState = atom<string>({
  key: 'stateFilterState',
  default: '',
});

export const cityFilterState = atom<string>({
  key: 'cityFilterState',
  default: '',
});

export const communityFilterState = atom<string>({
  key: 'communityFilterState',
  default: '',
});

export const villageFilterState = atom<string>({
  key: 'villageFilterState',
  default: '',
});

export const filtersAppliedAtom = atom({
  key: 'filtersAppliedAtom',
  default: false,
});

export const totalUsersAtom = atom({
  key: 'totalUsers', // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});

export const isFilterButtonVisibleAtom = atom({
  key: 'isFilterButtonVisible',
  default: false,
});

export const isFilterModalVisibleAtom = atom({
  key: 'isFilterModalVisible',
  default: true,
});

export const memberTypeAtom = atom<'community member' | 'community leader' | null>({
  key: 'memberType',
  default: null,
});

export const showLoginFormAtom = atom<boolean>({
  key: "showLoginFormAtom",
  default: true,
});

export const currentStepAtom = atom<number>({
  key: "currentStep",
  default: 0,
});

export const userIsAuth = atom<boolean>({
  key: "userIsAuth",
  default: false,
});

export const registrationDataState = atom<FormData>({
  key: 'registrationDataState',
  default: {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    date: '',
    month: '',
    year: '',
    gender: '',
    village: '',
    community: '',
    city: '',
    state: '',
    country: '',
    memberType: 'community member',
  },
});

export const errorsAtom = atom<string[]>({
  key: "errors",
  default: [],
});

export const loginEmailAtom = atom<string>({
  key: "loginEmail",
  default: "",
});

export const loginPasswordAtom = atom<string>({
  key: "loginPassword",
  default: "",
});

export const rememberMeAtom = atom<boolean>({
  key: "rememberMe",
  default: false,
});

export const userStatState = atom({
  key: 'userStatState', 
  default: [
    { 
      title: "Users Registered in the Last Week", 
      count: 228643, 
      growth: 128 
    },
    {
      title: "New Found Tribes in the Past Week",
      count: 15,
      growth: 10
    },
    {
      title: "Main Resources Received by Ajal Tribe This Week",
      items: [
        { itemName: "Rice", percentage: 30 },
        { itemName: "Beans", percentage: 20 },
        { itemName: "Water", percentage: 50 },
      ]
    },
    {
      title: "Posts Created in the Last Week",
      count: 843,
      growth: 16
    },
    {
      title: "New Donations This Week",
      count: 237,
      growth: 40
    },
    {
      title: "Volunteers Joined This Month",
      count: 76,
      growth: 25
    },
    {
      title: "Resources Distributed to Jivara Tribe This Week",
      items: [
        { itemName: "Maize", percentage: 40 },
        { itemName: "Fishing Nets", percentage: 30 },
        { itemName: "Tents", percentage: 30 },
      ]
    },
  ], 
});



export const filterData = atom<FilterData>({
  key: 'filterData',
  default: {
    countries: [],
    cities: {},
    communities: [],
    villages: {},
  },
});

export const pollsState = atom<Poll[]>({
  key: 'pollsState',
  default: [
    // Active polls
    {
      id: '1',
      title: "Drinking water",
      status: "active",
      question: "Has access to drinking water become more accessible within the last month?",
      options: ["Yes", "No"],
      results: {},
      votersCount: 0,
      votesCount: 0,
      timeCreated: "1 minute ago",
    },
    {
      id: '2',
      title: "Bullying in Schools",
      status: "active",
      question: "Are more children attending school since the introduction of the new 'No Bullying' policy?",
      options: ["Yes", "No"],
      results: {},
      votersCount: 0,
      votesCount: 0,
      timeCreated: "10 minutes ago",
    },
    // Closed polls
    {
      id: '3',
      title: "Crime Rate",
      status: "closed",
      question: "Has the crime rate gone down since the introduction of locally available mental-illness assistance centers opened?",
      options: ["Yes", "No"],
      results: {"Yes": 60000, "No": 40000},
      votersCount: 100000,
      votesCount: 100000,
      timeCreated: "1 hour ago",
    },
    {
      id: '4',
      title: 'Average daily food consumption',
      question: 'How many meals a day does every person in your village receive based on the new "Human Feeding Plan"?',
      options: ['A - 2 meals a day', 'B - 3 meals a day', 'C - 3 meals a day with snacks'],
      status: 'active',
      results: {},
      votersCount: 0,
      votesCount: 0,
      timeCreated: "5 minutes ago",
    },
    {
      id: '5',
      title: "Correct clothing",
      status: "closed",
      question: "Do you have the correct clothing to live healthly in the winter?",
      options: ["Yes", "No"],
      results: {"Yes": 999900, "No": 100},
      votersCount: 1000000,
      votesCount: 1000000,
      timeCreated: "2 hours ago",
    }
  ]
});

