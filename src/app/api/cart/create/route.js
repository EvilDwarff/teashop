import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id_user } = await req.json();

    // Валидация данных
    if (!id_user || isNaN(id_user)) {
      return NextResponse.json(
        { error: "Некорректный идентификатор пользователя" },
        { status: 400 }
      );
    }

    // Проверка существующей корзины
    const [existingCart] = await db.query(
      "SELECT id FROM cart WHERE id_user = ?",
      [id_user]
    );

    if (existingCart.length > 0) {
      return NextResponse.json(
        { 
          cart_id: existingCart[0].id,
          message: "Корзина уже существует" 
        },
        { status: 200 }
      );
    }

    // Создание новой корзины
    const [result] = await db.query(
      "INSERT INTO cart (id_user) VALUES (?)",
      [id_user]
    );

    return NextResponse.json(
      { 
        cart_id: result.insertId,
        message: "Корзина успешно создана" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Ошибка создания корзины:", error);
    return NextResponse.json(
      { 
        error: "Внутренняя ошибка сервера",
        details: error.message 
      },
      { status: 500 }
    );
  }
}