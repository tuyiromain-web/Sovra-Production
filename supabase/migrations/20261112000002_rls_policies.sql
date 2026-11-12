-- ==============================================================================
-- SOVRA PRODUCTION SCHEMA - MIGRATION 002
-- Row Level Security (RLS) & Multi-Tenant Access Policies
-- Best Practice: (select auth.uid()) optimization to prevent per-row re-evaluation
-- ==============================================================================

-- Helper Security Definer to fetch the current authenticated user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = (SELECT auth.uid());
$$;

-- Helper Security Definer to fetch the current authenticated user's school_id
CREATE OR REPLACE FUNCTION public.get_current_user_school_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT school_id FROM public.profiles WHERE id = (SELECT auth.uid());
$$;

-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- 2. SCHOOLS POLICIES
CREATE POLICY "Schools are viewable by all authenticated users"
  ON public.schools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Schools manageable by Admin only"
  ON public.schools FOR ALL
  TO authenticated
  USING (public.get_current_user_role() = 'Admin')
  WITH CHECK (public.get_current_user_role() = 'Admin');

-- 3. PROFILES POLICIES
CREATE POLICY "Profiles viewable by authenticated users in same school or admins"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    school_id = public.get_current_user_school_id() 
    OR public.get_current_user_role() = 'Admin'
    OR id = (SELECT auth.uid())
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() = 'Admin')
  WITH CHECK (public.get_current_user_role() = 'Admin');

-- 4. COURSES POLICIES
CREATE POLICY "Courses viewable by same school"
  ON public.courses FOR SELECT
  TO authenticated
  USING (school_id = public.get_current_user_school_id() OR public.get_current_user_role() = 'Admin');

CREATE POLICY "Courses insertable by Lecturers and Admins"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('Lecturer', 'Admin') 
    AND school_id = public.get_current_user_school_id()
  );

-- 5. RESOURCES POLICIES
CREATE POLICY "Resources viewable by authenticated users in same school"
  ON public.resources FOR SELECT
  TO authenticated
  USING (
    (school_id = public.get_current_user_school_id() OR public.get_current_user_role() = 'Admin')
    AND (approved = true OR uploaded_by_id = (SELECT auth.uid()) OR public.get_current_user_role() IN ('Lecturer', 'Admin'))
  );

CREATE POLICY "Users can upload resources to their school"
  ON public.resources FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by_id = (SELECT auth.uid())
    AND school_id = public.get_current_user_school_id()
  );

CREATE POLICY "Resource owners, Lecturers, and Admins can update resources"
  ON public.resources FOR UPDATE
  TO authenticated
  USING (
    uploaded_by_id = (SELECT auth.uid()) 
    OR public.get_current_user_role() IN ('Lecturer', 'Admin')
  )
  WITH CHECK (
    uploaded_by_id = (SELECT auth.uid()) 
    OR public.get_current_user_role() IN ('Lecturer', 'Admin')
  );

CREATE POLICY "Resource owners and Admins can delete resources"
  ON public.resources FOR DELETE
  TO authenticated
  USING (
    uploaded_by_id = (SELECT auth.uid()) 
    OR public.get_current_user_role() = 'Admin'
  );

-- 6. ASSIGNMENTS POLICIES
CREATE POLICY "Assignments viewable by students and staff in same school"
  ON public.assignments FOR SELECT
  TO authenticated
  USING (school_id = public.get_current_user_school_id() OR public.get_current_user_role() = 'Admin');

CREATE POLICY "Lecturers and Admins can create assignments"
  ON public.assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('Lecturer', 'Admin')
    AND school_id = public.get_current_user_school_id()
  );

CREATE POLICY "Lecturers and Admins can update assignments"
  ON public.assignments FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() IN ('Lecturer', 'Admin'))
  WITH CHECK (public.get_current_user_role() IN ('Lecturer', 'Admin'));

-- 7. ASSIGNMENT SUBMISSIONS POLICIES
CREATE POLICY "Students see own submissions, Lecturers/Admins see all for their school"
  ON public.assignment_submissions FOR SELECT
  TO authenticated
  USING (
    student_id = (SELECT auth.uid())
    OR public.get_current_user_role() IN ('Lecturer', 'Admin')
  );

CREATE POLICY "Students can insert own submission"
  ON public.assignment_submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = (SELECT auth.uid())
  );

CREATE POLICY "Students can update own submission before grading, staff can grade"
  ON public.assignment_submissions FOR UPDATE
  TO authenticated
  USING (
    (student_id = (SELECT auth.uid()) AND grade IS NULL)
    OR public.get_current_user_role() IN ('Lecturer', 'Admin')
  )
  WITH CHECK (
    (student_id = (SELECT auth.uid()) AND grade IS NULL)
    OR public.get_current_user_role() IN ('Lecturer', 'Admin')
  );

-- 8. FORUM POSTS & REPLIES POLICIES
CREATE POLICY "Forum posts viewable by same school"
  ON public.forum_posts FOR SELECT
  TO authenticated
  USING (school_id = public.get_current_user_school_id() OR public.get_current_user_role() = 'Admin');

CREATE POLICY "Users can create forum posts in their school"
  ON public.forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = (SELECT auth.uid())
    AND school_id = public.get_current_user_school_id()
  );

CREATE POLICY "Post authors and Admins can update/delete posts"
  ON public.forum_posts FOR ALL
  TO authenticated
  USING (author_id = (SELECT auth.uid()) OR public.get_current_user_role() = 'Admin');

CREATE POLICY "Forum replies viewable by all in same school"
  ON public.forum_replies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can reply to posts"
  ON public.forum_replies FOR INSERT
  TO authenticated
  WITH CHECK (author_id = (SELECT auth.uid()));

CREATE POLICY "Users can manage own upvotes"
  ON public.forum_upvotes FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- 9. ATTENDANCE SESSIONS & LOGS POLICIES
CREATE POLICY "Attendance sessions viewable by same school"
  ON public.attendance_sessions FOR SELECT
  TO authenticated
  USING (school_id = public.get_current_user_school_id() OR public.get_current_user_role() = 'Admin');

CREATE POLICY "Class Reps, Lecturers, and Admins can create attendance sessions"
  ON public.attendance_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('Class Representative', 'Lecturer', 'Admin')
    AND school_id = public.get_current_user_school_id()
    AND created_by = (SELECT auth.uid())
  );

CREATE POLICY "Session creators, Lecturers, and Admins can update sessions"
  ON public.attendance_sessions FOR UPDATE
  TO authenticated
  USING (
    created_by = (SELECT auth.uid()) 
    OR public.get_current_user_role() IN ('Lecturer', 'Admin')
  );

CREATE POLICY "Students see own attendance logs, Staff see all logs"
  ON public.attendance_logs FOR SELECT
  TO authenticated
  USING (
    student_id = (SELECT auth.uid()) 
    OR public.get_current_user_role() IN ('Class Representative', 'Lecturer', 'Admin')
  );

CREATE POLICY "Students can log their own attendance"
  ON public.attendance_logs FOR INSERT
  TO authenticated
  WITH CHECK (student_id = (SELECT auth.uid()));

-- 10. NOTIFICATIONS POLICIES
CREATE POLICY "Users see personal notifications and school-wide broadcasts"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) 
    OR user_id IS NULL
    OR public.get_current_user_role() = 'Admin'
  );

CREATE POLICY "Staff can broadcast notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_current_user_role() IN ('Class Representative', 'Lecturer', 'Admin')
  );

CREATE POLICY "Users can mark own notifications as read"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR user_id IS NULL);

-- 11. AI CHAT SESSIONS & MESSAGES (Strict Private User Isolation)
CREATE POLICY "Users own their AI chat sessions"
  ON public.ai_chat_sessions FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users access messages of their own sessions"
  ON public.ai_chat_messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_chat_sessions s
      WHERE s.id = session_id AND s.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_chat_sessions s
      WHERE s.id = session_id AND s.user_id = (SELECT auth.uid())
    )
  );
