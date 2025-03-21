import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [statuses] = await db.query("SELECT id, name FROM order_status");
    return NextResponse.json({ statuses }, { status: 200 });
  } catch (error) {
    console.error("❌ Ошибка при получении статусов заказов:", error);
    return NextResponse.json({ error: "Ошибка при получении статусов" }, { status: 500 });
  }
}
