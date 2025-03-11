"use client";

import { Ttransaction } from "@/app/transactions/page";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const categoryIcons: Record<string, string> = {
  food: "🍕",
  rent: "🏠",
  entertainment: "🎬",
  transport: "🚌",
  housing: "🏡",
  others: "💰",
};

// Define all categories (ensures missing categories show up with zero values)
const allCategories = [
  "food",
  "rent",
  "entertainment",
  "transport",
  "housing",
  "others",
];

// Assign different colors to each category
const categoryColors: Record<string, string> = {
  food: "#FF6384",
  rent: "#36A2EB",
  entertainment: "#FFCE56",
  transport: "#4CAF50",
  housing: "#9966FF",
  others: "#FF9F40",
};

export default function ExpenseBarChart({
  transactions,
}: {
  transactions: Ttransaction[];
}) {
  const [chartData, setChartData] = useState<
    { name: string; value: number; category: string }[]
  >([]);

  useEffect(() => {
    console.log("Processing transactions for bar chart:", transactions);

    // Initialize all categories with zero amounts
    const categoryTotals: Record<string, number> = {};
    allCategories.forEach((category) => {
      categoryTotals[category] = 0;
    });

    // Aggregate expenses by category
    if (transactions && transactions.length > 0) {
      transactions.forEach((t) => {
        const category = allCategories.includes(t.category.toLowerCase())
          ? t.category.toLowerCase()
          : "others";
        categoryTotals[category] += t.amount;
      });
    }

    // Format data for the chart
    const formattedData = allCategories.map((category) => ({
      name: `${categoryIcons[category]} ${category}`,
      value: parseFloat(categoryTotals[category].toFixed(2)), // Limit to 2 decimal places
      category: category, // Store category name for color mapping
    }));

    setChartData(formattedData);

    console.log("Formatted bar chart data:", formattedData);
  }, [transactions]);

  return (
    <div>
      {!transactions || transactions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No transactions found for this period
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Amount">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={categoryColors[entry.category]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
