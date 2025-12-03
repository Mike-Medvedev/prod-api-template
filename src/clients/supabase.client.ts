import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  `https://${process.env.SUPABASE_PROJECT_ID!}.supabase.co`,
  process.env.SUPABASE_PUBLISHABLE_API_KEY!,
).auth;
