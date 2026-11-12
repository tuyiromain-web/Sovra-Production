-- ==============================================================================
-- SOVRA PRODUCTION SCHEMA - MIGRATION 003
-- Supabase Storage Buckets, MIME Restrictions & Storage Access Policies
-- Buckets:
-- 1. avatars (Public, 5MB, image/*)
-- 2. resources (Authenticated/Public, 50MB, pdf, docx, pptx, images)
-- 3. assignments (Private Authenticated, 25MB, pdf, docx, zip)
-- 4. ai-attachments (Private, 20MB, images, pdf, txt, docs)
-- ==============================================================================

-- 1. PROVISION STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('resources', 'resources', true, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/jpeg', 'image/png']),
  ('assignments', 'assignments', false, 26214400, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/zip', 'application/x-zip-compressed']),
  ('ai-attachments', 'ai-attachments', false, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'text/csv'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. STORAGE POLICIES: AVATARS BUCKET
-- Structure: avatars/{user_id}/avatar.png
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- 3. STORAGE POLICIES: RESOURCES BUCKET
-- Structure: resources/{school_id}/{academic_year}/{resource_id}/filename.ext
CREATE POLICY "Resources are downloadable by authenticated users"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'resources');

CREATE POLICY "Users can upload resource documents to their folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resources'
    AND (SELECT auth.uid()) IS NOT NULL
  );

CREATE POLICY "Resource uploader and admins can delete resource files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'resources'
    AND (owner = (SELECT auth.uid()) OR public.get_current_user_role() = 'Admin')
  );

-- 4. STORAGE POLICIES: ASSIGNMENTS BUCKET (Student submissions & Lecturer templates)
-- Structure: assignments/{assignment_id}/{student_id}/submission.pdf
CREATE POLICY "Students and staff access assignment submissions"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'assignments'
    AND (
      (storage.foldername(name))[2] = (SELECT auth.uid())::text
      OR public.get_current_user_role() IN ('Lecturer', 'Admin')
    )
  );

CREATE POLICY "Students can upload assignment submissions"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'assignments'
    AND (storage.foldername(name))[2] = (SELECT auth.uid())::text
  );

-- 5. STORAGE POLICIES: AI-ATTACHMENTS BUCKET (Private Copilot prompts)
-- Structure: ai-attachments/{user_id}/{session_id}/file.png
CREATE POLICY "Users access own AI prompt attachments"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'ai-attachments'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'ai-attachments'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
