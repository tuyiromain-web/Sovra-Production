/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UserRole } from "../../types";

export type WorkspaceTab = "overview" | "programs" | "documents" | "vault" | "students";

export type ResourceCategory =
  | "Notes"
  | "Past Paper"
  | "Reference Book"
  | "Lab Report"
  | "Syllabus";

export type ResourceFileType = "pdf" | "pptx" | "docx" | "link";

/** Maps 1:1 to public.schools */
export interface SchoolWorkspace {
  id: string;
  name: string;
  slug: string;
  code: string;
  domain: string | null;
  country: string | null;
  created_at: string;
}

/** Maps 1:1 to public.courses */
export interface CourseProgram {
  id: string;
  school_id: string;
  code: string;
  name: string;
  academic_year: string;
  description: string | null;
  credits: number;
  created_at: string;
  resourceCount: number;
}

/** Maps 1:1 to public.resources */
export interface ResourceDocument {
  id: string;
  school_id: string;
  course_id: string | null;
  title: string;
  description: string;
  category: ResourceCategory;
  course_code: string;
  course_name: string;
  academic_year: string;
  file_type: ResourceFileType;
  file_size: string;
  file_path: string | null;
  download_url: string;
  uploaded_by: string;
  uploaded_by_id: string;
  downloads_count: number;
  target_lecturer: string | null;
  target_module: string | null;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

/** Maps 1:1 to public.profiles */
export interface CampusMember {
  id: string;
  school_id: string | null;
  name: string;
  email: string;
  student_id: string;
  role: UserRole;
  academic_year: string;
  avatar_url: string | null;
  created_at: string;
}
