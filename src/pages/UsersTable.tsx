import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { darkModeAtom } from "../atoms";
import { FaFilter } from "react-icons/fa";
import { uniq } from "lodash";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NavBar from "../components/NavBar";

interface FilterOptions {
  state?: string[];
  age?: number[];
  village?: string[];
  community?: string[];
  city?: string[];
  country?: string[];
};

interface Person {
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  village: string;
  community: string;
  city: string;
  state: string;
  country: string;
  dateofbirth: string;
}

const UsersTable = () => {
  const [data, setData] = useState<Person[]>([]);
const [convertedData, setConvertedData] = useState<Person[]>([]);
const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState(0);
  const [darkMode, setDarkMode] = useRecoilState(darkModeAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageSize, setPageSize] = useState(100); // Dynamic page size

  const [end, setEnd] = useState(pageSize);
  const tableContainerRef = useRef(null);

  // States for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countries, setCountries] = useState<Partial<FilterOptions>>({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/users?page=${page}&pageSize=${pageSize}`
      ) // Pass the pageSize parameter in the API request
      .then((response) => {
        const { data } = response;
        const converted = data.users.map((person: Person) => ({
  ...person,
  age: calculateAge(new Date(person.dateofbirth)),
}));
        
        setData((prevData) => [...prevData, ...converted]);
        setTotalUsers(data.total);
        setConvertedData((prevConvertedData) => [
          ...prevConvertedData,
          ...converted,
        ]);
        setFilteredData((prevFilteredData) => [
          ...prevFilteredData,
          ...converted,
        ]);

      const options: Partial<FilterOptions> = {};

if (data.users.length > 0) {
  Object.keys(data.users[0]).forEach((key) => {
    if (key === "age") {
      options[key] = uniq<number>(data.users.map((item: Person) => item[key])) as number[];
    } else if (
      key === "village" ||
      key === "city" ||
      key === "community" ||
      key === "state" ||
      key === "country"
    ) {
      options[key] = uniq<string>(data.users.map((item: Person) => item[key])) as string[];
    }
  });
  setCountries(options);
}
        
        // Increase the page size after every additional 100 user data has been loaded
        if (data.users.length === pageSize) {
          setPageSize((prevPageSize) => prevPageSize + 100);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page, pageSize]); // Add pageSize dependency

const capitalizeFirstLetter = (string: string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
};

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Effects for the modal
  useEffect(() => {
    // Fetch initial filter options for countries
    axios
      .get("/users/filters")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      });
  }, []);

  // Handle functions for the modal
  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
    setSelectedState("");
    setSelectedCity("");

    // Fetch filter options for states based on the selected country
    axios
      .get(`/users/filters?country=${selectedCountry}`)
      .then((response) => {
        setStates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      });
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
    setSelectedCity("");

    // Fetch filter options for cities based on the selected country and state
    axios
      .get(`/users/filters?country=${selectedCountry}&state=${selectedState}`)
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      });
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Make a request to fetch filtered user data based on the selected filters
    axios
      .get(
        `/users?country=${selectedCountry}&state=${selectedState}&city=${selectedCity}`
      )
      .then((response) => {
        const filteredData = response.data;
        // Handle the filtered data, update your UI, etc.
      })
      .catch((error) => {
        console.error("Error fetching filtered user data:", error);
      });
    setIsModalOpen(false);
  };

  const table = useReactTable({
    data: filteredData,
    columns: useMemo(() => {
      const columnHelper = createColumnHelper<Person>();

      return [
        columnHelper.accessor("firstname", {
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("lastname", {
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("age", {
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("gender", {
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("village", {
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("community", {
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("city", {
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("state", {
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("country", {
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
        }),
      ];
    }, []),
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <NavBar />
      <div
        className={`flex flex-col min-h-screen ${
          darkMode ? "bg-gray-800 text-green-200" : "bg-gray-100 text-green-700"
        }`}
      >
        <div className="flex flex-row-reverse">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-md"
          >
            Open Filters
          </button>
        </div>
        <div className="flex-1 px-8 py-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-green-700 dark:text-green-200">
              People of iTribe
            </h1>
            <button
              className={`px-3 py-1 border border-green-700 rounded-lg self-start ml-auto ${
                darkMode
                  ? "bg-green-500 text-gray-900"
                  : "bg-green-700 text-white"
              } font-semibold focus:outline-none`}
            >
              <FaFilter className="inline-block mr-2" />
              Filter Options
            </button>
          </div>
          <div className="mx-auto max-w-4xl mt-4 bg-gray-700 dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden p-5">
            <div
              onScroll={handleScroll}
              className="overflow-y-auto h-96"
              ref={tableContainerRef}
            >
              <table
                className={`w-full table-auto ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <thead>
                  {table.headerGroups.map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className={`${
                        darkMode
                          ? "bg-gray-800 text-green-200"
                          : "bg-green-700 text-white"
                      } sticky top-0`}
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="py-3 px-5 text-left border-r border-b border-green-700"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                columnHelper.accessor(
                                  header.column.columnDef.header,
                                  {
                                    cell: (info) =>
                                      capitalizeFirstLetter(info.getValue()),
                                    footer: (info) => info.column.id,
                                  }
                                ),
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className={darkMode ? "text-green-300" : "text-green-700"}
                >
                  {table.rowModel.rows.slice(0, end).map((row, index) => (
                    <tr
                      key={row.id}
                      className={
                        index % 2 === 0
                          ? darkMode
                            ? "bg-gray-800"
                            : "bg-white"
                          : darkMode
                          ? "bg-gray-700"
                          : "bg-gray-200"
                      }
                    >
                      {row.visibleCells.map((cell) => (
                        <td
                          key={cell.id}
                          className="py-3 px-6 text-left whitespace-nowrap border-r border-b border-green-700"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className={`text-2xl text-green-300 ${
                darkMode ? "dark:text-green-200" : ""
              }`}
            >
              Displaying {filteredUsers} of {totalUsers} users.
            </p>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg">
              <h2 className="text-2xl mb-4">Filters</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Country:
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  State:
                  <select value={selectedState} onChange={handleStateChange}>
                    <option value="">Select a state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  City:
                  <select value={selectedCity} onChange={handleCityChange}>
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit">Apply Filters</button>
              </form>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersTable;
