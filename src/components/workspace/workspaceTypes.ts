/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WorkspaceTab = "overview" | "programs" | "documents" | "vault" | "students";

export type DocCategory = 
  | "Syllabus" 
  | "Accreditation Record" 
  | "Curriculum Framework" 
  | "Lecture Packet";

export type ApprovalStatus = "Verified" | "Under Review" | "Archived";

export interface InstitutionTenant {
  id: string;
  name: string;
  code: string;
  domain: string;
  accreditationBody: string;
  isolatedPartitionKey: string;
  totalStudents: string;
  activeFaculty: string;
  facultyDocsCount: string;
  coverageMetric: string;
  term: string;
}

export interface FacultyDocument {
  id: string;
  title: string;
  code: string;
  programId: string;
  programName: string;
  category: DocCategory;
  version: string;
  author: string;
  authorRole: string;
  status: ApprovalStatus;
  updatedAt: string;
  summary: string;
  learningObjectives: string[];
  creditHours: number;
  prerequisites: string[];
  accreditationAlignment: string;
  fileSize: string;
  hash: string;
}

export interface AcademicProgram {
  id: string;
  name: string;
  code: string;
  department: string;
  dean: string;
  degreeType: string;
  duration: string;
  enrolledStudents: number;
  totalModules: number;
  documentationCoverage: number;
  sharedResourcesCount: number;
  accessTier: string;
}

export interface VaultResource {
  id: string;
  title: string;
  moduleCode: string;
  programName: string;
  format: "PDF" | "DOCX" | "SLIDES" | "LAB";
  lecturer: string;
  downloadsCount: number;
  fileSize: string;
  hash: string;
  publishedDate: string;
}

export interface StudentCohort {
  id: string;
  cohortCode: string;
  program: string;
  year: string;
  studentCount: number;
  representative: string;
  attendanceRate: string;
  lastActive: string;
}
