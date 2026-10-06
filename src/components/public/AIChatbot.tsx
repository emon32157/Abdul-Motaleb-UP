import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChatMessage } from '../../types';
import { sendChatMessageStream } from '../../services/aiChat';
import {
  Sparkles,
  Send,
  X,
  Minus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User,
  Mail,
  MessageCircle,
  ExternalLink,
  Terminal
} from 'lucide-react';

export const AIChatbot: React.FC = () => {
  const {
    aiSettings,
    aiKnowledgeBase,
    siteSettings,
    skills,
    services,
    projects,
    experience,
    recordChatInteraction
  } = useData();

  const { lang } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialGreeting =
    lang === 'bn'
      ? aiSettings.welcomeMessageBn || aiSettings.welcomeMessage
      : aiSettings.welcomeMessage;

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Dedicated container ref for strictly scoped scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Scoped internal scroll that NEVER shifts the header or parent page
  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  // Scroll to bottom only when messages change or panel opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [isOpen, isMinimized, messages, scrollToBottom]);

  // Lock background body scroll on mobile screens when chat is open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const originalOverflow = document.body.style.overflow;
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, isMinimized]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  // If disabled in admin settings, do not render
  if (!aiSettings.enabled) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isGenerating) return;

    setErrorMessage(null);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMsgId = 'msg-ai-' + (Date.now() + 1);
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      streaming: true
    };

    const newMessagesList = [...messages, userMsg, assistantMsg];
    setMessages(newMessagesList);
    setIsGenerating(true);

    if (aiSettings.enableAnalytics) {
      recordChatInteraction(text);
    }

    abortControllerRef.current = new AbortController();

    const siteContext = {
      siteTitle: siteSettings.siteTitle,
      email: siteSettings.email,
      phone: siteSettings.phone,
      whatsapp: siteSettings.whatsapp,
      location: siteSettings.location,
      skillsSummary: skills
        .filter((s) => s.active)
        .map((s) => `${s.name} (${s.percentage}%)`)
        .join(', '),
      servicesSummary: services
        .filter((s) => s.active)
        .map((s) => s.title)
        .join(', '),
      projectsSummary: projects
        .filter((p) => p.active)
        .map((p) => `${p.title}: ${p.shortDesc}`)
        .join(' | '),
      experienceSummary: experience
        .filter((e) => e.active)
        .map((e) => `${e.year}: ${e.position}`)
        .join(', ')
    };

    try {
      const fullReply = await sendChatMessageStream({
        messages: [...messages, userMsg],
        aiSettings,
        knowledgeBase: aiKnowledgeBase,
        siteContext,
        onChunk: (accumulated) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, text: accumulated } : m))
          );
          scrollToBottom(false);
        },
        signal: abortControllerRef.current.signal
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                text:
                  fullReply ||
                  m.text ||
                  "I'm here to assist you with information about Abdul Motaleb. How can I help you today?",
                streaming: false
              }
            : m
        )
      );
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Connection interrupted. Please retry.');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                text:
                  m.text ||
                  '⚠️ I encountered a temporary connection issue. Please feel free to retry or contact Abdul directly via Email or WhatsApp.',
                streaming: false
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear this chat conversation?')) {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setMessages([
        {
          id: 'welcome-' + Date.now(),
          sender: 'assistant',
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setErrorMessage(null);
    }
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const renderFormattedText = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const rawCode = part.slice(3, -3);
        const firstLineEnd = rawCode.indexOf('\n');
        const langTag = firstLineEnd > 0 ? rawCode.slice(0, firstLineEnd).trim() : '';
        const code = firstLineEnd > 0 ? rawCode.slice(firstLineEnd + 1) : rawCode;

        return (
          <div
            key={index}
            className="my-2.5 rounded-xl bg-[#040711] border border-cyan-500/25 overflow-hidden font-mono text-[11px] text-cyan-300 shadow-md"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#080e1e] border-b border-cyan-500/20 text-slate-400 text-[10px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>{langTag || 'code'}</span>
              </span>
              <button
                onClick={() => copyCode(code, index)}
                className="hover:text-cyan-300 flex items-center gap-1 text-[10px] transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedCodeIdx === index ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      const lines = part.split('\n');
      return (
        <span key={index}>
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
            const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            return (
              <span key={lIdx} className={`block ${isBullet ? 'pl-2 text-slate-200' : ''}`}>
                <span dangerouslySetInnerHTML={{ __html: processedLine }} />
              </span>
            );
          })}
        </span>
      );
    });
  };

  const showsContactCTA = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes('contact') ||
      lower.includes('hire') ||
      lower.includes('email') ||
      lower.includes('whatsapp') ||
      lower.includes('যোগাযোগ') ||
      lower.includes('হায়ার')
    );
  };

  // Dimensions: Optimized for both Desktop and Android/iOS Mobile Viewports (100dvh)
  const isLeft = aiSettings.position === 'bottom-left';

  const sizeClasses =
    aiSettings.windowSize === 'compact'
      ? 'lg:w-[380px] lg:h-[540px] lg:max-h-[80vh]'
      : aiSettings.windowSize === 'large'
      ? 'lg:w-[480px] lg:h-[680px] lg:max-h-[90vh]'
      : 'lg:w-[420px] lg:h-[620px] lg:max-h-[85vh]';

  // Floating Launcher Position
  const posClassesLauncher = isLeft
    ? 'bottom-20 sm:bottom-22 lg:bottom-10 left-4 sm:left-6'
    : 'bottom-20 sm:bottom-22 lg:bottom-10 right-4 sm:right-6';

  // Window Layout Constraints:
  // Mobile uses inset-x-0 bottom-0 with h-[88dvh] max-h-[88dvh]
  // On desktop it sits nicely anchored to bottom-left/bottom-right
  const posClassesWindow = isMinimized
    ? isLeft
      ? 'bottom-20 sm:bottom-22 lg:bottom-10 left-4 sm:left-6 w-72 h-14'
      : 'bottom-20 sm:bottom-22 lg:bottom-10 right-4 sm:right-6 w-72 h-14'
    : isLeft
    ? `inset-x-0 bottom-0 sm:inset-x-auto sm:left-4 sm:bottom-4 lg:bottom-10 lg:left-6 w-full sm:w-[400px] ${sizeClasses} h-[88dvh] max-h-[88dvh] sm:h-[82dvh] sm:max-h-[82dvh] rounded-t-2xl sm:rounded-2xl`
    : `inset-x-0 bottom-0 sm:inset-x-auto sm:right-4 sm:bottom-4 lg:bottom-10 lg:right-6 w-full sm:w-[400px] ${sizeClasses} h-[88dvh] max-h-[88dvh] sm:h-[82dvh] sm:max-h-[82dvh] rounded-t-2xl sm:rounded-2xl`;

  const themeBorder =
    aiSettings.theme === 'neon-green'
      ? 'border-emerald-500/40 shadow-[0_12px_50px_rgba(16,185,129,0.25)]'
      : aiSettings.theme === 'matrix'
      ? 'border-green-500/50 shadow-[0_12px_50px_rgba(34,197,94,0.3)]'
      : aiSettings.theme === 'cyan'
      ? 'border-cyan-400/50 shadow-[0_12px_50px_rgba(0,242,254,0.35)]'
      : 'border-cyan-500/30 shadow-[0_12px_50px_rgba(0,0,0,0.85)]';

  return (
    <>
      {/* Floating Action Launcher Button */}
      {!isOpen && (
        <div className={`fixed ${posClassesLauncher} z-40`}>
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-gradient-to-r from-[#0a1224] via-[#09152e] to-[#081838] border-2 border-cyan-400 text-cyan-300 font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="Open Abdul AI Assistant"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent font-extrabold">
              ✨ {aiSettings.botName || 'Abdul AI'}
            </span>
          </button>
        </div>
      )}

      {/* Chat Window: Strict Flex Column with Frozen Header & Footer */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col overflow-hidden ${posClassesWindow} border ${themeBorder} bg-[#070c1a]/98 backdrop-blur-2xl font-sans`}
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Header Bar: ALWAYS FROZEN AT TOP (shrink-0, sticky top-0, z-30) */}
          <div className="shrink-0 sticky top-0 z-30 p-3.5 sm:p-4 bg-[#091022] border-b border-cyan-500/25 flex items-center justify-between select-none shadow-md">
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl border border-cyan-400/60 bg-cyan-950/40 p-0.5 flex items-center justify-center overflow-hidden shadow-[0_0_12px_rgba(0,242,254,0.3)]">
                  <img
                    src={aiSettings.botAvatar || 'https://iili.io/Bev2e8G.jpg'}
                    alt="AI Avatar"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#070c1a] animate-pulse" />
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 truncate">
                  <span className="truncate">{aiSettings.botName || 'Abdul AI Assistant'}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                    AI
                  </span>
                </h3>
                <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span>Online</span>
                  <span>•</span>
                  <span>Cyber Verified</span>
                </p>
              </div>
            </div>

            {/* Window Controls: Always Visible in Header */}
            <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-2">
              <button
                onClick={handleClear}
                title="Clear Conversation"
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                aria-label="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                aria-label="Minimize Chat"
              >
                {isMinimized ? <Sparkles className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4 text-slate-300 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Expanded Chat Content */}
          {!isMinimized && (
            <>
              {/* Message Feed Area: ONLY THIS SECTION SCROLLS (flex-1 min-h-0 overflow-y-auto) */}
              <div
                ref={messagesContainerRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-4 text-xs scroll-smooth"
              >
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const showContact = !isUser && showsContactCTA(msg.text);

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} group`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[80%] flex flex-col ${
                          isUser ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                            isUser
                              ? 'bg-cyan-500 text-black font-medium rounded-tr-none shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                              : 'bg-[#0d162d]/90 border border-cyan-500/20 text-slate-200 rounded-tl-none shadow-md backdrop-blur-md'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          ) : (
                            <div>
                              {msg.text ? (
                                <>
                                  {renderFormattedText(msg.text)}
                                  {msg.streaming && (
                                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 animate-pulse align-middle" />
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center gap-2 py-1 px-1 text-slate-400">
                                  <span className="text-[11px] font-mono text-cyan-300">
                                    Abdul AI is typing
                                  </span>
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                                    style={{ animationDelay: '0ms' }}
                                  />
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                                    style={{ animationDelay: '150ms' }}
                                  />
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                                    style={{ animationDelay: '300ms' }}
                                  />
                                </div>
                              )}

                              {/* Interactive Contact Buttons */}
                              {showContact && !msg.streaming && (
                                <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex flex-wrap gap-1.5">
                                  <a
                                    href="#contact"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono transition-colors"
                                  >
                                    <Mail className="w-3 h-3" />
                                    <span>{aiSettings.contactCtaText || 'Contact Me'}</span>
                                  </a>
                                  {siteSettings.whatsapp && (
                                    <a
                                      href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono transition-colors"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      <span>{aiSettings.whatsappCtaText || 'WhatsApp'}</span>
                                    </a>
                                  )}
                                  {siteSettings.email && (
                                    <a
                                      href={`mailto:${siteSettings.email}`}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Email</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Footer Info: Time & Copy */}
                        <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500 font-mono">
                          <span>{msg.timestamp}</span>
                          {!isUser && msg.text && !msg.streaming && (
                            <button
                              onClick={() => copyMessage(msg.text, msg.id)}
                              className="opacity-0 group-hover:opacity-100 hover:text-cyan-400 transition-opacity flex items-center gap-1 cursor-pointer"
                              title="Copy Response"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Error Banner with Retry */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
                    <span className="truncate">{errorMessage}</span>
                    <button
                      onClick={() => handleSend(messages[messages.length - 2]?.text)}
                      className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-[11px] font-mono flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Control Section: ALWAYS FROZEN AT BOTTOM (shrink-0, sticky bottom-0, z-30) */}
              <div className="shrink-0 sticky bottom-0 z-30 bg-[#080d1e] border-t border-cyan-500/20">
                {/* Suggested Questions (only for initial conversation) */}
                {messages.length <= 4 && (aiSettings.suggestedQuestions || []).length > 0 && (
                  <div className="px-3 py-2 bg-[#060b18]/80 border-b border-cyan-500/10">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {(aiSettings.suggestedQuestions || []).map((question, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSend(question)}
                          disabled={isGenerating}
                          className="px-2.5 py-1 rounded-full border border-cyan-500/20 bg-[#070e20] hover:border-cyan-400 hover:text-cyan-300 text-[10px] sm:text-[11px] text-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Controls */}
                <div className="p-3">
                  <div className="relative flex items-center rounded-xl border border-cyan-500/30 bg-[#050811] focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        lang === 'bn'
                          ? 'আবদুলের সেবা, প্রজেক্ট বা দক্ষতা সম্পর্কে প্রশ্ন করুন...'
                          : "Ask about Abdul's skills, cybersecurity, projects..."
                      }
                      disabled={isGenerating}
                      className="flex-1 max-h-24 py-2.5 pl-3.5 pr-2 bg-transparent text-xs text-white placeholder-slate-500 resize-none focus:outline-none"
                    />

                    <button
                      onClick={() => handleSend()}
                      disabled={!inputMessage.trim() || isGenerating}
                      className="p-2 mr-1 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-30 disabled:hover:bg-cyan-500 transition-all cursor-pointer shrink-0"
                      aria-label="Send message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1.5 px-1">
                    <span className="truncate">Abdul AI Assistant</span>
                    <span className="shrink-0">Enter ↵ to send</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
