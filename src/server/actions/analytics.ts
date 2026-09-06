'use server';

import { db } from '@/server/db/client';

export interface DashboardMetrics {
  totalRequests: number;
  totalCostUsd: number;
  avgLatencyMs: number;
  successRate: number;
  totalTokens: number;
  recentLogs: Array<{
    id: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
    costUsd: number;
    statusCode: number;
    createdAt: string;
  }>;
  chartData: Array<{
    date: string;
    requests: number;
    cost: number;
  }>;
}

export async function getDashboardMetrics(userId = 'test_user_001'): Promise<DashboardMetrics> {
  // ১. ইউজারের গত ৩০ দিনের সব লগ ফেচ করা
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: logs, error } = await db
    .from('telemetry_logs')
    .select('id, model_name, input_tokens, output_tokens, latency_ms, cost_usd, status_code, created_at')
    .eq('user_id', userId)
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: false });

  if (error || !logs) {
    console.error('[ANALYTICS ERROR] Failed to fetch telemetry logs:', error?.message);
    return {
      totalRequests: 0,
      totalCostUsd: 0,
      avgLatencyMs: 0,
      successRate: 100,
      totalTokens: 0,
      recentLogs: [],
      chartData: [],
    };
  }

  // ২. সারাংশ মেট্রিক্স হিসাব করা
  const totalRequests = logs.length;
  let totalCostUsd = 0;
  let totalLatency = 0;
  let totalTokens = 0;
  let successfulRequests = 0;

  // চার্ট ডেটা গ্রুপিংয়ের জন্য ম্যাপ (তারিখভিত্তিক)
  const dailyMetricsMap = new Map<string, { requests: number; cost: number }>();

  for (const log of logs) {
    const cost = Number(log.cost_usd) || 0;
    const latency = Number(log.latency_ms) || 0;
    const inTokens = Number(log.input_tokens) || 0;
    const outTokens = Number(log.output_tokens) || 0;

    totalCostUsd += cost;
    totalLatency += latency;
    totalTokens += inTokens + outTokens;

    if (log.status_code >= 200 && log.status_code < 400) {
      successfulRequests += 1;
    }

    // YYYY-MM-DD ফরম্যাটে গ্রুপ করা
    const dateKey = new Date(log.created_at).toISOString().split('T')[0];
    const currentDay = dailyMetricsMap.get(dateKey) || { requests: 0, cost: 0 };
    dailyMetricsMap.set(dateKey, {
      requests: currentDay.requests + 1,
      cost: currentDay.cost + cost,
    });
  }

  const avgLatencyMs = totalRequests > 0 ? Math.round(totalLatency / totalRequests) : 0;
  const successRate = totalRequests > 0 ? Number(((successfulRequests / totalRequests) * 100).toFixed(1)) : 100;

  // ৩. চার্ট ডেটা বিন্যাস (সর্বশেষ ৭ দিন থেকে আজকের ক্রমানুসারে)
  const chartData = Array.from(dailyMetricsMap.entries())
    .map(([date, data]) => ({
      date,
      requests: data.requests,
      cost: Number(data.cost.toFixed(6)),
    }))
    .reverse();

  // ৪. সাম্প্রতিক ১৫টি রিকোয়েস্ট টেবিলের জন্য প্রস্তুত
  const recentLogs = logs.slice(0, 15).map((log) => ({
    id: log.id,
    model: log.model_name || 'unknown',
    inputTokens: Number(log.input_tokens) || 0,
    outputTokens: Number(log.output_tokens) || 0,
    latencyMs: Number(log.latency_ms) || 0,
    costUsd: Number(log.cost_usd) || 0,
    statusCode: Number(log.status_code) || 200,
    createdAt: log.created_at,
  }));

  return {
    totalRequests,
    totalCostUsd: Number(totalCostUsd.toFixed(6)),
    avgLatencyMs,
    successRate,
    totalTokens,
    recentLogs,
    chartData,
  };
}