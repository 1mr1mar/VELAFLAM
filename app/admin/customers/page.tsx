"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Mail, Phone, ShoppingBag } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Customer {
  id: string
  email: string
  full_name: string
  phone: string
  created_at: string
  order_count: number
  total_spent: number
  last_order_date: string
}

interface GuestCustomer {
  guest_email: string
  guest_name: string
  guest_phone: string
  order_count: number
  total_spent: number
  last_order_date: string
}

export default function CustomersPage() {
  const [registeredCustomers, setRegisteredCustomers] = useState<Customer[]>([])
  const [guestCustomers, setGuestCustomers] = useState<GuestCustomer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<(Customer | GuestCustomer)[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [registeredCustomers, guestCustomers, searchTerm, selectedTab])

  const fetchCustomers = async () => {
    try {
      // Fetch registered customers
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) throw usersError

      // Get order statistics for registered users
      const registeredWithStats = await Promise.all(
        (users || []).map(async (user) => {
          const { data: orders } = await supabase
            .from("orders")
            .select("total_amount, created_at")
            .eq("user_id", user.id)

          const orderCount = orders?.length || 0
          const totalSpent = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
          const lastOrderDate = orders?.[0]?.created_at || ""

          return {
            ...user,
            order_count: orderCount,
            total_spent: totalSpent,
            last_order_date: lastOrderDate,
          }
        }),
      )

      setRegisteredCustomers(registeredWithStats)

      // Fetch guest customers (from orders)
      const { data: guestOrders, error: guestError } = await supabase
        .from("orders")
        .select("guest_email, guest_name, guest_phone, total_amount, created_at")
        .is("user_id", null)
        .order("created_at", { ascending: false })

      if (guestError) throw guestError

      // Group guest orders by email
      const guestMap = new Map()
      guestOrders?.forEach((order) => {
        const key = order.guest_email
        if (guestMap.has(key)) {
          const existing = guestMap.get(key)
          existing.order_count += 1
          existing.total_spent += order.total_amount
          if (order.created_at > existing.last_order_date) {
            existing.last_order_date = order.created_at
          }
        } else {
          guestMap.set(key, {
            guest_email: order.guest_email,
            guest_name: order.guest_name,
            guest_phone: order.guest_phone,
            order_count: 1,
            total_spent: order.total_amount,
            last_order_date: order.created_at,
          })
        }
      })

      setGuestCustomers(Array.from(guestMap.values()))
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    let allCustomers: (Customer | GuestCustomer)[] = []

    if (selectedTab === "all" || selectedTab === "registered") {
      allCustomers = [...allCustomers, ...registeredCustomers]
    }
    if (selectedTab === "all" || selectedTab === "guest") {
      allCustomers = [...allCustomers, ...guestCustomers]
    }

    // Filter by search term
    if (searchTerm) {
      allCustomers = allCustomers.filter((customer) => {
        const name = "full_name" in customer ? customer.full_name : customer.guest_name
        const email = "email" in customer ? customer.email : customer.guest_email
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    // Sort by total spent (descending)
    allCustomers.sort((a, b) => b.total_spent - a.total_spent)

    setFilteredCustomers(allCustomers)
  }

  const isRegisteredCustomer = (customer: Customer | GuestCustomer): customer is Customer => {
    return "id" in customer
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your customer base and track their activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{registeredCustomers.length + guestCustomers.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registered</p>
                <p className="text-2xl font-bold text-gray-900">{registeredCustomers.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Guest Customers</p>
                <p className="text-2xl font-bold text-gray-900">{guestCustomers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {filteredCustomers.length > 0
                    ? (
                        filteredCustomers.reduce((sum, c) => sum + c.total_spent, 0) /
                        filteredCustomers.reduce((sum, c) => sum + c.order_count, 0)
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedTab === "all" ? "default" : "outline"}
                onClick={() => setSelectedTab("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedTab === "registered" ? "default" : "outline"}
                onClick={() => setSelectedTab("registered")}
                size="sm"
              >
                Registered
              </Button>
              <Button
                variant={selectedTab === "guest" ? "default" : "outline"}
                onClick={() => setSelectedTab("guest")}
                size="sm"
              >
                Guest
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {isRegisteredCustomer(customer) ? customer.full_name : customer.guest_name}
                        </h3>
                        <Badge variant={isRegisteredCustomer(customer) ? "default" : "secondary"}>
                          {isRegisteredCustomer(customer) ? "Registered" : "Guest"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{isRegisteredCustomer(customer) ? customer.email : customer.guest_email}</span>
                        </div>
                        {((isRegisteredCustomer(customer) && customer.phone) ||
                          (!isRegisteredCustomer(customer) && customer.guest_phone)) && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{isRegisteredCustomer(customer) ? customer.phone : customer.guest_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="font-semibold text-gray-900">{customer.order_count}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="font-semibold text-primary-600">${customer.total_spent.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Last Order</p>
                        <p className="font-semibold text-gray-900">
                          {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : "Never"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customers found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
