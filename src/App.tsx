import { useState, useRef, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'

export interface Message {
  text?: string
  sender: 'user' | 'agent'
  id: string | number
  type: 'text' | 'image'
  imageUrl?: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hola 👋, soy el Asistente de Restaurantes. Estoy aquí para ayudarte a analizar la presencia online de cualquier restaurante.', sender: 'agent', id: Date.now(), type: 'text', timestamp: new Date() },
    { text: 'Por favor, dime el nombre del restaurante y la zona donde se encuentra. Por Ejemplo: CRAFT, Coral Gables, Miami', sender: 'agent', id: Date.now() + 1, type: 'text', timestamp: new Date() }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [pendingPlaceId, setPendingPlaceId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      type: 'text',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const lowerText = text.toLowerCase().trim()
      const isAffirmative = ['si', 'sí', 'dale', 'ok', 'quiero', 'me gustaría', 'realiza el análisis', 'analizar', 'agenda', 'agendar'].some(word => lowerText.includes(word))

      if (pendingAction === 'schedule_call') {
        if (isAffirmative) {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wantsToSchedule: true }),
          })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error || 'Error en el servidor')

          const linkMessage: Message = { text: data.response, sender: 'agent', id: Date.now() + 1, type: 'text', timestamp: new Date() }
          setMessages(prev => [...prev, linkMessage])
        } else {
          const cancelMessage: Message = {
            text: 'De acuerdo. Si cambias de opinión, aquí estoy para ayudar.',
            sender: 'agent',
            id: Date.now() + 1,
            type: 'text',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, cancelMessage])
        }
        setPendingAction(null)
      } else if (pendingAction === 'get_recommendations') {
        if (isAffirmative) {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ getRecommendations: true }),
          })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error || 'Error en el servidor')
          
          if (data.nextAction) {
            setPendingAction(data.nextAction)
          } else {
            setPendingAction(null)
          }
          
          if (data.responses && Array.isArray(data.responses)) {
            let delay = 0
            data.responses.forEach((responseItem: any, index: number) => {
              setTimeout(() => {
                let agentMessage: Message
                if (typeof responseItem === 'string') {
                  agentMessage = { text: responseItem, sender: 'agent', id: Date.now() + index, type: 'text', timestamp: new Date() }
                } else if (responseItem.type === 'image') {
                  agentMessage = { imageUrl: responseItem.url, sender: 'agent', id: Date.now() + index, type: 'image', timestamp: new Date() }
                } else {
                  // Skip unknown response types
                  return
                }
                setMessages(prev => [...prev, agentMessage])
              }, delay)
              delay += 800
            })
          }
        } else {
          const cancelMessage: Message = {
            id: Date.now() + 1,
            text: 'Entendido. Si necesitas algo más, no dudes en preguntar.',
            sender: 'agent',
            type: 'text',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, cancelMessage])
          setPendingAction(null)
        }
      } else if (pendingPlaceId) {
        if (isAffirmative) {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ placeId: pendingPlaceId }),
          })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error || 'Error en el servidor')

          if (data.nextAction) {
            setPendingAction(data.nextAction)
          }
          
          if (data.responses && Array.isArray(data.responses)) {
            let delay = 0
            data.responses.forEach((responseItem: any, index: number) => {
              setTimeout(() => {
                let agentMessage: Message
                if (typeof responseItem === 'string') {
                  agentMessage = { text: responseItem, sender: 'agent', id: Date.now() + index, type: 'text', timestamp: new Date() }
                } else if (responseItem.type === 'image') {
                  agentMessage = { imageUrl: responseItem.url, sender: 'agent', id: Date.now() + index, type: 'image', timestamp: new Date() }
                } else {
                  return
                }
                setMessages(prev => [...prev, agentMessage])
              }, delay)
              delay += 800
            })
          }
        } else {
          // User wants to search for something else
          const cancelMessage: Message = {
            id: Date.now() + 1,
            text: 'Entendido. ¿Qué otro restaurante quieres que busque?',
            sender: 'agent',
            type: 'text',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, cancelMessage])
        }
        setPendingPlaceId(null) // Reset context for next conversation
      } else {
        // New search
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error en el servidor')

        // The backend now sends placeId along with responses
        if (data.placeId) {
          setPendingPlaceId(data.placeId)
        }

        if (data.responses && Array.isArray(data.responses)) {
          let delay = 0
          data.responses.forEach((responseItem: any, index: number) => {
            setTimeout(() => {
              let agentMessage: Message
              if (typeof responseItem === 'string') {
                agentMessage = { text: responseItem, sender: 'agent', id: Date.now() + index, type: 'text', timestamp: new Date() }
              } else if (responseItem.type === 'image') {
                agentMessage = { imageUrl: responseItem.url, sender: 'agent', id: Date.now() + index, type: 'image', timestamp: new Date() }
              } else {
                return
              }
              setMessages(prev => [...prev, agentMessage])
            }, delay)
            delay += 800
          })
        }
      }
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'No se pudo conectar con el servidor.'
      const errorAgentMessage: Message = {
        id: Date.now(),
        text: `Error: ${errorMessage}`,
        sender: 'agent',
        type: 'text',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorAgentMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-screen bg-whatsapp-gray flex items-center justify-center p-0 md:p-4">
      <div className="w-full h-screen md:h-[90vh] md:max-w-md bg-white rounded-none md:rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 text-gray-800 p-3 flex items-center justify-between shadow-sm border-b">
          <div className="flex items-center">
            <button className="mr-2 p-1 rounded-full hover:bg-gray-200">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="w-10 h-10 bg-whatsapp-dark rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">🍽️</span>
            </div>
            <div>
              <h1 className="font-semibold">Restaurant GPT</h1>
              <p className="text-sm text-gray-500">online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <ChatWindow messages={messages} isTyping={isTyping} />

        {/* Message Input */}
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  )
}