import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bdojvtdngtxcyocixdna.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkb2p2dGRuZ3R4Y3lvY2l4ZG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0NjMwODYsImV4cCI6MjExMDAzOTA4Nn0.nh67lcUSLoreMQQ6ahNGqNu8X5fqB_3ly0yWBAVqJYs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
