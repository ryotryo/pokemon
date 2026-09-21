import type { ReactNode } from "react";

function DiagramFrame({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return <figure className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-label={title}>
    <div className="border-b border-slate-100 bg-slate-50 px-4 py-2"><p className="text-[10px] font-black tracking-wide text-blue-700">図で見る</p><h2 className="text-sm font-black text-slate-800">{title}</h2></div>
    <div className="p-3 sm:p-4">{children}</div>
    <figcaption className="border-t border-slate-100 px-4 py-2 text-[11px] leading-5 text-slate-500">{caption}</figcaption>
  </figure>;
}

function MiniCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-center text-slate-800"><p className="text-[10px] font-bold text-slate-500">{label}</p><p className="mt-0.5 text-sm font-black">{value}</p>{note ? <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{note}</p> : null}</div>;
}

function Arrow({ label = "↓" }: { label?: string }) { return <div aria-hidden="true" className="py-1 text-center text-sm font-black text-blue-600">{label}</div>; }

export function HpBar({ current, max, label }: { current: number; max: number; label?: string }) {
  const percentage = Math.max(0, Math.min(100, current / max * 100));
  return <div><div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-bold text-slate-600"><span>{label ?? "HP"}</span><span>{current} / {max}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${percentage}%` }} /></div></div>;
}

const diagramRenderers = {
  "type-matchup": () => <DiagramFrame title="タイプ相性の倍率" caption="複合タイプでは、2つの相性を掛け合わせます。"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><MiniCard label="弱点" value="2倍"/><MiniCard label="等倍" value="1倍"/><MiniCard label="いまひとつ" value="1/2倍"/><MiniCard label="無効" value="0倍"/></div></DiagramFrame>,
  stab: () => <DiagramFrame title="タイプ一致と弱点は別々に重なる" caption="使う側のタイプ一致と、受ける側の弱点を順に考えます。"><div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1"><MiniCard label="タイプ一致" value="1.5倍"/><span className="text-slate-400">×</span><MiniCard label="弱点" value="2倍"/><span className="text-slate-400">＝</span><MiniCard label="合計" value="3倍"/></div></DiagramFrame>,
  "move-categories": () => <DiagramFrame title="技の分類と使う能力" caption="矢印の左が攻撃側、右が受ける側の能力です。変化技は直接ダメージを与えません。"><div className="grid gap-2 sm:grid-cols-3"><MiniCard label="物理技" value="攻撃 → 防御"/><MiniCard label="特殊技" value="特攻 → 特防"/><MiniCard label="変化技" value="補助・妨害"/></div></DiagramFrame>,
  stats: () => <DiagramFrame title="6つの能力のつながり" caption="HPは物理・特殊のどちらを受けるときにも使い、素早さは通常の行動順を決めます。"><div className="grid grid-cols-2 gap-2"><MiniCard label="物理ダメージ" value="攻撃 → 防御" note="A → B"/><MiniCard label="特殊ダメージ" value="特攻 → 特防" note="C → D"/><MiniCard label="両方の耐久" value="HP" note="H"/><MiniCard label="行動順" value="素早さ" note="S"/></div></DiagramFrame>,
  "speed-order": () => <DiagramFrame title="通常の行動順" caption="同じ優先度の技同士なら、素早さが高い方から動きます。"><MiniCard label="先に行動" value="A　素早さ 120"/><Arrow/><MiniCard label="後に行動" value="B　素早さ 100"/></DiagramFrame>,
  "stat-stage": () => <DiagramFrame title="能力ランクの倍率" caption="攻撃・防御・特攻・特防・素早さの基本倍率です。"><div className="grid grid-cols-4 gap-1.5"><MiniCard label="-1" value="2/3倍"/><MiniCard label="±0" value="1倍"/><MiniCard label="+1" value="3/2倍"/><MiniCard label="+2" value="2倍"/></div></DiagramFrame>,
  matchup: () => <DiagramFrame title="対面で見る3つの入口" caption="タイプだけで決めず、素早さと残りHPも一緒に確認します。"><div className="grid grid-cols-3 gap-2"><MiniCard label="1" value="タイプ相性"/><MiniCard label="2" value="行動順"/><MiniCard label="3" value="残りHP"/></div></DiagramFrame>,
  "damage-factors": () => <DiagramFrame title="ダメージが決まる流れ" caption="これらが順に重なり、最後に乱数によるダメージ幅ができます。"><MiniCard label="1　土台" value="威力・攻撃側と防御側の能力"/><Arrow/><MiniCard label="2　主な補正" value="タイプ一致・タイプ相性"/><Arrow/><MiniCard label="3　その他" value="天候・特性・持ち物"/><Arrow/><MiniCard label="4　最終的な幅" value="乱数"/></DiagramFrame>,
  "ko-count": () => <DiagramFrame title="確1・確2・乱1" caption="回復や別のダメージがない、単純な例です。"><div className="grid gap-3 sm:grid-cols-3"><div><p className="mb-1 text-xs font-black">確1</p><HpBar current={100} max={100}/><Arrow label="攻撃1回"/><HpBar current={0} max={100}/></div><div><p className="mb-1 text-xs font-black">確2</p><HpBar current={100} max={100}/><Arrow label="攻撃1回"/><HpBar current={40} max={100}/><Arrow label="攻撃2回"/><HpBar current={0} max={100}/></div><div><p className="mb-1 text-xs font-black">乱1</p><MiniCard label="ダメージ幅" value="90〜110" note="倒せる時と残る時がある"/></div></div></DiagramFrame>,
  "speed-tie": () => <DiagramFrame title="同じ速さなら先攻はランダム" caption="前のターンに先だった側が、次も先とは限りません。"><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><MiniCard label="A" value="素早さ 120"/><span className="text-xs font-black text-blue-700">ランダム</span><MiniCard label="B" value="素早さ 120"/></div></DiagramFrame>,
  priority: () => <DiagramFrame title="行動順の判定" caption="優先度が同じときに、初めて素早さを比べます。"><MiniCard label="最初に比較" value="技の優先度"/><Arrow/><MiniCard label="同じなら比較" value="素早さ"/></DiagramFrame>,
  "trick-room": () => <DiagramFrame title="通常時とトリックルーム中" caption="どちらも技の優先度が同じ場合。優先度そのものは逆転しません。"><div className="grid grid-cols-2 gap-2"><MiniCard label="通常時" value="速い → 遅い"/><MiniCard label="トリックルーム中" value="遅い → 速い"/></div></DiagramFrame>,
  weather: () => <DiagramFrame title="4つの天候" caption="天候ごとに強くなるものが違います。別の天候が始まると上書きされます。"><div className="grid grid-cols-2 gap-2"><MiniCard label="晴れ" value="炎 ↑ / 水 ↓"/><MiniCard label="雨" value="水 ↑ / 炎 ↓"/><MiniCard label="砂嵐" value="岩の特防 ↑"/><MiniCard label="雪" value="氷の防御 ↑"/></div></DiagramFrame>,
  sun: () => <DiagramFrame title="晴れの主な補正" caption="タイプ相性とは別にかかる天候の補正です。"><div className="grid grid-cols-2 gap-2"><MiniCard label="ほのお技" value="1.5倍 ↑"/><MiniCard label="みず技" value="1/2倍 ↓"/></div></DiagramFrame>,
  rain: () => <DiagramFrame title="雨の主な補正" caption="かみなり・ぼうふうは通常の命中判定をせず必中になります。"><div className="grid grid-cols-2 gap-2"><MiniCard label="みず技" value="1.5倍 ↑"/><MiniCard label="ほのお技" value="1/2倍 ↓"/></div></DiagramFrame>,
  sandstorm: () => <DiagramFrame title="砂嵐の2つの特徴" caption="対象外タイプや特性など、天候ダメージを受けない例外があります。"><div className="grid grid-cols-2 gap-2"><MiniCard label="多くのポケモン" value="毎ターン 1/16"/><MiniCard label="いわタイプ" value="特防 1.5倍"/></div></DiagramFrame>,
  snow: () => <DiagramFrame title="雪は「あられ」と違う" caption="現在の雪そのものには、毎ターンの一律ダメージはありません。"><div className="grid grid-cols-2 gap-2"><MiniCard label="こおりタイプ" value="防御 1.5倍"/><MiniCard label="全体ダメージ" value="なし"/></div></DiagramFrame>,
  "stealth-rock": () => <DiagramFrame title="いわ相性で受ける割合が変わる" caption="基準の1/8に、いわ技へのタイプ相性を掛けます。"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><MiniCard label="半減" value="1/16"/><MiniCard label="等倍" value="1/8"/><MiniCard label="弱点" value="1/4"/><MiniCard label="4倍弱点" value="1/2"/></div></DiagramFrame>,
  "hp-parity": () => <DiagramFrame title="HP200とHP201の端数" caption="1/2ダメージを2回受ける例。奇数が常に正解という意味ではありません。"><div className="grid grid-cols-2 gap-3"><div><HpBar current={200} max={200} label="偶数"/><Arrow label="-100 × 2"/><HpBar current={0} max={200}/></div><div><HpBar current={201} max={201} label="奇数"/><Arrow label="-100 × 2"/><HpBar current={1} max={201}/></div></div></DiagramFrame>,
  substitute: () => <DiagramFrame title="みがわりのHP消費" caption="消費量以下のHPでは使えないため、HP200では満タンから3回までです。"><div className="grid grid-cols-2 gap-2"><MiniCard label="最大HP 200" value="消費 50" note="3回後 HP50"/><MiniCard label="最大HP 201" value="消費 50" note="4回後 HP1"/></div></DiagramFrame>,
  leftovers: () => <DiagramFrame title="たべのこしの回復" caption="毎ターン、最大HPの1/16を切り捨てた量だけ回復します。"><HpBar current={120} max={160}/><Arrow label="ターン終了　+10"/><HpBar current={130} max={160}/></DiagramFrame>,
  cycle: () => <DiagramFrame title="サイクルの流れ" caption="4の後、相手が交代すれば再び状況を見て1〜4を繰り返します。"><MiniCard label="1" value="目の前の相手に不利"/><Arrow/><MiniCard label="2" value="攻撃を受けられる味方へ交代"/><Arrow/><MiniCard label="3" value="こちらが有利な対面になる"/><Arrow/><MiniCard label="4" value="攻撃して相手を削る"/></DiagramFrame>,
  "setup-opportunity": () => <DiagramFrame title="隙を準備へ変える" caption="相手が弱いという意味ではなく、その場の組み合わせで生まれる隙です。"><MiniCard label="相手の圧力が小さい" value="自由な1ターン"/><Arrow/><MiniCard label="こちらの準備" value="能力上昇・場作り"/></DiagramFrame>,
  coverage: () => <DiagramFrame title="技が一貫している状態" caption="3匹すべてに等倍以上で通り、無効や大きな半減で止める相手がいない例です。"><MiniCard label="選ぶ技" value="技A"/><Arrow label="残り全体へ"/><div className="grid grid-cols-3 gap-2"><MiniCard label="相手1" value="等倍"/><MiniCard label="相手2" value="弱点"/><MiniCard label="相手3" value="等倍"/></div></DiagramFrame>,
} as const;

export type BattleBasicsDiagramName = keyof typeof diagramRenderers;
export const battleBasicsDiagramNames = Object.freeze(Object.keys(diagramRenderers) as BattleBasicsDiagramName[]);

export function ConceptDiagram({ name }: { name: BattleBasicsDiagramName }) {
  const Diagram = diagramRenderers[name];
  return <Diagram />;
}
