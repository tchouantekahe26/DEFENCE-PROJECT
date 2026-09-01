import React, { useState } from "react";
import { Modal } from "./Modal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Bot, Send, Sparkles, User } from "lucide-react";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { queryAiAssistant } = useData();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello ${user?.name || "there"}! 👋 I am UniSphere's AI Assistant. How can I help you today? You can ask about course schedules, attendance rules, exam dates, GPA calculation, or campus emergency contacts.`,
    },
  ]);

  const quickChips = [
    "When are mid-term exams?",
    "What is the minimum attendance rule?",
    "How is GPA / CGPA calculated?",
    "How do I add or drop a course?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await queryAiAssistant(textToSend);
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I encountered an error processing your query. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="UniNexus Intelligent Assistant"
      subtitle="AI-powered academic support & campus information"
      maxWidth="2xl"
    >
      <div className="flex flex-col h-[480px]">
        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-slate-100">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="text-xs bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 font-medium px-2.5 py-1 rounded-full border border-indigo-100 transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[82%] leading-relaxed ${
                  m.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-xs"
                    : "bg-slate-100 text-slate-800 rounded-tl-xs whitespace-pre-line"
                }`}
              >
                {m.text}
              </div>
              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles size={16} className="animate-spin" />
              </div>
              <div className="bg-slate-100 p-3 rounded-2xl flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-3 border-t border-slate-100"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about courses, exams, attendance..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0 shadow-xs"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </Modal>
  );
};
