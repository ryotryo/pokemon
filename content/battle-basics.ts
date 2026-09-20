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
  beginnerCourseOrder?: number;
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

function extraArticle(slug:string,title:string,description:string,categoryId:string,sections:BattleBasicsSection[],relatedArticleSlugs:string[],relatedTools:BattleBasicsToolId[]=[]):BattleBasicsArticle{return{slug,title,description,categoryId,sections,relatedArticleSlugs,relatedTools};}

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
      { heading: "対戦形式で出す数が変わる", paragraphs: ["基本的なランクバトルでは、シングルバトルは6匹から3匹、ダブルバトルは6匹から4匹を選びます。シングルは場に1匹ずつ、ダブルは場に2匹ずつ出して戦います。", "ルールによって選出数が異なる場合があります。使用できるポケモンなどを定めたルールを「レギュレーション」と呼ぶので、対戦を始める前に画面の表示も確認しましょう。"] },
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
  extraArticle("damage-basics","ダメージはどうやって決まる？","攻撃技のダメージに関わる主な要素を、式を使わずに整理します。","damage",[
    {heading:"技と能力値が土台",paragraphs:["物理技なら攻撃と防御、特殊技なら特攻と特防を比べ、技の威力を使って基礎となるダメージが決まります。レベルも計算に関わります。","攻撃が高くても威力の低い技なら小さくなり、防御が高い相手には同じ技でも通りにくくなります。"]},
    {heading:"そこへ補正が重なる",paragraphs:["タイプ一致、弱点やいまひとつ、急所、天候、特性、持ち物などが順に影響します。1つの数字だけで最終ダメージは決まりません。"],bullets:["使う技の威力と分類","攻撃側・防御側の能力","タイプ一致とタイプ相性","特性・持ち物・天候など","最後に幅を作る乱数"]},
    {heading:"同じ技でも毎回少し違う",paragraphs:["ダメージには乱数による幅があるため、同じ条件でも毎回まったく同じとは限りません。確実に倒せるかは、最大値だけでなく最小値も見ます。"],takeaway:"威力だけでなく、能力値・タイプ・特性など複数の要素で決まります。"}
  ],["move-categories","same-type-attack-bonus","damage-randomness"],["damage-chart"]),
  extraArticle("type-effectiveness-damage","弱点・いまひとつ・無効でダメージはどう変わる？","タイプ相性の倍率を、実際のダメージへ結び付けて説明します。","damage",[
    {heading:"等倍を基準に考える",paragraphs:["等倍を1とすると、弱点は2倍、いまひとつは1/2倍、無効は0倍です。たとえば等倍で約60ダメージなら、ほかの条件が同じとき弱点では約120、半減では約30が目安です。"]},
    {heading:"無効は少ないダメージではない",paragraphs:["無効は0倍なので、その技ではダメージを与えられません。じめん技をひこうタイプへ使う場合などです。ただし特性や別の効果で相性が変化する場合があります。"]},
    {heading:"表示と交代判断につながる",paragraphs:["効果抜群でも相手の耐久が高ければ倒し切れず、等倍でも高火力なら大きく減ります。倍率は重要ですが、残りHPや能力値も合わせて考えます。"],takeaway:"弱点2倍、半減1/2倍、無効0倍。倍率は最終ダメージを大きく変えます。"}
  ],["type-matchups","four-times-weakness","damage-basics"],["party-check","damage-chart"]),
  extraArticle("four-times-weakness","4倍弱点・4分の1ってなに？","複合タイプでタイプ相性が重なったときの倍率を説明します。","damage",[
    {heading:"2つの相性を掛け合わせる",paragraphs:["複合タイプには、それぞれのタイプへの相性を掛け合わせます。両方が弱点なら2×2で4倍、両方が半減なら1/2×1/2で1/4倍です。"]},
    {heading:"リザードンといわ技の例",paragraphs:["ほのお・ひこうのリザードンは、どちらのタイプもいわ技が弱点なので4倍です。一方、片方が弱点でももう片方が半減なら、2×1/2で等倍になります。"]},
    {heading:"選出と交代へ大きく影響する",paragraphs:["4倍弱点は大きなダメージになりやすいため、相手がそのタイプの技を使えるか確認します。1/4なら受けやすい候補ですが、別タイプの技には注意が必要です。"],takeaway:"複合タイプは足し算ではなく掛け算。2つの相性を両方確認します。"}
  ],["type-matchups","type-effectiveness-damage","switching"],["party-check"]),
  extraArticle("critical-hits","急所に当たるとどうなる？","急所の倍率と、能力変化を一部無視する性質を説明します。","damage",[
    {heading:"通常より1.5倍のダメージ",paragraphs:["攻撃が急所に当たると、通常の1.5倍のダメージになります。毎回起きるものではありませんが、急所に当たりやすい技や、必ず急所に当たる技もあります。"]},
    {heading:"不利な能力変化を一部無視する",paragraphs:["急所では、攻撃側の下がった攻撃・特攻や、防御側の上がった防御・特防など、急所を弱くする一部の能力ランクを無視して計算します。すべての効果を無視するわけではありません。"]},
    {heading:"安全だと思った場面が変わる",paragraphs:["防御を上げて耐える予定でも、急所なら想定より大きく減ることがあります。低い確率だけを恐れすぎず、起きる可能性があると知っておきましょう。"],takeaway:"急所は1.5倍。一部の不利な能力ランクを無視するため、守りを崩すことがあります。"}
  ],["damage-basics","stat-stages","damage-randomness"],["damage-chart"]),
  extraArticle("damage-randomness","ダメージの「乱数」ってなに？","同じ攻撃でもダメージに幅がある理由を説明します。","damage",[
    {heading:"ダメージは85〜100%の範囲で揺れる",paragraphs:["ほかの条件が同じでも、最後に85%から100%の範囲の乱数補正がかかります。そのため、同じ技を同じ相手へ使っても少し違う数字になります。"]},
    {heading:"最大だけでは倒せると言えない",paragraphs:["ダメージ幅が90〜106なら、HP100の相手を倒せる回と倒せない回があります。これが乱数で倒せる状態です。最小でも100以上なら必ず倒せます。"]},
    {heading:"幅で判断する",paragraphs:["実戦では、最高ダメージを期待するより、低いダメージでも足りるかを考えると安全です。複数回攻撃する場合は、そのたびに乱数が決まります。"],takeaway:"同じ条件でもダメージには幅があります。最小値と最大値の両方を見ます。"}
  ],["damage-basics","ko-terms","critical-hits"],["damage-chart"]),
  extraArticle("ko-terms","確1・確2・乱1ってなに？","ダメージ計算で使われる確定数と乱数の言葉を説明します。","terms",[
    {heading:"何回で倒せるかを表す言葉",paragraphs:["確1は確定1発の略で、ダメージが最小でも相手の残りHP以上になり、1回で必ず倒せることです。確2は、回復などがなければ2回で必ず倒せることを表します。"]},
    {heading:"乱1は倒せる場合と残る場合がある",paragraphs:["乱数1発、略して乱1は、1回で倒せるダメージも出ますが、低いダメージでは相手が残る状態です。倒せる確率が高ければ高乱数、低ければ低乱数と表すことがあります。"]},
    {heading:"行動を決める材料",paragraphs:["確1なら攻撃を選びやすく、乱1なら倒せなかった場合の反撃も考えます。ダメージ早見表の範囲を見るときも、最小値が相手のHPへ届くか確認しましょう。"],takeaway:"確1は必ず1回、確2は必ず2回、乱1は1回で倒せるかが乱数次第です。"}
  ],["damage-randomness","damage-basics","win-condition"],["damage-chart"]),
  extraArticle("move-power","技の威力が高ければ強い技なの？","威力だけでは測れない技の使いやすさを説明します。","damage",[
    {heading:"威力はダメージの大切な土台",paragraphs:["同じポケモンが同じ相手へ使い、ほかの条件も同じなら、威力が高い技ほど大きなダメージを与えやすいです。ただし威力だけで優劣は決まりません。"]},
    {heading:"命中・反動・追加効果も見る",paragraphs:["高威力でも外れやすい、使った後に能力が下がる、反動でHPが減る技があります。低威力でも必ず当たりやすい、先に動ける、便利な追加効果を持つ技があります。"]},
    {heading:"役割に合うかが重要",paragraphs:["安定して削りたいなら命中の高い技、一度の好機で倒したいなら高威力技が合うことがあります。そのポケモンが何をしたいかで選びます。"],takeaway:"威力に加え、命中・反動・追加効果・優先度まで見て判断します。"}
  ],["damage-basics","move-categories","priority-moves"],["move-search","pokemon-intro"]),
  extraArticle("speed-ties","同じ素早さだったらどっちが先？","同じ優先度・同じ素早さのときの行動順を説明します。","speed",[
    {heading:"同速では先攻がランダムに決まる",paragraphs:["同じ優先度の技を選び、実際の素早さも同じなら、どちらが先に動くかはランダムに決まります。この状態を「同速」と呼びます。"]},
    {heading:"一度先でも次も先とは限らない",paragraphs:["同速の判定は固定の上下関係ではありません。前のターンに先に動いたポケモンが、次のターンも必ず先とは限りません。"]},
    {heading:"勝敗を運だけにしない工夫",paragraphs:["同速に勝たないと負ける場面を減らすには、先制技を残す、攻撃を耐えられる味方へ交代するなど別の道を用意します。"],takeaway:"同じ優先度・同じ素早さなら先攻はランダム。毎回同じとは限りません。"}
  ],["speed-and-turn-order","move-priority","switching"],["speed-ranking"]),
  extraArticle("move-priority","技の「優先度」ってなに？","素早さより先に比べられる、技の行動順を説明します。","speed",[
    {heading:"まず優先度、次に素早さ",paragraphs:["行動順は、最初に技の優先度を比べます。優先度が高い技が先に動き、同じ優先度の中で素早さを比べます。"]},
    {heading:"先制技と後から動く技",paragraphs:["でんこうせっかのような先制技は通常の攻撃技より優先度が高く、素早さが低くても先に動けます。優先度が低く、後から動きやすい技もあります。"]},
    {heading:"素早さ逆転中でも優先度は別",paragraphs:["トリックルームで遅い方が先になりやすい場面でも、技の優先度は先に比べます。優先度まで完全に逆になるわけではありません。"],takeaway:"行動順は優先度を先に比較し、同じなら素早さを比べます。"}
  ],["speed-and-turn-order","priority-moves","speed-ties"],["speed-ranking","move-search"]),
  extraArticle("priority-moves","先制技ってなに？","素早さに関係なく先に動きやすい攻撃技の使い方を説明します。","speed",[
    {heading:"通常技より高い優先度を持つ",paragraphs:["先制技は、通常の技より高い優先度を持ちます。相手の方が速くても、優先度で上回れば先に行動できます。"]},
    {heading:"弱った相手を倒すのが得意",paragraphs:["先制技は威力が低めでも、残りHPの少ない相手を反撃前に倒せるのが強みです。速い相手への最後の一押しにもなります。"]},
    {heading:"必ず最初とは限らない",paragraphs:["相手も先制技を使えば優先度と素早さを比べます。特性や場の効果で先制技を防がれる場合もあるため、「必ず先」とは覚えないようにしましょう。"],takeaway:"先制技は優先度が高い技。速い相手を倒す手段になりますが、必ず先ではありません。"}
  ],["move-priority","speed-and-turn-order","move-power"],["move-search"]),
  extraArticle("speed-changes","素早さが上がる・下がるとどうなる？","能力ランクによる素早さ変化と行動順への影響を説明します。","speed",[
    {heading:"実際の素早さに倍率がかかる",paragraphs:["素早さが1段階上がると1.5倍、2段階で2倍になります。1段階下がると2/3倍、2段階で1/2倍です。種族値そのものが変わるのではなく、対戦中の実数値へ補正がかかります。"],facts:[{label:"+1",value:"1.5倍"},{label:"+2",value:"2倍"},{label:"-1",value:"2/3倍"},{label:"-2",value:"1/2倍"}]},
    {heading:"先後関係が途中で変わる",paragraphs:["最初は相手より遅くても、素早さを上げれば次のターンから先に動けることがあります。相手の素早さを下げ、味方全体が先に動きやすくする使い方もあります。"]},
    {heading:"ほかの補正とも組み合わさる",paragraphs:["まひ、持ち物、特性、天候などの補正も行動順に影響します。また優先度の違う技には、素早さだけでは先行できません。"],takeaway:"素早さの能力ランクは実数値を変え、試合途中で行動順を逆転させます。"}
  ],["speed-and-turn-order","stat-stages","paralysis"],["speed-ranking"]),
  extraArticle("trick-room","トリックルームってなに？","遅いポケモンから先に動きやすくなる場の効果を説明します。","speed",[
    {heading:"同じ優先度なら遅い方から",paragraphs:["トリックルーム中は、同じ優先度の技同士なら素早さが低いポケモンから先に動きます。遅いポケモンが活躍しやすくなる効果です。"]},
    {heading:"優先度まで逆にはならない",paragraphs:["先制技などの優先度は通常どおり先に比べます。トリックルーム自体は優先度がとても低いため、使うターンは相手の攻撃を受けてから発動することが多くあります。同速なら先攻はランダムです。"]},
    {heading:"使える時間は短い",paragraphs:["効果は発動したターンを含めて5ターンです。発動後に実際に攻められるターンは限られるため、遅くて火力の高い味方を安全に出す準備が重要です。"],takeaway:"遅い順になるのは同じ優先度の中だけ。発動ターンを含め5ターン続きます。"}
  ],["move-priority","speed-ties","speed-and-turn-order"],["speed-ranking","pokemon-intro"]),
  extraArticle("burn","やけどになるとどうなる？","毎ターンのダメージと物理火力低下という2つの影響を説明します。","status",[
    {heading:"毎ターン最大HPの1/16減る",paragraphs:["やけど状態では、ターン終了時に最大HPの1/16のダメージを受けます。交代してもやけどは残るため、長く場に出すほどHPを失います。"]},
    {heading:"多くの物理技が半分の火力になる",paragraphs:["やけどしたポケモンが使う物理技のダメージは基本的に半分になります。特殊技のダメージはこの火力低下を受けません。技や特性による例外もあります。"]},
    {heading:"物理アタッカーには特に重い",paragraphs:["HPを削るだけでなく攻撃力まで落とすため、物理アタッカーを止める手段になります。ほのおタイプは基本的にやけど状態になりません。"],takeaway:"やけどは毎ターン1/16ダメージ＋物理技が基本半減。物理アタッカーに深刻です。"}
  ],["status-conditions","move-categories","switching"],["pokemon-intro"]),
  extraArticle("paralysis","まひになるとどうなる？","素早さ低下と行動不能の可能性を説明します。","status",[
    {heading:"素早さが半分になる",paragraphs:["まひ状態になると素早さは通常の1/2になります。それまで先に動けた相手にも、後から動くようになることがあります。"]},
    {heading:"25%で技を出せない",paragraphs:["行動するたびに25%の確率で体がしびれ、そのターンは選んだ技を出せません。必ず止まるわけでも、毎回動けるわけでもありません。"]},
    {heading:"速い相手を抑える",paragraphs:["素早さと行動の両方を邪魔するため、速いアタッカーへの対策になります。でんきタイプは基本的に、でんきタイプの技によるまひを受けません。"],takeaway:"まひは素早さ半減。さらに25%で行動できないため、先後関係と計画が崩れます。"}
  ],["status-conditions","speed-changes","speed-and-turn-order"],["speed-ranking"]),
  extraArticle("poison-and-bad-poison","どくともうどくは何が違う？","固定的に減るどくと、徐々に大きくなるもうどくを比べます。","status",[
    {heading:"どくは毎ターン1/8",paragraphs:["通常のどく状態では、ターン終了時に最大HPの1/8のダメージを受けます。同じ割合で減り続けるため、回復しないと少しずつ追い込まれます。"]},
    {heading:"もうどくは毎ターン増える",paragraphs:["もうどくは最初が最大HPの1/16、その後は2/16、3/16と、場に居続けるほどターン終了時のダメージが増えます。交代すると増加の段階はリセットされますが、もうどく状態自体は残ります。"]},
    {heading:"居座る相手への圧力",paragraphs:["回復しながら長く場にいる相手ほど、もうどくの増加が重くなります。どく・はがねタイプは基本的にどく状態になりません。"],takeaway:"どくは毎ターン1/8。もうどくは1/16ずつ段階的に増え、交代で増加段階が戻ります。"}
  ],["status-conditions","switching"],["pokemon-intro"]),
  extraArticle("sleep","ねむりになるとどうなる？","眠っている間の行動制限と、起きるまでの考え方を説明します。","status",[
    {heading:"多くの技を使えなくなる",paragraphs:["ねむり状態では、基本的に技を選んでも行動できません。ねごとなど、眠っているときに使える特別な技はあります。"]},
    {heading:"1〜3ターン眠る",paragraphs:["眠る長さは1〜3ターンの範囲で決まり、自分の行動時に眠りのターンが進みます。いつ起きるか確定していない間は、行動できない場合も考える必要があります。"]},
    {heading:"交代しても眠りは残る",paragraphs:["控えへ戻しても、ねむり状態は治りません。眠ったポケモンを残すか、別の味方で戦うかを考えます。特性や場の効果で眠りを防げる場合もあります。"],takeaway:"ねむりは1〜3ターン、多くの技を使えません。交代しても状態は残ります。"}
  ],["status-conditions","switching","abilities"],["pokemon-intro"]),
  extraArticle("setup-moves","「積み技」ってなに？","能力を上げ、次の攻撃を強くする準備技を説明します。","status",[
    {heading:"能力を上げる変化技",paragraphs:["自分の攻撃・特攻・素早さ・防御などを上げる技を、対戦では「積み技」と呼びます。つるぎのまいやりゅうのまいなどが代表例です。"]},
    {heading:"1ターン使って後を強くする",paragraphs:["積み技を使ったターンは直接攻撃しないことが多い代わりに、その後の攻撃や耐久を強くできます。相手が大きなダメージを与えにくい隙に使うのが基本です。"]},
    {heading:"交代すると基本的に失う",paragraphs:["上げた能力ランクは交代すると基本的に元へ戻ります。積んでもすぐ交代させられたり、倒されたりすると準備が無駄になるため、使う場面が重要です。"],takeaway:"積み技は1ターンを準備に使い、その後の突破力や耐久を高めます。"}
  ],["stat-stages","roles","win-condition"],["pokemon-roles","pokemon-intro"]),
  extraArticle("weather","天候ってなに？","場全体へ影響する晴れ・雨・砂嵐・雪の共通ルールを説明します。","field",[
    {heading:"場全体に影響する効果",paragraphs:["天候は、技や特性で変化する場全体の状態です。晴れ・雨・砂嵐・雪があり、技の威力、命中、能力、特性などへ天候ごとの影響を与えます。"]},
    {heading:"通常は5ターン続く",paragraphs:["技や特性で発生した天候は基本的に5ターン続きます。対応する持ち物を持つポケモンが発生させると8ターンになる場合があります。別の天候が始まれば上書きされます。"]},
    {heading:"利用する側とされる側がいる",paragraphs:["天候で強くなる技や特性をそろえるとチームの戦い方になります。一方、相手も同じ天候の恩恵を受けることがあるため、場の表示と残りターンを確認します。"],takeaway:"天候は場全体へ影響し、基本5ターン。別の天候で上書きできます。"}
  ],["sun","rain","sandstorm","snow"],["pokemon-intro"]),
  extraArticle("sun","晴れになると何が起こる？","晴れで変わる炎・水技、技の動き、特性を説明します。","field",[
    {heading:"炎は1.5倍、水は半分",paragraphs:["晴れ中は、ほのおタイプの技のダメージが1.5倍、みずタイプの技は1/2になります。タイプ相性とは別にかかる天候の補正です。"]},
    {heading:"一部の技が使いやすくなる",paragraphs:["ソーラービームなどは通常必要な溜めを省いて攻撃できます。反対に、かみなりやぼうふうは命中しにくくなります。技ごとの説明も確認しましょう。"]},
    {heading:"特性で速さや回復も変わる",paragraphs:["ようりょくそのように晴れで素早さが上がる特性や、晴れで効果が変わる回復技があります。炎技だけでなく、どのポケモンが天候を利用するかが大切です。"],takeaway:"晴れは炎技1.5倍・水技半減。技や特性にも個別の変化があります。"}
  ],["weather","rain","speed-changes"],["pokemon-intro","move-search"]),
  extraArticle("rain","雨になると何が起こる？","雨で変わる水・炎技、命中、特性を説明します。","field",[
    {heading:"水は1.5倍、炎は半分",paragraphs:["雨中は、みずタイプの技のダメージが1.5倍、ほのおタイプの技は1/2になります。水技を主力にするポケモンが攻めやすくなります。"]},
    {heading:"かみなり・ぼうふうが必中になる",paragraphs:["雨中は、かみなりとぼうふうが通常の命中判定をせず必中になります。高威力だけれど外れることがある技を、安定して使えるのが利点です。"]},
    {heading:"すいすい等の特性が働く",paragraphs:["すいすいは雨中に素早さが上がる特性です。雨を起こす役と、雨を利用して攻める役を組み合わせると、短いターンで大きな圧力をかけられます。"],takeaway:"雨は水技1.5倍・炎技半減。かみなり・ぼうふうや雨対応特性も強化します。"}
  ],["weather","sun","speed-changes"],["pokemon-intro","move-search"]),
  extraArticle("sandstorm","砂嵐になると何が起こる？","毎ターンのダメージと岩タイプの特防上昇を説明します。","field",[
    {heading:"多くのポケモンが毎ターン1/16減る",paragraphs:["砂嵐中は、いわ・じめん・はがねタイプ以外のポケモンがターン終了時に最大HPの1/16のダメージを受けます。特性などで受けない場合もあります。"]},
    {heading:"岩タイプの特防が1.5倍",paragraphs:["砂嵐中はいわタイプのポケモンの特防が1.5倍になります。特殊技を受けやすくなり、天候ダメージも受けないため砂嵐と相性がよいタイプです。"]},
    {heading:"削りと特性を利用する",paragraphs:["毎ターンの小さなダメージで相手を倒せる範囲へ入れたり、すなかきなど砂嵐で働く特性を使ったりします。通常は5ターン続きます。"],takeaway:"砂嵐は対象外タイプ以外へ毎ターン1/16。岩タイプの特防を1.5倍にします。"}
  ],["weather","snow","hp-odd-even"],["pokemon-intro"]),
  extraArticle("snow","雪になると何が起こる？","氷タイプの防御上昇と、雪を条件にする技・特性を説明します。","field",[
    {heading:"氷タイプの防御が1.5倍",paragraphs:["雪の間は、こおりタイプのポケモンの防御が1.5倍になります。物理技を受けやすくなるため、普段とは耐え方が変わります。"]},
    {heading:"雪そのものに毎ターンダメージはない",paragraphs:["過去作品の「あられ」と違い、現在の雪はターン終了時にポケモンへ一律のダメージを与えません。砂嵐との大きな違いです。"]},
    {heading:"技と特性の条件になる",paragraphs:["オーロラベールは雪のときに使え、味方が受けるダメージを減らします。ゆきかきなど雪で働く特性もあります。通常は5ターン続きます。"],takeaway:"雪は氷タイプの防御を1.5倍にし、毎ターンダメージは与えません。"}
  ],["weather","sandstorm","speed-changes"],["pokemon-intro","move-search"]),
  extraArticle("terrain","フィールドってなに？","地面にいるポケモンへ影響する4種類の場の効果を説明します。","field",[
    {heading:"地面にいるポケモンへ働く",paragraphs:["フィールドは場全体の地面を変える効果で、基本的に地面にいるポケモンへ影響します。ひこうタイプや、地面から浮く特性などを持つポケモンは効果を受けない場合があります。"]},
    {heading:"4種類で効果が違う",paragraphs:["エレキ・グラス・サイコ・ミストの4種類があります。特定タイプの技を強める、状態異常を防ぐ、先制技を防ぐ、回復するなど、それぞれ役割が違います。"]},
    {heading:"通常は5ターンで上書きできる",paragraphs:["フィールドは通常5ターン続き、別のフィールドが始まると上書きされます。天候とは別の仕組みなので、天候とフィールドは同時に存在できます。"],takeaway:"フィールドは主に地面にいるポケモンへ作用し、4種類で効果が異なります。"}
  ],["weather","move-priority","status-conditions"],["pokemon-intro"]),
  extraArticle("stealth-rock","ステルスロックってなに？","交代で出てきた相手へ、岩相性に応じたダメージを与える技を説明します。","field",[
    {heading:"相手の場に岩を設置する",paragraphs:["ステルスロックを使うと、相手の場に効果が残ります。その後、相手がポケモンを場へ出すたびに最大HPを基準としたダメージを受けます。使った瞬間の相手へ直接ダメージを与える技ではありません。"]},
    {heading:"岩タイプとの相性で量が変わる",paragraphs:["基準は最大HPの1/8で、いわ技へのタイプ相性を掛けます。いわ弱点なら1/4、4倍弱点なら1/2、いわ半減なら1/16です。4分の1に抑えるタイプなら1/32になります。"],facts:[{label:"岩等倍",value:"1/8"},{label:"岩弱点",value:"1/4"},{label:"岩4倍弱点",value:"1/2"},{label:"岩半減",value:"1/16"}]},
    {heading:"交代のたびに効く",paragraphs:["何度も交代するチームほど合計ダメージが増えます。きあいのタスキを潰したり、少し足りない攻撃を届かせたりする一方、除去する技やダメージを受けない道具もあります。"],takeaway:"ステルスロックは最大HPの1/8×いわ相性。交代するたびに効きます。"}
  ],["type-matchups","switching","cycle","hp-odd-even"],["party-check"]),
  extraArticle("hp-odd-even","HPは奇数と偶数、何が違う？","割合ダメージの端数が、残りHPへどう影響するかを例で説明します。","numbers",[
    {heading:"割合計算では端数が切り捨てられる",paragraphs:["最大HPの1/2や1/4などを使う効果では、端数が出ると基本的に切り捨てます。最大HP200の1/2は100、201の1/2も100です。この1の差が、繰り返し効果を受けた後に残ることがあります。"]},
    {heading:"HP200と201を比べる",paragraphs:["最大HPの1/2ダメージを2回受ける例では、HP200は100ずつ減って0になります。HP201は100ずつ減り、1残ります。同じ割合でも端数の扱いで結果が変わる例です。"],facts:[{label:"HP200",value:"200→100→0"},{label:"HP201",value:"201→101→1"}]},
    {heading:"奇数が常に正解ではない",paragraphs:["みがわりの回数、回復量、ステルスロックへの相性、持ち物の発動条件など、目的によって都合のよいHPは変わります。1だけ多くするために、ほかの能力を下げる価値があるかも考えます。"],takeaway:"奇数・偶数の価値は受ける割合効果で変わります。奇数なら常に強いわけではありません。"}
  ],["substitute-hp","leftovers-recovery","stealth-rock"],["damage-chart"]),
  extraArticle("substitute-hp","みがわりはHPをどれくらい使う？","みがわりのHP消費と、最大HPによる回数の違いを説明します。","numbers",[
    {heading:"最大HPの1/4を消費する",paragraphs:["みがわりは、自分の最大HPの1/4を切り捨てた量だけ消費して、身代わりを作ります。現在HPが消費量以下なら使えません。最大HP200でも201でも消費は50です。"]},
    {heading:"身代わりが攻撃を受ける",paragraphs:["身代わりには消費したHPと同じ量の耐久があり、壊れるまで多くの攻撃を代わりに受けます。状態異常など一部の効果も防げますが、すべてを防げるわけではありません。"]},
    {heading:"HP端数が回数に関わる",paragraphs:["最大HP200で満タンから4回使うとHPを使い切るため、4回目は使えません。最大HP201なら50を3回使った後も51残り、4回目を使って1残せます。"],facts:[{label:"HP200",value:"3回後50"},{label:"HP201",value:"4回後1"}],takeaway:"消費は最大HPの1/4切り捨て。現在HPが消費量より多いときだけ使えます。"}
  ],["hp-odd-even","leftovers-recovery","status-conditions"],["move-search"]),
  extraArticle("leftovers-recovery","たべのこしはどれくらい回復する？","毎ターンの1/16回復と、端数・長期戦への影響を説明します。","numbers",[
    {heading:"ターン終了時に最大HPの1/16",paragraphs:["たべのこしを持つポケモンは、ターン終了時に最大HPの1/16を切り捨てた量だけ回復します。最大HP160なら10、161から175でも10回復です。"]},
    {heading:"長く場にいるほど合計が増える",paragraphs:["1回の回復は小さくても、4ターンなら最大HPのおよそ1/4に近い量になります。攻撃を受けながら交代を繰り返すポケモンや、守る技で時間を作るポケモンと相性があります。"]},
    {heading:"端数だけで決めない",paragraphs:["最大HPを16の倍数に近づけると回復量が変わる場合がありますが、HPそのものや防御・特防との配分も重要です。回復1を増やすことが常に最優先ではありません。"],takeaway:"たべのこしは毎ターン最大HPの1/16切り捨て。長期戦で差が積み重なります。"}
  ],["hp-odd-even","substitute-hp","held-items"],["usage-ranking"]),
  extraArticle("cycle","サイクルってなに？","交代で有利な対面を作り、少しずつ相手を削る流れを説明します。","strategy",[
    {heading:"不利なら受けられる味方へ引く",paragraphs:["サイクルは、不利な相手から交代し、その攻撃を受けやすい味方を出す動きを繰り返す考え方です。単に交代回数が多いことだけを指すのではありません。"]},
    {heading:"受けた後に有利な対面を作る",paragraphs:["交代先が攻撃を耐えたら、今度はこちらが相手へ強い技を見せます。相手も交代すれば、その交代先へダメージを与え、少しずつチーム全体を削ります。"]},
    {heading:"交代の負担を管理する",paragraphs:["交代先のHP、状態異常、ステルスロックなどの場の効果を無視すると、受け続けられません。誰で何を受け、最後に誰で倒すかを考えます。"],takeaway:"サイクルは受けられる味方へ交代し、有利対面と削りを積み重ねる戦い方です。"}
  ],["switching","matchups","stealth-rock"],["pokemon-roles","pokemon-intro"]),
  extraArticle("setup-fodder","「起点にする・起点にされる」ってどういう意味？","相手が大きな圧力をかけにくい隙を、準備へ使う考え方を説明します。","terms",[
    {heading:"相手の隙を準備へ変える",paragraphs:["相手がこちらへ大きなダメージや妨害を与えにくい場面で、積み技や場作りを安全に行うことを「起点にする」と言います。準備された側から見れば「起点にされる」状態です。"]},
    {heading:"弱いポケモンという意味ではない",paragraphs:["攻撃技が効きにくい、選んだ技が固定されている、交代を読まれたなど、その場の組み合わせで起点になることがあります。ポケモン自体の強弱だけでは決まりません。"]},
    {heading:"自由な1ターンを渡さない",paragraphs:["倒せない相手の前で同じ行動を続けると、相手に能力を上げられるかもしれません。交代する、状態異常にする、能力上昇を消すなど、準備を止める手段を考えます。"],takeaway:"起点とは、相手が圧力をかけにくい隙を利用し、有利な準備をすることです。"}
  ],["setup-moves","matchups","win-condition"],["pokemon-roles","pokemon-intro"]),
  extraArticle("move-consistency","「一貫している」ってどういう意味？","相手の残り全体へ止められにくい技やタイプを説明します。","terms",[
    {heading:"相手全体へ通る状態",paragraphs:["ある技やタイプを、相手の残っているポケモン全体が受けにくい状態を「一貫している」と言います。無効や大きな半減で安全に受ける相手がいない状態です。"]},
    {heading:"ドラゴン技の例",paragraphs:["相手の残り3匹すべてにドラゴン技が等倍以上で入り、フェアリータイプのような無効や、はがねタイプのような半減で受けるポケモンがいなければ、ドラゴン技の一貫があると言えます。"]},
    {heading:"一貫を作ってから押す",paragraphs:["技を止める相手を先に削るか倒すと、残った相手へ同じ技を選びやすくなります。これが終盤の勝ち筋につながります。相手の特性による無効も忘れず確認します。"],takeaway:"一貫とは、相手の残り全体がその技を安全に止めにくい状態です。"}
  ],["type-matchups","win-condition","cycle"],["party-check","pokemon-intro"]),
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
};
