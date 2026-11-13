/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useWorkspace } from "./WorkspaceContext";
import { WorkspaceTab } from "./workspaceTypes";
import { ThemeToggle } from "../ui/ThemeToggle";

interface WorkspaceSidebarProps {
  embeddedMobile?: boolean;
  onItemSelect?: () => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  embeddedMobile = false,
  onItemSelect,
}) => {
  const {
    activeTab,
    setActiveTab,
    activeSchool,
    courses,
    documents,
    vaultResources,
    members,
    currentUser,
    onNavigateToLanding,
    onSignOut,
  } = useWorkspace();

  const navItems: Array<{ id: WorkspaceTab; label: string; badgeCount?: number }> = [
    { id: "overview", label: "Overview" },
    { id: "programs", label: "Courses", badgeCount: courses.length },
    { id: "documents", label: "Faculty Documentation", badgeCount: documents.length },
    { id: "vault", label: "Resource Vault", badgeCount: vaultResources.length },
    { id: "students", label: "Members & Roles", badgeCount: members.length },
  ];

  return (
    <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between shrink-0 h-auto lg:h-screen lg:sticky lg:top-0">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Brand Typographic Wordmark (Plus Jakarta Sans Only) */}
        {!embeddedMobile && (
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <button
              type="button"
              onClick={onNavigateToLanding}
              aria-label="Return to Sovra home"
              className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span className="font-sans font-bold text-2xl tracking-[-0.03em] text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                SOVRA
              </span>
              <span className="block text-[10px] font-sans text-[var(--ink-muted)] tracking-wider uppercase">
                Campus Hub
              </span>
            </button>

            <ThemeToggle />
          </div>
        )}

        {/* University Switcher */}
        <div className="border-b border-[var(--border)] pb-4 space-y-1">
          <div className="text-[11px] font-medium tracking-wider uppercase text-[var(--ink-muted)]">
            Active University
          </div>
          <div className="font-sans text-base font-bold text-[var(--ink)] tracking-tight truncate">
            {activeSchool.name}
          </div>
          <div className="text-[11px] text-[var(--ink-muted)] flex items-center justify-between">
            <span className="truncate">{activeSchool.domain || activeSchool.slug}</span>
            <span className="tabular-nums font-semibold">{activeSchool.code}</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav aria-label="Campus Workspace Navigation" className="space-y-1">
          <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider uppercase text-[var(--ink-muted)]">
            Academic Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  onItemSelect?.();
                }}
                className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer text-left border ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--surface)] text-[var(--ink)] font-semibold"
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

      {/* Footer Utility & Member Session */}
      <div className="p-5 sm:p-6 border-t border-[var(--border)] bg-[var(--surface)] space-y-3">
        {currentUser && (
          <div className="text-[11px] text-[var(--ink-muted)] space-y-1 border-b border-[var(--border)] pb-3">
            <div className="font-semibold text-[var(--ink)] truncate">{currentUser.name}</div>
            <div className="flex items-center justify-between">
              <span>{currentUser.role}</span>
              <span className="tabular-nums">{currentUser.academicYear}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onNavigateToLanding}
            className="w-full py-2 px-3 border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--ink)] text-[var(--ink)] text-xs font-semibold tracking-tight transition-colors cursor-pointer text-center"
          >
            &larr; Home Page
          </button>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full py-2 px-3 border border-[var(--border)] bg-[var(--bg)] hover:border-red-600/50 text-[var(--ink-muted)] hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold tracking-tight transition-colors cursor-pointer text-center"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
