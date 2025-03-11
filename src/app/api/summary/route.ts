import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connectDB";
import Transaction from "@/models/transactions";

export async function GET(request: NextRequest) {
  try {
    await connectMongo();

    // Extract month from URL query params using NextRequest
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get("month") || "0";
    const month = parseInt(monthParam);


    let query = {};

    // Apply date filter if month is specified and not 0
    if (month !== 0 && !isNaN(month) && month >= 1 && month <= 12) {
      const year = new Date().getFullYear();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      query = {
        date: { $gte: startDate, $lte: endDate },
      };

    }

    // Get total expenses based on query
    const totalExpenses = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get category breakdown based on query
    const categoryBreakdown = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    // Get most recent transactions based on query
    const recentTransactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(5);

    // Get monthly expenses (if showing all data)
    let monthlyExpenses = [];
    if (month === 0) {
      monthlyExpenses = await Transaction.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              year: { $year: "$date" },
            },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    } else {
      // For specific month, just return that month's data
      const year = new Date().getFullYear();
      monthlyExpenses = [
        {
          _id: { month: month, year: year },
          total: totalExpenses[0]?.total || 0,
        },
      ];
    }

    return NextResponse.json({
      totalExpenses: totalExpenses[0]?.total || 0,
      categoryBreakdown: categoryBreakdown.length > 0 ? categoryBreakdown : [],
      recentTransactions:
        recentTransactions.length > 0 ? recentTransactions : [],
      monthlyExpenses: monthlyExpenses.length > 0 ? monthlyExpenses : [],
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
