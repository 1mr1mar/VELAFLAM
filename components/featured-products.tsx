"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true&limit=6")
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching featured products:", error)
      // If it's a database configuration error, show a helpful message
      if (error instanceof Error && error.message.includes("Database not configured")) {
        console.error("Please set up your Supabase environment variables in .env.local")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Show a helpful message if no products are loaded and we're not loading
  if (products.length === 0 && !loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 mb-8">
              Unable to load featured products. Please check your database configuration.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Setup Required</h3>
              <p className="text-yellow-700 mb-4">
                To display products, you need to set up your Supabase database:
              </p>
              <ol className="text-sm text-yellow-700 space-y-1 text-left max-w-md mx-auto">
                <li>1. Create a Supabase project at <a href="https://supabase.com" className="underline">supabase.com</a></li>
                <li>2. Create a <code className="bg-yellow-100 px-1 rounded">.env.local</code> file in your project root</li>
                <li>3. Add your Supabase URL and API keys to the environment file</li>
                <li>4. Run the database setup scripts in the <code className="bg-yellow-100 px-1 rounded">scripts/</code> folder</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most popular and highly-rated flame products, loved by customers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
