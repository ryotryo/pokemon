"use client";
import {
  DEFAULT_DAMAGE_CONDITIONS,
  type DamageConditions,
  type DamageField,
} from "@/lib/champions/damage-engine";
import { getTypeDisplayNameJa } from "@/lib/champions/display-names";
import { TYPE_ORDER } from "@/lib/champions/type-matchup";

const NUMBERS: Array<[keyof DamageConditions, string, number, number]> = [
  ["hpPercent", "残りHP（%）", 1, 100],
  ["hpEv", "攻撃時のH努力値", 0, 252],
  ["attackStage", "攻撃ランク", -6, 6],
  ["specialAttackStage", "特攻ランク", -6, 6],
  ["defenseStage", "防御ランク", -6, 6],
  ["specialDefenseStage", "特防ランク", -6, 6],
  ["speedStage", "素早さランク", -6, 6],
  ["speedEv", "S努力値", 0, 252],
  ["receivedHits", "ふんどのこぶし：被弾回数", 0, 6],
  ["faintedAllies", "倒れた味方数", 0, 5],
  ["positiveStages", "上昇ランク合計（命中・回避も含む）", 0, 42],
  ["stockpiles", "はきだす：たくわえた回数", 0, 3],
  ["hits", "連続技の命中数（0は範囲表示）", 0, 10],
  ["receivedDamage", "反撃技：受けたダメージ", 0, 999],
  ["flingPower", "なげつける：道具の威力", 0, 130],
];
const CHECKS: Array<[keyof DamageConditions, string]> = [
  ["unburden", "かるわざ発動済み"],
  ["tailwind", "おいかぜ"],
  ["grounded", "接地している（うちおとす等）"],
  ["dragonDartsSplit", "ドラゴンアローを相手2匹へ分ける"],
  ["itemRemovable", "道具をはたきおとせる"],
  ["movedLast", "相手より後に行動"],
  ["damagedThisTurn", "このターンにダメージを受けた"],
  ["previousMoveFailed", "前のターンの技が失敗"],
  ["switchedIn", "このターン交代で登場"],
  ["charged", "じゅうでん・でんきにかえる発動済み"],
  ["critical", "急所（確定急所技は自動）"],
  ["disguiseIntact", "ばけのかわが残っている"],
  ["minimized", "ちいさくなる使用済み"],
  ["protect", "まもる状態"],
  ["reflect", "リフレクター"],
  ["lightScreen", "ひかりのかべ"],
  ["auroraVeil", "オーロラベール"],
  ["helpingHand", "てだすけ"],
  ["enhancedMove", "きまぐレーザーの強化が発生"],
  ["sheerForceEligible", "ちからずく対象（技データの手動補正）"],
];
export const DAMAGE_ITEMS = [
  ["none", "道具なし"],
  ["other", "補正のない道具"],
  ["mega-stone", "メガストーン"],
  ["life-orb", "いのちのたま"],
  ["expert-belt", "たつじんのおび"],
  ["muscle-band", "ちからのハチマキ"],
  ["wise-glasses", "ものしりメガネ"],
  ["focus-sash", "きあいのタスキ"],
  ["normal-gem", "ノーマルジュエル"],
  ["choice-scarf", "こだわりスカーフ"],
  ["iron-ball", "くろいてっきゅう"],
  ["light-ball", "でんきだま"],
  ["air-balloon", "ふうせん"],
];
const control =
  "min-w-0 w-full rounded border border-slate-200 bg-white px-1 py-1 text-xs";
export function DamageConditionInputs({
  value,
  onChange,
  abilities,
  isMega = false,
  title = "詳細条件",
}: {
  value: DamageConditions;
  onChange: (c: DamageConditions) => void;
  abilities: string[];
  isMega?: boolean;
  title?: string;
}) {
  const set = (key: keyof DamageConditions, v: string | number | boolean) =>
    onChange({ ...value, [key]: v });
  const select = (
    key: keyof DamageConditions,
    label: string,
    options: string[][],
  ) => (
    <label className="grid gap-1">
      {label}
      <select
        className={control}
        aria-label={label}
        disabled={key === "item" && isMega}
        value={String(value[key])}
        onChange={(e) =>
          set(
            key,
            ["speedNature", "attackNature"].includes(key)
              ? Number(e.target.value)
              : e.target.value,
          )
        }
      >
        {options.map(([v, l]) => (
          <option value={v} key={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <details className="rounded-xl bg-slate-50 p-2 text-left text-[10px] text-slate-600">
      <summary className="cursor-pointer font-bold">{title}</summary>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {select("item", "持ち物", [
          ...DAMAGE_ITEMS,
          ...TYPE_ORDER.map((t) => [
            `resist:${t}`,
            `${getTypeDisplayNameJa(t)}半減きのみ`,
          ]),
          ...TYPE_ORDER.map((t) => [
            `boost:${t}`,
            `${getTypeDisplayNameJa(t)}強化道具`,
          ]),
        ])}
        {select("status", "状態異常", [
          ["none", "なし"],
          ["burn", "やけど"],
          ["poison", "どく"],
          ["toxic", "もうどく"],
          ["paralysis", "まひ"],
          ["sleep", "ねむり"],
          ["freeze", "こおり"],
        ])}
        {select("gender", "性別（とうそうしん）", [
          ["none", "不明・性別なし"],
          ["male", "♂"],
          ["female", "♀"],
        ])}
        {select("form", "現在のフォルム", [
          ["base", "通常・シールド・ナイーブ"],
          ["blade", "ブレード"],
          ["hero", "マイティ"],
          ["hangry", "はらぺこ"],
        ])}
        {select("airborne", "位置", [
          ["none", "通常"],
          ["floating", "浮いている"],
          ["fly", "そらをとぶ中"],
          ["dig", "あなをほる中"],
          ["dive", "ダイビング中"],
        ])}
        {select("speedNature", "S性格", [
          ["1", "補正なし"],
          ["1.1", "上昇"],
          ["0.9", "下降"],
        ])}
        {select("allyAbility", "味方の特性", [
          ["none", "なし"],
          ...[
            "フレンドガード",
            "はがねのせいしん",
            "プラス",
            "マイナス",
            "フェアリーオーラ",
            "テイルアーマー",
            "じょおうのいげん",
            "しめりけ",
            "ノーてんき",
          ].map((x) => [x, x]),
        ])}
        {select("copiedAbility", "コピー・受け継いだ特性", [
          ["", "指定なし"],
          ...abilities.map((x) => [x, x]),
        ])}
        <label className="grid gap-1">
          変化後のタイプ
          <div className="grid gap-1">
            {[0, 1].map((i) => (
              <select
                key={i}
                className={control}
                aria-label={`変化後のタイプ${i + 1}`}
                value={value.changedTypes.split(",")[i] ?? ""}
                onChange={(e) => {
                  const types = value.changedTypes.split(",");
                  types[i] = e.target.value;
                  set("changedTypes", types.filter(Boolean).join(","));
                }}
              >
                <option value="">{i === 0 ? "元のタイプ" : "2つ目なし"}</option>
                {TYPE_ORDER.map((t) => (
                  <option key={t} value={t}>
                    {getTypeDisplayNameJa(t)}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </label>
        {NUMBERS.map(([key, label, min, max]) => (
          <label className="grid gap-1" key={key}>
            {label}
            <input
              className={control}
              type="number"
              min={min}
              max={max}
              value={Number(value[key])}
              onChange={(e) =>
                set(key, Math.max(min, Math.min(max, Number(e.target.value))))
              }
            />
          </label>
        ))}
        <label className="grid gap-1">
          ふくろだたき：参加者の攻撃種族値
          <input
            className={control}
            value={value.beatUpAttacks}
            placeholder="例：100,120,80"
            onChange={(e) => set("beatUpAttacks", e.target.value)}
          />
        </label>
        {CHECKS.map(([key, label]) => (
          <label className="flex items-start gap-1" key={key}>
            <input
              type="checkbox"
              checked={Boolean(value[key])}
              onChange={(e) => set(key, e.target.checked)}
            />
            {label}
          </label>
        ))}
        <button
          type="button"
          className="col-span-2 rounded border p-1"
          onClick={() =>
            onChange({
              ...DEFAULT_DAMAGE_CONDITIONS,
              item: isMega ? "mega-stone" : "none",
            })
          }
        >
          詳細条件をリセット
        </button>
      </div>
    </details>
  );
}
export function DamageFieldInputs({
  value,
  onChange,
}: {
  value: DamageField;
  onChange: (f: DamageField) => void;
}) {
  return (
    <details className="mt-3 rounded-xl bg-slate-50 p-2 text-xs">
      <summary className="cursor-pointer font-bold">
        天候・フィールド・ダブルの条件
      </summary>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label>
          現在の天候
          <select
            className={control}
            aria-label="現在の天候"
            value={value.weather}
            onChange={(e) => onChange({ ...value, weather: e.target.value })}
          >
            {[
              ["none", "なし"],
              ["sun", "晴れ"],
              ["rain", "雨"],
              ["sand", "砂嵐"],
              ["snow", "雪"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label>
          現在のフィールド
          <select
            className={control}
            aria-label="現在のフィールド"
            value={value.terrain}
            onChange={(e) => onChange({ ...value, terrain: e.target.value })}
          >
            {[
              ["none", "なし"],
              ["electric", "エレキ"],
              ["grass", "グラス"],
              ["psychic", "サイコ"],
              ["misty", "ミスト"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label>
          全体技の対象数
          <select
            className={control}
            aria-label="全体技の対象数"
            value={value.targets}
            onChange={(e) =>
              onChange({ ...value, targets: Number(e.target.value) })
            }
          >
            <option value={1}>1匹</option>
            <option value={2}>2匹以上</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={value.gravity}
            onChange={(e) => onChange({ ...value, gravity: e.target.checked })}
          />
          じゅうりょく
        </label>
        <label>
          <input
            type="checkbox"
            checked={value.fairyAura}
            onChange={(e) =>
              onChange({ ...value, fairyAura: e.target.checked })
            }
          />
          場にフェアリーオーラ
        </label>
      </div>
      <p className="mt-2 text-slate-500">
        天候・フィールドを起こす特性は、登場順を含めた現在の状態を指定してください。能力変化を起こす特性は発動後のランクを指定します。
      </p>
    </details>
  );
}
