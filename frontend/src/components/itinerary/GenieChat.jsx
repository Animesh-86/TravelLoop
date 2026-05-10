import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

export default function GenieChat({ tripId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: tripId ? "Hi! I'm your TravelLoop Genie. What do you need help with on this trip?" : "Hi! I'm your TravelLoop Genie. How can I help you with the platform or travel tips today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use absolute-looking paths to ensure proxy catches them
      const endpoint = tripId 
        ? `/api/ai/trips/${tripId}/chat` 
        : `/api/ai/chat`;
        
      const response = await api.post(endpoint, { message: userMessage.text });
      const botMessage = { id: Date.now(), text: response.data.response, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg = { id: Date.now(), text: "Sorry, my magic is currently unavailable. Try again later!", isBot: true, isError: true };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200/50 flex flex-col h-[500px]"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-display font-bold">TravelLoop Genie</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {messages.length === 1 && tripId && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button 
                    onClick={() => setInput("Summarize my trip itinerary and packing progress.")}
                    className="p-3 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:border-primary hover:text-primary transition-all text-left flex flex-col gap-1 shadow-sm"
                  >
                    <span className="text-base">📋</span>
                    Summarize Trip
                  </button>
                  <button 
                    onClick={() => setInput("Tell me about the main destination city of this trip.")}
                    className="p-3 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:border-primary hover:text-primary transition-all text-left flex flex-col gap-1 shadow-sm"
                  >
                    <span className="text-base">🏙️</span>
                    About City
                  </button>
                </div>
              )}

              {messages.length === 1 && !tripId && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button 
                    onClick={() => setInput("How do I create a new trip and track my budget?")}
                    className="p-3 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:border-primary hover:text-primary transition-all text-left flex flex-col gap-1 shadow-sm"
                  >
                    <span className="text-base">❓</span>
                    How to use?
                  </button>
                  <button 
                    onClick={() => setInput("Tell me some travel tips for exploring Indian cities.")}
                    className="p-3 text-[11px] font-bold text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:border-primary hover:text-primary transition-all text-left flex flex-col gap-1 shadow-sm"
                  >
                    <span className="text-base">💡</span>
                    Travel Tips
                  </button>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.isBot ? (msg.isError ? 'bg-red-50 text-red-700' : 'bg-white text-neutral-800 border border-neutral-200') : 'bg-indigo-500 text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-neutral-200 rounded-2xl p-3 flex items-center gap-2 text-neutral-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask for recommendations..."
                className="flex-1 bg-neutral-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
