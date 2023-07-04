import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { darkModeAtom } from '../atoms';
import { FaFilter } from 'react-icons/fa';
import uniq from 'lodash/uniq';
import { Person, createColumnHelper, flexRender, useReactTable } from '../utils';
import { NavBar } from './NavBar';

const PAGE_SIZE = 100; 

const UsersTable: React.FC = () => {
  const [data, setData] = useState<Person[]>([]);
  const [page, setPage] = useState(0);
  const [convertedData, setConvertedData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState(0);
  const [darkMode, setDarkMode] = useRecoilState(darkModeAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<{ [key: string]: string[] }>({});

  const filterOptions = useMemo(() => {
    const options: { [key: string]: string[] } = {};
    data.forEach((user) => {
      ["age", "village", "city", "community", "state", "country"].forEach((key) => {
        if (!options[key]) options[key] = [];
        if (!options[key].includes(user[key])) options[key].push(user[key]);
      });
    });
    return options;
  }, [data]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/users?page=${page}`)
      .then((response) => {
        const { data } = response;
        const converted = data.users.map((person: Person) => ({
          ...person,
          age: calculateAge(new Date(person.dateofbirth)),
        }));

        setData((prevData) => [...prevData, ...converted]);
        setTotalUsers(data.total);
        setConvertedData((prevConvertedData) => [...prevConvertedData, ...converted]);
        setFilteredData((prevFilteredData) => [...prevFilteredData, ...converted]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page]);

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const applyFilters = useCallback(() => {
    if (convertedData.length > 0) {
      const newFilteredData = convertedData.filter((data) => {
        for (const [key, values] of Object.entries(filterValues)) {
          if (values.includes(data[key].toString())) return true;
        }
        return false;
      });
      setFilteredData(newFilteredData);
    }
  }, [convertedData, filterValues]);

  const handleFilterChange = useCallback(
    (column: string, value: string, { checked }: { checked: boolean }) => {
      setFilterValues((prevFilterValues) => {
        const newFilterValues = { ...prevFilterValues };
        newFilterValues[column] = checked
          ? [...(newFilterValues[column] || []), value]
          : (newFilterValues[column] || []).filter((item: string) => item !== value);
        if (newFilterValues[column].length === 0) {
          delete newFilterValues[column];
        }
        return newFilterValues;
      });
    },
    []
  );

  const handleFilterReset = () => {
    setFilterValues({});
  };

  const columns = useMemo(() => {
    const fields = ['name', 'age', 'gender', 'village', 'city', 'community', 'state', 'country'];
    return createColumnHelper(fields, { render: flexRender });
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const tableInstance = useReactTable({ columns, data: filteredData, handleScroll });

  useEffect(() => {
    applyFilters();
  }, [filterValues, applyFilters]);

return (
  <>
    <NavBar />
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-800 text-green-200" : "bg-gray-100 text-green-700"}`}>
      <div className="flex flex-row-reverse">
        {isSidebarOpen && (
          <div className={`w-52 transition-all overflow-y-auto ${darkMode ? "bg-gray-700 text-green-200" : "bg-gray-200 text-green-700"} z-10 shadow-lg rounded-r-lg`}>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Filter Options</h2>
              {Object.keys(filterOptions).map((column) => (
                <details key={column} className="mb-4">
                  <summary className="font-semibold mb-2">
                    {column === "dateofbirth" ? "Age" : capitalizeFirstLetter(column)}
                  </summary>
                  {column === "dateofbirth" ? (
                    <>
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="ageFilterType"
                          checked={filterValues.age !== undefined}
                          onChange={() => handleFilterChange("age", "specific", { checked: true })}
                          className="mr-2"
                        />
                        <label>Specific Age</label>
                      </div>
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="ageFilterType"
                          checked={filterValues.age === undefined}
                          onChange={() => handleFilterChange("age", "range", { checked: true })}
                          className="mr-2"
                        />
                        <label>Age Range</label>
                      </div>
                      {filterValues.age !== undefined && (
                        <div>
                          <input
                            type="text"
                            placeholder="Enter Age"
                            onChange={(e) => handleFilterChange("age", e.target.value, { checked: true })}
                            className="border rounded-lg px-2 py-1"
                          />
                        </div>
                      )}
                      {filterValues.age === undefined && (
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="Min"
                            onChange={(e) => handleFilterChange("age", e.target.value, { checked: true })}
                            className="border rounded-l-lg px-2 py-1 mr-0.5 w-16"
                          />
                          <span className="text-gray-600">-</span>
                          <input
                            type="text"
                            placeholder="Max"
                            onChange={(e) => handleFilterChange("age", e.target.value, { checked: true })}
                            className="border rounded-r-lg px-2 py-1 ml-0.5 w-16"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    filterOptions[column].map((option) => (
                      <div key={option} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={filterValues[column]?.includes(option) || false}
                          onChange={(e) => handleFilterChange(column, option, { checked: e.target.checked })}
                          className="mr-2"
                        />
                        <label>{option}</label>
                      </div>
                    ))
                  )}
                </details>
              ))}
              <div className="flex justify-between">
                <button
                  onClick={handleFilterReset}
                  className="px-3 py-1 border border-green-700 rounded-lg bg-green-700 text-white font-semibold focus:outline-none"
                >
                  Reset
                </button>
                <button
                  onClick={handleSidebarClose}
                  className="px-3 py-1 border border-green-700 rounded-lg bg-green-700 text-white font-semibold focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 px-8 py-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-green-700 dark:text-green-200">People of iTribe</h1>
            <button
              onClick={handleSidebarToggle}
              className={`px-3 py-1 border border-green-700 rounded-lg self-start ml-auto ${darkMode ? "bg-green-500 text-gray-900" : "bg-green-700 text-white"} font-semibold focus:outline-none`}
            >
              <FaFilter className="inline-block mr-2" />
              Filter Options
            </button>
          </div>
          <div className="mx-auto max-w-4xl mt-4 bg-gray-700 dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden p-5">
            <div onScroll={handleScroll} className="overflow-y-auto h-96">
              <table className={`w-full table-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className={`${darkMode ? "bg-gray-800 text-green-200" : "bg-green-700 text-white"} sticky top-0`}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="py-3 px-5 text-left border-r border-b border-green-700">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className={darkMode ? "text-green-300" : "text-green-700"}>
                  {table.getRowModel().rows.slice(0, end).map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-200")}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="py-3 px-6 text-left whitespace-nowrap border-r border-b border-green-700"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`text-2xl text-green-300 ${darkMode ? "dark:text-green-200" : ""}`}>
              Displaying {filteredUsers} of {totalUsers} users.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default UsersTable;
