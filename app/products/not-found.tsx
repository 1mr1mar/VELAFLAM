import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, ShoppingBag } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            The product you're looking for doesn't exist or may have been moved.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              This could happen if:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-8">
              <li>• The product URL is incorrect</li>
              <li>• The product has been removed</li>
              <li>• There's a temporary issue with the page</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary-500 hover:bg-primary-600">
              <Link href="/shop">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse All Products
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 