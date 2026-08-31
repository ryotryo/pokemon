import type { ItemDamageModifier } from "@/lib/champions/damage-chart";

export interface GuideResearchSource {
  id: string;
  title: string;
  author: string;
  season: "M3" | "M4" | "M5";
  achievement?: string;
  url: string;
  checkedAt: "2026-08-30";
  claimIds: string[];
}

export interface GuideDamageSpec {
  id: string;
  attackerPokemonId: string;
  defenderPokemonId: string;
  moveId: string;
  attackerSpreadRank?: number;
  attackerNatureRank?: number;
  attackerAbilityRank?: number;
  attackerItemRank?: number;
  defenderSpreadRank?: number;
  defenderNatureRank?: number;
  defenderAbilityRank?: number;
  defenderItemRank?: number;
  itemDamageModifier?: ItemDamageModifier;
  profileBasis: string;
}

export interface GuideSynergyPair {
  pokemonIds: [string, string] | [string, string, string];
  nickname?: string;
  explanation: string;
  sourceIds: string[];
}

export interface GuideResearchEnhancement {
  articlesReviewed: number;
  saturationNote: string;
  omittedClaims: string[];
  matchupDamage: Record<string, GuideDamageSpec[]>;
  synergyPairs: GuideSynergyPair[];
}

export const guideResearchSources: GuideResearchSource[] = [
  { id: "m4-garchomp-scssor-74", title: "M-4 最終74位 ガブハッサム極", author: "ssrgb_pokemon", season: "M4", achievement: "最終74位", url: "https://pokesol.app/u/srgb_pokemon/articles/709b7b5a3d5f7fb3", checkedAt: "2026-08-30", claimIds: ["garchomp-role", "garchomp-synergy-scssor"] },
  { id: "m4-mimikyu-977", title: "S4 最終977位 レート2257 ミミッキュファンクラブ", author: "やまだ", season: "M4", achievement: "最終977位・レート2257", url: "https://pokesol.app/u/ymd_112_pkmn/articles/9bb2252f445cd15e", checkedAt: "2026-08-30", claimIds: ["mimikyu-role", "mimikyu-speed"] },
  { id: "m4-toxic-relay-240", title: "毒びし×身代わりリレー&鉄壁メタグロス", author: "なべぐらむ", season: "M4", achievement: "最終240位・レート2392", url: "https://pokesol.app/u/nbgrm/articles/d78b7c88fb3258c9", checkedAt: "2026-08-30", claimIds: ["metagross-role", "meowscarada-dragonite-metagross"] },
  { id: "m3-hydreigon-metagross-15", title: "M-3開幕15連勝+マスター無敗到達 サザングロス", author: "poked_221", season: "M3", achievement: "開幕15連勝・マスター無敗到達", url: "https://pokesol.app/u/poked_221/articles/892fbccbd4d20584", checkedAt: "2026-08-30", claimIds: ["hydreigon-metagross-core"] },
  { id: "m3-hydreigon-metagross-2002", title: "M-3 初見ですサザングロス", author: "kurostar", season: "M3", achievement: "レート2002", url: "https://pokesol.app/u/kurostar_rryh/articles/fc241631470c1935", checkedAt: "2026-08-30", claimIds: ["hydreigon-metagross-core"] },
  { id: "m4-hydreigon-metagross-2000", title: "M-4 根源サザングロス", author: "sora_metagross", season: "M4", achievement: "レート2000", url: "https://pokesol.app/u/sora_metagross/articles/f95631a7af8c5adc", checkedAt: "2026-08-30", claimIds: ["hydreigon-metagross-core", "metagross-selections"] },
  { id: "m4-dragonite-aegislash-2388", title: "意表を突いてけカイリューガルド", author: "まつぼっくる", season: "M4", achievement: "最終264位・レート2388", url: "https://pokesol.app/u/matsubokkulu_poke/articles/4384d616d726f399", checkedAt: "2026-08-30", claimIds: ["dragonite-aegislash-core"] },
  { id: "m4-dragonite-aegislash-2015", title: "テンプレカバカイリューガルド", author: "カマクラ", season: "M4", achievement: "レート2015", url: "https://pokesol.app/u/kamakura_poke/articles/17cfd1bfcec4b739", checkedAt: "2026-08-30", claimIds: ["dragonite-aegislash-core", "hippowdon-dragonite-aegislash"] },
  { id: "m4-florges-dragonite-aegislash-840", title: "フロルカイリューガルド", author: "ゆっぴ～", season: "M4", achievement: "マンスリー最終840位", url: "https://pokesol.app/u/yuppy_poke/articles/59e735f9833a7888", checkedAt: "2026-08-30", claimIds: ["dragonite-aegislash-core"] },
  { id: "m5-garchomp-sylveon-gyarados", title: "マンスリーチャレンジ8月 対策貫通ドリル", author: "ace", season: "M5", achievement: "最高1769", url: "https://pokesol.app/u/ace_poke1135/articles/c519952420f6e1a1", checkedAt: "2026-08-30", claimIds: ["garchomp-sylveon-gyarados-core"] },
  { id: "m5-selection-patterns", title: "選出には9つの型がある", author: "wo_chien_moth", season: "M5", url: "https://pokesol.app/u/wo_chien_moth/articles/367c1036f5994855", checkedAt: "2026-08-30", claimIds: ["garchomp-sylveon-gyarados-core", "selection-framework"] },
  { id: "m4-gyarados-complement-263", title: "ペロリーム・ドリーム", author: "haraso", season: "M4", achievement: "マンスリー最終263位", url: "https://pokesol.app/u/haraso_pokemon/articles/872b5dba990e62b2", checkedAt: "2026-08-30", claimIds: ["gyarados-metagross-complement", "gyarados-spread"] },
  { id: "m4-meowscarada-beginner-1983", title: "カバリザマスカーニャ", author: "レイ", season: "M4", achievement: "最高レート1983", url: "https://pokesol.app/u/soujiman27/articles/116866cc76a2955c", checkedAt: "2026-08-30", claimIds: ["meowscarada-role", "hippowdon-lead"] },
  { id: "m4-metagross-iron-defense", title: "後付けフロルバシャ", author: "danjinesu", season: "M4", achievement: "マンスリー最終228位", url: "https://pokesol.app/u/danjinesu/articles/9cbd1436bb8d2bdb", checkedAt: "2026-08-30", claimIds: ["metagross-iron-defense", "metagross-spread"] },
];

const topProfile = (id: string, attackerPokemonId: string, defenderPokemonId: string, moveId: string, itemDamageModifier: ItemDamageModifier = 1): GuideDamageSpec => ({
  id, attackerPokemonId, defenderPokemonId, moveId, itemDamageModifier,
  profileBasis: "M5の現在データにある採用率1位の努力値・性格・特性・持ち物を個別に採用。組み合わせ単位の採用率は公開データから断定できないため、代表条件として表示します。",
});

export const guideResearchBySlug: Record<string, GuideResearchEnhancement> = {
  garchomp: { articlesReviewed: 12, saturationNote: "先発展開・耐久型・スカーフ型の役割と、鋼エースへの接続が複数記事で反復した時点で終了。", omittedClaims: ["メガマフォクシーはふゆうで地面無効になるため、有利対面・ダメージ例から除外した", "ガブハッサムは詳細な役割根拠を1記事で確認したが、独立した複数記事で飽和しなかったため定番コンビ欄には掲載しない", "特定の一型を最頻の完成形とは断定しない"], matchupDamage: { gengar: [topProfile("garchomp-earthquake-gengar", "garchomp", "mega-gengar", "89")], archaludon: [topProfile("garchomp-earthquake-archaludon", "garchomp", "archaludon", "89")] }, synergyPairs: [] },
  primarina: { articlesReviewed: 10, saturationNote: "対ドラゴンのストッパー、オボン込みの打ち合い、鋼への交換という役割が収束。", omittedClaims: ["無傷のカイリューはマルチスケイル補正を既存計算機が扱わないためダメージ例を掲載しない", "同時採用率だけを根拠に相性補完とはしない"], matchupDamage: { garchomp: [topProfile("primarina-moonblast-garchomp", "primarina", "garchomp", "585")] }, synergyPairs: [] },
  meowscarada: { articlesReviewed: 11, saturationNote: "スカーフ先発・とんぼがえり・対ガブリアスの役割が複数記事で一致。", omittedClaims: ["トリプルアクセルは連続技のため記事用数値を掲載しない"], matchupDamage: { primarina: [topProfile("meowscarada-flower-primarina", "meowscarada", "primarina", "870")], hippowdon: [topProfile("meowscarada-flower-hippowdon", "meowscarada", "hippowdon", "870")] }, synergyPairs: [] },
  archaludon: { articlesReviewed: 9, saturationNote: "初手がんじょう型と耐久じきゅうりょく型の二系統、および地面・格闘への弱さが収束。", omittedClaims: ["ミラーコートは固定条件を作りにくいため数値化しない"], matchupDamage: { gyarados: [topProfile("archaludon-thunderbolt-gyarados", "archaludon", "mega-gyarados", "85")] }, synergyPairs: [] },
  mimikyu: { articlesReviewed: 10, saturationNote: "ばけのかわによる切り返し、剣舞＋先制技、鋼への弱さが収束。", omittedClaims: ["ばけのかわ込みの実質耐久を通常ダメージ値へ混ぜない"], matchupDamage: { garchomp: [topProfile("mimikyu-playrough-garchomp", "mimikyu", "garchomp", "583", 1.3)] }, synergyPairs: [] },
  hippowdon: { articlesReviewed: 11, saturationNote: "あくび・ステルスロックからエースへつなぐ型と、回復して残す型の二つに整理。", omittedClaims: ["終了日や欠損日次データから環境推移を推測しない"], matchupDamage: { metagross: [topProfile("hippowdon-earthquake-metagross", "hippowdon", "mega-metagross", "89")] }, synergyPairs: [{ pokemonIds: ["hippowdon", "dragonite", "aegislash"], explanation: "カバルドンでステルスロックとあくびを入れ、カイリューとギルガルドの耐性を使って交代しながらエースを通す、複数記事で『テンプレ』として扱われた並びです。", sourceIds: ["m4-dragonite-aegislash-2015", "m4-florges-dragonite-aegislash-840"] }] },
  gyarados: { articlesReviewed: 12, saturationNote: "メガ前のいかく・地面無効、メガ後のかたやぶり、場作り役との接続が収束。", omittedClaims: ["技枠が異なるため全対面に同じ打点があるとは扱わない"], matchupDamage: { delphox: [topProfile("gyarados-waterfall-delphox", "mega-gyarados", "mega-delphox", "127")] }, synergyPairs: [{ pokemonIds: ["garchomp", "sylveon", "gyarados"], nickname: "ガブニンフギャラドス", explanation: "ガブリアスがステルスロック、ニンフィアがあくびで交代と削りを進め、突破してきた相手をメガギャラドスのりゅうのまいの起点にする展開軸です。複数のM5記事が同じ勝ち筋を明記しています。", sourceIds: ["m5-garchomp-sylveon-gyarados", "m5-selection-patterns"] }] },
  delphox: { articlesReviewed: 10, saturationNote: "高速特殊エース、カバルドンからの安全着地、草結びの技枠判断が収束。", omittedClaims: ["草結びは体重依存で既存計算対象外のため数値を出さない"], matchupDamage: { metagross: [topProfile("delphox-flamethrower-metagross", "mega-delphox", "mega-metagross", "53")] }, synergyPairs: [] },
  dragonite: { articlesReviewed: 13, saturationNote: "物理・特殊の型幅、マルチスケイル温存、ギルガルドとの補完が複数記事で収束。", omittedClaims: ["型が広いためカイリュー全体の最頻完成形は断定しない"], matchupDamage: { corviknight: [topProfile("dragonite-flamethrower-corviknight", "mega-dragonite", "corviknight", "53")] }, synergyPairs: [{ pokemonIds: ["dragonite", "aegislash"], nickname: "カイリューガルド", explanation: "カイリューが苦手なフェアリー・氷・ドラゴン技をギルガルドが受け、ギルガルドが呼ぶ地面技へカイリューを合わせます。複数の独立したM4記事が軸名と基本選出を明記しています。", sourceIds: ["m4-dragonite-aegislash-2388", "m4-dragonite-aegislash-2015", "m4-florges-dragonite-aegislash-840"] }] },
  metagross: { articlesReviewed: 14, saturationNote: "対面型・鉄壁型の両方と、サザンドラによる炎・地面・悪への補完が複数シーズンで反復。", omittedClaims: ["ミミッキュのばけのかわを既存計算機が扱わないため、皮が残る対面の数値は掲載しない", "くさむすびは体重依存のため記事用数値を掲載しない"], matchupDamage: { meowscarada: [topProfile("metagross-bullet-meowscarada", "mega-metagross", "meowscarada", "418")] }, synergyPairs: [{ pokemonIds: ["hydreigon", "metagross"], nickname: "サザングロス", explanation: "サザンドラがメタグロスの苦手な炎・地面・ゴーストへ圧力をかけ、メタグロスがサザンドラを止めるフェアリーを鋼技で処理します。M3〜M4の複数構築で軸名・基本選出として明記されています。", sourceIds: ["m3-hydreigon-metagross-15", "m3-hydreigon-metagross-2002", "m4-hydreigon-metagross-2000"] }] },
};
