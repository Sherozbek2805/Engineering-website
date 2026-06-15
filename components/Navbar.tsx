"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Cpu, Search, User, ChevronDown, LogIn } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getCommunityById } from "@/lib/mock-data";
import VerifiedAvatar from "./VerifiedAvatar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, signIn, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // First joined community for quick-access
  const joinedCommunity =
    currentUser?.joinedCommunityIds?.[0]
      ? getCommunityById(currentUser.joinedCommunityIds[0])
      : null;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const navLinkStyle = (href: string) =>
    cn(
      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
      isActive(href)
        ? "text-white bg-[#1a1a28]"
        : "text-[#8b8b9e] hover:text-white hover:bg-[#1a1a28]"
    );

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(10, 10, 15, 0.90)",
        backdropFilter: "blur(12px)",
        borderColor: "#1e1e2e",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6633ee, #a855f7)" }}
          >
            <Cpu size={15} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white hidden sm:inline">BuildNet</span>
        </Link>

        {/* Center nav */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          <Link href="/engineering" className={navLinkStyle("/engineering")}>
            Engineering
          </Link>

          {/* Joined community quick-access */}
          {joinedCommunity && isAuthenticated && (
            <Link
              href={`/community/${joinedCommunity.id}`}
              className={navLinkStyle(`/community/${joinedCommunity.id}`)}
              style={{ color: isActive(`/community/${joinedCommunity.id}`) ? undefined : "#a78bfa" }}
            >
              {joinedCommunity.name.replace(" Community", "")}
            </Link>
          )}

          <Link href="/foundry" className={navLinkStyle("/foundry")}>
            Foundry
          </Link>
          <Link href="/about" className={navLinkStyle("/about")}>
            About us
          </Link>
        </div>

        {/* Right: search + sign in */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#8b8b9e" }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs text-white outline-none w-36 transition-all focus:w-48"
              style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e" }}
              onFocus={(e) => (e.target.style.borderColor = "#6633ee")}
              onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
            />
          </form>

          {/* Mobile search */}
          <Link
            href="/search"
            className="sm:hidden p-2 rounded-lg transition-colors hover:bg-[#1a1a28]"
            style={{ color: "#8b8b9e" }}
          >
            <Search size={16} />
          </Link>

          {/* Auth */}
          {isAuthenticated && currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 rounded-xl p-1 transition-colors hover:bg-[#1a1a28]"
              >
                <VerifiedAvatar name={currentUser.name} verified={currentUser.verified} size="sm" />
                <ChevronDown size={12} style={{ color: "#8b8b9e" }} />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl py-1 z-50"
                  style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                >
                  <Link
                    href={`/profile/${currentUser.id}`}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-[#1a1a28] transition-colors"
                  >
                    <User size={14} style={{ color: "#8b8b9e" }} />
                    Profile
                  </Link>
                  <Link
                    href="/create"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-[#1a1a28] transition-colors"
                  >
                    <Cpu size={14} style={{ color: "#8b8b9e" }} />
                    Post project
                  </Link>
                  <div className="my-1" style={{ borderTop: "1px solid #1e1e2e" }} />
                  <button
                    onClick={() => { signOut(); setShowUserMenu(false); }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#1a1a28] transition-colors"
                    style={{ color: "#8b8b9e" }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6633ee, #7744ff)" }}
            >
              <LogIn size={13} />
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
