/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "./WorkspaceContext";

export const OverviewView: React.FC = () => {
  const { activeTenant, documents, programs, setActiveTab, setSelectedDoc, setIsPublishModalOpen } = useWorkspace();

  return (
    <div className="space-y-10">
      
      {/* Overview Top Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] mb-1">
            <span className="font-semibold text-[var(--accent)] uppercase tracking-wider">
              Isolated Institution Partition
            </span>
            <span>&bull;</span>
            <span className="font-sans text-[11px] tabular-nums">{activeTenant.isolatedPartitionKey}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[var(--ink)] tracking-tight">
            {activeTenant.name}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1.5 max-w-2xl leading-relaxed">
            Institutional academic workspace operating under cryptographic perimeter isolation. Syllabi, accreditation files, and student cohort directories are strictly isolated to this workspace.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="btn-accent px-5 py-2.5 text-xs font-semibold rounded-none cursor-pointer"
          >
            + Publish Documentation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("programs")}
            className="border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] px-4 py-2.5 text-xs font-semibold rounded-none transition-colors cursor-pointer"
          >
            Programs Matrix
          </button>
        </div>
      </div>

      {/* Tabular Institutional Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--border)] bg-[var(--surface)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
        <div className="p-6">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--ink-muted)] block mb-1">
            Enrolled Student Body
          </span>
          <div className="text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {activeTenant.totalStudents}
          </div>
          <span className="text-[11px] text-[var(--ink-muted)] mt-1 block">
            Across active degree tracks
          </span>
        </div>

        <div className="p-6">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--ink-muted)] block mb-1">
            Active Faculty Members
          </span>
          <div className="text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {activeTenant.activeFaculty}
          </div>
          <span className="text-[11px] text-[var(--ink-muted)] mt-1 block">
            Verified lecturers & chairs
          </span>
        </div>

        <div className="p-6">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--ink-muted)] block mb-1">
            Indexed Faculty Syllabi
          </span>
          <div className="text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {activeTenant.facultyDocsCount}
          </div>
          <span className="text-[11px] text-[var(--ink-muted)] mt-1 block">
            Version-controlled archives
          </span>
        </div>

        <div className="p-6">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--ink-muted)] block mb-1">
            Documentation Coverage
          </span>
          <div className="text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {activeTenant.coverageMetric}
          </div>
          <span className="text-[11px] text-[var(--ink-muted)] mt-1 block">
            Accreditation audit target
          </span>
        </div>
      </div>

      {/* Split Grid: Institutional Governance & Recent Ledger Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tenant Governance Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[var(--border)] bg-[var(--bg)] p-6 space-y-4">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)] tracking-tight border-b border-[var(--border)] pb-3">
              Institutional Governance Profile
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[var(--ink-muted)] block">Regulatory Accreditation Body</span>
                <span className="font-semibold text-[var(--ink)]">{activeTenant.accreditationBody}</span>
              </div>

              <div>
                <span className="text-[var(--ink-muted)] block">Institutional Network Domain</span>
                <span className="font-semibold text-[var(--ink)]">{activeTenant.domain}</span>
              </div>

              <div>
                <span className="text-[var(--ink-muted)] block">Active Academic Term</span>
                <span className="font-semibold text-[var(--ink)]">{activeTenant.term}</span>
              </div>

              <div>
                <span className="text-[var(--ink-muted)] block">Storage Encryption Mode</span>
                <span className="font-semibold text-[var(--ink)]">AES-256 GCM Client-Side Envelope</span>
              </div>

              <div>
                <span className="text-[var(--ink-muted)] block">Hardware Partition ID</span>
                <span className="font-sans tabular-nums text-[10px] text-[var(--ink)] block p-2 bg-[var(--surface)] border border-[var(--border)] mt-1">
                  {activeTenant.isolatedPartitionKey}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <h3 className="font-display text-lg text-[var(--ink)] tracking-tight">
              Cryptographic Tenant Perimeter
            </h3>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Sovra executes PostgreSQL Row-Level Security (RLS) policies targeting <code>auth.jwt() -&gt; &apos;tenant_id&apos;</code>. Zero cross-institutional queries are physically possible at the database engine level.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Documentation Ledger Activity */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)] tracking-tight">
              Recent Documentation Ledger Activity
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
            >
              View All ({documents.length}) &rarr;
            </button>
          </div>

          <div className="border border-[var(--border)] bg-[var(--bg)] divide-y divide-[var(--border)]">
            {documents.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedDoc(doc)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedDoc(doc);
                  }
                }}
                aria-label={`Open syllabus: ${doc.title}`}
                className="p-4 hover:bg-[var(--surface)] transition-colors cursor-pointer flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--ink-muted)]">
                    <span className="font-semibold text-[var(--ink)] tabular-nums">{doc.code}</span>
                    <span>&bull;</span>
                    <span className="truncate">{doc.programName}</span>
                    <span>&bull;</span>
                    <span className="tabular-nums">{doc.version}</span>
                  </div>
                  <div className="font-display text-base font-semibold text-[var(--ink)] truncate">
                    {doc.title}
                  </div>
                  <div className="text-xs text-[var(--ink-muted)] truncate">
                    Authored by {doc.author} &bull; {doc.authorRole}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ink)]">
                    {doc.status}
                  </span>
                  <span className="text-[10px] text-[var(--ink-muted)] tabular-nums">
                    {doc.updatedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between text-xs">
            <span className="text-[var(--ink-muted)]">Looking for accredited program syllabi?</span>
            <button
              type="button"
              onClick={() => setActiveTab("programs")}
              className="font-semibold text-[var(--ink)] hover:text-[var(--accent)] cursor-pointer"
            >
              Inspect Programs Directory &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
