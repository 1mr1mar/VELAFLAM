import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        {
          error: "Database not configured",
          messages: [],
        },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contact messages:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch contact messages",
          messages: [],
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      messages: data || [],
    })
  } catch (error) {
    console.error("Error in contact messages API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        messages: [],
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting contact message:", error)
      return NextResponse.json(
        { error: "Failed to delete message" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Message deleted successfully" })
  } catch (error) {
    console.error("Error in delete contact message API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 