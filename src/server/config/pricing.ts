export const MODEL_RATES: Record<string, { promptPer1M: number; completionPer1M: number }> = {
  'llama-3.3-70b-versatile': { promptPer1M: 0.59, completionPer1M: 0.79 },
  'llama-3.1-8b-instant': { promptPer1M: 0.05, completionPer1M: 0.08 },
  'mixtral-8x7b-32768': { promptPer1M: 0.24, completionPer1M: 0.24 },
};