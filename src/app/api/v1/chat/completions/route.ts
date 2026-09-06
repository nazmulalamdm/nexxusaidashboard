import { NextRequest, NextResponse } from 'next/server';
import { ApiKeyService } from '@/server/services/apiKey';
import { RateLimiterService } from '@/server/services/rateLimiter';
import { db } from '@/server/db/client';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  // ১. হেডার থেকে টোকেন যাচাই
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: { message: 'Missing or invalid Authorization header' } },
      { status: 401 }
    );
  }

  const incomingKey = authHeader.replace('Bearer ', '').trim();

  // ২. API Key ভ্যালিডেশন
  const verification = await ApiKeyService.verifyKey(incomingKey);
  if (!verification.valid || !verification.keyData) {
    return NextResponse.json(
      { error: { message: verification.error || 'Unauthorized' } },
      { status: 401 }
    );
  }

  const { id: apiKeyId, user_id: userId, monthly_budget_cap, current_spend, rate_limit_rpm } = verification.keyData;

  // ৩. রেট লিমিট চেক (RPM)
  const rpmLimit = rate_limit_rpm || 60; // ডিফল্ট ৬০ RPM
  const { allowed, remaining, resetSec } = await RateLimiterService.checkRateLimit(apiKeyId, rpmLimit);

  const rateLimitHeaders = {
    'x-ratelimit-limit-requests': String(rpmLimit),
    'x-ratelimit-remaining-requests': String(remaining),
    'x-ratelimit-reset-requests': `${resetSec}s`,
  };

  if (!allowed) {
    return NextResponse.json(
      { error: { message: `Rate limit exceeded. Maximum ${rpmLimit} requests per minute allowed.` } },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  // ৪. বাজেট লিমিট চেক
  if (Number(current_spend) >= Number(monthly_budget_cap)) {
    return NextResponse.json(
      { error: { message: 'Monthly budget cap exceeded for this API key' } },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: { message: 'Missing or invalid `messages` array in request body' } },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const model = body.model || 'qwen/qwen3.6-27b';
    const isStream = Boolean(body.stream);

    const upstreamApiKey = process.env.GROQ_API_KEY;
    if (!upstreamApiKey) {
      return NextResponse.json(
        { error: { message: 'Groq provider key not configured in .env.local' } },
        { status: 500, headers: rateLimitHeaders }
      );
    }

    // ৫. Groq রিকোয়েস্ট তৈরি
    const groqPayload: Record<string, unknown> = {
      model: model,
      messages: body.messages,
      temperature: body.temperature ?? 0.7,
      max_tokens: body.max_tokens ?? 1024,
      stream: isStream,
    };

    if (isStream) {
      groqPayload.stream_options = { include_usage: true };
    }

    const upstreamResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${upstreamApiKey.trim()}`,
      },
      body: JSON.stringify(groqPayload),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      return new NextResponse(errorText, {
        status: upstreamResponse.status,
        headers: { 'Content-Type': 'application/json', ...rateLimitHeaders },
      });
    }

    // ৬. ক. নন-স্ট্রিমিং রেসপন্স
    if (!isStream) {
      const responseData = await upstreamResponse.json();
      const latencyMs = Date.now() - startTime;
      const usage = responseData?.usage || {};
      const promptTokens = Number(usage.prompt_tokens) || 0;
      const completionTokens = Number(usage.completion_tokens) || 0;
      const estimatedCost = (promptTokens * 0.00000059) + (completionTokens * 0.00000079);

      await recordUsage(userId, apiKeyId, model, promptTokens, completionTokens, latencyMs, estimatedCost, upstreamResponse.status, Number(current_spend));
      return NextResponse.json(responseData, { status: upstreamResponse.status, headers: rateLimitHeaders });
    }

    // ৬. খ. স্ট্রিমিং রেসপন্স (TransformStream)
    const decoder = new TextDecoder();
    let finalPromptTokens = 0;
    let finalCompletionTokens = 0;

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const textChunk = decoder.decode(chunk, { stream: true });
        controller.enqueue(chunk);

        const lines = textChunk.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:') && trimmed !== 'data: [DONE]') {
            try {
              const json = JSON.parse(trimmed.replace('data:', '').trim());
              if (json.usage) {
                finalPromptTokens = Number(json.usage.prompt_tokens) || 0;
                finalCompletionTokens = Number(json.usage.completion_tokens) || 0;
              }
            } catch {
              // ignore plain chunks
            }
          }
        }
      },
      async flush() {
        const latencyMs = Date.now() - startTime;
        const estimatedCost = (finalPromptTokens * 0.00000059) + (finalCompletionTokens * 0.00000079);

        await recordUsage(
          userId,
          apiKeyId,
          model,
          finalPromptTokens,
          finalCompletionTokens,
          latencyMs,
          estimatedCost,
          200,
          Number(current_spend)
        );
      },
    });

    return new NextResponse(upstreamResponse.body?.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...rateLimitHeaders,
      },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal gateway error';
    return NextResponse.json({ error: { message } }, { status: 500, headers: rateLimitHeaders });
  }
}

// টেলিমেট্রি ও স্পেন্ড আপডেট হেল্পার ফাংশন
async function recordUsage(
  userId: string,
  apiKeyId: string,
  model: string,
  promptTokens: number,
  completionTokens: number,
  latencyMs: number,
  estimatedCost: number,
  statusCode: number,
  currentSpend: number
) {
  try {
    await db.from('telemetry_logs').insert({
      user_id: userId,
      api_key_id: apiKeyId,
      model_name: model,
      endpoint: '/v1/chat/completions',
      input_tokens: promptTokens,
      output_tokens: completionTokens,
      latency_ms: latencyMs,
      cost_usd: estimatedCost,
      status_code: statusCode,
    });

    if (estimatedCost > 0) {
      const newSpend = currentSpend + estimatedCost;
      await db
        .from('api_keys')
        .update({ current_spend: newSpend })
        .eq('id', apiKeyId);
    }
  } catch (err) {
    console.error('[GATEWAY] Telemetry insert failed:', err);
  }
}