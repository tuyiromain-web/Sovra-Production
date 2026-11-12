/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useWorkspace } from "./WorkspaceContext";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { OverviewView } from "./OverviewView";
import { ProgramsMatrixView } from "./ProgramsMatrixView";
import { FacultyDocsLedger } from "./FacultyDocsLedger";
import { ResourceVaultView } from "./ResourceVaultView";
import { StudentsRolesView } from "./StudentsRolesView";
import { DocumentReaderDrawer } from "./DocumentReaderDrawer";
import { PublishDocumentModal } from "./PublishDocumentModal";
import { WorkspaceSkeletons } from "./WorkspaceSkeletons";

export const WorkspaceShell: React.FC = () => {
  const { activeTab, activeTenant, isTenantSwitching } = useWorkspace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    if (isTenantSwitching) {
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
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <div>
          <span className="font-sans text-xl font-semibold text-[var(--ink)]">
            SOVRA
          </span>
          <span className="block text-[10px] text-[var(--ink-muted)]">
            {activeTenant.name}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] cursor-pointer"
        >
          {mobileMenuOpen ? "Close Menu" : "Workspace Menu"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border)] bg-[var(--bg)]">
          <WorkspaceSidebar />
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">
        <WorkspaceSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Breadcrumb Header Bar */}
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold text-[var(--ink)]">
                {activeTenant.name}
              </span>
              <span>/</span>
              <span className="capitalize text-[var(--ink)] font-medium">
                {activeTab}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block font-sans tabular-nums text-[10px] text-[var(--ink-muted)]">
                Campus Domain: {activeTenant.domain}
              </span>
              <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ink)]">
                Private Campus Network
              </span>
            </div>
          </div>

          {/* Active Tab View */}
          {renderActiveView()}

        </div>
      </main>

      {/* Slide-over Document Reader Drawer */}
      <DocumentReaderDrawer />

      {/* Publish Document Modal */}
      <PublishDocumentModal />

    </div>
  );
};
