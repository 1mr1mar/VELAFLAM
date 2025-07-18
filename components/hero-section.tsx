import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 py-20 lg:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary-600" />
              <span className="text-primary-600 font-semibold">Premium Flame Collection</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Ignite Your Space with
              <span className="block bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                VELAFLAM
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover our curated collection of premium candles, torches, lamps, and fire-themed decorative pieces.
              Transform your space with the mesmerizing beauty of authentic flames.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-500 text-primary-500 hover:bg-primary-50 px-8 py-3 bg-transparent"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Unique Products</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-gray-600">5-Star Reviews</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/placeholder.svg?height=600&width=500&text=Beautiful+Flame+Collection"
                alt="Beautiful flame collection"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>

            {/* Floating logo element */}
            <div className="absolute -top-6 -left-6 z-20">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Image
                  src="/images/velaflam-logo.png"
                  alt="Velaflam"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 z-20">
              <div className="bg-primary-500 rounded-full p-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
