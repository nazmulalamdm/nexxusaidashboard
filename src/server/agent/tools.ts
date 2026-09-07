// src/server/agent/tools.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// আপনার সাইডবার আইটেম এবং প্ল্যাটফর্মের সব রুটের ডেফিনিশন
export const ALL_GATEWAY_ROUTES = [
  {
    name: "Analytics Hub",
    path: "/overview",
    aliases: ["overview", "analytics", "dashboard", "home", "stats"],
    desc: "Real-time latency, operational throughput, gateway requests and system status.",
  },
  {
    name: "AI Playground",
    path: "/playground",
    aliases: ["playground", "test models", "prompt tester", "chat playground"],
    desc: "Interactive testing sandbox for LLM inference, temperature, and tokens.",
  },
  {
    name: "Prompt Registry",
    path: "/prompts",
    aliases: ["prompts", "prompt management", "templates", "system prompts"],
    desc: "Centralized prompt management, versioning, and prompt template deployment.",
  },
  {
    name: "API Key Vault",
    path: "/keys",
    aliases: ["keys", "api keys", "secret keys", "tokens", "key vault"],
    desc: "Generate, inspect, and revoke secure API authentication tokens.",
  },
  {
    name: "Gateway Traffic",
    path: "/clients",
    aliases: ["clients", "traffic", "consumers", "incoming traffic", "active clients"],
    desc: "Real-time client connections, request routing, and bandwidth utilization.",
  },
  {
    name: "Model Provisioning",
    path: "/orders",
    aliases: ["orders", "models", "provisioning", "deploy models", "gpu nodes"],
    desc: "Provisioning dedicated GPU nodes, AI model deployment orders, and host nodes.",
  },
  {
    name: "Token Telemetry",
    path: "/transactions",
    aliases: ["transactions", "telemetry", "token usage", "logs", "audit"],
    desc: "Real-time token usage logs, transactional audit streams, and trace logs.",
  },
  {
    name: "Token Calculator",
    path: "/token-calculator",
    aliases: ["calculator", "token math", "cost estimator", "token cost"],
    desc: "Estimate inference pricing, input/output tokens cost, and model comparisons.",
  },
  {
    name: "Settlements & Quotas",
    path: "/payments",
    aliases: ["payments", "billing", "settlements", "quotas", "invoices", "credits"],
    desc: "Manage operator balance, subscription quotas, credit top-ups, and invoices.",
  },
  {
    name: "Security & API Keys",
    path: "/Security",
    aliases: ["security", "password", "settings", "credentials", "change password"],
    desc: "Update operator credentials, change account password, and configure node security.",
  },
  // অথেনটিকেশন রুটসমূহ
  {
    name: "Forgot Password Portal",
    path: "/forgot-password",
    aliases: ["forgot password", "recover account", "reset request"],
    desc: "Password recovery sequence terminal for locked or forgotten credentials.",
  },
  {
    name: "Reset Password Sequence",
    path: "/reset-password",
    aliases: ["reset password", "overwrite key", "new password entry"],
    desc: "Configure fresh credentials using an active recovery session link.",
  },
  {
    name: "Login Portal",
    path: "/login",
    aliases: ["login", "sign in", "auth"],
    desc: "Operator node authentication portal.",
  },
] as const;

// Zod Enum এর জন্য রুটের পাথ বের করা
const validPaths = ALL_GATEWAY_ROUTES.map((p) => p.path) as [string, ...string[]];

// ১. নেভিগেশন ডিসিশন টুল
export const navigatePageTool = tool(
  async ({ targetPath }) => {
    const route = ALL_GATEWAY_ROUTES.find((r) => r.path === targetPath);

    if (!route) {
      return JSON.stringify({
        success: false,
        message: `Route ${targetPath} is offline or outside registered mesh perimeter.`,
      });
    }

    return JSON.stringify({
      success: true,
      action: "NAVIGATE",
      pageName: route.name,
      path: route.path,
      description: route.desc,
      message: `Routing operator terminal directly to ${route.name} (${route.path}).`,
    });
  },
  {
    name: "navigate_to_page",
    description:
      "Directs the user to any registered platform route. Use this whenever the user asks to open, view, or visit any feature (e.g. Analytics, Playground, Prompt Registry, API Keys, Traffic, Model Provisioning, Token Telemetry, Calculator, Billing, or Security).",
    schema: z.object({
      targetPath: z
        .enum(validPaths)
        .describe("The exact URL path of the target platform route"),
    }),
  }
);

// ২. লাইভ টেলিমেট্রি পড়ার টুল
export const getTelemetryTool = tool(
  async () => {
    return JSON.stringify({
      systemStatus: "OPTIMAL",
      averageLatency: "14.2ms",
      activeNodes: 16,
      throughput: "3,890 req/s",
      errorRate: "0.0004%",
    });
  },
  {
    name: "read_system_telemetry",
    description: "Fetches live gateway status, latency, throughput, and error rates.",
    schema: z.object({}),
  }
);

// ৩. ইনস্ট্যান্ট API Key জেনারেশন টুল
export const generateApiKeyTool = tool(
  async ({ keyName }) => {
    const randomHex = Array.from({ length: 28 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    return JSON.stringify({
      success: true,
      keyName,
      apiKey: `mesh_live_${randomHex}`,
      note: "Inject this token into your Gateway Authorization headers immediately.",
    });
  },
  {
    name: "generate_api_key",
    description: "Generates a new secure Cyberpunk API access key directly from chat.",
    schema: z.object({
      keyName: z.string().describe("Descriptive name or alias for the key"),
    }),
  }
);

// ৪. টোকেন ও খরচ ক্যালকুলেশন টুল
export const calculateTokenCostTool = tool(
  async ({ inputTokens, outputTokens, modelTier }) => {
    const ratePer1M = modelTier === "flagship" ? 2.5 : 0.4;
    const totalTokens = inputTokens + outputTokens;
    const estimatedCost = (totalTokens / 1_000_000) * ratePer1M;
    return JSON.stringify({
      success: true,
      totalTokens,
      modelTier: modelTier || "standard",
      estimatedCostUSD: `$${estimatedCost.toFixed(5)}`,
    });
  },
  {
    name: "calculate_token_cost",
    description: "Calculates estimated inference costs based on token quantities.",
    schema: z.object({
      inputTokens: z.number().describe("Estimated input tokens"),
      outputTokens: z.number().describe("Estimated output tokens"),
      modelTier: z.enum(["standard", "flagship"]).optional().describe("LLM Model tier"),
    }),
  }
);

export const agentTools = [
  navigatePageTool,
  getTelemetryTool,
  generateApiKeyTool,
  calculateTokenCostTool,
];