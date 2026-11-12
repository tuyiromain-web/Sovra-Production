-- ==============================================================================
-- SOVRA PRODUCTION SCHEMA - MIGRATION 001
-- Multi-Tenant Educational Workspaces, Core Domain Entities & Audit Timestamps
-- ==============================================================================

-- 1. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Generic updated_at timestamp trigger function with fixed search_path (Security Hardening)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. SCHOOLS / INSTITUTIONS (Multi-Tenant Root Workspace)
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  domain TEXT, -- e.g. "ines.ac.rw"
  logo_url TEXT,
  banner_url TEXT,
  country TEXT DEFAULT 'Rwanda',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Default institutional workspace for Sovra
INSERT INTO public.schools (id, name, slug, code, domain, country)
VALUES ('00000000-0000-0000-0000-000000000001', 'INES-Ruhengeri', 'ines-ruhengeri', 'INES', 'ines.ac.rw', 'Rwanda')
ON CONFLICT (slug) DO NOTHING;

-- 3. PROFILES (Extends auth.users with RBAC and Institutional Workspace linkage)
CREATE TYPE public.user_role AS ENUM ('Student', 'Class Representative', 'Lecturer', 'Admin');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  student_id TEXT NOT NULL, -- e.g., "std-1102", "LEC-405", "ADM-001"
  role public.user_role NOT NULL DEFAULT 'Student',
  academic_year TEXT DEFAULT 'Year 1', -- e.g., "Year 1", "Year 2", "Year 3", "Year 4", "All Years"
  avatar_url TEXT,
  avatar_theme TEXT DEFAULT 'General Apothecary',
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-provision profile on Supabase auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_school_id UUID;
  v_role public.user_role := 'Student';
  v_role_text TEXT;
BEGIN
  -- Identify default school if exists
  SELECT id INTO v_school_id FROM public.schools WHERE slug = 'ines-ruhengeri' LIMIT 1;
  IF v_school_id IS NULL THEN
    SELECT id INTO v_school_id FROM public.schools ORDER BY created_at ASC LIMIT 1;
  END IF;

  v_role_text := NEW.raw_user_meta_data->>'role';
  IF v_role_text IN ('Student', 'Class Representative', 'Lecturer', 'Admin') THEN
    v_role := v_role_text::public.user_role;
  END IF;

  INSERT INTO public.profiles (
    id,
    school_id,
    name,
    email,
    student_id,
    role,
    academic_year,
    avatar_url
  ) VALUES (
    NEW.id,
    v_school_id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'studentId', 'STD-' || substr(md5(random()::text), 1, 6)),
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'academicYear', 'Year 1'),
    NEW.raw_user_meta_data->>'avatarUrl'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    academic_year = EXCLUDED.academic_year;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. COURSES / MODULES
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- e.g., "PHA 211"
  name TEXT NOT NULL, -- e.g., "Pharmacology I"
  academic_year TEXT NOT NULL, -- "Year 2"
  description TEXT,
  credits INT DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(school_id, code)
);

CREATE TRIGGER set_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. STUDY RESOURCES & CURATED MATERIALS
CREATE TYPE public.resource_category AS ENUM ('Notes', 'Past Paper', 'Reference Book', 'Lab Report', 'Syllabus');
CREATE TYPE public.resource_file_type AS ENUM ('pdf', 'pptx', 'docx', 'link');

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category public.resource_category NOT NULL DEFAULT 'Notes',
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  file_type public.resource_file_type NOT NULL DEFAULT 'pdf',
  file_size TEXT DEFAULT '1.2 MB',
  file_path TEXT, -- Storage bucket object path
  download_url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_by_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  downloads_count INT NOT NULL DEFAULT 0,
  target_lecturer TEXT,
  target_module TEXT,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. ASSIGNMENTS & HOMEWORK SPECIFICATIONS
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  points INT NOT NULL DEFAULT 100,
  uploaded_by TEXT NOT NULL,
  lecturer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. ASSIGNMENT SUBMISSIONS (Relational M:N mapping)
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_identifier TEXT NOT NULL, -- e.g., "std-1102"
  file_url TEXT NOT NULL,
  file_path TEXT,
  file_name TEXT NOT NULL,
  online_note TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  grade TEXT,
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE TRIGGER set_assignment_submissions_updated_at
  BEFORE UPDATE ON public.assignment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 8. DISCUSSION FORUMS (Posts & Nested Threaded Replies)
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role public.user_role NOT NULL DEFAULT 'Student',
  upvotes INT NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role public.user_role NOT NULL DEFAULT 'Student',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_forum_replies_updated_at
  BEFORE UPDATE ON public.forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Forum Post Upvotes tracking table (prevents double upvoting)
CREATE TABLE IF NOT EXISTS public.forum_upvotes (
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- 9. ATTENDANCE SESSIONS & ATTENDANCE LOGS
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  passcode TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_by_name TEXT NOT NULL,
  verified_by_lecturer BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_attendance_sessions_updated_at
  BEFORE UPDATE ON public.attendance_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_identifier TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- 10. NOTIFICATIONS & BROADCASTS
CREATE TYPE public.notification_type AS ENUM ('announcement', 'assignment', 'grade', 'attendance', 'forum');

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL means global school broadcast
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type public.notification_type NOT NULL DEFAULT 'announcement',
  is_read BOOLEAN NOT NULL DEFAULT false,
  target_role TEXT,
  target_lecturer TEXT,
  target_module TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AI CHAT SESSIONS & MESSAGES (Sovra AI Research Copilot Persistence)
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Academic Session',
  mode TEXT NOT NULL DEFAULT 'universal',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_ai_chat_sessions_updated_at
  BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  text TEXT NOT NULL,
  mode TEXT,
  thinking_mode TEXT,
  grounding_chunks JSONB DEFAULT '[]'::jsonb,
  web_search_queries JSONB DEFAULT '[]'::jsonb,
  attached_files JSONB DEFAULT '[]'::jsonb,
  attached_images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- COMPOSITE INDEXES FOR HIGH-THROUGHPUT QUERY PATTERNS & FOREIGN KEYS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_school_role ON public.profiles(school_id, role);
CREATE INDEX IF NOT EXISTS idx_resources_school_year ON public.resources(school_id, academic_year, approved);
CREATE INDEX IF NOT EXISTS idx_resources_course ON public.resources(course_code);
CREATE INDEX IF NOT EXISTS idx_assignments_school_due ON public.assignments(school_id, due_date DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.assignment_submissions(assignment_id, student_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_school ON public.forum_posts(school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON public.forum_replies(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_attendance_active ON public.attendance_sessions(school_id, is_active, academic_year);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_session ON public.attendance_logs(session_id, student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_session ON public.ai_chat_messages(session_id, created_at ASC);
