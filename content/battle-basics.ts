import type { SiteIconName } from "@/components/ui/site-icon";

export interface BattleBasicsCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  icon: SiteIconName;
}

export interface BattleBasicsSection {
  heading: string;
  bullets?: string[];
  facts?: Array<{ label: string; value: string }>;
  takeaway?: string;
  dialogue: BattleBasicsDialogueTurn[];
}

export interface BattleBasicsDialogueTurn {
  speaker: "professor" | "trainer";
  expression?: "neutral" | "happy" | "surprised" | "thinking" | "confused" | "inspired";
  paragraphs: string[];
}

export type BattleBasicsToolId = "party-check" | "speed-ranking" | "usage-ranking" | "damage-chart" | "move-search" | "pokemon-intro" | "pokemon-roles" | "type-chart";

export interface BattleBasicsArticle {
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  beginnerCourseOrder?: number;
  icon: SiteIconName;
  sections: BattleBasicsSection[];
  relatedArticleSlugs: string[];
  relatedTools: BattleBasicsToolId[];
}

export const battleBasicsCategories: BattleBasicsCategory[] = [
  { id: "getting-started", name: "まず知っておきたいこと", description: "勝ち方や技、能力など、対戦画面を見るための土台です。", order: 1, icon: "book" },
  { id: "damage", name: "ダメージのしくみ", description: "技の威力やタイプが、ダメージへどう関わるかを学びます。", order: 2, icon: "damage" },
  { id: "speed", name: "素早さと行動順", description: "どちらが先に動くのか、その基本を整理します。", order: 3, icon: "speed" },
  { id: "status", name: "状態異常・能力変化", description: "状態異常や能力の上げ下げが、対戦へ与える影響を学びます。", order: 4, icon: "status" },
  { id: "field", name: "場にかかわる効果", description: "天候やフィールドなど、場全体に影響する効果を扱います。", order: 5, icon: "weather" },
  { id: "numbers", name: "HPと数値のちょっとした知識", description: "HPの減り方や回復量など、知ると役立つ数値を扱います。", order: 6, icon: "hp-parity" },
  { id: "strategy", name: "パーティーと対戦の考え方", description: "選出、交代、役割、勝ち筋など、試合の考え方を学びます。", order: 7, icon: "cycle" },
  { id: "terms", name: "対戦でよく見る言葉", description: "対戦記事や会話で使われる言葉を、やさしく読み解きます。", order: 8, icon: "terms" },
];

let nextExtraCourseOrder = 16;
const secondWaveIcons = {
  "damage-basics": "damage",
  "type-effectiveness-damage": "type-matchup",
  "four-times-weakness": "type-matchup",
  "critical-hits": "critical-hit",
  "damage-randomness": "random-range",
  "ko-terms": "ko-count",
  "move-power": "move-power",
  "speed-ties": "speed-tie",
  "move-priority": "priority",
  "priority-moves": "priority-move",
  "speed-changes": "speed-change",
  "trick-room": "trick-room",
  burn: "burn",
  paralysis: "paralysis",
  "poison-and-bad-poison": "poison",
  sleep: "sleep",
  freeze: "weather-snow",
  confusion: "cycle",
  "setup-moves": "setup",
  weather: "weather",
  sun: "weather-sun",
  rain: "weather-rain",
  sandstorm: "weather-sand",
  snow: "weather-snow",
  terrain: "terrain",
  "stealth-rock": "stealth-rock",
  "hp-odd-even": "hp-parity",
  "substitute-hp": "substitute",
  "leftovers-recovery": "recovery",
  cycle: "cycle",
  "setup-fodder": "setup-opportunity",
  "move-consistency": "coverage-path",
} as const satisfies Record<string, SiteIconName>;
function extraArticle(slug:keyof typeof secondWaveIcons,title:string,description:string,categoryId:string,sections:BattleBasicsSection[],relatedArticleSlugs:string[],relatedTools:BattleBasicsToolId[]=[]):BattleBasicsArticle{return{slug,title,description,categoryId,beginnerCourseOrder:nextExtraCourseOrder++,icon:secondWaveIcons[slug],sections,relatedArticleSlugs,relatedTools};}

export const battleBasicsArticles: BattleBasicsArticle[] = [
  {
    slug: "how-to-win", title: "ポケモン対戦ってどうやって勝つの？", description: "対戦の目的と、勝つまでの大まかな流れをゼロから説明します。", categoryId: "getting-started", beginnerCourseOrder: 1, icon: "target",
    sections: [
      { heading: "相手のポケモンをすべて倒せば勝ち", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["博士、ポケモン対戦はどうなったら勝ちなんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ポケモン対戦では、技で相手のHPを減らし、戦えるポケモンをすべて倒すことが基本の勝利条件だよ。HPが0になったポケモンは、その試合では戦えなくなるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["最後に自分のポケモンが少しでも残っていればいいんですね？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["自分のポケモンが1匹でも残り、相手に戦えるポケモンがいなくなれば勝ちだよ。まずはこのゴールだけ覚えれば、対戦画面の見え方が変わるよ。"]}
    ] },
      { heading: "毎ターン、行動を選ぶ", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["毎ターン、ぼくは何を選べばいいんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["自分の番では、技を使うか、控えのポケモンへ交代するかを選ぶんだ。両方のプレイヤーが選び終えると、技の優先度や素早さなどに従って行動するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["とにかく強い技を使えばいいのかな？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["強い技を選び続けるだけでなく、相手が何をしてきそうかを考えて行動を選ぶのが対戦だよ。最初は、相手に効果抜群の技があるかを見るだけでも十分だよ。"]}
    ] },
      { heading: "1匹ずつの勝負ではない", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["目の前の相手を倒せば、それで有利になりますよね？"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["目の前の相手を倒しても、そのために大切なポケモンが弱りすぎると、残りの相手に負けることがあるんだ。反対に、今は少し不利でも、最後に強いポケモンを残せれば逆転できるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["1匹だけじゃなく、選んだチーム全体で考えるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["対戦は、選んだポケモン全体で行うチーム戦だよ。倒す順番や、誰を最後まで残すかも勝敗に関わるよ。"]}
    ], takeaway: "相手を全部倒すのがゴール。技と交代を選び、チーム全体でそのゴールを目指します。" },
    ], relatedArticleSlugs: ["team-selection", "win-condition"], relatedTools: ["pokemon-intro"],
  },
  {
    slug: "team-selection", title: "6匹のポケモンと選出", description: "手持ち6匹から、その試合で戦うポケモンを選ぶ流れを説明します。", categoryId: "strategy", beginnerCourseOrder: 2, icon: "team-selection",
    sections: [
      { heading: "まず6匹でチームを作る", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["6匹でチームを作ったら、毎試合6匹とも出すんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["対戦へ持ち込むチームは6匹だよ。ただし、試合で6匹すべてを必ず使うとは限らないよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["試合に出すポケモンは、いつ決めるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["対戦前にお互いの6匹を確認し、その試合へ出すポケモンを選ぶんだ。これを「選出」と呼ぶよ。"]}
    ] },
      { heading: "対戦形式で出す数が変わる", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["シングルとダブルでは、選ぶ数も違うんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["基本的なランクバトルでは、シングルバトルは6匹から3匹、ダブルバトルは6匹から4匹を選ぶんだ。シングルは場に1匹ずつ、ダブルは場に2匹ずつ出して戦うよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["どんなルールでも、その数で覚えておけばいい？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["ルールによって選出数が異なる場合があるんだ。使用できるポケモンなどを定めたルールを「レギュレーション」と呼ぶので、対戦を始める前に画面の表示も確認しよう。"]}
    ] },
      { heading: "相手の6匹を見て決める", dialogue: [
      {"speaker":"trainer","expression":"confused","paragraphs":["相手の6匹を見ても、何を基準に選べばいいか迷います……。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["相手に水タイプが多ければ草や電気の技を使えるポケモン、素早い相手が多ければ攻撃を受けられるポケモン、というように考えるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手の行動まで全部読み切らないとダメですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["最初から完璧に読む必要はないよ。「この相手に強そうなポケモン」と「困ったときに交代できるポケモン」を入れるところから始めてみよう。"]}
    ], takeaway: "選出は、6匹の中からその相手と戦いやすい組み合わせを選ぶ時間です。" },
    ], relatedArticleSlugs: ["how-to-win", "roles", "matchups"], relatedTools: ["party-check", "pokemon-intro"],
  },
  {
    slug: "type-matchups", title: "タイプ相性ってどう考えればいい？", description: "弱点、等倍、いまひとつ、無効と複合タイプの見方を説明します。", categoryId: "damage", beginnerCourseOrder: 3, icon: "type-matchup",
    sections: [
      { heading: "技のタイプと相手のタイプを比べる", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「こうかばつぐん」とか「いまひとつ」って、何を比べているんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["攻撃技にはタイプがあり、相手のタイプとの組み合わせでダメージが変わるよ。効果抜群なら通常より大きく、いまひとつなら小さくなるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相性が普通のときや、技が効かないときもありますよね？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["相性がない組み合わせは等倍だよ。無効の相手には、その技ではダメージを与えられないんだ。"]}
    ], facts: [{ label: "弱点", value: "2倍" }, { label: "等倍", value: "1倍" }, { label: "いまひとつ", value: "1/2倍" }, { label: "無効", value: "0倍" }] },
      { heading: "複合タイプでは両方を組み合わせる", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手にタイプが2つあったら、どちらを見ればいいんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["相手が2つのタイプを持つときは、両方の相性を掛け合わせるよ。たとえば、ほのお・ひこうタイプにいわ技を使うと、どちらにも効果抜群なので2倍×2倍で4倍になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["片方には強くて、もう片方には弱かったら？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["片方に効果抜群でも、もう片方にいまひとつなら2倍×1/2倍で等倍だよ。見た目だけで決めず、2つのタイプを確認するのが大切だよ。"]}
    ] },
      { heading: "相性は交代を考える合図", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["弱点を突かれそうなときは、どうしたらいいですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["弱点を突かれそうなときは、その技を受けやすい味方へ交代できるよ。逆に、相手の弱点を突けるなら攻める好機だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["タイプさえ有利なら、そのまま攻撃して大丈夫？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["ただし、相手が別タイプの技を覚えていることもあるよ。タイプ相性は大切な出発点だけれど、それだけで必ず勝てるわけではないんだ。"]}
    ], takeaway: "技のタイプと相手の1つまたは2つのタイプを比べ、最終的な倍率を考えます。" },
    ], relatedArticleSlugs: ["same-type-attack-bonus", "matchups", "switching"], relatedTools: ["type-chart", "party-check", "damage-chart"],
  },
  {
    slug: "same-type-attack-bonus", title: "タイプ一致ってなに？", description: "ポケモンと技のタイプが同じときに得られる攻撃の強化を説明します。", categoryId: "damage", beginnerCourseOrder: 4, icon: "type-stab",
    sections: [
      {
        "heading": "自分と同じタイプの技は強くなる",
        "dialogue": [
          {
            "speaker": "trainer",
            "expression": "thinking",
            "paragraphs": [
              "博士！ 同じ「かえんほうしゃ」でも、使うポケモンによって強さが変わるんですか？"
            ]
          },
          {
            "speaker": "professor",
            "expression": "neutral",
            "paragraphs": [
              "変わるよ。ポケモンの能力も関係するけれど、まず覚えてほしいのが「タイプ一致」なんだ。",
              "ポケモン自身のタイプと、使う技のタイプが同じなら、その技のダメージは基本的に1.5倍になるよ。"
            ]
          },
          {
            "speaker": "trainer",
            "expression": "inspired",
            "paragraphs": [
              "ほのおタイプのリザードンが、ほのお技を使うと強くなるってこと？"
            ]
          },
          {
            "speaker": "professor",
            "expression": "happy",
            "paragraphs": [
              "そのとおり！ リザードンの「かえんほうしゃ」はタイプ一致になるね。",
              "リザードンはほのお・ひこうタイプだから、ひこう技もタイプ一致。2つのタイプのどちらでも大丈夫だよ。"
            ]
          },
          {
            "speaker": "trainer",
            "expression": "neutral",
            "paragraphs": [
              "じゃあ、ノーマル技を使ったときは？"
            ]
          },
          {
            "speaker": "professor",
            "expression": "neutral",
            "paragraphs": [
              "リザードン自身はノーマルタイプではないから、ノーマル技はタイプ一致にならないんだ。"
            ]
          }
        ],
        "takeaway": "ポケモンと技のタイプが同じなら、ダメージは基本的に1.5倍。"
      },
      {
        "heading": "弱点とは別のしくみ",
        "dialogue": [
          {
            "speaker": "trainer",
            "expression": "confused",
            "paragraphs": [
              "タイプ一致って、相手の弱点を突くのと同じことですか？"
            ]
          },
          {
            "speaker": "professor",
            "expression": "neutral",
            "paragraphs": [
              "比べる組み合わせが違うんだ。タイプ一致は「使うポケモンと技」、弱点は「技と相手のポケモン」を比べるよ。",
              "別々のしくみだから、両方が重なることもあるんだ。"
            ]
          },
          {
            "speaker": "trainer",
            "expression": "thinking",
            "paragraphs": [
              "リザードンが、ほのお技が2倍で効く相手へ「かえんほうしゃ」を使ったら……？"
            ]
          },
          {
            "speaker": "professor",
            "expression": "inspired",
            "paragraphs": [
              "タイプ一致の1.5倍と、弱点の2倍が重なるね。ほかの条件が同じなら、合わせて3倍の倍率になるよ。"
            ]
          },
          {
            "speaker": "trainer",
            "expression": "surprised",
            "paragraphs": [
              "1.5倍か2倍のどちらかじゃなくて、かけ算になるんですね！"
            ]
          },
          {
            "speaker": "professor",
            "expression": "happy",
            "paragraphs": [
              "そう！ 「自分と技の組み合わせ」と「技と相手の組み合わせ」を、分けて見るのがコツだよ。"
            ]
          }
        ],
        "facts": [
          {
            "label": "タイプ一致",
            "value": "自分と技を見る"
          },
          {
            "label": "弱点",
            "value": "技と相手を見る"
          }
        ],
        "takeaway": "タイプ一致で2倍の弱点を突くと、倍率は1.5 × 2＝3倍。"
      },
      {
        "heading": "迷ったときの主力技",
        "dialogue": [
          {
            "speaker": "trainer",
            "expression": "happy",
            "paragraphs": [
              "それなら、いつもタイプ一致の技を選べばよさそう！"
            ]
          },
          {
            "speaker": "professor",
            "expression": "thinking",
            "paragraphs": [
              "主力にはしやすいね。ただ、相手に「いまひとつ」ならダメージが下がるよ。",
              "たとえば、ほのお技が半減される相手なら、タイプ一致でも倍率は1.5 × 0.5＝0.75倍になるんだ。"
            ]
          },
          {
            "speaker": "trainer",
            "expression": "thinking",
            "paragraphs": [
              "自分と同じタイプだからって、いつでも一番強いわけじゃないんですね。"
            ]
          },
          {
            "speaker": "professor",
            "expression": "neutral",
            "paragraphs": [
              "うん。技の威力や、攻撃・特攻などの能力によってもダメージは変わるよ。苦手な相手には、別タイプの技が役立つこともあるんだ。",
              "まずは「自分のタイプ → 技のタイプ → 相手のタイプ」の順番で見てみよう。"
            ]
          },
          {
            "speaker": "trainer",
            "expression": "inspired",
            "paragraphs": [
              "わかりました！ タイプ一致になるかと、相手に効きやすいかを分けて考えてみます！"
            ]
          }
        ],
        "takeaway": "タイプ一致は使う側の強化、弱点は受ける側との相性。両方を見て技を選ぼう。"
      }
    ], relatedArticleSlugs: ["type-matchups", "move-categories", "stats"], relatedTools: ["damage-chart", "move-search"],
  },
  {
    slug: "move-categories", title: "物理技・特殊技・変化技ってなに？", description: "3種類の技と、ダメージに使う能力値の違いを説明します。", categoryId: "getting-started", beginnerCourseOrder: 5, icon: "physical-special",
    sections: [
      { heading: "攻撃技には物理と特殊がある", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["物理技と特殊技って、何が違うんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["相手へダメージを与える技は、大きく物理技と特殊技に分かれるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["どの能力を使ってダメージを決めるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["物理技は使う側の「攻撃」と受ける側の「防御」、特殊技は使う側の「特攻」と受ける側の「特防」を主に使ってダメージを決めるんだ。"]}
    ], facts: [{ label: "物理技", value: "攻撃 ↔ 防御" }, { label: "特殊技", value: "特攻 ↔ 特防" }, { label: "変化技", value: "補助や妨害" }] },
      { heading: "タイプだけでは決まらない", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["ほのお技なら全部特殊技、という覚え方でいいですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["同じほのおタイプでも、物理技と特殊技があるんだ。技のタイプを見ただけでは物理か特殊かは分からないんだ。技に表示される分類の印や説明を確認するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["自分のポケモンには、どちらを覚えさせればいいんだろう？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["攻撃が高いポケモンには物理技、特攻が高いポケモンには特殊技が合いやすいけれど、覚える技や役割によって例外もあるよ。"]}
    ] },
      { heading: "変化技も対戦を動かす", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["じゃあ、変化技は何をする技なんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["変化技は、基本的に直接ダメージを与えるための技ではないんだ。能力を上げる、相手を状態異常にする、HPを回復するなど、さまざまな効果があるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["ダメージを与えない技も入れた方がいいのかな？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["攻撃技だけのポケモンより、変化技を混ぜた方が戦いやすいこともあるよ。相手を倒す準備をする技、と考えると分かりやすいね。"]}
    ], takeaway: "物理は攻撃と防御、特殊は特攻と特防。変化技は戦いやすい状況を作ります。" },
    ], relatedArticleSlugs: ["stats", "stat-stages", "abilities"], relatedTools: ["move-search", "pokemon-intro"],
  },
  {
    slug: "stats", title: "HP・攻撃・防御・特攻・特防・素早さってなに？", description: "ポケモンの6つの能力値と、H・A・B・C・D・Sという略称を説明します。", categoryId: "getting-started", beginnerCourseOrder: 6, icon: "stats",
    sections: [
      { heading: "6つの数字が得意・不得意を表す", dialogue: [
      {"speaker":"trainer","expression":"confused","paragraphs":["能力値が6つもあって、どこを見ればいいか迷います。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ポケモンには6つの能力値があるんだ。数字が高いほど、その分野が得意なんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["全部が高いポケモンばかりじゃないんですね？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["全部が高いとは限らず、攻撃が高い、守りが得意、素早いなど、ポケモンごとに個性があるんだ。"]}
    ], bullets: ["HP：攻撃に耐えられる量", "攻撃：物理技で与えるダメージに関わる", "防御：物理技を受ける力", "特攻：特殊技で与えるダメージに関わる", "特防：特殊技を受ける力", "素早さ：原則として行動する順番に関わる"] },
      { heading: "攻めと守りは組になっている", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["攻撃と防御、特攻と特防は、組になっているんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["物理技を使うなら攻撃が高いほど有利で、受ける側は防御が高いほど耐えやすくなるよ。特殊技では特攻と特防の組み合わせだよ。HPは物理・特殊のどちらを受けるときにも使うよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["防御だけ高ければ、どんな攻撃も何度でも受けられる？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["そのため、防御だけ高くてもHPが低ければ何度も受けるのは難しく、攻撃が高くても使う技が特殊技なら、その高さを生かせないことがあるんだ。"]}
    ] },
      { heading: "H・A・B・C・D・Sという略し方", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["対戦記事の「H」とか「S」って何ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["6つの能力を1文字で表す略称だよ。HPはH、攻撃はA、防御はB、特攻はC、特防はD、素早さはSと書くんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["最初からアルファベットで覚えた方がいいのかな？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["最初は日本語名で理解し、慣れてから略称を読めれば十分だよ。"]}
    ], facts: [{ label: "H", value: "HP" }, { label: "A", value: "攻撃" }, { label: "B", value: "防御" }, { label: "C", value: "特攻" }, { label: "D", value: "特防" }, { label: "S", value: "素早さ" }], takeaway: "AとBは物理、CとDは特殊。Hは体力、Sは行動順に関わります。" },
    ], relatedArticleSlugs: ["move-categories", "speed-and-turn-order", "roles"], relatedTools: ["speed-ranking", "pokemon-intro"],
  },
  {
    slug: "speed-and-turn-order", title: "素早さと行動順", description: "素早さが行動順にどう関わり、どんな例外があるのかを説明します。", categoryId: "speed", beginnerCourseOrder: 7, icon: "speed",
    sections: [
      { heading: "原則は素早い方が先", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["どうしたら相手より先に動けるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["お互いが同じ優先度の技を選んだときは、素早さが高いポケモンから行動するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["先に動けると、どんないいことがありますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["先に相手を倒せれば、そのターンは相手の攻撃を受けずにすむことがあるんだ。だから素早さはとても重要なんだ。"]}
    ] },
      { heading: "先制技などの例外がある", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["素早さが高ければ、どの技でも先に使えますよね？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["技には「優先度」があり、優先度が高い技は素早さに関係なく先に出やすくなるよ。でんこうせっかなどが先制技だよ。反対に、後から動く性質の技もあるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["同じ優先度で、素早さも同じだったら？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["同じ優先度で素早さも同じ、いわゆる「同速」の場合は、どちらが先に動くか毎回確定しないんだ。"]}
    ] },
      { heading: "対戦中に順番は変わる", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["最初のターンで先に動けたら、次も先に動けますか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["能力ランク、まひ、特性、持ち物、トリックルームなどによって行動順が変わることがあるんだ。最初に見た素早さだけで、試合中ずっと先に動けるとは限らないよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["まずは、何を覚えておけばいいでしょう？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["まずは「原則は素早い方が先、先制技には注意」と覚えれば十分だよ。詳しい数値を比べたいときは、すばやさランキングを使えるよ。"]}
    ], takeaway: "先に動けば攻撃を受ける前に倒せることがあります。ただし技の優先度が先に比べられます。" },
    ], relatedArticleSlugs: ["stats", "status-conditions", "stat-stages"], relatedTools: ["speed-ranking"],
  },
  {
    slug: "abilities", title: "特性ってなに？", description: "ポケモンが持つ特別な効果と、対戦で確認する意味を説明します。", categoryId: "getting-started", beginnerCourseOrder: 8, icon: "ability",
    sections: [
      { heading: "ポケモンごとの特別な力", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["博士、「特性」って自分で選んで使うんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["特性は、ポケモンが持っている特別な効果だよ。技のように毎ターン選ぶものではなく、条件を満たすと自動で働くものが多いんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["たとえば、どんな効果があるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["場に出たときに天候を変える、特定の技を無効にする、攻撃を受けると能力が上がるなど、内容はさまざまだよ。"]}
    ] },
      { heading: "同じタイプでも動きが変わる", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["同じタイプで能力も似ていたら、戦い方も同じですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["タイプや能力値が似ていても、特性が違えば得意な相手や役割が変わるよ。弱点の技を無効にする特性があれば、タイプ相性だけを見た予想が外れることもあるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手の特性が表示されたら、覚えておいた方がいいんですね？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["相手のポケモンが場に出たときに特性名が表示されたら、その後の行動を考える大切な手がかりだよ。"]}
    ] },
      { heading: "全部を暗記しなくていい", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["特性を全部覚えるのは大変そうです……。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["初めて見る特性は、その場で効果を確認しながら覚えれば十分だよ。まずは、自分の6匹の特性がいつ働き、何を変えるかを知っておこうね。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["自分のポケモンの特性から覚えてみます！"]},
      {"speaker":"professor","expression":"happy","paragraphs":["ポケモン解説では、そのポケモンらしい特性と戦い方を一緒に確認できるよ。"]}
    ], takeaway: "特性は自動で働くことが多い特別な効果。タイプ相性や行動順を変える場合もあります。" },
    ], relatedArticleSlugs: ["held-items", "matchups", "roles"], relatedTools: ["pokemon-intro"],
  },
  {
    slug: "held-items", title: "持ち物ってなに？", description: "ポケモンに持たせる道具が、対戦中にどう働くかを説明します。", categoryId: "getting-started", beginnerCourseOrder: 9, icon: "item",
    sections: [
      { heading: "1匹につき1つ持たせる", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["ポケモンに持たせる道具って、どんなものがあるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ポケモンには、対戦中に効果を発揮する持ち物を1つ持たせられるよ。HPが減ると回復するきのみ、技を強くする道具、素早さを上げる道具などがあるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["使いたいときに、自分で道具を選ぶんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["持ち物は技とは別に働き、条件を満たすと自動で使われるものや、持っている間ずっと効果が続くものがあるんだ。"]}
    ] },
      { heading: "強い代わりに制限もある", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["能力が大きく上がる持ち物なら、迷わず持たせていい？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["大きく能力を高める代わりに同じ技しか選べなくなるなど、強みと欠点がセットの持ち物もあるよ。効果の一部だけでなく、制限まで読むことが大切だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手の持ち物も、最初から分かるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["相手の持ち物は最初から見えないため、与えたダメージや行動順から予想することもあるよ。初心者のうちは、まず自分の持ち物の効果を忘れないようにしよう。"]}
    ] },
      { heading: "役割に合う物を選ぶ", dialogue: [
      {"speaker":"trainer","expression":"confused","paragraphs":["持ち物が多すぎて、何を選べばいいか分かりません。"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["攻撃役には火力や素早さを補う物、攻撃を受ける役には回復や耐久を助ける物が合いやすいよ。ただし正解は1つではないんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["まず、何から考えれば選びやすくなりますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["「このポケモンに何をしてほしいか」を先に考えると、持ち物を選びやすくなるよ。"]}
    ], takeaway: "持ち物は1匹に1つ。強化だけでなく、発動条件や制限も確認します。" },
    ], relatedArticleSlugs: ["abilities", "roles", "win-condition"], relatedTools: ["usage-ranking", "pokemon-intro"],
  },
  {
    slug: "status-conditions", title: "状態異常ってなに？", description: "やけど、まひ、どく、ねむり、こおりで何が困るのかを整理します。", categoryId: "status", beginnerCourseOrder: 10, icon: "status",
    sections: [
      { heading: "しばらく残る不利な状態", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["状態異常になったら、交代すれば治りますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["状態異常は、技や特性などによってポケモンに付く不利な状態だよ。交代しても残るものが多く、治す効果を使うか、対戦中の条件を満たすまで影響が続くよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["やけどとまひが、同時に付くこともあるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["同じポケモンが、やけどとまひのような主要な状態異常に同時になることは基本的にないんだ。"]}
    ] },
      { heading: "まずは何が困るかを知る", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["状態異常って、どれもHPが減るだけですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["状態異常ごとに、HP・火力・素早さ・行動への影響が異なるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["確率や回復のしかたも、今遊んでいる作品で確認するんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["特に確率や回復までの回数は、Pokémon Championsのルールで確認することが大切だよ。"]}
    ], bullets: ["やけど：毎ターンHPが減り、物理技のダメージも下がる", "まひ：素早さが1/2になり、12.5%で技を使えない", "どく：毎ターンHPが減る", "もうどく：経過するほど毎ターンのダメージが増える", "ねむり：1回目は技を使えず、2回目は1/3で起き、3回目は必ず起きる", "こおり：多くの技を使えず、技を使う時に25%で回復し、3回目は必ず回復する"] },
      { heading: "相手を止めるだけではない", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["状態異常にする技は、相手の邪魔をするために使うんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["状態異常は、相手を倒すための時間を作ったり、回復を使わせたりできるよ。逆に、自分の大切な攻撃役がやけどになれば、予定していたダメージを出せなくなるかもしれないね。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["狙えばどんな相手にも状態異常が入るのかな？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["タイプや特性によって、特定の状態異常にならない場合もあるよ。表示された状態と相手の特性を確認しよう。"]}
    ], takeaway: "状態異常は交代しても残りやすく、HP・火力・素早さ・行動を邪魔します。" },
    ], relatedArticleSlugs: ["speed-and-turn-order", "switching", "abilities"], relatedTools: ["pokemon-intro"],
  },
  {
    slug: "stat-stages", title: "能力ランクってなに？", description: "能力が1段階、2段階上がる・下がるとはどういうことかを説明します。", categoryId: "status", beginnerCourseOrder: 11, icon: "stat-stage",
    sections: [
      { heading: "対戦中だけ能力を変える段階", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「攻撃が上がった」って、どれくらい強くなったんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["技や特性で「攻撃が上がった」と表示されると、その試合中の能力に補正がかかるよ。この上げ下げを能力ランクと呼び、通常を0として、上は+6、下は-6まで変化するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["「ぐーんと上がった」も、同じ1段階ですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["「ぐーんと上がった」は2段階など、表示によって変化量が違うんだ。"]}
    ] },
      { heading: "1段階でも影響は大きい", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["1段階上がっただけでも、かなり変わるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["攻撃・防御・特攻・特防・素早さは、0段階では通常どおりの1倍、+1で1.5倍、+2で2倍になるよ。下がる場合は、-1で通常の2/3、-2で1/2だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["攻撃や素早さが上がると、何ができるようになりますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["たとえば攻撃が+2になれば、物理技のダメージを大きく伸ばせるよ。素早さが+1なら、それまで抜けなかった相手より先に動けることがあるんだ。"]}
    ], facts: [{ label: "0", value: "1倍" }, { label: "+1", value: "3/2倍" }, { label: "+2", value: "2倍" }, { label: "-1", value: "2/3倍" }, { label: "-2", value: "1/2倍" }] },
      { heading: "交代すると基本的に元へ戻る", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["能力を上げた後に交代しても、そのまま残りますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["能力ランクは、そのポケモンが控えへ戻ると基本的に0へ戻るんだ。相手が何段階も能力を上げたときは、交代させる技や効果で強化を消せる場合があるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["せっかく上げたなら、交代するか迷いそうです。"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["自分から交代すれば上げた能力も失うため、強化した後にどれだけ攻められるかが大切だよ。"]}
    ], takeaway: "+1は少しではなく1.5倍。能力を上げた後の攻撃と、交代によるリセットを意識します。" },
    ], relatedArticleSlugs: ["move-categories", "speed-and-turn-order", "switching"], relatedTools: ["speed-ranking", "pokemon-intro"],
  },
  {
    slug: "switching", title: "なぜポケモンを交代するの？", description: "不利な場面から逃げ、次に有利な状況を作る交代の意味を説明します。", categoryId: "strategy", beginnerCourseOrder: 12, icon: "switch",
    sections: [
      { heading: "倒される前に控えへ戻す", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["不利な相手が来たら、倒されるまで攻撃するしかないんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["交代を選ぶと、場のポケモンを控えへ戻し、別の味方を出すよ。相手の攻撃を受ける前に交代できれば、弱点を突かれて倒されるのを避けられることがあるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["交代したら、そのターンの攻撃はどうなるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["交代先のポケモンは、そのターンの相手の攻撃を受ける可能性があるんだ。誰なら受けられるかを考える必要があるんだ。"]}
    ] },
      { heading: "交代する主な理由", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["交代するのって、なんだか逃げているみたいで……。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["交代は逃げるだけの行動ではなく、次に攻めやすい場面を作る行動だよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["有利な場面を作るために交代してもいいんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["そのとおり。弱点の技を受けやすい味方に代わったり、後で必要なポケモンを温存したりできるよ。下の例も見てみよう。"]}
    ], bullets: ["不利なタイプの相手から離れる", "攻撃を受けやすい味方へ代わる", "相手へ有利なポケモンを場に出す", "能力低下など、交代で消える効果をリセットする", "残しておきたいポケモンのHPを守る"] },
      { heading: "交代にも代償がある", dialogue: [
      {"speaker":"trainer","expression":"confused","paragraphs":["それなら、困ったら毎回交代すれば安心ですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["交代したターンは、通常そのポケモンが攻撃できないんだ。相手に交代を読まれると、交代先へ強い技を使われることもあるよ。場に出たときにダメージを受ける仕掛けがある場合も注意が必要なんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["最初は、どんなときに交代してみればいいですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["最初は「このまま倒されそうなら、受けられる味方へ代わる」だけで十分だよ。交代を繰り返して有利な場面を作る考え方は、後のサイクルという戦い方につながるよ。"]}
    ], takeaway: "交代は大切なポケモンを守り、有利な相手へ向き合わせるために使います。" },
    ], relatedArticleSlugs: ["type-matchups", "matchups", "roles"], relatedTools: ["party-check", "pokemon-intro"],
  },
  {
    slug: "roles", title: "ポケモンの「役割」ってなに？", description: "チームの中でポケモンが担当する仕事を、代表例から説明します。", categoryId: "strategy", beginnerCourseOrder: 13, icon: "roles",
    sections: [
      { heading: "役割はチームの中での仕事", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["博士、ポケモンの「役割」って何のことですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ポケモンには、攻撃が得意、攻撃を受けるのが得意、味方を助けるのが得意などの違いがあるんだ。チームで担当する仕事を「役割」と呼ぶよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["同じポケモンなら、いつも同じ役割なんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["同じポケモンでも技や持ち物で役割が変わることがあるけれど、まずは何が得意なポケモンかを見ると理解しやすくなるよ。"]}
    ] },
      { heading: "よくある役割", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["役割には、どんな種類があるんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["役割の名前には厳密に1つだけの定義があるとは限らないよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["まずは代表的な仕事のイメージを覚えたいです。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["初心者は次のイメージから始めてみよう。"]}
    ], bullets: ["アタッカー：高い火力で相手を倒す", "受け：高い耐久や回復で攻撃を受け止める", "サポート：状態異常や場の効果で味方を助ける", "エース：準備を整え、終盤に相手を倒し切る中心役", "クッション：いったん攻撃を受け、安全に次の味方へつなぐ"] },
      { heading: "役割を組み合わせる", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["強い攻撃役を6匹そろえたら、強いチームになりますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["全員が攻撃役だと、苦手な相手が出たときに安全な交代先がいないかもしれないね。全員が守る役だと、相手を倒し切れないことがあるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["誰にどの仕事をしてもらうか、決めておくんですね。"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["誰が攻め、誰が受け、誰が味方を助けるかを考えると、6匹を選びやすくなるよ。詳しい役割と該当ポケモンは役割一覧で確認できるよ。"]}
    ], takeaway: "役割はチーム内の仕事。攻める・受ける・助けるを組み合わせます。" },
    ], relatedArticleSlugs: ["team-selection", "switching", "win-condition"], relatedTools: ["pokemon-roles", "pokemon-intro"],
  },
  {
    slug: "matchups", title: "有利対面・不利対面ってなに？", description: "場にいる2匹のどちらが動きやすいかを判断する考え方を説明します。", categoryId: "strategy", beginnerCourseOrder: 14, icon: "matchup",
    sections: [
      { heading: "目の前の組み合わせを「対面」と呼ぶ", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["対戦記事で見る「対面」って何ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["自分と相手の場にいるポケモン同士の組み合わせを「対面」と呼ぶよ。自分が相手を倒しやすく、相手からは倒されにくいなら有利対面。反対なら不利対面だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手に不利な対面になったら、どうしたらいいですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["不利対面では、無理に攻撃せず交代することが選択肢になるよ。"]}
    ] },
      { heading: "タイプだけでは決まらない", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["有利かどうかは、タイプ相性だけで分かりますよね？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["タイプ相性は大きな判断材料だけれど、それだけで有利・不利が決まるわけではないんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["タイプ以外に、どんなところも見ればいいですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["素早さ、残りHP、使える技や特性も見よう。タイプが有利でも、先に倒されそうなら動きやすいとは言えないね。"]}
    ], bullets: ["どちらが先に動くか", "攻撃を何回耐えられるか", "弱点を突ける技を実際に覚えているか", "特性で技を無効にしないか", "状態異常や能力変化が残っていないか"] },
      { heading: "次のターンまで考える", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["今の相手に有利なら、安心して攻撃できますね？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["今の相手に有利でも、相手が交代してくると攻撃が通らないことがあるんだ。不利な相手から交代して、自分が有利な組み合わせを作るのも対戦の基本だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["最初は、何を見て判断すればいいですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["最初は、タイプ相性、素早さ、残りHPの3つを見るだけでも判断しやすくなるよ。経験とともに技や特性も加えていこう。"]}
    ], takeaway: "有利不利はタイプ、速さ、耐久、技、特性を合わせて判断します。" },
    ], relatedArticleSlugs: ["type-matchups", "speed-and-turn-order", "switching"], relatedTools: ["party-check", "pokemon-intro"],
  },
  {
    slug: "win-condition", title: "勝ち筋ってなに？", description: "最後にどうやって相手を倒し切るか、試合のゴールから考える方法を説明します。", categoryId: "strategy", beginnerCourseOrder: 15, icon: "win-condition",
    sections: [
      { heading: "勝つまでの道筋", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「勝ち筋を残す」って、難しそうな言葉ですね……。"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["勝ち筋とは、「最後にどうやって相手を倒し切るか」という道筋だよ。難しい作戦だけを指す言葉ではないんだ。「最後に素早いポケモンで残りを倒す」も立派な勝ち筋だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["試合が始まった後にも、勝ち方を考えるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["試合の途中で、残っているポケモンとHPを見て、自分が勝てそうな形を考えるんだ。"]}
    ] },
      { heading: "簡単な勝ち筋の例", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["最後にエースで攻めたいけど、そのエースに強い相手がいたら？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["自分のエースを止める相手がいるなら、その相手を先に倒すか、エースの攻撃で倒せるところまで削るんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手にすごく速いポケモンがいるときは？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["相手にとても速いポケモンがいるなら、先に倒しておくと、最後に自分の攻撃役が動きやすくなるよ。"]}
    ], bullets: ["苦手な相手を先に削る", "相手の速いポケモンを倒す", "最後に自分のエースを安全に出す", "相手の攻撃を受けられる味方を残す"] },
      { heading: "大切なポケモンを簡単に失わない", dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["目の前の相手を倒せるなら、大切なポケモンも使っていいですよね？"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["目の前の1匹を倒せても、勝つために必要なポケモンまで倒されると、勝ち筋がなくなることがあるんだ。逆に、役目を終えたポケモンで相手の攻撃を受け、エースを安全に出す判断が必要なこともあるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["まずは、試合の前に何を決めておくとよさそうですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["最初は選出時に「この試合は誰で最後に攻めたいか」を1匹決めてみよう。試合中の行動に理由が生まれるよ。"]}
    ], takeaway: "勝ち筋は、最後に誰でどう倒し切るか。そのために必要な相手を削り、味方を残します。" },
    ], relatedArticleSlugs: ["how-to-win", "roles", "matchups"], relatedTools: ["pokemon-roles", "pokemon-intro", "damage-chart"],
  },
  extraArticle("damage-basics","ダメージはどうやって決まる？","攻撃技のダメージに関わる主な要素を、式を使わずに整理します。","damage",[
    {heading:"技と能力値が土台",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["技のダメージって、何をもとに決まるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["物理技なら攻撃と防御、特殊技なら特攻と特防を比べ、技の威力を使って基礎となるダメージが決まるんだ。レベルも計算に関わるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["攻撃が高ければ、どの技でも大ダメージになりますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["攻撃が高くても威力の低い技なら小さくなり、防御が高い相手には同じ技でも通りにくくなるよ。"]}
    ]},
    {heading:"そこへ補正が重なる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["能力値と技の威力が分かれば、ダメージも決まりますよね？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["タイプ一致、弱点やいまひとつ、急所、天候、特性、持ち物などが順に影響するよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["ひとつの数字だけを見ても、分からないんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["1つの数字だけで最終ダメージは決まらないんだ。"]}
    ],bullets:["使う技の威力と分類","攻撃側・防御側の能力","タイプ一致とタイプ相性","特性・持ち物・天候など","最後に幅を作る乱数"]},
    {heading:"同じ技でも毎回少し違う",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["同じ条件なら、毎回同じダメージになるんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["ダメージには乱数による幅があるため、同じ条件でも毎回まったく同じとは限らないよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["確実に倒せるか調べるには、どちらの数字を見ればいい？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["確実に倒せるかは、最大値だけでなく最小値も見るんだ。"]}
    ],takeaway:"威力だけでなく、能力値・タイプ・特性など複数の要素で決まります。"}
  ],["move-categories","same-type-attack-bonus","damage-randomness"],["damage-chart"]),
  extraArticle("type-effectiveness-damage","弱点・いまひとつ・無効でダメージはどう変わる？","タイプ相性の倍率を、実際のダメージへ結び付けて説明します。","damage",[
    {heading:"等倍を基準に考える",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["弱点や半減だと、ダメージはどれくらい変わるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["等倍を1とすると、弱点は2倍、いまひとつは1/2倍、無効は0倍だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["たとえば、等倍で60くらい減る攻撃なら？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["たとえば等倍で約60ダメージなら、ほかの条件が同じとき弱点では約120、半減では約30が目安だよ。"]}
    ]},
    {heading:"無効は少ないダメージではない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「無効」でも、少しくらいダメージは入りますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["無効は0倍なので、その技ではダメージを与えられないんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["無効の例も教えてください！"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["じめん技をひこうタイプへ使う場合などだよ。ただし特性や別の効果で相性が変化する場合があるんだ。"]}
    ]},
    {heading:"表示と交代判断につながる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["効果抜群が出たら、相手を倒せますよね？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["効果抜群でも相手の耐久が高ければ倒し切れず、等倍でも高火力なら大きく減るよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["倍率以外の数字も、一緒に見るんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["倍率は重要だけれど、残りHPや能力値も合わせて考えるんだ。"]}
    ],takeaway:"弱点2倍、半減1/2倍、無効0倍。倍率は最終ダメージを大きく変えます。"}
  ],["type-matchups","four-times-weakness","damage-basics"],["party-check","damage-chart"]),
  extraArticle("four-times-weakness","4倍弱点・4分の1ってなに？","複合タイプでタイプ相性が重なったときの倍率を説明します。","damage",[
    {heading:"2つの相性を掛け合わせる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「4倍弱点」って、普通の弱点と何が違うんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["相手の2つのタイプが両方とも弱点なら、2×2で4倍になるよ。複合タイプは、それぞれの相性を掛け合わせるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["両方のタイプで半減だったら、どうなるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["両方が半減なら、1/2×1/2で1/4倍になるよ。"]}
    ]},
    {heading:"リザードンといわ技の例",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["4倍弱点になるポケモンの例を教えてください！"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ほのお・ひこうのリザードンは、どちらのタイプもいわ技が弱点なので4倍だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["片方に弱くても、もう片方で半減できたら？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["一方、片方が弱点でももう片方が半減なら、2×1/2で等倍になるよ。"]}
    ]},
    {heading:"選出と交代へ大きく影響する",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["4倍弱点があると、どんなことに気をつければいいですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["4倍弱点は大きなダメージになりやすいため、相手がそのタイプの技を使えるか確認するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["逆に、4分の1にできる相手なら安心して出せますか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["1/4なら受けやすい候補だけれど、別タイプの技には注意が必要なんだ。"]}
    ],takeaway:"複合タイプは足し算ではなく掛け算。2つの相性を両方確認します。"}
  ],["type-matchups","type-effectiveness-damage","switching"],["party-check"]),
  extraArticle("critical-hits","急所に当たるとどうなる？","急所の倍率と、能力変化を一部無視する性質を説明します。","damage",[
    {heading:"通常より1.5倍のダメージ",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「急所に当たった！」って出ました。何が起きたんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["攻撃が急所に当たると、通常の1.5倍のダメージになるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["急所は、いつ起きるか分からないんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["毎回起きるものではないけれど、急所に当たりやすい技や、必ず急所に当たる技もあるよ。"]}
    ]},
    {heading:"不利な能力変化を一部無視する",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["防御を上げたのに、急所ですごく減ったのはなぜですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["急所では、攻撃側の下がった攻撃・特攻や、防御側の上がった防御・特防など、急所を弱くする一部の能力ランクを無視して計算するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["急所なら、どんな守りの効果も全部無視できる？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["すべての効果を無視するわけではないんだ。"]}
    ]},
    {heading:"安全だと思った場面が変わる",dialogue: [
      {"speaker":"trainer","expression":"inspired","paragraphs":["耐えられると思っていたのに、急所で倒されることもあるんですね。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["防御を上げて耐える予定でも、急所なら想定より大きく減ることがあるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["毎回、急所におびえていた方がいいんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["低い確率だけを恐れすぎず、起きる可能性があると知っておこうね。"]}
    ],takeaway:"急所は1.5倍。一部の不利な能力ランクを無視するため、守りを崩すことがあります。"}
  ],["damage-basics","stat-stages","damage-randomness"],["damage-chart"]),
  extraArticle("damage-randomness","ダメージの「乱数」ってなに？","同じ攻撃でもダメージに幅がある理由を説明します。","damage",[
    {heading:"ダメージは85〜100%の範囲で揺れる",dialogue: [
      {"speaker":"trainer","expression":"surprised","paragraphs":["同じ技なのに、さっきとダメージが違いました！"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ほかの条件が同じでも、最後に85%から100%の範囲の乱数補正がかかるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["同じ相手でも、少しずつ数字が変わるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["そのため、同じ技を同じ相手へ使っても少し違う数字になるよ。"]}
    ]},
    {heading:"最大だけでは倒せると言えない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["HP100の相手に90〜106ダメージなら、倒せますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ダメージ幅が90〜106なら、HP100の相手を倒せる回と倒せない回があるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["必ず倒せると言えるのは、どんなときですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["これが乱数で倒せる状態だよ。最小でも100以上なら必ず倒せるよ。"]}
    ]},
    {heading:"幅で判断する",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["最大ダメージが出ると信じて攻撃すればいいのかな？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["実戦では、最高ダメージを期待するより、低いダメージでも足りるかを考えると安全だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["何回も攻撃するときは、同じ乱数が続くんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["複数回攻撃する場合は、そのたびに乱数が決まるんだ。"]}
    ],takeaway:"同じ条件でもダメージには幅があります。最小値と最大値の両方を見ます。"}
  ],["damage-basics","ko-terms","critical-hits"],["damage-chart"]),
  extraArticle("ko-terms","確1・確2・乱1ってなに？","ダメージ計算で使われる確定数と乱数の言葉を説明します。","terms",[
    {heading:"何回で倒せるかを表す言葉",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["博士、「確1」と「確2」って何ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["確1は確定1発の略で、ダメージが最小でも相手の残りHP以上になり、1回で必ず倒せることだよ。確2は、回復などがなければ2回で必ず倒せることを表すよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手のHPが100なら、具体的にどう見ればいいですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["たとえば相手の残りHPが100なら、最低ダメージが100以上で確1だよ。1回のダメージが必ず50以上100未満なら、2回分を合わせて倒せるため確2だよ。"]}
    ]},
    {heading:"乱1は倒せる場合と残る場合がある",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「乱1」は、「確1」とは違うんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["乱数1発、略して乱1は、1回で倒せるダメージも出るけれど、低いダメージでは相手が残る状態だよ。倒せる確率が高ければ高乱数、低ければ低乱数と表すことがあるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["HP100に90〜110ダメージだと、どうなりますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["相手の残りHPが100で、ダメージ幅が90〜110なら、100以上を引いたときだけ1回で倒せるよ。このように最小値は届かず最大値は届く範囲が乱1だよ。"]}
    ]},
    {heading:"行動を決める材料",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["確1か乱1かが分かると、何が変わるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["確1なら攻撃を選びやすく、乱1なら倒せなかった場合の反撃も考えるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["倒し切れない場合の反撃も考えるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["ダメージ早見表の範囲を見るときも、最小値が相手のHPへ届くか確認しよう。"]}
    ],takeaway:"確1は必ず1回、確2は必ず2回、乱1は1回で倒せるかが乱数次第です。"}
  ],["damage-randomness","damage-basics","win-condition"],["damage-chart"]),
  extraArticle("move-power","技の威力が高ければ強い技なの？","威力だけでは測れない技の使いやすさを説明します。","damage",[
    {heading:"威力はダメージの大切な土台",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["威力が高い技に入れ替えれば、強くなりますよね？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["同じポケモンが同じ相手へ使い、ほかの条件も同じなら、威力が高い技ほど大きなダメージを与えやすいよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["威力だけで選ぶのは、まだ早い？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["ただし威力だけで優劣は決まらないんだ。"]}
    ]},
    {heading:"命中・反動・追加効果も見る",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["威力以外には、技のどこを見ればいいですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["高威力でも外れやすい、使った後に能力が下がる、反動でHPが減る技があるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["威力が低い技にも、選ぶ理由があるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["威力が低くても、命中が安定する、先に動ける、便利な追加効果を持つといった長所がある技もあるよ。"]}
    ]},
    {heading:"役割に合うかが重要",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["大きな一撃と安定した攻撃、どちらを選べばいいんだろう？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["安定して削りたいなら命中の高い技、一度の好機で倒したいなら高威力技が合うことがあるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["そのポケモンに何をさせたいかで、技も変わるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["そのポケモンが何をしたいかで選ぶんだ。"]}
    ],takeaway:"威力に加え、命中・反動・追加効果・優先度まで見て判断します。"}
  ],["damage-basics","move-categories","priority-moves"],["move-search","pokemon-intro"]),
  extraArticle("speed-ties","同じ素早さだったらどっちが先？","同じ優先度・同じ素早さのときの行動順を説明します。","speed",[
    {heading:"同速では先攻がランダムに決まる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["素早さが同じポケモン同士だと、どちらが先ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["同じ優先度の技を選び、実際の素早さも同じなら、どちらが先に動くかはランダムに決まるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["こういう状態を、何と呼ぶんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["この状態を「同速」と呼ぶよ。"]}
    ]},
    {heading:"一度先でも次も先とは限らない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["さっき先に動けたので、次のターンも先ですよね？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["同速の判定は固定の上下関係ではないんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["一度の順番で決めつけたら危ないんですね。"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["前のターンに先に動いたポケモンが、次のターンも必ず先とは限らないよ。"]}
    ]},
    {heading:"勝敗を運だけにしない工夫",dialogue: [
      {"speaker":"trainer","expression":"confused","paragraphs":["同速勝負に負けたら終わり……という場面が怖いです。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["同速に勝たないと負ける場面を減らすには、先制技を残す、攻撃を耐えられる味方へ交代するなど別の道を用意するよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["運に任せる以外の道も、用意しておくんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["うん。「先に動けなくても勝てるかな？」と考えると、別の選択肢を探しやすくなるよ。"]}
    ],takeaway:"同じ優先度・同じ素早さなら先攻はランダム。毎回同じとは限りません。"}
  ],["speed-and-turn-order","move-priority","switching"],["speed-ranking"]),
  extraArticle("move-priority","技の「優先度」ってなに？","素早さより先に比べられる、技の行動順を説明します。","speed",[
    {heading:"まず優先度、次に素早さ",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["すごく速い相手より先に動けたのは、どうしてですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["行動順は、最初に技の優先度を比べるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["優先度が同じだったら、次に何を比べるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["優先度が高い技が先に動き、同じ優先度の中で素早さを比べるよ。"]}
    ]},
    {heading:"先制技と後から動く技",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["優先度が高い技には、どんなものがありますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["でんこうせっかのような先制技は通常の攻撃技より優先度が高く、素早さが低くても先に動けるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["逆に、後から動きやすい技もあるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["優先度が低く、後から動きやすい技もあるよ。"]}
    ]},
    {heading:"素早さ逆転中でも優先度は別",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["トリックルームなら、優先度も逆になりますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["トリックルームで遅い方が先になりやすい場面でも、技の優先度は先に比べるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["遅い方が先でも、優先度は別に考えるんですね。"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["優先度まで完全に逆になるわけではないんだ。"]}
    ],takeaway:"行動順は優先度を先に比較し、同じなら素早さを比べます。"}
  ],["speed-and-turn-order","priority-moves","speed-ties"],["speed-ranking","move-search"]),
  extraArticle("priority-moves","先制技ってなに？","素早さに関係なく先に動きやすい攻撃技の使い方を説明します。","speed",[
    {heading:"通常技より高い優先度を持つ",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["先制技は、素早さが遅いポケモンでも使えるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["先制技は、通常の技より高い優先度を持つんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["相手より遅くても、先に動けることがあるんですね！"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["相手の方が速くても、優先度で上回れば先に行動できるよ。"]}
    ]},
    {heading:"弱った相手を倒すのが得意",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["先制技って、威力が低そうなのに何が強いんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["先制技は威力が低めでも、残りHPの少ない相手を反撃前に倒せるのが強みだよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["速い相手のHPを少し残してしまったときにも使えそう！"]},
      {"speaker":"professor","expression":"happy","paragraphs":["速い相手への最後の一押しにもなるよ。"]}
    ]},
    {heading:"必ず最初とは限らない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["先制技を選んだら、必ず一番最初に動けますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["相手も先制技を使えば優先度と素早さを比べるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["使うのを止められる場合もあるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["特性や場の効果で先制技を防がれる場合もあるため、「必ず先」とは覚えないようにしよう。"]}
    ],takeaway:"先制技は優先度が高い技。速い相手を倒す手段になりますが、必ず先ではありません。"}
  ],["move-priority","speed-and-turn-order","move-power"],["move-search"]),
  extraArticle("speed-changes","素早さが上がる・下がるとどうなる？","能力ランクによる素早さ変化と行動順への影響を説明します。","speed",[
    {heading:"実際の素早さに倍率がかかる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["素早さが1段階上がると、どれくらい速くなるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["素早さが1段階上がると1.5倍、2段階で2倍になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["すばやさランキングの種族値そのものが変わる？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["1段階下がると2/3倍、2段階で1/2倍だよ。種族値そのものが変わるのではなく、対戦中の実数値へ補正がかかるよ。"]}
    ],facts:[{label:"+1",value:"1.5倍"},{label:"+2",value:"2倍"},{label:"-1",value:"2/3倍"},{label:"-2",value:"1/2倍"}]},
    {heading:"先後関係が途中で変わる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["最初は相手より遅かったけど、途中で追い越せますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["最初は相手より遅くても、素早さを上げれば次のターンから先に動けることがあるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["相手を遅くするのも、味方を助けるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["相手の素早さを下げ、味方全体が先に動きやすくする使い方もあるよ。"]}
    ]},
    {heading:"ほかの補正とも組み合わさる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["素早さのランクだけ見れば、行動順も分かりますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["まひ、持ち物、特性、天候などの補正も行動順に影響するよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["それでも先制技には、追いつけないことがあるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["また優先度の違う技には、素早さだけでは先行できないんだ。"]}
    ],takeaway:"素早さの能力ランクは実数値を変え、試合途中で行動順を逆転させます。"}
  ],["speed-and-turn-order","stat-stages","paralysis"],["speed-ranking"]),
  extraArticle("trick-room","トリックルームってなに？","遅いポケモンから先に動きやすくなる場の効果を説明します。","speed",[
    {heading:"同じ優先度なら遅い方から",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["トリックルームを使うと、遅いポケモンが先に動けるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["トリックルーム中は、同じ優先度の技同士なら素早さが低いポケモンから先に動くよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["普段は遅いポケモンにも、出番を作れるんですね！"]},
      {"speaker":"professor","expression":"happy","paragraphs":["遅いポケモンが活躍しやすくなる効果だよ。"]}
    ]},
    {heading:"優先度まで逆にはならない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["行動順が逆なら、先制技も最後になるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["先制技などの優先度は通常どおり先に比べるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["トリックルームを使うターンや、同速のときはどうなりますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["トリックルーム自体は優先度がとても低いため、使うターンは相手の攻撃を受けてから発動することが多いんだ。同速なら先攻はランダムだよ。"]}
    ]},
    {heading:"使える時間は短い",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["一度トリックルームにしたら、ずっと有利に戦えますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["効果は発動したターンを含めて5ターンだよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["残った時間で攻められるよう、準備も必要ですね。"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["発動後に実際に攻められるターンは限られるため、遅くて火力の高い味方を安全に出す準備が重要なんだ。"]}
    ],takeaway:"遅い順になるのは同じ優先度の中だけ。発動ターンを含め5ターン続きます。"}
  ],["move-priority","speed-ties","speed-and-turn-order"],["speed-ranking","pokemon-intro"]),
  extraArticle("burn","やけどになるとどうなる？","毎ターンのダメージと物理火力低下という2つの影響を説明します。","status",[
    {heading:"毎ターン最大HPの1/16減る",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["やけどになると、いつHPが減るんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["やけど状態では、ターン終了時に最大HPの1/16のダメージを受けるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["交代して控えに戻れば、治りますか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["交代してもやけどは残るため、長く場に出すほどHPを失うよ。"]}
    ]},
    {heading:"多くの物理技が半分の火力になる",dialogue: [
      {"speaker":"trainer","expression":"surprised","paragraphs":["やけどしたら、攻撃のダメージまで減りました！"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["やけどしたポケモンが使う物理技のダメージは基本的に半分になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["特殊技も半分になってしまうんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["特殊技のダメージはこの火力低下を受けないよ。技や特性による例外もあるよ。"]}
    ]},
    {heading:"物理アタッカーには特に重い",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["やけどは、どんな相手に使うと効果的ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["HPを削るだけでなく攻撃力まで落とすため、物理アタッカーを止める手段になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["ほのおタイプも、やけどになるのかな？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["ほのおタイプは基本的にやけど状態にならないよ。"]}
    ],takeaway:"やけどは毎ターン1/16ダメージ＋物理技が基本半減。物理アタッカーに深刻です。"}
  ],["status-conditions","move-categories","switching"],["pokemon-intro"]),
  extraArticle("paralysis","まひになるとどうなる？","素早さ低下と行動不能の可能性を説明します。","status",[
    {heading:"素早さが半分になる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["まひしたら、さっきより後に動くようになりました。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["まひ状態になると素早さは通常の1/2になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["それまで勝っていた相手との順番も変わりますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["それまで先に動けた相手にも、後から動くようになることがあるんだ。"]}
    ]},
    {heading:"12.5%で技を出せない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["まひしていると、技を出せないこともあるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["技を使おうとするたびに12.5%の確率で体がしびれ、そのターンは選んだ技を出せないんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["昔聞いた「25%で動けない」とは違うんですね？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["従来作でよく知られる25%ではなく、Pokémon Championsでは12.5%だよ。"]}
    ]},
    {heading:"速い相手を抑える",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["まひは、どんな相手への対策になりますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["素早さと行動の両方を邪魔するため、速いアタッカーへの対策になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["でんきタイプにも、まひは効くんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["でんきタイプのポケモンは基本的にまひ状態にならないよ。"]}
    ],takeaway:"まひは素早さが1/2。さらに12.5%で技を使えず、先後関係と計画を崩します。"}
  ],["status-conditions","speed-changes","speed-and-turn-order"],["speed-ranking"]),
  extraArticle("poison-and-bad-poison","どくともうどくは何が違う？","固定的に減るどくと、徐々に大きくなるもうどくを比べます。","status",[
    {heading:"どくは毎ターン1/8",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["どく状態では、どれくらいHPが減るんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["通常のどく状態では、ターン終了時に最大HPの1/8のダメージを受けるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["毎回同じ割合でも、放っておくと危ないですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["同じ割合で減り続けるため、回復しないと少しずつ追い込まれるよ。"]}
    ]},
    {heading:"もうどくは毎ターン増える",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["もうどくも、普通のどくと同じ減り方ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["もうどくは最初が最大HPの1/16、その後は2/16、3/16と、場に居続けるほどターン終了時のダメージが増えるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["交代すると、増えたダメージはどうなりますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["交代すると増加の段階はリセットされるけれど、もうどく状態自体は残るよ。"]}
    ]},
    {heading:"居座る相手への圧力",dialogue: [
      {"speaker":"trainer","expression":"inspired","paragraphs":["回復しながら戦う相手には、もうどくがよさそうですね。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["回復しながら長く場にいる相手ほど、もうどくの増加が重くなるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["どくにならないタイプもいるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["どく・はがねタイプは基本的にどく状態にならないよ。"]}
    ],takeaway:"どくは毎ターン1/8。もうどくは1/16ずつ段階的に増え、交代で増加段階が戻ります。"}
  ],["status-conditions","switching"],["pokemon-intro"]),
  extraArticle("sleep","ねむりになるとどうなる？","眠っている間の行動制限と、起きるまでの考え方を説明します。","status",[
    {heading:"多くの技を使えなくなる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["ねむり状態になると、何もできなくなるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ねむり状態では、いびき・ねごと以外の技を基本的に使えないんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["起きるまでの回数は、いつ進むんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["起きる判定は、そのポケモンが技を使おうとする時に進むよ。"]}
    ]},
    {heading:"2回目は1/3、3回目は必ず起きる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["眠ったポケモンは、何回目で起きるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ねむり状態になってから1回目は起きられず、技を使えないんだ。2回目は1/3の確率で起き、3回目は必ず起きるよ。最初に眠れなかった回を含めて数えるのがポイントだよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["回復技の「ねむる」で眠った場合も同じですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["技の「ねむる」で眠った場合は、通常のランダムな回復とは異なり、3回目まで回復しないんだ。"]}
    ]},
    {heading:"交代しても眠りは残る",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["控えに戻したら、目を覚ましますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["控えへ戻しても、ねむり状態は治らないんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["場に残すか、別の味方で戦うかを考えるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["眠ったポケモンを残すか、別の味方で戦うかを考えるんだ。特性や場の効果で眠りを防げる場合もあるよ。"]}
    ],takeaway:"通常のねむりは1回目に行動不可、2回目は1/3で起床、3回目は必ず起床します。"}
  ],["status-conditions","switching","abilities"],["pokemon-intro"]),
  extraArticle("setup-moves","「積み技」ってなに？","能力を上げ、次の攻撃を強くする準備技を説明します。","status",[
    {heading:"能力を上げる変化技",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["対戦でいう「積み技」って何ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["自分の攻撃・特攻・素早さ・防御などを上げる技を、対戦では「積み技」と呼ぶよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["どんな技があるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["つるぎのまいやりゅうのまいなどが代表例だよ。"]}
    ]},
    {heading:"1ターン使って後を強くする",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["攻撃せずに能力を上げている間、倒されませんか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["積み技を使ったターンは直接攻撃しないことが多い代わりに、その後の攻撃や耐久を強くできるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["相手の攻撃が痛くない場面を選ぶんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["相手が大きなダメージを与えにくい隙に使うのが基本だよ。"]}
    ]},
    {heading:"交代すると基本的に失う",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["能力を上げてから交代して、後で戻ってきてもいいですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["上げた能力ランクは交代すると基本的に元へ戻るんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["準備を生かせる場面で使うのが大事なんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["積んでもすぐ交代させられたり、倒されたりすると準備が無駄になるため、使う場面が重要なんだ。"]}
    ],takeaway:"積み技は1ターンを準備に使い、その後の突破力や耐久を高めます。"}
  ],["stat-stages","roles","win-condition"],["pokemon-roles","pokemon-intro"]),
  extraArticle("weather","天候ってなに？","場全体へ影響する晴れ・雨・砂嵐・雪の共通ルールを説明します。","field",[
    {heading:"場全体に影響する効果",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["対戦中に雨や雪が出ました。どんな効果なんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["天候は、技や特性で変化する場全体の状態だよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["晴れ・雨・砂嵐・雪で、変わることも違うんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["晴れ・雨・砂嵐・雪があり、技の威力、命中、能力、特性などへ天候ごとの影響を与えるよ。"]}
    ]},
    {heading:"通常は5ターン続く",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["天候は、いつまで続くんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["技や特性で発生した天候は基本的に5ターン続くよ。対応する持ち物を持つポケモンが発生させると8ターンになる場合があるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["途中で別の天候になったら、両方の効果が出ますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["別の天候が始まれば上書きされるよ。"]}
    ]},
    {heading:"利用する側とされる側がいる",dialogue: [
      {"speaker":"trainer","expression":"inspired","paragraphs":["天候で強くなるポケモンを集めたら、戦いやすそう！"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["天候で強くなる技や特性をそろえるとチームの戦い方になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["自分が出した天候でも、相手を助けることがあるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["一方、相手も同じ天候の恩恵を受けることがあるため、場の表示と残りターンを確認するよ。"]}
    ],takeaway:"天候は場全体へ影響し、基本5ターン。別の天候で上書きできます。"}
  ],["sun","rain","sandstorm","snow"],["pokemon-intro"]),
  extraArticle("sun","晴れになると何が起こる？","晴れで変わる炎・水技、技の動き、特性を説明します。","field",[
    {heading:"炎は1.5倍、水は半分",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["晴れていると、ほのお技は強くなるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["晴れ中は、ほのおタイプの技のダメージが1.5倍、みずタイプの技は1/2になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["タイプ相性とは、別に計算するんですね？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["タイプ相性とは別にかかる天候の補正だよ。"]}
    ]},
    {heading:"一部の技が使いやすくなる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["晴れで使いやすくなる技もありますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ソーラービームなどは通常必要な溜めを省いて攻撃できるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["逆に、当たりにくくなる技もあるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["反対に、かみなりやぼうふうは命中しにくくなるよ。技ごとの説明も確認しよう。"]}
    ]},
    {heading:"特性で速さや回復も変わる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["晴れのチームは、ほのおタイプだけで作るんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ようりょくそのように晴れで素早さが上がる特性や、晴れで効果が変わる回復技があるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["どのポケモンが晴れを利用できるか、見るんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["炎技だけでなく、どのポケモンが天候を利用するかが大切だよ。"]}
    ],takeaway:"晴れは炎技1.5倍・水技半減。技や特性にも個別の変化があります。"}
  ],["weather","rain","speed-changes"],["pokemon-intro","move-search"]),
  extraArticle("rain","雨になると何が起こる？","雨で変わる水・炎技、命中、特性を説明します。","field",[
    {heading:"水は1.5倍、炎は半分",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["雨が降ると、みず技とほのお技はどうなりますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["雨中は、みずタイプの技のダメージが1.5倍、ほのおタイプの技は1/2になるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["みず技で攻めるチームには、追い風になりそう！"]},
      {"speaker":"professor","expression":"happy","paragraphs":["水技を主力にするポケモンが攻めやすくなるよ。"]}
    ]},
    {heading:"かみなり・ぼうふうが必中になる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["外れやすい「かみなり」も、雨なら当てやすいんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["雨中は、かみなりとぼうふうが通常の命中判定をせず必中になるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["天候で、技の使いやすさまで変わるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["高威力だけれど外れることがある技を、安定して使えるのが利点だよ。"]}
    ]},
    {heading:"すいすい等の特性が働く",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["雨で速くなる特性もあると聞きました。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["すいすいは雨中に素早さが上がる特性だよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["雨を起こす役と、雨で攻める役を組み合わせるんですね！"]},
      {"speaker":"professor","expression":"happy","paragraphs":["雨を起こす役と、雨を利用して攻める役を組み合わせると、短いターンで大きな圧力をかけられるよ。"]}
    ],takeaway:"雨は水技1.5倍・炎技半減。かみなり・ぼうふうや雨対応特性も強化します。"}
  ],["weather","sun","speed-changes"],["pokemon-intro","move-search"]),
  extraArticle("sandstorm","砂嵐になると何が起こる？","毎ターンのダメージと岩タイプの特防上昇を説明します。","field",[
    {heading:"多くのポケモンが毎ターン1/16減る",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["砂嵐でHPが減るポケモンと、減らないポケモンがいます。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["砂嵐中は、いわ・じめん・はがねタイプ以外のポケモンがターン終了時に最大HPの1/16のダメージを受けるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["タイプ以外にも、ダメージを防ぐ方法はありますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["特性などで受けない場合もあるよ。"]}
    ]},
    {heading:"岩タイプの特防が1.5倍",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["いわタイプは、砂嵐で守りも強くなるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["砂嵐中はいわタイプのポケモンの特防が1.5倍になるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["特殊技に強くなって、砂のダメージも受けないんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["特殊技を受けやすくなり、天候ダメージも受けないため砂嵐と相性がよいタイプだよ。"]}
    ]},
    {heading:"削りと特性を利用する",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["砂嵐の少しずつのダメージは、どう使えばいいですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["毎ターンの小さなダメージで相手を倒せる範囲へ入れたり、すなかきなど砂嵐で働く特性を使ったりするよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["砂嵐で働く特性や、効果時間も確認したいです。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["すなかきなどの特性も確認してみよう。砂嵐は通常5ターン続くよ。"]}
    ],takeaway:"砂嵐は対象外タイプ以外へ毎ターン1/16。岩タイプの特防を1.5倍にします。"}
  ],["weather","snow","hp-odd-even"],["pokemon-intro"]),
  extraArticle("snow","雪になると何が起こる？","氷タイプの防御上昇と、雪を条件にする技・特性を説明します。","field",[
    {heading:"氷タイプの防御が1.5倍",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["雪になると、こおりタイプは強くなるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["雪の間は、こおりタイプのポケモンの防御が1.5倍になるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["防御が上がると、物理技に耐えやすいんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["物理技を受けやすくなるため、普段とは耐え方が変わるよ。"]}
    ]},
    {heading:"雪そのものに毎ターンダメージはない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["雪でも、砂嵐みたいに毎ターンHPが減りますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["過去作品の「あられ」と違い、現在の雪はターン終了時にポケモンへ一律のダメージを与えないんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["昔の「あられ」と同じつもりで考えない方がいいんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["砂嵐との大きな違いだよ。"]}
    ]},
    {heading:"技と特性の条件になる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["雪を使うチームでは、ほかに何を利用できますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["オーロラベールは雪のときに使え、味方が受けるダメージを減らすんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["雪で働く特性や、残りターンも大切ですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["ゆきかきなど雪で働く特性もあるよ。通常は5ターン続くよ。"]}
    ],takeaway:"雪は氷タイプの防御を1.5倍にし、毎ターンダメージは与えません。"}
  ],["weather","sandstorm","speed-changes"],["pokemon-intro","move-search"]),
  extraArticle("terrain","フィールドってなに？","地面にいるポケモンへ影響する4種類の場の効果を説明します。","field",[
    {heading:"地面にいるポケモンへ働く",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["天候とフィールドって、何が違うんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["フィールドは場全体の地面を変える効果で、基本的に地面にいるポケモンへ影響するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["地面にいないポケモンは、効果を受けないこともある？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["ひこうタイプや、地面から浮く特性などを持つポケモンは効果を受けない場合があるんだ。"]}
    ]},
    {heading:"4種類で効果が違う",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["フィールドには、何種類あるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["エレキ・グラス・サイコ・ミストの4種類があるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["それぞれ、どんな働きがあるんでしょう？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["特定タイプの技を強める、状態異常を防ぐ、先制技を防ぐ、回復するなど、それぞれ役割が違うんだ。"]}
    ]},
    {heading:"通常は5ターンで上書きできる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["フィールドも、別のものに変えられるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["フィールドは通常5ターン続き、別のフィールドが始まると上書きされるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["雨とフィールドを、同時に出すこともできますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["天候とは別の仕組みなので、天候とフィールドは同時に存在できるよ。"]}
    ],takeaway:"フィールドは主に地面にいるポケモンへ作用し、4種類で効果が異なります。"}
  ],["weather","move-priority","status-conditions"],["pokemon-intro"]),
  extraArticle("stealth-rock","ステルスロックってなに？","交代で出てきた相手へ、岩相性に応じたダメージを与える技を説明します。","field",[
    {heading:"相手の場に岩を設置する",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["ステルスロックを使ったのに、相手のHPが減りませんでした。"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ステルスロックを使うと、相手の場に効果が残るよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["いつダメージを与える技なんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["その後、相手がポケモンを場へ出すたびに最大HPを基準としたダメージを受けるよ。使った瞬間の相手へ直接ダメージを与える技ではないんだ。"]}
    ]},
    {heading:"岩タイプとの相性で量が変わる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["ステルスロックのダメージは、どのポケモンも同じですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["基準は最大HPの1/8で、いわ技へのタイプ相性を掛けるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["いわが弱点だったり、半減だったりすると？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["いわ弱点なら1/4、4倍弱点なら1/2、いわ半減なら1/16だよ。4分の1に抑えるタイプなら1/32になるよ。"]}
    ],facts:[{label:"岩等倍",value:"1/8"},{label:"岩弱点",value:"1/4"},{label:"岩4倍弱点",value:"1/2"},{label:"岩半減",value:"1/16"}]},
    {heading:"交代のたびに効く",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["どうして、対戦でステルスロックがよく使われるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["何度も交代するチームほど合計ダメージが増えるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["ほかの技や道具にも、影響があるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["きあいのタスキを潰したり、少し足りない攻撃を届かせたりする一方、除去する技やダメージを受けない道具もあるよ。"]}
    ],takeaway:"ステルスロックは最大HPの1/8×いわ相性。交代するたびに効きます。"}
  ],["type-matchups","switching","cycle","hp-odd-even"],["party-check"]),
  extraArticle("hp-odd-even","HPは奇数と偶数、何が違う？","割合ダメージの端数が、残りHPへどう影響するかを例で説明します。","numbers",[
    {heading:"基本は、端数を残せるHPが扱いやすい",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「HPは奇数がいい」って聞いたんですが、どうしてですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["最大HPの1/2、1/4、1/8、1/16などを使う多くの効果では、端数が切り捨てられるんだ。たとえばHP200と201は、1/4がどちらも50、1/8がどちらも25だよ。消費やダメージが同じなら、最初から1多いHP201には最後に1が残るよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["奇数にさえすれば、いつでも得になりますか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["このため対戦では「HPは奇数が基本」と言われるんだ。ただし、本当に見るべきなのは奇数・偶数だけではなく、4・8・16など効果の分母で割った余りだよ。"]}
    ]},
    {heading:"みがわりを4回使える",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["HPが1違うだけで、みがわりの回数も変わるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["みがわりは最大HPの1/4を切り捨てた量を消費し、現在HPが消費量より多いときだけ使えるよ。HP200では1回50を使うため、3回後は50。4回目は使えないんだ。HP201なら4回使って1残るよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["それなら、HP202だと使える回数が減りますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["同じ考え方で、最大HPが4の倍数でなければ端数が残るよ。たとえばHP202も消費は50なので4回使えるよ。つまり、ここでは「奇数」より正確には「4の倍数を避ける」ことが重要なんだ。"]}
    ],facts:[{label:"HP200",value:"3回まで・残り50"},{label:"HP201",value:"4回後・残り1"}]},
    {heading:"ステルスロックや定数ダメージを1回多く耐えることがある",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["ステルスロックやどくでも、HPが1残ると違いが出ますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["いわ等倍のステルスロックと通常のどくは最大HPの1/8だよ。HP200も201も1回25ダメージだけれど、200は8回で0、201は8回受けても1残り、9回目で倒れるよ。ステルスロックなら、そのぶん場へ出られる回数が1回増える例だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["やけどやいのちのたまでも、同じことが起こるんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["やけどや砂嵐は最大HPの1/16だよ。HP160と161ではどちらも1回10ダメージなので、161なら16回受けた後に1残るよ。いのちのたまは攻撃成功ごとに最大HPの1/10を失うため、HP150と151でも同じ関係になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["HPの端数を残せば、必ず1ターン多く戦えますか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["ただし実戦では相手の攻撃や別の削りも受けるよ。端数を残したからといって、必ず丸々1ターン増えるとは限らないよ。"]}
    ],facts:[{label:"1/8の例",value:"HP200→8回で0"},{label:"端数あり",value:"HP201→8回後1"}]},
    {heading:"はらだいこ＋オボンのみは偶数HPが分かりやすい",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["はらだいことオボンのみを使うなら、偶数がいいんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["はらだいこは最大HPの1/2を減らすんだ。オボンのみは残りHPが最大HPの半分以下になると発動するため、満タンのHP200から使えば100になり、その場で発動するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["HP201なら、はらだいこの後にも1多く残ってお得では？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["HP201では1/2を切り捨てた100を減らして101残るよ。これは半分より多いため、満タンからはらだいこを使っただけではオボンのみが発動しないんだ。こうした「ちょうど半分以下へ入りたい」場面では、偶数HPに明確な利点があるんだ。"]}
    ],facts:[{label:"HP200",value:"200→100・発動"},{label:"HP201",value:"201→101・未発動"}]},
    {heading:"自分でHPを削り、狙った回数で退場する",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["自分からHPを使うときも、奇数にして残せばいいですよね？"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["ゴーストタイプが使うのろいは、自分の最大HPの1/2を減らして相手をのろい状態にするよ。HP200なら100ずつ減るため、回復がなければ2回目で自分も倒れるよ。相手へ効果を残しながら退場し、控えを安全に出したいときは、この偶数HPが目的に合う場合があるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["のろいを使うなら、HP201でも同じ動きができますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["HP201では消費が100になり、2回使っても1残るよ。長く場に残りたいなら利点だけれど、2回目で退場したい計画とはずれるんだ。はらだいこやのろい以外でも、最大HPの半分を使う効果と発動条件を組み合わせるときは同じ確認が必要なんだ。"]}
    ]},
    {heading:"奇数か偶数かではなく、狙う効果から決める",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["結局、HPは奇数と偶数のどちらにすればいいんだろう？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["みがわりで端数を残すなら4の倍数を避ける、1/8ダメージを意識するなら8の倍数との関係を見る、たべのこしの回復量を増やすなら16で割った値を見る、というように目的から逆算するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["たべのこしの回復量まで、変わるんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["たとえば最大HP160のたべのこし回復は10だけれど、159では9だよ。耐える回数だけを見てHPを減らすと、回復量を失う場合もあるよ。ほかの能力へ回せる数値との兼ね合いも含めて決めよう。"]}
    ],takeaway:"端数を残したい場面では奇数が便利。半分以下の発動や予定どおりの退場を狙うなら偶数が有利なこともあります。"}
  ],["substitute-hp","leftovers-recovery","stealth-rock"],["damage-chart"]),
  extraArticle("substitute-hp","みがわりはHPをどれくらい使う？","みがわりのHP消費と、最大HPによる回数の違いを説明します。","numbers",[
    {heading:"最大HPの1/4を消費する",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["みがわりを使うと、自分のHPはどれくらい減るんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["みがわりは、自分の最大HPの1/4を切り捨てた量だけ消費して、身代わりを作るんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["残りHPが少なくても、使えますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["現在HPが消費量以下なら使えないんだ。最大HP200でも201でも消費は50だよ。"]}
    ]},
    {heading:"身代わりが攻撃を受ける",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["作った身代わりは、どんなことをしてくれるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["身代わりには消費したHPと同じ量の耐久があり、壊れるまで多くの攻撃を代わりに受けるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["身代わりがあれば、どんな効果も防げる？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["状態異常など一部の効果も防げるけれど、すべてを防げるわけではないんだ。"]}
    ]},
    {heading:"HP端数が回数に関わる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["HP200だと、みがわりを4回使えないんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["最大HP200で満タンから4回使うとHPを使い切るため、4回目は使えないんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["HP201なら、4回目も使えますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["最大HP201なら50を3回使った後も51残り、4回目を使って1残せるよ。"]}
    ],facts:[{label:"HP200",value:"3回後50"},{label:"HP201",value:"4回後1"}],takeaway:"消費は最大HPの1/4切り捨て。現在HPが消費量より多いときだけ使えます。"}
  ],["hp-odd-even","leftovers-recovery","status-conditions"],["move-search"]),
  extraArticle("leftovers-recovery","たべのこしはどれくらい回復する？","毎ターンの1/16回復と、端数・長期戦への影響を説明します。","numbers",[
    {heading:"ターン終了時に最大HPの1/16",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["たべのこしは、いつ、どれくらい回復するんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["たべのこしを持つポケモンは、ターン終了時に最大HPの1/16を切り捨てた量だけ回復するよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["最大HP160と161では、回復量も違いますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["最大HP160なら10、161から175でも10回復だよ。"]}
    ]},
    {heading:"長く場にいるほど合計が増える",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["毎ターン少ししか回復しなくても、役に立つんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["1回の回復は小さくても、4ターンなら最大HPのおよそ1/4に近い量になるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["どんなポケモンに持たせるとよさそうですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["攻撃を受けながら交代を繰り返すポケモンや、守る技で時間を作るポケモンと相性があるんだ。"]}
    ]},
    {heading:"端数だけで決めない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["回復量が増えるようにHPを決めれば、いちばん強い？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["最大HPを16の倍数に近づけると回復量が変わる場合があるけれど、HPそのものや防御・特防との配分も重要なんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["回復1だけを追いかけなくてもいいんですね。"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["回復1を増やすことが常に最優先ではないんだ。"]}
    ],takeaway:"たべのこしは毎ターン最大HPの1/16切り捨て。長期戦で差が積み重なります。"}
  ],["hp-odd-even","substitute-hp","held-items"],["usage-ranking"]),
  extraArticle("cycle","サイクルってなに？","交代で有利な対面を作り、少しずつ相手を削る流れを説明します。","strategy",[
    {heading:"不利なら受けられる味方へ引く",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["サイクルって、交代をたくさんする戦い方ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["サイクルは、不利な相手から交代し、その攻撃を受けやすい味方を出す動きを繰り返す考え方だよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["交代する回数が多ければ、それだけでサイクルなんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["単に交代回数が多いことだけを指すのではないんだ。"]}
    ]},
    {heading:"受けた後に有利な対面を作る",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["味方で相手の攻撃を受けたら、その後はどうするんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["交代先が攻撃を耐えたら、今度はこちらが相手へ強い技を見せるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手も交代してきたら、どう進めるんでしょう？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["相手も交代すれば、その交代先へダメージを与え、少しずつチーム全体を削るんだ。"]}
    ]},
    {heading:"交代の負担を管理する",dialogue: [
      {"speaker":"trainer","expression":"inspired","paragraphs":["交代できる味方がいれば、何度でも受けられそう！"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["交代先のHP、状態異常、ステルスロックなどの場の効果を無視すると、受け続けられないんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["最後に誰で倒すかまで、考えておくんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["誰で何を受け、最後に誰で倒すかを考えるんだ。"]}
    ],takeaway:"サイクルは受けられる味方へ交代し、有利対面と削りを積み重ねる戦い方です。"}
  ],["switching","matchups","stealth-rock"],["pokemon-roles","pokemon-intro"]),
  extraArticle("setup-fodder","「起点にする・起点にされる」ってどういう意味？","相手が大きな圧力をかけにくい隙を、準備へ使う考え方を説明します。","terms",[
    {heading:"相手の隙を準備へ変える",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「相手を起点にする」って、どういう意味ですか？"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["相手がこちらへ大きなダメージや妨害を与えにくい場面で、積み技や場作りを安全に行うことを「起点にする」と言うんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["準備を許してしまった側は、何と言うんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["準備された側から見れば「起点にされる」状態だよ。"]}
    ]},
    {heading:"弱いポケモンという意味ではない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["起点にされるのは、弱いポケモンだからですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["攻撃技が効きにくい、選んだ技が固定されている、交代を読まれたなど、その場の組み合わせで起点になることがあるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["その場の組み合わせによっても、変わるんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["ポケモン自体の強弱だけでは決まらないんだ。"]}
    ]},
    {heading:"自由な1ターンを渡さない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["攻撃してもあまり減らないけど、そのまま続けていい？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["倒せない相手の前で同じ行動を続けると、相手に能力を上げられるかもしれないね。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手の準備を止めるには、どうしたらいいですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["交代する、状態異常にする、能力上昇を消すなど、準備を止める手段を考えるんだ。"]}
    ],takeaway:"起点とは、相手が圧力をかけにくい隙を利用し、有利な準備をすることです。"}
  ],["setup-moves","matchups","win-condition"],["pokemon-roles","pokemon-intro"]),
  extraArticle("move-consistency","「一貫している」ってどういう意味？","相手の残り全体へ止められにくい技やタイプを説明します。","terms",[
    {heading:"相手全体へ通る状態",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["「この技が一貫している」って、どういうことですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["ある技やタイプを、相手の残っているポケモン全体が受けにくい状態を「一貫している」と言うんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手の中に、安全に受けられるポケモンがいないんですね？"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["無効や大きな半減で安全に受ける相手がいない状態だよ。"]}
    ]},
    {heading:"ドラゴン技の例",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["ドラゴン技なら、どんな状態だと一貫しているんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["相手の残り3匹すべてにドラゴン技が等倍以上で入り、フェアリータイプのような無効や、はがねタイプのような半減で受けるポケモンがいなければ、ドラゴン技の一貫があると言えるよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["止められるタイプが残っているか、見るんですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["そうだね。今の相手1匹だけではなく、相手の残り全体を見て判断しよう。"]}
    ]},
    {heading:"一貫を作ってから押す",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["今は一貫していない技も、後で使いやすくできますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["技を止める相手を先に削るか倒すと、残った相手へ同じ技を選びやすくなるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["相手のタイプ以外にも、確認することはありますか？"]},
      {"speaker":"professor","expression":"inspired","paragraphs":["これが終盤の勝ち筋につながるよ。相手の特性による無効も忘れず確認するよ。"]}
    ],takeaway:"一貫とは、相手の残り全体がその技を安全に止めにくい状態です。"}
  ],["type-matchups","win-condition","cycle"],["party-check","pokemon-intro"]),
  extraArticle("freeze","こおり状態になるとどうなる？","多くの技を使えない状態と、Pokémon Championsで回復する確率・回数を説明します。","status",[
    {heading:"多くの技を使えなくなる",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["こおり状態だと、選んだ技を使えないんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["こおり状態のポケモンが技を選ぶと、まずこおりが解けるか判定されるよ。解けなければ、そのターンは選んだ技を使えないんだ。やけどやどくのような毎ターンのHPダメージはないけれど、行動できない間に相手へ攻撃や交代の機会を渡すんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["こおりタイプのポケモンも、凍りますか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["こおりタイプのポケモンは基本的にこおり状態にならないよ。特性などで防ぐ場合もあるよ。"]}
    ]},
    {heading:"1・2回目は25%、3回目は必ず解ける",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["こおりは、何回くらいで解けるんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["Pokémon Championsでは、こおり状態になった後に技を使おうとする1回目と2回目は、それぞれ25%の確率でこおりが解けるよ。解けた場合は、そのまま選んだ技を使えるよ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["2回とも解けなかったら、ずっと動けない？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["2回とも解けなかった場合でも、3回目に技を使おうとしたときは必ず解けるよ。従来作のように長い間ずっと解けないことはないんだ。"]}
    ],facts:[{label:"1回目",value:"25%で回復"},{label:"2回目",value:"25%で回復"},{label:"3回目",value:"必ず回復"}]},
    {heading:"交代では治らず、回数も進まない",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["控えに戻して待てば、こおりも解けていきますか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["控えへ交代しても、こおり状態は残るよ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["場に残すかどうかも、考えどころですね。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["技を使おうとするまで回復判定は行われないため、交代しているだけでは3回目の確定回復へ近づかないよ。場に残して回復判定を進めるか、いったん控えへ戻して安全を確保するかを考えるんだ。"]}
    ]},
    {heading:"一部の炎技などですぐ解けることがある",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["凍っていても使える技があるって、本当ですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["一部の炎タイプの技など、こおり状態でも使えて、使うと自分のこおりを解く技があるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["ほのお技なら、全部同じようにこおりが解けますか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["また、相手の炎タイプの攻撃を受けたときなどに解ける場合もあるよ。すべての炎技が同じ扱いではないため、技の説明を確認しよう。"]}
    ],takeaway:"Championsのこおりは1・2回目に各25%で回復し、解けなくても3回目の行動時には必ず回復します。"}
  ],["status-conditions","sleep","switching"],["move-search","pokemon-intro"]),
  extraArticle("confusion","こんらん状態になるとどうなる？","技を使えるか自分を攻撃するかの判定と、交代で治る性質を説明します。","status",[
    {heading:"状態異常とは別にかかる一時的な状態",dialogue: [
      {"speaker":"trainer","expression":"surprised","paragraphs":["まひしているのに、こんらんにもなりました。両方付くんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["こんらんは、やけど・まひ・どく・ねむり・こおりとは別の一時的な状態だよ。そのため、まひしたポケモンが同時にこんらんするなど、主要な状態異常と重なることがあるんだ。"]},
      {"speaker":"trainer","expression":"inspired","paragraphs":["状態異常の印だけ見ていたら、見落としそうです。"]},
      {"speaker":"professor","expression":"happy","paragraphs":["画面に状態異常の印が1つ付いているかだけで判断せず、こんらんしたという表示も覚えておこうね。"]}
    ]},
    {heading:"約1/3で自分を攻撃してしまう",dialogue: [
      {"speaker":"trainer","expression":"surprised","paragraphs":["こんらん中は、毎回自分を攻撃してしまうんですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["こんらん中に技を使おうとすると、約1/3の確率で自分を攻撃し、選んだ技を使えないんだ。残りの場合は選んだ技を通常どおり使うよ。まひなども重なっていると、それぞれの判定で行動を止められることがあるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["自分を攻撃するときは、どんなダメージになるんですか？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["自分への攻撃は威力40相当の物理攻撃として、自分の攻撃と防御を使ってダメージを計算するよ。技のタイプ、タイプ一致、相性はなく、攻撃が高く防御が低いポケモンほど自傷ダメージが大きくなりやすい仕組みだよ。"]}
    ],facts:[{label:"自分を攻撃",value:"約1/3"},{label:"通常どおり行動",value:"約2/3"}]},
    {heading:"数回の行動か、交代で治る",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["こんらんは、いつ治るんですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["こんらんは永遠には続かず、技を使おうとする回数が進むと自然に治るよ。自然に治るまでの長さは一定ではないため、「次は必ず動ける」とは限らないよ。"]},
      {"speaker":"trainer","expression":"confused","paragraphs":["自分を攻撃しそうで怖いときは、交代してもいいですか？"]},
      {"speaker":"professor","expression":"thinking","paragraphs":["主要な状態異常と違い、控えへ交代するとこんらんは治るよ。大切なポケモンの自傷を避けたいときは交代が確実だけれど、交代先が相手の攻撃を受ける点には注意するよ。"]}
    ]},
    {heading:"確率だけに任せず、必要なら交代する",dialogue: [
      {"speaker":"trainer","expression":"thinking","paragraphs":["こんらんしたら、必ず交代した方がいいですか？"]},
      {"speaker":"professor","expression":"neutral","paragraphs":["そのターンに動けなくても耐えられるなら、場に残って攻撃する選択があるんだ。"]},
      {"speaker":"trainer","expression":"thinking","paragraphs":["自分へのダメージで倒れそうなときはどうしよう？"]},
      {"speaker":"professor","expression":"happy","paragraphs":["一方、自傷ダメージで倒れそう、またはその技を失敗すると負け筋になる場面では、受けられる味方への交代が安全だよ。特性でこんらんを防ぐポケモンもいるよ。"]}
    ],takeaway:"こんらん中は約1/3で自分を攻撃します。主要な状態異常とは重なりますが、交代すれば治ります。"}
  ],["status-conditions","switching","abilities"],["pokemon-intro"]),
];

export const battleBasicsArticleBySlug = new Map(battleBasicsArticles.map((article) => [article.slug, article]));
export const beginnerCourseArticles = battleBasicsArticles.filter((article): article is BattleBasicsArticle & { beginnerCourseOrder: number } => article.beginnerCourseOrder !== undefined).sort((a, b) => a.beginnerCourseOrder - b.beginnerCourseOrder);

export const battleBasicsTools: Record<BattleBasicsToolId, { title: string; description: string; href: string }> = {
  "party-check": { title: "パーティー相性チェッカー", description: "6匹のタイプ相性を確認する", href: "/party-check/" },
  "speed-ranking": { title: "すばやさランキング", description: "ポケモンの素早さを比較する", href: "/speed-ranking/" },
  "usage-ranking": { title: "使用率ランキング", description: "よく使われる持ち物や技を見る", href: "/usage-ranking/" },
  "damage-chart": { title: "ダメージ早見表", description: "代表技のダメージを比べる", href: "/damage-chart/" },
  "move-search": { title: "技からポケモン検索", description: "技を覚えるポケモンを探す", href: "/move-search/" },
  "pokemon-intro": { title: "このポケモンってどんなポケモン？", description: "ポケモンごとの役割を知る", href: "/pokemon-intro/" },
  "pokemon-roles": { title: "対戦ポケモンの役割一覧", description: "役割の種類と該当ポケモンを見る", href: "/pokemon-roles/" },
  "type-chart": { title: "ポケモン タイプ相性表", description: "18タイプと複合タイプの相性を調べる", href: "/type-chart/" },
};
