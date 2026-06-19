# CLAUDE.md — BuildNet (Engineering Network Platform) v5

## What we're building
"BuildNet": a web platform for STEM / engineering students to showcase projects, find teammates,
ask technical questions, and find the best research materials — organized **by engineering discipline**.
Core question: "What are you building right now?" Project-centric. Early focus: Uzbekistan.
The UI already exists on mock data. This file is the source of truth for structure, then DB/auth in Phase B.

## Stack
Next.js (App Router) + TypeScript, Tailwind + shadcn/ui (components in `/components/ui`), lucide-react.
Deploy: Vercel. Backend (Phase B): Supabase (Postgres + Auth + Storage) via the Vercel Storage tab.

## Roles (only three)
- **Visitor** — not signed in. Browses public content read-only; cannot interact.
- **Builder** — any signed-in user (the one member role). Signs in with Google or email.
- **Admin** — the network owner (you). Moderation powers: remove content, ban users, manage
  disciplines, feature/flag. Dashboard at `/admin`, reachable from the top-bar account menu
  (shown ONLY when role = 'admin').
`role` field on User: 'builder' | 'admin'. No moderator role.

## Auth + verification (NEW MODEL — "browse first, verify later")
Sign-in methods: **Google** (primary) and **email + password**. NOT GitHub/LinkedIn for login.
Flow:
- Hero `/` shows "Sign up" and "Log in".
- `/signup`: ordinary form (name, email, password, confirm). On success → `/login`.
- `/login`: email+password form + a "Continue with Google" button.
- After login: profile incomplete → `/onboarding`; else `/engineering`.
Verification (SEPARATE from sign-in):
- Every new builder is UNVERIFIED at first and may use the platform right away — they CAN post,
  comment, and apply to projects. Their profile shows an "unverified" tag.
- To verify, a builder connects **GitHub OR LinkedIn** from their profile ("Connect to verify").
  This sets `verified = true` and removes the tag.
- Verification GATES exactly two things: **joining Foundry cohorts** and **messaging** other users.
  Everything else is open to unverified builders. (Friction at the right moment, not the front door.)
NOTE: real Google sign-in and GitHub/LinkedIn verification need Supabase Auth + OAuth apps YOU create
(Phase B). Until then, build the forms + connect buttons with mock/local state so the flow is complete.

## Profiles + onboarding
"Common App for builders" — one rich, standardized, viewable profile.
After signup, route to `/onboarding` (the user MAY skip). Fields: photo (fallback = colored circle with
the FIRST LETTER of their name), name, school, country, region, main discipline, short bio,
skills (1–10), interests, portfolio (projects: title/desc/link), and "Connect GitHub / LinkedIn to verify".
Show a completion meter to ENCOURAGE finishing — but completion no longer hard-locks posting/applying;
the only gate is verification (for cohorts + messaging).

## Top-level navigation
Three centered tags: **Engineering**, **Foundry**, **About us**. No standalone Projects/Opportunities
tabs (they live inside Engineering). Joined communities show a quick-access entry next to Engineering.
Top bar also has a global search box + account/sign-in. Account menu shows `/admin` only for admins.

## Engineering (core)
`/engineering` → discipline chooser. **REMOVE the big centered "Engineering / Choose your discipline…"
hero banner** at the top of this page (per latest feedback — it's visual dead weight). Keep just a small
page title (or none) and go straight to the discipline cards grid. Each card shows project/builder counts
or "Be the first".
`/engineering/[discipline]` → four tabs: Projects (Hardware / Software / Unfinished); Field tools &
resources (discipline-specific, e.g. CAD); Technical Q&A (Reddit-style threaded); Research repositories
(vote-ranked). Opportunities live here too, as a section.

## Foundry (team-up)
`/foundry` lists open cohorts; `/foundry/[id]` cohort detail; "Start a cohort" form.
"Request to join" creates a CohortMember (status 'requested') and shows a "Requested" state; the cohort
OWNER approves/rejects on the detail page (requested → member). REQUIRES the requester to be VERIFIED —
unverified users see a "verify to join" prompt.

## Communities / messaging — Discord-style (NEW)
Model the community + direct-messaging experience on Discord, but for engineers, with BuildNet's OWN
branding (do NOT copy Discord's logo or assets):
- Left rail of community icons (the "servers") — each a discipline or project community.
- Within a community: a channel list (e.g. #general, #help, #showcase).
- Main panel: the channel chat (message stream) / threaded discussion.
- A direct-messages view (conversation list + thread).
- Sending messages REQUIRES verification.

## Visual style (NEW)
- Background: add `/components/ui/background-gradient.tsx` — a fixed full-screen dark background with a
  radial glow at top-center and a faint grid (the dark sky-blue snippet provided). Render it once behind
  the whole app at `-z-10`.
- Buttons: add a soft glow on hover (colored box-shadow / slight brightness lift) on primary buttons.
- Keep BuildNet dark, clean, modern.

## Discussion / Q&A style (Reddit-like)
Threaded comments: up/down votes + score, sort (Best / Top / New), reply, collapsible nested replies,
author + time. Used in Technical Q&A and community threads.

## Search
Global search by name; filters: country, region, skills, projects.

## Data model (mock now in /lib/mock-data.ts → DB tables in Phase B)
User { id, name, school, country, region, major, avatarUrl, bio, role:'builder'|'admin',
       verified:boolean, verificationProvider?:'github'|'linkedin', builderScore,
       skills:{name,rating}[], interests[], githubUrl, linkedinUrl, availability,
       profileCompleted:boolean, projectIds[], joinedCommunityIds[] }
Discipline { id, slug, name, icon }
Project { id, title, ownerId, disciplineId, description, kind:'hardware'|'software',
          finished:boolean, stage, progress, lookingFor[], tags[], milestones[], updates[],
          teamMemberIds[], upvotes }
QAPost { id, disciplineId, authorId, title, body, votes, peerReviewed:boolean, createdAt }
QAComment { id, postId, parentId|null, authorId, body, upvotes, downvotes, createdAt }  // threaded
Resource { id, disciplineId, title, url, description, votes, addedById }                 // research repo
Opportunity { id, disciplineId, title, category, country, field, deadline, link }
Community { id, name, disciplineId, channels:[{id,name}], memberIds[] }
ChannelMessage { id, communityId, channelId, authorId, body, createdAt }
DirectMessage { id, fromId, toId, body, createdAt }
Cohort { id, title, goal, disciplineId, ownerId, teamSize, openRoles[], memberIds[], description }
CohortMember { id, cohortId, userId, role, status:'requested'|'member' }
// Removed: User.status 'pending'|'approved' — no front-door admin approval in the new model.

## Build order
### Already built — do NOT redo
Hero + routing, 3-tab nav, `/engineering` chooser, `/engineering/[discipline]` sections, Reddit-style
Q&A, search + filters, community quick link, Foundry + cohorts, `/onboarding` form, `/signup` + `/login`
forms, Request-to-join + cohort-owner approval, `/admin` entrance.

### New / changed THIS round (Phase A, mock data)
N1. Engineering page: REMOVE the big hero banner → go straight to the discipline grid (small title only).
N2. Add `/components/ui/background-gradient.tsx` (dark radial + grid) and render app-wide behind content;
    add a hover glow on primary buttons.
N3. New auth model: login = Google + email/password; move GitHub/LinkedIn OFF login and make them
    "Connect to verify" buttons on the profile. New builders are unverified but CAN post/comment/apply;
    show an "unverified" tag. Rename role 'member' → 'builder'. REMOVE the old front-door gates
    (admin approval of signups; profile-completion lock on posting).
N4. Verification gating: joining Foundry cohorts AND messaging require verified=true (show verify prompt).
N5. Discord-style communities + messaging (server rail, channels, channel chat, DMs), engineers-themed,
    BuildNet branding. Sending messages requires verification.

### Phase B — DB + auth (later)
B1. HUMAN: provision Supabase via Vercel Storage tab; confirm env vars.
B2. SQL migrations matching the data model (+ vote/channel/DM/cohort tables, foreign keys). Seed from mock.
B3. Replace mock reads with Supabase queries; keep UI identical.
B4. Supabase Auth: Google provider + email/password (YOU create the Google OAuth client). GitHub +
    LinkedIn as identity-linking for verification (YOU create those OAuth apps). Enforce verification
    gates + role checks server-side.
B5. Make writes persist (projects, applies, Q&A, votes, resources, messages), tied to the signed-in user.
B6. Row Level Security: users edit only their own rows; reads public; admin-only actions restricted.

## Do NOT build yet
AI features, internship scraping, fundraising, native mobile app. Team-matching comes later as a simple
skill-overlap score — not machine learning.
