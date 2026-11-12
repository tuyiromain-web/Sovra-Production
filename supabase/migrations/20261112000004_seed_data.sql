-- ==============================================================================
-- SOVRA PRODUCTION SCHEMA - MIGRATION 004
-- Seed Workspaces, Courses, Demonstration Resources & Initial System Baseline
-- ==============================================================================

-- 1. SEED DEFAULT INSTITUTIONAL WORKSPACE
INSERT INTO public.schools (id, name, slug, code, domain, country)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'INES-Ruhengeri Institute of Applied Sciences',
  'ines-ruhengeri',
  'INES-01',
  'ines.ac.rw',
  'Rwanda'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code;

-- 2. SEED CORE ACADEMIC COURSES
INSERT INTO public.courses (id, school_id, code, name, academic_year, description, credits)
VALUES 
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111111', 'PHA 211', 'Pharmacology I', 'Year 2', 'Pharmacodynamics, pharmacokinetics, ADME modeling and receptor interactions.', 10),
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111111', 'PHA 312', 'Medicinal Chemistry II', 'Year 3', 'Structure-activity relationships (SAR), synthesis of NSAIDs and antibiotics.', 10),
  ('22222222-2222-2222-2222-222222222003', '11111111-1111-1111-1111-111111111111', 'PHA 321', 'Biopharmaceutics', 'Year 3', 'Bioavailability, bioequivalence, dissolution kinetics, and dosage form stability.', 10),
  ('22222222-2222-2222-2222-222222222004', '11111111-1111-1111-1111-111111111111', 'PHA 411', 'Clinical Therapeutics', 'Year 4', 'Evidence-based hospital pharmacotherapy and Rwanda standard treatment guidelines.', 12)
ON CONFLICT (school_id, code) DO NOTHING;
