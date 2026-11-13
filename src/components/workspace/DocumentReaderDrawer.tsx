/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { useWorkspace } from "./WorkspaceContext";

export const DocumentReaderDrawer: React.FC = () => {
  const {
    selectedDoc,
    setSelectedDoc,
    toggleDocumentApproval,
    recordDownload,
    currentUser,
  } = useWorkspace();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [updating, setUpdating] = useState(false);

  const canVerify =
    currentUser?.role === "Lecturer" || currentUser?.role === "Admin";

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

  const handleToggleApproval = async (approved: boolean) => {
    setUpdating(true);
    try {
      await toggleDocumentApproval(selectedDoc.id, approved);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Document details: ${selectedDoc.title}`}
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
                <span className="font-semibold text-[var(--ink)] tabular-nums">
                  {selectedDoc.course_code}
                </span>
                <span>&bull;</span>
                <span>{selectedDoc.course_name}</span>
                <span>&bull;</span>
                <span className="tabular-nums">{selectedDoc.academic_year}</span>
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-[-0.03em]">
                {selectedDoc.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDoc(null)}
              aria-label="Close document drawer"
              className="border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)] text-[var(--ink)] px-3 py-1.5 text-xs font-semibold cursor-pointer shrink-0"
            >
              Close &times;
            </button>
          </div>

          {/* Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-[var(--border)] bg-[var(--surface)] text-xs">
            <div>
              <span className="block text-[var(--ink-muted)] text-[10px] uppercase">Status</span>
              <span className="font-semibold text-[var(--ink)]">
                {selectedDoc.approved ? "Verified" : "Under Review"}
              </span>
            </div>
            <div>
              <span className="block text-[var(--ink-muted)] text-[10px] uppercase">Category</span>
              <span className="font-semibold text-[var(--ink)]">{selectedDoc.category}</span>
            </div>
            <div>
              <span className="block text-[var(--ink-muted)] text-[10px] uppercase">Format & Size</span>
              <span className="font-semibold text-[var(--ink)] uppercase tabular-nums">
                {selectedDoc.file_type} &bull; {selectedDoc.file_size}
              </span>
            </div>
            <div>
              <span className="block text-[var(--ink-muted)] text-[10px] uppercase">Downloads</span>
              <span className="font-semibold text-[var(--ink)] tabular-nums">
                {selectedDoc.downloads_count}
              </span>
            </div>
          </div>

          {/* Uploader Attribution */}
          <div className="space-y-2">
            <h3 className="font-sans font-semibold text-lg text-[var(--ink)] tracking-tight">
              Author & Attribution
            </h3>
            <div className="text-xs text-[var(--ink-muted)] flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span>
                Published by <strong className="text-[var(--ink)]">{selectedDoc.uploaded_by}</strong>
              </span>
              <span className="tabular-nums">
                {new Date(selectedDoc.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-sans font-semibold text-lg text-[var(--ink)] tracking-tight">
              Course Material Overview
            </h3>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
              {selectedDoc.description || "No summary description provided for this resource."}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {canVerify ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={updating}
                onClick={() => handleToggleApproval(true)}
                className={`px-4 py-2 text-xs font-semibold border cursor-pointer disabled:opacity-50 ${
                  selectedDoc.approved
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)]"
                }`}
              >
                Verify Resource
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleToggleApproval(false)}
                className={`px-4 py-2 text-xs font-semibold border cursor-pointer disabled:opacity-50 ${
                  !selectedDoc.approved
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]"
                }`}
              >
                Mark Under Review
              </button>
            </div>
          ) : (
            <div className="text-xs text-[var(--ink-muted)]">
              {selectedDoc.approved
                ? "Verified university course material"
                : "Pending faculty review"}
            </div>
          )}

          <button
            type="button"
            onClick={() => recordDownload(selectedDoc)}
            className="btn-accent px-5 py-2.5 text-xs font-semibold cursor-pointer text-center"
          >
            {selectedDoc.file_type === "link" ? "Open Resource Link" : "Download File"}
          </button>
        </div>
      </div>
    </div>
  );
};
