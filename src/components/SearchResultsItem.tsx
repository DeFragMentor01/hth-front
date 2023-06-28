import React from "react";

interface SearchResultsItemProps {
  name: string;
  age: number;
  gender: string;
  tribe: string;
  community: string;
  city: string;
  country: string;
}

const SearchResultsItem: React.FC<SearchResultsItemProps> = ({
  name,
  age,
  gender,
  tribe,
  community,
  city,
  country,
}) => {
  return (
    <div className="flex items-center py-2 px-4 bg-white border-b border-gray-200">
      <div className="w-1/7 border-r pr-4">{name}</div>
      <div className="w-1/7 border-r pr-4">{age}</div>
      <div className="w-1/7 border-r pr-4">{gender}</div>
      <div className="w-1/7 border-r pr-4">{tribe}</div>
      <div className="w-1/7 border-r pr-4">{community}</div>
      <div className="w-1/7 border-r pr-4">{city}</div>
      <div className="w-1/7">{country}</div>
    </div>
  );
};

export default SearchResultsItem;
