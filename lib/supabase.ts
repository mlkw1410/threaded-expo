import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient("https://xqjpsuvqvpjfazjqiajz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxanBzdXZxdnBqZmF6anFpYWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTMzMjAsImV4cCI6MjA3MDY2OTMyMH0.xY6r7b-phgJoOCCevuqPhK_ZeoGc7vas7xhoJN87bwg", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})