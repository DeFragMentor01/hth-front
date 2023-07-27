import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-3xl mx-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search..."
        className="flex-grow h-16 px-4 py-2 border border-gray-300 rounded-l-md text-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />
      <button
        type="submit"
        className="bg-green-500 text-white h-16 px-6 py-2 rounded-r-md ml-2 text-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
