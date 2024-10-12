"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes"; // Assuming you're using a theme hook for dark/light mode

interface SearchBarProps {
  onSearch: (query: string) => void;
  isExpanded: boolean;
}

export default function SearchBar({ onSearch, isExpanded }: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [allRegions, setAllRegions] = useState<string[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
  const { theme } = useTheme(); // Custom hook to detect dark/light mode

  // Fetch region entries from text file
  useEffect(() => {
    const loadRegionEntries = async () => {
      try {
        const response = await fetch('/region_entries.txt');
        const text = await response.text();
        const regions = text.split('\n').map(line => line.trim()).filter(Boolean);
        setAllRegions(regions);
      } catch (error) {
        console.error("Error loading region entries:", error);
      }
    };

    loadRegionEntries();
  }, []);

  // Filter regions based on input value
  useEffect(() => {
    if (inputValue) {
      const filtered = allRegions.filter(region =>
        region.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions([]);
    }
  }, [inputValue, allRegions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    onSearch(value); // Call the search callback with the selected value
  };

  return (
    <div
      className={`relative w-full max-w-xl mt-4 transition-transform ${
        isExpanded ? "transform -translate-y-8" : ""
      }`}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setFilteredRegions(allRegions)} // Show all regions on focus
        className={`w-full p-4 rounded-full text-black focus:outline-none transition-all duration-300 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        placeholder="Search for investment opportunities"
      />
      {inputValue && filteredRegions.length > 0 && (
        <ul className={`absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          {filteredRegions.map((region) => (
            <li
              key={region}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${theme === "dark" ? "text-white" : "text-black"}`}
              onClick={() => handleSearch(region)}
            >
              {region}
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        input:focus {
          box-shadow: 0 0 10px #4299e1, 0 0 20px #4299e1, 0 0 30px #4299e1;
        }
      `}</style>
    </div>
  );
}
