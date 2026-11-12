/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "./WorkspaceContext";

export const StudentsRolesView: React.FC = () => {
  const { cohorts, activeTenant } = useWorkspace();

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--accent)] block mb-1">
          Identity & Cohort Perimeters &bull; {activeTenant.code}
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--ink)] tracking-tight">
          Student Cohorts & Verified Roles
        </h1>
        <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
          Automated student profile mapping linked to academic degree tracks, enrollment years, and course assignments. Access permissions are strictly scoped to {activeTenant.name}.
        </p>
      </div>

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="border border-[var(--border)] bg-[var(--bg)] p-6 space-y-4 hover:border-[var(--ink-muted)] transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
                <span className="font-semibold text-[var(--ink)] tabular-nums">{cohort.cohortCode}</span>
                <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink)]">
                  {cohort.year}
                </span>
              </div>

              <div className="font-sans text-xl font-semibold text-[var(--ink)]">
                {cohort.program}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[var(--ink-muted)]">
                  <span>Enrolled Students</span>
                  <span className="font-semibold text-[var(--ink)] tabular-nums">{cohort.studentCount} Students</span>
                </div>
                <div className="flex items-center justify-between text-[var(--ink-muted)]">
                  <span>Class Representative</span>
                  <span className="font-semibold text-[var(--ink)]">{cohort.representative}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--ink-muted)]">
                  <span>Attendance Verification Rate</span>
                  <span className="font-semibold text-[var(--ink)] tabular-nums">{cohort.attendanceRate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] text-[11px] text-[var(--ink-muted)] flex items-center justify-between">
              <span>Sync status</span>
              <span>{cohort.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
