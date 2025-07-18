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
    const { data, error } = await supabase
      .from("products")
      .update({
        name: body.name,
        description: body.description,
        price: Number.parseFloat(body.price),
        image_url: body.image_url || "/placeholder.svg?height=400&width=400",
        category: body.category,
        stock_quantity: Number.parseInt(body.stock_quantity),
        is_featured: body.is_featured,
        is_new_arrival: body.is_new_arrival,
      })
      .eq("id", params.id)
      .select()
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    const { error } = await supabase.from("products").delete().eq("id", params.id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
