"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch: cartDispatch } = useCart()
  const { dispatch: wishlistDispatch, state: wishlistState } = useWishlist()
  const { toast } = useToast()

  const isInWishlist = wishlistState.items.some((item) => item.id === product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    cartDispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md">
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image_url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Wishlist button - Fixed z-index */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 p-2 rounded-full z-20 transition-all duration-200 ${
            isInWishlist
              ? "bg-primary-500 text-white hover:bg-primary-600 shadow-lg"
              : "bg-white/90 text-gray-700 hover:bg-white hover:text-primary-500 shadow-md"
          }`}
          onClick={handleToggleWishlist}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
        </Button>

        {/* View Details overlay - Updated */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <Link href={`/products/${product.id}`}>
            <Button className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-500">${product.price.toFixed(2)}</span>
          <Button onClick={handleAddToCart} size="sm" className="bg-primary-500 hover:bg-primary-600 text-white">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
