import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iplkvysrjmsutrddfobx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGt2eXNyam1zdXRyZGRmb2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NDg1NzcsImV4cCI6MjEwMjEyNDU3N30.-y2I7YrkKmRoGcjJRsQKi11DGVCPAJNLOT-Us_qKcl0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
