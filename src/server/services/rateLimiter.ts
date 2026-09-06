import { db } from '@/server/db/client';

export class RateLimiterService {
  /**
   * নির্দিষ্ট API Key এর জন্য গত ১ মিনিটে কয়টি রিকোয়েস্ট এসেছে তা গণনা করে
   */
  static async checkRateLimit(apiKeyId: string, limitRpm: number): Promise<{ allowed: boolean; remaining: number; resetSec: number }> {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

    // গত ১ মিনিটের রিকোয়েস্ট কাউন্ট নেওয়া
    const { count, error } = await db
      .from('telemetry_logs')
      .select('*', { count: 'exact', head: true })
      .eq('api_key_id', apiKeyId)
      .gte('created_at', oneMinuteAgo);

    if (error) {
      console.error('[RATE LIMITER ERROR]', error.message);
      // এরর হলে রিকোয়েস্ট ব্লক না করে এলাও করা নিরাপদ
      return { allowed: true, remaining: 1, resetSec: 60 };
    }

    const currentCount = count || 0;
    const remaining = Math.max(0, limitRpm - currentCount);
    const allowed = currentCount < limitRpm;

    return {
      allowed,
      remaining,
      resetSec: 60,
    };
  }
}