export type Skill = { name: string; rating: number };

export type User = {
  id: string;
  name: string;
  school: string;
  country: string;
  major: string;
  avatarUrl: string;
  verified: boolean;
  builderScore: number;
  skills: Skill[];
  interests: string[];
  availability:
    | "Looking for projects"
    | "Looking for team members"
    | "Looking for internship"
    | "Not available";
  projectIds: string[];
};

export type Project = {
  id: string;
  title: string;
  ownerId: string;
  description: string;
  stage: "Idea" | "Prototype" | "Testing" | "Final";
  progress: number;
  type: "hardware" | "software";
  lookingFor: string[];
  tags: string[];
  milestones: { title: string; done: boolean }[];
  updates: { week: number; text: string }[];
  teamMemberIds: string[];
  upvotes: number;
};

export type Opportunity = {
  id: string;
  title: string;
  category: "Internship" | "Competition" | "Scholarship" | "Research" | "Grant";
  country: string;
  field: string;
  deadline: string;
  link: string;
};

export const users: User[] = [
  {
    id: "u1",
    name: "Akbar Tashkentov",
    school: "Tashkent State Technical University",
    country: "Uzbekistan",
    major: "Mechatronics Engineering",
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
    availability: "Looking for team members",
    projectIds: ["p1", "p3"],
  },
  {
    id: "u2",
    name: "Dilnoza Yusupova",
    school: "Westminster International University",
    country: "Uzbekistan",
    major: "Computer Science",
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
    availability: "Looking for projects",
    projectIds: ["p4", "p6"],
  },
  {
    id: "u3",
    name: "Bobur Karimov",
    school: "Tashkent University of Information Technologies",
    country: "Uzbekistan",
    major: "Electrical Engineering",
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
    availability: "Looking for team members",
    projectIds: ["p2"],
  },
  {
    id: "u4",
    name: "Zarina Nazarova",
    school: "National University of Uzbekistan",
    country: "Uzbekistan",
    major: "Biomedical Engineering",
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
    availability: "Looking for internship",
    projectIds: ["p8"],
  },
  {
    id: "u5",
    name: "Jasur Abdullayev",
    school: "Tashkent Aviation Institute",
    country: "Uzbekistan",
    major: "Aerospace Engineering",
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
    availability: "Looking for team members",
    projectIds: ["p3", "p7"],
  },
  {
    id: "u6",
    name: "Malika Mirzayeva",
    school: "INHA University in Tashkent",
    country: "Uzbekistan",
    major: "Software Engineering",
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
    availability: "Looking for projects",
    projectIds: ["p5"],
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "AutoDrone — Autonomous Delivery System",
    ownerId: "u1",
    description:
      "A fully autonomous hexacopter drone capable of last-mile package delivery in urban environments. Uses computer vision for obstacle avoidance and GPS-RTK for centimeter-level positioning. Currently being tested over 500m routes in Tashkent's Yunusabad district.",
    stage: "Testing",
    progress: 72,
    type: "hardware",
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
      { week: 6, text: "Successfully completed 12 consecutive autonomous flights over 300m routes with 0 incidents. Obstacle avoidance reacting well to trees and poles." },
      { week: 5, text: "Integrated RTK GPS module. Positioning accuracy improved from ±2m to ±4cm. Night flying tests also went well." },
      { week: 4, text: "Rebuilt the frame after a crash during wind testing. New carbon fiber arms are 30% stiffer." },
      { week: 3, text: "First autonomous flight completed in a closed field. PX4 firmware is now stable with our custom waypoint planning." },
    ],
    teamMemberIds: ["u1", "u5"],
    upvotes: 84,
  },
  {
    id: "p2",
    title: "SolarTracker — Dual-Axis Arduino Panel System",
    ownerId: "u3",
    description:
      "A dual-axis solar panel tracking system built around an Arduino Mega and LDR sensors. Automatically follows the sun throughout the day, increasing energy output by up to 35% compared to fixed panels. Designed for rooftop deployment in Central Asia's high-sunshine regions.",
    stage: "Prototype",
    progress: 55,
    type: "hardware",
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
      { week: 4, text: "Tracking accuracy is now within 2° of optimal angle. Measured 28% improvement in output on a sunny test day." },
      { week: 3, text: "Switched from stepper to servo motors — much smoother movement and lower power draw." },
      { week: 2, text: "First working prototype on the roof of TUIT. Panel moves, tracking logic works but is a bit shaky." },
    ],
    teamMemberIds: ["u3"],
    upvotes: 47,
  },
  {
    id: "p3",
    title: "AquaBot — River Monitoring Underwater ROV",
    ownerId: "u5",
    description:
      "A low-cost remotely operated vehicle (ROV) for monitoring water quality and underwater conditions in the Syr Darya and Amu Darya rivers. Equipped with turbidity, pH, and temperature sensors. Built with a 3D-printed waterproof housing and DC thrusters.",
    stage: "Prototype",
    progress: 48,
    type: "hardware",
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
      { week: 2, text: "Thruster control working via ESP32 and PWM. Manual control from laptop over Wi-Fi." },
    ],
    teamMemberIds: ["u5", "u1"],
    upvotes: 61,
  },
  {
    id: "p4",
    title: "TashMed — Telemedicine for Rural Uzbekistan",
    ownerId: "u2",
    description:
      "A lightweight telemedicine web app designed for low-bandwidth rural clinics in Uzbekistan. Doctors in Tashkent can conduct video consultations, review patient records, and prescribe medications for patients in remote regions. Supports both Uzbek and Russian.",
    stage: "Testing",
    progress: 80,
    type: "software",
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
      { week: 6, text: "Uzbek translation completed with help from linguistics department at NUUz." },
    ],
    teamMemberIds: ["u2", "u6"],
    upvotes: 112,
  },
  {
    id: "p5",
    title: "SmartFarm — IoT Crop Monitoring Platform",
    ownerId: "u6",
    description:
      "An IoT platform that connects soil moisture sensors, weather stations, and drone imagery to give farmers in the Fergana Valley real-time data on crop health. The ML model predicts irrigation needs 48 hours ahead, reducing water usage by an estimated 30%.",
    stage: "Prototype",
    progress: 42,
    type: "software",
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
      { week: 2, text: "Finalized sensor hardware selection. Using Capacitive soil moisture sensors + BME280 for weather." },
    ],
    teamMemberIds: ["u6", "u2"],
    upvotes: 58,
  },
  {
    id: "p6",
    title: "EduAI — Adaptive Learning for STEM Students",
    ownerId: "u2",
    description:
      "An adaptive learning platform that personalizes STEM lesson plans for high school students in Uzbekistan. Uses spaced repetition and mastery-based progression. Currently covers Physics and Mathematics for grades 9–11. Built in partnership with 3 schools in Tashkent.",
    stage: "Final",
    progress: 91,
    type: "software",
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
      { week: 10, text: "300 students now using the platform across 3 pilot schools. Avg session time is 22 minutes." },
      { week: 9, text: "A/B test results: students using adaptive path scored 18% higher on weekly assessments." },
    ],
    teamMemberIds: ["u2", "u6", "u4"],
    upvotes: 138,
  },
  {
    id: "p7",
    title: "WindBoost — Small Wind Turbine Optimizer",
    ownerId: "u5",
    description:
      "A smart controller for small-scale (1–5 kW) wind turbines that dynamically adjusts blade pitch based on real-time wind data to maximize efficiency. Targets rural households and farms in high-wind areas of Uzbekistan and Kazakhstan.",
    stage: "Idea",
    progress: 18,
    type: "hardware",
    lookingFor: ["Electrical Engineer", "Mechanical Engineer", "Embedded Developer"],
    tags: ["wind-energy", "renewable", "embedded", "control-systems"],
    milestones: [
      { title: "Wind resource analysis for Uzbekistan", done: true },
      { title: "Blade pitch control algorithm", done: false },
      { title: "Motor driver PCB design", done: false },
      { title: "Physical scale model", done: false },
      { title: "Field test at wind site (Navoi)", done: false },
    ],
    updates: [
      { week: 1, text: "Completed wind resource analysis. The Navoi and Bukhara regions average 7m/s — excellent for small turbines. Starting blade pitch simulation in MATLAB." },
    ],
    teamMemberIds: ["u5", "u3"],
    upvotes: 29,
  },
  {
    id: "p8",
    title: "BioSense — Wearable Health Monitor",
    ownerId: "u4",
    description:
      "A low-cost wearable device that continuously monitors heart rate, SpO2, skin temperature, and motion. Data syncs to a mobile app and flags anomalies for elderly users. Built on the MAX30105 sensor and ESP32-S3, targeting deployment in senior care homes.",
    stage: "Prototype",
    progress: 60,
    type: "hardware",
    lookingFor: ["Mobile App Developer", "Geriatrics Advisor", "PCB Designer"],
    tags: ["wearable", "health", "ESP32", "sensors", "elderly-care"],
    milestones: [
      { title: "Sensor selection & testing (MAX30105)", done: true },
      { title: "ESP32-S3 firmware — BLE data streaming", done: true },
      { title: "3D-printed wristband housing", done: true },
      { title: "Mobile app (data visualization)", done: false },
      { title: "Anomaly detection algorithm", done: false },
      { title: "Senior care home pilot", done: false },
    ],
    updates: [
      { week: 5, text: "SpO2 accuracy validated against a clinical pulse oximeter — within 1% error. Heart rate tracking also solid." },
      { week: 4, text: "Battery life extended to 48h by implementing deep sleep between BLE transmissions." },
      { week: 3, text: "First wearable prototype assembled and worn for 24h. Comfortable enough, but the strap needs work." },
    ],
    teamMemberIds: ["u4", "u3"],
    upvotes: 73,
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "o1",
    title: "Siemens Engineering Internship — Digital Industries",
    category: "Internship",
    country: "Germany",
    field: "Electrical / Automation Engineering",
    deadline: "2026-08-31",
    link: "#",
  },
  {
    id: "o2",
    title: "FIRST Robotics Competition — Central Asia Regional",
    category: "Competition",
    country: "Kazakhstan",
    field: "Robotics & Mechatronics",
    deadline: "2026-09-15",
    link: "#",
  },
  {
    id: "o3",
    title: "Aga Khan Foundation STEM Scholarship",
    category: "Scholarship",
    country: "International",
    field: "Engineering & Sciences",
    deadline: "2026-10-01",
    link: "#",
  },
  {
    id: "o4",
    title: "MIT Energy Initiative Undergraduate Research",
    category: "Research",
    country: "USA",
    field: "Renewable Energy / Clean Tech",
    deadline: "2026-11-15",
    link: "#",
  },
  {
    id: "o5",
    title: "Uzbekistan National Innovation Fund Grant",
    category: "Grant",
    country: "Uzbekistan",
    field: "Technology & Startups",
    deadline: "2026-07-30",
    link: "#",
  },
  {
    id: "o6",
    title: "NASA Space Apps Challenge",
    category: "Competition",
    country: "USA",
    field: "Aerospace / Software",
    deadline: "2026-10-05",
    link: "#",
  },
];

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectsByIds(ids: string[]): Project[] {
  return projects.filter((p) => ids.includes(p.id));
}
