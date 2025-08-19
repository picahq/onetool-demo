import Image from "next/image";
import { GitHubIcon, HelpIcon } from "@/components/icons";

export function Header() {
  return (
    <header className="w-full pt-4 px-4 md:px-0 flex-none">
      <div className="flex items-center justify-center max-w-[800px] mx-auto w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <a href="https://picaos.com" target="_blank">
              <Image
                src="/solo-dark.svg"
                alt="Pica Logo"
                width={70}
                height={30}
              />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/picahq/ai"
              target="_blank"
              className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors text-xs"
            >
              <GitHubIcon size={16} />
              <span>picahq/ai</span>
            </a>
            <div className="h-4 w-px bg-green-800/20" />
            <a
              href="https://docs.picaos.com/sdk/vercel-ai"
              target="_blank"
              className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors text-xs bg-green-900/20 px-2 py-1 rounded-md border border-green-800 hover:bg-green-900/40"
            >
              <HelpIcon size={14} />
              <span>Docs</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
