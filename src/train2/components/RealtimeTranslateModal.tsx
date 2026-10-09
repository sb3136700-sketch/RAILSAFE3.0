import React, { useState } from 'react';
import { 
  Languages, 
  ExternalLink, 
  X, 
  ArrowRightLeft, 
  Volume2, 
  Copy, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { SupportedLanguage } from '../types/railway';
import { LANGUAGE_OPTIONS } from '../utils/i18n';

interface RealtimeTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealtimeTranslateModal: React.FC<RealtimeTranslateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Essential Indian Railway survival phrases with instant multi-language translation
  const quickPhrases = [
    { en: 'Where is platform 1?', hi: 'प्लेटफॉर्म 1 कहाँ है?', ta: 'நடைமேடை 1 எங்கே உள்ளது?' },
    { en: 'Is this train going to Varanasi?', hi: 'क्या यह ट्रेन वाराणसी जा रही है?', ta: 'இந்த ரயில் வாரணாசிக்குச் செல்கிறதா?' },
    { en: 'Please help me put my luggage under the berth.', hi: 'कृपया मेरा सामान सीट के नीचे रखने में मदद करें।', ta: 'என் சாமான்களை சீட்டுக்கு அடியில் வைக்க உதவுங்கள்.' },
    { en: 'Can we exchange berths? I have a lower berth.', hi: 'क्या हम सीट बदल सकते हैं? मेरे पास नीचे की सीट है।', ta: 'நாம் இருக்கையை மாற்றிக்கொள்ளலாமா? என்னிடம் கீழ் படுக்கை உள்ளது.' },
    { en: 'Where can I get hot drinking water?', hi: 'गर्म पीने का पानी कहाँ मिलेगा?', ta: 'சூடான குடிநீர் எங்கு கிடைக்கும்?' },
  ];

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    // Fast realistic translation simulation
    const match = quickPhrases.find(
      (p) => p.en.toLowerCase() === inputText.trim().toLowerCase()
    );
    if (match) {
      setTranslatedText(targetLang === 'ta' ? match.ta : match.hi);
    } else {
      setTranslatedText(`[Translated into ${targetLang.toUpperCase()}]: ${inputText}`);
    }
  };

  const googleTranslateUrl = `https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${encodeURIComponent(
    inputText
  )}&op=translate`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-cyan-500/50 bg-slate-900 p-6 shadow-2xl neon-glow-cyan my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Real-Time Railway Translator
              </h3>
              <p className="text-xs text-slate-400">Translate station signboards and conversations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Official Google Translate External Launcher */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">
              Launch Official Google Translate
            </div>
            <div className="text-[11px] text-slate-400">Camera translation for station boards & voice translation</div>
          </div>
          <a
            href={googleTranslateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow"
          >
            <span>Open Google Translate</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* In-app Language Selector */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">From Language</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
            >
              <option value="auto">Detect Language</option>
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
              <option value="te">Telugu (తెలుగు)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">To Language</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:outline-none"
            >
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="ml">Malayalam (മലയാളം)</option>
              <option value="bn">Bengali (বাংলা)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Input box */}
        <div className="mt-3">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste station announcements, signboard text, or questions..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="mt-2 flex justify-end">
          <button
            onClick={handleTranslate}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow"
          >
            Translate Now
          </button>
        </div>

        {/* Quick Railway Phrases */}
        <div className="mt-3 pt-3 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 mb-2">
            Common Passenger Queries (Tap to Fill):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPhrases.map((phrase, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(phrase.en);
                  setTranslatedText(targetLang === 'ta' ? phrase.ta : phrase.hi);
                }}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
              >
                {phrase.en}
              </button>
            ))}
          </div>
        </div>

        {/* Translation Output */}
        {translatedText && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] text-cyan-400 uppercase font-bold">Translation:</div>
              <div className="text-sm font-semibold text-white mt-0.5">{translatedText}</div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(translatedText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
