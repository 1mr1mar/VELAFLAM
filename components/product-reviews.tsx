"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, User, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  customer_name: string
  rating: number
  title: string
  comment: string
  created_at: string
}

interface ProductReviewsProps {
  productId: string
  productName: string
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    title: "",
    comment: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}&limit=3`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setReviews(data || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          ...formData,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit review")

      toast({
        title: "Review submitted!",
        description: "Thank you for your review. It will be published after approval.",
      })

      setFormData({
        customerName: "",
        customerEmail: "",
        rating: 5,
        title: "",
        comment: "",
      })
      setShowReviewForm(false)
      fetchReviews() // Refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary-700">Write Your Review</CardTitle>
            <p className="text-gray-600">Share your experience with {productName}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Your Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Your Email *</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Rating *</Label>
                <div className="mt-2">
                  {renderStars(formData.rating, true, (rating) => setFormData((prev) => ({ ...prev, rating })))}
                </div>
              </div>

              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <Label htmlFor="comment">Your Review *</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  rows={4}
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Tell us about your experience with this product..."
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={submitting} className="bg-primary-500 hover:bg-primary-600 text-white">
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.customer_name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {review.title && <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>}

                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {reviews.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-50 bg-transparent">
            View All Reviews
          </Button>
        </div>
      )}
    </div>
  )
}
