"use client"

import { useState } from "react"
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { authUtils } from "@/lib/auth"

const AskAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your **AI farming assistant**. How can I help you optimize your farm today? 🌱\n\nYou can ask me about:\n- Crop recommendations\n- Soil health analysis\n- Weather impact\n- Market insights\n- Pest control strategies",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: inputMessage,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setLoading(true)

    try {
      const token = authUtils.getToken()

      const res = await fetch("/api/v1/protected/ai/explain", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          soil: { pH: 6.5, moisture: 20 },
          weather: { rainfall: 120, temperature: 28 },
          market: { demandIndex: 75 },
          crops: [
            { name: "Rice", revenue: 50000 },
            { name: "Maize", revenue: 42000 },
            { name: "Pulses", revenue: 38000 },
          ],
          prompt: inputMessage,
        }),
      })

      if (!res.ok) throw new Error("Failed to fetch AI response")

      const data = await res.json()

      const aiResponse = {
        id: messages.length + 2,
        type: "bot" as const,
        content: data.explanation || "Sorry, I couldn't generate a response.",
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      console.error(err)
      const errorResponse = {
        id: messages.length + 2,
        type: "bot" as const,
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen md:p-6">
        <div className="md:max-w-4xl mx-auto">
          {/* Main Chat Container */}
          <div className="bg-white/70 backdrop-blur-xl md:rounded-2xl md:shadow-2xl md:border border-white/20 h-[85vh] flex flex-col min-h-screen overflow-hidden">
            {/* Header */}
            <div className="p-2 md:p-6 bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-8 md:w-14 h-8 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <MessageCircle className="text-white w-5 md:w-7 h-5 md:h-7" />
                </div>
                <div className="flex-1">
                  <h1 className="text-base sm:text-xl md:text-2xl font-bold mb-1 flex items-center gap-2">
                    AI Farming Assistant
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </h1>
                  <p className="text-emerald-100 text-xs sm:text-sm">
                    Get intelligent insights for sustainable farming
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-4 duration-300`}
                >
                  {message.type === "bot" && (
                    <div className="w-6 md:w-10 h-6 md:h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white flex-shrink-0">
                      <Bot className="text-white w-3 md:w-5 h-3 md:h-5" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs md:max-w-lg xl:max-w-2xl px-3 md:px-5 py-1 md:py-3 rounded-2xl shadow-lg border transition-all duration-200 hover:shadow-xl ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/20 ml-auto"
                        : "bg-white/80 backdrop-blur-sm text-gray-800 border-gray-200/50"
                    }`}
                  >
                    {message.type === "bot" ? (
                      <div className="inline-block prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 text-xs md:text-sm">
                        <ReactMarkdown 
                          components={{
                            h1: ({children}) => <h1 className="text-base md:text-lg font-bold mb-2 text-emerald-700">{children}</h1>,
                            h2: ({children}) => <h2 className="text-sm md:text-base font-semibold mb-2 text-emerald-600">{children}</h2>,
                            h3: ({children}) => <h3 className="text-xs md:text-sm font-semibold mb-1 text-emerald-600">{children}</h3>,
                            ul: ({children}) => <ul className="list-disc ml-4 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal ml-4 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-gray-700">{children}</li>,
                            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-emerald-700">{children}</code>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-emerald-300 pl-3 italic text-gray-600">{children}</blockquote>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm leading-relaxed">{message.content}</p>
                    )}
                  </div>

                  {message.type === "user" && (
                    <div className="w-6 md:w-10 h-6 md:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg border-2 border-white flex-shrink-0">
                      <User className="text-white w-3 md:w-5 h-3 md:h-5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 justify-start animate-in slide-in-from-bottom-4 duration-300">
                  <div className="w-6 md:w-10 h-6 md:h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white flex-shrink-0">
                    <Bot className="text-white w-3 md:w-5 h-3 md:h-5" />
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-xs md:text-sm font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-2 md:p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleSendMessage()}
                    placeholder="Ask about crop rotation, soil health, pest control, market trends..."
                    className="w-full text-xs md:text-sm px-1 md:px-5 py-1 md:py-4 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 shadow-sm text-gray-800 placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="px-2 md:px-6 py-1 md:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center min-w-8 md:min-w-[3.5rem]"
                >
                  <Send className="w-2 md:w-5 h-2 md:h-5" />
                </button>
              </div>
              
              {/* Quick suggestions */}
              <div className="mt-2 md:mt-4 flex flex-wrap gap-2">
                {[
                  "🌾 Best crops for monsoon",
                  "🧪 Soil pH optimization", 
                  "🐛 Pest control methods",
                  "📈 Market price trends"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputMessage(suggestion.replace(/^🌾|🧪|🐛|📈 /, ''))}
                    disabled={loading}
                    className="px-1 md:px-3 py-1 md:py-2 text-xs bg-emerald-50 text-emerald-700 rounded-xl md:rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors duration-200 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskAI
