export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "Student" | "Class Representative" | "Lecturer" | "Admin";
export type ResourceCategory = "Notes" | "Past Paper" | "Reference Book" | "Lab Report" | "Syllabus";
export type ResourceFileType = "pdf" | "pptx" | "docx" | "link";
export type NotificationType = "announcement" | "assignment" | "grade" | "attendance" | "forum";

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          code: string;
          domain: string | null;
          logo_url: string | null;
          banner_url: string | null;
          country: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          code: string;
          domain?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          code?: string;
          domain?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          school_id?: string | null;
          name: string;
          email: string;
          student_id: string;
          role?: UserRole;
          academic_year?: string;
          avatar_url?: string | null;
          avatar_theme?: string;
          level?: number;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string | null;
          name?: string;
          email?: string;
          student_id?: string;
          role?: UserRole;
          academic_year?: string;
          avatar_url?: string | null;
          avatar_theme?: string;
          level?: number;
          xp?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          school_id: string;
          code: string;
          name: string;
          academic_year: string;
          description: string | null;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          code: string;
          name: string;
          academic_year: string;
          description?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          code?: string;
          name?: string;
          academic_year?: string;
          description?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
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
          file_size: string | null;
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
        };
        Insert: {
          id?: string;
          school_id: string;
          course_id?: string | null;
          title: string;
          description?: string;
          category?: ResourceCategory;
          course_code: string;
          course_name: string;
          academic_year: string;
          file_type?: ResourceFileType;
          file_size?: string | null;
          file_path?: string | null;
          download_url: string;
          uploaded_by: string;
          uploaded_by_id: string;
          downloads_count?: number;
          target_lecturer?: string | null;
          target_module?: string | null;
          approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          course_id?: string | null;
          title?: string;
          description?: string;
          category?: ResourceCategory;
          course_code?: string;
          course_name?: string;
          academic_year?: string;
          file_type?: ResourceFileType;
          file_size?: string | null;
          file_path?: string | null;
          download_url?: string;
          uploaded_by?: string;
          uploaded_by_id?: string;
          downloads_count?: number;
          target_lecturer?: string | null;
          target_module?: string | null;
          approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          school_id: string;
          course_id: string | null;
          title: string;
          description: string;
          course_code: string;
          course_name: string;
          due_date: string;
          points: number;
          uploaded_by: string;
          lecturer_id: string | null;
          academic_year: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          course_id?: string | null;
          title: string;
          description: string;
          course_code: string;
          course_name: string;
          due_date: string;
          points?: number;
          uploaded_by: string;
          lecturer_id?: string | null;
          academic_year: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          course_id?: string | null;
          title?: string;
          description?: string;
          course_code?: string;
          course_name?: string;
          due_date?: string;
          points?: number;
          uploaded_by?: string;
          lecturer_id?: string | null;
          academic_year?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      assignment_submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          student_identifier: string;
          file_url: string;
          file_path: string | null;
          file_name: string;
          online_note: string | null;
          submitted_at: string;
          grade: string | null;
          feedback: string | null;
          graded_at: string | null;
          graded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          student_identifier: string;
          file_url: string;
          file_path?: string | null;
          file_name: string;
          online_note?: string | null;
          submitted_at?: string;
          grade?: string | null;
          feedback?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_id?: string;
          student_identifier?: string;
          file_url?: string;
          file_path?: string | null;
          file_name?: string;
          online_note?: string | null;
          submitted_at?: string;
          grade?: string | null;
          feedback?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          school_id: string;
          title: string;
          content: string;
          category: string;
          author_id: string;
          author_name: string;
          author_role: UserRole;
          upvotes: number;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          title: string;
          content: string;
          category?: string;
          author_id: string;
          author_name: string;
          author_role?: UserRole;
          upvotes?: number;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          title?: string;
          content?: string;
          category?: string;
          author_id?: string;
          author_name?: string;
          author_role?: UserRole;
          upvotes?: number;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      forum_replies: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          author_name: string;
          author_role: UserRole;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          author_name: string;
          author_role?: UserRole;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          author_name?: string;
          author_role?: UserRole;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance_sessions: {
        Row: {
          id: string;
          school_id: string;
          course_code: string;
          course_name: string;
          time_slot: string;
          passcode: string;
          academic_year: string;
          is_active: boolean;
          created_by: string;
          created_by_name: string;
          verified_by_lecturer: boolean;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          course_code: string;
          course_name: string;
          time_slot: string;
          passcode: string;
          academic_year: string;
          is_active?: boolean;
          created_by: string;
          created_by_name: string;
          verified_by_lecturer?: boolean;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          course_code?: string;
          course_name?: string;
          time_slot?: string;
          passcode?: string;
          academic_year?: string;
          is_active?: boolean;
          created_by?: string;
          created_by_name?: string;
          verified_by_lecturer?: boolean;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance_logs: {
        Row: {
          id: string;
          session_id: string;
          student_id: string;
          student_name: string;
          student_identifier: string;
          verified_at: string;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          student_id: string;
          student_name: string;
          student_identifier: string;
          verified_at?: string;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          student_id?: string;
          student_name?: string;
          student_identifier?: string;
          verified_at?: string;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          school_id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: NotificationType;
          is_read: boolean;
          target_role: string | null;
          target_lecturer: string | null;
          target_module: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          user_id?: string | null;
          title: string;
          message: string;
          type?: NotificationType;
          is_read?: boolean;
          target_role?: string | null;
          target_lecturer?: string | null;
          target_module?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: NotificationType;
          is_read?: boolean;
          target_role?: string | null;
          target_lecturer?: string | null;
          target_module?: string | null;
          created_at?: string;
        };
      };
      ai_chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          mode: string;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          mode?: string;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          mode?: string;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_chat_messages: {
        Row: {
          id: string;
          session_id: string;
          sender: "user" | "ai";
          text: string;
          mode: string | null;
          thinking_mode: string | null;
          grounding_chunks: Json;
          web_search_queries: Json;
          attached_files: Json;
          attached_images: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          sender: "user" | "ai";
          text: string;
          mode?: string | null;
          thinking_mode?: string | null;
          grounding_chunks?: Json;
          web_search_queries?: Json;
          attached_files?: Json;
          attached_images?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          sender?: "user" | "ai";
          text?: string;
          mode?: string | null;
          thinking_mode?: string | null;
          grounding_chunks?: Json;
          web_search_queries?: Json;
          attached_files?: Json;
          attached_images?: Json;
          created_at?: string;
        };
      };
    };
  };
}
