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

const LineChart = () => {
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

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"], // You can update these labels as needed
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, NaN, 48, 56, 57, 40], // Sample data points
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

  const options = {
    ...genericOptions,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Line data={data} options={options} />{" "}
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
