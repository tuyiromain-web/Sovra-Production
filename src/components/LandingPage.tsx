import React, { useState } from "react";
import { 
  ArrowRight, Sparkles, BookOpen, Users, Award, 
  ChevronRight, Compass, Shield, CheckCircle2, ArrowUpRight,
  Layers, MessageSquare, Clock, Search, Bell, ExternalLink,
  GraduationCap, Play, Star
} from "lucide-react";
import AuthPage from "./AuthPage";
import { UserProfile } from "../types";
import { ThemeToggle } from "./ui/ThemeToggle";

interface LandingPageProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export default function LandingPage({ onAuthSuccess }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "signup">("login");
  const [selectedDirection, setSelectedDirection] = useState(0);

  const openAuth = (mode: "login" | "signup") => {
    setAuthInitialMode(mode);
    setShowAuthModal(true);
  };

  const educationalDirections = [
    {
      title: "Health Sciences & Pharmacology",
      duration: "4 years of accredited studies",
      level: "Undergraduate & Clinical",
      tag: "#ClinicalADME",
      bgGradient: "from-[#0284C7] to-[#0369A1]",
      cardBg: "bg-[#0369A1]/30 border-sky-400/30",
      accent: "text-sky-400",
      pillBg: "bg-sky-500/20 text-sky-300",
      studentsCount: "142 Active Scholars",
      description: "Comprehensive therapeutic guidelines, drug pharmacokinetics, and clinical case synthesis.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "Computer Science & Engineering",
      duration: "3 years of dedicated study",
      level: "Software & Systems",
      tag: "#AIArchitecture",
      bgGradient: "from-emerald-600 to-teal-800",
      cardBg: "bg-emerald-950/40 border-emerald-400/30",
      accent: "text-emerald-400",
      pillBg: "bg-emerald-500/20 text-emerald-300",
      studentsCount: "198 Active Engineers",
      description: "Distributed networks, algorithms, generative copilot modeling, and systems engineering.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "Business & Applied Economics",
      duration: "3 years of commercial analysis",
      level: "Management & Finance",
      tag: "#MarketAnalytics",
      bgGradient: "from-amber-600 to-orange-800",
      cardBg: "bg-amber-950/40 border-amber-400/30",
      accent: "text-amber-400",
      pillBg: "bg-amber-500/20 text-amber-300",
      studentsCount: "115 Active Analysts",
      description: "Quantitative econometrics, institutional resource management, and startup incubation.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] font-sans overflow-x-hidden selection:bg-[#0284C7] selection:text-white relative">
      
      {/* Decorative Organic Vector Loops in Background (Matching Reference) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft atmospheric gradients */}
        <div className="absolute top-[-15%] left-[-10%] w-[650px] h-[650px] bg-[#0284C7]/15 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#38BDF8]/12 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-blue-900/15 rounded-full blur-[150px]" />

        {/* Playful vector doodle lines (subtle SVGs) */}
        <svg className="absolute top-12 right-10 w-[420px] h-[360px] opacity-25" viewBox="0 0 400 350" fill="none">
          <path d="M 50,150 C 150,20 280,30 350,120 C 420,210 250,320 180,260 C 110,200 80,100 200,60" 
                stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 6" />
        </svg>

        <svg className="absolute bottom-20 left-10 w-[380px] h-[320px] opacity-20" viewBox="0 0 400 350" fill="none">
          <path d="M 30,100 C 100,240 220,280 320,180 C 420,80 280,20 180,90 C 80,160 120,320 280,300" 
                stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Floating Pill Header Nav */}
      <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto">
        <nav className="bg-glass border border-white/10 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl backdrop-blur-2xl">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] p-1 flex items-center justify-center shadow-md glow-blue-sm">
              <img src="/sovra-logo.svg" alt="Sovra Logo" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">SOVRA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            </div>
          </div>

          {/* Centered Segmented Navigation Pill (Inspired by LabAcademy Reference) */}
          <div className="hidden md:flex items-center bg-[#070B14]/70 border border-white/8 rounded-full p-1 text-xs font-semibold text-[#94A3B8]">
            <a href="#overview" className="px-4 py-1.5 rounded-full bg-[#0E1626] text-white shadow-xs transition-colors hover:text-sky-300">Overview</a>
            <a href="#workspaces" className="px-4 py-1.5 rounded-full hover:text-white transition-colors">Workspaces</a>
            <a href="#collaborate" className="px-4 py-1.5 rounded-full hover:text-white transition-colors">Collaborate</a>
            <a href="#research" className="px-4 py-1.5 rounded-full hover:text-white transition-colors">AI Copilot</a>
          </div>

          {/* Action CTAs & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              onClick={() => openAuth("login")}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="blue-gradient-btn px-5 py-2 rounded-full text-xs font-extrabold tracking-wide flex items-center gap-1.5 shadow-lg glow-blue-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </nav>
      </header>

      {/* Hero Section (Matching Graphic Design Group & Creative Minds School Reference) */}
      <section id="overview" className="relative z-10 pt-8 sm:pt-16 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Asymmetrical Rounded Hero Photo Card (From Reference Image 1 & 4) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[36px] bg-[#0E2038] border-2 border-sky-400/25 p-3.5 sm:p-5 shadow-2xl overflow-hidden group">
              
              {/* Photo Frame with Pill Tags Floating On Top */}
              <div className="relative rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80" 
                  alt="Students Collaborating in Sovra Workspace" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />

                {/* Floating Colorful Hashtag Badges (From Reference) */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#8B5CF6] text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    #ResearchHub
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#10B981] text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    #PeerReview
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#F59E0B] text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    #DigitalNotes
                  </span>
                </div>
              </div>

              {/* Sub-Card Floating Row: Group Stats & Decorative Asterisk Star */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch">
                
                {/* Cohort Card (Warm Orange/Amber Accent Matching Reference) */}
                <div className="sm:col-span-7 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] p-4 text-white shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex -space-x-2">
                      <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
                      <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
                      <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
                    </div>
                    <h3 className="font-extrabold text-sm pt-1">Academic Cohort B2</h3>
                    <p className="text-[11px] text-sky-100 font-mono">Enrolled students: 48 active</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Decorative High-Contrast Asterisk Badge (Matching Reference Accent) */}
                <div className="sm:col-span-5 rounded-2xl bg-[#A3E635] text-[#0F172A] p-4 flex flex-col items-center justify-center shadow-xl group/badge cursor-pointer hover:bg-[#BEF264] transition-colors">
                  <span className="text-3xl font-black leading-none group-hover/badge:rotate-45 transition-transform duration-300">✱</span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider mt-1">Verified School</span>
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: Hero Typography & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left lg:pl-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              Multi-School Academic Workspace
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F8FAFC] leading-[1.08]">
                Creative <span className="inline-block text-[#38BDF8] drop-shadow-sm">Minds</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300">
                  Academic Network
                </span>
              </h1>
              <div className="flex items-center gap-2 pt-1 text-2xl font-black text-[#A3E635]">
                <span>✱</span>
                <span className="text-sky-400">✦</span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-xl">
              Welcome to Sovra, the automated documentation and resource-sharing platform where university students, faculty, and research teams collaborate across unified, isolated workspaces.
            </p>

            {/* Floating Bubble Tags (From Reference Image 4) */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <div className="px-4 py-2 rounded-full bg-[#0E1A2E] border border-sky-400/20 text-xs font-bold text-sky-200 flex items-center gap-2 shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
                Lecture Vault
              </div>
              <div className="px-4 py-2 rounded-full bg-[#0E1A2E] border border-emerald-400/20 text-xs font-bold text-emerald-200 flex items-center gap-2 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Passcode Attendance
              </div>
              <div className="px-4 py-2 rounded-full bg-[#0E1A2E] border border-purple-400/20 text-xs font-bold text-purple-200 flex items-center gap-2 shadow-sm">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                Gemini AI Copilot
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => openAuth("signup")}
                className="blue-gradient-btn px-7 py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl glow-blue hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Enter Your School Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openAuth("login")}
                className="px-6 py-3.5 rounded-2xl bg-glass border border-white/10 hover:border-sky-400/40 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-[#131E35]/60"
              >
                <span>Live Demo Login</span>
                <ChevronRight className="w-4 h-4 text-[#38BDF8]" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-white/8 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono">100%</p>
                <p className="text-[11px] text-[#94A3B8] font-medium">Isolated Workspaces</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#38BDF8] font-mono">99.8%</p>
                <p className="text-[11px] text-[#94A3B8] font-medium">Uptime Registry</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#A3E635] font-mono">0ms</p>
                <p className="text-[11px] text-[#94A3B8] font-medium">Latency Failover</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* "Directions of Education" Section (Exact Re-creation of Reference Image 3) */}
      <section id="workspaces" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-left mb-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#A3E635] text-[#070B14] flex items-center justify-center font-black text-xs">✱</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">Curriculum Paths</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Directions of education
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-md">
              At our institution, we offer an extensive array of learning pathways and specialized disciplines, encompassing health sciences, engineering, and digital analytics.
            </p>
          </div>
        </div>

        {/* 3 Large Modular Cards with Asymmetric Pill Corners (From Image 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {educationalDirections.map((dir, idx) => (
            <div 
              key={dir.title}
              onClick={() => openAuth("login")}
              className={`rounded-[32px] p-6 text-left border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-2xl relative overflow-hidden flex flex-col justify-between ${dir.cardBg}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider ${dir.pillBg}`}>
                  {dir.level}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Duration */}
              <div className="my-6 space-y-2">
                <h3 className="text-xl font-black text-white tracking-tight leading-snug">
                  {dir.title}
                </h3>
                <p className="text-xs text-[#94A3B8] font-medium">
                  {dir.duration}
                </p>
              </div>

              {/* Asymmetrical Photo cutout matching Reference Image 3 */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10">
                <img src={dir.image} alt={dir.title} className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  {dir.studentsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "Make Together" Collaborative Whiteboard Section (Exact Re-creation of Reference Image 5) */}
      <section id="collaborate" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-glass border border-white/10 rounded-[40px] p-6 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center space-y-8">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              # Make together
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              Engage in the dynamic world of collaborative research, coursework peer-reviews, and synchronized study groups. Together, we shape academic excellence.
            </p>
          </div>

          {/* Interactive Simulated Collaborative Canvas (Matching Reference Image 5) */}
          <div className="relative max-w-3xl mx-auto rounded-3xl bg-[#091122]/90 border border-sky-400/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
            
            {/* Whiteboard Floating Toolbar (From Image 5) */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#0F1C36] border border-white/10 shadow-lg mx-auto mb-8">
              <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-300">
                <Layers className="w-4 h-4" />
              </div>
              <div className="p-1.5 rounded-xl hover:bg-white/5 text-[#94A3B8]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="p-1.5 rounded-xl hover:bg-white/5 text-[#94A3B8]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="p-1.5 rounded-xl hover:bg-white/5 text-[#94A3B8]">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Waveform Drawing representation */}
            <div className="relative h-32 flex items-center justify-center">
              <svg className="w-full h-24" viewBox="0 0 600 100" fill="none">
                <path d="M 50,60 Q 150,10 250,60 T 450,40 T 550,70" 
                      stroke="#A3E635" strokeWidth="8" strokeLinecap="round" />
              </svg>

              {/* Floating Real-Time Collaborator Avatars with Pins (From Image 5) */}
              <div className="absolute top-2 left-6 sm:left-12 flex items-center gap-2 bg-[#8B5CF6] text-white px-3.5 py-1.5 rounded-full shadow-lg text-xs font-bold animate-pulse">
                <img className="w-5 h-5 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Jane" />
                <span>Jane Cooper</span>
              </div>

              <div className="absolute bottom-2 right-8 sm:right-16 flex items-center gap-2 bg-[#F97316] text-white px-3.5 py-1.5 rounded-full shadow-lg text-xs font-bold">
                <img className="w-5 h-5 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Jenny" />
                <span>Jenny Wilson</span>
              </div>

              <div className="absolute bottom-0 left-16 hidden sm:flex items-center gap-2 bg-[#065F46] text-white px-3 py-1 rounded-full shadow-lg text-xs font-bold">
                <img className="w-4 h-4 rounded-full object-cover" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80" alt="Leslie" />
                <span>Leslie Alexander</span>
              </div>
            </div>

            {/* Bottom Join Callout */}
            <div className="mt-8 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#0369A1] text-[#A3E635] flex items-center justify-center font-black text-xl shrink-0">
                  ✱
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Join our academic study groups and embark on a shared journey where innovation knows no bounds.
                </p>
              </div>
              <button 
                onClick={() => openAuth("signup")}
                className="blue-gradient-btn px-5 py-2.5 rounded-full text-xs font-extrabold shrink-0 cursor-pointer shadow-md"
              >
                Join Study Cohort
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Research & AI Copilot Section */}
      <section id="research" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-400/20">
              Multimodal Academic Research
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Sovra AI Copilot for deep academic discovery
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Equipped with Google Gemini and grounded in real-time online literature, Sovra AI assists students and lecturers with technical synthesis, dosage and statistical math validation, exam diagnostics, and multilingual translation in English, Kinyarwanda, and French.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Instant past paper summaries and verified institutional notes</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated classroom attendance verification with time-slotted passcodes</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />
                <span>Zero vendor lock-in with one-click PDF compendium export</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-glass border border-sky-400/20 p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono font-bold text-sky-300 pl-2">Sovra AI Research Terminal</span>
                </div>
                <span className="text-[10px] font-mono text-[#A3E635] bg-[#A3E635]/10 px-2 py-0.5 rounded">Grounded</span>
              </div>
              
              <div className="bg-[#070B14] rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-2 border border-white/5">
                <p className="text-sky-400">&gt; sovra.query(&quot;Synthesize pharmacokinetic ADME principles for Year 2&quot;)</p>
                <p className="text-emerald-400 font-bold">✓ Verified against clinical pharmacology repository</p>
                <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                  Absorption rate constant (Ka) matches standard oral formulations. Renal elimination clearance calculated via Cockcroft-Gault formula.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#94A3B8]">Ready to test with your own syllabus?</span>
                <button
                  onClick={() => openAuth("signup")}
                  className="blue-gradient-btn px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Start Research
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/8 py-12 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] p-1 flex items-center justify-center shadow-md">
              <img src="/sovra-logo.svg" alt="Sovra Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-white tracking-wider">SOVRA</p>
              <p className="text-[11px] text-[#94A3B8]">Institutional Academic Network & Documentation Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
            <a href="#overview" className="hover:text-white transition-colors">About</a>
            <a href="#workspaces" className="hover:text-white transition-colors">Curricula</a>
            <a href="#collaborate" className="hover:text-white transition-colors">Collaboration</a>
            <button onClick={() => openAuth("login")} className="text-sky-400 hover:underline">Access Portal</button>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Sovra Platform. All rights reserved.</p>
          <p>Protected by Cloudflare CDN & Strict HSTS Encryption.</p>
        </div>
      </footer>

      {/* Modal Popup for Authentication (Login / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-md">
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-[#0E1626] border border-white/20 text-white flex items-center justify-center hover:bg-sky-600 transition-colors cursor-pointer shadow-xl"
            >
              ✕
            </button>
            <AuthPage 
              initialMode={authInitialMode}
              onAuthSuccess={(user) => {
                setShowAuthModal(false);
                onAuthSuccess(user);
              }} 
            />
          </div>
        </div>
      )}

    </div>
  );
}
