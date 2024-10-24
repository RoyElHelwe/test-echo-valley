import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/util/connect-mongo";
import Product from "@/model/product";
import History from "@/model/history";
import { getCurrentUser } from "@/util/sessions";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { searchTerm } = await req.json();
    const auth = await getCurrentUser();
    const userId = auth?.id;

    // check if the search term already exist
    const history = await History.findOne({ userId, searchTerm });
    if (!history) {
      await History.create({ userId, searchTerm });
    }
    
    // get all history when the history up to 10 please delete the oldest one
    const allHistory = await History.find({ userId }).sort({ timestamp: -1 });
    if (allHistory.length > 10) {
      await History.deleteOne({ _id: allHistory[allHistory.length - 1]._id });
    }
    // Search for products by name
    const products = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
