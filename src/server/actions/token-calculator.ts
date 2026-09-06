'use server';

export interface ModelPricing {
  id: string;
  name: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  speed: string;
}

export async function getModelPricingRates(): Promise<ModelPricing[]> {
  return [
    {
      id: 'qwen/qwen3.6-27b',
      name: 'Qwen 3.6 (27B) Ultra-Fast',
      inputCostPer1M: 0.20,
      outputCostPer1M: 0.50,
      speed: '450 t/s',
    },
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 (70B) Versatile',
      inputCostPer1M: 0.59,
      outputCostPer1M: 0.79,
      speed: '280 t/s',
    },
    {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 (8B) Instant',
      inputCostPer1M: 0.05,
      outputCostPer1M: 0.08,
      speed: '820 t/s',
    },
  ];
}