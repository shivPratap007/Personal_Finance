import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/connectDB";
import Budget from "@/models/budget";

export async function GET(req: Request) {
  try {
    await connectMongo();
    const url = new URL(req.url);
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");

    let budgets: any = [];

    if (month && year) {
      budgets = await Budget.find({
        month: parseInt(month),
        year: parseInt(year),
      });
    }

    return NextResponse.json({ budgets });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const data = await req.json();

    // Check if the request contains an array of budgets to set multiple at once
    if (Array.isArray(data.budgets)) {
      // Process multiple budget entries
      //@ts-ignore
      const operations = data.budgets.map((budgetItem: any) => ({
        updateOne: {
          filter: {
            category: budgetItem.category,
            month: budgetItem.month,
            year: budgetItem.year,
          },
          update: budgetItem,
          upsert: true,
        },
      }));

      const result = await Budget.bulkWrite(operations);
      return NextResponse.json({ result }, { status: 201 });
    } else {
      // Process single budget entry
      const budget = await Budget.findOneAndUpdate(
        {
          category: data.category,
          month: data.month,
          year: data.year,
        },
        data,
        { new: true, upsert: true }
      );

      return NextResponse.json({ budget }, { status: 201 });
    }
  } catch (error) {
    console.error("Budget error:", error);
    return NextResponse.json(
      { error: "Failed to create/update budget" },
      { status: 500 }
    );
  }
}
