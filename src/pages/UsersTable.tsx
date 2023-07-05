import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NavBar from "../components/NavBar";
import { useRecoilState } from "recoil";
import { darkModeAtom } from "../atoms";
import { uniq } from "lodash";
import { FaFilter } from "react-icons/fa";

type Person = {
  username: string;
  dateofbirth: string;
  gender: string;
  village: string;  // Changed from tribe to village
  community: string;
  city: string;
  state: string;
  country: string;
  age: number;
  [key: string]: string | number;
};

const UsersTable: React.FC = () => {
  const [data, setData] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convertedData, setConvertedData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState<{ [key: string]: boolean }>({});
  const [filterValues, setFilterValues] = useState<{ [key: string]: string[] }>({});
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string[] }>({});
  const [darkMode, setDarkMode] = useRecoilState(darkModeAtom);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageSize, setPageSize] = useState(100); // Dynamic page size

  const [end, setEnd] = useState(pageSize);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

  useEffect(() => {
    const fetchUrl = new URL(`${process.env.REACT_APP_BASE_URL}/users`);
    fetchUrl.searchParams.append('page', String(page));
    fetchUrl.searchParams.append('pageSize', String(pageSize));
    Object.entries(filterValues).forEach(([key, value]) => {
      fetchUrl.searchParams.append(`filters[${key}]`, JSON.stringify(value));
    });

    axios
      .get(fetchUrl.toString())
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

        if (data.users.length === pageSize) {
          setPageSize((prevPageSize) => prevPageSize + 100);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [page, pageSize, filterValues]);

  useEffect(() => {
    const fetchUrl = new URL(`${process.env.REACT_APP_BASE_URL}/users/filters`);
    Object.entries(filterValues).forEach(([key, value]) => {
      fetchUrl.searchParams.append(`filters[${key}]`, JSON.stringify(value));
    });

    axios
      .get(fetchUrl.toString())
      .then((response) => {
        const { data } = response;
        setFilterOptions(data);
      })
      .catch((error) => {
        console.error("Error fetching filter options:", error);
      });
  }, [filterValues]);

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
        columnHelper.accessor("village", { // Changed from tribe to village
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

  const filterData = () => {
    let filtered = convertedData.filter((data) => {
      if (
        filterValues.age &&
        filterValues.age.length > 0 &&
        !filterValues.age.includes(String(data.age))
      ) {
        return false;
      }
      if (
        filterValues.village &&
        filterValues.village.length > 0 &&
        !filterValues.village.includes(data.village)
      ) {
        return false;
      }
      if (
        filterValues.city &&
        filterValues.city.length > 0 &&
        !filterValues.city.includes(data.city)
      ) {
        return false;
      }
      if (
        filterValues.community &&
        filterValues.community.length > 0 &&
        !filterValues.community.includes(data.community)
      ) {
        return false;
      }
      if (
        filterValues.state &&
        filterValues.state.length > 0 &&
        !filterValues.state.includes(data.state)
      ) {
        return false;
      }
      if (
        filterValues.country &&
        filterValues.country.length > 0 &&
        !filterValues.country.includes(data.country)
      ) {
        return false;
      }
      return true;
    });

    setFilteredData(filtered);
    setFilteredUsers(filtered.length);
  };

  const handleFilterChange = useCallback(
    (column: string, value: string, { checked }: { checked: boolean }) => {
      setFilterValues((prevFilterValues) => {
        const newFilterValues = { ...prevFilterValues };
        newFilterValues[column] = checked
          ? [...(newFilterValues[column] || []), value]
          : (newFilterValues[column] || []).filter(
              (item: string) => item !== value
            );
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
    setFilteredData(convertedData); // Reset the filtered data to all users
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    filterData();
  }, [filterValues]);

  useEffect(() => {
    setFilteredUsers(filteredData.length);
  }, [filteredData]);

  // The function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // The function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

 return (
    <>
      <NavBar />
      <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-800 text-green-200" : "bg-gray-100 text-green-700"}`}>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold text-green-700 dark:text-green-200">People of iTribe</h1>
          <button
            onClick={isModalOpen ? closeModal : openModal}
            className={`px-3 py-1 border border-green-700 rounded-lg self-start ml-auto ${darkMode ? "bg-green-500 text-gray-900" : "bg-green-700 text-white"} font-semibold focus:outline-none`}
          >
            <FaFilter className="inline-block mr-2" />
            Filter Options
          </button>
        </div>
        <div className="mx-auto w-full mt-4 bg-gray-700 dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden p-5">
          <div onScroll={handleScroll} className="overflow-auto h-96">
            <table className={`table-fixed ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className={`${darkMode ? "bg-gray-800 text-green-200" : "bg-green-700 text-white"} sticky top-0`}
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="w-1/6 py-3 px-5 text-left border-r border-b border-green-700 break-words"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className={darkMode ? "text-green-300" : "text-green-700"}>
                {table.getRowModel().rows.map((row, index) => (
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
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="w-1/6 py-3 px-6 text-left whitespace-normal border-r border-b border-green-700 break-words"
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
    </>
  );
};

export default UsersTable;
