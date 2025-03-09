import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectDB";

export async function GET() {
  try {
    await connectMongo();
    return NextResponse.json({ health: "ok" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
