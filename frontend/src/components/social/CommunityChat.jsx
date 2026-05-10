import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

export default function CommunityChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useAuthStore(s => s.user);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/social/messages');
      setMessages(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    try {
      setIsSending(true);
      await api.post('/social/messages', { content: input });
      setInput('');
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
        {!isOpen && messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, x: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col h-[500px]"
          >
            <div className="bg-primary p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-display font-bold">Community Chat</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <span className="text-xl">&times;</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {isLoading && messages.length === 0 ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-neutral-400 text-sm">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.user.userId === user?.userId ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1 mb-1 px-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            {msg.user.fullName}
                        </span>
                    </div>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                      msg.user.userId === user?.userId 
                        ? 'bg-primary text-white rounded-tr-none shadow-md' 
                        : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-neutral-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="p-2 rounded-xl bg-primary text-white disabled:opacity-50 hover:bg-primary-dark transition-colors shadow-sm"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
