/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { 
  InstitutionTenant, FacultyDocument, AcademicProgram, 
  VaultResource, StudentCohort, WorkspaceTab, ApprovalStatus 
} from "./workspaceTypes";
import { 
  INSTITUTION_TENANTS, INITIAL_DOCUMENTS, INITIAL_PROGRAMS, 
  INITIAL_VAULT_RESOURCES, INITIAL_STUDENT_COHORTS 
} from "./workspaceData";

export interface WorkspaceContextValue {
  // Active Tenant
  activeTenant: InstitutionTenant;
  availableTenants: InstitutionTenant[];
  switchTenant: (tenantId: string) => void;

  // Active View Tab
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;

  // Navigation back to platform / landing
  onNavigateToLanding: () => void;

  // Faculty Documentation State
  documents: FacultyDocument[];
  filteredDocuments: FacultyDocument[];
  selectedDoc: FacultyDocument | null;
  setSelectedDoc: (doc: FacultyDocument | null) => void;
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (open: boolean) => void;
  publishDocument: (doc: Omit<FacultyDocument, "id" | "updatedAt" | "hash">) => void;
  updateDocumentStatus: (id: string, status: ApprovalStatus) => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;

  // Programs & Vault Data
  programs: AcademicProgram[];
  vaultResources: VaultResource[];
  cohorts: StudentCohort[];

  // Tenant switching loading state
  isTenantSwitching: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export interface WorkspaceProviderProps {
  children: ReactNode;
  initialTenantId?: string;
  onNavigateToLanding: () => void;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({
  children,
  initialTenantId = "tenant-stjude",
  onNavigateToLanding
}) => {
  const [activeTenantId, setActiveTenantId] = useState<string>(initialTenantId);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [isTenantSwitching, setIsTenantSwitching] = useState<boolean>(false);

  // Documents state per tenant
  const [tenantDocs, setTenantDocs] = useState<Record<string, FacultyDocument[]>>(INITIAL_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<FacultyDocument | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");

  const activeTenant = useMemo(() => {
    return INSTITUTION_TENANTS.find(t => t.id === activeTenantId) || INSTITUTION_TENANTS[0];
  }, [activeTenantId]);

  const switchTenant = (tenantId: string) => {
    if (tenantId === activeTenantId) return;
    setIsTenantSwitching(true);
    setSelectedDoc(null);
    setSearchQuery("");
    setSelectedCategoryFilter("All");
    setSelectedStatusFilter("All");

    setTimeout(() => {
      setActiveTenantId(tenantId);
      setIsTenantSwitching(false);
    }, 250);
  };

  const currentDocs = useMemo(() => {
    return tenantDocs[activeTenantId] || [];
  }, [tenantDocs, activeTenantId]);

  const filteredDocuments = useMemo(() => {
    return currentDocs.filter(doc => {
      const matchesSearch = 
        !searchQuery.trim() ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.programName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategoryFilter === "All" || doc.category === selectedCategoryFilter;

      const matchesStatus = 
        selectedStatusFilter === "All" || doc.status === selectedStatusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [currentDocs, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

  const publishDocument = (newDocData: Omit<FacultyDocument, "id" | "updatedAt" | "hash">) => {
    const newDoc: FacultyDocument = {
      ...newDocData,
      id: `doc-${activeTenant.code.toLowerCase()}-${Date.now().toString(36)}`,
      updatedAt: new Date().toISOString().split("T")[0],
      hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    };

    setTenantDocs(prev => ({
      ...prev,
      [activeTenantId]: [newDoc, ...(prev[activeTenantId] || [])]
    }));

    setIsPublishModalOpen(false);
    setSelectedDoc(newDoc);
  };

  const updateDocumentStatus = (id: string, status: ApprovalStatus) => {
    setTenantDocs(prev => {
      const currentList = prev[activeTenantId] || [];
      const updated = currentList.map(doc => doc.id === id ? { ...doc, status } : doc);
      return { ...prev, [activeTenantId]: updated };
    });

    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc(prev => prev ? { ...prev, status } : null);
    }
  };

  const programs = useMemo(() => {
    return INITIAL_PROGRAMS[activeTenantId] || [];
  }, [activeTenantId]);

  const vaultResources = useMemo(() => {
    return INITIAL_VAULT_RESOURCES[activeTenantId] || [];
  }, [activeTenantId]);

  const cohorts = useMemo(() => {
    return INITIAL_STUDENT_COHORTS[activeTenantId] || [];
  }, [activeTenantId]);

  const contextValue = useMemo<WorkspaceContextValue>(() => ({
    activeTenant,
    availableTenants: INSTITUTION_TENANTS,
    switchTenant,
    activeTab,
    setActiveTab,
    onNavigateToLanding,
    documents: currentDocs,
    filteredDocuments,
    selectedDoc,
    setSelectedDoc,
    isPublishModalOpen,
    setIsPublishModalOpen,
    publishDocument,
    updateDocumentStatus,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    programs,
    vaultResources,
    cohorts,
    isTenantSwitching
  }), [
    activeTenant,
    activeTab,
    onNavigateToLanding,
    currentDocs,
    filteredDocuments,
    selectedDoc,
    isPublishModalOpen,
    searchQuery,
    selectedCategoryFilter,
    selectedStatusFilter,
    programs,
    vaultResources,
    cohorts,
    isTenantSwitching
  ]);

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
