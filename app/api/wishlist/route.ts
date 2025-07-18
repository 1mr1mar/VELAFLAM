import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
          wishlist: [],
        },
        { status: 503 },
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const { data: wishlist, error } = await supabase
      .from("wishlist")
      .select(`
        *,
        products (*)
      `)
      .eq("session_id", sessionId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
    }

    return NextResponse.json({ wishlist: wishlist || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured. Please set up Supabase environment variables.",
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    const { product_id, session_id } = body

    if (!product_id || !session_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if item already exists
    const { data: existing } = await supabase
      .from("wishlist")
      .select("id")
      .eq("product_id", product_id)
      .eq("session_id", session_id)
      .single()

    if (existing) {
      return NextResponse.json({ message: "Item already in wishlist" })
    }

    const { data, error } = await supabase.from("wishlist").insert({ product_id, session_id }).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
    }

    return NextResponse.json({ wishlist_item: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product_id")
    const sessionId = searchParams.get("session_id")

    if (!productId || !sessionId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const { error } = await supabase.from("wishlist").delete().eq("product_id", productId).eq("session_id", sessionId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
    }

    return NextResponse.json({ message: "Item removed from wishlist" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
