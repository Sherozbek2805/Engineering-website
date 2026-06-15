"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, MessageSquare, Share2, ChevronDown as Collapse } from "lucide-react";
import { QAComment, getUserById } from "@/lib/mock-data";
import VerifiedAvatar from "./VerifiedAvatar";
import { useAuth } from "@/lib/auth-context";
import ProfileGate from "./ProfileGate";
import { cn } from "@/lib/utils";

type SortMode = "best" | "top" | "new";

interface ThreadedCommentsProps {
  comments: QAComment[];
  postId: string;
}

interface CommentNode extends QAComment {
  children: CommentNode[];
}

function buildTree(flat: QAComment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: CommentNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function sortNodes(nodes: CommentNode[], mode: SortMode): CommentNode[] {
  return [...nodes].sort((a, b) => {
    if (mode === "best") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    if (mode === "top") return b.upvotes - a.upvotes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface CommentItemProps {
  node: CommentNode;
  depth: number;
  sort: SortMode;
  profileCompleted: boolean;
}

function CommentItem({ node, depth, sort, profileCompleted }: CommentItemProps) {
  const [votes, setVotes] = useState(node.upvotes - node.downvotes);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const author = getUserById(node.authorId);

  function handleVote(dir: "up" | "down") {
    if (vote === dir) { setVote(null); setVotes(node.upvotes - node.downvotes); }
    else { setVote(dir); setVotes((node.upvotes - node.downvotes) + (dir === "up" ? 1 : -1)); }
  }

  const sorted = sortNodes(node.children, sort);

  return (
    <div className={cn("relative", depth > 0 && "ml-5 pl-4")} style={depth > 0 ? { borderLeft: "2px solid #1e1e2e" } : {}}>
      {/* Comment header */}
      <div className="flex items-center gap-2 mb-1">
        {author && <VerifiedAvatar name={author.name} verified={author.verified} size="sm" />}
        <span className="text-xs font-semibold text-white">{author?.name ?? "Unknown"}</span>
        <span className="text-xs" style={{ color: "#8b8b9e" }}>{timeAgo(node.createdAt)}</span>
        {node.children.length > 0 && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex items-center gap-1 text-xs transition-colors hover:text-white"
            style={{ color: "#8b8b9e" }}
          >
            <Collapse size={12} className={collapsed ? "-rotate-90" : ""} />
            {collapsed ? `${node.children.length} replies` : "Collapse"}
          </button>
        )}
      </div>

      {/* Body */}
      {!collapsed && (
        <>
          <p className="text-sm leading-relaxed mb-2 ml-8" style={{ color: "#c4c4d4" }}>
            {node.body}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-8 mb-3">
            <div className="flex items-center gap-0.5 rounded-lg overflow-hidden" style={{ backgroundColor: "#1a1a28" }}>
              <button
                onClick={() => handleVote("up")}
                className={cn("p-1.5 transition-colors hover:text-white", vote === "up" ? "text-[#a78bfa]" : "")}
                style={{ color: vote === "up" ? "#a78bfa" : "#8b8b9e" }}
              >
                <ChevronUp size={14} />
              </button>
              <span className="text-xs font-semibold px-1 min-w-[20px] text-center" style={{ color: votes > 0 ? "#a78bfa" : votes < 0 ? "#f87171" : "#8b8b9e" }}>
                {votes}
              </span>
              <button
                onClick={() => handleVote("down")}
                className={cn("p-1.5 transition-colors hover:text-white", vote === "down" ? "text-rose-400" : "")}
                style={{ color: vote === "down" ? "#f87171" : "#8b8b9e" }}
              >
                <ChevronDown size={14} />
              </button>
            </div>
            <button
              onClick={() => profileCompleted ? setReplying(!replying) : null}
              className="flex items-center gap-1 text-xs transition-colors hover:text-white px-2 py-1 rounded-lg"
              style={{ color: "#8b8b9e", backgroundColor: "#1a1a28" }}
            >
              <MessageSquare size={12} /> Reply
            </button>
            <button
              className="flex items-center gap-1 text-xs transition-colors hover:text-white px-2 py-1 rounded-lg"
              style={{ color: "#8b8b9e", backgroundColor: "#1a1a28" }}
            >
              <Share2 size={12} /> Share
            </button>
          </div>

          {/* Reply form */}
          {replying && (
            <div className="ml-8 mb-3">
              {profileCompleted ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full px-3 py-2 text-sm rounded-xl outline-none resize-none text-white"
                    style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
                    onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setReplying(false); setReplyText(""); }}
                      className="text-xs px-3 py-1.5 rounded-lg"
                      style={{ color: "#8b8b9e", backgroundColor: "#1a1a28" }}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                      style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
                    >
                      Post reply
                    </button>
                  </div>
                </div>
              ) : (
                <ProfileGate action="reply" />
              )}
            </div>
          )}

          {/* Nested replies */}
          {sorted.length > 0 && (
            <div className="flex flex-col gap-3 mb-2">
              {sorted.map((child) => (
                <CommentItem key={child.id} node={child} depth={depth + 1} sort={sort} profileCompleted={profileCompleted} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ThreadedComments({ comments, postId }: ThreadedCommentsProps) {
  const { profileCompleted } = useAuth();
  const [sort, setSort] = useState<SortMode>("best");
  const [newComment, setNewComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const tree = useMemo(() => buildTree(comments), [comments]);
  const sorted = sortNodes(tree, sort);

  const sortOptions: { label: string; value: SortMode }[] = [
    { label: "Best", value: "best" },
    { label: "Top", value: "top" },
    { label: "New", value: "new" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Sort + Comment count */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "#8b8b9e" }}>
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-0.5 rounded-xl p-0.5" style={{ backgroundColor: "#1a1a28" }}>
          {sortOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSort(value)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={sort === value ? { background: "linear-gradient(135deg, #6633ee, #7744ff)", color: "#fff" } : { color: "#8b8b9e" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* New comment trigger */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-left text-sm px-4 py-2.5 rounded-xl w-full transition-colors"
          style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e", color: "#8b8b9e" }}
        >
          Add a comment…
        </button>
      ) : profileCompleted ? (
        <div className="flex flex-col gap-2">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your knowledge or ask a follow-up question..."
            className="w-full px-4 py-3 text-sm rounded-xl outline-none resize-none text-white"
            style={{ backgroundColor: "#111118", border: "1px solid #6633ee" }}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setNewComment(""); }}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ color: "#8b8b9e", backgroundColor: "#1a1a28" }}
            >
              Cancel
            </button>
            <button
              className="text-xs px-4 py-1.5 rounded-lg font-medium text-white"
              style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
            >
              Post comment
            </button>
          </div>
        </div>
      ) : (
        <ProfileGate action="post a comment" />
      )}

      {/* Comment tree */}
      <div className="flex flex-col gap-4">
        {sorted.map((node) => (
          <CommentItem key={node.id} node={node} depth={0} sort={sort} profileCompleted={profileCompleted} />
        ))}
      </div>
    </div>
  );
}
