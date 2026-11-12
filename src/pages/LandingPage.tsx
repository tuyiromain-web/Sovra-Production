/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import TenantIsolationDiagram from "../components/diagrams/TenantIsolationDiagram";
import AcademicDocPipelineDiagram from "../components/diagrams/AcademicDocPipelineDiagram";
import AuthPage from "../components/AuthPage";
import { UserProfile } from "../types";

export interface LandingPageProps {
  onAuthSuccess: (user: UserProfile) => void;
  onEnterWorkspace?: (tenantId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess, onEnterWorkspace }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showWorkspaceRequestModal, setShowWorkspaceRequestModal] = useState(false);
  const [institutionName, setInstitutionName] = useState("");
  const [institutionEmail, setInstitutionEmail] = useState("");
  const [institutionRole, setInstitutionRole] = useState("Dean of Academic Affairs");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [selectedDirectionTab, setSelectedDirectionTab] = useState<number>(0);
  const [canvasActiveTool, setCanvasActiveTool] = useState<"pen" | "highlight" | "stamp" | "eraser">("pen");
  const [canvasNotes, setCanvasNotes] = useState<Array<{ id: number; text: string; x: number; y: number; author: string; color: string }>>([
    { id: 1, text: "Curriculum matches 2026 ABET Standards ✓", x: 28, y: 35, author: "Dr. Jane Cooper", color: "#D8B4F8" },
    { id: 2, text: "Clinical hours verified by Dean Board", x: 62, y: 55, author: "Prof. Wade Warren", color: "#FBA774" }
  ]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim() || !institutionEmail.trim()) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowWorkspaceRequestModal(false);
      setRequestSubmitted(false);
      setInstitutionName("");
      setInstitutionEmail("");
    }, 2000);
  };

  const addCanvasNote = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const newNote = {
      id: Date.now(),
      text: "Verified syllabus learning objective",
      x: Math.max(10, Math.min(85, x)),
      y: Math.max(15, Math.min(80, y)),
      author: "You (Active Reviewer)",
      color: canvasActiveTool === "pen" ? "#86EFAC" : canvasActiveTool === "highlight" ? "#FDE047" : "#BAE0FD"
    };
    setCanvasNotes(prev => [...prev.slice(-3), newNote]);
  };

  // 3 Directions of Education (Programs)
  const directions = [
    {
      badge: "Accredited Track",
      title: "Applied Pharmacology",
      duration: "4 years of dedicated clinical study",
      studentsCount: "420 Students",
      bgClass: "bg-[#D4F49C] text-[#0F2916] dark:bg-[#152B1C] dark:text-[#D4F49C]",
      borderClass: "border-[#B5E86E]/40 dark:border-[#23452E]",
      tagColor: "bg-[#0F2916] text-[#D4F49C] dark:bg-[#D4F49C] dark:text-[#0F2916]",
      arrowBg: "bg-white/90 text-[#0F2916] dark:bg-[#0F2916] dark:text-white",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80",
      description: "Pharmaceutical chemistry, clinical dosage modeling, pharmacokinetics, and healthcare regulatory compliance."
    },
    {
      badge: "STEM Honors",
      title: "Distributed Systems & AI",
      duration: "3 years of advanced engineering",
      studentsCount: "680 Students",
      bgClass: "bg-[#FBA774] text-[#3D1407] dark:bg-[#381B10] dark:text-[#FFCEBC]",
      borderClass: "border-[#F99252]/40 dark:border-[#522818]",
      tagColor: "bg-[#3D1407] text-[#FBA774] dark:bg-[#FFCEBC] dark:text-[#3D1407]",
      arrowBg: "bg-white/90 text-[#3D1407] dark:bg-[#3D1407] dark:text-white",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80",
      description: "Fault-tolerant architectures, consensus protocols, large-scale machine learning pipelines, and network cryptography."
    },
    {
      badge: "Clinical Residency",
      title: "Clinical Medicine & Surgery",
      duration: "5 years of hospital rotation",
      studentsCount: "310 Students",
      bgClass: "bg-[#B6D6F8] text-[#0A1E35] dark:bg-[#10233B] dark:text-[#CEE6FF]",
      borderClass: "border-[#96C3F5]/40 dark:border-[#1A385E]",
      tagColor: "bg-[#0A1E35] text-[#B6D6F8] dark:bg-[#CEE6FF] dark:text-[#0A1E35]",
      arrowBg: "bg-white/90 text-[#0A1E35] dark:bg-[#0A1E35] dark:text-white",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=700&q=80",
      description: "Internal medicine, pathology, surgical rotations, triage diagnostics, and clinical ethics in university hospital centers."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans antialiased transition-colors duration-150 selection:bg-[var(--accent)] selection:text-white">
      
      {/* 1. Header: Modern Minimalist Navigation with Segmented Pill Menu */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark (Instrument Serif + Soft Brand Geometry) */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                SOVRA
              </span>
            </a>
          </div>

          {/* Floating Segmented Pill Menu (Reference Design Pattern) */}
          <nav className="hidden lg:flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-full px-2 py-1 shadow-sm text-xs font-medium text-[var(--ink-muted)]">
            <a href="#workspaces" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              Workspaces
            </a>
            <a href="#directions" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              Directions
            </a>
            <a href="#collaboration" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              Collaboration
            </a>
            <a href="#pipeline" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              Pipeline
            </a>
            <a href="#architecture" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              Isolation
            </a>
          </nav>

          {/* Right Action Controls: Search, Theme Toggle, Auth & CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              aria-label="Search academic portals"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => openAuth("login")}
              className="hidden sm:inline-flex text-xs font-semibold text-[var(--ink)] hover:text-[var(--accent)] px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setShowWorkspaceRequestModal(true)}
              className="rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-contrast)] px-5 py-2.5 text-xs font-semibold tracking-tight transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              Request Workspace
            </button>
          </div>

        </div>
      </header>

      {/* 2. Hero Section: Asymmetric Composition with Squircle Hero Frame & Playful Badges */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[var(--border)]">
        
        {/* Organic Hand-Drawn Accent Lines (Reference Style) */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 250C300 120 700 480 1200 180C1400 60 1550 320 1600 500" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 650C450 520 850 780 1350 480" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="4 8" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Headline & Editorial Description */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              
              <div className="inline-flex items-center gap-2">
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.04] tracking-[-0.03em] font-normal text-[var(--ink)]">
                  Academic Workspaces
                </h1>
                <span className="inline-flex items-center gap-1 text-2xl sm:text-3xl select-none" aria-hidden="true">
                  <span className="text-[#F99D64] font-bold">&#10038;</span>
                  <span className="text-[#0F3D91] dark:text-[#3B82F6] font-bold">&#10038;</span>
                </span>
              </div>

              <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed max-w-xl font-normal">
                Join your university&apos;s isolated academic network. Connect faculties, accredited curricula, and student cohorts with automated syllabus indexing, immutable versioning, and zero cross-institutional data leakage.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => openAuth("signup")}
                  className="rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-contrast)] px-7 py-3.5 text-sm font-semibold tracking-tight transition-all shadow-md cursor-pointer"
                >
                  Get Started
                </button>
                <button
                  type="button"
                  onClick={() => { if (onEnterWorkspace) onEnterWorkspace(); else openAuth("login"); }}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] px-6 py-3.5 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Enter Existing School Portal
                </button>
              </div>

              {/* Floating Angled Tags (Matching Reference Visual) */}
              <div className="pt-4 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FDE047] text-[#4A3B00] shadow-sm transform -rotate-1 hover:rotate-0 transition-transform">
                  <span>#</span> CurriculumSync
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#D8B4F8] text-[#3B125E] shadow-sm transform rotate-2 hover:rotate-0 transition-transform">
                  <span>#</span> AccreditedPrograms
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FBA774] text-[#4D1C08] shadow-sm transform -rotate-2 hover:rotate-0 transition-transform">
                  <span>#</span> TenantIsolation
                </div>
              </div>

            </div>

            {/* Right: Large Squircle Hero Frame & Inset Visual (Matching Image 1 & 4) */}
            <div className="lg:col-span-6 relative">
              
              {/* Main Rounded Hero Frame */}
              <div className="relative rounded-[2.5rem] bg-[#0E2038] dark:bg-[#081324] border border-[#1A385E] p-5 sm:p-7 shadow-2xl overflow-hidden">
                
                {/* Photo Cutout Frame */}
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-neutral-900 border border-white/10 shadow-inner group">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                    alt="University students collaborating on academic coursework"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Inset Program Pill on the Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full font-medium">
                      INES Applied Sciences Cohort 2026
                    </span>
                    <span className="bg-[#86EFAC] text-[#0A2E14] font-semibold px-2.5 py-1 rounded-full text-[11px]">
                      Active Sync
                    </span>
                  </div>
                </div>

                {/* Bottom Widget Rail: Group Stat Card + Asterisk Squircle Seal */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                  
                  {/* Group Stat Pill Card (Matching Image 1) */}
                  <div className="sm:col-span-8 rounded-2xl bg-[#FBA774] p-4 flex items-center justify-between gap-3 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center -space-x-2">
                        <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Student" />
                        <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Student" />
                        <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Student" />
                      </div>
                      <div className="font-display text-lg font-bold text-[#3D1407]">
                        Cohort B2 &bull; Faculty of Sciences
                      </div>
                      <div className="text-xs text-[#3D1407]/80 font-medium tabular-nums">
                        Enrolled Students: 34 &bull; 14 Active Syllabi
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openAuth("login")}
                      aria-label="Open Cohort Roster"
                      className="w-10 h-10 rounded-full bg-white text-[#3D1407] hover:scale-110 flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </button>
                  </div>

                  {/* Soft Lime Asterisk Squircle Seal (Matching Image 1 & 4) */}
                  <div className="sm:col-span-4 rounded-2xl bg-[#D4F49C] h-full min-h-[96px] p-4 flex flex-col items-center justify-center shadow-md text-center">
                    <span className="text-3xl font-extrabold text-[#0E2038] select-none leading-none">&#10038;</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E2038] mt-1.5">
                      Sovra Seal
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. "Directions of Education" Section (Matching Reference Image 2 & 3) */}
      <section id="directions" className="py-16 sm:py-24 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#0E2038] text-[#D4F49C] flex items-center justify-center text-sm font-bold select-none">
                  &#10038;
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  Accredited Academic Pathways
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl text-[var(--ink)] tracking-tight">
                Directions of education
              </h2>
              <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                At our partner institutions, faculties offer extensive pathways and specialized disciplines. Every curriculum is indexed with real-time syllabus versioning and continuous accreditation audits.
              </p>
            </div>

            {/* Quick Carousel / Tabs Navigation */}
            <div className="flex items-center gap-2">
              {directions.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDirectionTab(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    selectedDirectionTab === idx ? "w-8 bg-[var(--accent)]" : "w-2.5 bg-[var(--border)] hover:bg-[var(--ink-muted)]"
                  }`}
                  aria-label={`Select program ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 3 Large Rounded Cards (Matching Image 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {directions.map((dir, idx) => (
              <div
                key={idx}
                className={`relative rounded-[2.25rem] border ${dir.borderClass} ${dir.bgClass} p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}
              >
                <div>
                  {/* Top Bar with Badge + Diagonal Arrow Button */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${dir.tagColor}`}>
                      {dir.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => openAuth("login")}
                      aria-label={`Explore ${dir.title}`}
                      className={`w-9 h-9 rounded-full ${dir.arrowBg} flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-sm`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </button>
                  </div>

                  {/* Title & Duration */}
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                    {dir.title}
                  </h3>
                  <div className="text-xs font-medium opacity-80 mb-4">
                    {dir.duration}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90 mb-6">
                    {dir.description}
                  </p>
                </div>

                {/* Rounded Photo Inset */}
                <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-black/10 border border-black/5 mt-auto">
                  <img
                    src={dir.image}
                    alt={dir.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. "Make Together" / Collaborative Academic Canvas (Matching Reference Image 5) */}
      <section id="collaboration" className="py-16 sm:py-24 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-display text-4xl sm:text-6xl text-[var(--ink)] tracking-tight">
              # Make together
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Engage in the dynamic world of collaborative curriculum drafting and joint academic review. With live group sessions, faculty departments and accreditation boards craft verified educational standards together.
            </p>
          </div>

          {/* Interactive Collaborative Whiteboard Canvas */}
          <div className="relative max-w-5xl mx-auto rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-lg overflow-hidden">
            
            {/* Top Canvas Toolbar */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
              
              {/* Tool Selector Pill */}
              <div className="flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 py-1.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setCanvasActiveTool("pen")}
                  aria-label="Draw Annotation Pen"
                  className={`p-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    canvasActiveTool === "pen" ? "bg-[var(--accent)] text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                  title="Draw Annotation Pen"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasActiveTool("highlight")}
                  aria-label="Highlighter Tool"
                  className={`p-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    canvasActiveTool === "highlight" ? "bg-[var(--accent)] text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                  title="Highlighter"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasActiveTool("stamp")}
                  aria-label="Accreditation Seal Stamp"
                  className={`p-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    canvasActiveTool === "stamp" ? "bg-[var(--accent)] text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                  title="Accreditation Seal Stamp"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setCanvasNotes([])}
                  aria-label="Clear all canvas annotations"
                  className="p-1.5 rounded-full text-xs text-[var(--ink-muted)] hover:text-red-500 transition-colors cursor-pointer"
                  title="Clear annotations"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Live Session Status */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync (3 Faculty Active)
                </span>
              </div>

            </div>

            {/* Interactive Canvas Area */}
            <div
              role="region"
              aria-label="Interactive academic review whiteboard canvas"
              tabIndex={0}
              onClick={addCanvasNote}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const newNote = {
                    id: Date.now(),
                    text: "Verified syllabus learning objective",
                    x: 50,
                    y: 50,
                    author: "You (Active Reviewer)",
                    color: canvasActiveTool === "pen" ? "#86EFAC" : canvasActiveTool === "highlight" ? "#FDE047" : "#BAE0FD"
                  };
                  setCanvasNotes(prev => [...prev.slice(-3), newNote]);
                }
              }}
              className="relative w-full h-80 sm:h-96 rounded-2xl bg-[var(--bg)] border border-dashed border-[var(--border)] overflow-hidden cursor-crosshair select-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              
              {/* Subtle Grid Pattern */}
              <div className="absolute inset-0 opacity-15 dark:opacity-10 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              {/* Hand-Drawn Stroke Simulation (Matching Image 5) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" fill="none">
                <path
                  d="M150 200 C 260 260, 360 140, 480 210 S 660 180, 720 160"
                  stroke="#EAB308"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-75"
                />
              </svg>

              {/* Active User Cursor 1: Jane Cooper (Lavender) */}
              <div className="absolute top-[28%] left-[18%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-all duration-700 animate-pulse">
                <div className="flex items-center gap-1.5 bg-[#D8B4F8] text-[#3B125E] font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                  <img className="w-4 h-4 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="Jane" />
                  Jane Cooper (Dean)
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#D8B4F8]" />
              </div>

              {/* Active User Cursor 2: Jenny Wilson (Orange) */}
              <div className="absolute top-[42%] right-[22%] translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-all duration-700">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FBA774]" />
                <div className="flex items-center gap-1.5 bg-[#FBA774] text-[#3D1407] font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                  <img className="w-4 h-4 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" alt="Jenny" />
                  Jenny Wilson (Curriculum Chair)
                </div>
              </div>

              {/* Active User Cursor 3: Leslie Alexander (Dark Green) */}
              <div className="absolute bottom-[20%] right-[32%] flex items-center gap-2 pointer-events-none transition-all duration-700">
                <div className="flex items-center gap-1.5 bg-[#0E2038] text-[#D4F49C] font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                  <img className="w-4 h-4 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" alt="Leslie" />
                  Leslie Alexander (Auditor)
                </div>
              </div>

              {/* Dynamic Placed Annotation Pins */}
              {canvasNotes.map((note) => (
                <div
                  key={note.id}
                  style={{ top: `${note.y}%`, left: `${note.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div
                    style={{ backgroundColor: note.color }}
                    className="text-black text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-black/10 flex items-center gap-1.5"
                  >
                    <span>&#9998;</span>
                    <span>{note.text}</span>
                  </div>
                </div>
              ))}

              {/* Hint Overlay */}
              <div className="absolute bottom-3 left-4 text-[11px] text-[var(--ink-muted)] pointer-events-none">
                Click anywhere on canvas to drop a peer review feedback pin
              </div>

            </div>

            {/* Bottom Inset Seal & Callout (Matching Reference Image 5) */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--ink-muted)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0E2038] text-[#D4F49C] flex items-center justify-center font-bold text-lg select-none">
                  &#10038;
                </div>
                <span>
                  Join the Academic Board &bull; Peer review syllabi before semester publishing
                </span>
              </div>

              <button
                type="button"
                onClick={() => openAuth("login")}
                className="btn-accent px-5 py-2 text-xs font-semibold rounded-full cursor-pointer"
              >
                Join Collaborative Session
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Cryptographic Tenant Isolation Showcase (Interactive Diagram) */}
      <section id="architecture" className="border-b border-[var(--border)] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Zero-Trust Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-[var(--ink)] tracking-tight">
              Cryptographic boundary isolation across universities
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Every institution deployed on Sovra operates as a dedicated logical partition. Faculty evaluations, student submissions, examination keys, and lecture archives are bound to the school&apos;s unique workspace identifier, backed by strict PostgreSQL Row-Level Security policies.
            </p>
          </div>

          {/* Interactive Multi-Tenant Diagram Component */}
          <TenantIsolationDiagram />

        </div>
      </section>

      {/* 6. Isolated School Workspace Showcase (Editorial Split-Grid) */}
      <section id="workspaces" className="border-b border-[var(--border)] py-16 sm:py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Modular Infrastructure
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-[var(--ink)] tracking-tight">
              Four unified quadrants in every institutional workspace
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Sovra replaces scattered learning management systems, unversioned PDF email chains, and manual paper registries with a single verified institutional workspace.
            </p>
          </div>

          {/* Editorial Split-Grid with Hairline Borders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quadrant 1 */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--bg)] space-y-4 hover:border-[var(--accent)] transition-colors">
              <span className="font-display text-2xl text-[var(--ink)]">01 / Student Directory & Cohort Portals</span>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Automated student profiles linked to academic degree tracks, enrollment years, and course assignments. Cohorts access verified class rosters, discussion boards, and attendance logs without administrative friction.
              </p>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-2 border-t border-[var(--border)]">
                <li>&bull; SSO login matching university email domains (.ac.rw, .edu)</li>
                <li>&bull; Academic year level gating (Year 1 through Final Clinical Year)</li>
                <li>&bull; Self-service student verification and ID tracking</li>
              </ul>
            </div>

            {/* Quadrant 2 */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--bg)] space-y-4 hover:border-[var(--accent)] transition-colors">
              <span className="font-display text-2xl text-[var(--ink)]">02 / Faculty Curricula & Accreditation Records</span>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Lecturers and department deans maintain live, structured curricula aligned with national accreditation boards. Every course change is indexed with learning milestones, credit hours, and prerequisite dependencies.
              </p>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-2 border-t border-[var(--border)]">
                <li>&bull; Automated syllabus structure extraction and validation</li>
                <li>&bull; Departmental peer review sign-offs before public publication</li>
                <li>&bull; Real-time alignment with regulatory audit requirements</li>
              </ul>
            </div>

            {/* Quadrant 3 */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--bg)] space-y-4 hover:border-[var(--accent)] transition-colors">
              <span className="font-display text-2xl text-[var(--ink)]">03 / Curated Resource Vault & Compendiums</span>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Lecturers publish official lecture notes, reference textbooks, past examination papers, and clinical manuals directly into the course vault. Students download verified materials with complete confidence in accuracy.
              </p>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-2 border-t border-[var(--border)]">
                <li>&bull; Multi-format support: PDF, DOCX, presentation slides, lab sheets</li>
                <li>&bull; Instant download tracking and lecturer publication approvals</li>
                <li>&bull; Automated compendium generation for offline study</li>
              </ul>
            </div>

            {/* Quadrant 4 */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--bg)] space-y-4 hover:border-[var(--accent)] transition-colors">
              <span className="font-display text-2xl text-[var(--ink)]">04 / Automated Passcode Attendance Registry</span>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Lecturers and class representatives open time-slotted roll call sessions verified by dynamic passcodes and institutional location checks. Eliminates paper sign-in sheets and ensures transparent attendance records.
              </p>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-2 border-t border-[var(--border)]">
                <li>&bull; Time-bounded passcode validation per lecture session</li>
                <li>&bull; One-click attendance roster export for faculty boards</li>
                <li>&bull; Automated absence diagnostics and dean notifications</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Academic Documentation Pipeline Section (Interactive Diagram) */}
      <section id="pipeline" className="border-b border-[var(--border)] py-16 sm:py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Automated Lifecycle
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-[var(--ink)] tracking-tight">
              The academic documentation lifecycle, automated
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              From the moment a syllabus draft is authored to its distribution across student cohorts, Sovra ensures every document is cryptographically verified, version-controlled, and instantly retrievable.
            </p>
          </div>

          {/* Interactive Pipeline Diagram Component */}
          <AcademicDocPipelineDiagram />

        </div>
      </section>

      {/* 8. Institutional Metrics & Final Invitation */}
      <section className="py-20 sm:py-28 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Metrics Bar with Plus Jakarta Sans tabular-nums */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-[var(--border)] py-10 gap-8">
            <div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)] tabular-nums mb-1">
                100%
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Cryptographic Tenant Boundary Isolation
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)] tabular-nums mb-1">
                &lt; 50ms
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Institutional Sync & Retrieval Latency
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)] tabular-nums mb-1">
                0
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Cross-Tenant Information Leakage
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)] tabular-nums mb-1">
                256-bit
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                AES Document Encryption at Rest
              </div>
            </div>
          </div>

          {/* Final Editorial Invitation */}
          <div className="max-w-3xl space-y-6">
            <h3 className="font-display text-4xl sm:text-6xl text-[var(--ink)] tracking-tight">
              Ready to deploy your university&apos;s academic workspace?
            </h3>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Connect your faculty, students, and academic departments into a single modern workspace with zero setup friction.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setShowWorkspaceRequestModal(true)}
                className="rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-contrast)] px-8 py-3.5 text-sm font-semibold tracking-tight transition-all shadow-md cursor-pointer"
              >
                Request Institution Workspace
              </button>
              <button
                type="button"
                onClick={() => { if (onEnterWorkspace) onEnterWorkspace(); else openAuth("login"); }}
                className="rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--ink)] px-7 py-3.5 text-sm font-semibold transition-colors cursor-pointer"
              >
                Sign In to Existing School Portal
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 9. Footer: Minimalist Editorial Layout */}
      <footer className="border-t border-[var(--border)] py-12 bg-[var(--bg)] text-xs text-[var(--ink-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold text-[var(--ink)]">SOVRA</span>
            <span>&bull;</span>
            <span>Automated Academic Documentation Network</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#workspaces" className="hover:text-[var(--ink)] transition-colors">Workspaces</a>
            <a href="#directions" className="hover:text-[var(--ink)] transition-colors">Directions</a>
            <a href="#collaboration" className="hover:text-[var(--ink)] transition-colors">Collaboration</a>
            <a href="#pipeline" className="hover:text-[var(--ink)] transition-colors">Pipeline</a>
            <a href="#architecture" className="hover:text-[var(--ink)] transition-colors">Architecture</a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Sovra Platform. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="font-display text-xl text-[var(--ink)]">Search Academic Portals</span>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                aria-label="Close search dialog"
                className="text-[var(--ink-muted)] hover:text-[var(--ink)] text-sm cursor-pointer p-1"
              >
                &times;
              </button>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Search by school, faculty, program, or course code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-4 py-3 outline-none focus:border-[var(--accent)] text-xs"
            />
            <div className="text-xs text-[var(--ink-muted)] space-y-2 pt-2">
              <span className="font-semibold text-[var(--ink)] block">Featured Institutional Portals:</span>
              <button
                type="button"
                onClick={() => { setShowSearchModal(false); if (onEnterWorkspace) onEnterWorkspace("tenant-ines"); else openAuth("login"); }}
                className="w-full text-left p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] cursor-pointer flex items-center justify-between transition-colors text-xs text-[var(--ink)]"
              >
                <span>INES-Ruhengeri Applied Sciences (ines.ac.rw)</span>
                <span className="text-[var(--accent)] font-semibold">Enter &rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowSearchModal(false); if (onEnterWorkspace) onEnterWorkspace("tenant-kcs"); else openAuth("login"); }}
                className="w-full text-left p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] cursor-pointer flex items-center justify-between transition-colors text-xs text-[var(--ink)]"
              >
                <span>Kigali College of Science (kcs.ac.rw)</span>
                <span className="text-[var(--accent)] font-semibold">Enter &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Request Institution Workspace */}
      {showWorkspaceRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="font-display text-2xl text-[var(--ink)]">Request Institution Workspace</span>
              <button
                type="button"
                onClick={() => setShowWorkspaceRequestModal(false)}
                aria-label="Close workspace request dialog"
                className="text-[var(--ink-muted)] hover:text-[var(--ink)] text-sm cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            {requestSubmitted ? (
              <div className="p-4 rounded-2xl border border-[var(--accent)] bg-[var(--surface)] text-xs text-[var(--ink)] space-y-2">
                <span className="block font-semibold">Workspace Provisioning Request Received</span>
                <p className="text-[var(--ink-muted)]">
                  An institutional setup link has been routed to your academic administration email. Our governance onboarding team will confirm your domain within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="institution-name" className="block text-[var(--ink-muted)] font-medium mb-1">
                    Institution / University Name
                  </label>
                  <input
                    id="institution-name"
                    type="text"
                    required
                    placeholder="e.g. INES-Ruhengeri Applied Sciences"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label htmlFor="institution-email" className="block text-[var(--ink-muted)] font-medium mb-1">
                    Official Administrative Email (.edu, .ac)
                  </label>
                  <input
                    id="institution-email"
                    type="email"
                    required
                    placeholder="e.g. academic.registrar@ines.ac.rw"
                    value={institutionEmail}
                    onChange={(e) => setInstitutionEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label htmlFor="institution-role" className="block text-[var(--ink-muted)] font-medium mb-1">
                    Institutional Role
                  </label>
                  <select
                    id="institution-role"
                    value={institutionRole}
                    onChange={(e) => setInstitutionRole(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] px-3 py-2.5 outline-none focus:border-[var(--accent)]"
                  >
                    <option value="Dean of Academic Affairs">Dean of Academic Affairs</option>
                    <option value="Department Head / Chair">Department Head / Chair</option>
                    <option value="Academic Registrar">Academic Registrar</option>
                    <option value="Curriculum & Accreditation Officer">Curriculum & Accreditation Officer</option>
                    <option value="Faculty Lecturer">Faculty Lecturer</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWorkspaceRequestModal(false)}
                    className="px-4 py-2 text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--accent)] text-white px-5 py-2.5 font-semibold cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Authentication Gateway (Login / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md my-8">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close authentication gateway"
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm font-semibold cursor-pointer z-10 p-1"
            >
              Close &times;
            </button>
            <AuthPage
              initialMode={authMode}
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
};

export default LandingPage;
