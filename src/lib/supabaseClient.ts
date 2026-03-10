// src/lib/supabaseClient.ts
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Current user object
export let currentUser: User | null = null;

// Login user with email + password
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = data.user;
  return data.user;
};

// Register user (email + password)
export const registerUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  currentUser = data.user;
  return data.user;
};

// Logout user
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  currentUser = null;
};

// Get current user/session
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getSession();
  currentUser = data.session?.user ?? null;
  return currentUser;
};

// Listen to auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  currentUser = session?.user ?? null;
});
