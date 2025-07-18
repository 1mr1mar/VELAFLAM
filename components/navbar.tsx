"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ShoppingCart, Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { state: cartState } = useCart()
  const { state: wishlistState } = useWishlist()

  const cartItemsCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistItemsCount = wishlistState.items.length

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/velaflam-logo.png"
              alt="Velaflam Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              VELAFLAM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-primary-500 transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-500 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-500 transition-colors">
              Contact
            </Link>
          </div>

          {/* Cart and Wishlist Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/wishlist" className="relative p-2 text-gray-700 hover:text-primary-500 transition-colors">
              <Heart className="h-6 w-6" />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-500 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-primary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
