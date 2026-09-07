// src/app/api/copilot/route.ts
import { NextResponse } from "next/server";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { createAgentGraph } from "@/server/agent/graph";

// Next.js runtime ফিক্স: fs ও pdfkit ব্যবহারের জন্য Node.js runtime নিশ্চিত করা
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Malformed payload: messages array required" },
        { status: 400 }
      );
    }

    const { messages } = body;

    // মেসেজগুলোকে LangChain ফরমেটে রূপান্তর
    const formattedMessages = messages.map((m: { role: string; content: string }) => {
      if (m.role === "user") {
        return new HumanMessage(m.content);
      }
      return new AIMessage(m.content);
    });

    const agent = createAgentGraph();
    
    // গ্রাফ এক্সিকিউশন (সেফ রিকার্শন লিমিট সহ)
    const result = await agent.invoke(
      { messages: formattedMessages },
      { recursionLimit: 15 }
    );

    const finalMessages = result.messages || [];
    const lastMessage = finalMessages[finalMessages.length - 1];

    // টুল রেজাল্ট ও অ্যাকশনগুলো ফিল্টার করা
    const actions: any[] = [];
    
    for (const msg of finalMessages) {
      const isTool = 
        ToolMessage.isInstance(msg) || 
        (msg as any)._getType?.() === "tool" || 
        (msg as any).getType?.() === "tool";

      if (isTool && msg.content) {
        try {
          const rawContent = typeof msg.content === "string" 
            ? msg.content 
            : JSON.stringify(msg.content);
            
          const parsed = JSON.parse(rawContent);
          if (parsed && typeof parsed === "object") {
            actions.push(parsed);
          }
        } catch {
          // পার্স না হলে স্কিপ করবে
        }
      }
    }

    return NextResponse.json({
      reply: typeof lastMessage?.content === "string" 
        ? lastMessage.content 
        : "Command processed across gateway nodes.",
      actions,
    });
  } catch (err: any) {
    console.error("Copilot Runtime Fault:", err);
    return NextResponse.json(
      { error: err?.message || "Gateway signal drop detected." },
      { status: 500 }
    );
  }
}