"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchSummary, months } from "@/constants/data";

// Type Definitions
interface CategoryBreakdownItem {
  _id: string;
  total: number;
}

interface BudgetItem {
  category: string;
  limit: number;
}

interface DataState {
  categoryBreakdown: CategoryBreakdownItem[];
  budgets: BudgetItem[];
}

interface CombinedDataItem {
  category: string;
  icon: string;
  spent: number;
  limit: number;
  percentage: number;
  actualPercentage: number;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  Food: "🍔",
  Rent: "🏠",
  Entertainment: "🎬",
  Transport: "🚗",
  Housing: "🏡",
  Others: "📦",
};

// Fetch Data Function
async function fetchData(selectedMonth: number): Promise<DataState> {
  const spentData = await fetchSummary(selectedMonth);
  const year = 2025;
  const response = await fetch(
    `/api/budgets?month=${selectedMonth}&year=${year}`
  );
  const d = await response.json();

  return {
    categoryBreakdown: spentData.categoryBreakdown || [],
    budgets: d.budgets || [],
  };
}

const api = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(api);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function extractArrayFromResponse(response: string): string[] {
  try {
    // Find the first and last square brackets to extract the JSON array
    const startIndex = response.indexOf("[");
    const endIndex = response.lastIndexOf("]") + 1;

    if (startIndex === -1 || endIndex === 0) {
      throw new Error("No valid JSON array found in response.");
    }

    const jsonArrayString = response.slice(startIndex, endIndex);
    return JSON.parse(jsonArrayString);
  } catch (error) {
    console.error("Error parsing response:", error);
    return [];
  }
}

async function analyzeFinancialData(
  categoryBreakdown: CategoryBreakdownItem[],
  budgets: BudgetItem[]
) {
  try {
    const prompt = `I have the following budget data: ${JSON.stringify(budgets)}
      and the following spending data: ${JSON.stringify(categoryBreakdown)}
      I want you to analyze the data and give me some insights about the user's spending habits.
      and dont use dollar sign use rupee sign
                      Please provide the data insights in the form of an array of  strings. Just provide me the array nothing more.`;
    const response = await model.generateContent(prompt);
    const responseText = response.response.text();
    

    return extractArrayFromResponse(responseText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return ["Failed to generate insights."];
  }
}

const BudgetSpendingDashboard: React.FC = () => {
  const [data, setData] = useState<DataState>({
    categoryBreakdown: [],
    budgets: [],
  });
  const [combinedData, setCombinedData] = useState<CombinedDataItem[]>([]);
  const [overBudgetCategories, setOverBudgetCategories] = useState<
    CombinedDataItem[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  const getTransactions = useCallback(async (month: number) => {
    setLoading(true);
    const fetchedData = await fetchData(month);
    setData(fetchedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    getTransactions(selectedMonth);
  }, [selectedMonth, getTransactions]);

  useEffect(() => {
    async function fetchInsights() {
      if (data.budgets.length > 0 && data.categoryBreakdown.length > 0) {
        const insightsData = await analyzeFinancialData(
          data.categoryBreakdown,
          data.budgets
        );
        setInsights(insightsData);
      }
    }
    fetchInsights();
  }, [data.budgets.length, data.categoryBreakdown.length]);

  useEffect(() => {
    if (!data.categoryBreakdown.length || !data.budgets.length) return;

    const spendingMap: Record<string, number> = {};
    data.categoryBreakdown.forEach((item) => {
      spendingMap[item._id] = item.total;
    });

    const combined: CombinedDataItem[] = data.budgets.map((budget) => {
      const spent = spendingMap[budget.category] || 0;
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

      return {
        category: budget.category,
        icon: categoryIcons[budget.category] || "📊",
        spent,
        limit: budget.limit,
        percentage: Math.min(percentage, 100),
        actualPercentage: percentage,
      };
    });

    setOverBudgetCategories(combined.filter((item) => item.spent > item.limit));
    setCombinedData(combined);
  }, [data]);

  return (
    <>
      <div className="flex justify-end my-2 pr-4">
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => setSelectedMonth(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.name} value={month.value.toString()}>
                {month.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : data.categoryBreakdown.length > 0 && data.budgets.length > 0 ? (
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              Budget Dashboard
            </CardTitle>
            <CardDescription>
              Track your spending against budget limits
            </CardDescription>
          </CardHeader>

          <CardContent>
            {overBudgetCategories.length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You're over budget in {overBudgetCategories.length}{" "}
                  {overBudgetCategories.length === 1
                    ? "category"
                    : "categories"}
                  :{" "}
                  {overBudgetCategories
                    .map((cat) => ` ${cat.category}`)
                    .join(", ")}
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="progress">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="progress" className="space-y-4">
                {combinedData.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="text-sm">
                        ₹{item.spent.toFixed(2)} / ₹{item.limit.toFixed(2)}
                      </div>
                    </div>
                    <Progress value={item.percentage} />
                    {item.spent > item.limit && (
                      <p className="text-xs text-red-500">
                        Over budget by ₹{(item.spent - item.limit).toFixed(2)} (
                        {Math.round(item.actualPercentage - 100)}% over)
                      </p>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="bar">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={combinedData.map((item) => ({
                        name: item.category,
                        Spent: item.spent,
                        Budget: item.limit,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, ``]} />
                      <Legend />
                      <Bar dataKey="Spent" fill="#FF6384" />
                      <Bar dataKey="Budget" fill="#36A2EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="insights">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">
                    Financial Insights
                  </h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {insights.length > 0 ? (
                      insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))
                    ) : (
                      <li>No insights available</li>
                    )}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium text-lg mb-2">Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      Total Budget
                    </div>
                    <div className="text-2xl font-bold">
                      ₹
                      {data.budgets
                        .reduce((sum, item) => sum + item.limit, 0)
                        .toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      Total Spent
                    </div>
                    <div className="text-2xl font-bold">
                      ₹
                      {data.categoryBreakdown
                        .reduce((sum, item) => sum + item.total, 0)
                        .toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      Remaining
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        data.budgets.reduce(
                          (sum, item) => sum + item.limit,
                          0
                        ) -
                          data.categoryBreakdown.reduce(
                            (sum, item) => sum + item.total,
                            0
                          ) <
                        0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      ₹
                      {(
                        data.budgets.reduce(
                          (sum, item) => sum + item.limit,
                          0
                        ) -
                        data.categoryBreakdown.reduce(
                          (sum, item) => sum + item.total,
                          0
                        )
                      ).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-gray-500">Set the limits first</div>
      )}
    </>
  );
};

export default BudgetSpendingDashboard;
