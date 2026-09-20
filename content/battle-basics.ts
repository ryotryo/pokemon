export interface BattleBasicsCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface BattleBasicsSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  facts?: Array<{ label: string; value: string }>;
  takeaway?: string;
}

export type BattleBasicsToolId = "party-check" | "speed-ranking" | "usage-ranking" | "damage-chart" | "move-search" | "pokemon-intro" | "pokemon-roles";

export interface BattleBasicsArticle {
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  beginnerCourseOrder: number;
  sections: BattleBasicsSection[];
  relatedArticleSlugs: string[];
  relatedTools: BattleBasicsToolId[];
}

export const battleBasicsCategories: BattleBasicsCategory[] = [
  { id: "getting-started", name: "まず知っておきたいこと", description: "勝ち方や技、能力など、対戦画面を見るための土台です。", order: 1 },
  { id: "damage", name: "ダメージのしくみ", description: "技の威力やタイプが、ダメージへどう関わるかを学びます。", order: 2 },
  { id: "speed", name: "素早さと行動順", description: "どちらが先に動くのか、その基本を整理します。", order: 3 },
  { id: "status", name: "状態異常・能力変化", description: "状態異常や能力の上げ下げが、対戦へ与える影響を学びます。", order: 4 },
  { id: "field", name: "場にかかわる効果", description: "天候やフィールドなど、場全体に影響する効果を扱います。", order: 5 },
  { id: "numbers", name: "HPと数値のちょっとした知識", description: "HPの減り方や回復量など、知ると役立つ数値を扱います。", order: 6 },
  { id: "strategy", name: "パーティーと対戦の考え方", description: "選出、交代、役割、勝ち筋など、試合の考え方を学びます。", order: 7 },
  { id: "terms", name: "対戦でよく見る言葉", description: "対戦記事や会話で使われる言葉を、やさしく読み解きます。", order: 8 },
];

export const battleBasicsArticles: BattleBasicsArticle[] = [
  {
    slug: "how-to-win", title: "ポケモン対戦ってどうやって勝つの？", description: "対戦の目的と、勝つまでの大まかな流れをゼロから説明します。", categoryId: "getting-started", beginnerCourseOrder: 1,
    sections: [
      { heading: "相手のポケモンをすべて倒せば勝ち", paragraphs: ["ポケモン対戦では、技で相手のHPを減らし、戦えるポケモンをすべて倒すことが基本の勝利条件です。HPが0になったポケモンは、その試合では戦えなくなります。", "自分のポケモンが1匹でも残り、相手に戦えるポケモンがいなくなれば勝ちです。まずはこのゴールだけ覚えれば、対戦画面の見え方が変わります。"] },
      { heading: "毎ターン、行動を選ぶ", paragraphs: ["自分の番では、技を使うか、控えのポケモンへ交代するかを選びます。両方のプレイヤーが選び終えると、技の優先度や素早さなどに従って行動します。", "強い技を選び続けるだけでなく、相手が何をしてきそうかを考えて行動を選ぶのが対戦です。最初は、相手に効果抜群の技があるかを見るだけでも十分です。"] },
      { heading: "1匹ずつの勝負ではない", paragraphs: ["目の前の相手を倒しても、そのために大切なポケモンが弱りすぎると、残りの相手に負けることがあります。反対に、今は少し不利でも、最後に強いポケモンを残せれば逆転できます。", "対戦は、選んだポケモン全体で行うチーム戦です。倒す順番や、誰を最後まで残すかも勝敗に関わります。"], takeaway: "相手を全部倒すのがゴール。技と交代を選び、チーム全体でそのゴールを目指します。" },
    ], relatedArticleSlugs: ["team-selection", "win-condition"], relatedTools: ["pokemon-intro"],
  },
  {
    slug: "team-selection", title: "6匹のポケモンと選出", description: "手持ち6匹から、その試合で戦うポケモンを選ぶ流れを説明します。", categoryId: "strategy", beginnerCourseOrder: 2,
    sections: [
      { heading: "まず6匹でチームを作る", paragraphs: ["対戦へ持ち込むチームは6匹です。ただし、試合で6匹すべてを必ず使うとは限りません。対戦前にお互いの6匹を確認し、その試合へ出すポケモンを選びます。これを「選出」と呼びます。"] },
      { heading: "対戦形式で出す数が変わる", paragraphs: ["基本的なランクバトルでは、シングルバトルは6匹から3匹、ダブルバトルは6匹から4匹を選びます。シングルは場に1匹ずつ、ダブルは場に2匹ずつ出して戦います。", "ルールによって選出数が異なる場合があるため、対戦を始める前にそのレギュレーションの表示も確認しましょう。"] },
      { heading: "相手の6匹を見て決める", paragraphs: ["相手に水タイプが多ければ草や電気の技を使えるポケモン、素早い相手が多ければ攻撃を受けられるポケモン、というように考えます。", "最初から完璧に読む必要はありません。「この相手に強そうなポケモン」と「困ったときに交代できるポケモン」を入れるところから始めましょう。"], takeaway: "選出は、6匹の中からその相手と戦いやすい組み合わせを選ぶ時間です。" },
    ], relatedArticleSlugs: ["how-to-win", "roles", "matchups"], relatedTools: ["party-check", "pokemon-intro"],
  },
  {
    slug: "type-matchups", title: "タイプ相性ってどう考えればいい？", description: "弱点、等倍、いまひとつ、無効と複合タイプの見方を説明します。", categoryId: "damage", beginnerCourseOrder: 3,
    sections: [
      { heading: "技のタイプと相手のタイプを比べる", paragraphs: ["攻撃技にはタイプがあり、相手のタイプとの組み合わせでダメージが変わります。効果抜群なら通常より大きく、いまひとつなら小さくなります。相性がない組み合わせは等倍です。無効の相手には、その技ではダメージを与えられません。"], facts: [{ label: "弱点", value: "2倍" }, { label: "等倍", value: "1倍" }, { label: "いまひとつ", value: "1/2倍" }, { label: "無効", value: "0倍" }] },
      { heading: "複合タイプでは両方を組み合わせる", paragraphs: ["相手が2つのタイプを持つときは、両方の相性を掛け合わせます。たとえば、ほのお・ひこうタイプにいわ技を使うと、どちらにも効果抜群なので2倍×2倍で4倍になります。", "片方に効果抜群でも、もう片方にいまひとつなら2倍×1/2倍で等倍です。見た目だけで決めず、2つのタイプを確認するのが大切です。"] },
      { heading: "相性は交代を考える合図", paragraphs: ["弱点を突かれそうなときは、その技を受けやすい味方へ交代できます。逆に、相手の弱点を突けるなら攻める好機です。", "ただし、相手が別タイプの技を覚えていることもあります。タイプ相性は大切な出発点ですが、それだけで必ず勝てるわけではありません。"], takeaway: "技のタイプと相手の1つまたは2つのタイプを比べ、最終的な倍率を考えます。" },
    ], relatedArticleSlugs: ["same-type-attack-bonus", "matchups", "switching"], relatedTools: ["party-check", "damage-chart"],
  },
  {
    slug: "same-type-attack-bonus", title: "タイプ一致ってなに？", description: "ポケモンと技のタイプが同じときに得られる攻撃の強化を説明します。", categoryId: "damage", beginnerCourseOrder: 4,
    sections: [
      { heading: "自分と同じタイプの技は強くなる", paragraphs: ["ポケモン自身のタイプと、使う技のタイプが同じだと、その技のダメージは基本的に1.5倍になります。これを「タイプ一致」と呼びます。", "たとえば、ほのおタイプのリザードンがほのお技を使えばタイプ一致です。リザードンがノーマル技を使っても、タイプ一致にはなりません。"] },
      { heading: "弱点とは別のしくみ", paragraphs: ["タイプ一致は「使う側のポケモンと技」を比べます。弱点は「技と受ける側のポケモン」を比べます。2つは別々に計算されます。", "タイプ一致のほのお技で、ほのおが弱点の相手を攻撃すれば、1.5倍と2倍の両方が重なります。タイプ一致でも相手にいまひとつなら、思ったほど減らないことがあります。"] },
      { heading: "迷ったときの主力技", paragraphs: ["同じ威力なら、タイプ一致の技はダメージを出しやすいため、そのポケモンの主力になりやすいです。一方で、苦手な相手へ別タイプの技を使うこともあります。", "ポケモンのタイプ、技のタイプ、相手の弱点を順に見ると、どの技が強そうか判断しやすくなります。"], takeaway: "タイプ一致は使う側の強化、弱点は受ける側との相性です。" },
    ], relatedArticleSlugs: ["type-matchups", "move-categories", "stats"], relatedTools: ["damage-chart", "move-search"],
  },
  {
    slug: "move-categories", title: "物理技・特殊技・変化技ってなに？", description: "3種類の技と、ダメージに使う能力値の違いを説明します。", categoryId: "getting-started", beginnerCourseOrder: 5,
    sections: [
      { heading: "攻撃技には物理と特殊がある", paragraphs: ["相手へダメージを与える技は、大きく物理技と特殊技に分かれます。物理技は使う側の「攻撃」と受ける側の「防御」、特殊技は使う側の「特攻」と受ける側の「特防」を主に使ってダメージを決めます。"], facts: [{ label: "物理技", value: "攻撃 ↔ 防御" }, { label: "特殊技", value: "特攻 ↔ 特防" }, { label: "変化技", value: "補助や妨害" }] },
      { heading: "タイプだけでは決まらない", paragraphs: ["同じほのおタイプでも、物理技と特殊技があります。技のタイプを見ただけでは物理か特殊かは分かりません。技に表示される分類の印や説明を確認します。", "攻撃が高いポケモンには物理技、特攻が高いポケモンには特殊技が合いやすいですが、覚える技や役割によって例外もあります。"] },
      { heading: "変化技も対戦を動かす", paragraphs: ["変化技は、基本的に直接ダメージを与えるための技ではありません。能力を上げる、相手を状態異常にする、HPを回復するなど、さまざまな効果があります。", "攻撃技だけのポケモンより、変化技を混ぜた方が戦いやすいこともあります。相手を倒す準備をする技、と考えると分かりやすいでしょう。"], takeaway: "物理は攻撃と防御、特殊は特攻と特防。変化技は戦いやすい状況を作ります。" },
    ], relatedArticleSlugs: ["stats", "stat-stages", "abilities"], relatedTools: ["move-search", "pokemon-intro"],
  },
  {
    slug: "stats", title: "HP・攻撃・防御・特攻・特防・素早さってなに？", description: "ポケモンの6つの能力値と、H・A・B・C・D・Sという略称を説明します。", categoryId: "getting-started", beginnerCourseOrder: 6,
    sections: [
      { heading: "6つの数字が得意・不得意を表す", paragraphs: ["ポケモンには6つの能力値があります。数字が高いほど、その分野が得意です。全部が高いとは限らず、攻撃が高い、守りが得意、素早いなど、ポケモンごとに個性があります。"], bullets: ["HP：攻撃に耐えられる量", "攻撃：物理技で与えるダメージに関わる", "防御：物理技を受ける力", "特攻：特殊技で与えるダメージに関わる", "特防：特殊技を受ける力", "素早さ：原則として行動する順番に関わる"] },
      { heading: "攻めと守りは組になっている", paragraphs: ["物理技を使うなら攻撃が高いほど有利で、受ける側は防御が高いほど耐えやすくなります。特殊技では特攻と特防の組み合わせです。HPは物理・特殊のどちらを受けるときにも使います。", "そのため、防御だけ高くてもHPが低ければ何度も受けるのは難しく、攻撃が高くても使う技が特殊技なら、その高さを生かせないことがあります。"] },
      { heading: "H・A・B・C・D・Sという略し方", paragraphs: ["対戦の記事では、6つの能力をアルファベット1文字で略すことがあります。最初は日本語名で理解し、慣れてから略称を読めれば十分です。"], facts: [{ label: "H", value: "HP" }, { label: "A", value: "攻撃" }, { label: "B", value: "防御" }, { label: "C", value: "特攻" }, { label: "D", value: "特防" }, { label: "S", value: "素早さ" }], takeaway: "AとBは物理、CとDは特殊。Hは体力、Sは行動順に関わります。" },
    ], relatedArticleSlugs: ["move-categories", "speed-and-turn-order", "roles"], relatedTools: ["speed-ranking", "pokemon-intro"],
  },
  {
    slug: "speed-and-turn-order", title: "素早さと行動順", description: "素早さが行動順にどう関わり、どんな例外があるのかを説明します。", categoryId: "speed", beginnerCourseOrder: 7,
    sections: [
      { heading: "原則は素早い方が先", paragraphs: ["お互いが同じ優先度の技を選んだときは、素早さが高いポケモンから行動します。先に相手を倒せれば、そのターンは相手の攻撃を受けずにすむことがあります。だから素早さはとても重要です。"] },
      { heading: "先制技などの例外がある", paragraphs: ["技には「優先度」があり、優先度が高い技は素早さに関係なく先に出やすくなります。でんこうせっかなどが先制技です。反対に、後から動く性質の技もあります。", "同じ優先度で素早さも同じ、いわゆる「同速」の場合は、どちらが先に動くか毎回確定しません。"] },
      { heading: "対戦中に順番は変わる", paragraphs: ["能力ランク、まひ、特性、持ち物、トリックルームなどによって行動順が変わることがあります。最初に見た素早さだけで、試合中ずっと先に動けるとは限りません。", "まずは「原則は素早い方が先、先制技には注意」と覚えれば十分です。詳しい数値を比べたいときは、すばやさランキングを使えます。"], takeaway: "先に動けば攻撃を受ける前に倒せることがあります。ただし技の優先度が先に比べられます。" },
    ], relatedArticleSlugs: ["stats", "status-conditions", "stat-stages"], relatedTools: ["speed-ranking"],
  },
  {
    slug: "abilities", title: "特性ってなに？", description: "ポケモンが持つ特別な効果と、対戦で確認する意味を説明します。", categoryId: "getting-started", beginnerCourseOrder: 8,
    sections: [
      { heading: "ポケモンごとの特別な力", paragraphs: ["特性は、ポケモンが持っている特別な効果です。技のように毎ターン選ぶものではなく、条件を満たすと自動で働くものが多くあります。", "場に出たときに天候を変える、特定の技を無効にする、攻撃を受けると能力が上がるなど、内容はさまざまです。"] },
      { heading: "同じタイプでも動きが変わる", paragraphs: ["タイプや能力値が似ていても、特性が違えば得意な相手や役割が変わります。弱点の技を無効にする特性があれば、タイプ相性だけを見た予想が外れることもあります。", "相手のポケモンが場に出たときに特性名が表示されたら、その後の行動を考える大切な手がかりです。"] },
      { heading: "全部を暗記しなくていい", paragraphs: ["初めて見る特性は、その場で効果を確認しながら覚えれば十分です。まずは、自分の6匹の特性がいつ働き、何を変えるかを知っておきましょう。", "ポケモン解説では、そのポケモンらしい特性と戦い方を一緒に確認できます。"], takeaway: "特性は自動で働くことが多い特別な効果。タイプ相性や行動順を変える場合もあります。" },
    ], relatedArticleSlugs: ["held-items", "matchups", "roles"], relatedTools: ["pokemon-intro"],
  },
  {
    slug: "held-items", title: "持ち物ってなに？", description: "ポケモンに持たせる道具が、対戦中にどう働くかを説明します。", categoryId: "getting-started", beginnerCourseOrder: 9,
    sections: [
      { heading: "1匹につき1つ持たせる", paragraphs: ["ポケモンには、対戦中に効果を発揮する持ち物を1つ持たせられます。HPが減ると回復するきのみ、技を強くする道具、素早さを上げる道具などがあります。", "持ち物は技とは別に働き、条件を満たすと自動で使われるものや、持っている間ずっと効果が続くものがあります。"] },
      { heading: "強い代わりに制限もある", paragraphs: ["大きく能力を高める代わりに同じ技しか選べなくなるなど、強みと欠点がセットの持ち物もあります。効果の一部だけでなく、制限まで読むことが大切です。", "相手の持ち物は最初から見えないため、与えたダメージや行動順から予想することもあります。初心者のうちは、まず自分の持ち物の効果を忘れないようにしましょう。"] },
      { heading: "役割に合う物を選ぶ", paragraphs: ["攻撃役には火力や素早さを補う物、攻撃を受ける役には回復や耐久を助ける物が合いやすいです。ただし正解は1つではありません。", "「このポケモンに何をしてほしいか」を先に考えると、持ち物を選びやすくなります。"], takeaway: "持ち物は1匹に1つ。強化だけでなく、発動条件や制限も確認します。" },
    ], relatedArticleSlugs: ["abilities", "roles", "win-condition"], relatedTools: ["usage-ranking", "pokemon-intro"],
  },
  {
    slug: "status-conditions", title: "状態異常ってなに？", description: "やけど、まひ、どく、ねむり、こおりで何が困るのかを整理します。", categoryId: "status", beginnerCourseOrder: 10,
    sections: [
      { heading: "しばらく残る不利な状態", paragraphs: ["状態異常は、技や特性などによってポケモンに付く不利な状態です。交代しても残るものが多く、治す効果を使うか、対戦中の条件を満たすまで影響が続きます。", "同じポケモンが、やけどとまひのような主要な状態異常に同時になることは基本的にありません。"] },
      { heading: "まずは何が困るかを知る", paragraphs: ["細かな確率やターン数より、行動やHPにどんな影響があるかを覚えましょう。"], bullets: ["やけど：毎ターンHPが減り、物理技のダメージも下がる", "まひ：素早さが下がり、行動できないことがある", "どく：毎ターンHPが減る", "もうどく：経過するほど毎ターンのダメージが増える", "ねむり：眠っている間は、多くの技を使えない", "こおり：行動できず、ターン経過などで解けることがある"] },
      { heading: "相手を止めるだけではない", paragraphs: ["状態異常は、相手を倒すための時間を作ったり、回復を使わせたりできます。逆に、自分の大切な攻撃役がやけどになれば、予定していたダメージを出せなくなるかもしれません。", "タイプや特性によって、特定の状態異常にならない場合もあります。表示された状態と相手の特性を確認しましょう。"], takeaway: "状態異常は交代しても残りやすく、HP・火力・素早さ・行動を邪魔します。" },
    ], relatedArticleSlugs: ["speed-and-turn-order", "switching", "abilities"], relatedTools: ["pokemon-intro"],
  },
  {
    slug: "stat-stages", title: "能力ランクってなに？", description: "能力が1段階、2段階上がる・下がるとはどういうことかを説明します。", categoryId: "status", beginnerCourseOrder: 11,
    sections: [
      { heading: "対戦中だけ能力を変える段階", paragraphs: ["技や特性で「攻撃が上がった」と表示されると、その試合中の能力に補正がかかります。この上げ下げを能力ランクと呼び、通常を0として、上は+6、下は-6まで変化します。", "「ぐーんと上がった」は2段階など、表示によって変化量が違います。"] },
      { heading: "1段階でも影響は大きい", paragraphs: ["攻撃・防御・特攻・特防・素早さは、+1で通常の1.5倍、+2で2倍になります。下がる場合は、-1で通常の2/3、-2で1/2です。", "たとえば攻撃が+2になれば、物理技のダメージを大きく伸ばせます。素早さが+1なら、それまで抜けなかった相手より先に動けることがあります。"], facts: [{ label: "+1", value: "3/2倍" }, { label: "+2", value: "2倍" }, { label: "-1", value: "2/3倍" }, { label: "-2", value: "1/2倍" }] },
      { heading: "交代すると基本的に元へ戻る", paragraphs: ["能力ランクは、そのポケモンが控えへ戻ると基本的に0へ戻ります。相手が何段階も能力を上げたときは、交代させる技や効果で強化を消せる場合があります。", "自分から交代すれば上げた能力も失うため、強化した後にどれだけ攻められるかが大切です。"], takeaway: "+1は少しではなく1.5倍。能力を上げた後の攻撃と、交代によるリセットを意識します。" },
    ], relatedArticleSlugs: ["move-categories", "speed-and-turn-order", "switching"], relatedTools: ["speed-ranking", "pokemon-intro"],
  },
  {
    slug: "switching", title: "なぜポケモンを交代するの？", description: "不利な場面から逃げ、次に有利な状況を作る交代の意味を説明します。", categoryId: "strategy", beginnerCourseOrder: 12,
    sections: [
      { heading: "倒される前に控えへ戻す", paragraphs: ["交代を選ぶと、場のポケモンを控えへ戻し、別の味方を出します。相手の攻撃を受ける前に交代できれば、弱点を突かれて倒されるのを避けられることがあります。", "交代先のポケモンは、そのターンの相手の攻撃を受ける可能性があります。誰なら受けられるかを考える必要があります。"] },
      { heading: "交代する主な理由", paragraphs: ["交代は逃げるだけの行動ではなく、次に攻めやすい場面を作る行動です。"], bullets: ["不利なタイプの相手から離れる", "攻撃を受けやすい味方へ代わる", "相手へ有利なポケモンを場に出す", "能力低下など、交代で消える効果をリセットする", "残しておきたいポケモンのHPを守る"] },
      { heading: "交代にも代償がある", paragraphs: ["交代したターンは、通常そのポケモンが攻撃できません。相手に交代を読まれると、交代先へ強い技を使われることもあります。場に出たときにダメージを受ける仕掛けがある場合も注意が必要です。", "最初は「このまま倒されそうなら、受けられる味方へ代わる」だけで十分です。交代を繰り返して有利な場面を作る考え方は、後のサイクルという戦い方につながります。"], takeaway: "交代は大切なポケモンを守り、有利な相手へ向き合わせるために使います。" },
    ], relatedArticleSlugs: ["type-matchups", "matchups", "roles"], relatedTools: ["party-check", "pokemon-intro"],
  },
  {
    slug: "roles", title: "ポケモンの「役割」ってなに？", description: "チームの中でポケモンが担当する仕事を、代表例から説明します。", categoryId: "strategy", beginnerCourseOrder: 13,
    sections: [
      { heading: "役割はチームの中での仕事", paragraphs: ["ポケモンには、攻撃が得意、攻撃を受けるのが得意、味方を助けるのが得意などの違いがあります。チームで担当する仕事を「役割」と呼びます。", "同じポケモンでも技や持ち物で役割が変わることがありますが、まずは何が得意なポケモンかを見ると理解しやすくなります。"] },
      { heading: "よくある役割", paragraphs: ["役割の名前には厳密に1つだけの定義があるとは限りません。初心者は次のイメージから始めましょう。"], bullets: ["アタッカー：高い火力で相手を倒す", "受け：高い耐久や回復で攻撃を受け止める", "サポート：状態異常や場の効果で味方を助ける", "エース：準備を整え、終盤に相手を倒し切る中心役", "クッション：いったん攻撃を受け、安全に次の味方へつなぐ"] },
      { heading: "役割を組み合わせる", paragraphs: ["全員が攻撃役だと、苦手な相手が出たときに安全な交代先がいないかもしれません。全員が守る役だと、相手を倒し切れないことがあります。", "誰が攻め、誰が受け、誰が味方を助けるかを考えると、6匹を選びやすくなります。詳しい役割と該当ポケモンは役割一覧で確認できます。"], takeaway: "役割はチーム内の仕事。攻める・受ける・助けるを組み合わせます。" },
    ], relatedArticleSlugs: ["team-selection", "switching", "win-condition"], relatedTools: ["pokemon-roles", "pokemon-intro"],
  },
  {
    slug: "matchups", title: "有利対面・不利対面ってなに？", description: "場にいる2匹のどちらが動きやすいかを判断する考え方を説明します。", categoryId: "strategy", beginnerCourseOrder: 14,
    sections: [
      { heading: "目の前の組み合わせを「対面」と呼ぶ", paragraphs: ["自分と相手の場にいるポケモン同士の組み合わせを「対面」と呼びます。自分が相手を倒しやすく、相手からは倒されにくいなら有利対面。反対なら不利対面です。", "不利対面では、無理に攻撃せず交代することが選択肢になります。"] },
      { heading: "タイプだけでは決まらない", paragraphs: ["タイプ相性は大きな判断材料ですが、それだけで有利・不利が決まるわけではありません。"], bullets: ["どちらが先に動くか", "攻撃を何回耐えられるか", "弱点を突ける技を実際に覚えているか", "特性で技を無効にしないか", "状態異常や能力変化が残っていないか"] },
      { heading: "次のターンまで考える", paragraphs: ["今の相手に有利でも、相手が交代してくると攻撃が通らないことがあります。不利な相手から交代して、自分が有利な組み合わせを作るのも対戦の基本です。", "最初は、タイプ相性、素早さ、残りHPの3つを見るだけでも判断しやすくなります。経験とともに技や特性も加えていきましょう。"], takeaway: "有利不利はタイプ、速さ、耐久、技、特性を合わせて判断します。" },
    ], relatedArticleSlugs: ["type-matchups", "speed-and-turn-order", "switching"], relatedTools: ["party-check", "pokemon-intro"],
  },
  {
    slug: "win-condition", title: "勝ち筋ってなに？", description: "最後にどうやって相手を倒し切るか、試合のゴールから考える方法を説明します。", categoryId: "strategy", beginnerCourseOrder: 15,
    sections: [
      { heading: "勝つまでの道筋", paragraphs: ["勝ち筋とは、「最後にどうやって相手を倒し切るか」という道筋です。難しい作戦だけを指す言葉ではありません。「最後に素早いポケモンで残りを倒す」も立派な勝ち筋です。", "試合の途中で、残っているポケモンとHPを見て、自分が勝てそうな形を考えます。"] },
      { heading: "簡単な勝ち筋の例", paragraphs: ["自分のエースを止める相手がいるなら、その相手を先に倒すか、エースの攻撃で倒せるところまで削ります。相手にとても速いポケモンがいるなら、先に倒しておくと、最後に自分の攻撃役が動きやすくなります。"], bullets: ["苦手な相手を先に削る", "相手の速いポケモンを倒す", "最後に自分のエースを安全に出す", "相手の攻撃を受けられる味方を残す"] },
      { heading: "大切なポケモンを簡単に失わない", paragraphs: ["目の前の1匹を倒せても、勝つために必要なポケモンまで倒されると、勝ち筋がなくなることがあります。逆に、役目を終えたポケモンで相手の攻撃を受け、エースを安全に出す判断が必要なこともあります。", "最初は選出時に「この試合は誰で最後に攻めたいか」を1匹決めてみましょう。試合中の行動に理由が生まれます。"], takeaway: "勝ち筋は、最後に誰でどう倒し切るか。そのために必要な相手を削り、味方を残します。" },
    ], relatedArticleSlugs: ["how-to-win", "roles", "matchups"], relatedTools: ["pokemon-roles", "pokemon-intro", "damage-chart"],
  },
];

export const battleBasicsArticleBySlug = new Map(battleBasicsArticles.map((article) => [article.slug, article]));
export const beginnerCourseArticles = [...battleBasicsArticles].sort((a, b) => a.beginnerCourseOrder - b.beginnerCourseOrder);

export const battleBasicsTools: Record<BattleBasicsToolId, { title: string; description: string; href: string }> = {
  "party-check": { title: "パーティー相性チェッカー", description: "6匹のタイプ相性を確認する", href: "/party-check/" },
  "speed-ranking": { title: "すばやさランキング", description: "ポケモンの素早さを比較する", href: "/speed-ranking/" },
  "usage-ranking": { title: "使用率ランキング", description: "よく使われる持ち物や技を見る", href: "/usage-ranking/" },
  "damage-chart": { title: "ダメージ早見表", description: "代表技のダメージを比べる", href: "/damage-chart/" },
  "move-search": { title: "技からポケモン検索", description: "技を覚えるポケモンを探す", href: "/move-search/" },
  "pokemon-intro": { title: "このポケモンってどんなポケモン？", description: "ポケモンごとの役割を知る", href: "/pokemon-intro/" },
  "pokemon-roles": { title: "対戦ポケモンの役割一覧", description: "役割の種類と該当ポケモンを見る", href: "/pokemon-roles/" },
};
