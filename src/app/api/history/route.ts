import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/util/connect-mongo";
import History from "@/model/history";
import { getCurrentUser } from "@/util/sessions";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const session = await getCurrentUser();
    const userId = session?.id;
    const history = await History.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5);

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
