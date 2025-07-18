"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Store, Mail, Globe, Shield, Bell, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "VELAFLAM",
    storeDescription: "Premium fire effects and decorative flames for your home and business.",
    storeEmail: "contact@velaflam.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Flame Street, Fire City, FC 12345",

    // Website Settings
    websiteUrl: "https://velaflam.com",
    metaTitle: "VELAFLAM - Premium Fire Effects & Decor",
    metaDescription: "Discover our collection of premium flames, candles, torches, and fire-themed decorative items.",

    // Email Settings
    emailNotifications: true,
    orderNotifications: true,
    reviewNotifications: true,
    lowStockNotifications: true,

    // Security Settings
    requireEmailVerification: false,
    enableTwoFactor: false,
    sessionTimeout: "24",

    // Display Settings
    itemsPerPage: "12",
    enableWishlist: true,
    enableReviews: true,
    enableGuestCheckout: true,

    // Shipping Settings
    freeShippingThreshold: "50",
    shippingCost: "5.99",
    processingTime: "1-2 business days",
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real app, you would save these settings to your database
      // For now, we'll just simulate a save operation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your settings have been successfully updated.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your store settings and preferences</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Store Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" name="storeName" value={settings.storeName} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={settings.storeDescription}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input id="storePhone" name="storePhone" value={settings.storePhone} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  name="storeAddress"
                  value={settings.storeAddress}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Website Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Website Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input id="websiteUrl" name="websiteUrl" value={settings.websiteUrl} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" name="metaTitle" value={settings.metaTitle} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={settings.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="itemsPerPage">Items Per Page</Label>
                <Input
                  id="itemsPerPage"
                  name="itemsPerPage"
                  type="number"
                  value={settings.itemsPerPage}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Email Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="orderNotifications">Order Notifications</Label>
                <Switch
                  id="orderNotifications"
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("orderNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reviewNotifications">Review Notifications</Label>
                <Switch
                  id="reviewNotifications"
                  checked={settings.reviewNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("reviewNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="lowStockNotifications">Low Stock Notifications</Label>
                <Switch
                  id="lowStockNotifications"
                  checked={settings.lowStockNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("lowStockNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                <Switch
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => handleSwitchChange("requireEmailVerification", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableTwoFactor">Enable Two-Factor Auth</Label>
                <Switch
                  id="enableTwoFactor"
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => handleSwitchChange("enableTwoFactor", checked)}
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  name="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Feature Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableWishlist">Enable Wishlist</Label>
                <Switch
                  id="enableWishlist"
                  checked={settings.enableWishlist}
                  onCheckedChange={(checked) => handleSwitchChange("enableWishlist", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableReviews">Enable Reviews</Label>
                <Switch
                  id="enableReviews"
                  checked={settings.enableReviews}
                  onCheckedChange={(checked) => handleSwitchChange("enableReviews", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableGuestCheckout">Enable Guest Checkout</Label>
                <Switch
                  id="enableGuestCheckout"
                  checked={settings.enableGuestCheckout}
                  onCheckedChange={(checked) => handleSwitchChange("enableGuestCheckout", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Shipping Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="freeShippingThreshold"
                  name="freeShippingThreshold"
                  type="number"
                  step="0.01"
                  value={settings.freeShippingThreshold}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="shippingCost">Standard Shipping Cost ($)</Label>
                <Input
                  id="shippingCost"
                  name="shippingCost"
                  type="number"
                  step="0.01"
                  value={settings.shippingCost}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="processingTime">Processing Time</Label>
                <Input
                  id="processingTime"
                  name="processingTime"
                  value={settings.processingTime}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button type="submit" className="bg-primary-500 hover:bg-primary-600" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
