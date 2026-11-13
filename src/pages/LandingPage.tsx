/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import TenantIsolationDiagram from "../components/diagrams/TenantIsolationDiagram";
import AcademicDocPipelineDiagram from "../components/diagrams/AcademicDocPipelineDiagram";

export interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onEnterWorkspace?: (schoolId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToSignUp,
  onEnterWorkspace,
}) => {
  const [selectedDirectionTab, setSelectedDirectionTab] = useState<number>(0);
  const [canvasActiveTool, setCanvasActiveTool] = useState<"pen" | "highlight" | "stamp" | "eraser">("pen");
  const [canvasNotes, setCanvasNotes] = useState<Array<{ id: number; text: string; x: number; y: number; author: string; color: string }>>([
    { id: 1, text: "Curriculum matches 2026 academic standards ✓", x: 28, y: 35, author: "Dr. Jane Cooper", color: "#D8B4F8" },
    { id: 2, text: "Clinical hours verified by department board", x: 62, y: 55, author: "Prof. Wade Warren", color: "#FBA774" }
  ]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  const openAuth = (mode: "login" | "signup") => {
    if (mode === "signup") {
      onNavigateToSignUp();
    } else {
      onNavigateToLogin();
    }
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
      author: "You (Reviewer)",
      color: canvasActiveTool === "pen" ? "#86EFAC" : canvasActiveTool === "highlight" ? "#FDE047" : "#BAE0FD"
    };
    setCanvasNotes(prev => [...prev.slice(-3), newNote]);
  };

  // Academic Directions (Curated Degree Programs)
  const directions = [
    {
      badge: "Degree Program",
      title: "Applied Pharmacology",
      duration: "4 years of clinical study",
      studentsCount: "420 Students",
      bgClass: "bg-[#D4F49C] text-[#0F2916] dark:bg-[#152B1C] dark:text-[#D4F49C]",
      borderClass: "border-[#B5E86E]/40 dark:border-[#23452E]",
      tagColor: "bg-[#0F2916] text-[#D4F49C] dark:bg-[#D4F49C] dark:text-[#0F2916]",
      arrowBg: "bg-white/90 text-[#0F2916] dark:bg-[#0F2916] dark:text-white",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80",
      description: "Pharmaceutical chemistry, clinical dosage modeling, laboratory pharmacokinetics, and healthcare regulatory compliance."
    },
    {
      badge: "Degree Program",
      title: "Distributed Systems & AI",
      duration: "3 years of software engineering",
      studentsCount: "680 Students",
      bgClass: "bg-[#FBA774] text-[#3D1407] dark:bg-[#381B10] dark:text-[#FFCEBC]",
      borderClass: "border-[#F99252]/40 dark:border-[#522818]",
      tagColor: "bg-[#3D1407] text-[#FBA774] dark:bg-[#FFCEBC] dark:text-[#3D1407]",
      arrowBg: "bg-white/90 text-[#3D1407] dark:bg-[#3D1407] dark:text-white",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80",
      description: "Modern network architectures, database design, machine learning pipelines, and verified algorithmic computation."
    },
    {
      badge: "Clinical Track",
      title: "Clinical Medicine & Surgery",
      duration: "5 years of hospital rotation",
      studentsCount: "310 Students",
      bgClass: "bg-[#B6D6F8] text-[#0A1E35] dark:bg-[#10233B] dark:text-[#CEE6FF]",
      borderClass: "border-[#96C3F5]/40 dark:border-[#1A385E]",
      tagColor: "bg-[#0A1E35] text-[#B6D6F8] dark:bg-[#CEE6FF] dark:text-[#0A1E35]",
      arrowBg: "bg-white/90 text-[#0A1E35] dark:bg-[#0A1E35] dark:text-white",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=700&q=80",
      description: "Internal medicine, pathology, surgical rounds, diagnostics, and patient care ethics in university teaching hospitals."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans antialiased transition-colors duration-150 selection:bg-[var(--accent)] selection:text-white">
      
      {/* 1. Header: Approachable Academic Navigation (Product, Features, Future Products, About) */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark (Plus Jakarta Sans Sole Typeface Rule) */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <span className="font-sans font-bold text-2xl sm:text-3xl tracking-[-0.03em] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                SOVRA
              </span>
            </a>
          </div>

          {/* Central Academic Navigation Links */}
          <nav className="hidden lg:flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1 shadow-xs text-xs font-medium text-[var(--ink-muted)]">
            <a href="#product" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              Product
            </a>
            <a href="#features" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              Features
            </a>
            <a href="#future" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              Future Products
            </a>
            <a href="#about" className="px-4 py-1.5 rounded-full hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors">
              About
            </a>
          </nav>

          {/* Right Action Controls: Search, Theme Toggle, Sign In, Primary CTA & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              aria-label="Search campus directory"
              className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => openAuth("login")}
              className="hidden sm:inline-flex min-h-[44px] items-center text-xs font-semibold text-[var(--ink)] hover:text-[var(--accent)] px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="hidden sm:inline-flex min-h-[44px] items-center rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-contrast)] px-5 py-2.5 text-xs font-semibold tracking-tight transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              Join Your University
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileNavOpen}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                {mobileNavOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile & Tablet Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)] px-4 sm:px-6 py-4 space-y-4">
            <nav aria-label="Mobile navigation" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href="#product"
                onClick={() => setMobileNavOpen(false)}
                className="min-h-[44px] flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
              >
                Product
              </a>
              <a
                href="#features"
                onClick={() => setMobileNavOpen(false)}
                className="min-h-[44px] flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
              >
                Features
              </a>
              <a
                href="#future"
                onClick={() => setMobileNavOpen(false)}
                className="min-h-[44px] flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
              >
                Future Products
              </a>
              <a
                href="#about"
                onClick={() => setMobileNavOpen(false)}
                className="min-h-[44px] flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
              >
                About
              </a>
            </nav>

            <div className="sm:hidden flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  openAuth("login");
                }}
                className="min-h-[44px] w-full rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--ink)] px-4 py-2.5 cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  onNavigateToSignUp();
                }}
                className="min-h-[44px] w-full rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-semibold px-4 py-2.5 cursor-pointer"
              >
                Join Your University
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section: Human Academic Language */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[var(--border)]">
        
        {/* Subtle decorative curves */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 250C300 120 700 480 1200 180C1400 60 1550 320 1600 500" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 650C450 520 850 780 1350 480" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="4 8" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Headline & Academic Subtitle */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              
              <div className="inline-flex items-center gap-2">
                <h1 className="font-sans font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.04] tracking-[-0.03em] text-[var(--ink)]">
                  The private campus hub for your university.
                </h1>
              </div>

              <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed max-w-xl font-normal">
                Where students access verified lecture notes, professors organize course syllabi, and departments organize learning materials in one private space.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="w-full sm:w-auto min-h-[44px] rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-contrast)] px-7 py-3.5 text-sm font-semibold tracking-tight transition-all shadow-md cursor-pointer"
                >
                  Join Your University
                </button>
                <button
                  type="button"
                  onClick={() => { if (onEnterWorkspace) onEnterWorkspace(); else openAuth("login"); }}
                  className="w-full sm:w-auto min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] px-6 py-3.5 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Open Campus Portal
                </button>
              </div>

              {/* Role-Specific Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[var(--border)]">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--ink)]">For Students</span>
                  <p className="text-xs text-[var(--ink-muted)] leading-normal">
                    Verified course syllabi, past exam papers, and class notes in one clean library.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--ink)]">For Lecturers</span>
                  <p className="text-xs text-[var(--ink-muted)] leading-normal">
                    Update reading lists once, manage roll call, and notify your cohorts instantly.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--ink)]">For Universities</span>
                  <p className="text-xs text-[var(--ink-muted)] leading-normal">
                    A private academic hub reserved strictly for enrolled students and faculty.
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Squircle Hero Frame & Inset Academic Preview */}
            <div className="lg:col-span-6 relative">
              
              {/* Main Rounded Frame */}
              <div className="relative rounded-[2.5rem] bg-[#0E2038] dark:bg-[#081324] border border-[#1A385E] p-5 sm:p-7 shadow-2xl overflow-hidden">
                
                {/* Photo Frame */}
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-neutral-900 border border-white/10 shadow-inner group">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                    alt="University students collaborating on academic coursework"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Inset Course Pill */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full font-medium">
                      INES Applied Sciences &bull; Cohort 2026
                    </span>
                    <span className="bg-[#86EFAC] text-[#0A2E14] font-semibold px-2.5 py-1 rounded-full text-[11px]">
                      Active Semester
                    </span>
                  </div>
                </div>

                {/* Bottom Widget Rail: Cohort Card + Seal */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                  
                  {/* Cohort Summary Card */}
                  <div className="sm:col-span-8 rounded-2xl bg-[#FBA774] p-4 flex items-center justify-between gap-3 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center -space-x-2">
                        <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Student" />
                        <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Student" />
                        <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Student" />
                      </div>
                      <div className="font-sans text-base font-bold text-[#3D1407]">
                        Cohort B2 &bull; Faculty of Sciences
                      </div>
                      <div className="text-xs text-[#3D1407]/80 font-medium tabular-nums">
                        34 Enrolled Students &bull; 14 Verified Syllabi
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openAuth("login")}
                      aria-label="Open Cohort Roster"
                      className="w-10 h-10 rounded-full bg-white text-[#3D1407] hover:scale-110 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </button>
                  </div>

                  {/* Seal */}
                  <div className="sm:col-span-4 rounded-2xl bg-[#D4F49C] h-full min-h-[96px] p-4 flex flex-col items-center justify-center shadow-md text-center">
                    <span className="text-3xl font-extrabold text-[#0E2038] select-none leading-none">&#10038;</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E2038] mt-1.5">
                      Sovra Verified
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Product Section: Dedicated Campus Spaces (#product) */}
      <section id="product" className="py-16 sm:py-24 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Product Overview
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[var(--ink)] tracking-[-0.03em]">
              Dedicated campus spaces for every school
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Every university on Sovra receives its own dedicated digital campus. Course materials, student records, and faculty reviews remain completely private to your institution—accessible only by verified campus email addresses.
            </p>
          </div>

          {/* Interactive Campus Spaces Diagram */}
          <TenantIsolationDiagram />

        </div>
      </section>

      {/* 4. Features Section: Core Academic Pillars (#features) */}
      <section id="features" className="py-16 sm:py-24 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Features
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[var(--ink)] tracking-[-0.03em]">
              Everything students and faculty need to excel
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Designed around the everyday needs of university life—from first-day syllabus orientation to final exam revision.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4 hover:border-[var(--accent)] transition-colors">
              <span className="font-sans text-2xl font-bold text-[var(--ink)] tracking-tight">01 / Verified Course Syllabi & Schedules</span>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Clear course outlines, lecture schedules, credit requirements, and official office hours maintained by your professors. Always know what is expected each week.
              </p>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-2 border-t border-[var(--border)]">
                <li>&bull; Instant access to learning objectives and grading criteria</li>
                <li>&bull; Automatically updated weekly lecture topics and reading lists</li>
                <li>&bull; Linked prerequisite requirements for graduation tracking</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4 hover:border-[var(--accent)] transition-colors">
              <span className="font-sans text-2xl font-bold text-[var(--ink)] tracking-tight">02 / Shared Department Resource Library</span>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Official lecture slides, required textbook chapters, sample lab exercises, and past exam guides organized by semester and course code.
              </p>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-2 border-t border-[var(--border)]">
                <li>&bull; Searchable documents across departments and faculties</li>
                <li>&bull; Verified lecture notes approved directly by teaching staff</li>
                <li>&bull; Downloadable files for uninterrupted offline study</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4 hover:border-[var(--accent)] transition-colors">
              <span className="font-sans text-2xl font-bold text-[var(--ink)] tracking-tight">03 / Cohort Discussions & Live Roll Call</span>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                Fast roll call during lectures with simple time-limited codes, combined with course discussion boards where classmates and teaching assistants answer questions.
              </p>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-2 border-t border-[var(--border)]">
                <li>&bull; Quick attendance verification on your phone or laptop</li>
                <li>&bull; Classmate study groups organized by academic year</li>
                <li>&bull; Direct announcements from class representatives and professors</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4 hover:border-[var(--accent)] transition-colors">
              <span className="font-sans text-2xl font-bold text-[var(--ink)] tracking-tight">04 / Instant Campus Updates & Reading Lists</span>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                When a professor updates an assignment deadline or uploads new study materials, enrolled students receive clear notifications without relying on noisy chat groups.
              </p>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-2 border-t border-[var(--border)]">
                <li>&bull; Real-time notifications for schedule or venue changes</li>
                <li>&bull; Track revised reading lists and supplementary lecture slides</li>
                <li>&bull; Centralized academic calendar synced to semester dates</li>
              </ul>
            </div>

          </div>

          {/* Interactive Document Lifecycle Diagram */}
          <div className="space-y-6 pt-8 border-t border-[var(--border)]">
            <div className="max-w-2xl space-y-2">
              <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-[-0.03em]">
                How course materials move through your university
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                From a lecturer&apos;s initial syllabus draft to faculty review and instant student delivery across the campus.
              </p>
            </div>
            <AcademicDocPipelineDiagram />
          </div>

          {/* Directions of Study (Curricula Showcase) */}
          <div className="space-y-8 pt-8 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl space-y-2">
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-[-0.03em]">
                  Featured academic directions
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                  Accredited curricula designed for hands-on learning and professional preparation.
                </p>
              </div>

              {/* Quick Carousel / Tabs */}
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

            {/* 3 Program Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {directions.map((dir, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-[2.25rem] border ${dir.borderClass} ${dir.bgClass} p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${dir.tagColor}`}>
                        {dir.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => openAuth("login")}
                        aria-label={`Explore ${dir.title}`}
                        className={`w-9 h-9 rounded-full ${dir.arrowBg} flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-xs`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </button>
                    </div>

                    <h4 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                      {dir.title}
                    </h4>
                    <div className="text-xs font-medium opacity-80 mb-4">
                      {dir.duration}
                    </div>
                    <p className="text-xs leading-relaxed opacity-90 mb-6">
                      {dir.description}
                    </p>
                  </div>

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

          {/* Collaborative Academic Whiteboard */}
          <div className="space-y-6 pt-8 border-t border-[var(--border)]">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="font-sans font-bold text-2xl sm:text-4xl text-[var(--ink)] tracking-[-0.03em]">
                Collaborative curriculum review
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                Faculty boards and lecturers review learning objectives together before releasing course materials to students.
              </p>
            </div>

            {/* Interactive Whiteboard Canvas */}
            <div className="relative max-w-5xl mx-auto rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-lg overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
                <div className="flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 py-1.5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setCanvasActiveTool("pen")}
                    aria-label="Draw Annotation Pen"
                    className={`p-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      canvasActiveTool === "pen" ? "bg-[var(--accent)] text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                    }`}
                    title="Pen"
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
                    aria-label="Approval Seal"
                    className={`p-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      canvasActiveTool === "stamp" ? "bg-[var(--accent)] text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                    }`}
                    title="Approval Seal"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasNotes([])}
                    aria-label="Clear annotations"
                    className="p-1.5 rounded-full text-xs text-[var(--ink-muted)] hover:text-red-500 transition-colors cursor-pointer"
                    title="Clear"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    3 Faculty Reviewers Active
                  </span>
                </div>
              </div>

              {/* Whiteboard Canvas */}
              <div
                role="region"
                aria-label="Interactive academic review canvas"
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
                      author: "You (Reviewer)",
                      color: canvasActiveTool === "pen" ? "#86EFAC" : canvasActiveTool === "highlight" ? "#FDE047" : "#BAE0FD"
                    };
                    setCanvasNotes(prev => [...prev.slice(-3), newNote]);
                  }
                }}
                className="relative w-full h-80 sm:h-96 rounded-2xl bg-[var(--bg)] border border-dashed border-[var(--border)] overflow-hidden cursor-crosshair select-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <div className="absolute inset-0 opacity-15 dark:opacity-10 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

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

                {/* Simulated Reviewer 1 */}
                <div className="absolute top-[28%] left-[18%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-all duration-700 animate-pulse">
                  <div className="flex items-center gap-1.5 bg-[#D8B4F8] text-[#3B125E] font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                    <img className="w-4 h-4 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="Jane" />
                    Dr. Jane Cooper (Dean)
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D8B4F8]" />
                </div>

                {/* Simulated Reviewer 2 */}
                <div className="absolute top-[42%] right-[22%] translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-all duration-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FBA774]" />
                  <div className="flex items-center gap-1.5 bg-[#FBA774] text-[#3D1407] font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                    <img className="w-4 h-4 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" alt="Jenny" />
                    Prof. Jenny Wilson (Curriculum Chair)
                  </div>
                </div>

                {/* Dynamic Placed Pins */}
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

                <div className="absolute bottom-3 left-4 text-[11px] text-[var(--ink-muted)] pointer-events-none">
                  Click anywhere to add a peer review feedback note
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--ink-muted)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0E2038] text-[#D4F49C] flex items-center justify-center font-bold text-base select-none">
                    &#10038;
                  </div>
                  <span>
                    Faculty Curriculum Board &bull; Review course learning outcomes before semester start
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="rounded-full bg-[var(--accent)] text-white px-5 py-2 text-xs font-semibold cursor-pointer"
                >
                  Join Department Review
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. Future Products Section (#future) */}
      <section id="future" className="py-16 sm:py-24 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Future Products
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[var(--ink)] tracking-[-0.03em]">
              Upcoming academic innovations
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              New capabilities currently in development to further empower students and educators across partner campuses.
            </p>
          </div>

          {/* 3 Future Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Future Product 1 */}
            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between space-y-6 hover:border-[var(--accent)] transition-colors">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D8B4F8]/20 text-[#6B21A8] dark:text-[#D8B4F8] border border-[#D8B4F8]/40">
                  Coming Fall 2026
                </div>
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[var(--ink)] tracking-tight">
                  AI Study & Citation Companion
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                  Context-aware study guides, citation formatting (APA, IEEE, Harvard), and syllabus review assistants grounded strictly in your lecturer&apos;s verified materials.
                </p>
              </div>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-4 border-t border-[var(--border)]">
                <li>&bull; Practice quizzes generated from lecture notes</li>
                <li>&bull; Automatic citation checking for thesis drafts</li>
                <li>&bull; Strict grounding to university course content</li>
              </ul>
            </div>

            {/* Future Product 2 */}
            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between space-y-6 hover:border-[var(--accent)] transition-colors">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#86EFAC]/20 text-[#166534] dark:text-[#86EFAC] border border-[#86EFAC]/40">
                  In Development
                </div>
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[var(--ink)] tracking-tight">
                  Cross-University Research Exchange
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                  A verified inter-institutional network allowing researchers and postgraduate candidates to discover open datasets and share peer-reviewed findings across accredited campuses.
                </p>
              </div>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-4 border-t border-[var(--border)]">
                <li>&bull; Inter-campus faculty collaboration spaces</li>
                <li>&bull; Open access publication repository</li>
                <li>&bull; Verified institutional peer reviews</li>
              </ul>
            </div>

            {/* Future Product 3 */}
            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between space-y-6 hover:border-[var(--accent)] transition-colors">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDE047]/20 text-[#854D0E] dark:text-[#FDE047] border border-[#FDE047]/40">
                  Design Phase
                </div>
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[var(--ink)] tracking-tight">
                  Automated Exam & Curriculum Planner
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                  Intelligent course scheduling, conflict-free exam timetabling, and accredited credit tracking across academic semesters to ensure smooth graduation.
                </p>
              </div>
              <ul className="text-xs text-[var(--ink-muted)] space-y-2 pt-4 border-t border-[var(--border)]">
                <li>&bull; Conflict-free examination room scheduling</li>
                <li>&bull; Automatic credit audit toward graduation</li>
                <li>&bull; Department workload balancing tools</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 6. About Section: Mission & Story (#about) */}
      <section id="about" className="py-16 sm:py-24 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                About Sovra
              </span>
              <h2 className="font-sans font-bold text-3xl sm:text-5xl text-[var(--ink)] tracking-[-0.03em]">
                Academic knowledge should be organized, accessible, and effortless.
              </h2>
              <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                Too often, university coursework is scattered across chaotic WhatsApp groups, lost email attachments, and paper bulletin boards. Lecturers spend hours re-sending the same syllabus, while students struggle to find verified past exams or lecture slides.
              </p>
              <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                Sovra was created to solve this once and for all. We provide every university with a private, structured digital home where accredited curricula, lecture notes, and student cohorts come together seamlessly.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-lg">
                    &#10038;
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-[var(--ink)]">
                      The Sovra Commitment
                    </h3>
                    <p className="text-xs text-[var(--ink-muted)]">
                      Built with students, lecturers, and academic deans
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-[var(--ink)]">01.</span>
                    <span><strong>Verified Sources:</strong> Every document in the vault is signed off by university faculty, eliminating counterfeit or outdated study materials.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-[var(--ink)]">02.</span>
                    <span><strong>Strict Privacy:</strong> Student grades, attendance records, and faculty feedback remain completely private to your school community.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-[var(--ink)]">03.</span>
                    <span><strong>Always Accessible:</strong> Fast, clean interface designed to work smoothly on mobile data and low-bandwidth campus WiFi.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Academic Metrics with Plus Jakarta Sans tabular-nums */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-[var(--border)] py-10 gap-8">
            <div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] tabular-nums mb-1">
                100%
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Private Campus Spaces
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] tabular-nums mb-1">
                &lt; 1 min
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Course Material Updates
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] tabular-nums mb-1">
                0
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Unverified Study Notes
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] tabular-nums mb-1">
                24/7
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Campus Library Access
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Final Invitation: Clean Call to Action */}
      <section className="py-20 sm:py-28 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <h3 className="font-sans font-bold text-3xl sm:text-5xl lg:text-6xl text-[var(--ink)] tracking-[-0.03em]">
              Ready to open your university&apos;s private campus hub?
            </h3>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
              Connect your students, faculty, and academic departments into a verified campus space today.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-contrast)] px-8 py-3.5 text-sm font-semibold tracking-tight transition-all shadow-md cursor-pointer"
              >
                Join Your University
              </button>
              <button
                type="button"
                onClick={() => { if (onEnterWorkspace) onEnterWorkspace(); else openAuth("login"); }}
                className="rounded-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--ink)] px-7 py-3.5 text-sm font-semibold transition-colors cursor-pointer"
              >
                Sign In to Existing Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer: Minimalist Academic Layout */}
      <footer className="py-12 bg-[var(--bg)] text-xs text-[var(--ink-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-sans font-bold text-lg text-[var(--ink)]">SOVRA</span>
            <span>&bull;</span>
            <span>Academic Resource Network</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#product" className="hover:text-[var(--ink)] transition-colors">Product</a>
            <a href="#features" className="hover:text-[var(--ink)] transition-colors">Features</a>
            <a href="#future" className="hover:text-[var(--ink)] transition-colors">Future Products</a>
            <a href="#about" className="hover:text-[var(--ink)] transition-colors">About</a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Sovra Platform. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modal: Search Campus Directory */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="font-sans font-bold text-lg text-[var(--ink)]">Search Campus Directory</span>
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
              <span className="font-semibold text-[var(--ink)] block">Partner Universities:</span>
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

    </div>
  );
};

export default LandingPage;
