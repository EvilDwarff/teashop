import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { cart_id, product_id, quantity } = await req.json();

    // 1. Проверяем существование корзины
    const [cart] = await db.query(
      "SELECT id FROM cart WHERE id = ?",
      [cart_id]
    );

    if (!cart.length) {
      return NextResponse.json(
        { error: "Корзина не найдена" },
        { status: 404 }
      );
    }

    // 2. Проверяем существование товара
    const [product] = await db.query(
      "SELECT price_per_gram FROM products WHERE id = ?",
      [product_id]
    );

    if (!product.length) {
      return NextResponse.json(
        { error: "Товар не найден" },
        { status: 404 }
      );
    }

    // 3. Добавляем/обновляем товар в корзине
    const [existingItem] = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cart_id, product_id]
    );

    if (existingItem.length > 0) {
      await db.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [quantity, existingItem[0].id]
      );
    } else {
      await db.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cart_id, product_id, quantity, product[0].price_per_gram]
      );
    }

    return NextResponse.json(
      { success: true, message: "Товар добавлен в корзину" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Ошибка добавления товара:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}