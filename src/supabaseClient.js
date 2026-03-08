import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://xjsechjoldmgbcipebch.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqc2VjaGpvbGRtZ2JjaXBlYmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDQ1NTIsImV4cCI6MjA4ODQ4MDU1Mn0.qCa-Savq8cvwBOyumIDcw8P96_TCr5uMojI8QU0qtyk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
