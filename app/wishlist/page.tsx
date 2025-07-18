"use client"

import { useWishlist } from "@/contexts/wishlist-context"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function WishlistPage() {
  const { state } = useWishlist()

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later.</p>
          <Button asChild className="bg-primary-500 hover:bg-primary-600">
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
        <p className="text-gray-600">
          You have {state.items.length} item{state.items.length !== 1 ? "s" : ""} in your wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.items.map((item) => (
          <ProductCard
            key={item.id}
            product={{
              id: item.id,
              name: item.name,
              description: "Premium quality flame product",
              price: item.price,
              image_url: item.image_url,
              category: "Wishlist",
            }}
          />
        ))}
      </div>
    </div>
  )
}
