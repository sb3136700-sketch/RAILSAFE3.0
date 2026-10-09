# RailSafe 2.0 — Railway Passenger Safety & Operations Hub
### AI Fusion 2K26 Hackathon — Engineering & Technology / Cybersecurity Theme

RailSafe 2.0 is an autonomous railway passenger safety platform combining real-time train tracking, AI-powered incident classification, automated emergency SOS with live location sharing, and a cybersecurity-hardened operations command center.

---

## 🚀 Hackathon Demo Runbook (3–5 Minute Live Walkthrough)

RailSafe includes an interactive **Judge Guided Walkthrough Banner** at the top of the interface. Presenters and evaluators can follow this repeatable 6-step presentation:

### Step 1 — The Problem & Passenger Hub (20–30s)
* **Goal:** Present the passenger dashboard and articulate why unified safety telemetry matters.
* **Action:** Start on the home page (`/`) as passenger **Sameer Khan**. Point out quick-access helplines (139, 112, 182), the live telemetry indicator, and search bar.
* **Talking Point:** "Over 24 million passengers travel on Indian Railways daily. In an emergency, passengers struggle with scattered helpline numbers, zero status visibility, and inability to share precise train coordinates with family."

### Step 2 — Real Train Tracking & Radar (30–45s)
* **Goal:** Demonstrate train search, schedule stops, and data integrity rules.
* **Action:** Navigate to **Live Train Radar** (`/trains`). Search and select **Train 12626 (Kerala Superfast Express)**.
* **Talking Point:** "Notice the honest **DEMO MODE — SIMULATED GPS** badge. When live RailRadar credentials are unconfigured, RailSafe clearly labels simulated data and never invents random GPS coordinates. Notice the complete station sequence, speed metrics, and platform numbers."

### Step 3 — Submit a Passenger Safety Incident (45–60s)
* **Goal:** Demonstrate report intake, validation, and reference ID generation.
* **Action:** Click **Report Safety Incident** (`/report-incident`). Click the demo pill **"Harassment in B3"** to auto-populate the form, then click **Submit Confidential Safety Report**.
* **Talking Point:** "A unique reference ID (`RS-2026-INC-xxxx`) is generated immediately. The report is encrypted and protected by database Row-Level Security (RLS)."

### Step 4 — Gemini AI Automation & Risk Triage (45–60s)
* **Goal:** Highlight server-side Gemini 3.8 Flash AI automation.
* **Action:** View the generated report preview or check **My Incidents** (`/incident-status`).
* **Talking Point:** "The server-side Gemini 3.8 model analyzes the description, rates the urgency score (e.g., 8/10), recommends an immediate protocol ('Dispatch RPF personnel at upcoming stop Bhopal Jn'), and routes the case to the Railway Protection Force. AI recommendations remain advisory until confirmed by a human officer."

### Step 5 — Control Center Operations & Assignment (45–60s)
* **Goal:** Switch to the authorized operator and take decisive action.
* **Action:** Switch persona to **Aditi Nair (Safety Officer)** and open the **Operations Dashboard** (`/admin`). Select the newly filed incident from the queue.
* **Action:** Review the AI recommendation vs operator controls, select **SI Vikram Singh (RPF)**, update status to **Assigned to Field Unit**, and click **Commit Triage Update**.
* **Talking Point:** "The officer exercises human-in-the-loop oversight. Notice that every triage decision and status change is immediately appended to the immutable audit trail."

### Step 6 — Cybersecurity Demonstration & Advanced SOS (30–45s)
* **Goal:** Demonstrate cybersecurity safeguards and automated SOS.
* **Action 1:** Navigate to **Cybersecurity Hub** (`/security`). Click **Run Cross-Tenant Security Probe** to demonstrate that Passenger Sameer is blocked (HTTP 403 Forbidden) from querying other passengers' records.
* **Action 2:** Click the red **SOS** button on the navbar. Observe the 5-second accidental cancel window, GPS acquisition, and server-side SMS alert dispatch with an encrypted live location tracking link.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Leaflet (OpenStreetMap)
* **Backend:** Node.js Express server (`server.ts`) in development, Netlify Serverless Functions (`netlify/functions/`) in production
* **Database & Auth:** Supabase PostgreSQL with strict Row Level Security (RLS), RBAC policies (`supabase/migrations/`)
* **AI Engine:** Google `@google/genai` TypeScript SDK (server-side Gemini 3.8 Flash)
* **Emergency Alert System:** Instant live tracking, manual carrier SMS fallback, and emergency helplines (139 / 112)

---

## 🔐 Environment Variables (`.env.local`)

```env
# Supabase Client Configuration (From Supabase Dashboard -> Settings -> API)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"

# App URL for live tracking link generation
APP_URL="http://localhost:3000"

# Note: SUPABASE_SERVICE_ROLE_KEY is not required (RLS protected).
# Note: External SMS gateways (like MSG91) are optional and disabled by default.
```

---

## 📦 Local Installation & Startup

```bash
# Install dependencies
npm install

# Start development full-stack server
npm run dev

# Build production bundle
npm run build
```

---

## 🚢 Netlify Deployment

1. Connect your GitHub repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Functions directory: `netlify/functions`
5. Configure environment variables in Netlify site settings.
