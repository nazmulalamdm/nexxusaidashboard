// src/server/agent/graph.ts
import { StateGraph, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { BaseMessage, SystemMessage } from "@langchain/core/messages";
import { agentTools, ALL_GATEWAY_ROUTES } from "./tools";

export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (curr, update) => curr.concat(update),
    default: () => [],
  }),
});

// সাইডবার পেজগুলোর সম্পূর্ণ রেফারেন্স প্রম্পটে ঢুকিয়ে দেওয়া হলো
const ROUTES_MAP_TEXT = ALL_GATEWAY_ROUTES.map(
  (r) => `- ${r.name} (${r.path}): ${r.desc}`
).join("\n");

const SYSTEM_PROMPT = `You are "NEXUS-7", an elite Cyberpunk AI Gateway Operations Copilot.
You have absolute operational access to all gateway mesh routes:
${ROUTES_MAP_TEXT}

DIRECTIVES:
1. Navigation: When a user mentions or asks to open/visit/modify anything related to any of the routes above (e.g. "change my password", "show token usage", "calculate cost", "see latency", "open prompt registry", "deploy a model"), IMMEDIATELY trigger the "navigate_to_page" tool with the exact target path.
2. Actions: You can generate live API keys and calculate inference costs right in this terminal.
3. Tone: Crisp, technical, Cyberpunk CLI vibe, polite and instantly actionable. Keep text concise.`;

export function createAgentGraph() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is missing.");
  }

  // ১. প্রাইমারি মডেল: Llama 3.1 8B Instant (Groq-এ লাইভ, স্থিতিশীল ও দ্রুত)
  const primaryModel = new ChatGroq({
    apiKey: apiKey,
    model: "openai/gpt-oss-20b",
    temperature: 0.1,
  }).bindTools(agentTools);

  // ২. ফলব্যাক ব্যাকআপ মডেল: Mixtral 8x7B (টুল-কলিং সাপোর্ট সহ অ্যাক্টিভ ফ্রি ব্যাকআপ)
  const fallbackModel = new ChatGroq({
    apiKey: apiKey,
    model: "qwen/qwen3.6-27b",
    temperature: 0.1,
  }).bindTools(agentTools);

  // ফলব্যাক সেটআপ: প্রাইমারি ফেইল করলে স্বয়ংক্রিয়ভাবে ব্যাকআপ মডেলে সুইচ করবে
  const resilientModel = primaryModel.withFallbacks({
    fallbacks: [fallbackModel],
  });

  const callModel = async (state: typeof AgentState.State) => {
    const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];
    const response = await resilientModel.invoke(messages);
    return { messages: [response] };
  };

  const toolNode = new ToolNode(agentTools);

  const shouldContinue = (state: typeof AgentState.State) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (
      "tool_calls" in lastMessage &&
      Array.isArray(lastMessage.tool_calls) &&
      lastMessage.tool_calls.length > 0
    ) {
      return "tools";
    }
    return "__end__";
  };

  const workflow = new StateGraph(AgentState)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue, {
      tools: "tools",
      __end__: "__end__",
    })
    .addEdge("tools", "agent");

  return workflow.compile();
}