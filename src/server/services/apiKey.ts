import crypto from 'crypto';
import { db } from '../db/client';

const KEY_PREFIX = 'tkp_live_'; // TechknowPointAI Live Key Prefix

export interface GenerateKeyResponse {
  rawKey: string;     // ব্যবহারকারীকে শুধু একবার দেখানোর জন্য
  keyPrefix: string;
  id: string;
}

export class ApiKeyService {
  /**
   * রেন্ডম সিক্রেট স্ট্রিং এবং SHA-256 হ্যাশ তৈরি করে
   */
  private static generateSecret() {
    const entropy = crypto.randomBytes(24).toString('base64url');
    const rawKey = `${KEY_PREFIX}${entropy}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 13); // যেমন: 'tkp_live_abcd'

    return { rawKey, keyHash, keyPrefix };
  }

  /**
   * নতুন এপিআই কি তৈরি করে ডেটাবেজে সেভ করা
   */
  static async createKey(userId: string, keyName: string): Promise<GenerateKeyResponse> {
    const { rawKey, keyHash, keyPrefix } = this.generateSecret();

    const { data, error } = await db
      .from('api_keys')
      .insert({
        user_id: userId,
        name: keyName,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        status: 'active',
        rate_limit_rpm: 600,
        monthly_budget_cap: 100.0,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to generate API Key: ${error.message}`);
    }

    return {
      id: data.id,
      keyPrefix,
      rawKey,
    };
  }

  /**
   * ইনকামিং রিকোয়েস্টের এপিআই কি ভেরিফাই করা
   */
  static async verifyKey(incomingKey: string) {
    const incomingHash = crypto.createHash('sha256').update(incomingKey).digest('hex');

    const { data, error } = await db
      .from('api_keys')
      .select('id, user_id, status, rate_limit_rpm, monthly_budget_cap, current_spend')
      .eq('key_hash', incomingHash)
      .single();

    if (error || !data) {
      return { valid: false, error: 'Invalid API Key' };
    }

    if (data.status !== 'active') {
      return { valid: false, error: 'API Key is revoked or suspended' };
    }

    return { valid: true, keyData: data };
  }
}