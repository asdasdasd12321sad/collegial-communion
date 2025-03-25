
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dkxjvsezqrutchjopmwa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreGp2c2V6cXJ1dGNoam9wbXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MTg4NjYsImV4cCI6MjA1ODE5NDg2Nn0.cEYHVzRBUhUkM2N3epBJA4yg-NwCO5fDLHVwE8NfcOo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
