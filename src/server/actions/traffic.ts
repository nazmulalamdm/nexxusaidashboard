'use server';

import { db } from '@/server/db/client';

export interface ModelTrafficSummary {
  model: string;
  totalRequests: number;
  totalTokens: number;
  avgLatencyMs: number;
  errorRate: number;
  status2xx: number;
  status4xx: number;
  status5xx: number;
  lastActive: string;
}

export interface GatewayTrafficData {
  totalInbound: number;
  activeRoutes: number;
  peakRpm: number;
  modelsTraffic: ModelTrafficSummary[];
  recentErrors: {
    id: string;
    model: string;
    statusCode: number;
    latencyMs: number;
    createdAt: string;
  }[];
}

export async function getGatewayTrafficMetrics(): Promise<GatewayTrafficData> {
  const { data: logs, error } = await db
    .from('request_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error || !logs || logs.length === 0) {
    return {
      totalInbound: 0,
      activeRoutes: 0,
      peakRpm: 0,
      modelsTraffic: [],
      recentErrors: [],
    };
  }

  const modelMap: Record<string, {
    totalRequests: number;
    totalTokens: number;
    totalLatency: number;
    status2xx: number;
    status4xx: number;
    status5xx: number;
    lastActive: string;
  }> = {};

  logs.forEach((log) => {
    const model = log.model || 'Unknown Engine';
    if (!modelMap[model]) {
      modelMap[model] = {
        totalRequests: 0,
        totalTokens: 0,
        totalLatency: 0,
        status2xx: 0,
        status4xx: 0,
        status5xx: 0,
        lastActive: log.created_at,
      };
    }

    const item = modelMap[model];
    item.totalRequests += 1;
    item.totalTokens += (log.prompt_tokens || 0) + (log.completion_tokens || 0);
    item.totalLatency += (log.latency_ms || 0);

    const code = Number(log.status_code);
    if (code >= 200 && code < 300) item.status2xx += 1;
    else if (code >= 400 && code < 500) item.status4xx += 1;
    else if (code >= 500) item.status5xx += 1;
  });

  const modelsTraffic: ModelTrafficSummary[] = Object.entries(modelMap).map(([model, item]) => {
    const errorCount = item.status4xx + item.status5xx;
    const errorRate = item.totalRequests > 0 ? (errorCount / item.totalRequests) * 100 : 0;
    const avgLatencyMs = item.totalRequests > 0 ? Math.round(item.totalLatency / item.totalRequests) : 0;

    return {
      model,
      totalRequests: item.totalRequests,
      totalTokens: item.totalTokens,
      avgLatencyMs,
      errorRate: parseFloat(errorRate.toFixed(1)),
      status2xx: item.status2xx,
      status4xx: item.status4xx,
      status5xx: item.status5xx,
      lastActive: item.lastActive,
    };
  });

  const recentErrors = logs
    .filter((log) => Number(log.status_code) >= 400)
    .slice(0, 8)
    .map((log) => ({
      id: log.id,
      model: log.model,
      statusCode: log.status_code,
      latencyMs: log.latency_ms,
      createdAt: log.created_at,
    }));

  return {
    totalInbound: logs.length,
    activeRoutes: modelsTraffic.length,
    peakRpm: Math.max(12, Math.round(logs.length / 5)),
    modelsTraffic,
    recentErrors,
  };
}