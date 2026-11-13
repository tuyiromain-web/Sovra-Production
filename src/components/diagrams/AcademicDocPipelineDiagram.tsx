/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

interface PipelineStage {
  id: string;
  stepNumber: string;
  title: string;
  shortDesc: string;
  inputFormat: string;
  outputFormat: string;
  turnaroundTime: string;
  details: string[];
  samplePayload: {
    label: string;
    value: string;
  }[];
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-draft",
    stepNumber: "01",
    title: "Faculty Course Upload",
    shortDesc: "Course syllabi, lecture slides, clinical problem sets, and lab manuals submitted directly by course lecturers.",
    inputFormat: "PDF, Word (DOCX), Slides (PPTX)",
    outputFormat: "Standardized Course Document",
    turnaroundTime: "Instant Upload",
    details: [
      "Lecturer identity confirmed with official university email",
      "Automatic check to ensure course materials are readable on phones and laptops",
      "Draft materials remain private to the instructor until ready for review"
    ],
    samplePayload: [
      { label: "Course Title", value: "Applied Pharmacokinetics II (Semester 1)" },
      { label: "Course Instructor", value: "Dr. Emmanuel Mutangana (School of Pharmacy)" },
      { label: "Course Identifier", value: "PHA-201 &bull; Clinical Science Track" },
      { label: "Document Format", value: "Course Syllabus & Reading List (PDF)" }
    ]
  },
  {
    id: "stage-organize",
    stepNumber: "02",
    title: "Department Organization",
    shortDesc: "Syllabi are organized by weekly lecture schedule, required textbooks, and required prerequisites for student clarity.",
    inputFormat: "Uploaded Course File",
    outputFormat: "Structured Semester Outline",
    turnaroundTime: "Automated Organizing",
    details: [
      "Lectures mapped week by week across the academic semester calendar",
      "Key competencies and textbook references clearly highlighted for students",
      "Course prerequisites validated against degree program requirements"
    ],
    samplePayload: [
      { label: "Semester Breakdown", value: "14 Lecture Sessions, 4 Laboratory Practicals" },
      { label: "Key Learning Milestones", value: "Drug Metabolism Models, Dosage Calculations" },
      { label: "Course Prerequisites", value: "General Biochemistry (PHA-102)" },
      { label: "Class Schedule", value: "Mondays & Thursdays &bull; Science Hall 3" }
    ]
  },
  {
    id: "stage-approve",
    stepNumber: "03",
    title: "Department Chair Review",
    shortDesc: "Department deans and curriculum chairs review reading lists and approve course updates before classes begin.",
    inputFormat: "Structured Course Outline",
    outputFormat: "Verified Official Syllabus",
    turnaroundTime: "Dean Sign-Off",
    details: [
      "Department head reviews weekly topics and assessment criteria",
      "Version history tracks every change from previous academic years",
      "Official departmental approval stamp confirms curriculum standards"
    ],
    samplePayload: [
      { label: "Syllabus Status", value: "Approved by Department Board" },
      { label: "Reviewing Dean", value: "Prof. Arthur Vance &bull; Academic Chair" },
      { label: "Academic Year", value: "Academic Year 2026/2027" },
      { label: "Verified Library Path", value: "Pharmacy / Year 2 / PHA-201 / Syllabus.pdf" }
    ]
  },
  {
    id: "stage-distribute",
    stepNumber: "04",
    title: "Instant Student Delivery",
    shortDesc: "Approved materials appear instantly in students' campus portals, ready for online reading and offline study packs.",
    inputFormat: "Approved Campus Syllabus",
    outputFormat: "Student Course Portal",
    turnaroundTime: "Instant Notification",
    details: [
      "Enrolled students receive an immediate notification in their campus hub",
      "Course files automatically sync for offline reading on mobile devices",
      "Class cohort discussion board opens with verified reading list"
    ],
    samplePayload: [
      { label: "Enrolled Class", value: "Second Year Pharmacy Students (148 Enrolled)" },
      { label: "Student Privileges", value: "Read, Download, Annotate, Offline Save" },
      { label: "Class Notification", value: "Delivered to All Enrolled Student Portals" },
      { label: "Offline Availability", value: "Ready to Download as Complete Course Pack" }
    ]
  }
];

export const AcademicDocPipelineDiagram: React.FC = () => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const activeStage = PIPELINE_STAGES[selectedStageIndex];

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] font-sans">
      {/* Top Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] px-4 sm:px-6 py-3 text-xs gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-semibold tracking-tight text-[var(--ink)]">Course Material Lifecycle</span>
          <span className="text-[var(--ink-muted)] hidden sm:inline">|</span>
          <span className="text-[var(--ink-muted)]">From Instructor Desk to Student Hands</span>
        </div>
        <div className="text-[var(--ink-muted)] tabular-nums mt-1 sm:mt-0">
          Current Stage: <span className="text-[var(--ink)] font-semibold">{activeStage.turnaroundTime}</span>
        </div>
      </div>

      {/* 4-Step Interactive Pipeline Progress Rail */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[var(--border)] bg-[var(--bg)]">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isSelected = idx === selectedStageIndex;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSelectedStageIndex(idx)}
              className={`min-h-[44px] p-4 text-left border-b lg:border-b-0 border-r border-[var(--border)] last:border-r-0 transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[var(--surface)] border-b-2 border-b-[var(--accent)] text-[var(--ink)]"
                  : "bg-[var(--bg)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
              }`}
            >
              <div className="text-xs text-[var(--accent)] font-semibold tracking-wider mb-1 tabular-nums">
                STEP {stage.stepNumber}
              </div>
              <div className="font-bold text-xs sm:text-sm text-[var(--ink)] truncate">
                {stage.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pipeline Visualizer SVG & Stage Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Stage Visual SVG Schematics */}
        <div className="lg:col-span-6 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--bg)] space-y-4">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
            <svg
              className="w-full h-auto"
              viewBox="0 0 500 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Course Material Lifecycle Flowchart"
            >
              {/* Process Track Line */}
              <line x1="40" y1="90" x2="460" y2="90" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />

              {/* Node 1: Professor Upload */}
              <g transform="translate(40, 50)">
                <circle cx="40" cy="40" r="30" fill="var(--bg)" stroke={selectedStageIndex === 0 ? "var(--accent)" : "var(--border)"} strokeWidth={selectedStageIndex === 0 ? "2" : "1"} />
                <text x="40" y="44" fill={selectedStageIndex === 0 ? "var(--accent)" : "var(--ink)"} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">01</text>
                <text x="40" y="86" fill="var(--ink)" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">Upload</text>
              </g>

              {/* Node 2: Organization */}
              <g transform="translate(150, 50)">
                <circle cx="40" cy="40" r="30" fill="var(--bg)" stroke={selectedStageIndex === 1 ? "var(--accent)" : "var(--border)"} strokeWidth={selectedStageIndex === 1 ? "2" : "1"} />
                <text x="40" y="44" fill={selectedStageIndex === 1 ? "var(--accent)" : "var(--ink)"} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">02</text>
                <text x="40" y="86" fill="var(--ink)" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">Organize</text>
              </g>

              {/* Node 3: Department Approval */}
              <g transform="translate(260, 50)">
                <circle cx="40" cy="40" r="30" fill="var(--bg)" stroke={selectedStageIndex === 2 ? "var(--accent)" : "var(--border)"} strokeWidth={selectedStageIndex === 2 ? "2" : "1"} />
                <text x="40" y="44" fill={selectedStageIndex === 2 ? "var(--accent)" : "var(--ink)"} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">03</text>
                <text x="40" y="86" fill="var(--ink)" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">Approve</text>
              </g>

              {/* Node 4: Student Delivery */}
              <g transform="translate(370, 50)">
                <circle cx="40" cy="40" r="30" fill="var(--bg)" stroke={selectedStageIndex === 3 ? "var(--accent)" : "var(--border)"} strokeWidth={selectedStageIndex === 3 ? "2" : "1"} />
                <text x="40" y="44" fill={selectedStageIndex === 3 ? "var(--accent)" : "var(--ink)"} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--font-sans)">04</text>
                <text x="40" y="86" fill="var(--ink)" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">Deliver</text>
              </g>
            </svg>
          </div>

          <div className="space-y-1">
            <h4 className="font-sans font-bold text-base text-[var(--ink)]">
              {activeStage.stepNumber} / {activeStage.title}
            </h4>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              {activeStage.shortDesc}
            </p>
          </div>
        </div>

        {/* Right: Stage Details & Example Record */}
        <div className="lg:col-span-6 p-4 sm:p-6 bg-[var(--surface)] space-y-6">
          {/* Key Stage Steps */}
          <div>
            <div className="text-xs text-[var(--ink-muted)] uppercase tracking-wider mb-3 font-semibold">
              How This Step Works
            </div>
            <ul className="space-y-2 text-xs text-[var(--ink)]">
              {activeStage.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 border border-[var(--border)] bg-[var(--bg)]">
                  <span className="font-bold text-[var(--accent)] shrink-0">&bull;</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example Course Record Details */}
          <div>
            <div className="text-xs text-[var(--ink-muted)] uppercase tracking-wider mb-3 font-semibold">
              Live Course Record Preview
            </div>
            <div className="border border-[var(--border)] bg-[var(--bg)] divide-y divide-[var(--border)] text-xs">
              {activeStage.samplePayload.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-4">
                  <span className="text-[var(--ink-muted)] shrink-0">{item.label}</span>
                  <span className="font-semibold text-[var(--ink)] text-right truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDocPipelineDiagram;
