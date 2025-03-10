import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactions";
import connectMongo from "@/lib/connectDB";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    const data = await req.json();
    const transaction = await Transaction.findByIdAndUpdate(params.id, data, {
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    await Transaction.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
