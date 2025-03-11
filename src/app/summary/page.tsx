"use client";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSummary, months } from "@/constants/data";
import { categoryIcons } from "@/constants/data";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ExpenseData {
  totalExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: Transaction[];
  monthlyExpenses: MonthlyExpense[];
}

interface CategoryBreakdown {
  _id: string;
  total: number;
}

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MonthlyExpense {
  _id: {
    month: number;
    year: number;
  };
  total: number;
}

// @ts-ignore


export default function ExpenseDashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExpenseData>({
    totalExpenses: -1,
    categoryBreakdown: [],
    recentTransactions: [],
    monthlyExpenses: [],
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const getTransactions = useCallback(async (selectedMonth: number) => {
    setLoading(true);
    const data = await fetchSummary(selectedMonth);
    setData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getTransactions(selectedMonth);
  }, [getTransactions, selectedMonth]);

  console.log(data);

  return (
    <>
      <div className="flex justify-end my-4 z-10">
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => setSelectedMonth(Number(value))}
        >
          <SelectTrigger>
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
      <div className="p-4 flex flex-col gap-4">
        {/* Total Expenses Card */}

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p className="text-xl font-semibold">₹{data?.totalExpenses}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {data.categoryBreakdown.map((category) => (
                  <Card key={category._id}>
                    <CardHeader>
                      <CardTitle>
                        {categoryIcons[category._id.toLowerCase()] || "💰"}{" "}
                        {category._id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>₹{category.total}</CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="space-y-4 bg-white p-2 rounded-lg">
                {data?.recentTransactions?.length ? (
                  data.recentTransactions.map((transaction: Transaction) => {
                    const categoryEmoji =
                      categoryIcons[transaction.category.toLowerCase()] ||
                      categoryIcons.others;

                    return (
                      <div
                        key={transaction._id}
                        className="flex flex-col sm:flex-row justify-between p-3 border rounded-lg bg-gray-50 w-full"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                          <p className="font-medium text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                            <span className="text-lg">{categoryEmoji}</span>
                            {transaction.description}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p
                          className={`text-sm font-semibold 
                              text-green-600`}
                        >
                          ₹{transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center">
                    No recent transactions available.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
