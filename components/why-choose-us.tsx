import { Shield, Truck, Award, HeartHandshake, Flame, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description:
        "All our flame products are crafted with the highest quality materials and undergo rigorous safety testing.",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Enjoy free shipping on all orders over $50. Fast and reliable delivery to your doorstep.",
    },
    {
      icon: Award,
      title: "Expert Craftsmanship",
      description:
        "Each piece is carefully designed by our expert artisans with years of experience in flame artistry.",
    },
    {
      icon: HeartHandshake,
      title: "Customer Satisfaction",
      description: "We're committed to your satisfaction with 24/7 customer support and hassle-free returns.",
    },
    {
      icon: Flame,
      title: "Authentic Flames",
      description: "Experience the mesmerizing beauty of real flame effects with our innovative and safe designs.",
    },
    {
      icon: Clock,
      title: "1-Year Warranty",
      description: "All products come with a comprehensive 1-year warranty for your peace of mind.",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              VELAFLAM
            </span>
            ?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            We're passionate about bringing the beauty and warmth of flames into your life. Here's what makes us the
            trusted choice for flame enthusiasts worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-primary-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-gray-600 group-hover:text-primary-600 transition-colors duration-300">
                Happy Customers
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <div className="text-gray-600 group-hover:text-primary-600 transition-colors duration-300">
                Unique Products
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                5★
              </div>
              <div className="text-gray-600 group-hover:text-primary-600 transition-colors duration-300">
                Average Rating
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600 group-hover:text-primary-600 transition-colors duration-300">
                Customer Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
