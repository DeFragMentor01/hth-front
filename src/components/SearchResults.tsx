import React from "react";
import SearchResultsItem from "./SearchResultsItem";

interface SearchResult {
  name: string;
  age: number;
  gender: string;
  tribe: string;
  community: string;
  city: string;
  country: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="bg-white p-4">
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      <div className="flex items-center py-2 px-4 bg-gray-100 border-b border-gray-200">
        <div className="w-1/7 border-r pr-4 font-bold">Name</div>
        <div className="w-1/7 border-r pr-4 font-bold">Age</div>
        <div className="w-1/7 border-r pr-4 font-bold">Gender</div>
        <div className="w-1/7 border-r pr-4 font-bold">Tribe</div>
        <div className="w-1/7 border-r pr-4 font-bold">Community</div>
        <div className="w-1/7 border-r pr-4 font-bold">City</div>
        <div className="w-1/7 font-bold">Country</div>
      </div>
      {results.map((result, index) => (
        <SearchResultsItem
          key={index}
          name={result.name}
          tribe={result.tribe}
          community={result.community}
          city={result.city}
          country={result.country}
          age={result.age}
          gender={result.gender}
        />
      ))}
    </div>
  );
};

export default SearchResults;
