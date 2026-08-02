import Image from "next/image";
import { TOOL_ICONS, type ToolId } from "@/lib/tool-icons";

export function ToolIcon({ tool }: { tool: ToolId }) {
  const icon = TOOL_ICONS[tool];
  return (
    <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50">
      <Image
        src={icon.src}
        alt=""
        width={24}
        height={24}
        style={{ width: icon.displaySize, height: icon.displaySize, imageRendering: "pixelated" }}
      />
    </span>
  );
}
