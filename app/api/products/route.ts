import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
          products: [],
        },
        { status: 503 },
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const newArrivals = searchParams.get("new_arrivals")
    const limit = searchParams.get("limit")

    let query = supabase.from("products").select("*")

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    if (newArrivals === "true") {
      query = query.eq("is_new_arrival", true)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: products, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured. Please set up Supabase environment variables.",
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    const { name, description, price, category, image_url, featured, new_arrival } = body

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price: Number.parseFloat(price),
        category,
        image_url: image_url || "/placeholder.svg?height=300&width=300",
        is_featured: featured || false,
        is_new_arrival: new_arrival || false,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
