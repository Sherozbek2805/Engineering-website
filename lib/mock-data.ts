// ─── Types ────────────────────────────────────────────────────────────────────

export type Skill = { name: string; rating: number };

export type PortfolioItem = { title: string; url: string };

export type User = {
  id: string;
  name: string;
  email: string;
  school: string;
  country: string;
  region: string;
  major: string;
  bio: string;
  avatarUrl: string;
  verified: boolean;
  builderScore: number;
  skills: Skill[];
  interests: string[];
  portfolio: PortfolioItem[];
  githubUrl: string;
  linkedinUrl: string;
  availability:
    | "Looking for projects"
    | "Looking for team members"
    | "Looking for internship"
    | "Not available";
  profileCompleted: boolean;
  role: "builder" | "admin";
  verificationProvider?: "github" | "linkedin";
  projectIds: string[];
  joinedCommunityIds: string[];
};

/** Mock credential store — NOT secure, for local/demo auth only. */
export type Account = {
  userId: string;
  email: string;
  password: string;
};

export type Discipline = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

export type Project = {
  id: string;
  title: string;
  ownerId: string;
  disciplineId: string;
  description: string;
  stage: "Idea" | "Prototype" | "Testing" | "Final";
  progress: number;
  kind: "hardware" | "software";
  finished: boolean;
  lookingFor: string[];
  tags: string[];
  milestones: { title: string; done: boolean }[];
  updates: { week: number; text: string }[];
  teamMemberIds: string[];
  upvotes: number;
};

export type QAPost = {
  id: string;
  disciplineId: string;
  authorId: string;
  title: string;
  body: string;
  votes: number;
  peerReviewed: boolean;
  createdAt: string;
};

export type QAComment = {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  body: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
};

export type Resource = {
  id: string;
  disciplineId: string;
  title: string;
  url: string;
  description: string;
  votes: number;
  addedById: string;
};

export type Opportunity = {
  id: string;
  disciplineId: string | null;
  title: string;
  category: "Internship" | "Competition" | "Scholarship" | "Research" | "Grant";
  country: string;
  field: string;
  deadline: string;
  link: string;
};

export type Channel = {
  id: string;
  name: string;
};

export type Community = {
  id: string;
  name: string;
  disciplineId: string;
  channels: Channel[];
  memberIds: string[];
};

export type ChannelMessage = {
  id: string;
  communityId: string;
  channelId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type DirectMessage = {
  id: string;
  fromId: string;
  toId: string;
  body: string;
  createdAt: string;
};

export type Cohort = {
  id: string;
  title: string;
  goal: string;
  disciplineId: string;
  ownerId: string;
  memberIds: string[];
  teamSize: number;
  rolesOpen: string[];
  description: string;
};

export type JoinRequest = {
  id: string;
  cohortId: string;
  userId: string;
  status: "requested" | "rejected";
  createdAt: string;
};

export type FieldTool = {
  name: string;
  description: string;
  url: string;
  free: boolean;
  category: string;
};

// ─── Disciplines ──────────────────────────────────────────────────────────────

export const disciplines: Discipline[] = [
  {
    id: "d1",
    slug: "aerospace",
    name: "Aerospace Engineering",
    icon: "Plane",
    description: "Aircraft, spacecraft, drones and propulsion systems.",
    color: "#3b82f6",
  },
  {
    id: "d2",
    slug: "mechanical",
    name: "Mechanical Engineering",
    icon: "Settings2",
    description: "Mechanics, thermodynamics, fluid dynamics and materials.",
    color: "#f97316",
  },
  {
    id: "d3",
    slug: "electrical",
    name: "Electrical Engineering",
    icon: "Zap",
    description: "Circuits, power systems, signal processing and PCB design.",
    color: "#eab308",
  },
  {
    id: "d4",
    slug: "civil",
    name: "Civil Engineering",
    icon: "Building2",
    description: "Structures, infrastructure and urban planning systems.",
    color: "#78716c",
  },
  {
    id: "d5",
    slug: "chemical",
    name: "Chemical Engineering",
    icon: "FlaskConical",
    description: "Chemical processes, materials synthesis and biotechnology.",
    color: "#22c55e",
  },
  {
    id: "d6",
    slug: "software",
    name: "Software / CS",
    icon: "Code2",
    description: "Software systems, AI, web development and algorithms.",
    color: "#a855f7",
  },
  {
    id: "d7",
    slug: "robotics",
    name: "Robotics Engineering",
    icon: "Bot",
    description: "Autonomous systems, control theory and mechatronics.",
    color: "#6633ee",
  },
  {
    id: "d8",
    slug: "biomedical",
    name: "Biomedical Engineering",
    icon: "Heart",
    description: "Medical devices, biosensors and health technology.",
    color: "#ec4899",
  },
  {
    id: "d9",
    slug: "materials",
    name: "Materials Engineering",
    icon: "Layers",
    description: "Metals, polymers, composites and nanomaterials.",
    color: "#14b8a6",
  },
  {
    id: "d10",
    slug: "environmental",
    name: "Environmental Engineering",
    icon: "Leaf",
    description: "Clean energy, water treatment and sustainability systems.",
    color: "#84cc16",
  },
];

// ─── Users ────────────────────────────────────────────────────────────────────

export const users: User[] = [
  {
    id: "u1",
    name: "Akbar Tashkentov",
    email: "akbar@buildnet.dev",
    school: "Tashkent State Technical University",
    country: "Uzbekistan",
    region: "Tashkent",
    major: "Mechatronics Engineering",
    bio: "Mechatronics engineer building autonomous drones and ROVs. Always down to prototype something new.",
    avatarUrl: "",
    verified: true,
    builderScore: 920,
    skills: [
      { name: "CAD / SolidWorks", rating: 9 },
      { name: "Arduino & Embedded", rating: 9 },
      { name: "Python", rating: 7 },
      { name: "3D Printing", rating: 8 },
      { name: "Circuit Design", rating: 8 },
    ],
    interests: ["Drones", "Robotics", "IoT", "Aerospace"],
    portfolio: [{ title: "AutoDrone build log", url: "https://github.com" }],
    githubUrl: "https://github.com/akbart",
    linkedinUrl: "https://linkedin.com/in/akbart",
    availability: "Looking for team members",
    profileCompleted: true,
    role: "admin",
    projectIds: ["p1", "p3"],
    joinedCommunityIds: ["c7"],
  },
  {
    id: "u2",
    name: "Dilnoza Yusupova",
    email: "dilnoza@buildnet.dev",
    school: "Westminster International University",
    country: "Uzbekistan",
    region: "Tashkent",
    major: "Computer Science",
    bio: "Full-stack developer focused on health tech and EdTech for underserved communities.",
    avatarUrl: "",
    verified: true,
    builderScore: 855,
    skills: [
      { name: "React / Next.js", rating: 9 },
      { name: "TypeScript", rating: 8 },
      { name: "UI/UX Design", rating: 8 },
      { name: "Node.js", rating: 7 },
      { name: "PostgreSQL", rating: 6 },
    ],
    interests: ["EdTech", "Health Tech", "Open Source", "AI"],
    portfolio: [{ title: "TashMed case study", url: "https://github.com" }],
    githubUrl: "https://github.com/dilnozay",
    linkedinUrl: "https://linkedin.com/in/dilnozay",
    availability: "Looking for projects",
    profileCompleted: true,
    role: "builder",
    projectIds: ["p4", "p6"],
    joinedCommunityIds: ["c6"],
  },
  {
    id: "u3",
    name: "Bobur Karimov",
    email: "bobur@buildnet.dev",
    school: "Tashkent University of Information Technologies",
    country: "Uzbekistan",
    region: "Tashkent",
    major: "Electrical Engineering",
    bio: "Electrical engineer obsessed with renewable energy and solar tracking systems.",
    avatarUrl: "",
    verified: false,
    builderScore: 680,
    skills: [
      { name: "PCB Design", rating: 8 },
      { name: "MATLAB / Simulink", rating: 7 },
      { name: "Arduino & Embedded", rating: 8 },
      { name: "Raspberry Pi", rating: 7 },
      { name: "Solar Systems", rating: 9 },
    ],
    interests: ["Renewable Energy", "IoT", "Smart Grids", "Electronics"],
    portfolio: [],
    githubUrl: "",
    linkedinUrl: "",
    availability: "Looking for team members",
    profileCompleted: false,
    role: "builder",
    projectIds: ["p2"],
    joinedCommunityIds: [],
  },
  {
    id: "u4",
    name: "Zarina Nazarova",
    email: "zarina@buildnet.dev",
    school: "National University of Uzbekistan",
    country: "Uzbekistan",
    region: "Tashkent",
    major: "Biomedical Engineering",
    bio: "Biomedical engineer building affordable wearable health monitors.",
    avatarUrl: "",
    verified: false,
    builderScore: 590,
    skills: [
      { name: "Signal Processing", rating: 7 },
      { name: "Python / NumPy", rating: 7 },
      { name: "Medical Sensors", rating: 8 },
      { name: "Research & Writing", rating: 9 },
      { name: "Circuit Design", rating: 6 },
    ],
    interests: ["Health Tech", "Wearables", "Biomedical", "AI in Medicine"],
    portfolio: [],
    githubUrl: "",
    linkedinUrl: "",
    availability: "Looking for internship",
    profileCompleted: false,
    role: "builder",
    projectIds: ["p8"],
    joinedCommunityIds: ["c8"],
  },
  {
    id: "u5",
    name: "Jasur Abdullayev",
    email: "jasur@buildnet.dev",
    school: "Tashkent Aviation Institute",
    country: "Uzbekistan",
    region: "Tashkent",
    major: "Aerospace Engineering",
    bio: "Aerospace engineer working on UAVs, ROVs, and flight control systems.",
    avatarUrl: "",
    verified: true,
    builderScore: 780,
    skills: [
      { name: "Flight Mechanics", rating: 9 },
      { name: "MATLAB", rating: 8 },
      { name: "CAD / CATIA", rating: 7 },
      { name: "Control Systems", rating: 8 },
      { name: "C / C++", rating: 6 },
    ],
    interests: ["Drones", "Aerospace", "Fluid Dynamics", "Autonomous Systems"],
    portfolio: [],
    githubUrl: "https://github.com/jasura",
    linkedinUrl: "",
    availability: "Looking for team members",
    profileCompleted: true,
    role: "builder",
    projectIds: ["p3", "p7"],
    joinedCommunityIds: ["c1", "c7"],
  },
  {
    id: "u6",
    name: "Malika Mirzayeva",
    email: "malika@buildnet.dev",
    school: "INHA University in Tashkent",
    country: "Uzbekistan",
    region: "Samarkand",
    major: "Software Engineering",
    bio: "Software engineer building IoT and ML tools for agriculture.",
    avatarUrl: "",
    verified: false,
    builderScore: 710,
    skills: [
      { name: "Python / Django", rating: 8 },
      { name: "Machine Learning", rating: 7 },
      { name: "React", rating: 7 },
      { name: "Docker", rating: 6 },
      { name: "Data Analysis", rating: 8 },
    ],
    interests: ["AgTech", "Machine Learning", "IoT", "Sustainability"],
    portfolio: [],
    githubUrl: "",
    linkedinUrl: "",
    availability: "Looking for projects",
    profileCompleted: false,
    role: "builder",
    projectIds: ["p5"],
    joinedCommunityIds: [],
  },
];

// ─── Mock credential store ────────────────────────────────────────────────────
// Demo password for every seeded account below is "buildnet123".

export const accounts: Account[] = [
  { userId: "u1", email: "akbar@buildnet.dev", password: "buildnet123" },
  { userId: "u2", email: "dilnoza@buildnet.dev", password: "buildnet123" },
  { userId: "u3", email: "bobur@buildnet.dev", password: "buildnet123" },
  { userId: "u4", email: "zarina@buildnet.dev", password: "buildnet123" },
  { userId: "u5", email: "jasur@buildnet.dev", password: "buildnet123" },
  { userId: "u6", email: "malika@buildnet.dev", password: "buildnet123" },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "p1",
    title: "AutoDrone — Autonomous Delivery System",
    ownerId: "u1",
    disciplineId: "d7",
    description:
      "A fully autonomous hexacopter drone capable of last-mile package delivery in urban environments. Uses computer vision for obstacle avoidance and GPS-RTK for centimeter-level positioning. Currently being tested over 500m routes in Tashkent's Yunusabad district.",
    stage: "Testing",
    progress: 72,
    kind: "hardware",
    finished: false,
    lookingFor: ["Computer Vision Engineer", "Backend Developer", "Pilot / UAV Operator"],
    tags: ["drone", "autonomous", "computer-vision", "delivery", "GPS"],
    milestones: [
      { title: "Frame design & motor selection", done: true },
      { title: "Flight controller tuning (PX4)", done: true },
      { title: "Obstacle avoidance module", done: true },
      { title: "GPS-RTK precision landing", done: false },
      { title: "Payload mechanism design", done: false },
      { title: "Regulatory approval (CAA Uzbekistan)", done: false },
    ],
    updates: [
      { week: 6, text: "Successfully completed 12 consecutive autonomous flights over 300m routes with 0 incidents." },
      { week: 5, text: "Integrated RTK GPS. Positioning accuracy improved from ±2m to ±4cm." },
      { week: 4, text: "Rebuilt the frame after a crash during wind testing. New carbon fiber arms are 30% stiffer." },
      { week: 3, text: "First autonomous flight completed in a closed field. PX4 firmware is now stable." },
    ],
    teamMemberIds: ["u1", "u5"],
    upvotes: 84,
  },
  {
    id: "p2",
    title: "SolarTracker — Dual-Axis Arduino Panel System",
    ownerId: "u3",
    disciplineId: "d3",
    description:
      "A dual-axis solar panel tracking system built around an Arduino Mega and LDR sensors. Automatically follows the sun, increasing energy output by up to 35% compared to fixed panels.",
    stage: "Prototype",
    progress: 55,
    kind: "hardware",
    finished: false,
    lookingFor: ["Mechanical Engineer", "Data Logger / Firmware Dev"],
    tags: ["solar", "arduino", "renewable-energy", "IoT", "servo"],
    milestones: [
      { title: "LDR-based sun tracking algorithm", done: true },
      { title: "Dual-axis servo mount design", done: true },
      { title: "Arduino firmware — basic tracking", done: true },
      { title: "Energy output data logging", done: false },
      { title: "Weatherproof enclosure", done: false },
    ],
    updates: [
      { week: 4, text: "Tracking accuracy within 2° of optimal. Measured 28% improvement in output on a sunny test day." },
      { week: 3, text: "Switched from stepper to servo motors — smoother movement and lower power draw." },
    ],
    teamMemberIds: ["u3"],
    upvotes: 47,
  },
  {
    id: "p3",
    title: "AquaBot — River Monitoring Underwater ROV",
    ownerId: "u5",
    disciplineId: "d7",
    description:
      "A low-cost ROV for monitoring water quality and underwater conditions in the Syr Darya and Amu Darya rivers. Equipped with turbidity, pH, and temperature sensors.",
    stage: "Prototype",
    progress: 48,
    kind: "hardware",
    finished: false,
    lookingFor: ["Electronics Engineer", "Python Developer", "Marine / Env Science student"],
    tags: ["ROV", "water-quality", "sensors", "3D-printing", "underwater"],
    milestones: [
      { title: "Hull design & 3D printing", done: true },
      { title: "Thruster & control system", done: true },
      { title: "Sensor integration (pH, turbidity, temp)", done: false },
      { title: "Wireless video feed", done: false },
      { title: "Field test in Chirchiq river", done: false },
    ],
    updates: [
      { week: 3, text: "ROV is now diving to 3 meters reliably. Fixed the seal leak on the electronics bay." },
      { week: 2, text: "Thruster control working via ESP32. Manual control from laptop over Wi-Fi." },
    ],
    teamMemberIds: ["u5", "u1"],
    upvotes: 61,
  },
  {
    id: "p4",
    title: "TashMed — Telemedicine for Rural Uzbekistan",
    ownerId: "u2",
    disciplineId: "d6",
    description:
      "A lightweight telemedicine web app designed for low-bandwidth rural clinics in Uzbekistan. Supports video consultations, patient records, and prescriptions in Uzbek and Russian.",
    stage: "Testing",
    progress: 80,
    kind: "software",
    finished: false,
    lookingFor: ["Backend Developer", "Medical Advisor", "QA Tester"],
    tags: ["healthtech", "web-app", "Next.js", "telemedicine", "rural"],
    milestones: [
      { title: "Patient intake form & record system", done: true },
      { title: "Video consultation (WebRTC)", done: true },
      { title: "Prescription & medication tracking", done: true },
      { title: "Uzbek / Russian localization", done: true },
      { title: "Clinic onboarding (5 pilot clinics)", done: false },
      { title: "Ministry of Health review", done: false },
    ],
    updates: [
      { week: 8, text: "Pilot launched in 2 rural clinics in Fergana region. 14 consultations completed in first week." },
      { week: 7, text: "Fixed a critical bug where video would freeze on 3G connections. Now adaptive bitrate." },
    ],
    teamMemberIds: ["u2", "u6"],
    upvotes: 112,
  },
  {
    id: "p5",
    title: "SmartFarm — IoT Crop Monitoring Platform",
    ownerId: "u6",
    disciplineId: "d6",
    description:
      "An IoT platform connecting soil moisture sensors, weather stations, and drone imagery to give Fergana Valley farmers real-time crop health data. ML model predicts irrigation needs 48h ahead.",
    stage: "Prototype",
    progress: 42,
    kind: "software",
    finished: false,
    lookingFor: ["Hardware Engineer (sensors)", "Agronomist", "ML Engineer"],
    tags: ["IoT", "agtech", "machine-learning", "sensors", "sustainability"],
    milestones: [
      { title: "Sensor network architecture", done: true },
      { title: "Data pipeline (MQTT → InfluxDB)", done: true },
      { title: "Dashboard web app", done: false },
      { title: "Irrigation prediction ML model", done: false },
      { title: "Pilot farm deployment (Namangan)", done: false },
    ],
    updates: [
      { week: 3, text: "Data pipeline is live — sensors sending readings every 5 minutes with <1% packet loss." },
    ],
    teamMemberIds: ["u6", "u2"],
    upvotes: 58,
  },
  {
    id: "p6",
    title: "EduAI — Adaptive Learning for STEM Students",
    ownerId: "u2",
    disciplineId: "d6",
    description:
      "An adaptive learning platform that personalizes STEM lesson plans for high school students in Uzbekistan. Uses spaced repetition and mastery-based progression.",
    stage: "Final",
    progress: 91,
    kind: "software",
    finished: true,
    lookingFor: ["Content Creator (Physics)", "Mobile Developer"],
    tags: ["edtech", "adaptive-learning", "AI", "uzbekistan", "STEM"],
    milestones: [
      { title: "Spaced repetition engine", done: true },
      { title: "Physics curriculum (Grade 9–11)", done: true },
      { title: "Math curriculum (Grade 9–11)", done: true },
      { title: "Student progress dashboard", done: true },
      { title: "Teacher admin panel", done: true },
      { title: "Mobile app (React Native)", done: false },
    ],
    updates: [
      { week: 10, text: "300 students now using the platform across 3 pilot schools." },
      { week: 9, text: "A/B test: students on adaptive path scored 18% higher on weekly assessments." },
    ],
    teamMemberIds: ["u2", "u6", "u4"],
    upvotes: 138,
  },
  {
    id: "p7",
    title: "WindBoost — Small Wind Turbine Optimizer",
    ownerId: "u5",
    disciplineId: "d3",
    description:
      "A smart controller for small-scale (1–5 kW) wind turbines that dynamically adjusts blade pitch based on real-time wind data to maximize efficiency.",
    stage: "Idea",
    progress: 18,
    kind: "hardware",
    finished: false,
    lookingFor: ["Electrical Engineer", "Mechanical Engineer", "Embedded Developer"],
    tags: ["wind-energy", "renewable", "embedded", "control-systems"],
    milestones: [
      { title: "Wind resource analysis for Uzbekistan", done: true },
      { title: "Blade pitch control algorithm", done: false },
      { title: "Motor driver PCB design", done: false },
      { title: "Physical scale model", done: false },
    ],
    updates: [
      { week: 1, text: "Navoi and Bukhara regions average 7m/s — excellent for small turbines. Starting MATLAB simulation." },
    ],
    teamMemberIds: ["u5", "u3"],
    upvotes: 29,
  },
  {
    id: "p8",
    title: "BioSense — Wearable Health Monitor",
    ownerId: "u4",
    disciplineId: "d8",
    description:
      "A low-cost wearable that continuously monitors heart rate, SpO2, skin temperature, and motion. Data syncs to a mobile app and flags anomalies for elderly users.",
    stage: "Prototype",
    progress: 60,
    kind: "hardware",
    finished: false,
    lookingFor: ["Mobile App Developer", "Geriatrics Advisor", "PCB Designer"],
    tags: ["wearable", "health", "ESP32", "sensors", "elderly-care"],
    milestones: [
      { title: "Sensor selection & testing (MAX30105)", done: true },
      { title: "ESP32-S3 firmware — BLE data streaming", done: true },
      { title: "3D-printed wristband housing", done: true },
      { title: "Mobile app (data visualization)", done: false },
      { title: "Anomaly detection algorithm", done: false },
    ],
    updates: [
      { week: 5, text: "SpO2 accuracy validated against a clinical pulse oximeter — within 1% error." },
      { week: 4, text: "Battery life extended to 48h by implementing deep sleep between BLE transmissions." },
    ],
    teamMemberIds: ["u4", "u3"],
    upvotes: 73,
  },
];

// ─── Q&A Posts ────────────────────────────────────────────────────────────────

export const qaPosts: QAPost[] = [
  // Robotics
  {
    id: "qa1",
    disciplineId: "d7",
    authorId: "u1",
    title: "How do I tune a PID controller for a differential drive robot?",
    body: "I'm building a wheeled robot with two DC motors and an encoder on each wheel. I've implemented a basic PID loop in Arduino but the robot oscillates badly even with a small Kp. Is there a systematic way to tune the gains? My sampling rate is 50 Hz.",
    votes: 47,
    peerReviewed: true,
    createdAt: "2026-06-01T09:00:00Z",
  },
  {
    id: "qa2",
    disciplineId: "d7",
    authorId: "u5",
    title: "ROS2 vs custom firmware for a 6-DOF robot arm — what's the trade-off?",
    body: "We're debating whether to use ROS2 with MoveIt2 for motion planning on our robot arm project, or write lightweight custom firmware on an STM32. The arm needs sub-mm repeatability. ROS2 seems powerful but the overhead worries me for real-time control. Any experience here?",
    votes: 32,
    peerReviewed: false,
    createdAt: "2026-06-03T14:30:00Z",
  },
  // Aerospace
  {
    id: "qa3",
    disciplineId: "d1",
    authorId: "u5",
    title: "PX4 vs ArduPilot for a custom fixed-wing UAV — 2026 comparison?",
    body: "Starting a fixed-wing UAV project (2m wingspan, FPV + autonomous waypoints). Both PX4 and ArduPilot seem well-supported but I'm unsure which is better for a student with limited firmware experience. Criteria: good documentation, active community, easy to customize flight modes.",
    votes: 61,
    peerReviewed: true,
    createdAt: "2026-05-28T11:00:00Z",
  },
  {
    id: "qa4",
    disciplineId: "d1",
    authorId: "u1",
    title: "How to estimate propeller efficiency for a small multirotor at low Reynolds numbers?",
    body: "Working on the AutoDrone hexacopter. The UIUC propeller database doesn't have data for our 10\" props at the RPM range we operate (3000–6000 RPM). Is there a reliable way to estimate Ct/Cp at low Re, or should I just bench-test everything?",
    votes: 28,
    peerReviewed: false,
    createdAt: "2026-06-05T16:00:00Z",
  },
  // Software
  {
    id: "qa5",
    disciplineId: "d6",
    authorId: "u2",
    title: "WebRTC video freezing on 3G connections — how to implement adaptive bitrate?",
    body: "Building a telemedicine platform (TashMed) where rural clinics often have only 3G. WebRTC video works fine on Wi-Fi but freezes constantly on poor connections. I've tried tweaking the codec (VP8 → VP9) but the issue persists. Anyone implemented adaptive bitrate successfully in a Next.js app?",
    votes: 53,
    peerReviewed: true,
    createdAt: "2026-06-02T10:00:00Z",
  },
  {
    id: "qa6",
    disciplineId: "d6",
    authorId: "u6",
    title: "Time-series IoT data: InfluxDB vs TimescaleDB for a student project?",
    body: "SmartFarm sends sensor readings every 5 minutes from 50 nodes — about 14k data points/day. I'm using InfluxDB right now but considering switching to TimescaleDB since the rest of our stack is Postgres. Is the migration worth it at our scale? Any gotchas?",
    votes: 38,
    peerReviewed: false,
    createdAt: "2026-06-04T08:00:00Z",
  },
  // Electrical
  {
    id: "qa7",
    disciplineId: "d3",
    authorId: "u3",
    title: "Buck converter efficiency drops at low load — is this normal?",
    body: "Designed a 12V→5V buck converter for the SolarTracker using an LM2596. At full load (1A) I get 91% efficiency which seems fine. But at 100mA load it drops to 72%. Is this expected for this IC? Would a different topology (e.g. synchronous buck) help?",
    votes: 41,
    peerReviewed: true,
    createdAt: "2026-05-30T13:00:00Z",
  },
  // Biomedical
  {
    id: "qa8",
    disciplineId: "d8",
    authorId: "u4",
    title: "MAX30105 vs MAX30102 for wearable SpO2 — which is better?",
    body: "Building BioSense wearable. I've seen both ICs used for SpO2 + heart rate. The MAX30105 adds a green LED (useful for wrist-based HR) but costs more and has higher power draw. At 48h battery life target on a 300mAh cell, does the extra power matter? Also any tips on skin contact pressure for accuracy?",
    votes: 29,
    peerReviewed: false,
    createdAt: "2026-06-06T09:00:00Z",
  },
];

// ─── Q&A Comments ─────────────────────────────────────────────────────────────

export const qaComments: QAComment[] = [
  // qa1 - PID tuning
  {
    id: "c1",
    postId: "qa1",
    parentId: null,
    authorId: "u5",
    body: "The Ziegler–Nichols method is the classic starting point. Set Ki and Kd to zero, then raise Kp until you get sustained oscillation — that's your Ku. Then Kp = 0.6×Ku, Ki = 2×Kp/Tu, Kd = Kp×Tu/8. In practice this overshoots a bit so I usually back Kp down 20% after.",
    upvotes: 22,
    downvotes: 0,
    createdAt: "2026-06-01T09:45:00Z",
  },
  {
    id: "c2",
    postId: "qa1",
    parentId: "c1",
    authorId: "u1",
    body: "Thanks Jasur! Tried Z-N last week and the oscillation was better but still a bit jerky on sharp turns. I'll try backing Kp down by 20% as you suggest and see if the integral term is causing the jerks.",
    upvotes: 8,
    downvotes: 0,
    createdAt: "2026-06-01T11:00:00Z",
  },
  {
    id: "c3",
    postId: "qa1",
    parentId: null,
    authorId: "u2",
    body: "Also check your encoder interrupt handling. At 50 Hz sampling on an Arduino Uno, if the ISR is blocking the main loop for too long you'll get variable dt which breaks the integral term. Consider a hardware timer interrupt instead of loop().",
    upvotes: 18,
    downvotes: 1,
    createdAt: "2026-06-01T12:30:00Z",
  },
  {
    id: "c4",
    postId: "qa1",
    parentId: "c3",
    authorId: "u1",
    body: "Oh, that's actually exactly what I suspected. I'm using attachInterrupt() but reading the encoders inside loop(). Switching to a proper timer ISR this weekend.",
    upvotes: 5,
    downvotes: 0,
    createdAt: "2026-06-01T13:00:00Z",
  },
  {
    id: "c5",
    postId: "qa1",
    parentId: null,
    authorId: "u6",
    body: "If you want to skip manual tuning, look into auto-tuning libraries for Arduino — the ArduPID library has a built-in auto-tune mode based on relay feedback. Worked well for my motor controller project.",
    upvotes: 12,
    downvotes: 2,
    createdAt: "2026-06-02T08:00:00Z",
  },
  // qa2 - ROS2 vs custom firmware
  {
    id: "c6",
    postId: "qa2",
    parentId: null,
    authorId: "u1",
    body: "We went with a hybrid approach on AutoDrone: ROS2 on a Raspberry Pi 4 for high-level planning (waypoints, vision), and a dedicated flight controller (Pixhawk) for the real-time control loop. MAVLink connects the two. Highly recommend this pattern — ROS2 overhead never touches the PID.",
    upvotes: 25,
    downvotes: 0,
    createdAt: "2026-06-03T15:00:00Z",
  },
  {
    id: "c7",
    postId: "qa2",
    parentId: "c6",
    authorId: "u5",
    body: "This is what I was leaning toward. For sub-mm repeatability the STM32 real-time loop is non-negotiable, but MoveIt2 for trajectory planning is too convenient to skip. Is the MAVLink latency an issue for you?",
    upvotes: 9,
    downvotes: 0,
    createdAt: "2026-06-03T15:45:00Z",
  },
  // qa3 - PX4 vs ArduPilot
  {
    id: "c8",
    postId: "qa3",
    parentId: null,
    authorId: "u1",
    body: "PX4 for fixed-wing if you plan to do any custom flight modes — the architecture is cleaner for that. ArduPilot has better community Q&A and more out-of-box vehicle configurations. I use PX4 on AutoDrone and the UAVCAN ecosystem is excellent.",
    upvotes: 31,
    downvotes: 2,
    createdAt: "2026-05-28T12:00:00Z",
  },
  {
    id: "c9",
    postId: "qa3",
    parentId: null,
    authorId: "u6",
    body: "Documentation-wise, PX4's Dev Guide is much better structured. ArduPilot's wiki can be overwhelming for a first project. If documentation is your main criterion, go PX4.",
    upvotes: 19,
    downvotes: 1,
    createdAt: "2026-05-28T14:00:00Z",
  },
  // qa5 - WebRTC
  {
    id: "c10",
    postId: "qa5",
    parentId: null,
    authorId: "u6",
    body: "Solved something similar for SmartFarm's monitoring feed. The key is implementing bandwidth estimation on the receiver side and feeding it back to the sender via RTCP. In simple-peer (which Next.js apps often use), you can hook into the RTCPeerConnection stats API. Happy to share the code snippet.",
    upvotes: 28,
    downvotes: 0,
    createdAt: "2026-06-02T11:00:00Z",
  },
  {
    id: "c11",
    postId: "qa5",
    parentId: "c10",
    authorId: "u2",
    body: "Yes please share — I've been fighting this for two weeks. Also considering Agora or Daily.co as managed services but don't want vendor lock-in for a healthcare app.",
    upvotes: 11,
    downvotes: 0,
    createdAt: "2026-06-02T12:00:00Z",
  },
  {
    id: "c12",
    postId: "qa5",
    parentId: null,
    authorId: "u4",
    body: "Also consider the video codec — H.264 (with HW acceleration on mobile) often performs better than VP9 at very low bitrates (<200kbps). We've seen this in some medical device demos.",
    upvotes: 16,
    downvotes: 0,
    createdAt: "2026-06-02T14:30:00Z",
  },
  // qa7 - Buck converter
  {
    id: "c13",
    postId: "qa7",
    parentId: null,
    authorId: "u5",
    body: "Yes, completely normal for a non-synchronous (diode) buck converter. The switching losses dominate at light load. Synchronous buck (MOSFETs instead of diode) will give you 85-90% even at 100mA. Look at the TPS54xxx family from TI — many have auto-skip mode for light loads.",
    upvotes: 24,
    downvotes: 0,
    createdAt: "2026-05-30T14:00:00Z",
  },
  {
    id: "c14",
    postId: "qa7",
    parentId: "c13",
    authorId: "u3",
    body: "That makes sense. The SolarTracker spends most of its time in standby between tracking adjustments so light-load efficiency is actually important. Will look at TPS54360.",
    upvotes: 7,
    downvotes: 0,
    createdAt: "2026-05-30T15:00:00Z",
  },
  // qa8 - MAX30105
  {
    id: "c15",
    postId: "qa8",
    parentId: null,
    authorId: "u3",
    body: "For wrist-based measurement the green LED of MAX30105 is genuinely useful — green penetrates shallower and works better on wrists vs fingertips. But if power is critical, MAX30102 in finger-clip mode is more accurate for SpO2. At 300mAh with deep sleep between readings you should be fine with MAX30105.",
    upvotes: 18,
    downvotes: 0,
    createdAt: "2026-06-06T10:30:00Z",
  },
  {
    id: "c16",
    postId: "qa8",
    parentId: "c15",
    authorId: "u4",
    body: "Perfect, that confirms what I suspected. We're targeting wrist wear so green LED is valuable. I'll stick with MAX30105. For skin pressure I've been reading that a light spring mechanism gives more consistent contact than just relying on a strap — going to try that next.",
    upvotes: 8,
    downvotes: 0,
    createdAt: "2026-06-06T11:00:00Z",
  },
];

// ─── Resources ────────────────────────────────────────────────────────────────

export const resources: Resource[] = [
  // Robotics
  { id: "r1", disciplineId: "d7", title: "ROS2 Documentation (Humble)", url: "https://docs.ros.org/en/humble/", description: "Official ROS2 docs — tutorials, API reference, and architecture guides.", votes: 48, addedById: "u1" },
  { id: "r2", disciplineId: "d7", title: "PX4 Autopilot Developer Guide", url: "https://docs.px4.io/main/en/", description: "Full guide for PX4 flight stack — from hardware selection to custom flight modes.", votes: 39, addedById: "u1" },
  { id: "r3", disciplineId: "d7", title: "Webots Robot Simulator (free)", url: "https://cyberbotics.com", description: "Open-source robot simulator. Great for testing control algorithms before hardware.", votes: 31, addedById: "u5" },
  { id: "r4", disciplineId: "d7", title: "Modern Robotics — Coursera (Lynch & Park)", url: "https://modernrobotics.northwestern.edu", description: "Free textbook + video series on robot kinematics, dynamics, and motion planning.", votes: 27, addedById: "u1" },
  // Aerospace
  { id: "r5", disciplineId: "d1", title: "NASA Technical Reports Server", url: "https://ntrs.nasa.gov", description: "Free access to decades of NASA engineering reports and research papers.", votes: 56, addedById: "u5" },
  { id: "r6", disciplineId: "d1", title: "OpenVSP — Aircraft Geometry Tool", url: "https://openvsp.org", description: "NASA's parametric aircraft geometry tool. Free, widely used in industry.", votes: 44, addedById: "u5" },
  { id: "r7", disciplineId: "d1", title: "XFOIL Airfoil Analysis", url: "https://web.mit.edu/drela/Public/web/xfoil/", description: "MIT tool for subsonic airfoil aerodynamic analysis. Essential for wing design.", votes: 38, addedById: "u5" },
  { id: "r8", disciplineId: "d1", title: "Introduction to Flight — Anderson (6th ed.)", url: "https://www.mheducation.com", description: "Classic textbook covering aerodynamics, aircraft performance and propulsion.", votes: 29, addedById: "u1" },
  // Software / CS
  { id: "r9", disciplineId: "d6", title: "The Missing Semester of Your CS Education (MIT)", url: "https://missing.csail.mit.edu", description: "Practical shell, git, debugging, and tooling skills that CS degrees skip.", votes: 71, addedById: "u2" },
  { id: "r10", disciplineId: "d6", title: "Roadmap.sh — Developer Learning Paths", url: "https://roadmap.sh", description: "Community-built visual roadmaps for frontend, backend, DevOps, and more.", votes: 62, addedById: "u6" },
  { id: "r11", disciplineId: "d6", title: "CS50x — Harvard (free)", url: "https://cs50.harvard.edu/x/", description: "Best intro CS course online. Covers C, Python, SQL, web. Completely free.", votes: 55, addedById: "u2" },
  { id: "r12", disciplineId: "d6", title: "Designing Data-Intensive Applications — Kleppmann", url: "https://dataintensive.net", description: "The best book on distributed systems, databases and data engineering for practitioners.", votes: 49, addedById: "u2" },
  // Electrical
  { id: "r13", disciplineId: "d3", title: "All About Circuits — Free Textbooks", url: "https://www.allaboutcircuits.com/textbook/", description: "Free online textbooks covering DC, AC, semiconductors, and digital circuits.", votes: 43, addedById: "u3" },
  { id: "r14", disciplineId: "d3", title: "KiCad EDA (free, open-source)", url: "https://www.kicad.org", description: "Industry-grade PCB design tool. Used by CERN. Completely free and open-source.", votes: 37, addedById: "u3" },
  { id: "r15", disciplineId: "d3", title: "LTspice Simulator (free)", url: "https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html", description: "Free SPICE circuit simulator from Analog Devices. Essential for analog design.", votes: 31, addedById: "u3" },
  // Biomedical
  { id: "r16", disciplineId: "d8", title: "PhysioNet — Open Clinical Data", url: "https://physionet.org", description: "Free access to large physiological signal databases (ECG, EEG, PPG). Great for sensor validation.", votes: 22, addedById: "u4" },
  { id: "r17", disciplineId: "d8", title: "3D Slicer — Medical Imaging Platform", url: "https://www.slicer.org", description: "Free, open-source platform for medical image informatics. Used in research hospitals.", votes: 18, addedById: "u4" },
  { id: "r18", disciplineId: "d8", title: "IEEE Xplore — BME Journal Access", url: "https://ieeexplore.ieee.org", description: "Access IEEE Transactions on Biomedical Engineering and other key journals.", votes: 15, addedById: "u4" },
];

// ─── Opportunities ────────────────────────────────────────────────────────────

export const opportunities: Opportunity[] = [
  { id: "o1", disciplineId: "d3", title: "Siemens Engineering Internship — Digital Industries", category: "Internship", country: "Germany", field: "Electrical / Automation Engineering", deadline: "2026-08-31", link: "#" },
  { id: "o2", disciplineId: "d7", title: "FIRST Robotics Competition — Central Asia Regional", category: "Competition", country: "Kazakhstan", field: "Robotics & Mechatronics", deadline: "2026-09-15", link: "#" },
  { id: "o3", disciplineId: null, title: "Aga Khan Foundation STEM Scholarship", category: "Scholarship", country: "International", field: "Engineering & Sciences", deadline: "2026-10-01", link: "#" },
  { id: "o4", disciplineId: "d3", title: "MIT Energy Initiative Undergraduate Research", category: "Research", country: "USA", field: "Renewable Energy / Clean Tech", deadline: "2026-11-15", link: "#" },
  { id: "o5", disciplineId: null, title: "Uzbekistan National Innovation Fund Grant", category: "Grant", country: "Uzbekistan", field: "Technology & Startups", deadline: "2026-07-30", link: "#" },
  { id: "o6", disciplineId: "d1", title: "NASA Space Apps Challenge", category: "Competition", country: "USA", field: "Aerospace / Software", deadline: "2026-10-05", link: "#" },
];

// ─── Communities ──────────────────────────────────────────────────────────────

const STANDARD_CHANNELS: Channel[] = [
  { id: "general", name: "general" },
  { id: "help", name: "help" },
  { id: "showcase", name: "showcase" },
  { id: "resources", name: "resources" },
];

export const communities: Community[] = [
  { id: "c1", name: "Aerospace Community", disciplineId: "d1", channels: STANDARD_CHANNELS, memberIds: ["u5"] },
  { id: "c6", name: "Software / CS Community", disciplineId: "d6", channels: STANDARD_CHANNELS, memberIds: ["u2", "u6"] },
  { id: "c7", name: "Robotics Community", disciplineId: "d7", channels: STANDARD_CHANNELS, memberIds: ["u1", "u5"] },
  { id: "c8", name: "Biomedical Community", disciplineId: "d8", channels: STANDARD_CHANNELS, memberIds: ["u4"] },
];

export const channelMessages: ChannelMessage[] = [
  { id: "cm1", communityId: "c7", channelId: "general", authorId: "u1", body: "Hey everyone — sharing the PX4 firmware fork I've been using for AutoDrone. Happy to answer questions.", createdAt: "2026-06-10T09:00:00Z" },
  { id: "cm2", communityId: "c7", channelId: "general", authorId: "u5", body: "Thanks Akbar! I've been looking for exactly this for the AquaBot thruster controller. Does it support variable RPM via CAN?", createdAt: "2026-06-10T09:15:00Z" },
  { id: "cm3", communityId: "c7", channelId: "general", authorId: "u1", body: "Yes — full UAVCAN v1 support. Tested up to 4 ESCs. Ping me if you run into issues.", createdAt: "2026-06-10T09:30:00Z" },
  { id: "cm4", communityId: "c6", channelId: "general", authorId: "u2", body: "Just shipped the WebRTC adaptive bitrate fix for TashMed. Finally stable on 3G. Will write a post about it.", createdAt: "2026-06-11T10:00:00Z" },
  { id: "cm5", communityId: "c6", channelId: "general", authorId: "u6", body: "Please do — I need this for SmartFarm's monitoring feed. Is the fix reusable?", createdAt: "2026-06-11T10:20:00Z" },
  { id: "cm6", communityId: "c1", channelId: "general", authorId: "u5", body: "Anyone interested in the CubeSat cohort? Looking for an EE and a SW dev to start. Posting in Foundry soon.", createdAt: "2026-06-12T08:00:00Z" },
  { id: "cm7", communityId: "c8", channelId: "general", authorId: "u4", body: "Validated MAX30105 SpO2 accuracy today — within 1% of clinical oximeter across 10 test subjects. Very happy!", createdAt: "2026-06-13T14:00:00Z" },
  { id: "cm8", communityId: "c7", channelId: "showcase", authorId: "u5", body: "AquaBot just hit 3m dive depth reliably. Seal fix worked perfectly. Video coming soon!", createdAt: "2026-06-14T11:00:00Z" },
  { id: "cm9", communityId: "c6", channelId: "help", authorId: "u6", body: "Anyone have experience with MQTT broker setup on a low-RAM VPS? SmartFarm's broker keeps OOM-killing.", createdAt: "2026-06-15T08:30:00Z" },
  { id: "cm10", communityId: "c6", channelId: "help", authorId: "u2", body: "Switch to EMQX — it's way more memory-efficient than Mosquitto at scale. We use it for TashMed.", createdAt: "2026-06-15T09:00:00Z" },
  { id: "cm11", communityId: "c7", channelId: "resources", authorId: "u1", body: "Dropping the Webots scene file for the robot arm simulation. DM me if you want the ROS2 bridge config.", createdAt: "2026-06-16T10:00:00Z" },
];

export const directMessages: DirectMessage[] = [
  { id: "dm1", fromId: "u1", toId: "u5", body: "Hey Jasur — are you free to pair on the AquaBot thruster firmware this week?", createdAt: "2026-06-14T12:00:00Z" },
  { id: "dm2", fromId: "u5", toId: "u1", body: "Yes! Thursday afternoon works. I'll share my current CAN bus config beforehand.", createdAt: "2026-06-14T12:30:00Z" },
  { id: "dm3", fromId: "u2", toId: "u6", body: "Hey Malika — can you share the MQTT fix you mentioned? TashMed has the same issue.", createdAt: "2026-06-15T10:00:00Z" },
  { id: "dm4", fromId: "u6", toId: "u2", body: "Sure! It's just a config change in mosquitto.conf. I'll send a gist.", createdAt: "2026-06-15T10:15:00Z" },
];

// ─── Cohorts (Foundry) ────────────────────────────────────────────────────────

export const cohorts: Cohort[] = [
  {
    id: "co1",
    title: "Open-Source Robot Arm",
    goal: "Build a 6-DOF robot arm with sub-millimeter repeatability, fully open-source hardware + firmware, priced under $300.",
    disciplineId: "d7",
    ownerId: "u1",
    memberIds: ["u1", "u5"],
    teamSize: 5,
    rolesOpen: ["Firmware Engineer", "Mechanical Engineer", "CAD Designer"],
    description: "We want to make industrial-grade robot arm accuracy accessible to university labs and makers. Two phases: SCARA first, then full 6-axis. All design files published under CC-BY-SA.",
  },
  {
    id: "co2",
    title: "CubeSat for Climate Monitoring",
    goal: "Design and simulate a 1U CubeSat to monitor Central Asian dust storms using hyperspectral imaging.",
    disciplineId: "d1",
    ownerId: "u5",
    memberIds: ["u5"],
    teamSize: 5,
    rolesOpen: ["Electrical Engineer", "Software Developer", "Structural Engineer", "GNC Engineer"],
    description: "Inspired by Central Asia's growing climate challenges. Initial deliverable: full simulation model and CDR-level design docs. No launch planned yet — this is a design + sim project.",
  },
  {
    id: "co3",
    title: "Tashkent Air Quality IoT Network",
    goal: "Deploy 20 low-cost air quality sensors across Tashkent and publish real-time PM2.5 / NOx data publicly.",
    disciplineId: "d10",
    ownerId: "u3",
    memberIds: ["u3", "u6"],
    teamSize: 4,
    rolesOpen: ["Hardware Engineer", "Backend Developer"],
    description: "Air quality data in Uzbekistan is sparse and often not public. This project fills that gap with open data and open hardware. Sensor BOM cost target: under $40 per node.",
  },
  {
    id: "co4",
    title: "Adaptive STEM Learning Engine (Open Source)",
    goal: "Build the core adaptive algorithm and API that other EdTech apps can plug into — a shared open-source learning engine.",
    disciplineId: "d6",
    ownerId: "u2",
    memberIds: ["u2"],
    teamSize: 4,
    rolesOpen: ["Backend Developer", "ML Engineer", "Frontend Developer"],
    description: "EduAI proved the concept in a closed app. Now we're abstracting the spaced-repetition + mastery engine into a standalone open API. Target: launch on Product Hunt and submit to OSSAR 2026.",
  },
];

// ─── Cohort join requests ────────────────────────────────────────────────────

export const joinRequests: JoinRequest[] = [];

// ─── Field Tools ─────────────────────────────────────────────────────────────

export const FIELD_TOOLS: Record<string, FieldTool[]> = {
  aerospace: [
    { name: "OpenVSP", description: "Parametric aircraft geometry tool from NASA", url: "https://openvsp.org", free: true, category: "Design" },
    { name: "XFOIL", description: "Subsonic airfoil aerodynamic analysis (MIT)", url: "https://web.mit.edu/drela/Public/web/xfoil/", free: true, category: "Aerodynamics" },
    { name: "AVL", description: "Vortex lattice method for aerodynamics + flight dynamics", url: "https://web.mit.edu/drela/Public/web/avl/", free: true, category: "Aerodynamics" },
    { name: "MATLAB / Simulink", description: "Simulation, control design and data analysis", url: "https://mathworks.com", free: false, category: "Simulation" },
    { name: "OpenFOAM", description: "Open-source CFD solver used in research and industry", url: "https://openfoam.org", free: true, category: "CFD" },
    { name: "ANSYS Fluent", description: "Industry-standard CFD simulation suite", url: "https://www.ansys.com", free: false, category: "CFD" },
  ],
  mechanical: [
    { name: "FreeCAD", description: "Free, open-source parametric 3D CAD modeler", url: "https://freecad.org", free: true, category: "CAD" },
    { name: "Fusion 360", description: "Cloud-based CAD/CAM/CAE tool — free for students", url: "https://www.autodesk.com/products/fusion-360", free: true, category: "CAD" },
    { name: "SolidWorks", description: "Industry-standard 3D CAD and simulation suite", url: "https://www.solidworks.com", free: false, category: "CAD" },
    { name: "ANSYS Mechanical", description: "FEA structural and thermal simulation", url: "https://www.ansys.com", free: false, category: "FEA" },
    { name: "OpenSCAD", description: "Script-based 3D CAD for programmers", url: "https://openscad.org", free: true, category: "CAD" },
    { name: "MATLAB", description: "Numerical computation and simulation", url: "https://mathworks.com", free: false, category: "Simulation" },
  ],
  electrical: [
    { name: "KiCad", description: "Free, open-source PCB design tool (used by CERN)", url: "https://www.kicad.org", free: true, category: "PCB Design" },
    { name: "LTspice", description: "Free SPICE circuit simulator from Analog Devices", url: "https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html", free: true, category: "Simulation" },
    { name: "Multisim", description: "Circuit simulation with virtual instruments", url: "https://www.ni.com/multisim", free: false, category: "Simulation" },
    { name: "MATLAB / Simulink", description: "Signal processing, control systems and DSP", url: "https://mathworks.com", free: false, category: "Simulation" },
    { name: "Proteus", description: "PCB design + embedded simulation (Arduino, PIC)", url: "https://www.labcenter.com", free: false, category: "PCB + Sim" },
    { name: "TI WebBench", description: "Free online tool to design and simulate TI power supplies", url: "https://webench.ti.com", free: true, category: "Power Design" },
  ],
  civil: [
    { name: "AutoCAD Civil 3D", description: "Industry standard for civil drafting and site design", url: "https://www.autodesk.com/products/civil-3d", free: false, category: "Design" },
    { name: "SAP2000", description: "Structural analysis and design software", url: "https://www.csiamerica.com/products/sap2000", free: false, category: "Structural" },
    { name: "OpenSees", description: "Open-source earthquake engineering simulation framework", url: "https://opensees.berkeley.edu", free: true, category: "Structural" },
    { name: "QGIS", description: "Free, open-source geographic information system", url: "https://qgis.org", free: true, category: "GIS" },
    { name: "HEC-RAS", description: "Free river analysis system from US Army Corps of Engineers", url: "https://www.hec.usace.army.mil/software/hec-ras/", free: true, category: "Hydraulics" },
    { name: "ETABS", description: "Building analysis and design for multi-story structures", url: "https://www.csiamerica.com/products/etabs", free: false, category: "Structural" },
  ],
  chemical: [
    { name: "DWSIM (free)", description: "Open-source chemical process simulator", url: "https://dwsim.org", free: true, category: "Process Sim" },
    { name: "ASPEN Plus", description: "Industry-standard chemical process simulation", url: "https://www.aspentech.com", free: false, category: "Process Sim" },
    { name: "ChemDraw", description: "Chemical structure drawing and property prediction", url: "https://revvitysignals.com/products/research/chemdraw", free: false, category: "Chemistry" },
    { name: "MATLAB", description: "Numerical methods for reaction engineering problems", url: "https://mathworks.com", free: false, category: "Computation" },
    { name: "GAMS", description: "Optimization modeling system for process design", url: "https://www.gams.com", free: false, category: "Optimization" },
    { name: "Cantera", description: "Open-source toolbox for thermodynamics and combustion", url: "https://cantera.org", free: true, category: "Thermodynamics" },
  ],
  software: [
    { name: "VS Code", description: "Free, extensible code editor from Microsoft", url: "https://code.visualstudio.com", free: true, category: "Editor" },
    { name: "GitHub", description: "Version control, CI/CD, and collaboration platform", url: "https://github.com", free: true, category: "DevOps" },
    { name: "Docker", description: "Container platform for consistent dev environments", url: "https://www.docker.com", free: true, category: "DevOps" },
    { name: "Figma", description: "Collaborative UI/UX design tool — free for students", url: "https://www.figma.com", free: true, category: "Design" },
    { name: "Vercel", description: "Instant deployments for Next.js and frontend projects", url: "https://vercel.com", free: true, category: "Deployment" },
    { name: "Postman", description: "API development, testing and documentation", url: "https://www.postman.com", free: true, category: "API" },
  ],
  robotics: [
    { name: "ROS2 (Humble / Jazzy)", description: "Open-source robotics middleware — the industry standard", url: "https://docs.ros.org", free: true, category: "Middleware" },
    { name: "Gazebo Simulator", description: "3D robot simulation integrated with ROS", url: "https://gazebosim.org", free: true, category: "Simulation" },
    { name: "Webots", description: "Fast open-source robot simulator, no ROS required", url: "https://cyberbotics.com", free: true, category: "Simulation" },
    { name: "Arduino IDE", description: "Simple environment for microcontroller programming", url: "https://www.arduino.cc/en/software", free: true, category: "Embedded" },
    { name: "MATLAB Robotics Toolbox", description: "Kinematics, dynamics and trajectory planning tools", url: "https://mathworks.com/products/robotics.html", free: false, category: "Computation" },
    { name: "PyBullet", description: "Physics simulation for robotics in Python — free", url: "https://pybullet.org", free: true, category: "Simulation" },
  ],
  biomedical: [
    { name: "MATLAB + Signal Processing TB", description: "Bio-signal analysis: ECG, EEG, EMG filtering", url: "https://mathworks.com", free: false, category: "Signal Processing" },
    { name: "Python + SciPy / MNE", description: "Free open-source biosignal processing in Python", url: "https://mne.tools", free: true, category: "Signal Processing" },
    { name: "3D Slicer", description: "Open-source medical image informatics platform", url: "https://www.slicer.org", free: true, category: "Medical Imaging" },
    { name: "COMSOL Multiphysics", description: "FEA simulation for biological tissue and heat transfer", url: "https://www.comsol.com", free: false, category: "Simulation" },
    { name: "LabVIEW", description: "Graphical programming for data acquisition and instruments", url: "https://www.ni.com/labview", free: false, category: "Instrumentation" },
    { name: "OpenBCI GUI", description: "Free tool for EEG/EMG/ECG data acquisition", url: "https://openbci.com", free: true, category: "Biosensing" },
  ],
  materials: [
    { name: "VESTA", description: "Free 3D visualization for crystal structures", url: "https://jp-minerals.org/vesta/en/", free: true, category: "Crystal Structure" },
    { name: "LAMMPS", description: "Open-source molecular dynamics simulator", url: "https://www.lammps.org", free: true, category: "Molecular Dynamics" },
    { name: "Materials Project", description: "Free database of computed material properties", url: "https://materialsproject.org", free: true, category: "Database" },
    { name: "Abaqus", description: "Advanced FEA for materials and structural simulation", url: "https://www.3ds.com/products/simulia/abaqus", free: false, category: "FEA" },
    { name: "ImageJ / FIJI", description: "Free image analysis for microscopy and materials characterization", url: "https://fiji.sc", free: true, category: "Characterization" },
    { name: "OriginLab", description: "Scientific graphing and data analysis software", url: "https://www.originlab.com", free: false, category: "Data Analysis" },
  ],
  environmental: [
    { name: "QGIS", description: "Free, open-source GIS for spatial environmental analysis", url: "https://qgis.org", free: true, category: "GIS" },
    { name: "EPA SWMM", description: "Free stormwater management model from US EPA", url: "https://www.epa.gov/water-research/storm-water-management-model-swmm", free: true, category: "Hydrology" },
    { name: "EPANET", description: "Free water distribution system modeling tool (EPA)", url: "https://www.epa.gov/water-research/epanet", free: true, category: "Water Systems" },
    { name: "HEC-RAS", description: "River hydraulics and flood modeling (US Army Corps)", url: "https://www.hec.usace.army.mil/software/hec-ras/", free: true, category: "Hydraulics" },
    { name: "OpenLCA", description: "Open-source life cycle assessment software", url: "https://www.openlca.org", free: true, category: "LCA" },
    { name: "SAM (Solar Analysis Model)", description: "Free NREL tool for solar and wind energy system modeling", url: "https://sam.nrel.gov", free: true, category: "Renewable Energy" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const MOCK_CURRENT_USER_ID = "u1";

let guestCounter = 0;

/** Finds an existing user by email or creates a new auto-approved one for Google OAuth sign-in. */
export function loginOrCreateGoogleUser(email: string, name: string, avatarUrl: string): User {
  const existing = findUserByEmail(email);
  if (existing) return existing;
  const user = createGuestUser();
  user.name = name || email.split("@")[0];
  user.email = email;
  user.avatarUrl = avatarUrl;
  users.push(user);
  return user;
}

/** Creates a brand-new, empty profile for a freshly "signed up" mock user. */
export function createGuestUser(): User {
  guestCounter += 1;
  return {
    id: `guest-${Date.now()}-${guestCounter}`,
    name: "",
    email: "",
    school: "",
    country: "",
    region: "",
    major: "",
    bio: "",
    avatarUrl: "",
    verified: false,
    builderScore: 0,
    skills: [],
    interests: [],
    portfolio: [],
    githubUrl: "",
    linkedinUrl: "",
    availability: "Not available",
    profileCompleted: false,
    role: "builder",
    projectIds: [],
    joinedCommunityIds: [],
  };
}

// ─── Auth (mock/local — not secure, demo only) ────────────────────────────────

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

/** Looks up credentials and returns the matching user, or null if invalid. */
export function verifyCredentials(email: string, password: string): User | null {
  const account = accounts.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  );
  if (!account) return null;
  return getUserById(account.userId) ?? null;
}

/** Registers a brand-new account + user. Returns an error string on failure. */
export function registerAccount(
  name: string,
  email: string,
  password: string
): { user: User } | { error: string } {
  if (findUserByEmail(email)) {
    return { error: "An account with this email already exists." };
  }
  const user = createGuestUser();
  user.name = name.trim();
  user.email = email.trim();
  users.push(user);
  accounts.push({ userId: user.id, email: user.email, password });
  return { user };
}

/** Mock: connect a user to GitHub or LinkedIn to set them as verified. */
export function connectVerification(userId: string, provider: "github" | "linkedin") {
  const user = getUserById(userId);
  if (user) {
    user.verified = true;
    user.verificationProvider = provider;
  }
}

export function getUserById(id: string) { return users.find((u) => u.id === id); }
export function getProjectById(id: string) { return projects.find((p) => p.id === id); }
export function getProjectsByIds(ids: string[]) { return projects.filter((p) => ids.includes(p.id)); }
export function getDisciplineBySlug(slug: string) { return disciplines.find((d) => d.slug === slug); }
export function getDisciplineById(id: string) { return disciplines.find((d) => d.id === id); }
export function getProjectsByDiscipline(disciplineId: string) { return projects.filter((p) => p.disciplineId === disciplineId); }
export function getQAPostsByDiscipline(disciplineId: string) { return qaPosts.filter((q) => q.disciplineId === disciplineId); }
export function getQACommentsByPost(postId: string) { return qaComments.filter((c) => c.postId === postId); }
export function getResourcesByDiscipline(disciplineId: string) { return resources.filter((r) => r.disciplineId === disciplineId).sort((a, b) => b.votes - a.votes); }
export function getOpportunitiesByDiscipline(disciplineId: string) { return opportunities.filter((o) => o.disciplineId === disciplineId || o.disciplineId === null); }
export function getCommunityById(id: string) { return communities.find((c) => c.id === id); }
export function getCommunityByDiscipline(disciplineId: string) { return communities.find((c) => c.disciplineId === disciplineId); }
export function getChannelMessages(communityId: string, channelId: string) {
  return channelMessages.filter((m) => m.communityId === communityId && m.channelId === channelId);
}
export function addChannelMessage(communityId: string, channelId: string, authorId: string, body: string) {
  channelMessages.push({
    id: `cm-${Date.now()}`,
    communityId,
    channelId,
    authorId,
    body,
    createdAt: new Date().toISOString(),
  });
}
export function getDirectMessages(userA: string, userB: string) {
  return directMessages.filter(
    (m) => (m.fromId === userA && m.toId === userB) || (m.fromId === userB && m.toId === userA)
  ).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
export function getDMConversations(userId: string) {
  const seen = new Set<string>();
  const convos: string[] = [];
  directMessages
    .filter((m) => m.fromId === userId || m.toId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .forEach((m) => {
      const other = m.fromId === userId ? m.toId : m.fromId;
      if (!seen.has(other)) { seen.add(other); convos.push(other); }
    });
  return convos;
}
export function addDirectMessage(fromId: string, toId: string, body: string) {
  directMessages.push({ id: `dm-${Date.now()}`, fromId, toId, body, createdAt: new Date().toISOString() });
}
export function getCohortById(id: string) { return cohorts.find((c) => c.id === id); }
export function getCohortsByDiscipline(disciplineId: string) { return cohorts.filter((c) => c.disciplineId === disciplineId); }

// ─── Cohort join requests ─────────────────────────────────────────────────────

export function getJoinRequestsByCohort(cohortId: string) {
  return joinRequests.filter((r) => r.cohortId === cohortId);
}
export function getPendingRequests(cohortId: string) {
  return joinRequests.filter((r) => r.cohortId === cohortId && r.status === "requested");
}
export function hasRequestedToJoin(cohortId: string, userId: string) {
  return joinRequests.some((r) => r.cohortId === cohortId && r.userId === userId && r.status === "requested");
}

/** Creates a join request, unless the user already requested or is already a member. */
export function requestToJoinCohort(cohortId: string, userId: string) {
  const cohort = getCohortById(cohortId);
  if (!cohort || cohort.memberIds.includes(userId)) return;
  if (hasRequestedToJoin(cohortId, userId)) return;
  joinRequests.push({
    id: `jr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    cohortId,
    userId,
    status: "requested",
    createdAt: new Date().toISOString(),
  });
}

/** Approves a request — folds the requester into the cohort's members and clears the request. */
export function approveJoinRequest(requestId: string) {
  const request = joinRequests.find((r) => r.id === requestId);
  if (!request) return;
  const cohort = getCohortById(request.cohortId);
  if (cohort && !cohort.memberIds.includes(request.userId)) {
    cohort.memberIds.push(request.userId);
  }
  const idx = joinRequests.indexOf(request);
  if (idx !== -1) joinRequests.splice(idx, 1);
}

/** Rejects (removes) a pending request. */
export function rejectJoinRequest(requestId: string) {
  const idx = joinRequests.findIndex((r) => r.id === requestId);
  if (idx !== -1) joinRequests.splice(idx, 1);
}
