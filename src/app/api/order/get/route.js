import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id, order_id } = await req.json();

    // Проверяем, есть ли пользователь и его роль
    const [users] = await db.query("SELECT role FROM users WHERE id = ?", [
      user_id,
    ]);
    if (users.length === 0) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const isAdmin = users[0].role === 1; // Если роль 1 — администратор

    let whereClause = isAdmin ? "" : "WHERE o.id_user = ?";
    let params = isAdmin ? [] : [user_id];

    if (order_id) {
      whereClause = "WHERE o.id = ?";
      params = [order_id];
    }

    const [orders] = await db.query(
      `SELECT 
        o.id AS order_id, 
        DATE_FORMAT(o.created_at, '%d-%m-%Y %H:%i') AS order_date,
        o.address,
        o.payment_method,
        os.id AS status_id,
        os.name AS order_status, 
        COALESCE(SUM(oi.price), 0) AS total_amount
      FROM \`order\` o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      JOIN order_status os ON o.id_status = os.id
      ${whereClause}
      GROUP BY o.id, o.created_at, o.address, o.payment_method, os.id, os.name
      ORDER BY o.created_at DESC`,
      params
    );

    console.log("🔍 Полученные заказы:", orders);
    console.log("🔍 Запрос на детали заказа:", order_id);

    if (order_id) {
      const [orderItems] = await db.query(
        `SELECT 
          p.name, p.image, oi.quantity, oi.price 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`[order_id]
      );

      return NextResponse.json(
        { order: orders[0], items: orderItems },
        { status: 200 }
      );
    } else {
      console.log("🔍 Заказ не найден для ID:", order_id);
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("❌ Ошибка при получении заказов:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заказов" },
      { status: 500 }
    );
  }
}
