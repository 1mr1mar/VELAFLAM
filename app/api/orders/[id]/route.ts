import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if Supabase is configured
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
          order: null,
        },
        { status: 503 },
      )
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        id,
        guest_name,
        guest_email,
        guest_phone,
        shipping_address,
        total_amount,
        status,
        payment_method,
        created_at,
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
    const { status } = body

    const { data, error } = await supabase.from("orders").update({ status }).eq("id", params.id).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
