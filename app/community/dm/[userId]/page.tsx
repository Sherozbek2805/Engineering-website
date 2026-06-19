"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, ShieldAlert } from "lucide-react";
import { getUserById, getDirectMessages, addDirectMessage } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import VerifiedAvatar from "@/components/VerifiedAvatar";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function DMThreadPage() {
  const params = useParams();
  const otherId = params.userId as string;
  const { currentUser, isAuthenticated } = useAuth();

  const [input, setInput] = useState("");
  const [, setTick] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const other = getUserById(otherId);
  const canMessage = isAuthenticated && (currentUser?.verified ?? false);
  const messages = currentUser ? getDirectMessages(currentUser.id, otherId) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length]);

  if (!other) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm" style={{ color: "#8b8b9e" }}>User not found.</p>
      </div>
    );
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !currentUser || !canMessage) return;
    addDirectMessage(currentUser.id, otherId, input.trim());
    setInput("");
    setTick((t) => t + 1);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-3 flex-shrink-0" style={{ borderBottom: "1px solid #1e1e2e" }}>
        <Link href="/community/dm" className="text-sm hover:text-white transition-colors" style={{ color: "#8b8b9e" }}>
          <ArrowLeft size={16} />
        </Link>
        <VerifiedAvatar name={other.name} avatarUrl={other.avatarUrl} verified={other.verified} size="sm" />
        <Link href={`/profile/${other.id}`} className="text-sm font-semibold text-white hover:underline">
          {other.name}
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-0.5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 h-full text-center">
            <VerifiedAvatar name={other.name} avatarUrl={other.avatarUrl} verified={other.verified} size="xl" />
            <p className="text-sm font-semibold text-white mt-2">{other.name}</p>
            <p className="text-xs" style={{ color: "#8b8b9e" }}>This is the start of your conversation.</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const author = getUserById(msg.fromId);
          if (!author) return null;
          const prev = messages[i - 1];
          const grouped =
            prev?.fromId === msg.fromId &&
            new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;

          if (grouped) {
            return (
              <div key={msg.id} className="flex pl-11 pr-2 py-0.5 rounded hover:bg-[#0f0f18] -mx-2">
                <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>{msg.body}</p>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex gap-3 mt-3 pr-2 py-1 rounded hover:bg-[#0f0f18] -mx-2 px-2">
              <VerifiedAvatar name={author.name} avatarUrl={author.avatarUrl} verified={author.verified} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-white">{author.name}</span>
                  <span className="text-xs" style={{ color: "#5a5a6e" }}>
                    {formatDate(msg.createdAt)} at {formatTime(msg.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>{msg.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        {!canMessage ? (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
            style={{ backgroundColor: "#1a1208", border: "1px solid #5c3b12" }}
          >
            <ShieldAlert size={14} style={{ color: "#fb923c" }} />
            <span style={{ color: "#8b8b9e" }}>Verify your account to send messages.</span>
            <Link href={`/profile/${currentUser?.id}`} className="ml-auto text-xs font-semibold" style={{ color: "#fb923c" }}>Verify →</Link>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${other.name.split(" ")[0]}`}
              className="flex-1 px-4 py-2.5 text-sm text-white outline-none rounded-xl"
              style={{ backgroundColor: "#1a1a28", border: "1px solid #2e2e44" }}
              onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
              onBlur={(e) => (e.target.style.borderColor = "#2e2e44")}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-opacity disabled:opacity-40 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
            >
              <Send size={15} className="text-white" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
