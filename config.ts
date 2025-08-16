import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configuration object
export const config = {
  // Use your local IP address for development
  supabaseUrl: __DEV__ 
    ? 'http://192.168.1.101:54321'
    : 'YOUR_PRODUCTION_SUPABASE_URL', // Replace with your production URL when deploying

  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
};
