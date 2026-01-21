const SUPABASE_URL = "https://lndmtvqporbhnxojcbhr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZG10dnFwb3JiaG54b2pjYmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzY5NDMsImV4cCI6MjA4NDAxMjk0M30.l4naOpPBA5FDh9RjEboeMpd823FOqqs2X8keXClQYVs";

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);