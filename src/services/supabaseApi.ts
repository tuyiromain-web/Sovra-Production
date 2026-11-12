import { supabase } from "../supabaseClient";
import type {
  StudyResource,
  Assignment,
  ForumPost,
  AttendanceSession,
  AppNotification,
  UserRole
} from "../types";

export interface ProfileRow {
  id: string;
  school_id: string | null;
  name: string;
  email: string;
  student_id: string;
  role: UserRole;
  academic_year: string;
  avatar_url: string | null;
  avatar_theme: string;
  level: number;
  xp: number;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_SCHOOL_ID = "00000000-0000-0000-0000-000000000001";

// ==============================================================================
// 1. STORAGE HELPER
// ==============================================================================
export async function uploadStorageFile(
  bucket: "avatars" | "resources" | "assignments" | "ai-attachments",
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string }
): Promise<{ publicUrl: string; path: string }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: options?.upsert ?? true,
      contentType: options?.contentType ?? file.type,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    publicUrl: publicUrlData.publicUrl,
    path: data.path,
  };
}

// ==============================================================================
// 2. PROFILES & USERS
// ==============================================================================
export async function getCurrentUserProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await (supabase.from("profiles") as any)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data as ProfileRow;
}

export async function fetchAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await (supabase.from("profiles") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all profiles:", error);
    return [];
  }
  return (data || []) as ProfileRow[];
}

export async function updateUserProfile(userId: string, updates: Partial<ProfileRow>): Promise<ProfileRow | null> {
  const { data, error } = await (supabase.from("profiles") as any)
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
  return data as ProfileRow;
}

// ==============================================================================
// 3. STUDY RESOURCES
// ==============================================================================
export async function fetchAllResources(): Promise<StudyResource[]> {
  const { data, error } = await (supabase.from("resources") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    courseCode: row.course_code,
    courseName: row.course_name,
    academicYear: row.academic_year,
    fileType: row.file_type,
    fileSize: row.file_size || "1.2 MB",
    downloadUrl: row.download_url,
    uploadedBy: row.uploaded_by,
    uploadedById: row.uploaded_by_id,
    uploadedAt: row.created_at,
    downloadsCount: row.downloads_count || 0,
    targetLecturer: row.target_lecturer || undefined,
    targetModule: row.target_module || undefined,
    approved: row.approved,
  }));
}

export async function createResource(newRes: Omit<StudyResource, "id" | "downloadsCount">): Promise<StudyResource | null> {
  const { data, error } = await (supabase.from("resources") as any)
    .insert({
      school_id: DEFAULT_SCHOOL_ID,
      title: newRes.title,
      description: newRes.description,
      category: newRes.category,
      course_code: newRes.courseCode,
      course_name: newRes.courseName,
      academic_year: newRes.academicYear,
      file_type: newRes.fileType,
      file_size: newRes.fileSize || "1.2 MB",
      download_url: newRes.downloadUrl,
      uploaded_by: newRes.uploadedBy,
      uploaded_by_id: newRes.uploadedById,
      target_lecturer: newRes.targetLecturer || null,
      target_module: newRes.targetModule || null,
      approved: newRes.approved ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating resource:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    courseCode: data.course_code,
    courseName: data.course_name,
    academicYear: data.academic_year,
    fileType: data.file_type,
    fileSize: data.file_size || "1.2 MB",
    downloadUrl: data.download_url,
    uploadedBy: data.uploaded_by,
    uploadedById: data.uploaded_by_id,
    uploadedAt: data.created_at,
    downloadsCount: data.downloads_count || 0,
    targetLecturer: data.target_lecturer || undefined,
    targetModule: data.target_module || undefined,
    approved: data.approved,
  };
}

export async function approveResource(id: string): Promise<boolean> {
  const { error } = await (supabase.from("resources") as any)
    .update({ approved: true })
    .eq("id", id);

  if (error) {
    console.error("Error approving resource:", error);
    return false;
  }
  return true;
}

export async function incrementResourceDownloadCount(id: string): Promise<void> {
  const { data } = await (supabase.from("resources") as any).select("downloads_count").eq("id", id).single();
  if (data) {
    await (supabase.from("resources") as any).update({ downloads_count: (data.downloads_count || 0) + 1 }).eq("id", id);
  }
}

// ==============================================================================
// 4. ASSIGNMENTS & SUBMISSIONS
// ==============================================================================
export async function fetchAllAssignments(): Promise<Assignment[]> {
  const { data: assignments, error: assignError } = await (supabase.from("assignments") as any)
    .select("*")
    .order("due_date", { ascending: true });

  if (assignError) {
    console.error("Error fetching assignments:", assignError);
    return [];
  }

  const { data: submissions, error: subError } = await (supabase.from("assignment_submissions") as any)
    .select("*");

  if (subError) {
    console.error("Error fetching submissions:", subError);
  }

  const subMap: Record<string, Assignment["submissions"]> = {};
  (submissions || []).forEach((sub: any) => {
    if (!subMap[sub.assignment_id]) {
      subMap[sub.assignment_id] = {};
    }
    subMap[sub.assignment_id][sub.student_identifier] = {
      fileName: sub.file_name,
      fileUrl: sub.file_url,
      submittedAt: sub.submitted_at,
      grade: sub.grade || undefined,
      feedback: sub.feedback || undefined,
    };
  });

  return (assignments || []).map((a: any) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    courseCode: a.course_code,
    courseName: a.course_name,
    dueDate: a.due_date,
    points: a.points,
    uploadedBy: a.uploaded_by,
    academicYear: a.academic_year,
    submissions: subMap[a.id] || {},
  }));
}

export async function createAssignment(assignment: {
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  dueDate: string;
  points: number;
  uploadedBy: string;
  lecturerId?: string;
  academicYear: string;
}): Promise<Assignment | null> {
  const { data, error } = await (supabase.from("assignments") as any)
    .insert({
      school_id: DEFAULT_SCHOOL_ID,
      title: assignment.title,
      description: assignment.description,
      course_code: assignment.courseCode,
      course_name: assignment.courseName,
      due_date: assignment.dueDate,
      points: assignment.points,
      uploaded_by: assignment.uploadedBy,
      lecturer_id: assignment.lecturerId || null,
      academic_year: assignment.academicYear,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating assignment:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    courseCode: data.course_code,
    courseName: data.course_name,
    dueDate: data.due_date,
    points: data.points,
    uploadedBy: data.uploaded_by,
    academicYear: data.academic_year,
    submissions: {},
  };
}

export async function submitAssignmentFile(
  assignmentId: string,
  studentProfileId: string,
  studentIdentifier: string,
  submission: { fileName: string; fileUrl: string; onlineNote?: string }
): Promise<boolean> {
  const { error } = await (supabase.from("assignment_submissions") as any)
    .upsert(
      {
        assignment_id: assignmentId,
        student_id: studentProfileId,
        student_identifier: studentIdentifier,
        file_name: submission.fileName,
        file_url: submission.fileUrl,
        online_note: submission.onlineNote || null,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "assignment_id,student_id" }
    );

  if (error) {
    console.error("Error submitting assignment:", error);
    throw error;
  }
  return true;
}

export async function gradeStudentSubmission(
  assignmentId: string,
  studentIdentifier: string,
  grade: string,
  feedback: string
): Promise<boolean> {
  const { error } = await (supabase.from("assignment_submissions") as any)
    .update({
      grade,
      feedback,
      graded_at: new Date().toISOString(),
    })
    .eq("assignment_id", assignmentId)
    .eq("student_identifier", studentIdentifier);

  if (error) {
    console.error("Error grading submission:", error);
    return false;
  }
  return true;
}

// ==============================================================================
// 5. DISCUSSION FORUM
// ==============================================================================
export async function fetchAllForumPosts(): Promise<ForumPost[]> {
  const { data: posts, error: postsError } = await (supabase.from("forum_posts") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching forum posts:", postsError);
    return [];
  }

  const { data: replies, error: repliesError } = await (supabase.from("forum_replies") as any)
    .select("*")
    .order("created_at", { ascending: true });

  if (repliesError) {
    console.error("Error fetching forum replies:", repliesError);
  }

  const replyMap: Record<string, ForumPost["replies"]> = {};
  (replies || []).forEach((r: any) => {
    if (!replyMap[r.post_id]) replyMap[r.post_id] = [];
    replyMap[r.post_id].push({
      id: r.id,
      content: r.content,
      authorName: r.author_name,
      authorRole: r.author_role,
      authorId: r.author_id,
      createdAt: r.created_at,
    });
  });

  return (posts || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    category: p.category as any,
    authorName: p.author_name,
    authorRole: p.author_role,
    authorId: p.author_id,
    createdAt: p.created_at,
    upvotes: p.upvotes || 0,
    replies: replyMap[p.id] || [],
    isPinned: p.is_pinned,
  }));
}

export async function createForumPost(newPost: {
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
}): Promise<ForumPost | null> {
  const { data, error } = await (supabase.from("forum_posts") as any)
    .insert({
      school_id: DEFAULT_SCHOOL_ID,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author_id: newPost.authorId,
      author_name: newPost.authorName,
      author_role: newPost.authorRole,
      upvotes: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating forum post:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category as any,
    authorName: data.author_name,
    authorRole: data.author_role,
    authorId: data.author_id,
    createdAt: data.created_at,
    upvotes: data.upvotes || 0,
    replies: [],
    isPinned: data.is_pinned,
  };
}

export async function createForumReply(postId: string, reply: {
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
}) {
  const { data, error } = await (supabase.from("forum_replies") as any)
    .insert({
      post_id: postId,
      content: reply.content,
      author_id: reply.authorId,
      author_name: reply.authorName,
      author_role: reply.authorRole,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
  return data;
}

export async function upvotePost(postId: string): Promise<void> {
  const { data } = await (supabase.from("forum_posts") as any).select("upvotes").eq("id", postId).single();
  if (data) {
    await (supabase.from("forum_posts") as any).update({ upvotes: (data.upvotes || 0) + 1 }).eq("id", postId);
  }
}

// ==============================================================================
// 6. ATTENDANCE SESSIONS & LOGS
// ==============================================================================
export async function fetchAllAttendanceSessions(): Promise<AttendanceSession[]> {
  const { data: sessions, error: sessError } = await (supabase.from("attendance_sessions") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (sessError) {
    console.error("Error fetching attendance sessions:", sessError);
    return [];
  }

  const { data: logs, error: logsError } = await (supabase.from("attendance_logs") as any)
    .select("*");

  if (logsError) {
    console.error("Error fetching attendance logs:", logsError);
  }

  const logsMap: Record<string, AttendanceSession["checkedInStudents"]> = {};
  (logs || []).forEach((log: any) => {
    if (!logsMap[log.session_id]) logsMap[log.session_id] = {};
    logsMap[log.session_id][log.student_identifier] = {
      studentName: log.student_name,
      checkedInAt: log.verified_at,
      locationMethod: "Simulated Geofence",
    };
  });

  return (sessions || []).map((s: any) => ({
    id: s.id,
    courseCode: s.course_code,
    courseName: s.course_name,
    date: (s.created_at || new Date().toISOString()).split("T")[0],
    timeSlot: s.time_slot,
    passcode: s.passcode,
    isActive: s.is_active,
    academicYear: s.academic_year,
    approved: s.verified_by_lecturer,
    requestedBy: s.created_by_name,
    checkedInStudents: logsMap[s.id] || {},
  }));
}

export async function createAttendanceSessionRecord(newSess: {
  courseCode: string;
  courseName: string;
  timeSlot: string;
  passcode: string;
  academicYear: string;
  createdBy: string;
  createdByName: string;
  isActive: boolean;
  verifiedByLecturer: boolean;
}): Promise<AttendanceSession | null> {
  const { data, error } = await (supabase.from("attendance_sessions") as any)
    .insert({
      school_id: DEFAULT_SCHOOL_ID,
      course_code: newSess.courseCode,
      course_name: newSess.courseName,
      time_slot: newSess.timeSlot,
      passcode: newSess.passcode,
      academic_year: newSess.academicYear,
      is_active: newSess.isActive,
      created_by: newSess.createdBy,
      created_by_name: newSess.createdByName,
      verified_by_lecturer: newSess.verifiedByLecturer,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating attendance session:", error);
    throw error;
  }

  return {
    id: data.id,
    courseCode: data.course_code,
    courseName: data.course_name,
    date: (data.created_at || new Date().toISOString()).split("T")[0],
    timeSlot: data.time_slot,
    passcode: data.passcode,
    isActive: data.is_active,
    academicYear: data.academic_year,
    approved: data.verified_by_lecturer,
    requestedBy: data.created_by_name,
    checkedInStudents: {},
  };
}

export async function approveAttendanceSession(sessionId: string): Promise<boolean> {
  const { error } = await (supabase.from("attendance_sessions") as any)
    .update({
      verified_by_lecturer: true,
      is_active: true,
      verified_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    console.error("Error approving attendance session:", error);
    return false;
  }
  return true;
}

export async function checkInStudentAttendance(
  sessionId: string,
  studentProfileId: string,
  studentName: string,
  studentIdentifier: string,
  coordinates?: { latitude?: number; longitude?: number }
): Promise<boolean> {
  const { error } = await (supabase.from("attendance_logs") as any)
    .insert({
      session_id: sessionId,
      student_id: studentProfileId,
      student_name: studentName,
      student_identifier: studentIdentifier,
      latitude: coordinates?.latitude || null,
      longitude: coordinates?.longitude || null,
      verified_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error checking in attendance:", error);
    throw error;
  }
  return true;
}

// ==============================================================================
// 7. NOTIFICATIONS
// ==============================================================================
export async function fetchAllNotifications(): Promise<AppNotification[]> {
  const { data, error } = await (supabase.from("notifications") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return (data || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    isRead: n.is_read,
    createdAt: n.created_at,
    targetRole: n.target_role || undefined,
    targetLecturer: n.target_lecturer || undefined,
    targetModule: n.target_module || undefined,
  }));
}

export async function createNotificationRecord(notif: {
  title: string;
  message: string;
  type: AppNotification["type"];
  userId?: string;
  targetRole?: string;
  targetLecturer?: string;
  targetModule?: string;
}): Promise<AppNotification | null> {
  const { data, error } = await (supabase.from("notifications") as any)
    .insert({
      school_id: DEFAULT_SCHOOL_ID,
      user_id: notif.userId || null,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      is_read: false,
      target_role: notif.targetRole || null,
      target_lecturer: notif.targetLecturer || null,
      target_module: notif.targetModule || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    message: data.message,
    type: data.type,
    isRead: data.is_read,
    createdAt: data.created_at,
    targetRole: data.target_role || undefined,
    targetLecturer: data.target_lecturer || undefined,
    targetModule: data.target_module || undefined,
  };
}

export async function markNotificationAsReadInDb(notificationId: string): Promise<void> {
  await (supabase.from("notifications") as any).update({ is_read: true }).eq("id", notificationId);
}

export async function markAllNotificationsAsReadInDb(): Promise<void> {
  await (supabase.from("notifications") as any).update({ is_read: true }).eq("is_read", false);
}
