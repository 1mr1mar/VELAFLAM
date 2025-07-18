import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
          reviews: [],
        },
        { status: 503 },
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product_id")
    const limit = searchParams.get("limit")

    let query = supabase
      .from("reviews")
      .select(`
        *,
        products (name, image_url)
      `)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    if (productId) {
      query = query.eq("product_id", productId)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json({ reviews: reviews || [] })
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
    const { product_id, customer_name, customer_email, rating, comment } = body

    if (!product_id || !customer_name || !customer_email || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id,
        customer_name,
        customer_email,
        rating: Number.parseInt(rating),
        comment: comment || "",
        is_approved: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    return NextResponse.json({ review: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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
    const { id, approved } = body

    const { data, error } = await supabase.from("reviews").update({ approved }).eq("id", id).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
    }

    return NextResponse.json({ review: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
