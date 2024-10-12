import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, Home, TrendingUp } from "lucide-react";

const RealEstateMap = () => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Real Estate Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2">
            <Home className="text-primary" />
            <div>
              <h3 className="font-semibold text-sm">Median List to Sale</h3>
              <p className="text-2xl">1,234</p>
            </div>
          </li>
          <li className="flex items-center space-x-2 text-sm">
            <DollarSign className="text-primary" />
            <div>
              <h3 className="font-semibold">Median Price</h3>
              <p className="text-2xl">$450,000</p>
            </div>
          </li>
          <li className="flex items-center space-x-2 text-sm">
            <TrendingUp className="text-primary" />
            <div>
              <h3 className="font-semibold">Market Trend</h3>
              <p className="text-2xl">+5.2% this month</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default RealEstateMap;
