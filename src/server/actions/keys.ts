'use server';

import { db } from '@/server/db/client';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export interface ApiKeyItem {
  id: string;
  name: string;
  key_prefix: string;
  monthly_budget_cap: number;
  current_spend: number;
  rate_limit_rpm: number;
  is_active: boolean;
  created_at: string;
}

// ইউজারের সব কী ফেচ করা
export async function getApiKeys(userId = 'test_user_001'): Promise<ApiKeyItem[]> {
  const { data, error } = await db
    .from('api_keys')
    .select('id, name, key_prefix, monthly_budget_cap, current_spend, rate_limit_rpm, is_active, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('[API KEYS FETCH ERROR]', error?.message);
    return [];
  }

  return data.map((k) => ({
    id: k.id,
    name: k.name || 'Unnamed Key',
    key_prefix: k.key_prefix,
    monthly_budget_cap: Number(k.monthly_budget_cap),
    current_spend: Number(k.current_spend),
    rate_limit_rpm: Number(k.rate_limit_rpm),
    is_active: Boolean(k.is_active),
    created_at: k.created_at,
  }));
}

// নতুন API Key তৈরি করা
export async function createApiKey(formData: {
  name: string;
  budgetCap: number;
  rateLimitRpm: number;
  userId?: string;
}) {
  const userId = formData.userId || 'test_user_001';
  
  // সিক্রেট কী জেনারেট (যেমন: tkp_live_...)
  const rawRandomBytes = crypto.randomBytes(24).toString('base64url');
  const secretKey = `tkp_live_${rawRandomBytes}`;
  const keyPrefix = secretKey.slice(0, 12);
  const keyHash = crypto.createHash('sha256').update(secretKey).digest('hex');

  const { error } = await db.from('api_keys').insert({
    user_id: userId,
    name: formData.name || 'Default Key',
    key_hash: keyHash,
    key_prefix: keyPrefix,
    monthly_budget_cap: formData.budgetCap,
    rate_limit_rpm: formData.rateLimitRpm,
    current_spend: 0,
    is_active: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/keys');
  return { secretKey }; // এই সিক্রেট কী-টি ক্লায়েন্টকে একবারের জন্য দেখানো হবে
}

// কী রিভোক বা অ্যাক্টিভ টগল
export async function toggleApiKeyStatus(id: string, currentStatus: boolean) {
  const { error } = await db
    .from('api_keys')
    .update({ is_active: !currentStatus })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/keys');
}

// কী ডিলিট করা
export async function deleteApiKey(id: string) {
  const { error } = await db.from('api_keys').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/keys');
}