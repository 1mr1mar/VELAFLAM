"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload, Loader2, X, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock_quantity: number
  is_featured: boolean
  is_new_arrival: boolean
  created_at: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock_quantity: "",
    is_featured: false,
    is_new_arrival: false,
  })

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const productData = data.product
      
      if (!productData) {
        throw new Error("Product not found")
      }

      setProduct(productData)
      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData.price.toString(),
        image_url: productData.image_url || "",
        category: productData.category,
        stock_quantity: productData.stock_quantity.toString(),
        is_featured: productData.is_featured,
        is_new_arrival: productData.is_new_arrival,
      })
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, WebP, or GIF image.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setFormData(prev => ({ ...prev, image_url: "" })) // Clear URL input when file is selected
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, image_url: data.filePath }))
      
      toast({
        title: "Image uploaded",
        description: "Product image has been uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          image_url: formData.image_url,
          category: formData.category,
          stock_quantity: formData.stock_quantity,
          is_featured: formData.is_featured,
          is_new_arrival: formData.is_new_arrival,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      toast({
        title: "Product updated",
        description: "Product has been successfully updated.",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Button asChild className="bg-primary-500 hover:bg-primary-600">
            <Link href="/admin/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                    <Input
                      id="stock_quantity"
                      name="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Candles">Candles</option>
                    <option value="Torches">Torches</option>
                    <option value="Lamps">Lamps</option>
                    <option value="Decorative">Decorative</option>
                    <option value="Sculptures">Sculptures</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Jewelry">Jewelry</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Section */}
                <div>
                  <Label htmlFor="file">Upload New Image</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Choose File</span>
                      </Button>
                      {selectedFile && (
                        <>
                          <Button
                            type="button"
                            onClick={handleFileUpload}
                            disabled={uploading}
                            className="bg-primary-500 hover:bg-primary-600 text-white"
                          >
                            {uploading ? "Uploading..." : "Upload"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={removeSelectedFile}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {(previewUrl || formData.image_url) && (
                  <div className="border rounded-lg p-4">
                    <Label className="text-sm text-gray-600 mb-2 block">
                      {previewUrl ? "New Image Preview" : "Current Image"}
                    </Label>
                    <div className="relative w-32 h-32">
                      <Image
                        src={previewUrl || formData.image_url}
                        alt={formData.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* URL Input (Alternative) */}
                <div>
                  <Label htmlFor="image_url">Or Enter Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedFile}
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Clear selected file to use URL input
                    </p>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Upload product image</p>
                  <p className="text-sm text-gray-500">Choose a file or enter image URL</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">Featured Product</Label>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleSwitchChange("is_featured", checked)}
                  />
                </div>
                <p className="text-sm text-gray-600">Featured products appear in the featured section</p>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_new_arrival">New Arrival</Label>
                  <Switch
                    id="is_new_arrival"
                    checked={formData.is_new_arrival}
                    onCheckedChange={(checked) => handleSwitchChange("is_new_arrival", checked)}
                  />
                </div>
                <p className="text-sm text-gray-600">New arrivals appear in the new arrivals section</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Product ID</Label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">{product.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Created</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="submit" className="w-full bg-primary-500 hover:bg-primary-600" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/admin/products">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
} 