import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactions";
import connectMongo from "@/lib/connectDB";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const data = await req.json();
    const transaction = await Transaction.create(data);
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectMongo();

    const url = new URL(request.url);
    const params = url.searchParams?.get("id");
    if (parseInt(params as string) === 0) {
      const transactions = await Transaction.find({}).sort({ date: -1 });
      return NextResponse.json({
        transactions: transactions.length > 0 ? transactions : [],
      });
    }

    const month = parseInt(params as string);
    const year = new Date().getFullYear(); // Always use the current year

    if (isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Invalid month parameter" },
        { status: 400 }
      );
    }

    // Define start and end dates for the given month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Fetch transactions within the given month
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    return NextResponse.json({
      transactions: transactions.length > 0 ? transactions : [],
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongo();
    const data = await req.json();
    const url = new URL(req.url);
    const params = url.searchParams?.get("id") as string;
    const transaction = await Transaction.findByIdAndUpdate(params, data, {
      new: true,
    });
    return NextResponse.json({ transaction });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest) {
  try {
    await connectMongo();
    const url = new URL(_req.url);
    const params = url.searchParams?.get("id") as string;
    await Transaction.findByIdAndDelete(params);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
