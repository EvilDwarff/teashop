import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Получаем данные о заказе
    const [order] = await db.query(
      `SELECT 
        o.id AS order_id, 
        DATE_FORMAT(o.created_at, '%d-%m-%Y %H:%i') AS order_date,
        o.address,
        o.payment_method,
        os.name AS order_status,
        COALESCE(SUM(oi.price), 0) AS total_amount
      FROM \`order\` o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      JOIN order_status os ON o.id_status = os.id
      WHERE o.id = ?
      GROUP BY o.id, o.created_at, o.address, o.payment_method, os.name`,
      [order_id]
    );

    if (!order || order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Получаем товары в заказе
    const [orderItems] = await db.query(
      `SELECT 
        p.name, p.image, oi.quantity, oi.price 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?`, 
      [order_id]
    );

    return NextResponse.json({ order: order[0], items: orderItems }, { status: 200 });

  } catch (error) {
    console.error("❌ Ошибка при получении деталей заказа:", error);
    return NextResponse.json({ error: "Ошибка при получении деталей заказа" }, { status: 500 });
  }
}
