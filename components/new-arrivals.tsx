"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNewArrivals()
  }, [])

  const fetchNewArrivals = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_new_arrival", true)
        .gt("stock_quantity", 0)
        .order("created_at", { ascending: false })
        .limit(4)

      if (error) throw error

      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching new arrivals:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium flames and fire-themed decorative pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="border-primary-500 text-primary-500 hover:bg-primary-50 bg-transparent"
          >
            <Link href="/shop">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
