import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

async function runKeyTest() {
  const { ApiKeyService } = await import('./apiKey');
  const { db } = await import('../db/client');

  console.log('🧪 Creating a dummy user first...');
  const testUserId = 'test_user_001';

  // টেস্ট ইউজার যোগ করা (Foreign Key সন্তুষ্ট করতে)
  await db.from('users').upsert({
    id: testUserId,
    email: 'admin@techknowpoint.ai',
    plan_tier: 'pro',
  });

  console.log('🔑 Generating API Key...');
  const newKey = await ApiKeyService.createKey(testUserId, 'Development Key');
  console.log('Generated Raw Key:', newKey.rawKey);

  console.log('🔍 Verifying generated key against DB hash...');
  const verification = await ApiKeyService.verifyKey(newKey.rawKey);

  if (verification.valid) {
    console.log('✅ Key verification succeeded! Record ID:', verification.keyData?.id);
  } else {
    console.error('❌ Verification failed:', verification.error);
  }
}

runKeyTest();