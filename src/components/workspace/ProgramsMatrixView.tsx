/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "./WorkspaceContext";

export const ProgramsMatrixView: React.FC = () => {
  const { programs, activeTenant, setActiveTab, setSelectedCategoryFilter } = useWorkspace();

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--accent)] block mb-1">
          Curricular Architecture &bull; {activeTenant.code}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--ink)] tracking-tight">
          Academic Programs & Resource Sharing Matrix
        </h1>
        <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
          Structural matrix of accredited departments, degree tracks, enrolled student cohorts, and automated syllabus coverage across {activeTenant.name}.
        </p>
      </div>

      {/* Program Summary Statistics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--border)] bg-[var(--surface)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
        <div className="p-5">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-1">
            Active Programs
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {programs.length}
          </div>
        </div>

        <div className="p-5">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-1">
            Total Enrolled Cohorts
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {programs.reduce((acc, p) => acc + p.enrolledStudents, 0)}
          </div>
        </div>

        <div className="p-5">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-1">
            Curricular Modules Online
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {programs.reduce((acc, p) => acc + p.totalModules, 0)}
          </div>
        </div>

        <div className="p-5">
          <div className="text-[11px] font-medium text-[var(--ink-muted)] uppercase tracking-wider mb-1">
            Documentation Coverage
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] tabular-nums">
            {activeTenant.coverageMetric}
          </div>
        </div>
      </div>

      {/* Program Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((program) => (
          <div
            key={program.id}
            className="border border-[var(--border)] bg-[var(--bg)] p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-[var(--ink-muted)] transition-colors"
          >
            <div className="space-y-4">
              
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] mb-1">
                    <span className="font-semibold text-[var(--ink)] tabular-nums">{program.code}</span>
                    <span>&bull;</span>
                    <span>{program.duration}</span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--ink)] tracking-tight">
                    {program.name}
                  </h2>
                </div>

                <span className="border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] shrink-0">
                  {program.degreeType}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[var(--ink-muted)] block">Departmental Authority</span>
                <div className="font-semibold text-[var(--ink)]">{program.department}</div>
                <div className="text-[var(--ink-muted)]">Dean: {program.dean}</div>
              </div>

              {/* Coverage & Metrics Matrix */}
              <div className="grid grid-cols-3 gap-3 p-3.5 border border-[var(--border)] bg-[var(--surface)] text-xs">
                <div>
                  <span className="block text-[var(--ink-muted)] text-[10px] uppercase">Students</span>
                  <span className="font-semibold text-[var(--ink)] tabular-nums">{program.enrolledStudents}</span>
                </div>
                <div>
                  <span className="block text-[var(--ink-muted)] text-[10px] uppercase">Modules</span>
                  <span className="font-semibold text-[var(--ink)] tabular-nums">{program.totalModules} Units</span>
                </div>
                <div>
                  <span className="block text-[var(--ink-muted)] text-[10px] uppercase">Coverage</span>
                  <span className="font-semibold text-[var(--ink)] tabular-nums">{program.documentationCoverage}%</span>
                </div>
              </div>

              <div className="text-xs text-[var(--ink-muted)] flex items-center justify-between pt-1">
                <span>Access Security Tier: <strong className="text-[var(--ink)]">{program.accessTier}</strong></span>
                <span className="tabular-nums">{program.sharedResourcesCount} Shared Resources</span>
              </div>

            </div>

            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryFilter("All");
                  setActiveTab("documents");
                }}
                className="text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
              >
                Browse Program Syllabi &rarr;
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab("vault")}
                className="border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors cursor-pointer"
              >
                Open Vault Files
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
