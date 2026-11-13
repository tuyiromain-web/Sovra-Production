/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

interface CampusSpace {
  id: string;
  name: string;
  code: string;
  slug: string;
  domain: string;
  studentsCount: string;
  facultyDocs: string;
  activePrograms: string;
  storageUsage: string;
  programs: string[];
  recentMaterials: string[];
}

const CAMPUS_SPACES: CampusSpace[] = [
  {
    id: "campus-ines",
    name: "INES-Ruhengeri Applied Sciences",
    code: "INES",
    slug: "ines-ruhengeri",
    domain: "ines.ac.rw",
    studentsCount: "1,248",
    facultyDocs: "412",
    activePrograms: "18",
    storageUsage: "4.8 GB",
    programs: ["Applied Pharmacology", "Civil Engineering", "Biotechnology", "Computer Science"],
    recentMaterials: ["Syllabus-PHA201-2026.pdf", "Department-Lab-Manual.pdf", "Lecture-Notes-Week-4.pdf"]
  },
  {
    id: "campus-kcs",
    name: "Kigali College of Science",
    code: "KCS",
    slug: "kcs-kigali",
    domain: "kcs.ac.rw",
    studentsCount: "2,490",
    facultyDocs: "830",
    activePrograms: "24",
    storageUsage: "9.2 GB",
    programs: ["Computer Systems", "Robotics & Automation", "Information Systems", "Applied Physics"],
    recentMaterials: ["Distributed-Systems-Syllabus.pdf", "Exam-Preparation-Guide.pdf", "Department-Reading-List.pdf"]
  },
  {
    id: "campus-ahm",
    name: "Academy of Health & Medicine",
    code: "AHM",
    slug: "ahm-health",
    domain: "ahm.edu.rw",
    studentsCount: "940",
    facultyDocs: "365",
    activePrograms: "12",
    storageUsage: "3.6 GB",
    programs: ["Clinical Medicine", "Nursing Sciences", "Public Health", "Pharmaceutical Chemistry"],
    recentMaterials: ["Clinical-Rotation-Handbook.pdf", "Pharmacology-Drug-Guide.pdf", "Semester-Lecture-Notes.pdf"]
  }
];

export const TenantIsolationDiagram: React.FC = () => {
  const [activeCampusIndex, setActiveCampusIndex] = useState(0);
  const current = CAMPUS_SPACES[activeCampusIndex];

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] font-sans">
      {/* Top Protocol Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] px-4 sm:px-6 py-3 text-xs gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-semibold tracking-tight text-[var(--ink)]">Dedicated Campus Spaces</span>
          <span className="text-[var(--ink-muted)] hidden sm:inline">|</span>
          <span className="text-[var(--ink-muted)]">Private &amp; Secure to Each University</span>
        </div>
        <div className="text-[var(--ink-muted)] tabular-nums mt-1 sm:mt-0">
          Campus Domain: <span className="text-[var(--ink)] font-semibold">{current.domain}</span>
        </div>
      </div>

      {/* Main Grid: Left Campus Selector & Right Dedicated Campus Space Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Campus Selectors */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[var(--border)] p-4 sm:p-6 space-y-3">
          <div className="text-xs text-[var(--ink-muted)] uppercase tracking-wider mb-2 font-semibold">
            Partner Universities &amp; Campuses
          </div>

          {CAMPUS_SPACES.map((campus, idx) => {
            const isSelected = idx === activeCampusIndex;
            return (
              <button
                key={campus.id}
                type="button"
                onClick={() => setActiveCampusIndex(idx)}
                className={`w-full text-left p-4 border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent)] bg-[var(--bg)] text-[var(--ink)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink-muted)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm tracking-tight">{campus.name}</span>
                  <span className="text-xs text-[var(--ink-muted)] font-semibold tabular-nums">
                    [{campus.code}]
                  </span>
                </div>
                <div className="text-xs text-[var(--ink-muted)] mb-3">
                  Campus Address: {campus.domain}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-xs tabular-nums">
                  <div>
                    <span className="block text-[var(--ink-muted)]">Students</span>
                    <span className="font-semibold text-[var(--ink)]">{campus.studentsCount}</span>
                  </div>
                  <div>
                    <span className="block text-[var(--ink-muted)]">Programs</span>
                    <span className="font-semibold text-[var(--ink)]">{campus.activePrograms}</span>
                  </div>
                  <div>
                    <span className="block text-[var(--ink-muted)]">Course Files</span>
                    <span className="font-semibold text-[var(--ink)]">{campus.facultyDocs}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Campus Space Visualizer */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-[var(--bg)] space-y-6">
          {/* Header of Active Inspection */}
          <div className="border-b border-[var(--border)] pb-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-sans font-bold text-xl text-[var(--ink)] tracking-tight">
                {current.name} Space
              </h4>
              <span className="text-xs text-[var(--accent)] font-semibold tabular-nums">
                Verified Campus Space
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Every university receives its own dedicated campus space. Syllabi, lecture notes, student directories, and reading materials remain completely private to enrolled students and faculty members.
            </p>
          </div>

          {/* Architectural SVG Map of Campus Space */}
          <div className="w-full border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
            <svg
              className="w-full h-auto"
              viewBox="0 0 600 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Dedicated Campus Spaces and Privacy Boundary"
            >
              {/* Outer Boundary Frame */}
              <rect x="10" y="10" width="580" height="200" stroke="var(--border)" strokeWidth="1" fill="none" />
              <text x="24" y="32" fill="var(--ink-muted)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">
                PRIVATE CAMPUS SPACE: {current.name.toUpperCase()} (ENROLLED MEMBERS ONLY)
              </text>

              {/* Compartment 1: Students & Enrolment */}
              <g transform="translate(30, 50)">
                <rect width="160" height="135" stroke="var(--border)" strokeWidth="1" fill="var(--bg)" />
                <text x="14" y="24" fill="var(--ink)" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">
                  Enrolled Students
                </text>
                <text x="14" y="42" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Verified University Cohorts
                </text>
                <line x1="14" y1="52" x2="146" y2="52" stroke="var(--border)" strokeWidth="1" />
                <text x="14" y="74" fill="var(--ink)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">
                  Students: {current.studentsCount}
                </text>
                <text x="14" y="94" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Sign In: University Email (.edu, .ac)
                </text>
                <text x="14" y="114" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Access: Enrolled Courses Only
                </text>
              </g>

              {/* Compartment 2: Curricula & Syllabi */}
              <g transform="translate(220, 50)">
                <rect width="160" height="135" stroke="var(--border)" strokeWidth="1" fill="var(--bg)" />
                <text x="14" y="24" fill="var(--ink)" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">
                  Course Syllabi
                </text>
                <text x="14" y="42" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Verified Department Schedules
                </text>
                <line x1="14" y1="52" x2="146" y2="52" stroke="var(--border)" strokeWidth="1" />
                <text x="14" y="74" fill="var(--ink)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">
                  Active Courses: {current.activePrograms}
                </text>
                <text x="14" y="94" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Updates: Auto-Notified to Class
                </text>
                <text x="14" y="114" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Status: Department Approved
                </text>
              </g>

              {/* Compartment 3: Shared Resource Library */}
              <g transform="translate(410, 50)">
                <rect width="160" height="135" stroke="var(--accent)" strokeWidth="1" fill="var(--bg)" />
                <text x="14" y="24" fill="var(--accent)" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">
                  Resource Library
                </text>
                <text x="14" y="42" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Lecture Notes &amp; Exam Guides
                </text>
                <line x1="14" y1="52" x2="146" y2="52" stroke="var(--border)" strokeWidth="1" />
                <text x="14" y="74" fill="var(--ink)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">
                  Library Files: {current.facultyDocs}
                </text>
                <text x="14" y="94" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Total Storage: {current.storageUsage}
                </text>
                <text x="14" y="114" fill="var(--ink)" fontSize="9" fontWeight="600" fontFamily="var(--font-sans)">
                  Downloads: Ready for Offline
                </text>
              </g>
            </svg>
          </div>

          {/* Campus Data Breakdown: Programs & Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-[var(--border)] p-4 bg-[var(--surface)]">
              <span className="block font-bold text-[var(--ink)] mb-2">Academic Programs &amp; Majors</span>
              <ul className="space-y-1.5 text-[var(--ink-muted)]">
                {current.programs.map((prog, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-1 last:border-0">
                    <span>{prog}</span>
                    <span className="text-[var(--ink)] font-semibold tabular-nums">Years 1–4</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-[var(--border)] p-4 bg-[var(--surface)]">
              <span className="block font-bold text-[var(--ink)] mb-2">Recently Published Course Notes</span>
              <ul className="space-y-1.5 text-[var(--ink-muted)]">
                {current.recentMaterials.map((doc, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-1 last:border-0 truncate">
                    <span className="truncate">{doc}</span>
                    <span className="text-[var(--accent)] text-[10px] uppercase font-bold">Verified</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantIsolationDiagram;
