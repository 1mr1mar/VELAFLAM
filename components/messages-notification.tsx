"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Mail, 
  Bell, 
  X, 
  User, 
  Calendar,
  Loader2,
  MessageSquare,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export default function MessagesNotification() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    
    // Close popup when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    // Refresh messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      clearInterval(interval)
    }
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/contact-messages")
      if (response.ok) {
        const data = await response.json()
        const recentMessages = data.messages?.slice(0, 5) || [] // Get latest 5 messages
        setMessages(recentMessages)
        setUnreadCount(recentMessages.length)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchMessages()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + "..."
  }

  return (
    <div className="relative" ref={popupRef}>
      {/* Notification Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-primary-600' : 'text-gray-600'}`} />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Popup */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
                             <div className="flex items-center justify-between">
                 <CardTitle className="text-lg font-semibold flex items-center gap-2">
                   <MessageSquare className="h-5 w-5 text-primary-500" />
                   Recent Messages
                 </CardTitle>
                 <div className="flex items-center gap-1">
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleRefresh}
                     disabled={loading}
                     className="h-6 w-6 p-0"
                   >
                     <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                   </Button>
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setIsOpen(false)}
                     className="h-6 w-6 p-0"
                   >
                     <X className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="font-medium text-sm text-gray-900">
                            {message.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(message.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {message.email}
                      </p>
                      <p className="text-sm text-gray-700">
                        {truncateMessage(message.message, 80)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {messages.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/admin/messages">
                      View All Messages
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 