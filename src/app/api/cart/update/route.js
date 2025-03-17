import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id, product_id, quantity } = await req.json();

    // 1. Находим корзину пользователя
    const [cart] = await db.query(
      "SELECT id FROM cart WHERE id_user = ?",
      [user_id]
    );
    
    if (!cart.length) {
      return NextResponse.json(
        { error: "Корзина не найдена" },
        { status: 404 }
      );
    }
    const cart_id = cart[0].id;

    // 2. Проверяем существование товара в корзине
    const [existingItem] = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cart_id, product_id]
    );

    if (!existingItem.length) {
      return NextResponse.json(
        { error: "Товар не найден в корзине" },
        { status: 404 }
      );
    }

    // 3. Валидация количества
    const validQuantity = Math.max(50, Math.min(quantity, 1000));

    // 4. Обновляем количество
    await db.query(
      "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
      [validQuantity, cart_id, product_id]
    );

    return NextResponse.json(
      { message: "Количество обновлено", quantity: validQuantity },
      { status: 200 }
    );

  } catch (error) {
    console.error("Ошибка обновления:", error);
    return NextResponse.json(
      { error: "Ошибка сервера: " + error.message },
      { status: 500 }
    );
  }
}