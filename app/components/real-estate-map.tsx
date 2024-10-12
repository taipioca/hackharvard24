import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

// Define the props interface for RealEstateMap
interface RealEstateMapProps {
  cityName: string | null;
  cityData: { [key: string]: number } | null; // Assuming cityData is an object with year as key and value as number
}

const RealEstateMap: React.FC<RealEstateMapProps> = ({ cityName, cityData }) => {
  // Calculate the median price from cityData
  const medianPrice = cityData
    ? Object.values(cityData).reduce((sum, value) => sum + value, 0) / Object.values(cityData).length
    : 0;

  // Example calculation for list-to-sale ratio (replace with actual logic)
  const listToSaleRatio = 1.234; // Placeholder value, replace with actual logic if you have data

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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{cityName ? `${cityName} Insights` : "Real Estate Insights"}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2 text-sm">
            <DollarSign className="text-primary" />
            <div>
              <h3 className="font-semibold">Median Price</h3>
              <p className="text-2xl">${medianPrice.toLocaleString()}</p>
            </div>
          </li>
          <li className="flex items-center space-x-2 text-sm">
            <TrendingUp className="text-primary" />
            <div>
              <h3 className="font-semibold">Market Trend</h3>
              <p className="text-2xl">{marketTrend}</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default RealEstateMap;
