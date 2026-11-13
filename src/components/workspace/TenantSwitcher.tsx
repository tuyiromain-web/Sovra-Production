/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useWorkspace } from "./WorkspaceContext";

export const TenantSwitcher: React.FC = () => {
  const { activeSchool, availableSchools, switchSchool } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Switch university workspace"
        className="w-full text-left p-3 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink-muted)] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-medium tracking-wider uppercase text-[var(--ink-muted)]">
            Active Campus
          </span>
          <span className="text-[11px] font-semibold text-[var(--ink)] tabular-nums">
            {activeSchool.code}
          </span>
        </div>

        <div className="font-sans text-base font-semibold text-[var(--ink)] tracking-tight truncate">
          {activeSchool.name}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)] mt-1.5 pt-1.5 border-t border-[var(--border)]">
          <span className="truncate">{activeSchool.domain || activeSchool.slug}</span>
          <span className="text-[10px] font-sans opacity-80 shrink-0">
            {activeSchool.country || "University"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Available university workspaces"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 border border-[var(--border)] bg-[var(--bg)] shadow-xl max-h-72 overflow-y-auto"
        >
          <div className="p-2 border-b border-[var(--border)] text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
            University Workspaces
          </div>
          {availableSchools.map((school) => {
            const isSelected = school.id === activeSchool.id;
            return (
              <button
                key={school.id}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => {
                  switchSchool(school.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-3 border-b border-[var(--border)] last:border-b-0 transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-[var(--surface)] border-l-2 border-l-[var(--accent)]"
                    : "hover:bg-[var(--surface)]"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-semibold text-[var(--ink)] truncate">
                      {school.name}
                    </span>
                    <span className="text-[10px] text-[var(--ink-muted)] tabular-nums">
                      ({school.code})
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--ink-muted)] truncate">
                    {school.domain || school.slug}
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-semibold text-[var(--accent)] shrink-0">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
