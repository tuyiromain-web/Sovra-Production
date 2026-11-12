# Sovra - Academic Network & Resource Workspace

![Sovra Logo](/public/sovra-logo.svg)

Sovra is an automated academic documentation and resource-sharing network platform for schools and universities. Each school operates as an isolated workspace with its own students, programs, faculty documentation, and resources.

## 🚀 Key Features

- **Institutional Academic Workspaces:** Multi-tenant architecture for schools and faculties to maintain verified study resources, lecture summaries, past examination papers, and syllabi.
- **Glassmorphic UI Design:** High-fidelity glassmorphism aesthetic built with Tailwind CSS v4 and dynamic sapphire blue accents.
- **Interactive Discussion Boards:** Academic forum with role-based moderation badges and category filtering.
- **Automated Check-in Registry:** Real-time lecture session attendance check-ins with passcode verification.
- **Sovra AI Research Copilot:** Integrated Google Gemini multimodal research assistant with real-time web search grounding, document ingestion, calculation verification, and multilingual tutoring (English, Kinyarwanda, French).
- **Academic Export Engine:** Instant generation of standardized institutional PDF compendiums and summaries.
- **Production Hardened:** Cloudflare reverse-proxy trust (`trust proxy`), Helmet security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options), strict body limits, and disabled server fingerprinting.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend / API:** Node.js, Express, Helmet, @google/genai SDK
- **Data & Auth:** Supabase Auth & PostgreSQL client, local encrypted fallbacks
- **Build & Dev Tools:** Vite 6, esbuild, tsx

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/tuyiromain-web/Sovra-Production.git
cd Sovra-Production

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
GEMINI_API_KEY=<your-gemini-api-key>
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📄 License

Apache-2.0
