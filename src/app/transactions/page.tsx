"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import EditForm from "@/components/EditForm";
import MonthlyBarChart from "@/components/MonthlyBarChart";

export type Ttransaction = {
  _id: number;
  amount: number;
  date: string;
  description: string;
  category: string;
};

const categoryIcons: Record<string, string> = {
  food: "🍕",
  rent: "🏠",
  entertainment: "🎬",
  transport: "🚌",
  housing: "🏡",
  others: "📦",
};

const fetchTransactions = async (
  selectedMonth: number
): Promise<Ttransaction[]> => {
  try {
    const res = await fetch(`/api/transactions/${selectedMonth}`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const data = await res.json();
    return data.transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

const months = [
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

export default function Transactions() {
  const [transactions, setTransactions] = useState<Ttransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [editDetails, setEditDetails] = useState<Ttransaction | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [visible, setVisible] = useState(false);

  const getTransactions = useCallback(async (selectedMonth: number) => {
    setLoading(true);
    const data = await fetchTransactions(selectedMonth);
    setTransactions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getTransactions(selectedMonth);
  }, [getTransactions, refreshCounter, selectedMonth]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Transaction deleted successfully");
        setRefreshCounter((prev) => prev + 1);
      } else {
        toast.error(data.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Something went wrong while deleting the transaction");
    }
  };

  const handleEdit = (transaction: Ttransaction) => {
    setEditDetails(transaction);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditDetails(null);
  };

  return (
    <>
      <div className="flex justify-end my-4 z-10">
        <select
          className="border border-gray-300 rounded-md p-2"
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          <option value="0">All</option>
          {months.map((month) => (
            <option key={month.name} value={month.value}>
              {month.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center gap-2 my-4 z-10">
        <button
          className="shadow-md  py-2 px-4 rounded cursor-pointer"
          onClick={() => setVisible(false)}
        >
          Transactions
        </button>
        <button
          className="shadow-md  py-2 px-4 rounded cursor-pointer"
          onClick={() => setVisible(true)}
        >
          Bar Chart
        </button>
      </div>
      {visible ? (
        <MonthlyBarChart transactions={transactions} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-gray-500 py-8">
              Loading transactions...
            </p>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">
                    {categoryIcons[transaction.category] || "💰"}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      {transaction.description}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(transaction.date))}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xl font-bold text-green-600">
                    ${transaction.amount}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {transaction.category}
                  </p>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
                  >
                    📝 Edit
                  </button>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-8">
              No transactions found
            </p>
          )}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
          <div className="flex justify-between items-center">
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogClose
              onClick={handleCloseModal}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              <X size={18} />
            </DialogClose>
          </div>
          {editDetails && (
            <EditForm
              editDetails={editDetails}
              setCounter={setRefreshCounter}
              setIsOpen={setIsOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
