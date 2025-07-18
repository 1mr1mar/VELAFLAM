"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image_url: string
}

interface WishlistState {
  items: WishlistItem[]
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" }
  | { type: "LOAD_WISHLIST"; payload: WishlistItem[] }

const WishlistContext = createContext<{
  state: WishlistState
  dispatch: React.Dispatch<WishlistAction>
} | null>(null)

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((item) => item.id === action.payload.id)
      if (exists) return state
      return { items: [...state.items, action.payload] }
    }

    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item.id !== action.payload) }

    case "CLEAR_WISHLIST":
      return { items: [] }

    case "LOAD_WISHLIST":
      return { items: action.payload }

    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("flames-wishlist")
    if (savedWishlist) {
      try {
        const wishlistItems = JSON.parse(savedWishlist)
        dispatch({ type: "LOAD_WISHLIST", payload: wishlistItems })
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("flames-wishlist", JSON.stringify(state.items))
  }, [state.items])

  return <WishlistContext.Provider value={{ state, dispatch }}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
