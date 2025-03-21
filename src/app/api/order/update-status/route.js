import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const { order_id, status_id } = await req.json();

    if (!order_id || !status_id) {
      return NextResponse.json({ error: "Отсутствуют order_id или status_id" }, { status: 400 });
    }

    await db.query("UPDATE `order` SET id_status = ? WHERE id = ?", [status_id, order_id]);

    return NextResponse.json({ message: "Статус заказа обновлён" }, { status: 200 });
  } catch (error) {
    console.error("❌ Ошибка при обновлении статуса:", error);
    return NextResponse.json({ error: "Ошибка при обновлении статуса" }, { status: 500 });
  }
}
