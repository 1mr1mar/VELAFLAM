"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye, Edit, Star, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalReviews: number
  averageRating: number
  totalMessages: number
}

interface Order {
  id: string
  guest_name: string
  guest_email: string
  total_amount: number
  status: string
  created_at: string
}

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  category: string
  is_featured: boolean
  is_new_arrival: boolean
}

interface Review {
  id: string
  customer_name: string
  rating: number
  title: string
  comment: string
  created_at: string
  products: {
    name: string
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalReviews: 0,
    averageRating: 0,
    totalMessages: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      if (!supabase) {
        console.error("Supabase client not configured")
        return
      }

      // Fetch stats
      const [productsRes, ordersRes, revenueRes, pendingRes, reviewsRes, avgRatingRes, messagesRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("orders").select("id", { count: "exact" }),
        supabase.from("orders").select("total_amount"),
        supabase.from("orders").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("reviews").select("id", { count: "exact" }),
        supabase.from("reviews").select("rating"),
        supabase.from("contact_messages").select("id", { count: "exact" }),
      ])

      const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0
      const averageRating = avgRatingRes.data?.length
        ? avgRatingRes.data.reduce((sum, review) => sum + review.rating, 0) / avgRatingRes.data.length
        : 0

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        totalRevenue,
        pendingOrders: pendingRes.count || 0,
        totalReviews: reviewsRes.count || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        totalMessages: messagesRes.count || 0,
      })

      // Fetch recent orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      setRecentOrders(orders || [])

      // Fetch low stock products
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .lte("stock_quantity", 10)
        .order("stock_quantity", { ascending: true })
        .limit(5)

      setLowStockProducts(products || [])

      // Fetch recent reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select(`
          *,
          products (name)
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      setRecentReviews(reviews || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) throw error

      // Refresh data
      fetchDashboardData()
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <Star className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}★</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{order.guest_name}</p>
                    <p className="text-sm text-gray-600">{order.guest_email}</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${order.total_amount.toFixed(2)}</p>
                    <Badge
                      variant={
                        order.status === "pending" ? "secondary" : order.status === "confirmed" ? "default" : "outline"
                      }
                      className="mt-1"
                    >
                      {order.status}
                    </Badge>
                    <div className="mt-2 space-x-1">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "confirmed")}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
                        >
                          Confirm
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
                        >
                          Ship
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alert</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/products">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm font-medium text-primary-600">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={product.stock_quantity === 0 ? "destructive" : "secondary"} className="mb-2">
                      {product.stock_quantity} left
                    </Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 bg-transparent">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 bg-transparent">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Reviews</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/reviews">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{review.customer_name}</p>
                    <p className="text-sm text-gray-600">{review.products.name}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                {review.title && <p className="font-medium text-gray-900 mb-1">{review.title}</p>}
                <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
