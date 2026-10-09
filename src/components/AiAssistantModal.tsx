import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import { Language } from '../lib/i18n';
import { Sparkles, X, Send, Bot, User, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose, currentLanguage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Namaste! I am the RailSafe 2.0 AI Passenger Safety & Travel Assistant, powered by Gemini. How can I assist you today with railway safety, train journeys, station facilities, or passenger rights?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    'Emergency helpline numbers for train passengers',
    'How do I report harassment or unruly passengers?',
    'What should I do if I left a bag on the train?',
    'What are my rights if my train is delayed >3 hours?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await api.askAiAssistant(text, messages, currentLanguage);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI assistant error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `I am currently experiencing network delays. For urgent safety help, dial 139 (Railway Helpline) or 112 directly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl h-[620px] bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">RailSafe AI Safety & Travel Advisor</h3>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded font-mono">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Grounded in verified railway safety protocols</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notice banner */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <ShieldCheck size={13} /> Official Railway Helplines: 139 (All-in-one) • 112 (Police) • 182 (RPF)
          </span>
          <span className="text-slate-500 font-mono uppercase">{currentLanguage}</span>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'model' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/50 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={15} />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-slate-750 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className={`text-[9px] mt-1 text-right ${m.role === 'user' ? 'text-cyan-200' : 'text-slate-500'}`}>
                  {m.timestamp}
                </div>
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-900 border border-cyan-700/50 text-cyan-300 flex items-center justify-center shrink-0 mt-1">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-indigo-400 bg-slate-800/60 p-3 rounded-2xl w-fit border border-slate-800">
              <Bot size={15} className="animate-spin" />
              <span>Analyzing railway guidelines & formulating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2 border-t border-slate-800/60 flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700 text-[10px] cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about train safety, passenger rights, station amenities..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white cursor-pointer transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
