"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Clock } from "lucide-react"

interface Order {
  id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  shipping_address: string
  total_amount: number
  status: string
  created_at: string
  order_items: {
    id: string
    quantity: number
    price: number
    products: {
      name: string
      image_url: string
    }
  }[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string)
    }
  }, [params.id])

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order not found</h1>
          <p className="text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="capitalize font-semibold text-yellow-600">{order.status}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-primary-500">${order.total_amount.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-semibold">{order.guest_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{order.guest_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{order.guest_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Shipping Address</p>
              <p className="font-semibold">{order.shipping_address}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.products.image_url || "/placeholder.svg"}
                    alt={item.products.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{item.products.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-primary-500" />
              <span>We'll prepare your order for shipping</span>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-primary-500" />
              <span>Your order will be shipped within 1-2 business days</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-primary-500" />
              <span>You'll receive a confirmation email with tracking information</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-8">
        <Button asChild className="bg-primary-500 hover:bg-primary-600 mr-4">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
