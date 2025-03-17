import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET(req) {
    try {
      const url = new URL(req.url);
      const collections = url.searchParams.getAll("collection");
      
      let query = "SELECT * FROM products";
      let values = [];
      
      if (collections.length > 0) {
        const placeholders = collections.map(() => "?").join(", ");
        query += ` WHERE collection IN (${placeholders})`;
        values = collections;
      }
      
      const [rows] = await db.execute(query, values);
      
      return NextResponse.json(rows, { status: 200 });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }