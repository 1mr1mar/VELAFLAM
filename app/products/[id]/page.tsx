"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Minus, Plus, ArrowLeft, AlertCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { ProductReviews } from "@/components/product-reviews"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock_quantity: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { dispatch: cartDispatch } = useCart()
  const { dispatch: wishlistDispatch, state: wishlistState } = useWishlist()
  const { toast } = useToast()

  const isInWishlist = product ? wishlistState.items.some((item) => item.id === product.id) : false

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    } else {
      setError("No product ID provided")
      setLoading(false)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found")
        } else if (response.status === 503) {
          throw new Error("Database not configured. Please check your environment variables.")
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      }
      
      const data = await response.json()

      if (!data.product) {
        throw new Error("Product not found")
      }
      
      setProduct(data.product)
    } catch (error) {
      console.error("Error fetching product:", error)
      setError(error instanceof Error ? error.message : "Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    for (let i = 0; i < quantity; i++) {
      cartDispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        },
      })
    }

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name}${quantity > 1 ? "s" : ""} added to your cart.`,
    })
  }

  const handleToggleWishlist = () => {
    if (!product) return

    if (isInWishlist) {
      wishlistDispatch({ type: "REMOVE_ITEM", payload: product.id })
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      wishlistDispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        },
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-800 mb-4">Error Loading Product</h1>
              <p className="text-red-700 mb-6">{error}</p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
                <Button asChild variant="outline" className="ml-4">
                  <Link href="/shop">Back to Shop</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Button asChild className="bg-primary-500 hover:bg-primary-600">
            <Link href="/shop">Back to Shop</Link>
          </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 text-primary-600 hover:text-primary-700">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-xl">
              <Image
                src={product.image_url || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8 out of 5 stars)</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-6">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Stock Status</h3>
              <Badge
                variant={product.stock_quantity > 0 ? "default" : "destructive"}
                className={product.stock_quantity > 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
              >
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
              </Badge>
            </div>

            {product.stock_quantity > 0 && (
              <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="border-primary-200 hover:bg-primary-50"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                      className="border-primary-200 hover:bg-primary-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleToggleWishlist}
                    className={`p-3 ${
                      isInWishlist
                        ? "text-primary-600 border-primary-600 bg-primary-50"
                        : "border-gray-300 hover:border-primary-500"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
      </div>
    </div>
  )
}
