/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "./WorkspaceContext";

export const StudentsRolesView: React.FC = () => {
  const { members, activeSchool } = useWorkspace();
  const [roleFilter, setRoleFilter] = useState<string>("All");

  const roles = ["All", "Student", "Class Representative", "Lecturer", "Admin"];

  const filteredMembers = members.filter(
    (m) => roleFilter === "All" || m.role === roleFilter
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--accent)] block mb-1">
            Campus Directory &bull; {activeSchool.code}
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-[-0.03em]">
            Members & Academic Roles
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
            Verified students, class representatives, lecturers, and administrators belonging to {activeSchool.name}.
          </p>
        </div>

        {/* Role Filter */}
        <div className="flex flex-wrap items-center gap-1 border border-[var(--border)] bg-[var(--surface)] p-1 text-xs self-start sm:self-auto">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 border transition-colors cursor-pointer text-xs ${
                roleFilter === r
                  ? "border-[var(--accent)] bg-[var(--bg)] text-[var(--ink)] font-semibold"
                  : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      {filteredMembers.length === 0 ? (
        <div className="border border-[var(--border)] bg-[var(--surface)] p-10 text-center space-y-2">
          <div className="font-sans text-lg font-semibold text-[var(--ink)]">
            No members found
          </div>
          <p className="text-xs text-[var(--ink-muted)] max-w-md mx-auto">
            No campus accounts match the selected role filter in {activeSchool.name}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="border border-[var(--border)] bg-[var(--bg)] p-6 space-y-4 hover:border-[var(--ink-muted)] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
                  <span className="font-semibold text-[var(--ink)] tabular-nums">
                    {member.student_id}
                  </span>
                  <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink)]">
                    {member.role}
                  </span>
                </div>

                <div className="font-sans text-lg font-semibold text-[var(--ink)] truncate">
                  {member.name}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[var(--ink-muted)] gap-2">
                    <span>Email</span>
                    <span className="font-medium text-[var(--ink)] truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--ink-muted)]">
                    <span>Academic Year</span>
                    <span className="font-semibold text-[var(--ink)] tabular-nums">{member.academic_year}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] text-[11px] text-[var(--ink-muted)] flex items-center justify-between">
                <span>Joined</span>
                <span className="tabular-nums">{new Date(member.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
