/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "./WorkspaceContext";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";
import { DocCategory, FacultyDocument } from "./workspaceTypes";

const CATEGORIES: ("All" | DocCategory)[] = [
  "All",
  "Syllabus",
  "Accreditation Record",
  "Curriculum Framework",
  "Lecture Packet"
];

const STATUSES = ["All", "Verified", "Under Review", "Archived"];

export const FacultyDocsLedger: React.FC = () => {
  const {
    filteredDocuments,
    setSelectedDoc,
    setIsPublishModalOpen,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    activeTenant
  } = useWorkspace();

  return (
    <div className="space-y-6">
      
      {/* Ledger Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--accent)] block mb-1">
            Institutional Vault Ledger &bull; {activeTenant.code}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--ink)] tracking-tight">
            Faculty Documentation & Syllabi
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
            Central repository of accredited course syllabi, curriculum frameworks, and faculty compendiums. Cryptographically indexed and isolated to {activeTenant.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPublishModalOpen(true)}
          className="btn-accent px-5 py-2.5 text-xs font-semibold rounded-none cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
        >
          + Publish Documentation
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 border border-[var(--border)] bg-[var(--surface)] p-3">
        
        {/* Search input */}
        <div className="md:col-span-6 relative">
          <input
            type="text"
            aria-label="Search faculty documentation"
            placeholder="Search by course title, code (e.g. ROB-401), author, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] text-xs px-3.5 py-2.5 outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Category filter tabs */}
        <div className="md:col-span-4 flex items-center gap-1 overflow-x-auto text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-2 border transition-colors cursor-pointer whitespace-nowrap text-xs ${
                selectedCategoryFilter === cat
                  ? "border-[var(--accent)] bg-[var(--bg)] text-[var(--ink)] font-semibold"
                  : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            aria-label="Filter documentation by approval status"
            className="w-full border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] text-xs px-3 py-2 outline-none focus:border-[var(--accent)]"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Ledger Table */}
      {filteredDocuments.length === 0 ? (
        <WorkspaceEmptyState
          title="No Matching Documentation Found"
          description={`Zero documents match the current filter criteria under ${activeTenant.name}. You may adjust search queries or upload a new syllabus.`}
          actionLabel="Publish New Syllabus"
          onAction={() => setIsPublishModalOpen(true)}
        />
      ) : (
        <div className="border border-[var(--border)] bg-[var(--bg)] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] font-semibold">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Program / Department</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Authoring Faculty</th>
                <th className="py-3 px-4">Approval State</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredDocuments.map((doc: FacultyDocument) => (
                <tr
                  key={doc.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open syllabus: ${doc.title}`}
                  onClick={() => setSelectedDoc(doc)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedDoc(doc);
                    }
                  }}
                  className="hover:bg-[var(--surface)] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:bg-[var(--surface)]"
                >
                  <td className="py-3.5 px-4 font-semibold text-[var(--ink)] tabular-nums whitespace-nowrap">
                    {doc.code}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                      {doc.title}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--ink-muted)]">
                    {doc.programName}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--ink-muted)]">
                    {doc.category}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[var(--ink)] font-medium">
                    {doc.version}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--ink)]">
                    {doc.author}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink)]">
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[var(--ink-muted)] whitespace-nowrap">
                    {doc.updatedAt}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                      }}
                      className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
                    >
                      Inspect &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ledger Pagination / Ledger Record Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)] pt-2 border-t border-[var(--border)]">
        <div>
          Showing <span className="font-semibold text-[var(--ink)] tabular-nums">{filteredDocuments.length}</span> verified documents in partition <span className="font-sans tabular-nums text-[11px] text-[var(--ink)]">{activeTenant.isolatedPartitionKey}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Accreditation Hash Verification: <strong className="text-[var(--ink)]">Enforced</strong></span>
          <span>AES-256 Storage: <strong className="text-[var(--ink)]">Active</strong></span>
        </div>
      </div>

    </div>
  );
};
