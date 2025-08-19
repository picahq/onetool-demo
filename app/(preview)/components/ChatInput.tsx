import { motion } from "framer-motion";
import { FormEvent, RefObject } from "react";
import { suggestedActions } from "../constants/suggestedActions";
import { UIMessage } from "ai";

interface ChatInputProps {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onSuggestedAction: (action: string) => void;
  isLoading: boolean;
  status: string;
  stop: () => void;
  messages: UIMessage[];
}

export function ChatInput({
  inputRef,
  input,
  handleInputChange,
  handleSubmit,
  onSuggestedAction,
  isLoading,
  status,
  stop,
  messages,
}: ChatInputProps) {
  const wrappedHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  return (
    <div className="mt-auto w-full">
      <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[800px] mb-4">
        {messages.length === 0 &&
          suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              key={index}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <button
                onClick={() => {
                  onSuggestedAction(suggestedAction.action);
                }}
                className="w-full text-left bg-gray-500/10 hover:bg-gray-500/20 text-white rounded-lg p-3 text-sm transition-all duration-300 flex flex-col gap-1"
              >
                <span className="font-medium text-white/90">
                  {suggestedAction.title}
                </span>
                <span className="text-white/60 text-xs">
                  {suggestedAction.label}
                </span>
              </button>
            </motion.div>
          ))}
      </div>
      <form
        className="flex flex-col gap-2 relative items-center px-4 md:px-0 mb-4"
        onSubmit={wrappedHandleSubmit}
      >
        <div className="relative flex items-center w-full md:max-w-[800px]">
          <textarea
            ref={inputRef}
            rows={4}
            className="w-full resize-none rounded-lg bg-gray-500/20 px-4 py-4 text-sm text-white placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-0 transition-colors duration-200"
            placeholder={
              isLoading ? "Waiting for response..." : "Message Pica..."
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            disabled={isLoading}
          />
          {(status === "submitted" || status === "streaming") && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 right-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-green-800/20 text-gray-400 hover:text-green-500 hover:border-green-500 hover:bg-green-900/20 transition-all duration-300 text-xs shadow-lg hover:shadow-green-900/20"
              onClick={stop}
            >
              Stop
            </motion.button>
          )}
        </div>
        <div className="flex gap-2 w-full md:max-w-[800px] justify-center">
          {messages.length > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-green-800/20 text-gray-400 hover:text-green-500 hover:border-green-500 hover:bg-green-900/20 transition-all duration-300 text-xs shadow-lg hover:shadow-green-900/20"
              onClick={() => window.location.reload()}
            >
              Clear chat
            </motion.button>
          )}
          <motion.a
            href="https://app.picaos.com/connections"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-green-800/20 text-gray-400 hover:text-green-500 hover:border-green-500 hover:bg-green-900/20 transition-all duration-300 text-xs shadow-lg hover:shadow-green-900/20"
          >
            + New Connection
          </motion.a>
        </div>
      </form>
    </div>
  );
}
