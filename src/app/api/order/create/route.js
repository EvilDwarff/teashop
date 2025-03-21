import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id, address, payment_method } = await req.json();

    // Проверяем наличие корзины у пользователя
    const [cart] = await db.query("SELECT id FROM cart WHERE id_user = ?", [user_id]);

    if (!cart.length) {
      return NextResponse.json({ error: "Корзина не найдена" }, { status: 404 });
    }

    const cart_id = cart[0].id;

    
    const [cartItems] = await db.query(
      `SELECT ci.product_id, ci.quantity, p.price_per_gram 
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cart_id]
    );

    if (!cartItems.length) {
      return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
    }

    // Создаем заказ
    const [order] = await db.query(
      "INSERT INTO `order` (id_user, address, payment_method, id_status) VALUES (?, ?, ?, 1)",
      [user_id, address, payment_method]
    );

    const order_id = order.insertId;

    // Добавляем товары в заказ
    for (const item of cartItems) {
      const itemTotalPrice = (item.quantity * item.price_per_gram).toFixed(2); // Корректный расчет цены
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [order_id, item.product_id, item.quantity, itemTotalPrice]
      );
    }

    // Очищаем корзину после оформления заказа
    await db.query("DELETE FROM cart_items WHERE cart_id = ?", [cart_id]);

    return NextResponse.json(
      { message: "Заказ успешно создан", order_id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}
