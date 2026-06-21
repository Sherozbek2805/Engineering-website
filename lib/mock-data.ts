// ─── Types ────────────────────────────────────────────────────────────────────

export type Skill = { name: string; rating: number };

export type PortfolioItem = { title: string; url: string };

export type Extracurricular = {
  name: string;
  role: string;
  description: string;
  hoursPerWeek?: number;
  yearsActive?: string;
};

export type Honor = {
  name: string;
  organization?: string;
  year?: string;
  description?: string;
};

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
  extracurriculars: Extracurricular[];
  honors: Honor[];
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

export type FieldTool = {
  name: string;
  description: string;
  url: string;
  free: boolean;
  category: string;
};

// ─── Disciplines ──────────────────────────────────────────────────────────────

export const disciplines: Discipline[] = [
  { id: "d1", slug: "aerospace", name: "Aerospace Engineering", icon: "Plane", description: "Aircraft, spacecraft, drones and propulsion systems.", color: "#3b82f6" },
  { id: "d2", slug: "mechanical", name: "Mechanical Engineering", icon: "Settings2", description: "Mechanics, thermodynamics, fluid dynamics and materials.", color: "#f97316" },
  { id: "d3", slug: "electrical", name: "Electrical Engineering", icon: "Zap", description: "Circuits, power systems, signal processing and PCB design.", color: "#eab308" },
  { id: "d4", slug: "civil", name: "Civil Engineering", icon: "Building2", description: "Structures, infrastructure and urban planning systems.", color: "#78716c" },
  { id: "d5", slug: "chemical", name: "Chemical Engineering", icon: "FlaskConical", description: "Chemical processes, materials synthesis and biotechnology.", color: "#22c55e" },
  { id: "d6", slug: "software", name: "Software / CS", icon: "Code2", description: "Software systems, AI, web development and algorithms.", color: "#a855f7" },
  { id: "d7", slug: "robotics", name: "Robotics Engineering", icon: "Bot", description: "Autonomous systems, control theory and mechatronics.", color: "#6633ee" },
  { id: "d8", slug: "biomedical", name: "Biomedical Engineering", icon: "Heart", description: "Medical devices, biosensors and health technology.", color: "#ec4899" },
  { id: "d9", slug: "materials", name: "Materials Engineering", icon: "Layers", description: "Metals, polymers, composites and nanomaterials.", color: "#14b8a6" },
  { id: "d10", slug: "environmental", name: "Environmental Engineering", icon: "Leaf", description: "Clean energy, water treatment and sustainability systems.", color: "#84cc16" },
];

// ─── Communities (structure only — messages come from Supabase) ───────────────

const STANDARD_CHANNELS: Channel[] = [
  { id: "general", name: "general" },
  { id: "help", name: "help" },
  { id: "showcase", name: "showcase" },
  { id: "resources", name: "resources" },
];

export const communities: Community[] = [
  { id: "c1", name: "Aerospace Community", disciplineId: "d1", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c2", name: "Mechanical Community", disciplineId: "d2", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c3", name: "Electrical Community", disciplineId: "d3", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c4", name: "Civil Community", disciplineId: "d4", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c5", name: "Chemical Community", disciplineId: "d5", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c6", name: "Software / CS Community", disciplineId: "d6", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c7", name: "Robotics Community", disciplineId: "d7", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c8", name: "Biomedical Community", disciplineId: "d8", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c9", name: "Materials Community", disciplineId: "d9", channels: STANDARD_CHANNELS, memberIds: [] },
  { id: "c10", name: "Environmental Community", disciplineId: "d10", channels: STANDARD_CHANNELS, memberIds: [] },
];

// ─── Opportunities (static) ────────────────────────────────────────────────────

export const opportunities: Opportunity[] = [
  { id: "o1", disciplineId: "d3", title: "Siemens Engineering Internship — Digital Industries", category: "Internship", country: "Germany", field: "Electrical / Automation Engineering", deadline: "2026-08-31", link: "#" },
  { id: "o2", disciplineId: "d7", title: "FIRST Robotics Competition — Central Asia Regional", category: "Competition", country: "Kazakhstan", field: "Robotics & Mechatronics", deadline: "2026-09-15", link: "#" },
  { id: "o3", disciplineId: null, title: "Aga Khan Foundation STEM Scholarship", category: "Scholarship", country: "International", field: "Engineering & Sciences", deadline: "2026-10-01", link: "#" },
  { id: "o4", disciplineId: "d3", title: "MIT Energy Initiative Undergraduate Research", category: "Research", country: "USA", field: "Renewable Energy / Clean Tech", deadline: "2026-11-15", link: "#" },
  { id: "o5", disciplineId: null, title: "Uzbekistan National Innovation Fund Grant", category: "Grant", country: "Uzbekistan", field: "Technology & Startups", deadline: "2026-07-30", link: "#" },
  { id: "o6", disciplineId: "d1", title: "NASA Space Apps Challenge", category: "Competition", country: "USA", field: "Aerospace / Software", deadline: "2026-10-05", link: "#" },
];

// ─── Resources (static seed) ──────────────────────────────────────────────────

export const resources: Resource[] = [
  { id: "r1", disciplineId: "d7", title: "ROS2 Documentation (Humble)", url: "https://docs.ros.org/en/humble/", description: "Official ROS2 docs — tutorials, API reference, and architecture guides.", votes: 48, addedById: "" },
  { id: "r2", disciplineId: "d7", title: "PX4 Autopilot Developer Guide", url: "https://docs.px4.io/main/en/", description: "Full guide for PX4 flight stack — from hardware selection to custom flight modes.", votes: 39, addedById: "" },
  { id: "r3", disciplineId: "d1", title: "NASA Technical Reports Server", url: "https://ntrs.nasa.gov", description: "Free access to decades of NASA engineering reports and research papers.", votes: 56, addedById: "" },
  { id: "r4", disciplineId: "d6", title: "The Missing Semester of Your CS Education (MIT)", url: "https://missing.csail.mit.edu", description: "Practical shell, git, debugging, and tooling skills that CS degrees skip.", votes: 71, addedById: "" },
  { id: "r5", disciplineId: "d6", title: "CS50x — Harvard (free)", url: "https://cs50.harvard.edu/x/", description: "Best intro CS course online. Covers C, Python, SQL, web. Completely free.", votes: 55, addedById: "" },
  { id: "r6", disciplineId: "d3", title: "KiCad EDA (free, open-source)", url: "https://www.kicad.org", description: "Industry-grade PCB design tool. Used by CERN. Completely free.", votes: 37, addedById: "" },
  { id: "r7", disciplineId: "d8", title: "PhysioNet — Open Clinical Data", url: "https://physionet.org", description: "Free access to large physiological signal databases. Great for sensor validation.", votes: 22, addedById: "" },
];

// ─── Field Tools (static per discipline) ─────────────────────────────────────

export const FIELD_TOOLS: Record<string, FieldTool[]> = {
  aerospace: [
    { name: "OpenVSP", description: "Parametric aircraft geometry tool from NASA", url: "https://openvsp.org", free: true, category: "Design" },
    { name: "XFOIL", description: "Subsonic airfoil aerodynamic analysis (MIT)", url: "https://web.mit.edu/drela/Public/web/xfoil/", free: true, category: "Aerodynamics" },
    { name: "OpenFOAM", description: "Open-source CFD solver used in research and industry", url: "https://openfoam.org", free: true, category: "CFD" },
    { name: "MATLAB / Simulink", description: "Simulation, control design and data analysis", url: "https://mathworks.com", free: false, category: "Simulation" },
    { name: "ANSYS Fluent", description: "Industry-standard CFD simulation suite", url: "https://www.ansys.com", free: false, category: "CFD" },
  ],
  mechanical: [
    { name: "FreeCAD", description: "Free, open-source parametric 3D CAD modeler", url: "https://freecad.org", free: true, category: "CAD" },
    { name: "Fusion 360", description: "Cloud-based CAD/CAM/CAE tool — free for students", url: "https://www.autodesk.com/products/fusion-360", free: true, category: "CAD" },
    { name: "SolidWorks", description: "Industry-standard 3D CAD and simulation suite", url: "https://www.solidworks.com", free: false, category: "CAD" },
    { name: "ANSYS Mechanical", description: "FEA structural and thermal simulation", url: "https://www.ansys.com", free: false, category: "FEA" },
    { name: "MATLAB", description: "Numerical computation and simulation", url: "https://mathworks.com", free: false, category: "Simulation" },
  ],
  electrical: [
    { name: "KiCad", description: "Free, open-source PCB design tool (used by CERN)", url: "https://www.kicad.org", free: true, category: "PCB Design" },
    { name: "LTspice", description: "Free SPICE circuit simulator from Analog Devices", url: "https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html", free: true, category: "Simulation" },
    { name: "MATLAB / Simulink", description: "Signal processing, control systems and DSP", url: "https://mathworks.com", free: false, category: "Simulation" },
    { name: "TI WebBench", description: "Free online tool to design and simulate TI power supplies", url: "https://webench.ti.com", free: true, category: "Power Design" },
  ],
  civil: [
    { name: "AutoCAD Civil 3D", description: "Industry standard for civil drafting and site design", url: "https://www.autodesk.com/products/civil-3d", free: false, category: "Design" },
    { name: "OpenSees", description: "Open-source earthquake engineering simulation framework", url: "https://opensees.berkeley.edu", free: true, category: "Structural" },
    { name: "QGIS", description: "Free, open-source geographic information system", url: "https://qgis.org", free: true, category: "GIS" },
    { name: "HEC-RAS", description: "Free river analysis system from US Army Corps of Engineers", url: "https://www.hec.usace.army.mil/software/hec-ras/", free: true, category: "Hydraulics" },
  ],
  chemical: [
    { name: "DWSIM", description: "Open-source chemical process simulator", url: "https://dwsim.org", free: true, category: "Process Sim" },
    { name: "ASPEN Plus", description: "Industry-standard chemical process simulation", url: "https://www.aspentech.com", free: false, category: "Process Sim" },
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
    { name: "PyBullet", description: "Physics simulation for robotics in Python — free", url: "https://pybullet.org", free: true, category: "Simulation" },
  ],
  biomedical: [
    { name: "Python + SciPy / MNE", description: "Free open-source biosignal processing in Python", url: "https://mne.tools", free: true, category: "Signal Processing" },
    { name: "3D Slicer", description: "Open-source medical image informatics platform", url: "https://www.slicer.org", free: true, category: "Medical Imaging" },
    { name: "MATLAB + Signal Processing TB", description: "Bio-signal analysis: ECG, EEG, EMG filtering", url: "https://mathworks.com", free: false, category: "Signal Processing" },
    { name: "OpenBCI GUI", description: "Free tool for EEG/EMG/ECG data acquisition", url: "https://openbci.com", free: true, category: "Biosensing" },
  ],
  materials: [
    { name: "VESTA", description: "Free 3D visualization for crystal structures", url: "https://jp-minerals.org/vesta/en/", free: true, category: "Crystal Structure" },
    { name: "LAMMPS", description: "Open-source molecular dynamics simulator", url: "https://www.lammps.org", free: true, category: "Molecular Dynamics" },
    { name: "Materials Project", description: "Free database of computed material properties", url: "https://materialsproject.org", free: true, category: "Database" },
    { name: "ImageJ / FIJI", description: "Free image analysis for microscopy and materials characterization", url: "https://fiji.sc", free: true, category: "Characterization" },
  ],
  environmental: [
    { name: "QGIS", description: "Free, open-source GIS for spatial environmental analysis", url: "https://qgis.org", free: true, category: "GIS" },
    { name: "EPA SWMM", description: "Free stormwater management model from US EPA", url: "https://www.epa.gov/water-research/storm-water-management-model-swmm", free: true, category: "Hydrology" },
    { name: "HEC-RAS", description: "River hydraulics and flood modeling (US Army Corps)", url: "https://www.hec.usace.army.mil/software/hec-ras/", free: true, category: "Hydraulics" },
    { name: "SAM (Solar Analysis Model)", description: "Free NREL tool for solar and wind energy system modeling", url: "https://sam.nrel.gov", free: true, category: "Renewable Energy" },
  ],
};

// ─── Static helpers ───────────────────────────────────────────────────────────

export function getDisciplineBySlug(slug: string) { return disciplines.find((d) => d.slug === slug); }
export function getDisciplineById(id: string) { return disciplines.find((d) => d.id === id); }
export function getResourcesByDiscipline(id: string) { return resources.filter((r) => r.disciplineId === id).sort((a, b) => b.votes - a.votes); }
export function getOpportunitiesByDiscipline(id: string) { return opportunities.filter((o) => o.disciplineId === id || o.disciplineId === null); }
export function getCommunityById(id: string) { return communities.find((c) => c.id === id); }
export function getCommunityByDiscipline(disciplineId: string) { return communities.find((c) => c.disciplineId === disciplineId); }

// Stub kept for backward-compat — real data now in Supabase
export function getUserById(_id: string): User | undefined { return undefined; }
export function getProjectsByIds(_ids: string[]): Project[] { return []; }
