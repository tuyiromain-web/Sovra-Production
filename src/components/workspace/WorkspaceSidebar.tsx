/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "./WorkspaceContext";
import { TenantSwitcher } from "./TenantSwitcher";
import { ThemeToggle } from "../ui/ThemeToggle";
import { WorkspaceTab } from "./workspaceTypes";

interface NavItem {
  id: WorkspaceTab;
  label: string;
  badgeCount?: number;
}

export const WorkspaceSidebar: React.FC = () => {
  const { activeTab, setActiveTab, onNavigateToLanding, activeTenant, documents, programs } = useWorkspace();

  const navItems: NavItem[] = [
    { id: "overview", label: "Overview" },
    { id: "programs", label: "Academic Programs", badgeCount: programs.length },
    { id: "documents", label: "Faculty Documentation", badgeCount: documents.length },
    { id: "vault", label: "Resource Vault" },
    { id: "students", label: "Students & Roles" }
  ];

  return (
    <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between shrink-0 h-auto lg:h-screen lg:sticky lg:top-0">
      
      {/* Top Header & Brand Wordmark */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Brand Typographic Wordmark (Plus Jakarta Sans Only) */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <button
            type="button"
            onClick={onNavigateToLanding}
            aria-label="Return to platform landing"
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span className="font-sans font-bold text-2xl tracking-[-0.03em] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
              SOVRA
            </span>
            <span className="block text-[10px] font-sans text-[var(--ink-muted)] tracking-wider uppercase">
              Academic Network
            </span>
          </button>
          
          <ThemeToggle />
        </div>

        {/* Tenant Switcher Component */}
        <TenantSwitcher />

        {/* Navigation List */}
        <nav aria-label="Institutional Workspace Navigation" className="space-y-1">
          <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--ink-muted)]">
            Workspace Ledger
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer text-left border ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-xs"
                    : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
                }`}
              >
                <span>{item.label}</span>
                {typeof item.badgeCount === "number" && (
                  <span className="text-[11px] tabular-nums text-[var(--ink-muted)] font-normal">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Footer Utility & Landing Route Switch */}
      <div className="p-5 sm:p-6 border-t border-[var(--border)] bg-[var(--surface)] space-y-3">
        <div className="text-[11px] text-[var(--ink-muted)] space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[var(--ink)]">Network Security</span>
            <span className="tabular-nums font-semibold text-[var(--ink)]">Private Campus Space</span>
          </div>
          <div className="truncate text-[10px]">
            Accreditation: {activeTenant.accreditationBody}
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToLanding}
          className="w-full py-2.5 px-3 border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--ink)] text-[var(--ink)] text-xs font-semibold tracking-tight transition-colors cursor-pointer text-center"
        >
          &larr; Exit to Platform Landing
        </button>
      </div>

    </aside>
  );
};
