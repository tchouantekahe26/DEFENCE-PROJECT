import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Clock,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Info,
} from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const StudentAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const { queryAiAssistant } = useData();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello ${
        user?.name?.split(" ")[0] || "Student"
      }! 👋 I am your intelligent UniNexus academic advisor and assistant. Ask me anything about your courses, timetable, attendance rules, GPA calculation, or campus emergency contacts.`,
      timestamp: "Just now",
    },
  ]);

  const chips = [
    { label: "Ask a question", query: "What are the requirements for academic honors?" },
    { label: "Course info", query: "Tell me about CS 201 Data Structures prerequisites." },
    { label: "University info", query: "What are the main campus library opening hours?" },
    { label: "Study help", query: "How is GPA and CGPA calculated on a 4.0 scale?" },
  ];

  const recentConversations = [
    { query: "Where is my next exam?", time: "Today" },
    { query: "What is the passing grade?", time: "Yesterday" },
    { query: "How to apply for scholarship?", time: "2 days ago" },
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await queryAiAssistant(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          timestamp: "Just now",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I encountered a problem processing your request. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          AI University Assistant
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Intelligent automated academic guidance, campus regulations & study support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT 3 COLS: CHAT INTERFACE */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[640px] overflow-hidden">
          {/* Assistant Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  UniNexus AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  Always online • 24/7 University Knowledge Engine
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              AI Student Support
            </span>
          </div>

          {/* Quick Action Chips */}
          <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-wrap gap-2">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold border border-slate-200 hover:border-emerald-300 transition shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3.5 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm max-w-[80%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-xs shadow-xs"
                      : "bg-slate-100/90 text-slate-800 rounded-tl-xs whitespace-pre-line border border-slate-200/50"
                  }`}
                >
                  {m.text}
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      m.sender === "user" ? "text-emerald-200" : "text-slate-400"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.sender === "user" && (
                  <div className="w-9 h-9 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-400">
                <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="animate-spin" />
                </div>
                <div className="bg-slate-100 p-4 rounded-3xl flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-md shadow-emerald-200 shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT 1 COL: RECENT CONVERSATIONS & PROMPTS */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              Recent Conversations
            </h3>

            <div className="space-y-3">
              {recentConversations.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleSend(item.query)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/60 transition cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition">
                    "{item.query}"
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-200/60">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-3 shadow-sm">
              <Sparkles size={20} />
            </div>
            <h4 className="text-sm font-bold text-indigo-950">
              Instant Academic Insights
            </h4>
            <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
              Powered by university policy handbooks, course catalogs, syllabus archives,
              and semester schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
