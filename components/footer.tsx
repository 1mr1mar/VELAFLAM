import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <Image
                src="/images/velaflam-logo.png"
                alt="Velaflam Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                VELAFLAM
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Premium fire effects and decorative flames for your home and business. Transform your space with our
              curated collection of beautiful flame products.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">123 Flame Street, Fire City, FC 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">contact@velaflam.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-white hover:bg-primary-500 transition-all duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-white hover:bg-primary-500 transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-white hover:bg-primary-500 transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full text-gray-300 hover:text-white hover:bg-primary-500 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-300">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-300">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4 text-primary-300">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to get special offers and updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} VELAFLAM. All rights reserved. |
            <Link href="/privacy" className="hover:text-primary-300 transition-colors ml-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="hover:text-primary-300 transition-colors ml-1">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
