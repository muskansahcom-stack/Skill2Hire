import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ggxqoqzjciuweruahbkm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneHFvcXpqY2l1d2VydWFoYmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MjE2MTEsImV4cCI6MjEwMzQ5NzYxMX0.WUs2X6Ml_z3d2q6LmZlIK1I4O_bMKmewnALAmxWCYoY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(supabaseUrl, serviceKey);
};
