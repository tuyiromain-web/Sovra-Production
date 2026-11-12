/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

interface SchoolTenant {
  id: string;
  name: string;
  code: string;
  slug: string;
  domain: string;
  studentsCount: string;
  facultyDocs: string;
  activePrograms: string;
  vaultVolume: string;
  encryptionKey: string;
  programs: string[];
  recentDocs: string[];
}

const SCHOOL_TENANTS: SchoolTenant[] = [
  {
    id: "tenant-ines",
    name: "INES-Ruhengeri Institute",
    code: "INES",
    slug: "ines-ruhengeri",
    domain: "ines.ac.rw",
    studentsCount: "1,248",
    facultyDocs: "412",
    activePrograms: "18",
    vaultVolume: "4.8 GB",
    encryptionKey: "sec_vault_ines_88f2a01",
    programs: ["Applied Pharmacology", "Civil Engineering", "Biotechnology", "Computer Science"],
    recentDocs: ["Syllabus-PHA201-2026.pdf", "Faculty-Audit-Board-Q1.pdf", "Lab-Safety-Protocols-v3.docx"]
  },
  {
    id: "tenant-kist",
    name: "Kigali College of Science",
    code: "KCS",
    slug: "kcs-kigali",
    domain: "kcs.ac.rw",
    studentsCount: "2,490",
    facultyDocs: "830",
    activePrograms: "24",
    vaultVolume: "9.2 GB",
    encryptionKey: "sec_vault_kcs_77b3c19",
    programs: ["Distributed Systems", "Robotics & Automation", "Information Systems", "Applied Physics"],
    recentDocs: ["Curriculum-CS401-Distributed.pdf", "ABET-Accreditation-Audit.pdf", "Thesis-Registry-2026.pdf"]
  },
  {
    id: "tenant-chs",
    name: "Academy of Health & Medicine",
    code: "AHM",
    slug: "ahm-health",
    domain: "ahm.edu.rw",
    studentsCount: "940",
    facultyDocs: "365",
    activePrograms: "12",
    vaultVolume: "3.6 GB",
    encryptionKey: "sec_vault_ahm_99d1e44",
    programs: ["Clinical Medicine", "Nursing Sciences", "Public Health Epidemiology", "Pharmaceutical Chemistry"],
    recentDocs: ["Hospital-Rotation-Registry.pdf", "Pharmacopoeia-Index-Rev4.pdf", "Faculty-Board-Minutes.pdf"]
  }
];

export const TenantIsolationDiagram: React.FC = () => {
  const [activeTenantIndex, setActiveTenantIndex] = useState(0);
  const current = SCHOOL_TENANTS[activeTenantIndex];

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] font-sans">
      {/* Top Architecture Diagnostic Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] px-4 sm:px-6 py-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-tight text-[var(--ink)]">Institutional Boundary Verification</span>
          <span className="text-[var(--ink-muted)]">|</span>
          <span className="text-[var(--ink-muted)]">PostgreSQL Row-Level Security Enforced</span>
        </div>
        <div className="text-[var(--ink-muted)] tabular-nums mt-1 sm:mt-0">
          Target Scope: <span className="text-[var(--ink)] font-medium">{current.domain}</span>
        </div>
      </div>

      {/* Main Grid: Left Tenant Selector & Right Workspace Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: School Workspace Selectors */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[var(--border)] p-4 sm:p-6 space-y-3">
          <div className="text-xs text-[var(--ink-muted)] uppercase tracking-wider mb-2 font-medium">
            Active School Workspaces
          </div>

          {SCHOOL_TENANTS.map((tenant, idx) => {
            const isSelected = idx === activeTenantIndex;
            return (
              <button
                key={tenant.id}
                type="button"
                onClick={() => setActiveTenantIndex(idx)}
                className={`w-full text-left p-4 border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "border-[var(--accent)] bg-[var(--bg)] text-[var(--ink)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink-muted)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm tracking-tight">{tenant.name}</span>
                  <span className="text-xs text-[var(--ink-muted)] font-medium tabular-nums">
                    [{tenant.code}]
                  </span>
                </div>
                <div className="text-xs text-[var(--ink-muted)] mb-3">
                  Domain: {tenant.domain}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-xs tabular-nums">
                  <div>
                    <span className="block text-[var(--ink-muted)]">Students</span>
                    <span className="font-semibold text-[var(--ink)]">{tenant.studentsCount}</span>
                  </div>
                  <div>
                    <span className="block text-[var(--ink-muted)]">Programs</span>
                    <span className="font-semibold text-[var(--ink)]">{tenant.activePrograms}</span>
                  </div>
                  <div>
                    <span className="block text-[var(--ink-muted)]">Docs Vault</span>
                    <span className="font-semibold text-[var(--ink)]">{tenant.facultyDocs}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Cryptographic Isolation Visualizer & Partition Inspector */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-[var(--bg)] space-y-6">
          {/* Header of Active Inspection */}
          <div className="border-b border-[var(--border)] pb-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-display text-xl text-[var(--ink)] tracking-tight">
                {current.name} Partition
              </h4>
              <span className="text-xs text-[var(--ink-muted)] tabular-nums">
                Tenant Key: {current.encryptionKey}
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Strict multi-tenant cryptographic partition. Student records, faculty syllabi, and administrative documents are completely isolated from peer institutions.
            </p>
          </div>

          {/* Architectural SVG Map of Tenant Isolation */}
          <div className="w-full border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
            <svg
              className="w-full h-auto"
              viewBox="0 0 600 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Cryptographic Tenant Isolation Schema"
            >
              {/* Outer Boundary Frame */}
              <rect x="10" y="10" width="580" height="200" stroke="var(--border)" strokeWidth="1" fill="none" />
              <text x="24" y="32" fill="var(--ink-muted)" fontSize="10" fontFamily="var(--font-sans)">
                TENANT BOUNDARY: {current.slug.toUpperCase()} (STRICT NO-LEAKAGE FENCE)
              </text>

              {/* Data Compartment 1: Students & Enrolment */}
              <g transform="translate(30, 50)">
                <rect width="160" height="135" stroke="var(--border)" strokeWidth="1" fill="var(--bg)" />
                <text x="14" y="24" fill="var(--ink)" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">
                  Student Registry
                </text>
                <text x="14" y="42" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Role-Based Profiles & Year
                </text>
                <line x1="14" y1="52" x2="146" y2="52" stroke="var(--border)" strokeWidth="1" />
                <text x="14" y="74" fill="var(--ink)" fontSize="10" fontFamily="var(--font-sans)">
                  Enrolled: {current.studentsCount}
                </text>
                <text x="14" y="94" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Auth Method: OAuth2 SSO
                </text>
                <text x="14" y="114" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  RLS: (school_id = tenant_id)
                </text>
              </g>

              {/* Data Compartment 2: Curricula & Programs */}
              <g transform="translate(220, 50)">
                <rect width="160" height="135" stroke="var(--border)" strokeWidth="1" fill="var(--bg)" />
                <text x="14" y="24" fill="var(--ink)" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">
                  Curricula & Syllabi
                </text>
                <text x="14" y="42" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Accredited Program Vault
                </text>
                <line x1="14" y1="52" x2="146" y2="52" stroke="var(--border)" strokeWidth="1" />
                <text x="14" y="74" fill="var(--ink)" fontSize="10" fontFamily="var(--font-sans)">
                  Active Programs: {current.activePrograms}
                </text>
                <text x="14" y="94" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Versioning: Git-Indexed
                </text>
                <text x="14" y="114" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Access: Faculty Approved
                </text>
              </g>

              {/* Data Compartment 3: Curated Academic Vault */}
              <g transform="translate(410, 50)">
                <rect width="160" height="135" stroke="var(--accent)" strokeWidth="1" fill="var(--bg)" />
                <text x="14" y="24" fill="var(--accent)" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">
                  Faculty Doc Archive
                </text>
                <text x="14" y="42" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Immutable Exam & Lab Vault
                </text>
                <line x1="14" y1="52" x2="146" y2="52" stroke="var(--border)" strokeWidth="1" />
                <text x="14" y="74" fill="var(--ink)" fontSize="10" fontFamily="var(--font-sans)">
                  Stored Docs: {current.facultyDocs} files
                </text>
                <text x="14" y="94" fill="var(--ink-muted)" fontSize="9" fontFamily="var(--font-sans)">
                  Storage Vol: {current.vaultVolume}
                </text>
                <text x="14" y="114" fill="var(--ink)" fontSize="9" fontWeight="500" fontFamily="var(--font-sans)">
                  Status: Encrypted AES-256
                </text>
              </g>
            </svg>
          </div>

          {/* Partition Data Breakdown: Programs & Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-[var(--border)] p-4 bg-[var(--surface)]">
              <span className="block font-semibold text-[var(--ink)] mb-2">Isolated Academic Programs</span>
              <ul className="space-y-1.5 text-[var(--ink-muted)]">
                {current.programs.map((prog, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-1 last:border-0">
                    <span>{prog}</span>
                    <span className="text-[var(--ink)] tabular-nums">Year 1–4</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-[var(--border)] p-4 bg-[var(--surface)]">
              <span className="block font-semibold text-[var(--ink)] mb-2">Recent Indexed Documents</span>
              <ul className="space-y-1.5 text-[var(--ink-muted)]">
                {current.recentDocs.map((doc, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-[var(--border)] pb-1 last:border-0 truncate">
                    <span className="truncate">{doc}</span>
                    <span className="text-[var(--accent)] text-[10px] uppercase font-semibold">Verified</span>
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
