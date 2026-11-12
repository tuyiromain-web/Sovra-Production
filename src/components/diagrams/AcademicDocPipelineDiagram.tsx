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
  slaLatency: string;
  details: string[];
  samplePayload: {
    label: string;
    value: string;
  }[];
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-ingest",
    stepNumber: "01",
    title: "Faculty Ingestion & Upload",
    shortDesc: "Course syllabi, lecture notes, clinical problem sets, and lab manuals submitted via authenticated lecturer portal.",
    inputFormat: "PDF, DOCX, LaTeX, PPTX",
    outputFormat: "Standardized MIME Payload",
    slaLatency: "< 120ms",
    details: [
      "Cryptographic SHA-256 hash generated on initial upload",
      "Author digital identity bound via institutional session token",
      "Automated virus & malware sanitization pass before storage"
    ],
    samplePayload: [
      { label: "Document Title", value: "Pharmacokinetics II Course Syllabus (Year 2)" },
      { label: "Author", value: "Dr. Emmanuel Mutangana (Faculty of Pharmacy)" },
      { label: "Institutional Code", value: "INES-RUH-PHA-2026-V1" },
      { label: "File Size & Format", value: "2.4 MB (Application/PDF)" }
    ]
  },
  {
    id: "stage-structure",
    stepNumber: "02",
    title: "Automated Structuring & Indexing",
    shortDesc: "Document contents parsed into modular academic sections, learning objectives, and accreditation benchmarks.",
    inputFormat: "Sanitized Binary Stream",
    outputFormat: "Relational Metadata Record",
    slaLatency: "< 450ms",
    details: [
      "Topic extraction and course code alignment (e.g., PHA 211)",
      "Weekly syllabus breakdown mapped to academic semester schedule",
      "Accreditation competency tagging for institutional board audit"
    ],
    samplePayload: [
      { label: "Extracted Modules", value: "14 Lectures, 4 Laboratory Practical Rotations" },
      { label: "Competencies Tagged", value: "ADME Modeling, Clinical Dosage Verification" },
      { label: "Prerequisites Verified", value: "PHA 102 General Biochemistry" },
      { label: "Index Latency", value: "318ms elapsed" }
    ]
  },
  {
    id: "stage-version",
    stepNumber: "03",
    title: "Immutable Version Control",
    shortDesc: "Every curriculum revision receives an immutable revision hash, preventing accidental faculty desynchronization.",
    inputFormat: "Indexed Semantic Record",
    outputFormat: "Versioned Immutable Snapshot",
    slaLatency: "Instantaneous",
    details: [
      "Full revision diff tracking across academic calendar years",
      "Rollback safeguards against conflicting department edits",
      "Encrypted audit log preserving dean and department approval sign-offs"
    ],
    samplePayload: [
      { label: "Revision Tag", value: "rev_2026.1_approved_final" },
      { label: "Parent Revision", value: "rev_2025.4_archived" },
      { label: "Approval Sign-Off", value: "Academic Dean Board Review Passed" },
      { label: "Storage Path", value: "resources/ines-ruhengeri/2026/pha211/v1.pdf" }
    ]
  },
  {
    id: "stage-distribute",
    stepNumber: "04",
    title: "Role-Based Instant Distribution",
    shortDesc: "Verified materials published instantly to enrolled students' resource vaults, mobile portals, and offline caches.",
    inputFormat: "Approved Institutional Release",
    outputFormat: "Targeted Student Workspace",
    slaLatency: "< 50ms propagation",
    details: [
      "Access scoped strictly to students enrolled in that specific academic year",
      "Automated push broadcast to student cohort mobile registry",
      "One-click encrypted PDF compendium download for laboratory reference"
    ],
    samplePayload: [
      { label: "Target Cohort", value: "Year 2 Pharmacy Students (INES-Ruhengeri)" },
      { label: "Permissions", value: "Read, Download, Annotation, AI-Grounded Query" },
      { label: "Student Reach", value: "148 Enrolled Students Synchronized" },
      { label: "Offline Cache", value: "Local PWA IndexDB Sync Complete" }
    ]
  }
];

export const AcademicDocPipelineDiagram: React.FC = () => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const activeStage = PIPELINE_STAGES[selectedStageIndex];

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] font-sans">
      {/* Top Protocol Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] px-4 sm:px-6 py-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-tight text-[var(--ink)]">Automated Documentation Pipeline</span>
          <span className="text-[var(--ink-muted)]">|</span>
          <span className="text-[var(--ink-muted)]">End-to-End Audit Trail</span>
        </div>
        <div className="text-[var(--ink-muted)] tabular-nums mt-1 sm:mt-0">
          Stage Latency: <span className="text-[var(--ink)] font-medium">{activeStage.slaLatency}</span>
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
              className={`p-4 text-left border-b lg:border-b-0 border-r border-[var(--border)] last:border-r-0 transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[var(--surface)] border-b-2 border-b-[var(--accent)] text-[var(--ink)]"
                  : "bg-[var(--bg)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
              }`}
            >
              <div className="text-xs text-[var(--accent)] font-semibold tracking-wider mb-1 tabular-nums">
                STAGE {stage.stepNumber}
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[var(--ink)] truncate">
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
              aria-label="Academic Pipeline Flowchart"
            >
              {/* Stage Flow Nodes */}
              <g transform="translate(10, 30)">
                {/* Node 1 */}
                <rect x="0" y="20" width="95" height="75" stroke={selectedStageIndex === 0 ? "var(--accent)" : "var(--border)"} strokeWidth={selectedStageIndex === 0 ? "1.5" : "1"} fill="var(--bg)" />
                <text x="10" y="44" fill="var(--ink)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">01. Ingestion</text>
                <text x="10" y="60" fill="var(--ink-muted)" fontSize="8" fontFamily="var(--font-sans)">Lecturer Auth</text>
                <text x="10" y="76" fill="var(--ink-muted)" fontSize="8" fontFamily="var(--font-sans)">SHA-256 Hash</text>

                {/* Arrow 1 */}
                <line x1="95" y1="57" x2="125" y2="57" stroke="var(--border)" strokeWidth="1" />
                <polygon points="125,57 120,54 120,60" fill="var(--border)" />

                {/* Node 2 */}
                <rect x="125" y="20" width="95" height="75" stroke={selectedStageIndex === 1 ? "var(--accent)" : "var(--border)"} strokeWidth={selectedStageIndex === 1 ? "1.5" : "1"} fill="var(--bg)" />
                <text x="135" y="44" fill="var(--ink)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">02. Structure</text>
                <text x="135" y="60" fill="var(--ink-muted)" fontSize="8" fontFamily="var(--font-sans)">Metadata Parse</text>
                <text x="135" y="76" fill="var(--ink-muted)" fontSize="8" fontFamily="var(--font-sans)">ABET Align</text>

                {/* Arrow 2 */}
                <line x1="220" y1="57" x2="250" y2="57" stroke="var(--border)" strokeWidth="1" />
                <polygon points="250,57 245,54 245,60" fill="var(--border)" />

                {/* Node 3 */}
                <rect x="250" y="20" width="95" height="75" stroke={selectedStageIndex === 2 ? "var(--accent)" : "var(--border)"} strokeWidth={selectedStageIndex === 2 ? "1.5" : "1"} fill="var(--bg)" />
                <text x="260" y="44" fill="var(--ink)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">03. Version</text>
                <text x="260" y="60" fill="var(--ink-muted)" fontSize="8" fontFamily="var(--font-sans)">Git Revision</text>
                <text x="260" y="76" fill="var(--ink-muted)" fontSize="8" fontFamily="var(--font-sans)">Audit Sealed</text>

                {/* Arrow 3 */}
                <line x1="345" y1="57" x2="375" y2="57" stroke="var(--border)" strokeWidth="1" />
                <polygon points="375,57 370,54 370,60" fill="var(--border)" />

                {/* Node 4 */}
                <rect x="375" y="20" width="95" height="75" stroke={selectedStageIndex === 3 ? "var(--accent)" : "var(--border)"} strokeWidth={selectedStageIndex === 3 ? "1.5" : "1"} fill="var(--bg)" />
                <text x="385" y="44" fill="var(--ink)" fontSize="10" fontWeight="600" fontFamily="var(--font-sans)">04. Release</text>
                <text x="385" y="60" fill="var(--ink-muted)" fontSize="8" fontFamily="var(--font-sans)">Student Vault</text>
                <text x="385" y="76" fill="var(--ink-muted)" fontSize="8" fontFamily="var(--font-sans)">Offline Sync</text>
              </g>

              {/* Status indicator line */}
              <text x="14" y="150" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                Active State: [{activeStage.stepNumber}] {activeStage.title} — Latency budget: {activeStage.slaLatency}
              </text>
            </svg>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-xs text-[var(--ink)]">Pipeline Execution Guarantees</h5>
            <ul className="space-y-1.5 text-xs text-[var(--ink-muted)]">
              {activeStage.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold text-xs">—</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Active Stage Payload Metadata Inspector */}
        <div className="lg:col-span-6 p-4 sm:p-6 bg-[var(--surface)] space-y-4">
          <div className="border-b border-[var(--border)] pb-3">
            <div className="text-xs text-[var(--accent)] font-semibold tracking-wider uppercase mb-1">
              Active Stage Payload Inspector
            </div>
            <h4 className="font-display text-xl text-[var(--ink)]">
              {activeStage.title}
            </h4>
            <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
              {activeStage.shortDesc}
            </p>
          </div>

          <div className="border border-[var(--border)] bg-[var(--bg)] divide-y divide-[var(--border)] text-xs">
            {activeStage.samplePayload.map((field, idx) => (
              <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[var(--ink-muted)] font-medium">{field.label}</span>
                <span className="text-[var(--ink)] font-semibold tabular-nums sm:text-right">{field.value}</span>
              </div>
            ))}
            <div className="p-3 flex items-center justify-between bg-[var(--surface)]">
              <span className="text-[var(--ink-muted)]">Input Format</span>
              <span className="text-[var(--ink)] font-medium">{activeStage.inputFormat}</span>
            </div>
            <div className="p-3 flex items-center justify-between bg-[var(--surface)]">
              <span className="text-[var(--ink-muted)]">Output Artifact</span>
              <span className="text-[var(--ink)] font-medium">{activeStage.outputFormat}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDocPipelineDiagram;
