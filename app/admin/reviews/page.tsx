"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Check, X, MessageSquare, ThumbsUp, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  customer_name: string
  customer_email: string
  rating: number
  title: string
  comment: string
  is_verified: boolean
  is_approved: boolean
  created_at: string
  products: {
    name: string
    image_url: string
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [reviews, searchTerm, selectedFilter])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          products (
            name,
            image_url
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setReviews(data || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = () => {
    let filtered = reviews

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.products.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    switch (selectedFilter) {
      case "approved":
        filtered = filtered.filter((review) => review.is_approved)
        break
      case "pending":
        filtered = filtered.filter((review) => !review.is_approved)
        break
      case "verified":
        filtered = filtered.filter((review) => review.is_verified)
        break
      case "high-rating":
        filtered = filtered.filter((review) => review.rating >= 4)
        break
      case "low-rating":
        filtered = filtered.filter((review) => review.rating <= 2)
        break
    }

    setFilteredReviews(filtered)
  }

  const updateReviewStatus = async (reviewId: string, field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ [field]: value })
        .eq("id", reviewId)

      if (error) throw error

      fetchReviews() // Refresh the list
      toast({
        title: "Review updated",
        description: `Review has been ${value ? "approved" : "rejected"}.`,
      })
    } catch (error) {
      console.error("Error updating review:", error)
      toast({
        title: "Error",
        description: "Failed to update review status.",
        variant: "destructive",
      })
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId)

      if (error) throw error

      fetchReviews() // Refresh the list
      toast({
        title: "Review deleted",
        description: "Review has been permanently deleted.",
      })
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      })
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
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
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Manage customer reviews and feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.filter((r) => r.is_approved).length}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.filter((r) => !r.is_approved).length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : "0"}
                  ★
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
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
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
              <option value="verified">Verified</option>
              <option value="high-rating">High Rating (4-5★)</option>
              <option value="low-rating">Low Rating (1-2★)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.products.image_url || "/placeholder.svg?height=60&width=60"}
                    alt={review.products.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.products.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {review.customer_name}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={review.is_approved ? "default" : "secondary"}>
                        {review.is_approved ? "Approved" : "Pending"}
                      </Badge>
                      {review.is_verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!review.is_approved && (
                    <Button
                      size="sm"
                      onClick={() => updateReviewStatus(review.id, "is_approved", true)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {review.is_approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateReviewStatus(review.id, "is_approved", false)}
                      className="text-yellow-600 border-yellow-600"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateReviewStatus(review.id, "is_verified", !review.is_verified)}
                    className={review.is_verified ? "text-green-600 border-green-600" : ""}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteReview(review.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {review.title && <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>}

              <p className="text-gray-600 leading-relaxed mb-4">{review.comment}</p>

              <div className="text-sm text-gray-500">
                <span>Customer: {review.customer_email}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
