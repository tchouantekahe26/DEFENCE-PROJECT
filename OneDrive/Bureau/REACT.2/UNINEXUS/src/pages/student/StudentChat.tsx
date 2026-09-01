import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import {
  MessageSquare,
  Send,
  Hash,
  User,
  Users,
  Search,
  Paperclip,
  Smile,
} from "lucide-react";

export const StudentChat: React.FC = () => {
  const { user } = useAuth();
  const { chatMessages, sendChatMessage, users } = useData();

  const [activeTab, setActiveTab] = useState<"channels" | "direct">("channels");
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const channels = [
    { id: "general", name: "general", desc: "Campus-wide discussion" },
    { id: "study-help", name: "study-help", desc: "Peer tutoring & questions" },
    { id: "announcements", name: "announcements", desc: "Student body bulletins" },
    { id: "events", name: "events", desc: "Clubs, Hackathons & Seminars" },
  ];

  const currentUserId = user?.id || "usr-student-1";
  const currentUserName = user?.name || "Alex Johnson";

  // Filter messages
  const visibleMessages = chatMessages.filter((msg) => {
    if (activeTab === "channels") {
      return msg.channelId === selectedChannel;
    } else {
      if (!selectedRecipientId) return false;
      return (
        (msg.senderId === currentUserId && msg.recipientId === selectedRecipientId) ||
        (msg.senderId === selectedRecipientId && msg.recipientId === currentUserId)
      );
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage({
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: user?.role || "student",
      channelId: activeTab === "channels" ? selectedChannel : undefined,
      recipientId: activeTab === "direct" ? selectedRecipientId || undefined : undefined,
      content: inputText,
    });

    setInputText("");
  };

  const directUsers = users.filter((u) => u.id !== currentUserId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Community Chat
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Connect with peers, study groups, course lecturers and student clubs
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs h-[640px] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="border-r border-slate-200/80 flex flex-col bg-slate-50/50">
          {/* Tab Switcher */}
          <div className="p-4 border-b border-slate-200/80">
            <div className="grid grid-cols-2 bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab("channels");
                  setSelectedRecipientId(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "channels"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Channels
              </button>
              <button
                onClick={() => {
                  setActiveTab("direct");
                  if (!selectedRecipientId && directUsers.length > 0) {
                    setSelectedRecipientId(directUsers[0].id);
                  }
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "direct"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Direct
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {activeTab === "channels" ? (
              channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition ${
                    selectedChannel === ch.id
                      ? "bg-emerald-600 text-white shadow-xs font-bold"
                      : "hover:bg-slate-100 text-slate-700 font-medium"
                  }`}
                >
                  <Hash size={18} className="shrink-0 opacity-80" />
                  <div className="min-w-0">
                    <p className="text-xs truncate">#{ch.name}</p>
                    <p
                      className={`text-[10px] truncate ${
                        selectedChannel === ch.id
                          ? "text-emerald-100"
                          : "text-slate-400"
                      }`}
                    >
                      {ch.desc}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              directUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedRecipientId(u.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition ${
                    selectedRecipientId === u.id
                      ? "bg-emerald-600 text-white shadow-xs font-bold"
                      : "hover:bg-slate-100 text-slate-700 font-medium"
                  }`}
                >
                  <img
                    src={
                      u.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    }
                    alt={u.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs truncate">{u.name}</p>
                    <p
                      className={`text-[10px] capitalize truncate ${
                        selectedRecipientId === u.id
                          ? "text-emerald-100"
                          : "text-slate-400"
                      }`}
                    >
                      {u.role} • {u.department}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ================= RIGHT CHAT PANE ================= */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full bg-white">
          {/* Channel / DM Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                {activeTab === "channels" ? <Hash size={20} /> : <User size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {activeTab === "channels"
                    ? `#${selectedChannel}`
                    : directUsers.find((u) => u.id === selectedRecipientId)?.name ||
                      "Direct Chat"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {activeTab === "channels"
                    ? "Open student & faculty channel"
                    : "Direct Peer-to-Peer messaging"}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {visibleMessages.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <MessageSquare size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">No messages yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Start the conversation by sending a message below!
                </p>
              </div>
            ) : (
              visibleMessages.map((msg) => {
                const isMe = msg.senderId === currentUserId;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {msg.senderName.charAt(0)}
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? "bg-emerald-600 text-white rounded-br-xs shadow-xs"
                          : "bg-slate-100 text-slate-800 rounded-tl-xs"
                      }`}
                    >
                      {!isMe && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-slate-900">
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            {msg.senderRole}
                          </span>
                        </div>
                      )}

                      <p>{msg.content}</p>

                      <span
                        className={`block text-[10px] mt-1 text-right ${
                          isMe ? "text-emerald-200" : "text-slate-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${
                activeTab === "channels" ? `#${selectedChannel}` : "..."
              }`}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-md shadow-emerald-200 shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
