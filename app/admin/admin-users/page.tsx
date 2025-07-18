"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, UserCog, Shield, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface AdminUser {
  id: string
  email: string
  full_name: string
  created_at: string
}

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchAdminUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [adminUsers, searchTerm])

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setAdminUsers(data || [])
    } catch (error) {
      console.error("Error fetching admin users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = adminUsers

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredUsers(filtered)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from("admin_users")
          .update({
            email: formData.email,
            full_name: formData.full_name,
            ...(formData.password && { password_hash: formData.password }), // In real app, hash the password
          })
          .eq("id", editingUser.id)

        if (error) throw error

        toast({
          title: "Admin user updated",
          description: "Admin user has been successfully updated.",
        })
      } else {
        // Create new user
        const { error } = await supabase.from("admin_users").insert({
          email: formData.email,
          full_name: formData.full_name,
          password_hash: formData.password, // In real app, hash the password
        })

        if (error) throw error

        toast({
          title: "Admin user created",
          description: "New admin user has been successfully created.",
        })
      }

      // Reset form and refresh data
      setFormData({ email: "", full_name: "", password: "" })
      setShowAddForm(false)
      setEditingUser(null)
      fetchAdminUsers()
    } catch (error) {
      console.error("Error saving admin user:", error)
      toast({
        title: "Error",
        description: "Failed to save admin user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      full_name: user.full_name,
      password: "",
    })
    setShowAddForm(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return

    try {
      const { error } = await supabase.from("admin_users").delete().eq("id", userId)

      if (error) throw error

      toast({
        title: "Admin user deleted",
        description: "Admin user has been successfully deleted.",
      })

      fetchAdminUsers()
    } catch (error) {
      console.error("Error deleting admin user:", error)
      toast({
        title: "Error",
        description: "Failed to delete admin user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ email: "", full_name: "", password: "" })
    setShowAddForm(false)
    setEditingUser(null)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-600">Manage administrator accounts and permissions</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-primary-500 hover:bg-primary-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Admin Users</p>
              <p className="text-2xl font-bold text-gray-900">{adminUsers.length}</p>
            </div>
            <UserCog className="h-8 w-8 text-primary-500" />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? "Edit Admin User" : "Add New Admin User"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password {editingUser ? "(leave blank to keep current)" : "*"}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required={!editingUser}
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-primary-500 hover:bg-primary-600">
                  {editingUser ? "Update User" : "Create User"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search admin users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                        <Badge variant="default">Admin</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Created {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserCog className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No admin users found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
