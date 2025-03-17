import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    // 1. Получаем корзину пользователя
    const [cart] = await db.query(
      "SELECT id FROM cart WHERE id_user = ?", 
      [user_id]
    );

    if (!cart.length) {
      return NextResponse.json(
        { items: [], message: "Корзина пуста" }, 
        { status: 200 }
      );
    }

    // 2. Получаем элементы корзины
    const [cartItems] = await db.query(
      `SELECT 
        ci.id,
        ci.quantity,
        ci.product_id,
        p.price_per_gram,
        p.name,
        p.image,
        p.collection,
        (ci.quantity * p.price_per_gram) AS total_price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cart[0].id]
    );

    // 3. Возвращаем результат
    return NextResponse.json({

      cart_id: cart[0].id,
      items: cartItems || []
    }, { status: 200 });

  } catch (error) {
    console.error("Ошибка получения корзины:", error);
    return NextResponse.json(
      { error: "Ошибка при получении корзины: " + error.message },
      { status: 500 }
    );
  }
}