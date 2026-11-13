/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { supabase } from "../../supabaseClient";
import {
  DEFAULT_SCHOOL_ID,
  CourseRow,
  ProfileRow,
  ResourceRow,
  SchoolRow,
  createCourse,
  createSchoolResource,
  fetchCoursesBySchool,
  fetchProfilesBySchool,
  fetchResourcesBySchool,
  fetchSchools,
  incrementResourceDownloadCount,
  setResourceApproval,
  uploadStorageFile,
} from "../../services/supabaseApi";
import type { UserProfile } from "../../types";
import type {
  CampusMember,
  CourseProgram,
  ResourceCategory,
  ResourceDocument,
  ResourceFileType,
  SchoolWorkspace,
  WorkspaceTab,
} from "./workspaceTypes";

const FALLBACK_SCHOOL: SchoolWorkspace = {
  id: DEFAULT_SCHOOL_ID,
  name: "INES-Ruhengeri",
  slug: "ines-ruhengeri",
  code: "INES",
  domain: "ines.ac.rw",
  country: "Rwanda",
  created_at: new Date().toISOString(),
};

export interface WorkspaceContextValue {
  currentUser: UserProfile | null;
  activeSchool: SchoolWorkspace;
  availableSchools: SchoolWorkspace[];
  switchSchool: (schoolId: string) => void;

  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;

  onNavigateToLanding: () => void;
  onSignOut?: () => void;

  documents: ResourceDocument[];
  filteredDocuments: ResourceDocument[];
  selectedDoc: ResourceDocument | null;
  setSelectedDoc: (doc: ResourceDocument | null) => void;
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (open: boolean) => void;
  publishDocument: (payload: {
    title: string;
    description: string;
    category: ResourceCategory;
    course_code: string;
    course_name: string;
    course_id?: string | null;
    academic_year: string;
    file_type: ResourceFileType;
    download_url?: string;
    file?: File | null;
    target_lecturer?: string | null;
    target_module?: string | null;
  }) => Promise<void>;
  toggleDocumentApproval: (id: string, approved: boolean) => Promise<void>;
  recordDownload: (doc: ResourceDocument) => Promise<void>;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (category: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;

  courses: CourseProgram[];
  addCourse: (payload: {
    code: string;
    name: string;
    academic_year: string;
    description?: string;
    credits?: number;
  }) => Promise<void>;

  vaultResources: ResourceDocument[];
  members: CampusMember[];

  isLoading: boolean;
  isSchoolSwitching: boolean;
  errorMessage: string | null;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export interface WorkspaceProviderProps {
  children: ReactNode;
  initialSchoolId?: string | null;
  currentUser?: UserProfile | null;
  onNavigateToLanding: () => void;
  onSignOut?: () => void;
}

function mapSchoolRow(row: SchoolRow): SchoolWorkspace {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    code: row.code,
    domain: row.domain,
    country: row.country,
    created_at: row.created_at,
  };
}

function mapResourceRow(row: ResourceRow): ResourceDocument {
  return {
    id: row.id,
    school_id: row.school_id,
    course_id: row.course_id,
    title: row.title,
    description: row.description || "",
    category: row.category,
    course_code: row.course_code,
    course_name: row.course_name,
    academic_year: row.academic_year,
    file_type: row.file_type,
    file_size: row.file_size || "1.2 MB",
    file_path: row.file_path,
    download_url: row.download_url,
    uploaded_by: row.uploaded_by,
    uploaded_by_id: row.uploaded_by_id,
    downloads_count: row.downloads_count || 0,
    target_lecturer: row.target_lecturer,
    target_module: row.target_module,
    approved: row.approved,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapProfileRow(row: ProfileRow): CampusMember {
  return {
    id: row.id,
    school_id: row.school_id,
    name: row.name,
    email: row.email,
    student_id: row.student_id,
    role: row.role,
    academic_year: row.academic_year || "Year 1",
    avatar_url: row.avatar_url,
    created_at: row.created_at,
  };
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({
  children,
  initialSchoolId,
  currentUser = null,
  onNavigateToLanding,
  onSignOut,
}) => {
  const [availableSchools, setAvailableSchools] = useState<SchoolWorkspace[]>([FALLBACK_SCHOOL]);
  const [schoolsLoaded, setSchoolsLoaded] = useState<boolean>(false);
  const [activeSchoolId, setActiveSchoolId] = useState<string>(
    initialSchoolId || DEFAULT_SCHOOL_ID
  );
  const schoolGenRef = useRef<number>(0);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSchoolSwitching, setIsSchoolSwitching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [rawCourses, setRawCourses] = useState<CourseRow[]>([]);
  const [documents, setDocuments] = useState<ResourceDocument[]>([]);
  const [members, setMembers] = useState<CampusMember[]>([]);

  const [selectedDoc, setSelectedDoc] = useState<ResourceDocument | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");

  // Load available schools
  useEffect(() => {
    let active = true;
    fetchSchools()
      .then((rows) => {
        if (!active) return;
        if (rows.length > 0) {
          const mapped = rows.map(mapSchoolRow);
          setAvailableSchools(mapped);
          if (initialSchoolId && mapped.some((s) => s.id === initialSchoolId)) {
            setActiveSchoolId(initialSchoolId);
          } else if (!mapped.some((s) => s.id === activeSchoolId)) {
            setActiveSchoolId(mapped[0].id);
          }
        }
        setSchoolsLoaded(true);
      })
      .catch(() => {
        if (active) setSchoolsLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [initialSchoolId]);

  const loadSchoolData = useCallback(async (schoolId: string, isCurrent: () => boolean) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRawCourses([]);
    setDocuments([]);
    setMembers([]);
    setSelectedDoc(null);
    try {
      const [courseRows, resourceRows, profileRows] = await Promise.all([
        fetchCoursesBySchool(schoolId),
        fetchResourcesBySchool(schoolId),
        fetchProfilesBySchool(schoolId),
      ]);
      if (!isCurrent()) return;
      setRawCourses(courseRows);
      setDocuments(resourceRows.map(mapResourceRow));
      setMembers(profileRows.map(mapProfileRow));
    } catch (err: any) {
      if (!isCurrent()) return;
      console.error("Failed to load workspace data:", err);
      setRawCourses([]);
      setDocuments([]);
      setMembers([]);
      setSelectedDoc(null);
      setErrorMessage("Unable to load campus records. Please try refreshing.");
    } finally {
      if (isCurrent()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    schoolGenRef.current++;
    let current = true;
    loadSchoolData(activeSchoolId, () => current);
    return () => {
      current = false;
    };
  }, [activeSchoolId, loadSchoolData]);

  // Real-time subscriptions scoped to activeSchoolId
  useEffect(() => {
    let current = true;
    const channel = supabase
      .channel(`workspace-${activeSchoolId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resources",
          filter: `school_id=eq.${activeSchoolId}`,
        },
        () => {
          fetchResourcesBySchool(activeSchoolId)
            .then((rows) => {
              if (current) setDocuments(rows.map(mapResourceRow));
            })
            .catch(() => {});
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "courses",
          filter: `school_id=eq.${activeSchoolId}`,
        },
        () => {
          fetchCoursesBySchool(activeSchoolId)
            .then((rows) => {
              if (current) setRawCourses(rows);
            })
            .catch(() => {});
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `school_id=eq.${activeSchoolId}`,
        },
        () => {
          fetchProfilesBySchool(activeSchoolId)
            .then((rows) => {
              if (current) setMembers(rows.map(mapProfileRow));
            })
            .catch(() => {});
        }
      )
      .subscribe();

    return () => {
      current = false;
      supabase.removeChannel(channel);
    };
  }, [activeSchoolId]);

  const matchedSchool = useMemo(() => {
    return availableSchools.find((s) => s.id === activeSchoolId) || null;
  }, [availableSchools, activeSchoolId]);

  const activeSchool = useMemo(() => {
    if (matchedSchool) return matchedSchool;
    if (activeSchoolId === DEFAULT_SCHOOL_ID) return FALLBACK_SCHOOL;
    return {
      ...FALLBACK_SCHOOL,
      id: activeSchoolId,
      name: "Loading campus...",
      code: "---",
      slug: activeSchoolId,
      domain: "",
    };
  }, [matchedSchool, activeSchoolId]);

  const isSchoolReady = Boolean(matchedSchool) && (schoolsLoaded || activeSchoolId === DEFAULT_SCHOOL_ID);

  const switchSchool = (schoolId: string) => {
    if (schoolId === activeSchoolId) return;
    setIsSchoolSwitching(true);
    setSelectedDoc(null);
    setSearchQuery("");
    setSelectedCategoryFilter("All");
    setSelectedStatusFilter("All");
    setActiveSchoolId(schoolId);
    setTimeout(() => setIsSchoolSwitching(false), 200);
  };

  const courses: CourseProgram[] = useMemo(() => {
    return rawCourses.map((c) => ({
      id: c.id,
      school_id: c.school_id,
      code: c.code,
      name: c.name,
      academic_year: c.academic_year,
      description: c.description,
      credits: c.credits ?? 10,
      created_at: c.created_at,
      resourceCount: documents.filter(
        (d) => d.course_id === c.id || d.course_code.toUpperCase() === c.code.toUpperCase()
      ).length,
    }));
  }, [rawCourses, documents]);

  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.course_code.toLowerCase().includes(q) ||
        doc.course_name.toLowerCase().includes(q) ||
        doc.uploaded_by.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategoryFilter === "All" || doc.category === selectedCategoryFilter;

      const matchesStatus =
        selectedStatusFilter === "All" ||
        (selectedStatusFilter === "Verified" && doc.approved) ||
        (selectedStatusFilter === "Under Review" && !doc.approved);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [documents, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

  const vaultResources = useMemo(() => {
    return documents.filter((d) => d.approved);
  }, [documents]);

  const publishDocument: WorkspaceContextValue["publishDocument"] = async (payload) => {
    if (!isSchoolReady) {
      throw new Error("Campus workspace is still loading. Please wait a moment and try again.");
    }
    const targetSchoolId = activeSchool.id;
    const startGen = schoolGenRef.current;

    const { data: authData } = await supabase.auth.getUser();
    const uploaderId = authData.user?.id || currentUser?.id;
    const uploaderName = currentUser?.name || authData.user?.user_metadata?.name || "Faculty Member";

    if (!uploaderId) {
      throw new Error("You must be signed in to publish a document.");
    }

    let finalUrl = payload.download_url?.trim() || "";
    let filePath: string | null = null;
    let fileSize = "1.2 MB";

    if (payload.file) {
      const safeName = payload.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${targetSchoolId}/${uploaderId}/${Date.now()}-${safeName}`;
      const uploaded = await uploadStorageFile("resources", storagePath, payload.file);
      finalUrl = uploaded.publicUrl;
      filePath = uploaded.path;
      const kb = Math.round(payload.file.size / 1024);
      fileSize = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.max(1, kb)} KB`;
    }

    if (!finalUrl) {
      throw new Error("Please attach a file or provide a valid resource URL.");
    }

    const canAutoApprove =
      currentUser?.role === "Lecturer" || currentUser?.role === "Admin";

    let created;
    try {
      created = await createSchoolResource({
        school_id: targetSchoolId,
        course_id: payload.course_id || null,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        course_code: payload.course_code,
        course_name: payload.course_name,
        academic_year: payload.academic_year,
        file_type: payload.file_type,
        file_size: fileSize,
        file_path: filePath,
        download_url: finalUrl,
        uploaded_by: uploaderName,
        uploaded_by_id: uploaderId,
        target_lecturer: payload.target_lecturer || null,
        target_module: payload.target_module || null,
        approved: canAutoApprove,
      });
    } catch (insertErr) {
      if (filePath) {
        await supabase.storage.from("resources").remove([filePath]).catch(() => {});
      }
      throw insertErr;
    }

    if (schoolGenRef.current !== startGen) return;
    const mapped = mapResourceRow(created);
    setDocuments((prev) => [mapped, ...prev.filter((d) => d.id !== mapped.id)]);
    setIsPublishModalOpen(false);
    setSelectedDoc(mapped);
  };

  const toggleDocumentApproval = async (id: string, approved: boolean) => {
    const startGen = schoolGenRef.current;
    const updated = await setResourceApproval(id, approved);
    if (schoolGenRef.current !== startGen) return;
    const mapped = mapResourceRow(updated);
    setDocuments((prev) => prev.map((d) => (d.id === id ? mapped : d)));
    setSelectedDoc((prev) => (prev && prev.id === id ? mapped : prev));
  };

  const recordDownload = async (doc: ResourceDocument) => {
    if (doc.download_url) {
      window.open(doc.download_url, "_blank", "noopener,noreferrer");
    }
    try {
      await incrementResourceDownloadCount(doc.id);
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, downloads_count: d.downloads_count + 1 } : d
        )
      );
    } catch (err) {
      console.warn("Could not increment download count:", err);
    }
  };

  const addCourse: WorkspaceContextValue["addCourse"] = async (payload) => {
    if (!isSchoolReady) {
      throw new Error("Campus workspace is still loading. Please wait a moment and try again.");
    }
    const targetSchoolId = activeSchool.id;
    const startGen = schoolGenRef.current;
    const created = await createCourse({
      school_id: targetSchoolId,
      code: payload.code,
      name: payload.name,
      academic_year: payload.academic_year,
      description: payload.description,
      credits: payload.credits,
    });
    if (schoolGenRef.current !== startGen) return;
    setRawCourses((prev) => [...prev.filter((c) => c.id !== created.id), created]);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentUser,
        activeSchool,
        availableSchools,
        switchSchool,
        activeTab,
        setActiveTab,
        onNavigateToLanding,
        onSignOut,
        documents,
        filteredDocuments,
        selectedDoc,
        setSelectedDoc,
        isPublishModalOpen,
        setIsPublishModalOpen,
        publishDocument,
        toggleDocumentApproval,
        recordDownload,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedStatusFilter,
        setSelectedStatusFilter,
        courses,
        addCourse,
        vaultResources,
        members,
        isLoading,
        isSchoolSwitching,
        errorMessage,
      }}
    >
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
