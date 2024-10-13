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
    if (filteredRegions.includes(value)) {
      // If region is in the list, simply route to the prediction page
      router.push(`/predict?city=${value}`);
    } else {
      // If region is not in the list, send API request to localhost:5000/extract
      try {
        const response = await fetch("http://localhost:5000/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_input: value }),
        });
        const data = await response.json();
        const city = data.result.region;
        const year = data.result.year || 0;

        // Redirect to prediction page with the extracted city
        router.push(`/predict?city=${city}&year=${year}`);
      } catch (error) {
        console.error("Error fetching from API:", error);
      }
    }
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
      >
        Search
      </Button>
      <style jsx>{`
        input:focus {
          box-shadow: 0 0 10px #4d547a, 0 0 20px #4d547a, 0 0 30px #4d547a;
        }
      `}</style>
    </div>
  );
}
