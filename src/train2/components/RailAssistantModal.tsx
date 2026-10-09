import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface RailAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrain: string;
  currentStation: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const RailAssistantModal: React.FC<RailAssistantModalProps> = ({
  isOpen,
  onClose,
  currentTrain,
  currentStation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Namaste! I am your Rail Travel Assistant for ${currentTrain}. Ask me anything about station food specialties, Tatkal rules, luggage allowances, coach facilities, or emergency procedures.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'What should I eat at upcoming stations?',
    'What are Tatkal booking rules and timings?',
    'Can I claim refund if train is delayed?',
    'What is the free luggage weight limit?',
    'Can TTE re-allocate my seat if I am late?',
  ];

  const handleSend = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/rail-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          currentTrain,
          currentStation,
        }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.answer || 'I am ready to help you with any Indian Railways inquiry.',
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Local fallback
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'For 24x7 Indian Railways assistance, dial 139 (RailMadad). For security assistance on board, dial 182 (RPF). Always carry valid photo ID with your confirmed e-ticket.',
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="flex flex-col h-[600px] w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Rail Travel Assistant</h3>
              <p className="text-[11px] text-slate-400">Instant answers for Indian Railways passengers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick query chips */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/50 flex gap-2 overflow-x-auto scrollbar-none text-[11px]">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors border border-slate-700/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => {
            const isAi = m.sender === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isAi
                      ? 'bg-slate-800 text-slate-200 border border-slate-700/50'
                      : 'bg-amber-500 text-slate-950 font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                {!isAi && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
              <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
              <span>Checking Indian Railways intelligence...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything (e.g. food at Kanpur, Tatkal rules)..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-40 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
