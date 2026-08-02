import Image from "next/image";
import { TOOL_ICONS, type ToolId } from "@/lib/tool-icons";

export function ToolIcon({ tool }: { tool: ToolId }) {
  const icon = TOOL_ICONS[tool];
  return (
    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50">
      <Image
        src={icon.src}
        alt=""
        width={32}
        height={32}
        className="size-8"
      />
    </span>
  );
}
