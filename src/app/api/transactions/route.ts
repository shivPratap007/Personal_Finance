import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactions";
import connectMongo from "@/lib/connectDB";

export async function GET() {
  try {
    await connectMongo();
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const data = await req.json();
    const transaction = await Transaction.create(data);
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}