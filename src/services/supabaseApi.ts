import { supabase } from "../supabaseClient";
import type { Database } from "../types/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ResourceRow = Database["public"]["Tables"]["resources"]["Row"];
export type AssignmentRow = Database["public"]["Tables"]["assignments"]["Row"];
export type SubmissionRow = Database["public"]["Tables"]["assignment_submissions"]["Row"];
export type ForumPostRow = Database["public"]["Tables"]["forum_posts"]["Row"];
export type AttendanceSessionRow = Database["public"]["Tables"]["attendance_sessions"]["Row"];

/**
 * Upload an image or file to Supabase Storage with automatic MIME & path partitioning
 */
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
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    publicUrl: publicUrlData.publicUrl,
    path: data.path,
  };
}

/**
 * Fetch current user profile with institutional school details
 */
export async function getCurrentUserProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data;
}

/**
 * Fetch verified academic resources for student's school and year level
 */
export async function getVerifiedResources(schoolId?: string, academicYear?: string) {
  let query = supabase
    .from("resources")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (schoolId) query = query.eq("school_id", schoolId);
  if (academicYear && academicYear !== "All Years") query = query.eq("academic_year", academicYear);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Record student lecture attendance with passcode validation
 */
export async function recordAttendanceCheckIn(
  sessionId: string,
  studentId: string,
  studentName: string,
  studentIdentifier: string,
  coordinates?: { latitude?: number; longitude?: number }
) {
  const { data, error } = await supabase
    .from("attendance_logs")
    .insert({
      session_id: sessionId,
      student_id: studentId,
      student_name: studentName,
      student_identifier: studentIdentifier,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
