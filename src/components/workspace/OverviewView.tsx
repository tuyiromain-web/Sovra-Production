/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "./WorkspaceContext";

export const OverviewView: React.FC = () => {
  const {
    activeSchool,
    courses,
    documents,
    vaultResources,
    members,
    setActiveTab,
    setSelectedDoc,
    setIsPublishModalOpen,
  } = useWorkspace();

  const recentDocs = documents.slice(0, 4);
  const verifiedCount = documents.filter((d) => d.approved).length;

  return (
    <div className="space-y-10">
      {/* Overview Top Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] mb-1">
            <span className="font-semibold text-[var(--accent)] uppercase tracking-wider">
              University Hub
            </span>
            <span>&bull;</span>
            <span className="font-sans text-[11px] tabular-nums">{activeSchool.code}</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-5xl font-bold text-[var(--ink)] tracking-[-0.03em]">
            {activeSchool.name}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1.5 max-w-2xl leading-relaxed">
            Private campus hub for verified course syllabi, lecture notes, and department resources shared exclusively within {activeSchool.name}.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="btn-accent px-5 py-2.5 text-xs font-semibold rounded-none cursor-pointer"
          >
            + Publish Resource
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("programs")}
            className="border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] px-4 py-2.5 text-xs font-semibold rounded-none transition-colors cursor-pointer"
          >
            View Courses
          </button>
        </div>
      </div>

      {/* Metrics Bar (Strictly tabular-nums) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--border)] bg-[var(--surface)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
        <div className="p-6">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-2">
            Active Courses
          </div>
          <div className="text-3xl sm:text-4xl font-semibold text-[var(--ink)] tabular-nums">
            {courses.length}
          </div>
          <div className="text-[11px] text-[var(--ink-muted)] mt-1">
            Registered university courses
          </div>
        </div>

        <div className="p-6">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-2">
            Campus Members
          </div>
          <div className="text-3xl sm:text-4xl font-semibold text-[var(--ink)] tabular-nums">
            {members.length}
          </div>
          <div className="text-[11px] text-[var(--ink-muted)] mt-1">
            Students, class reps & lecturers
          </div>
        </div>

        <div className="p-6">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-2">
            Faculty Documents
          </div>
          <div className="text-3xl sm:text-4xl font-semibold text-[var(--ink)] tabular-nums">
            {documents.length}
          </div>
          <div className="text-[11px] text-[var(--ink-muted)] mt-1">
            {verifiedCount} verified in library
          </div>
        </div>

        <div className="p-6">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-2">
            Vault Downloads
          </div>
          <div className="text-3xl sm:text-4xl font-semibold text-[var(--ink)] tabular-nums">
            {vaultResources.reduce((acc, r) => acc + r.downloads_count, 0)}
          </div>
          <div className="text-[11px] text-[var(--ink-muted)] mt-1">
            Across {vaultResources.length} approved files
          </div>
        </div>
      </div>

      {/* Institutional Details + Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[var(--border)] bg-[var(--bg)] p-6 space-y-5">
            <h2 className="font-sans text-xl font-semibold text-[var(--ink)] tracking-tight border-b border-[var(--border)] pb-3">
              University Profile
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[var(--ink-muted)] block">Official Name</span>
                <span className="font-semibold text-[var(--ink)]">{activeSchool.name}</span>
              </div>

              <div>
                <span className="text-[var(--ink-muted)] block">Campus Domain</span>
                <span className="font-semibold text-[var(--ink)]">
                  {activeSchool.domain || activeSchool.slug}
                </span>
              </div>

              <div>
                <span className="text-[var(--ink-muted)] block">Institution Code</span>
                <span className="font-semibold text-[var(--ink)] tabular-nums">{activeSchool.code}</span>
              </div>

              <div>
                <span className="text-[var(--ink-muted)] block">Country</span>
                <span className="font-semibold text-[var(--ink)]">
                  {activeSchool.country || "Rwanda"}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
            <h3 className="font-sans font-semibold text-lg text-[var(--ink)] tracking-tight">
              Private Campus Access
            </h3>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Every syllabus, lecture note, and member profile in this workspace is scoped strictly to {activeSchool.name} and protected by institution-level access rules.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h2 className="font-sans text-xl font-semibold text-[var(--ink)] tracking-tight">
              Recent Academic Resources
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
            >
              View All Documents &rarr;
            </button>
          </div>

          {recentDocs.length === 0 ? (
            <div className="border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-3">
              <div className="text-sm font-semibold text-[var(--ink)]">
                No documents published yet
              </div>
              <p className="text-xs text-[var(--ink-muted)] max-w-md mx-auto">
                Start building your university&apos;s resource library by publishing your first course syllabus or lecture notes.
              </p>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(true)}
                className="btn-accent px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                + Publish First Resource
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)] border border-[var(--border)] bg-[var(--bg)]">
              {recentDocs.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  className="w-full text-left p-5 hover:bg-[var(--surface)] transition-colors cursor-pointer flex items-start justify-between gap-4 group"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                      <span className="font-semibold text-[var(--ink)] tabular-nums">{doc.course_code}</span>
                      <span>&bull;</span>
                      <span>{doc.category}</span>
                      <span>&bull;</span>
                      <span>{doc.academic_year}</span>
                    </div>
                    <div className="font-sans text-base font-semibold text-[var(--ink)] truncate group-hover:text-[var(--accent)] transition-colors">
                      {doc.title}
                    </div>
                    <div className="text-xs text-[var(--ink-muted)] truncate">
                      {doc.uploaded_by} &bull; {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <span className="text-[11px] font-medium px-2 py-0.5 border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shrink-0">
                    {doc.approved ? "Verified" : "Under Review"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
