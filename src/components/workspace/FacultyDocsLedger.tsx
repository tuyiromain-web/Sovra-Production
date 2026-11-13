/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "./WorkspaceContext";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";

export const FacultyDocsLedger: React.FC = () => {
  const {
    filteredDocuments,
    activeSchool,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    setSelectedDoc,
    setIsPublishModalOpen,
  } = useWorkspace();

  const categories = ["All", "Syllabus", "Notes", "Past Paper", "Reference Book", "Lab Report"];
  const statuses = ["All", "Verified", "Under Review"];

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryFilter("All");
    setSelectedStatusFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--accent)] block mb-1">
            Academic Library &bull; {activeSchool.code}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-[-0.03em]">
            Faculty Documentation & Syllabi
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
            Official course syllabi, lecture notes, past papers, and lab guides published for {activeSchool.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPublishModalOpen(true)}
          className="btn-accent px-5 py-2.5 text-xs font-semibold rounded-none cursor-pointer self-start sm:self-auto shrink-0"
        >
          + Publish Resource
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[var(--surface)] border border-[var(--border)] p-4">
        <div className="flex-1 min-w-0">
          <label htmlFor="doc-search" className="sr-only">
            Search academic documents
          </label>
          <input
            id="doc-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, course code, course name, or uploader..."
            className="w-full min-h-[44px] sm:min-h-0 border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-3.5 py-2 text-xs outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="category-filter" className="text-[var(--ink-muted)] font-medium">
              Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="min-h-[44px] sm:min-h-0 border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--accent)]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="status-filter" className="text-[var(--ink-muted)] font-medium">
              Status:
            </label>
            <select
              id="status-filter"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="min-h-[44px] sm:min-h-0 border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] px-2.5 py-1.5 text-xs outline-none focus:border-[var(--accent)]"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {filteredDocuments.length === 0 ? (
        <WorkspaceEmptyState
          title="No matching documents found"
          description="No resources match your current filters, or no documents have been published yet for this university."
          actionLabel={searchQuery || selectedCategoryFilter !== "All" || selectedStatusFilter !== "All" ? "Reset All Filters" : "Publish First Document"}
          onAction={searchQuery || selectedCategoryFilter !== "All" || selectedStatusFilter !== "All" ? handleResetFilters : () => setIsPublishModalOpen(true)}
        />
      ) : (
        <>
          {/* Mobile Adaptive Card List */}
          <div className="md:hidden space-y-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="border border-[var(--border)] bg-[var(--bg)] p-4 space-y-3 cursor-pointer hover:border-[var(--accent)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold tabular-nums text-[var(--ink)]">
                    {doc.course_code}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-semibold border ${
                      doc.approved
                        ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                        : "border-[var(--border)] text-[var(--ink-muted)] bg-[var(--surface)]"
                    }`}
                  >
                    {doc.approved ? "Verified" : "Under Review"}
                  </span>
                </div>

                <div>
                  <h3 className="font-sans text-sm font-semibold text-[var(--ink)] leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">
                    {doc.course_name} &bull; {doc.academic_year}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border)] text-xs">
                  <div className="flex items-center gap-2 text-[var(--ink-muted)]">
                    <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink)]">
                      {doc.category}
                    </span>
                    <span className="truncate max-w-[140px]">{doc.uploaded_by}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoc(doc);
                    }}
                    className="min-h-[44px] inline-flex items-center text-[var(--accent)] font-semibold hover:underline cursor-pointer"
                  >
                    Inspect &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Data Table */}
          <div className="hidden md:block border border-[var(--border)] bg-[var(--bg)] overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] font-semibold">
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="hover:bg-[var(--surface)] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-[var(--ink)] tabular-nums whitespace-nowrap">
                    {doc.course_code}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                    {doc.title}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--ink-muted)]">
                    {doc.course_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink)] whitespace-nowrap">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[var(--ink-muted)] whitespace-nowrap">
                    {doc.academic_year}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--ink)]">
                    {doc.uploaded_by}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[11px] font-semibold border ${
                        doc.approved
                          ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                          : "border-[var(--border)] text-[var(--ink-muted)] bg-[var(--surface)]"
                      }`}
                    >
                      {doc.approved ? "Verified" : "Under Review"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[var(--ink-muted)] whitespace-nowrap">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                      }}
                      className="text-[var(--accent)] font-semibold hover:underline cursor-pointer"
                    >
                      Inspect &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}

      {/* Summary Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)] pt-2 border-t border-[var(--border)]">
        <div>
          Showing <span className="font-semibold text-[var(--ink)] tabular-nums">{filteredDocuments.length}</span> documents in <span className="font-sans font-semibold text-[var(--ink)]">{activeSchool.name}</span>.
        </div>
        <div className="flex items-center gap-4">
          <span>Verified Campus Library</span>
        </div>
      </div>
    </div>
  );
};
