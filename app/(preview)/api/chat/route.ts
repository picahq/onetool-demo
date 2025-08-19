import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, stepCountIs } from "ai";
import { Pica } from "@picahq/ai";
import type { UIMessage } from "ai";
export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const pica = new Pica(process.env.PICA_SECRET_KEY as string, {
    connectors: ["*"] // Pass connector keys to allow access to
  });

  const system = await pica.generateSystemPrompt();

  const result = streamText({
    model: openai("gpt-4.1"),
    system,
    tools: {
      ...pica.oneTool,
    },
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(25)
  });

  return result.toUIMessageStreamResponse();
}
