"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Food",
  "Rent",
  "Entertainment",
  "Transport",
  "Housing",
  "Others",
];

export default function SetLimits() {
  const [limits, setLimits] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Fetch existing limits when month/year changes
  useEffect(() => {
    const fetchLimits = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(`/api/budgets/${month}/${year}`);
        const data = await response.json();

        // Filter budgets for the selected month and year
        const currentBudgets = data.budgets.filter(
          (budget: any) => budget.month === month && budget.year === year
        );

        // Convert to the format needed for the component
        const limitValues: { [key: string]: number } = {};
        currentBudgets.forEach((budget: any) => {
          limitValues[budget.category] = budget.limit;
        });

        setLimits(limitValues);
      } catch (error) {
        toast.error("Failed to fetch existing limits");
      } finally {
        setLoadingData(false);
      }
    };

    fetchLimits();
  }, [month, year]);

  const handleChange = (category: string, value: string) => {
    setLimits((prev) => ({ ...prev, [category]: Number(value) || 0 }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Transform the limits object into an array of budget objects
      const budgetArray = categories.map((category) => ({
        category,
        limit: limits[category] || 0,
        month,
        year,
      }));

      // Make the POST request with the new format
      await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgets: budgetArray }),
      });

      toast.success("Limits updated successfully!");
    } catch (error) {
      toast.error("Failed to update limits");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  return (
    <Card className="w-full max-w-md mx-auto p-4 mt-4 shadow-lg">
      <CardHeader>
        <CardTitle>Set Category Limits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 mb-6">
          <div className="w-1/2">
            <label className="text-sm font-medium mb-1 block">Month</label>
            <Select
              value={month.toString()}
              onValueChange={(value) => setMonth(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium mb-1 block">Year</label>
            <Select
              value={year.toString()}
              onValueChange={(value) => setYear(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026, 2027].map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loadingData ? (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category} className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <div key={category} className="flex justify-between items-center">
                <label className="text-sm font-medium">{category}</label>
                <Input
                  type="number"
                  value={limits[category] || ""}
                  onChange={(e) => handleChange(category, e.target.value)}
                  className="w-24"
                  placeholder="₹0"
                />
              </div>
            ))}
          </>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading || loadingData}
          className="w-full"
        >
          {loading ? <Skeleton className="h-5 w-16" /> : "Save Limits"}
        </Button>
      </CardContent>
    </Card>
  );
}
