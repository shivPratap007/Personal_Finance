"use client";

import { Ttransaction } from "@/app/transactions/page";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
const allCategories = ["food", "rent", "entertainment", "transport", "housing", "others"];

export default function ExpenseBarChart({ transactions }: { transactions: Ttransaction[] }) {
  const [chartData, setChartData] = useState<{ category: string; amount: number }[]>([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData(
        allCategories.map((category) => ({
          category: `${categoryIcons[category] || "💰"} ${category}`,
          amount: 0,
        }))
      );
      return;
    }

    // Initialize all categories with zero amounts
    const categoryTotals: Record<string, number> = {};
    allCategories.forEach((category) => {
      categoryTotals[category] = 0;
    });

    // Aggregate expenses by category
    transactions.forEach((t) => {
      const category = allCategories.includes(t.category.toLowerCase()) ? t.category.toLowerCase() : "others";
      categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
    });

    // Format data for the chart
    const formattedData = allCategories.map((category) => ({
      category: `${categoryIcons[category] || "💰"} ${category}`,
      amount: parseFloat(categoryTotals[category].toFixed(2)), // Limit to 2 decimal places
    }));

    setChartData(formattedData);
  }, [transactions]);

  return (
    <div>
      {!transactions || transactions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No transactions found for this period</div>
      ) : (
        <div className="w-full flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="category" tick={{ fontSize: 14 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4F46E5" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
