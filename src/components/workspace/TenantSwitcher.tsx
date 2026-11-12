/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useWorkspace } from "./WorkspaceContext";

export const TenantSwitcher: React.FC = () => {
  const { activeTenant, availableTenants, switchTenant } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Switch institutional workspace"
        className="w-full text-left p-3 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink-muted)] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-medium tracking-wider uppercase text-[var(--ink-muted)]">
            Active Tenant
          </span>
          <span className="text-[11px] font-semibold text-[var(--ink)] tabular-nums">
            {activeTenant.code}
          </span>
        </div>

        <div className="font-display text-base font-semibold text-[var(--ink)] tracking-tight truncate">
          {activeTenant.name}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)] mt-1.5 pt-1.5 border-t border-[var(--border)]">
          <span className="truncate">{activeTenant.domain}</span>
          <span className="text-[10px] tabular-nums font-sans opacity-80 shrink-0">
            {activeTenant.isolatedPartitionKey.slice(0, 11)}...
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Available institutional tenants"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 border border-[var(--border)] bg-[var(--bg)] shadow-xl max-h-72 overflow-y-auto"
        >
          <div className="p-2 border-b border-[var(--border)] text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
            Cryptographically Isolated Workspaces
          </div>
          {availableTenants.map((tenant) => {
            const isSelected = tenant.id === activeTenant.id;
            return (
              <button
                key={tenant.id}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => {
                  switchTenant(tenant.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface)] transition-colors cursor-pointer ${
                  isSelected ? "bg-[var(--surface)] font-medium" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm text-[var(--ink)]">
                    {tenant.name}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-[var(--accent)] font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)] mt-1">
                  <span>{tenant.domain} &bull; {tenant.term}</span>
                  <span className="tabular-nums">{tenant.totalStudents} Students</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
