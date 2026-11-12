/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { useWorkspace } from "./WorkspaceContext";
import { ApprovalStatus } from "./workspaceTypes";

export const DocumentReaderDrawer: React.FC = () => {
  const { selectedDoc, setSelectedDoc, updateDocumentStatus } = useWorkspace();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedDoc(null);
      }
    };
    if (selectedDoc) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedDoc, setSelectedDoc]);

  if (!selectedDoc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Faculty document details: ${selectedDoc.title}`}
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end"
    >
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={() => setSelectedDoc(null)} 
        aria-hidden="true" 
      />

      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-2xl bg-[var(--bg)] border-l border-[var(--border)] h-full overflow-y-auto p-6 sm:p-10 space-y-8 shadow-2xl flex flex-col justify-between"
      >
        <div className="space-y-8">
          
          {/* Header Bar */}
          <div className="flex items-start justify-between border-b border-[var(--border)] pb-5 gap-4">
            <div>
              <div className="flex items-center gap-3 text-xs text-[var(--ink-muted)] mb-1">
                <span className="font-semibold text-[var(--ink)] tabular-nums">{selectedDoc.code}</span>
                <span>&bull;</span>
                <span>{selectedDoc.programName}</span>
                <span>&bull;</span>
                <span className="tabular-nums">{selectedDoc.version}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight">
                {selectedDoc.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDoc(null)}
              aria-label="Close document drawer"
              className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-2 text-xl font-bold cursor-pointer"
            >
              &times;
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div>
              <span className="block text-[var(--ink-muted)] mb-1">Category</span>
              <span className="font-semibold text-[var(--ink)]">{selectedDoc.category}</span>
            </div>
            <div>
              <span className="block text-[var(--ink-muted)] mb-1">Credit Hours</span>
              <span className="font-semibold text-[var(--ink)] tabular-nums">{selectedDoc.creditHours} Credits</span>
            </div>
            <div>
              <span className="block text-[var(--ink-muted)] mb-1">Approval State</span>
              <span className="font-semibold text-[var(--ink)] border border-[var(--border)] px-2 py-0.5 inline-block">
                {selectedDoc.status}
              </span>
            </div>
            <div>
              <span className="block text-[var(--ink-muted)] mb-1">Last Indexed</span>
              <span className="font-semibold text-[var(--ink)] tabular-nums">{selectedDoc.updatedAt}</span>
            </div>
          </div>

          {/* Author Details */}
          <div className="border border-[var(--border)] p-4 text-xs space-y-1">
            <span className="text-[var(--ink-muted)] block">Authoring Faculty Member</span>
            <div className="text-sm font-semibold text-[var(--ink)]">{selectedDoc.author}</div>
            <div className="text-[var(--ink-muted)]">{selectedDoc.authorRole}</div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="font-display text-lg text-[var(--ink)] tracking-tight">
              Curricular Scope & Abstract
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
              {selectedDoc.summary}
            </p>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-3">
            <h3 className="font-display text-lg text-[var(--ink)] tracking-tight">
              Verified Learning Milestones
            </h3>
            <ul className="space-y-2 text-xs text-[var(--ink)]">
              {selectedDoc.learningObjectives.map((obj, i) => (
                <li key={i} className="p-3 border border-[var(--border)] bg-[var(--surface)] flex items-start gap-2">
                  <span className="font-semibold text-[var(--ink-muted)] tabular-nums shrink-0">
                    0{i + 1}.
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites & Accreditation Alignment */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-display text-lg text-[var(--ink)] tracking-tight">
                Academic Prerequisites
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedDoc.prerequisites.map((prereq, i) => (
                  <span key={i} className="border border-[var(--border)] px-3 py-1 bg-[var(--surface)] text-[var(--ink)]">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-lg text-[var(--ink)] tracking-tight">
                Accreditation Alignment
              </h3>
              <div className="p-3 border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--ink)] font-medium">
                {selectedDoc.accreditationAlignment}
              </div>
            </div>
          </div>

          {/* Cryptographic Proof & Integrity Hash */}
          <div className="border border-[var(--border)] p-4 bg-[var(--surface)] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--ink)]">Cryptographic Payload Integrity</span>
              <span className="tabular-nums text-[var(--ink-muted)]">{selectedDoc.fileSize}</span>
            </div>
            <div className="font-sans tabular-nums text-[10px] break-all text-[var(--ink-muted)] p-2 bg-[var(--bg)] border border-[var(--border)]">
              SHA-256: {selectedDoc.hash}
            </div>
          </div>

        </div>

        {/* Footer Actions / State Modification */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--ink-muted)]">Set State:</span>
            {(["Verified", "Under Review", "Archived"] as ApprovalStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => updateDocumentStatus(selectedDoc.id, status)}
                className={`px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedDoc.status === status
                    ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--ink)]"
                    : "border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSelectedDoc(null)}
            className="btn-accent px-5 py-2 text-xs font-semibold rounded-none cursor-pointer"
          >
            Close Reader
          </button>
        </div>

      </div>
    </div>
  );
};
