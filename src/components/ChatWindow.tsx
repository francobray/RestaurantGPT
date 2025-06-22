'use client'

import { useEffect, useRef } from 'react'
import { Message } from '../App'

interface ChatWindowProps {
  messages: Message[]
  isTyping: boolean
}

const urlRegex = /(https?:\/\/[^\s]+)/g;

export default function ChatWindow({ messages, isTyping }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex-grow overflow-y-auto chat-scrollbar bg-whatsapp-gray p-4">
      <div className="space-y-3">
        {messages.map((message) => {
          if (message.type === 'image' && message.imageUrl) {
            return (
              <div
                key={message.id}
                className={`flex mb-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg p-1 max-w-lg ${
                    message.sender === 'user'
                      ? 'bg-wa-message-sent-background-light dark:bg-wa-message-sent-background-dark'
                      : 'bg-wa-message-received-background-light dark:bg-wa-message-received-background-dark'
                  }`}
                >
                  <img src={message.imageUrl} alt="Ranking de mapa" className="rounded-md" />
                </div>
              </div>
            );
          }

          if (message.type === 'text' && message.text) {
            const messageParts = message.text.split(urlRegex);
            return (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-lg shadow-sm relative ${
                    message.sender === 'user'
                      ? 'bg-whatsapp-light text-gray-800 rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div
                    className={`break-words whitespace-pre-line ${
                      message.sender === 'user'
                        ? 'text-wa-message-sent-text dark:text-wa-dark-message-sent-text'
                        : 'text-wa-message-received-text dark:text-wa-dark-message-received-text'
                    }`}
                  >
                    {messageParts.map((part, i) =>
                      urlRegex.test(part) ? (
                        <a href={part} key={i} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">
                          {part}
                        </a>
                      ) : (
                        part
                      )
                    )}
                  </div>
                  <div
                    className={`text-xs mt-1 text-right ${
                      message.sender === 'user' ? 'mr-2' : 'ml-2'
                    }`}
                  >
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                </div>
              </div>
            )
          }
          return null;
        })}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-md px-3 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
} 