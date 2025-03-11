import { Ttransaction } from "@/app/transactions/page";

export const months = [
  {
    name: "January",
    value: 1,
  },
  {
    name: "February",
    value: 2,
  },
  {
    name: "March",
    value: 3,
  },
  {
    name: "April",
    value: 4,
  },
  {
    name: "May",
    value: 5,
  },
  {
    name: "June",
    value: 6,
  },
  {
    name: "July",
    value: 7,
  },
  {
    name: "August",
    value: 8,
  },
  {
    name: "September",
    value: 9,
  },
  {
    name: "October",
    value: 10,
  },
  {
    name: "November",
    value: 11,
  },
  {
    name: "December",
    value: 12,
  },
];

export const fetchTransactions = async (
  selectedMonth: number
): Promise<Ttransaction[]> => {
  try {
    const res = await fetch(`/api/transactions?id=${selectedMonth}`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const data = await res.json();
    return data.transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const categoryIcons: Record<string, string> = {
  food: "🍕",
  rent: "🏠",
  entertainment: "🎬",
  transport: "🚌",
  housing: "🏡",
  others: "📦",
};



export interface ExpenseData {
  totalExpenses: number;
  categoryBreakdown: any[];
  recentTransactions: any[];
  monthlyExpenses: any[];
}

export const fetchSummary = async (
  selectedMonth: number
): Promise<ExpenseData> => {
  try {
    const res = await fetch(`/api/summary?month=${selectedMonth}`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      totalExpenses: -1,
      categoryBreakdown: [],
      recentTransactions: [],
      monthlyExpenses: [],
    };
  }
};
