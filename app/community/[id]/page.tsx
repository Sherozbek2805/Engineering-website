"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import {
  getCommunityById,
  getCommunityMessages,
  getDisciplineById,
  getUserById,
  MOCK_CURRENT_USER_ID,
} from "@/lib/mock-data";
import VerifiedAvatar from "@/components/VerifiedAvatar";
import ProfileGate from "@/components/ProfileGate";
import { useAuth } from "@/lib/auth-context";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function CommunityPage() {
  const params = useParams();
  const router = useRouter();
  const { profileCompleted } = useAuth();
  const [newMsg, setNewMsg] = useState("");

  const community = getCommunityById(params.id as string);
  if (!community) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-white font-medium mb-2">Community not found</p>
        <button onClick={() => router.push("/engineering")} className="text-sm" style={{ color: "#6633ee" }}>
          Back to Engineering
        </button>
      </div>
    );
  }

  const disc = getDisciplineById(community.disciplineId);
  const messages = getCommunityMessages(community.id);
  const members = community.memberIds.map(getUserById).filter(Boolean);
  const isMember = community.memberIds.includes(MOCK_CURRENT_USER_ID);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#8b8b9e" }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
          >
            {disc && (
              <span
                className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3"
                style={{ backgroundColor: disc.color + "22", color: disc.color }}
              >
                {disc.name}
              </span>
            )}
            <h1 className="text-base font-bold text-white mb-1">{community.name}</h1>
            <p className="text-xs mb-4" style={{ color: "#8b8b9e" }}>
              {community.memberIds.length} member{community.memberIds.length !== 1 ? "s" : ""}
            </p>

            {!isMember && (
              <button
                className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
              >
                Join community
              </button>
            )}
          </div>

          {/* Members */}
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
          >
            <h2 className="text-xs font-semibold text-white mb-3">Members</h2>
            <div className="flex flex-col gap-3">
              {members.map((m) =>
                m ? (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push(`/profile/${m.id}`)}
                  >
                    <VerifiedAvatar name={m.name} verified={m.verified} size="sm" />
                    <div>
                      <p className="text-xs font-medium text-white hover:underline">{m.name}</p>
                      <p className="text-xs" style={{ color: "#8b8b9e" }}>{m.major.split(" ")[0]}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}
          >
            <h2 className="text-sm font-semibold text-white mb-4">Community feed</h2>

            <div className="flex flex-col gap-4 mb-4">
              {messages.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "#8b8b9e" }}>No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg) => {
                  const author = getUserById(msg.authorId);
                  return (
                    <div key={msg.id} className="flex gap-3">
                      {author && <VerifiedAvatar name={author.name} verified={author.verified} size="sm" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-white">{author?.name}</span>
                          <span className="text-xs" style={{ color: "#8b8b9e" }}>{timeAgo(msg.createdAt)}</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "#c4c4d4" }}>{msg.body}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message input */}
            <div className="pt-4" style={{ borderTop: "1px solid #1e1e2e" }}>
              {profileCompleted && isMember ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Write a message…"
                    className="flex-1 px-3 py-2 rounded-xl text-sm text-white outline-none"
                    style={{ backgroundColor: "#0a0a0f", border: "1px solid #1e1e2e" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
                  />
                  <button
                    className="p-2.5 rounded-xl text-white flex-shrink-0 hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
                  >
                    <Send size={15} />
                  </button>
                </div>
              ) : !isMember ? (
                <p className="text-xs text-center" style={{ color: "#8b8b9e" }}>Join the community to write messages.</p>
              ) : (
                <ProfileGate action="post in a community" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
