/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "./WorkspaceContext";

export const ResourceVaultView: React.FC = () => {
  const { vaultResources, activeTenant } = useWorkspace();
  const [selectedFormat, setSelectedFormat] = useState<string>("All");
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const formats = ["All", "PDF", "DOCX", "SLIDES", "LAB"];

  const filteredVault = vaultResources.filter(
    (res) => selectedFormat === "All" || res.format === selectedFormat
  );

  const handleDownload = (id: string, title: string) => {
    setDownloadSuccessId(id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--accent)] block mb-1">
            Curated Academic Storage &bull; {activeTenant.code}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--ink)] tracking-tight">
            Curated Resource Vault & Compendiums
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
            Verified course packs, lab protocols, and lecture presentations published directly by faculty members. Fully accessible for offline study.
          </p>
        </div>

        {/* Format Filter Bar */}
        <div className="flex items-center gap-1 border border-[var(--border)] bg-[var(--surface)] p-1 text-xs">
          {formats.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 border transition-colors cursor-pointer text-xs ${
                selectedFormat === fmt
                  ? "border-[var(--accent)] bg-[var(--bg)] text-[var(--ink)] font-semibold"
                  : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Vault Resource Table */}
      <div className="border border-[var(--border)] bg-[var(--bg)] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] font-semibold">
              <th className="py-3 px-4">Module</th>
              <th className="py-3 px-4">Resource Title</th>
              <th className="py-3 px-4">Program Track</th>
              <th className="py-3 px-4">Format</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Lecturer Sign-Off</th>
              <th className="py-3 px-4">Published</th>
              <th className="py-3 px-4">Downloads</th>
              <th className="py-3 px-4 text-right">Integrity & Retrieval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredVault.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--surface)] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[var(--ink)] tabular-nums whitespace-nowrap">
                  {item.moduleCode}
                </td>
                <td className="py-3.5 px-4 font-medium text-[var(--ink)]">
                  {item.title}
                </td>
                <td className="py-3.5 px-4 text-[var(--ink-muted)]">
                  {item.programName}
                </td>
                <td className="py-3.5 px-4">
                  <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ink)]">
                    {item.format}
                  </span>
                </td>
                <td className="py-3.5 px-4 tabular-nums text-[var(--ink-muted)]">
                  {item.fileSize}
                </td>
                <td className="py-3.5 px-4 text-[var(--ink)]">
                  {item.lecturer}
                </td>
                <td className="py-3.5 px-4 tabular-nums text-[var(--ink-muted)] whitespace-nowrap">
                  {item.publishedDate}
                </td>
                <td className="py-3.5 px-4 tabular-nums text-[var(--ink)] font-semibold">
                  {item.downloadsCount}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDownload(item.id, item.title)}
                    className="border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    {downloadSuccessId === item.id ? "Verified ✓" : "Download Vault Pack"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
