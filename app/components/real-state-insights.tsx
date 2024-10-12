import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Define the props interface for RealStateInsights
interface RealStateInsightsProps {
  cityName: string | null; // Accept cityName as a prop
}

const RealStateInsights: React.FC<RealStateInsightsProps> = ({ cityName }) => {
  // State to hold the selected year
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Handler for year change
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
    // Add your prediction logic here based on selectedYear
  };

  // Generate years for dropdown (2025 to 2050, every 5 years)
  const years = Array.from({ length: 6 }, (_, index) => 2025 + index * 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cityName ? `Our Suggestion for ${cityName}` : "Our Suggestion"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto font-bold">Buy this property</div>
        <div>Why we say that?</div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
          animi accusamus iste excepturi dolor error natus culpa aspernatur iure
          quo. Animi facilis cumque officiis voluptate in sit nostrum
          dignissimos similique?
        </div>

        {/* Dropdown for prediction year selection */}
        <div className="mt-4">
          <label htmlFor="year-select" className="block mb-2 font-semibold">
            Predict
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border border-gray-300 rounded"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealStateInsights;
