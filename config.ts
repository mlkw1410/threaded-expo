import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get the local IP address from Expo development server
const getLocalIP = () => {
  if (__DEV__) {
    const { manifest } = Constants;
    if (manifest?.debuggerHost) {
      return manifest.debuggerHost.split(':').shift();
    }
  }
  return 'localhost';
};

// Configuration object
export const config = {
  // Use dynamic local IP for development, production URL for deployment
  supabaseUrl: __DEV__
    ? `http://192.168.11.197:54321`
    : 'YOUR_PRODUCTION_SUPABASE_URL', // Replace with your production URL when deploying

  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
};

export const HUGGING_FACE_API_KEY = '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';
