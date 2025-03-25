
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dkxjvsezqrutchjopmwa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreGp2c2V6cXJ1dGNoam9wbXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MTg4NjYsImV4cCI6MjA1ODE5NDg2Nn0.cEYHVzRBUhUkM2N3epBJA4yg-NwCO5fDLHVwE8NfcOo';

// List of allowed college email domains for verification
export const ALLOWED_DOMAINS = [
  'edu',
  'college.edu',
  'university.edu',
  'student.edu',
  'student.tdtu.edu.vn',
  // Add more college domains as needed
];

// Helper to check if email domain is allowed for verification
export const isAllowedDomain = (email: string): boolean => {
  return ALLOWED_DOMAINS.some(domain => email.toLowerCase().endsWith(domain));
};

// Helper to extract university from email
export const extractUniversityFromEmail = (email: string): string | null => {
  // Extract the domain from the email
  const domainMatch = email.match(/@([^.]+)/);
  if (!domainMatch) return null;
  
  const domain = domainMatch[1].toLowerCase();
  
  // Map domain to university name (simplified example)
  const universityMap: Record<string, string> = {
    'harvard': 'Harvard University',
    'stanford': 'Stanford University',
    'mit': 'MIT',
    'princeton': 'Princeton University',
    'berkeley': 'UC Berkeley',
    'yale': 'Yale University',
    'columbia': 'Columbia University',
    'cornell': 'Cornell University',
    'upenn': 'UPenn',
    'college': 'Sample College',
    'university': 'Sample University',
    'student': 'Sample School',
    'tdtu': 'Ton Duc Thang University'
  };
  
  return universityMap[domain] || 'Unknown University';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
