import { config } from 'dotenv';
import { resolve } from 'path';

// .env.local ফাইলটি ম্যানুয়ালি লোড করা হচ্ছে
config({ path: resolve(process.cwd(), '.env.local') });

async function verifyConnection() {
  // .env লোড হওয়ার পর db ক্লায়েন্ট ইমপোর্ট করা হচ্ছে
  const { db } = await import('./client');

  const { data, error } = await db.from('api_keys').select('*').limit(1);

  if (error) {
    console.error('❌ Connection Failed:', error.message);
  } else {
    console.log('✅ Supabase connected successfully! Table query works.');
  }
}

verifyConnection();