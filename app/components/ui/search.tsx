"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isExpanded: boolean;
}

export default function SearchBar({ isExpanded }: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [allRegions, setAllRegions] = useState<string[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
  const { theme } = useTheme(); // Custom hook to detect dark/light mode

  const router = useRouter();

  // Fetch region entries from text file
  useEffect(() => {
    const loadRegionEntries = async () => {
      try {
        const response = await fetch("/region_entries.txt");
        const text = await response.text();
        const regions = text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
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
      const filtered = allRegions.filter((region) =>
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
    router.push(`/predict?city=${value}`); // Redirect to search page with query parameter
  };

  return (
    <div
      className={`relative w-full max-w-xl mt-1 transition-transform ${
        isExpanded ? "transform -translate-y-8" : ""
      }`}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setFilteredRegions(allRegions)} // Show all regions on focus
        className={`w-full p-4 h-[42px] text-sm rounded-full rounded-r-none text-black focus:outline-none transition-all duration-300 border font-light`}
        placeholder="Search for investment opportunities"
      />
      {inputValue && filteredRegions.length > 0 && (
        <ul
          className={`absolute z-10 text-left text-sm bg-white border border-gray-300 rounded-lg mt-1 w-full ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {filteredRegions.map((region) => (
            <li
              key={region}
              className={`p-2 font-medium cursor-pointer hover:bg-gray-200 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
              onClick={() => handleSearch(region)}
            >
              {region}
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        input:focus {
          box-shadow: 0 0 10px #4d547a, 0 0 20px #4d547a, 0 0 30px #4d547a;
        }
      `}</style>
    </div>
  );
}
