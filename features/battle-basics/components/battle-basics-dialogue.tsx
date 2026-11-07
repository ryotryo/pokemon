import Image from "next/image";
import type { BattleBasicsDialogueTurn } from "@/content/battle-basics";

const expressionIndex = {
  neutral: 0,
  happy: 1,
  surprised: 2,
  thinking: 3,
  confused: 4,
  inspired: 5,
} as const;

export function BattleBasicsDialogue({ turns }: { turns: BattleBasicsDialogueTurn[] }) {
  return <div className="mt-5 space-y-5 sm:space-y-6">
    {turns.map((turn, index) => {
      const professor = turn.speaker === "professor";
      const frame = expressionIndex[turn.expression ?? "neutral"];
      const row = Math.floor(frame / 3) + (professor ? 0 : 2);
      const column = frame % 3;
      return <div key={index} className={`flex items-start gap-2.5 sm:gap-3 ${professor ? "" : "flex-row-reverse"}`}>
        <div aria-hidden="true" className="relative mt-1 size-14 shrink-0 overflow-hidden sm:size-[72px]">
          <Image
            src="/images/battle-basics/dialogue-characters.png"
            alt=""
            width={1086}
            height={1448}
            sizes="(min-width: 640px) 216px, 168px"
            className="pointer-events-none absolute max-w-none"
            style={{ width: "300%", height: "400%", left: `${-column * 100}%`, top: `${-row * 100}%` }}
          />
        </div>
        <div className={`min-w-0 flex-1 ${professor ? "" : "sm:ml-7"}`}>
          <p className={`mb-1.5 px-1 text-[11px] font-bold ${professor ? "text-emerald-800" : "text-right text-amber-900"}`}>
            {professor ? "博士" : "新人トレーナー"}
          </p>
          <div className={`relative rounded-2xl border px-3.5 py-3 sm:px-5 sm:py-4 ${professor ? "border-emerald-100 bg-white" : "border-amber-200/70 bg-amber-50"}`}>
            <span aria-hidden="true" className={`absolute top-4 size-2.5 rotate-45 ${professor ? "-left-1.5 border-b border-l border-emerald-100 bg-white" : "-right-1.5 border-r border-t border-amber-200/70 bg-amber-50"}`} />
            <div className="relative space-y-2 text-sm leading-7 text-slate-800">
              {turn.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </div>;
    })}
  </div>;
}
