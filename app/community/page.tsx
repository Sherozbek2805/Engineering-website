"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { communities } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

export default function CommunityIndexPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Redirect to first joined community, or first community overall
    const first =
      communities.find((c) => currentUser?.joinedCommunityIds?.includes(c.id)) ??
      communities[0];
    if (first) {
      router.replace(`/community/${first.id}`);
    }
  }, [currentUser, router]);

  return null;
}
