/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "./WorkspaceContext";

export const ResourceVaultView: React.FC = () => {
  const { vaultResources, activeSchool, recordDownload, setIsPublishModalOpen } = useWorkspace();
  const [selectedFileType, setSelectedFileType] = useState<string>("All");
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const fileTypes: Array<{ value: string; label: string }> = [
    { value: "All", label: "All" },
    { value: "pdf", label: "PDF" },
    { value: "pptx", label: "Slides" },
    { value: "docx", label: "DOCX" },
    { value: "link", label: "Links" },
  ];

  const filteredVault = vaultResources.filter(
    (res) => selectedFileType === "All" || res.file_type === selectedFileType
  );

  const handleDownload = async (item: typeof vaultResources[number]) => {
    await recordDownload(item);
    setDownloadedId(item.id);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--accent)] block mb-1">
            Verified Study Materials &bull; {activeSchool.code}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-[-0.03em]">
            Resource Vault
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
            Approved lecture notes, reference textbooks, past examination papers, and lab guides ready for download.
          </p>
        </div>

        {/* File Type Filter Bar */}
        <div className="flex items-center gap-1 border border-[var(--border)] bg-[var(--surface)] p-1 text-xs self-start sm:self-auto">
          {fileTypes.map((ft) => (
            <button
              key={ft.value}
              type="button"
              onClick={() => setSelectedFileType(ft.value)}
              className={`min-h-[44px] sm:min-h-0 px-3 py-1.5 border transition-colors cursor-pointer text-xs ${
                selectedFileType === ft.value
                  ? "border-[var(--accent)] bg-[var(--bg)] text-[var(--ink)] font-semibold"
                  : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vault Resource Table */}
      {filteredVault.length === 0 ? (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-10 text-center space-y-3">
          <div className="font-sans text-lg font-semibold text-[var(--ink)]">
            No approved files in this category
          </div>
          <p className="text-xs text-[var(--ink-muted)] max-w-md mx-auto">
            Publish a verified lecture note, syllabus, or study guide to populate your campus resource vault.
          </p>
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="btn-accent px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            + Upload to Vault
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Adaptive Card List */}
          <div className="md:hidden space-y-3">
            {filteredVault.map((item) => (
              <div
                key={item.id}
                className="border border-[var(--border)] bg-[var(--bg)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold tabular-nums text-[var(--ink)]">
                    {item.course_code}
                  </span>
                  <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--ink)]">
                    {item.file_type} &bull; {item.file_size}
                  </span>
                </div>

                <div>
                  <h3 className="font-sans text-sm font-semibold text-[var(--ink)] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">
                    {item.category} &bull; Uploaded by {item.uploaded_by}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border)] text-xs">
                  <span className="tabular-nums text-[var(--ink-muted)]">
                    {item.downloads_count} downloads
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    className="min-h-[44px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    {downloadedId === item.id ? "Opened" : item.file_type === "link" ? "Open Link" : "Download"}
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
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4 text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredVault.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--surface)] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--ink)] tabular-nums whitespace-nowrap">
                    {item.course_code}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--ink)]">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--ink-muted)]">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--ink)]">
                      {item.file_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[var(--ink-muted)]">
                    {item.file_size}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--ink)]">
                    {item.uploaded_by}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[var(--ink-muted)] whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[var(--ink)] font-semibold">
                    {item.downloads_count}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      className="border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
                    >
                      {downloadedId === item.id ? "Opened" : item.file_type === "link" ? "Open Link" : "Download"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
};
