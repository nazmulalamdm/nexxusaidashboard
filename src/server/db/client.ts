import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// বিল্ড ও প্রি-রেন্ডার স্টেজে ক্র্যাশ আটকানোর জন্য ফলব্যাক হ্যান্ডলিং
if (process.env.NODE_ENV === 'production' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)) {
  console.warn('⚠️ Supabase environment variables are missing during build/runtime. Initializing with fallback proxy.');
}

// অ্যাডমিন প্রিভিলেজসহ ব্যাকএন্ড ডেটাবেজ ক্লায়েন্ট (RLS বাইপাস ও নিরাপদ আপডেটের জন্য)
export const db = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});