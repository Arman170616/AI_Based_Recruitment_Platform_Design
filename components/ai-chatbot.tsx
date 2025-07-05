"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Minimize2, Maximize2, Bot, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: string
  suggestions?: string[]
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI recruitment assistant. I can help you with candidate information, scoring details, and recruitment insights. How can I assist you today?",
      timestamp: "10:00 AM",
      suggestions: [
        "Show me top candidates for Frontend Developer",
        "What skills does Sarah Johnson have?",
        "Generate a report for recent hires",
        "How many candidates scored above 80%?",
      ],
    },
  ])

  const sendMessage = () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateBotResponse(message),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: generateSuggestions(message),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("sarah johnson")) {
      return "Sarah Johnson is a highly qualified candidate with a 92% match score. She has 6 years of experience and strong skills in React, TypeScript, Next.js, Node.js, and GraphQL. Her strengths include strong React expertise, full-stack capabilities, and leadership experience. Would you like me to show her detailed analysis or schedule an interview?"
    }

    if (lowerMessage.includes("top candidates") || lowerMessage.includes("best candidates")) {
      return "Based on our AI analysis, here are the top candidates:\n\n1. Sarah Johnson (92%) - Senior Frontend Developer\n2. Michael Chen (88%) - Senior Frontend Developer\n3. Emily Rodriguez (85%) - Senior Frontend Developer\n\nWould you like detailed information about any of these candidates?"
    }

    if (lowerMessage.includes("score") || lowerMessage.includes("scoring")) {
      return "Our AI scoring system evaluates candidates based on:\n\n• Skills match (weighted by job requirements)\n• Experience level and relevance\n• Education background\n• Additional qualifications\n\nScores above 70% are considered excellent matches. Currently, we have 3 candidates scoring above 80%. Would you like to see the detailed breakdown?"
    }

    if (lowerMessage.includes("report") || lowerMessage.includes("analytics")) {
      return "I can generate various reports for you:\n\n• Candidate scoring summary\n• Skills gap analysis\n• Hiring pipeline status\n• Interview scheduling report\n\nWhich type of report would you like me to prepare?"
    }

    return "I understand you're asking about recruitment data. I can help you with candidate information, scoring details, interview scheduling, and generating reports. Could you please be more specific about what you'd like to know?"
  }

  const generateSuggestions = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("sarah")) {
      return [
        "Schedule interview with Sarah Johnson",
        "Show Sarah's skill breakdown",
        "Compare Sarah with other candidates",
      ]
    }

    if (lowerMessage.includes("candidates")) {
      return ["Filter candidates by score range", "Show candidates by position", "Export candidate list"]
    }

    return ["Show interview schedule", "Generate hiring report", "Check candidate status updates"]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 border-yellow-200 shadow-xl z-50 ${isMinimized ? "h-16" : "h-96"}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bot className="w-5 h-5 mr-2 text-yellow-600" />
            AI Assistant
            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Online</Badge>
          </CardTitle>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)}>
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              ×
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === "user" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {msg.type === "bot" && <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.type === "user" ? "text-yellow-100" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>

                  {msg.suggestions && (
                    <div className="mt-3 space-y-1">
                      {msg.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start text-xs h-8"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about candidates, scores, or reports..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
