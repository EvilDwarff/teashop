import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    // Получаем заказы пользователя
    const [orders] = await db.query(
      `SELECT 
        o.id AS order_id, 
        DATE_FORMAT(o.created_at, '%d-%m-%Y') AS order_date,
        os.name AS order_status, 
        SUM(oi.price) AS total_amount
      FROM \`order\` o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN order_status os ON o.id_status = os.id
      WHERE o.id_user = ?
      GROUP BY o.id, o.created_at, o.id_status
      ORDER BY o.created_at DESC`,
      [user_id]
    );

    console.log("Received orders:", orders);

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    return NextResponse.json({ error: "Ошибка при получении заказов" }, { status: 500 });
  }
}
