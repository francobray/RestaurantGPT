'use client'

import { useState, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-whatsapp-gray p-3 flex items-center space-x-2">
      <div className="flex-1 flex items-center bg-white rounded-full px-3 py-2 shadow-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          className="flex-1 bg-transparent focus:outline-none text-gray-800"
        />
        <button className="text-gray-500 p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        </button>
      </div>

      <button
        onClick={handleSend}
        className="bg-whatsapp-teal text-white w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-whatsapp-dark transition-colors"
      >
        {message.trim() ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v1a7 7 0 01-14 0v-1h2v1a5 5 0 0010 0v-1h2z" /></svg>
        )}
      </button>
    </div>
  )
} 