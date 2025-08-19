import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, stepCountIs } from "ai";
import { Pica } from "@picahq/ai";
import type { UIMessage } from "ai";

function getModel(modelId: string) {
  switch (modelId) {
    case "gpt-4.1":
    case "gpt-5":
      return openai(modelId);
    case "gemini-2.5-pro":
      return google(modelId);
    case "claude-sonnet-4-20250514":
      return anthropic(modelId);
    default:
      return openai("gpt-4.1");
  }
}

export async function POST(request: Request) {
  const { messages, id }: { messages: UIMessage[], id: string } = await request.json();
  const modelId = id.replace('chat-', '');

  const pica = new Pica(process.env.PICA_SECRET_KEY as string, {
    connectors: ["*"]
  });

  const system = await pica.generateSystemPrompt();

  const result = streamText({
    model: getModel(modelId),
    system,
    tools: {
      ...pica.oneTool,
    },
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(25)
  });

  return result.toUIMessageStreamResponse();
}
