"use client";

import { Ttransaction } from "@/app/transactions/page";
import { fetchTransactions, months } from "@/constants/data";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Category icons
const categoryIcons: Record<string, string> = {
  food: "🍕",
  rent: "🏠",
  entertainment: "🎬",
  transport: "🚌",
  housing: "🏡",
  others: "💰",
};

// Define all categories
const allCategories = [
  "food",
  "rent",
  "entertainment",
  "transport",
  "housing",
  "others",
];

// Colors for pie chart slices
const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4CAF50",
  "#9966FF",
  "#FF9F40",
];

export default function CategoryChart() {
  const [chartData, setChartData] = useState<
    { category: string; amount: number }[]
  >([]);

  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Ttransaction[]>([]);

  const getTransactions = useCallback(async (selectedMonth: number) => {
    setLoading(true);
    const data = await fetchTransactions(selectedMonth);
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getTransactions(selectedMonth);
  }, [selectedMonth, getTransactions]);

  useEffect(() => {
    console.log("Processing transactions:", transactions);

    // Initialize all categories with zero amounts
    const categoryTotals: Record<string, number> = {};
    allCategories.forEach((category) => {
      categoryTotals[category] = 0;
    });

    // Aggregate transactions into categories
    if (transactions && transactions.length > 0) {
      transactions.forEach((t) => {
        // Convert transaction category to lowercase for comparison
        const transactionCategory = t.category.toLowerCase();
        // Check if this category is in our allCategories list
        const category = allCategories.includes(transactionCategory)
          ? transactionCategory
          : "others";

        console.log(
          `Transaction: ${t.category} → Mapped to: ${category}, Amount: ${t.amount}`
        );
        categoryTotals[category] += t.amount;
      });
    }

    // Log category totals for debugging
    console.log("Category totals:", categoryTotals);

    // Format data for the pie chart
    const formattedData = allCategories
      .map((category) => ({
        category: `${categoryIcons[category] || "💰"} ${category}`,
        amount: parseFloat(categoryTotals[category].toFixed(2)), // Limit to 2 decimal places
      }))
      .filter((data) => data.amount > 0); // Remove categories with zero spending

    console.log("Formatted chart data:", formattedData);
    setChartData(formattedData);
  }, [transactions]);

  return (
    <>
      <div className="flex justify-end my-4 z-10">
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => setSelectedMonth(Number(value))}
        >
          <SelectTrigger >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All</SelectItem>
            {months.map((month) => (
              <SelectItem key={month.name} value={month.value.toString()}>
                {month.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full flex justify-center">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : chartData.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No transactions found for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}
