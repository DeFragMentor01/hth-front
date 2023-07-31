import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NavBar from "../components/NavBar";
import { useRecoilState } from "recoil";
import { darkModeAtom, filterState } from "../atoms";
import { FaFilter } from "react-icons/fa";
import FilterModal from '../components/FilterModal';

type Person = {
  username: string;
  dateofbirth: string;
  gender: string;
  tribe: string;
  community: string;
  city: string;
  state: string;
  country: string;
  age: number;
  [key: string]: string | number;
};

const UsersTable: React.FC = () => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeAtom);
  const [filter] = useRecoilState(filterState);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filterTotalUsers, setFilterTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
    setUsers([]);
  }, [filter]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const params = {
          page: page,
          size: 100,
          ...Object.entries(filter).reduce((result: any, [key, value]) => {
            if (value) result[key] = value;
            return result;
          }, {}),
        };
        
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, { params });
        
        if (response.status === 200) {
          setUsers(prevUsers => [...prevUsers, ...response.data.users]);
          setTotalUsers(parseInt(response.data.total));
          setFilterTotalUsers(parseInt(response.data.filterTotal));
        } else {
          throw new Error('Failed to fetch data.');
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUsers();
  }, [filter, page]);
  

  const table = useReactTable({
    data: users,
    columns: useMemo(() => {
      const columnHelper = createColumnHelper<Person>();

      return [
        columnHelper.accessor("firstname", {
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          header: () => <span>First Name</span>,
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("lastname", {
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          header: () => <span>Last Name</span>,
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("username", {
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          header: () => <span>Username</span>,
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("age", {
          header: () => <span>Age</span>,
          // cell: (info) => calculateAge(info.getValue()),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("gender", {
          header: () => "Gender",
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("village", {
          header: () => "Village",
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("community", {
          header: () => "District",
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("city", {
          header: () => "City",
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("state", {
          header: () => "Province",
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor("country", {
          header: () => "Country",
          cell: (info) => capitalizeFirstLetter(info.getValue()),
          footer: (info) => info.column.id,
        }),
      ];
    }, []),
    getCoreRowModel: useMemo(() => getCoreRowModel(), []),
  });

  const capitalizeFirstLetter = (string: string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
  };

  const calculateAge = (birthDate: Date): number => {
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



  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };  

  return (
    <>
      <NavBar />
      <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-800 text-green-200" : "bg-gray-100 text-green-700"}`}>
        <div className="flex-1 px-8 py-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-green-700 dark:text-green-200">People of iTribe</h1>
            <FilterModal />
          </div>
          <div className="mx-auto w-full mt-4 bg-gray-700 dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden p-5">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
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
            )}
            <p className={`text-2xl text-green-300 ${darkMode ? "dark:text-green-200" : ""}`}>
            {filterTotalUsers} users selected of {totalUsers} users.
            </p>
          </div>
        </div>
      </div>
    </>
  );  
};

export default UsersTable;