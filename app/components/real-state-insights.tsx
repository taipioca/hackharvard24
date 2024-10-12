import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Define the props interface for RealStateInsights
interface RealStateInsightsProps {
  cityName: string | null; // Accept cityName as a prop
}

const RealStateInsights: React.FC<RealStateInsightsProps> = ({ cityName }) => {
  // State to hold the selected year
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // State to hold the summary from the backend
  const [summary, setSummary] = useState<string>("");

  // State to manage loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handler for year change
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  // Fetch summary from the backend whenever cityName or selectedYear changes
  useEffect(() => {
    // Only fetch if cityName is provided
    if (cityName) {
      const fetchSummary = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await fetch("http://127.0.0.1:5000/ai_summary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              region: cityName,
              year: selectedYear,
            }),
          });

          if (!response.ok) {
            // Handle non-2xx HTTP responses
            const errorText = await response.text();
            throw new Error(errorText || "Error fetching summary");
          }

          const data = await response.json();

          // Assuming the backend returns { summary: "..." }
          setSummary(data.summary || "No summary available.");
        } catch (err: any) {
          setError(err.message || "An error occurred.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSummary();
    }
  }, [cityName, selectedYear]);

  // Generate years for dropdown (2025 to 2050, every 5 years)
  const years = Array.from({ length: 6 }, (_, index) => 2025 + index * 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {cityName ? `Our Suggestion for ${cityName}` : "Our Suggestion"}
        </CardTitle>
      </CardHeader>
      <CardContent>

        {/* Display loading indicator */}
        {isLoading && <div>Loading summary...</div>}

        {/* Display error message */}
        {error && <div className="text-red-500">Error: {error}</div>}

        {/* Display summary */}
        {!isLoading && !error && summary && (
          <div>
            <div className="font-bold mt-4">Summary:</div>
            <div>{summary}</div>
          </div>
        )}

        {/* Display a message if no summary is available */}
        {!isLoading && !error && !summary && (
          <div>No summary available for the selected region and year.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealStateInsights;
