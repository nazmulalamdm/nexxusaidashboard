'use server';

export interface ProviderKeyConfig {
  provider: 'groq' | 'openai' | 'anthropic';
  name: string;
  isConfigured: boolean;
  maskedKey: string;
  latencyTier: string;
}

export interface GatewayGlobalSettings {
  defaultProvider: string;
  enableFallbackRouting: boolean;
  maxRetryAttempts: number;
  requestTimeoutMs: number;
  alertWebhookUrl: string;
  alertThresholdPercent: number;
  strictSslVerification: boolean;
}

export interface SettingsPayload {
  providers: ProviderKeyConfig[];
  settings: GatewayGlobalSettings;
}

export async function getGatewaySettings(): Promise<SettingsPayload> {
  const providers: ProviderKeyConfig[] = [
    {
      provider: 'groq',
      name: 'Groq Cloud LPU',
      isConfigured: true,
      maskedKey: 'gsk_••••••••••••••••••••3e81',
      latencyTier: 'Ultra-low (<150ms)',
    },
    {
      provider: 'openai',
      name: 'OpenAI API Mesh',
      isConfigured: true,
      maskedKey: 'sk-proj-••••••••••••••••••••924a',
      latencyTier: 'Standard (600ms)',
    },
    {
      provider: 'anthropic',
      name: 'Anthropic Claude Engine',
      isConfigured: false,
      maskedKey: '',
      latencyTier: 'Standard (800ms)',
    },
  ];

  const settings: GatewayGlobalSettings = {
    defaultProvider: 'groq',
    enableFallbackRouting: true,
    maxRetryAttempts: 3,
    requestTimeoutMs: 15000,
    alertWebhookUrl: 'https://api.techknowpoint.ai/webhooks/alerts',
    alertThresholdPercent: 85,
    strictSslVerification: true,
  };

  return { providers, settings };
}

export async function updateProviderKey(provider: string, secretKey: string) {
  return { success: true, provider, updated: true };
}

export async function updateGlobalSettings(settings: GatewayGlobalSettings) {
  return { success: true, settings };
}