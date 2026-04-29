"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function DentalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/dental-chat",
    }),
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hello! 👋 I'm the North South Dental Concierge. I can help you book appointments, answer questions about our services and doctors, or check your booking status. How can I help you today?",
          },
        ],
      } as any,
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const text = inputValue.trim();
    setInputValue("");

    try {
      await sendMessage({ text });
    } catch (err) {
      console.error("Dental chat error:", err);
    }
  };

  // Extract text content from a message (handles both parts[] and content string)
  const getMessageText = (m: any): string => {
    if (m.parts && Array.isArray(m.parts)) {
      return m.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("\n");
    }
    return m.content || "";
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 group ${
          isOpen
            ? "bg-[#1e3a4f] rotate-0 scale-100"
            : "bg-gradient-to-br from-[#5a7a6a] to-[#3d5a4d] hover:scale-110"
        }`}
        aria-label="Chat with AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 text-white" />
            <span className="absolute inset-0 rounded-full bg-[#5a7a6a] animate-ping opacity-20" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] transition-all duration-500 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl border border-[#e8e4de] overflow-hidden flex flex-col"
          style={{ height: "550px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e3a4f] to-[#2c5a6f] px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-sm font-bold">
                North South Dental Concierge
              </h3>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">
                AI-Powered • Online
              </p>
            </div>
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fdfbf7]"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(90,122,106,0.15) transparent",
            }}
          >
            {messages?.map((m: any) => {
              const text = getMessageText(m);
              if (!text && m.role === "assistant") return null; // skip empty tool-only messages

              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      m.role === "user"
                        ? "bg-[#1e3a4f]"
                        : "bg-gradient-to-br from-[#5a7a6a] to-[#3d5a4d]"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[#1e3a4f] text-white rounded-2xl rounded-tr-md"
                        : "bg-white text-[#2c3e50] rounded-2xl rounded-tl-md border border-[#e8e4de] shadow-sm"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5a7a6a] to-[#3d5a4d] flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md border border-[#e8e4de] shadow-sm">
                    <div className="flex gap-1.5">
                      <span
                        className="w-2 h-2 bg-[#5a7a6a] rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-[#5a7a6a] rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-[#5a7a6a] rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

            {/* Error display */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-xs text-red-600 text-center border border-red-100">
                Something went wrong. Please try again or call us at (555)
                234-5678.
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white border-t border-[#e8e4de]">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about services, book an appointment..."
                className="flex-1 bg-[#f8fafb] border border-[#e8e4de] rounded-xl px-4 py-3 text-sm text-[#2c3e50] placeholder:text-[#9ba8b6] focus:outline-none focus:border-[#5a7a6a] focus:ring-1 focus:ring-[#5a7a6a]/20 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#5a7a6a] to-[#3d5a4d] text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            <p className="text-[9px] text-[#9ba8b6] text-center mt-2 uppercase tracking-widest">
              Powered by AI • North South Dental
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
