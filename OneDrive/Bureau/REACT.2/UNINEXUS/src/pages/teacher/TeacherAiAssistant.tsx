import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Clock,
  BookOpen,
  FileQuestion,
  GraduationCap,
} from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const TeacherAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const { queryAiAssistant } = useData();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello ${
        user?.name || "Dr. Robert Smith"
      }! 👨‍🏫 I am your UniNexus Faculty & Teaching AI Assistant. I can assist with generating quiz questions, structuring lesson plans, analyzing class attendance trends, and checking university grading standards.`,
      timestamp: "Just now",
    },
  ]);

  const promptChips = [
    {
      label: "Generate Exam Questions",
      query: "Generate 3 advanced exam questions on AVL Trees and Graph BFS for CS 201.",
    },
    {
      label: "Lesson Plan Idea",
      query: "Outline a 2-hour interactive workshop on SQL Indexing and Query Optimization.",
    },
    {
      label: "Grading Criteria",
      query: "What is the standard university rubric for continuous assessments?",
    },
    {
      label: "Attendance Intervention",
      query: "What advice should I give to a student with 65% attendance before midterms?",
    },
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = { sender: "user", text, timestamp: "Just now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await queryAiAssistant(text);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: reply, timestamp: "Just now" },
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
          Faculty AI Assistant & Academic Copilot
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Intelligent assistant for curriculum planning, exam question generation & student advising
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Box */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[640px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  Faculty Teaching Copilot
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  Curriculum & Exam Intelligence Engine
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
              Teaching Tools
            </span>
          </div>

          <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-wrap gap-2">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 text-xs font-semibold border border-slate-200 hover:border-sky-300 transition shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3.5 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "ai" && (
                  <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm max-w-[80%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-sky-600 text-white rounded-br-xs shadow-xs"
                      : "bg-slate-100/90 text-slate-800 rounded-tl-xs whitespace-pre-line border border-slate-200/50"
                  }`}
                >
                  {m.text}
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      m.sender === "user" ? "text-sky-200" : "text-slate-400"
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
                <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="animate-spin" />
                </div>
                <div className="bg-slate-100 p-4 rounded-3xl flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-sky-600 animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-sky-600 animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            )}
          </div>

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
              placeholder="Ask for exam questions, lecture outlines, student statistics..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-md shadow-sky-200 shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-3xl p-6 border border-sky-200/60">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-3">
              <Sparkles size={20} />
            </div>
            <h4 className="text-sm font-bold text-sky-950">
              Exam & Syllabus Builder
            </h4>
            <p className="text-xs text-sky-800 mt-1 leading-relaxed">
              Generate multiple-choice items, code challenge prompts, and grading rubrics
              aligned with Bloom's Taxonomy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
