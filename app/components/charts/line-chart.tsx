"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Define the props interface for LineChart
interface LineChartProps {
  cityData: { [key: string]: number } | null; // Accept cityData as a prop
  cityName: string | null; // Accept cityName as a prop
}

const LineChart: React.FC<LineChartProps> = ({ cityData, cityName }) => {
  const genericOptions = {
    fill: false,
    interaction: {
      intersect: false,
    },
    radius: 0,
  };

  const skipped = (ctx: any, value: any) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined;
  const down = (ctx: any, value: any) =>
    ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

  // Prepare labels and data based on cityData
  const labels = Object.keys(cityData || {}); // Extract years from cityData
  const dataValues = Object.values(cityData || {}); // Extract values from cityData

  const data = {
    labels: labels.length > 0 ? labels : ["No Data"], // Fallback if no data
    datasets: [
      {
        label: cityName ? `${cityName} Price Trend` : "Price Trend", // Dynamic label based on cityName
        data: dataValues.length > 0 ? dataValues : [0], // Fallback if no data
        borderColor: "rgb(75, 192, 192)",
        segment: {
          borderColor: (ctx: any) =>
            skipped(ctx, "rgb(0,0,0,0.2)") || down(ctx, "rgb(192,75,75)"),
          borderDash: (ctx: any) => skipped(ctx, [6, 6]),
        },
        spanGaps: true, // This allows the chart to ignore NaN values
      },
    ],
  };

  // Updated options to show only every 5 years on the x-axis
  const options = {
    ...genericOptions,
    scales: {
      x: {
        ticks: {
          callback: function (value: any, index: number, values: any) {
            // Show only every 5th label
            const year = this.getLabelForValue(value);
            return index % 2 === 1 ? year : "";
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader className="text-xl">
        <CardTitle>{cityName} Price Trend from 2008 to 2035</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
