import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const productId = params.id;
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
    
    const query = "SELECT id, image, name, collection, price_per_gram, country, flavor, qualities, caffeine, allergens FROM products WHERE id = ?";
    const [rows] = await db.execute(query, [productId]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

