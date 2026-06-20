import { supabase } from "./supabase";

// ─── Shared profile shape returned by joins ───────────────────────────────────

export type ProfileSnippet = {
  id: string;
  name: string;
  avatar_url: string;
  verified: boolean;
  major: string;
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export type DbProject = {
  id: string;
  title: string;
  owner_id: string;
  discipline_id: string;
  description: string;
  stage: "Idea" | "Prototype" | "Testing" | "Final";
  progress: number;
  kind: "hardware" | "software";
  finished: boolean;
  looking_for: string[];
  tags: string[];
  milestones: { title: string; done: boolean }[];
  updates: { week: number; text: string }[];
  upvotes: number;
  created_at: string;
  owner?: ProfileSnippet;
};

export async function getProjectsByDisciplineId(disciplineId: string): Promise<DbProject[]> {
  const { data } = await supabase
    .from("projects")
    .select("*, owner:profiles!owner_id(id, name, avatar_url, verified, major)")
    .eq("discipline_id", disciplineId)
    .order("created_at", { ascending: false });
  return (data as DbProject[]) ?? [];
}

export async function getProjectById(id: string): Promise<DbProject | null> {
  const { data } = await supabase
    .from("projects")
    .select("*, owner:profiles!owner_id(id, name, avatar_url, verified, major)")
    .eq("id", id)
    .single();
  return (data as DbProject) ?? null;
}

export async function createProject(payload: {
  title: string;
  description: string;
  disciplineId: string;
  kind: "hardware" | "software";
  stage: string;
  progress: number;
  tags: string[];
  lookingFor: string[];
  milestones: { title: string; done: boolean }[];
  ownerId: string;
}): Promise<{ id?: string; error?: string }> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: payload.title,
      description: payload.description,
      discipline_id: payload.disciplineId,
      kind: payload.kind,
      stage: payload.stage,
      progress: payload.progress,
      tags: payload.tags,
      looking_for: payload.lookingFor,
      milestones: payload.milestones,
      owner_id: payload.ownerId,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: (data as { id: string }).id };
}

// ─── Cohorts ──────────────────────────────────────────────────────────────────

export type DbMember = {
  id: string;
  cohort_id: string;
  user_id: string;
  status: "requested" | "member" | "rejected";
  created_at: string;
  profiles: ProfileSnippet;
};

export type DbCohort = {
  id: string;
  title: string;
  goal: string;
  discipline_id: string;
  owner_id: string;
  team_size: number;
  roles_open: string[];
  description: string;
  created_at: string;
  owner?: ProfileSnippet;
  members?: DbMember[];
};

export async function getAllCohorts(): Promise<DbCohort[]> {
  const { data } = await supabase
    .from("cohorts")
    .select(`
      *,
      owner:profiles!owner_id(id, name, avatar_url, verified, major),
      members:cohort_members(id, user_id, status, profiles(id, name, avatar_url, verified, major))
    `)
    .order("created_at", { ascending: false });
  return (data as DbCohort[]) ?? [];
}

export async function getCohortById(id: string): Promise<DbCohort | null> {
  const { data } = await supabase
    .from("cohorts")
    .select(`
      *,
      owner:profiles!owner_id(id, name, avatar_url, verified, major),
      members:cohort_members(id, user_id, status, profiles(id, name, avatar_url, verified, major))
    `)
    .eq("id", id)
    .single();
  return (data as DbCohort) ?? null;
}

export async function createCohort(payload: {
  title: string;
  goal: string;
  disciplineId: string;
  teamSize: number;
  rolesOpen: string[];
  description: string;
  ownerId: string;
}): Promise<{ id?: string; error?: string }> {
  const { data, error } = await supabase
    .from("cohorts")
    .insert({
      title: payload.title,
      goal: payload.goal,
      discipline_id: payload.disciplineId,
      team_size: payload.teamSize,
      roles_open: payload.rolesOpen,
      description: payload.description,
      owner_id: payload.ownerId,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: (data as { id: string }).id };
}

export async function requestToJoin(cohortId: string, userId: string): Promise<string | null> {
  const { error } = await supabase
    .from("cohort_members")
    .insert({ cohort_id: cohortId, user_id: userId, status: "requested" });
  return error?.message ?? null;
}

export async function updateMemberStatus(memberId: string, status: "member" | "rejected"): Promise<string | null> {
  const { error } = await supabase
    .from("cohort_members")
    .update({ status })
    .eq("id", memberId);
  return error?.message ?? null;
}

export async function getUserCohortStatus(cohortId: string, userId: string): Promise<"requested" | "member" | "rejected" | null> {
  const { data } = await supabase
    .from("cohort_members")
    .select("status")
    .eq("cohort_id", cohortId)
    .eq("user_id", userId)
    .maybeSingle();
  return (data as { status: "requested" | "member" | "rejected" } | null)?.status ?? null;
}

// ─── Channel messages ─────────────────────────────────────────────────────────

export type DbChannelMessage = {
  id: string;
  community_id: string;
  channel_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author?: ProfileSnippet;
};

export async function getChannelMessages(communityId: string, channelId: string): Promise<DbChannelMessage[]> {
  const { data } = await supabase
    .from("channel_messages")
    .select("*, author:profiles!author_id(id, name, avatar_url, verified)")
    .eq("community_id", communityId)
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });
  return (data as DbChannelMessage[]) ?? [];
}

export async function sendChannelMessage(communityId: string, channelId: string, authorId: string, body: string): Promise<string | null> {
  const { error } = await supabase
    .from("channel_messages")
    .insert({ community_id: communityId, channel_id: channelId, author_id: authorId, body });
  return error?.message ?? null;
}

// ─── Direct messages ──────────────────────────────────────────────────────────

export type DbDirectMessage = {
  id: string;
  from_id: string;
  to_id: string;
  body: string;
  created_at: string;
  from_profile?: ProfileSnippet;
};

export async function getDirectMessages(userA: string, userB: string): Promise<DbDirectMessage[]> {
  const { data } = await supabase
    .from("direct_messages")
    .select("*, from_profile:profiles!from_id(id, name, avatar_url, verified)")
    .or(`and(from_id.eq.${userA},to_id.eq.${userB}),and(from_id.eq.${userB},to_id.eq.${userA})`)
    .order("created_at", { ascending: true });
  return (data as DbDirectMessage[]) ?? [];
}

export async function getDMConversations(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from("direct_messages")
    .select("from_id, to_id")
    .or(`from_id.eq.${userId},to_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (!data) return [];
  const seen = new Set<string>();
  const convos: string[] = [];
  for (const row of data as { from_id: string; to_id: string }[]) {
    const other = row.from_id === userId ? row.to_id : row.from_id;
    if (!seen.has(other)) { seen.add(other); convos.push(other); }
  }
  return convos;
}

export async function sendDirectMessage(fromId: string, toId: string, body: string): Promise<string | null> {
  const { error } = await supabase
    .from("direct_messages")
    .insert({ from_id: fromId, to_id: toId, body });
  return error?.message ?? null;
}

// ─── Profile lookup ───────────────────────────────────────────────────────────

export async function getProfileById(id: string): Promise<ProfileSnippet | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, verified, major")
    .eq("id", id)
    .single();
  return (data as ProfileSnippet) ?? null;
}

export async function getProjectsByOwnerId(ownerId: string): Promise<DbProject[]> {
  const { data } = await supabase
    .from("projects")
    .select("*, owner:profiles!owner_id(id, name, avatar_url, verified, major)")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  return (data as DbProject[]) ?? [];
}
