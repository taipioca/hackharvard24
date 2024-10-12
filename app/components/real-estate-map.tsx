import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

// Define the props interface for RealEstateMap
interface RealEstateMapProps {
  cityName: string | null;
  cityData: { [key: string]: number } | null;
  year: string;
}

const RealEstateMap: React.FC<RealEstateMapProps> = ({ cityName, cityData, year }) => {
  // Calculate the median price for the given year
  const medianPrice = cityData && year in cityData ? cityData[year] : 0;

  // Calculate market trend as the percentage increase from 2022 to 2023
  let marketTrend = "N/A"; // Default value if data is not available
  if (cityData && cityData["2022"] && cityData["2023"]) {
    const price2022 = cityData["2022"];
    const price2023 = cityData["2023"];
    
    // Calculate percentage increase
    const increase = price2023 - price2022;
    const percentIncrease = (increase / price2022) * 100;

    // Format the market trend as a string with a '+' sign for positive values
    marketTrend = `${percentIncrease >= 0 ? '+' : ''}${percentIncrease.toFixed(1)}%`;
  }

  return (
    <Card className="mt-4 text-2xl">
      <CardHeader>
        <CardTitle>{cityName ? `${cityName} Insights` : "Real Estate Insights"}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2 text-sm">
            <DollarSign className="text-primary" />
            <div>
              <h3 className="font-semibold">Median Real Estate Price for {year}</h3>
              <p className="text-2xl text-turquoise">${medianPrice.toLocaleString()}</p>
            </div>
          </li>
          <li className="flex items-center space-x-2 text-sm">
            <TrendingUp className="text-primary" />
            <div>
              <h3 className="font-semibold">Current Market Trend in 2024</h3>
              <p className="text-2xl text-turquoise">{marketTrend}</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default RealEstateMap;
