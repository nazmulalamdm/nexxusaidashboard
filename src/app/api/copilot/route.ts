// src/app/api/copilot/route.ts
import { NextResponse } from "next/server";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { createAgentGraph } from "@/server/agent/graph";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Malformed payload format" }, { status: 400 });
    }

    const formattedMessages = messages.map((m: { role: string; content: string }) => {
      if (m.role === "user") return new HumanMessage(m.content);
      return new AIMessage(m.content);
    });

    const agent = createAgentGraph();
    const result = await agent.invoke({ messages: formattedMessages });
    const finalMessages = result.messages;
    const lastMessage = finalMessages[finalMessages.length - 1];

    // টুল আউটপুট ক্যাচ করা (Deprecated _getType() ছাড়া নিরাপদ উপায়)
    const actions: any[] = [];
    for (const msg of finalMessages) {
      if (ToolMessage.isInstance(msg) || (msg as any).getType?.() === "tool") {
        try {
          const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
          const parsed = JSON.parse(content);
          if (parsed && typeof parsed === "object") actions.push(parsed);
        } catch {
          // JSON পার্স না হলে স্কিপ করবে
        }
      }
    }

    return NextResponse.json({
      reply: lastMessage.content || "Command processed across gateway nodes.",
      actions,
    });
  } catch (err: any) {
    console.error("Copilot Runtime Fault:", err);
    return NextResponse.json(
      { error: err.message || "Gateway signal drop detected." },
      { status: 500 }
    );
  }
}