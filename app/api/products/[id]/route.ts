import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
          product: null,
        },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error: "Product not found",
            product: null,
          },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({
      product: data,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        product: null,
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("PUT request received for product ID:", params.id)
    
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
          product: null,
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log("Request body:", JSON.stringify(body, null, 2))
    
    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.category || !body.stock_quantity) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          product: null,
        },
        { status: 400 }
      )
    }

    // Parse numeric values safely
    const price = Number.parseFloat(body.price)
    const stockQuantity = Number.parseInt(body.stock_quantity)
    
    if (isNaN(price) || isNaN(stockQuantity)) {
      return NextResponse.json(
        {
          error: "Invalid price or stock quantity",
          product: null,
        },
        { status: 400 }
      )
    }

    const updateData = {
      name: body.name,
      description: body.description,
      price: price,
      image_url: body.image_url || "/placeholder.svg?height=400&width=400",
      category: body.category,
      stock_quantity: stockQuantity,
      is_featured: Boolean(body.is_featured),
      is_new_arrival: Boolean(body.is_new_arrival),
    }

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error: "Product not found",
            product: null,
          },
          { status: 404 }
        )
      }
      return NextResponse.json(
        {
          error: `Database error: ${error.message}`,
          product: null,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      product: data,
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        error: "Failed to update product",
        product: null,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
        },
        { status: 503 }
      )
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 