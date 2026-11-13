/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "./WorkspaceContext";
import { WorkspaceTab } from "./workspaceTypes";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { ThemeToggle } from "../ui/ThemeToggle";
import { OverviewView } from "./OverviewView";
import { ProgramsMatrixView } from "./ProgramsMatrixView";
import { FacultyDocsLedger } from "./FacultyDocsLedger";
import { ResourceVaultView } from "./ResourceVaultView";
import { StudentsRolesView } from "./StudentsRolesView";
import { DocumentReaderDrawer } from "./DocumentReaderDrawer";
import { PublishDocumentModal } from "./PublishDocumentModal";
import { WorkspaceSkeletons } from "./WorkspaceSkeletons";

export const WorkspaceShell: React.FC = () => {
  const { activeTab, setActiveTab, activeSchool, isSchoolSwitching, isLoading, errorMessage } = useWorkspace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileTabs: Array<{ id: WorkspaceTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "programs", label: "Courses" },
    { id: "documents", label: "Docs" },
    { id: "vault", label: "Vault" },
    { id: "students", label: "Members" },
  ];

  const renderActiveView = () => {
    if (isSchoolSwitching || isLoading) {
      return <WorkspaceSkeletons />;
    }
    switch (activeTab) {
      case "overview":
        return <OverviewView />;
      case "programs":
        return <ProgramsMatrixView />;
      case "documents":
        return <FacultyDocsLedger />;
      case "vault":
        return <ResourceVaultView />;
      case "students":
        return <StudentsRolesView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans antialiased flex flex-col lg:flex-row transition-colors duration-150">
      {/* Mobile Header Bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
        <div className="min-w-0">
          <span className="font-sans text-xl font-bold tracking-[-0.03em] text-[var(--ink)]">
            SOVRA
          </span>
          <span className="block text-[10px] text-[var(--ink-muted)] truncate">
            {activeSchool.name}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="min-h-[44px] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] cursor-pointer"
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border)] bg-[var(--bg)]">
          <WorkspaceSidebar
            embeddedMobile
            onItemSelect={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">
        <WorkspaceSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-12 pb-24 lg:pb-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Breadcrumb Header Bar */}
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold text-[var(--ink)]">
                {activeSchool.name}
              </span>
              <span>/</span>
              <span className="capitalize text-[var(--ink)] font-medium">
                {activeTab === "programs" ? "Courses" : activeTab === "students" ? "Members" : activeTab}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block font-sans tabular-nums text-[10px] text-[var(--ink-muted)]">
                {activeSchool.domain || activeSchool.slug}
              </span>
              <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ink)]">
                Private Campus Space
              </span>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="border border-red-600/40 bg-[var(--surface)] px-4 py-3 text-xs text-red-600 dark:text-red-400"
            >
              {errorMessage}
            </div>
          )}

          {/* Active Tab View */}
          {renderActiveView()}
        </div>
      </main>

      {/* Slide-over Document Reader Drawer */}
      <DocumentReaderDrawer />

      {/* Publish Document Modal */}
      <PublishDocumentModal />

      {/* Mobile & Tablet Sticky Bottom Navigation Bar */}
      <nav
        aria-label="Quick workspace navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md grid grid-cols-5"
      >
        {mobileTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`min-h-[48px] flex flex-col items-center justify-center px-1 py-2 text-[11px] font-medium transition-colors cursor-pointer border-t-2 ${
                isActive
                  ? "border-[var(--accent)] text-[var(--accent)] font-semibold bg-[var(--surface)]"
                  : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
