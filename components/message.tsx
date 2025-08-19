"use client";

import { motion } from "framer-motion";
import { BotIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "@ai-sdk/rsc";
import { Markdown } from "./markdown";
import KnowledgeCard from "./ui/knowledge-card";
import ExecuteCard, { ExecuteResult } from "./ui/execute-card";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: 'partial-call' | 'call' | 'result';
  args?: any;
  result?: any;
}

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className="flex gap-3 px-4 w-full max-w-3xl mx-auto py-4 first:pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mt-1 w-5 h-5 flex-shrink-0">
        <BotIcon />
      </div>

      <div className="min-w-0">
        <Markdown content={text} fontSize="sm" />
      </div>
    </motion.div>
  );
};

interface ActionResult {
  platform?: string;
  actions?: any[];
  action?: string;
  success: boolean;
  data?: any;
  message?: string;
  raw?: any;
  title?: string;
}

const isExecuteResult = (result: ActionResult): result is ExecuteResult => {
  if (!result.success) {
    return typeof result.success === 'boolean' &&
      (typeof result.message === 'string' || typeof result.title === 'string');
  }

  return typeof result.action === 'string' &&
    typeof result.platform === 'string' &&
    typeof result.success === 'boolean';
};

export const Message = ({
  role,
  content,
  toolInvocations,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
}) => {
  const isUser = role === "user";

  // Collect all actions and knowledge from tool invocations
  const allActions = toolInvocations?.reduce((acc: {
    platforms: Record<string, { name: string; actions: any[] }>;
    knowledge: Array<{ platform: string; action: any }>;
    executeResults: ActionResult[];
  }, toolInvocation) => {
    const { toolName, state } = toolInvocation;
    const result = (toolInvocation as any).result as ActionResult;

    if (state === "result") {
      // For execute actions, collect them all (successful and failed)
      if (toolName === "execute") {
        acc.executeResults.push(result);
      }
      // For getAvailableActions, collect actions by platform
      if (toolName === "getAvailableActions" && result.actions) {
        const platform = result.platform?.toLowerCase() || 'unknown';
        if (!acc.platforms[platform]) {
          acc.platforms[platform] = {
            name: result.platform || '',
            actions: []
          };
        }
        // Add platform to each action
        const actionsWithPlatform = result.actions.map(action => ({
          ...action,
          platform: result.platform
        }));
        acc.platforms[platform].actions.push(...actionsWithPlatform);
      }
      // For getActionKnowledge, store the action knowledge
      else if (toolName === "getActionKnowledge" && result.action) {
        acc.knowledge.push({
          platform: result.platform || '',
          action: result.action
        });
      }
    }
    return acc;
  }, {
    platforms: {} as Record<string, { name: string; actions: any[] }>,
    knowledge: [] as Array<{ platform: string; action: any }>,
    executeResults: [] as ActionResult[]
  });

  // Calculate total actions across all platforms
  const totalActions = Object.values(allActions?.platforms || {})
    .reduce((sum, platform: { name: string; actions: any[] }) => sum + platform.actions.length, 0);

  // Filter execute results to ensure they match ExecuteResult type
  const executeResults = allActions?.executeResults?.filter(isExecuteResult) || [];

  return (
    <motion.div
      className={`flex w-full max-w-3xl md:w-[800px] mx-auto py-4 first:pt-8 ${isUser ? "justify-end" : ""
        }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className={`min-w-0 text-xs text-foreground/70 ${isUser ? "bg-gray-500/20 rounded-3xl px-4 py-2 max-w-[80%] space-y-1" : "space-y-4"
          }`}
      >
        {content && <Markdown content={content as string} fontSize="sm" />}

        {toolInvocations && allActions && (
          <div className="space-y-3">
            {/* Show KnowledgeCard if we have any platforms or knowledge */}
            {(Object.keys(allActions.platforms).length > 0 || allActions.knowledge.length > 0) && (
              <KnowledgeCard
                actions={Object.values(allActions.platforms).flatMap((p: { name: string; actions: any[] }) => p.actions)}
                knowledge={allActions.knowledge}
                platform={(Object.values(allActions.platforms)[0] as { name: string; actions: any[] })?.name || ''}
                totalActions={totalActions}
              />
            )}

            {/* Show ExecuteCard if we have any valid execute results */}
            {executeResults.length > 0 && (
              <ExecuteCard results={executeResults} />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
