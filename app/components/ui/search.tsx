"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isExpanded: boolean;
}

export function SearchBar({ isExpanded }: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [allRegions, setAllRegions] = useState<string[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // New state for loading
  const router = useRouter();

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

  const handleSearch = async (value: string) => {
    setLoading(true); // Start loading when search starts
    if (filteredRegions.includes(value)) {
      router.push(`/predict?city=${value}`);
    } else {
      try {
        const response = await fetch("https://z0s5qwb2ce.execute-api.us-east-1.amazonaws.com/prod/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_input: value }),
        });
        const data = await response.json();
        const city = data.result.region;
        const year = data.result.year || 0;

        router.push(`/predict?city=${city}&year=${year}`);
      } catch (error) {
        console.error("Error fetching from API:", error);
      }
    }
    setLoading(false); // Stop loading when search finishes
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(inputValue ?? "");
    }
  };

  return (
    <div
      className={`relative w-full max-w-xl mt-1 flex  items-center justify-center gap-2 transition-transform ${
        isExpanded ? "transform -translate-y-8" : ""
      }`}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setFilteredRegions(allRegions)}
        className={`w-full p-4 h-[42px] rounded-full rounded-r-none text-white focus:outline-none transition-all duration-300 border border-white bg-transparent font-medium text-xs`}
        placeholder="Search for investment opportunities"
        onKeyDown={handleKeyDown}
      />
      <Button
        onClick={() => handleSearch(inputValue ?? "")}
        className="rounded-full rounded-l-none bg-white text-black hover:text-white hover:bg-transparent"
        disabled={loading} // Disable the button when loading
      >
        {loading ? "Loading..." : "Search"}
      </Button>
      {loading && (
        <div className="absolute right-[-40px]">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
      <style jsx>{`
        input:focus {
          box-shadow: 0 0 10px #4d547a, 0 0 20px #4d547a, 0 0 30px #4d547a;
        }
      `}</style>
    </div>
  );
}
