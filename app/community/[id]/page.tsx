"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Hash, ShieldAlert, Send, LogIn } from "lucide-react";
import {
  getCommunityById,
  getUserById,
  getDisciplineById,
  getChannelMessages,
  addChannelMessage,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import VerifiedAvatar from "@/components/VerifiedAvatar";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.id as string;
  const { currentUser, isAuthenticated } = useAuth();

  const community = getCommunityById(communityId);
  const disc = community ? getDisciplineById(community.disciplineId) : null;
  const [activeChannel, setActiveChannel] = useState(community?.channels[0]?.id ?? "general");
  const [input, setInput] = useState("");
  const [, setTick] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const canMessage = isAuthenticated && (currentUser?.verified ?? false);
  const messages = community ? getChannelMessages(communityId, activeChannel) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length, activeChannel]);

  useEffect(() => {
    if (community?.channels[0]) setActiveChannel(community.channels[0].id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  if (!community) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm" style={{ color: "#8b8b9e" }}>Community not found.</p>
      </div>
    );
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !currentUser || !canMessage) return;
    addChannelMessage(communityId, activeChannel, currentUser.id, input.trim());
    setInput("");
    setTick((t) => t + 1);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  const channelName = community.channels.find((c) => c.id === activeChannel)?.name ?? activeChannel;

  return (
    <>
      {/* Channel sidebar */}
      <div
        className="flex-shrink-0 flex flex-col"
        style={{ width: 240, backgroundColor: "#0f0f18", borderRight: "1px solid #1e1e2e" }}
      >
        {/* Community name header */}
        <div
          className="px-4 py-3 flex items-center gap-2 flex-shrink-0 cursor-default"
          style={{ borderBottom: "1px solid #1e1e2e" }}
        >
          {disc && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: disc.color }} />}
          <h2 className="text-sm font-bold text-white truncate">{community.name.replace(" Community", "")}</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          <p className="text-xs font-semibold px-2 mb-1" style={{ color: "#5a5a6e" }}>CHANNELS</p>
          {community.channels.map((ch) => {
            const isActive = ch.id === activeChannel;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left"
                style={{
                  backgroundColor: isActive ? "#6633ee22" : "transparent",
                  color: isActive ? "#e2e2f0" : "#8b8b9e",
                }}
              >
                <Hash size={14} style={{ color: isActive ? "#a78bfa" : "#5a5a6e", flexShrink: 0 }} />
                {ch.name}
              </button>
            );
          })}

          <p className="text-xs font-semibold px-2 mt-4 mb-1" style={{ color: "#5a5a6e" }}>
            MEMBERS — {community.memberIds.length}
          </p>
          {community.memberIds.map((uid) => {
            const u = getUserById(uid);
            if (!u) return null;
            return (
              <Link
                key={uid}
                href={`/profile/${uid}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors hover:bg-[#1a1a28]"
              >
                <VerifiedAvatar name={u.name} avatarUrl={u.avatarUrl} verified={u.verified} size="sm" />
                <span className="text-xs text-white truncate">{u.name.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-5 py-3 flex items-center gap-2 flex-shrink-0" style={{ borderBottom: "1px solid #1e1e2e" }}>
          <Hash size={16} style={{ color: "#5a5a6e" }} />
          <span className="text-sm font-semibold text-white">{channelName}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-0.5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 h-full py-16 text-center">
              <Hash size={32} style={{ color: "#2e2e44" }} />
              <p className="text-sm font-semibold text-white">Welcome to #{channelName}</p>
              <p className="text-xs" style={{ color: "#8b8b9e" }}>This is the start of this channel.</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const author = getUserById(msg.authorId);
            if (!author) return null;
            const prev = messages[i - 1];
            const grouped =
              prev?.authorId === msg.authorId &&
              new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;

            if (grouped) {
              return (
                <div key={msg.id} className="flex pl-11 pr-2 py-0.5 rounded hover:bg-[#0f0f18] -mx-2 group">
                  <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>{msg.body}</p>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex gap-3 mt-3 pr-2 py-1 rounded hover:bg-[#0f0f18] -mx-2 px-2 group">
                <VerifiedAvatar name={author.name} avatarUrl={author.avatarUrl} verified={author.verified} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <Link href={`/profile/${author.id}`} className="text-sm font-semibold text-white hover:underline">
                      {author.name}
                    </Link>
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

        {/* Input / gate */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          {!isAuthenticated ? (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ backgroundColor: "#1a1a28", border: "1px solid #2e2e44" }}
            >
              <LogIn size={14} style={{ color: "#a78bfa" }} />
              <span style={{ color: "#8b8b9e" }}>Sign in to message this community.</span>
              <Link href="/login" className="ml-auto text-xs font-semibold" style={{ color: "#a78bfa" }}>Sign in →</Link>
            </div>
          ) : !currentUser?.verified ? (
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
                placeholder={`Message #${channelName}`}
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
    </>
  );
}
