import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { cart_id, product_id } = await req.json();
    console.log(cart_id, product_id );
    
    await db.query("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [cart_id, product_id]);

    return NextResponse.json({ message: "Товар удален из корзины" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при удалении товара" }, { status: 500 });
  }
}
