import { useState, useRef, useEffect } from 'react'
import { scenario } from './data/scenario'
import MessageBubble from './components/MessageBubble'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [currentTurn, setCurrentTurn] = useState(0)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    // Add User Message
    const userMsg = { id: Date.now(), text: inputText, isUser: true }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    // Simulate AI Delay and Respond
    setTimeout(() => {
      if (currentTurn < scenario.length) {
        const response = { ...scenario[currentTurn], isUser: false }
        setMessages(prev => [...prev, response])
        setCurrentTurn(prev => prev + 1)
      } else {
        // Optional: specific behavior when scenario ends, currently loops or stops?
        // Requirement says "MVP does not enforce 10 turn limit", but logically we run out of data.
        // We will just stop responding or repeat the last one, or add a generic system message.
        // For strict adherence to "linear scenario", we stop if out of data.
      }
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div className="app-container">
      <header className="chat-header">
        <h1>AI Chatbot</h1>
      </header>

      <div className="chat-area">
        <div className="messages-list">
          {messages.map((msg, index) => (
            <MessageBubble key={index} data={msg} isUser={msg.isUser} />
          ))}
          {isTyping && (
             <div className="message-row message-ai">
               <div className="message-bubble typing-indicator">
                 <span>.</span><span>.</span><span>.</span>
               </div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <form className="input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" disabled={!inputText.trim() || isTyping}>
          Send
        </button>
      </form>
    </div>
  )
}

export default App
