import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    // Check if Supabase is configured
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
          orders: [],
        },
        { status: 503 },
      )
    }

    const { data: orders, error } = await supabase
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
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({ orders: orders || [] })
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
    const { customerInfo, items, total } = body

    // Validate required fields
    if (!customerInfo || !items || items.length === 0) {
      return NextResponse.json({ 
        error: "Missing required fields: customerInfo, items" 
      }, { status: 400 })
    }

    const { fullName, email, phone, address, city, postalCode, notes } = customerInfo

    if (!fullName || !email || !phone || !address || !city || !postalCode) {
      return NextResponse.json({ 
        error: "Missing required customer information" 
      }, { status: 400 })
    }

    // Create shipping address string
    const shippingAddress = `${address}, ${city}, ${postalCode}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        guest_name: fullName,
        guest_email: email,
        guest_phone: phone,
        shipping_address: shippingAddress,
        total_amount: Number.parseFloat(total),
        status: "pending",
        payment_method: "cash_on_delivery",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items - map cart items to order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id, // Cart items use 'id' as product_id
      quantity: item.quantity,
      price: Number.parseFloat(item.price),
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
