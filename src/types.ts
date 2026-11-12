/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Student" | "Class Representative" | "Lecturer" | "Admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  role: UserRole;
  academicYear: string; // e.g., "Year 1", "Year 2", "Year 3", "Year 4"
  avatarUrl?: string;
  level?: number;
  xp?: number;
  joinedAt?: string;
}

export interface StudyResource {
  id: string;
  title: string;
  description: string;
  category: "Notes" | "Past Paper" | "Reference Book" | "Lab Report" | "Syllabus";
  courseCode: string; // e.g., "PHA 211"
  courseName: string; // e.g., "Pharmacology I"
  academicYear: string; // "Year 1", "Year 2", etc.
  fileType: "pdf" | "pptx" | "docx" | "link";
  fileSize?: string;
  downloadUrl: string;
  uploadedBy: string; // User Name
  uploadedById: string;
  uploadedAt: string;
  downloadsCount: number;
  targetLecturer?: string; // targeted lecturer directory
  targetModule?: string;   // targeted module folder
  approved?: boolean;      // pending lecturer approval
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  dueDate: string;
  points: number;
  uploadedBy: string; // Lecturer name
  academicYear: string;
  submissions: {
    [studentId: string]: {
      fileUrl: string;
      fileName: string;
      submittedAt: string;
      grade?: string;
      feedback?: string;
    };
  };
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: "Pharmacology" | "Pharmaceutics" | "Medicinal Chemistry" | "Pharmacognosy" | "General";
  authorName: string;
  authorRole: UserRole;
  authorId: string;
  createdAt: string;
  upvotes: number;
  replies: ForumReply[];
  isPinned?: boolean;
}

export interface ForumReply {
  id: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  authorId: string;
  createdAt: string;
}

export interface AttendanceSession {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  timeSlot: string; // e.g., "08:00 - 10:00"
  passcode: string; // e.g., "PHA123" for verification
  isActive: boolean;
  academicYear: string;
  approved?: boolean;      // pending lecturer approval
  requestedBy?: string;    // user who requested the session
  checkedInStudents: {
    [studentId: string]: {
      studentName: string;
      checkedInAt: string;
      locationMethod: "Simulated Geofence" | "On-Campus Wi-Fi";
    };
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "announcement" | "assignment" | "attendance" | "forum" | "grade";
  isRead: boolean;
  createdAt: string;
  targetRole?: UserRole | "All";
  targetLecturer?: string; // targeted lecturer directory
  targetModule?: string;   // targeted module folder
}

export interface ScheduleEvent {
  id: string;
  courseCode: string;
  courseName: string;
  lecturerName: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  time: string; // e.g., "10:00 - 12:00"
  room: string; // e.g., "Lab 3", "Room 102"
}
