export type GuideSeason = "M3" | "M4" | "M5";

export interface GuideSource {
  id: string;
  title: string;
  author: string;
  season: GuideSeason;
  achievement?: string;
  url: string;
  usedFor: string;
}

export interface GuideMatchup {
  pokemonId: string;
  explanation: string;
  caution?: string;
  sourceIds: string[];
}

export interface GuideCountermeasure {
  title: string;
  targetPokemonIds: string[];
  body: string;
  teammatePokemonIds?: string[];
  sourceIds: string[];
}

export interface PokemonGuide {
  pokemonId: string;
  slug: string;
  rule: "Singles";
  seasonScope: GuideSeason[];
  rankAtCreation: number;
  createdFromSeason: "M5";
  summary: string;
  basicUsage: string[];
  favorableMatchups: GuideMatchup[];
  unfavorableMatchups: GuideMatchup[];
  countermeasures: GuideCountermeasure[];
  beginnerSummary: string[];
  sourceIds: string[];
}

export const guideSources: GuideSource[] = [
  {
    id: "m5-arccosine-1900",
    title: "復帰勢によるシーズンM-5のレート1900到達パーティ",
    author: "arccosine",
    season: "M5",
    achievement: "レート1900到達",
    url: "https://pokesol.app/u/arccosine/articles/97feebf79dcd7f63",
    usedFor: "耐久ガブリアスの先発運用、得意な展開と苦手な初手対面",
  },
  {
    id: "m3-moyashi-37",
    title: "マスカカバマフォサイクル",
    author: "もやし",
    season: "M3",
    achievement: "最終37位・レート2510",
    url: "https://pokesol.app/u/pokemoyashi0128/articles/af85fe5b74f9240a",
    usedFor: "マスカーニャ、カバルドン、マフォクシー、ブリジュラス、ギャラドスの採用理由と役割分担",
  },
  {
    id: "m3-collar-96",
    title: "奇衒いサザングロス",
    author: "collar",
    season: "M3",
    achievement: "最終96位",
    url: "https://pokesol.app/u/collar_erpk_/articles/feb30b6b97a89980",
    usedFor: "メガメタグロス軸とアシレーヌ・カバルドン・ミミッキュの補完、受け崩し上の課題",
  },
  {
    id: "m3-hippo-262",
    title: "初手カバルドン展開",
    author: "helpinass",
    season: "M3",
    achievement: "最終262位",
    url: "https://pokesol.app/u/helpinass/articles/f75dcf91f3ce4c40",
    usedFor: "カバルドンからギャラドスへつなぐ展開、ブリジュラス・ミミッキュの処理範囲と苦手な並び",
  },
  {
    id: "m4-kou-237",
    title: "ギャラガブサフゴ",
    author: "コウ",
    season: "M4",
    achievement: "マンスリー最終237位・レート2000達成",
    url: "https://pokesol.app/u/kou_pkmn/articles/7de099823a222335",
    usedFor: "メガギャラドスの積み運用、ガブリアスの場作り、マフォクシーによる草メガ対策",
  },
  {
    id: "m4-asano-21",
    title: "シーズンM4 21連勝パーティ 選出編",
    author: "asano0282",
    season: "M4",
    achievement: "21連勝",
    url: "https://pokesol.app/u/asano0282/articles/35193e7e5783c63b",
    usedFor: "ブリジュラス初手、ミミッキュの対面処理、各上位ポケモンへの具体的な打点",
  },
  {
    id: "m4-ftn-5",
    title: "紫電アマガライチュウ",
    author: "ftn",
    season: "M4",
    achievement: "最終5位",
    url: "https://pokesol.app/u/ftn_poke/articles/f45faf94b9410c0d",
    usedFor: "ガブリアス・マスカーニャ・ミミッキュへの引き先と、マフォクシーを含む選出プラン",
  },
  {
    id: "m4-ryo-474",
    title: "皇帝カイリュー",
    author: "りょう",
    season: "M4",
    achievement: "最終474位・チャンピオン級到達",
    url: "https://pokesol.app/u/ryo_izumi/articles/775f2cf7fb259e6b",
    usedFor: "カイリューの対面性能、苦手な相手、交代先を用意する構築方針",
  },
  {
    id: "m4-rapid-839",
    title: "オオニューラのための対面構築",
    author: "黒羽ラピッド",
    season: "M4",
    achievement: "最終839位・レート2267",
    url: "https://pokesol.app/u/rapid_clover/articles/ae35feb0df2ce7a6",
    usedFor: "頑丈ブリジュラスの初手運用、メガマフォクシーの対鋼・対カバルドン、ミミッキュの対面枠",
  },
  {
    id: "m4-perapera-197",
    title: "ゲコリザXサイクル＋対面",
    author: "ぺランム",
    season: "M4",
    achievement: "最終197位・レート2399",
    url: "https://pokesol.app/u/perapera_poke/articles/1aaf5a348e11a2e2",
    usedFor: "ギャラドスを含む対面・サイクル選出と、メガ枠を通すための削り方",
  },
];

export const pokemonGuides: PokemonGuide[] = [
  {
    pokemonId: "garchomp", slug: "garchomp", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 1, createdFromSeason: "M5",
    summary: "速さと耐久を両立し、先発の場作りから終盤の掃除まで型によって仕事を変えられる地面アタッカーです。",
    basicUsage: [
      "最初に覚えたいのは、ガブリアスが「じしんで倒すポケモン」であると同時に、ステルスロックやドラゴンテールで後続を動きやすくするポケモンでもあることです。M5の現行データではきあいのタスキが最多で、こだわりスカーフ、オボンのみも使われています。相手の6匹を見て、先発で一度仕事をするのか、最後まで温存して上から倒すのかを先に決めます。",
      "M4のギャラドス軸では、耐久に振ったガブリアスがステルスロックやまきびし、ドラゴンテールで相手を削り、メガギャラドスがりゅうのまいを積む準備をしていました。M5の記事では、ねむる＋カゴのみの耐久型を先発に置き、状態異常を回復しながらカバルドンやウォッシュロトムへ粘り強く戦う例もあります。型を見せる前は相手もタスキ・スカーフ・耐久型を区別できない点が強みです。",
    ],
    favorableMatchups: [
      { pokemonId: "delphox", explanation: "じしんが通り、通常ガブリアスなら素早さでも上です。メガマフォクシーへは相手の素早さが上がるため、スカーフでない限り正面から追い掛けず、メガ前に削るか後続の先制技圏内へ入れます。", sourceIds: ["m4-kou-237", "m4-asano-21"] },
      { pokemonId: "metagross", explanation: "地面技で弱点を突けます。メガメタグロスの耐久と先制バレットパンチがあるので、一撃で倒す前提ではなく、ステルスロックを含めて削る役として考えると安定します。", caution: "れいとうパンチには注意。", sourceIds: ["m3-moyashi-37", "m4-asano-21"] },
      { pokemonId: "hippowdon", explanation: "M5の耐久型記事では先発カバルドンへ強く動けたと報告されています。ドラゴンテールや回復を使う型なら、単純な殴り合いではなく相手のあくび・回復の順番を崩せます。", caution: "タスキ攻撃型はカバルドンをすぐ突破できるとは限りません。", sourceIds: ["m5-arccosine-1900"] },
      { pokemonId: "archaludon", explanation: "じしんで弱点を突けるため、ブリジュラスの鋼技や電気技を受けながら圧力をかけられます。", caution: "がんじょうやシュカのみ、ドラゴン技があるため、無傷の相手を一手で処理できるとは限りません。", sourceIds: ["m4-asano-21"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "primarina", explanation: "フェアリー技で弱点を突かれ、こちらのドラゴン技は無効です。耐久ガブリアスが地震2回で押した実戦例はありますが、相手の型次第であり、基本の有利対面とは考えません。", sourceIds: ["m5-arccosine-1900"] },
      { pokemonId: "meowscarada", explanation: "スカーフ型は上からトリプルアクセルを撃てます。タスキ型同士でも多段技で行動保証を崩されるので、持ち物が分からない序盤は危険です。", sourceIds: ["m4-ftn-5", "m4-kou-237"] },
      { pokemonId: "mimikyu", explanation: "ばけのかわで一撃を受け、フェアリー技で返されます。削れたガブリアスはかげうちでも縛られるため、相手の皮を別の味方で先に剥がせると楽になります。", sourceIds: ["m4-asano-21"] },
      { pokemonId: "corviknight", explanation: "地面技を無効化し、物理技を受けやすい相手です。ガブリアスだけで突破しようとせず、電気・炎の特殊打点を持つ味方へつなぎます。", sourceIds: ["m4-ftn-5"] },
    ],
    countermeasures: [
      { title: "フェアリーと氷技を受ける味方を置く", targetPokemonIds: ["primarina", "meowscarada", "mimikyu"], body: "ブリジュラスやメタグロスのような鋼タイプを横に置くと、ガブリアスへ飛んでくるフェアリー技・氷技を受けやすくなります。ただし相手の地面・格闘技まで一匹で受けようとはせず、交換先を二段階で考えます。", teammatePokemonIds: ["archaludon", "metagross"], sourceIds: ["m3-collar-96", "m4-asano-21"] },
      { title: "先発で全部倒そうとしない", targetPokemonIds: ["primarina", "meowscarada"], body: "タスキならステルスロックかがんせきふうじを残し、耐久型ならドラゴンテールで相手を動かすだけでも十分です。後続のメガギャラドスや高速アタッカーが勝てる盤面を作ることを優先します。", teammatePokemonIds: ["gyarados"], sourceIds: ["m4-kou-237", "m5-arccosine-1900"] },
    ],
    beginnerSummary: ["まずはきあいのタスキ型で、じしん・ドラゴン技・ステルスロック・素早さ操作の形から始めると仕事が分かりやすいです。", "アシレーヌやスカーフマスカーニャが見えたら無理に居座らず、鋼タイプへ引くか、ガブリアスを一度使って後続の圏内へ入れる発想を持ちましょう。"],
    sourceIds: ["m5-arccosine-1900", "m4-kou-237", "m4-asano-21", "m3-collar-96", "m4-ftn-5"],
  },
  {
    pokemonId: "primarina", slug: "primarina", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 2, createdFromSeason: "M5",
    summary: "水・フェアリーの攻撃範囲と耐久を生かし、殴り合い、アンコール、めいそう、先制アクアジェットを一匹で使い分けます。",
    basicUsage: [
      "アシレーヌは、ムーンフォースとうたかたのアリアで正面から削りながら、最後はアクアジェットで残った相手を倒す特殊アタッカーです。M5ではオボンのみが最多で、たべのこしやカゴのみも見られます。まずは弱点を突くことより、オボン込みで一度攻撃を受け、相手を味方の先制技圏内へ入れる役を意識すると扱いやすくなります。",
      "アンコールは、相手が積み技・回復技・変化技を使った直後に同じ技へ固定するための技です。めいそう型なら特殊相手を起点にできますが、物理の鋼技や草技には無理をしません。M3最終96位の構築では、メガメタグロス、サザンドラ、カバルドンとの受け攻めの補完を評価して採用されていました。",
    ],
    favorableMatchups: [
      { pokemonId: "garchomp", explanation: "ドラゴン技を無効化し、ムーンフォースで弱点を突けます。タスキを想定して、アクアジェットまで含めて処理順を組み立てます。", caution: "耐久型や地震2回を狙う型もあるため、残りHPを見ずに居座り続けないこと。", sourceIds: ["m5-arccosine-1900", "m3-collar-96"] },
      { pokemonId: "delphox", explanation: "水技で炎タイプへ圧力をかけ、悪・ドラゴン技にも耐性があります。メガマフォクシーの草結びや積み技が見える場合は、後出しを繰り返さず一度で大きく削ります。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "dragonite", explanation: "フェアリー技でドラゴンを弱点にできます。カイリューのマルチスケイルが残っていると一撃にはならないので、ステルスロックや先制技と合わせます。", sourceIds: ["m4-ryo-474"] },
      { pokemonId: "gyarados", explanation: "メガ前後を通して水技は通りにくいものの、フェアリー技でメガギャラドスへ等倍以上の圧力をかけられます。りゅうのまいへアンコールを合わせられれば展開を止められます。", caution: "パワーウィップは弱点。", sourceIds: ["m4-kou-237"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "meowscarada", explanation: "上からトリックフラワーで弱点を突かれます。スカーフ型なら素早さ関係も逆転しにくく、削れていると安全に動けません。", sourceIds: ["m3-moyashi-37", "m4-kou-237"] },
      { pokemonId: "metagross", explanation: "高い物理耐久から鋼技で弱点を突かれます。記事でもアシレーヌ入りの並びにメタグロスが組まれますが、それは正面で勝つためではなく、お互いの苦手へ交換するためです。", sourceIds: ["m3-collar-96", "m4-asano-21"] },
      { pokemonId: "archaludon", explanation: "鋼技と10まんボルトの両方が候補です。特殊耐久型はアシレーヌのめいそうを見てからミラーコートを押せるほど余裕を持たせた例もあります。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "venusaur", explanation: "草技を受けるうえ、メガフシギバナは耐久も高く一度で突破しにくい相手です。", sourceIds: ["m4-kou-237"] },
    ],
    countermeasures: [
      { title: "草と鋼への交換先を先に決める", targetPokemonIds: ["meowscarada", "metagross", "venusaur"], body: "マフォクシーは草タイプや鋼タイプへ圧力をかけられます。アシレーヌを選出するときは、相手の草・鋼が出てきたら誰へ交代するかまでセットで決めておきます。", teammatePokemonIds: ["delphox"], sourceIds: ["m3-moyashi-37", "m4-kou-237"] },
      { title: "アンコールを対策技として使う", targetPokemonIds: ["gyarados", "mimikyu"], body: "りゅうのまい、つるぎのまい、回復技を見てからアンコールを押せれば、苦手な相手を直接倒さなくても味方へ安全につなげます。攻撃技を選ばれた後に押しても止まらないため、技を見てから使います。", sourceIds: ["m3-collar-96"] },
    ],
    beginnerSummary: ["最初はムーンフォース・水技・アクアジェット・アンコールの形で、攻撃と切り返しの両方を体験すると役割が分かります。", "マスカーニャやメタグロスをアシレーヌ一匹で解決せず、炎・鋼の味方へ交代してから、再び水・フェアリー技を通す順番を作りましょう。"],
    sourceIds: ["m3-collar-96", "m3-moyashi-37", "m4-kou-237", "m4-asano-21", "m4-ryo-474"],
  },
  {
    pokemonId: "meowscarada", slug: "meowscarada", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 3, createdFromSeason: "M5",
    summary: "高い素早さと、とんぼがえり・はたきおとすを使って序盤の情報と有利対面を作る攻撃的なつなぎ役です。",
    basicUsage: [
      "M5で最も多いのはこだわりスカーフ、次がきあいのタスキです。初手ではたきおとすで持ち物を消す、とんぼがえりで不利対面から味方へ戻る、終盤にトリックフラワーやトリプルアクセルで掃除する、という三つの仕事があります。スカーフ型は同じ技しか続けて選べないため、相手の交換先まで見て技を選びます。",
      "M3最終37位の構築では、初手のとんぼがえり・はたきおとす、中盤のマフォクシーからの引き先、終盤の掃除役を一匹で担当していました。トリックフラワーを必ず入れるのではなく、ギャラドス向けのかみなりパンチ、ブリジュラスへのはたきおとす、カイリューへのトリプルアクセルなど、構築が困る相手に合わせた技変更も実戦例があります。",
    ],
    favorableMatchups: [
      { pokemonId: "hippowdon", explanation: "トリックフラワーで弱点を突き、回復やあくびを使う前に大きく削れます。タスキ型ならあくびを受けても一度は行動できます。", caution: "交代読みの攻撃やステルスロックでタスキが潰れる展開には注意。", sourceIds: ["m3-moyashi-37", "m4-kou-237"] },
      { pokemonId: "gyarados", explanation: "かみなりパンチ採用型ならメガ前のギャラドスへ4倍弱点を突けます。トリックフラワーもメガ後には弱点です。", caution: "いかくを受けること、相手がいつメガシンカするかで必要な技が変わります。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "delphox", explanation: "はたきおとすがエスパーへ通り、耐久の薄いマフォクシーを大きく削れます。", caution: "メガ後は相手の方が速く、炎技で倒されるため、正面からの安定勝ちではありません。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "rotom-wash", explanation: "草技で弱点を突き、電気・水技の両方を半減できます。おにびを受けると物理火力が下がるので、はたきおとすやとんぼがえりで仕事を確保します。", sourceIds: ["m4-ftn-5"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "corviknight", explanation: "草技と悪技を受けやすく、物理耐久も高い相手です。M4最終5位の構築では、ガブリアスとマスカーニャの引き先としてアーマーガアが採用されていました。", sourceIds: ["m4-ftn-5"] },
      { pokemonId: "mimikyu", explanation: "ばけのかわで一度耐え、じゃれつく・かげうちで切り返されます。タスキが残っていても先制技で二度攻撃される流れを作られやすいです。", sourceIds: ["m4-ftn-5", "m4-asano-21"] },
      { pokemonId: "archaludon", explanation: "草を1/4、悪を半減し、鋼技で大きく削れます。はたきおとすで回復アイテムを消す仕事はできますが、正面突破は味方へ任せます。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "dragonite", explanation: "トリプルアクセルなら4倍弱点を狙えますが、マルチスケイルやメガシンカ、技外し、しんそくがあり安定しません。", sourceIds: ["m3-moyashi-37", "m4-ryo-474"] },
    ],
    countermeasures: [
      { title: "受けられたら、とんぼがえりで役割を渡す", targetPokemonIds: ["corviknight", "archaludon"], body: "倒そうとして同じ技を押し続けず、とんぼがえりでマフォクシーなどの特殊アタッカーへつなぎます。はたきおとすを一度入れておくと、交代先の回復手段も弱められます。", teammatePokemonIds: ["delphox"], sourceIds: ["m3-moyashi-37"] },
      { title: "先制技を受ける前に温存する", targetPokemonIds: ["mimikyu", "dragonite"], body: "終盤の掃除役にしたいなら、序盤にHPを使い切らないことが重要です。ミミッキュの皮は別の味方で剥がし、カイリューのマルチスケイルはステルスロックで崩してから戻します。", teammatePokemonIds: ["archaludon", "garchomp"], sourceIds: ["m4-asano-21", "m3-moyashi-37"] },
    ],
    beginnerSummary: ["最初はスカーフ型で、とんぼがえりを押して有利な味方へ戻す動きを覚えると扱いやすいです。", "アーマーガアやブリジュラスが見えたら一匹で突破せず、持ち物を落としてマフォクシーへつなぐ、と役割を二つに分けましょう。"],
    sourceIds: ["m3-moyashi-37", "m4-ftn-5", "m4-asano-21", "m4-ryo-474"],
  },
  {
    pokemonId: "archaludon", slug: "archaludon", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 4, createdFromSeason: "M5",
    summary: "高い物理耐久と、がんじょう・じきゅうりょくを生かし、先発の場作りか特殊アタッカーのどちらかを担います。",
    basicUsage: [
      "ブリジュラスは型で役割が大きく変わります。がんじょうで一度の行動を確保し、りゅうせいぐんやラスターカノンで削る攻撃型。特防へ厚く振り、ステルスロック・ほえる・ドラゴンテールで相手を動かす補助型。こだわりスカーフで意表を突く型です。M5ではじきゅうりょくが約4分の3ですが、先発に出た時点では相手から型が割れません。",
      "M4の21連勝構築では、基本的に初手ブリジュラスで荒らし、ステルスロックが不要でアシレーヌやカバルドンが先発に来そうなときだけミミッキュへ変えていました。M3最終37位では、特殊耐久型がカバルドンの持たないステルスロックを担当し、ほえるで身代わりや積みを流す役でした。まず「初手で削る型」か「後ろから受けて場を作る型」かを一つに決めます。",
    ],
    favorableMatchups: [
      { pokemonId: "meowscarada", explanation: "草を1/4、悪を半減し、ラスターカノンで押せます。はたきおとすで持ち物を失うのは痛いので、受け続けるのではなく攻撃して交代を促します。", sourceIds: ["m3-hippo-262"] },
      { pokemonId: "gyarados", explanation: "10まんボルトを採用する攻撃型なら、メガ前のギャラドスへ4倍、メガ後にも2倍です。非メガ型をブリジュラスで崩した実戦例があります。", sourceIds: ["m3-hippo-262"] },
      { pokemonId: "mimikyu", explanation: "ラスターカノンで弱点を突き、物理攻撃を受けるとじきゅうりょくで防御を上げられます。ばけのかわを剥がした後の処理役として安定します。", caution: "ドレインパンチやのろいには注意。", sourceIds: ["m4-asano-21"] },
      { pokemonId: "primarina", explanation: "鋼技と10まんボルトの二つの打点があります。特防型なら特殊技を受けながらミラーコートで大きく返す選択肢もあります。", caution: "めいそうやアンコールで補助技をずらされる可能性があります。", sourceIds: ["m3-moyashi-37"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "garchomp", explanation: "じしんで弱点を突かれます。がんじょうが残っていれば一度動けますが、ステルスロックなどで削られた後は行動保証がありません。", sourceIds: ["m3-moyashi-37", "m4-asano-21"] },
      { pokemonId: "metagross", explanation: "地面技やアームハンマーを持つ型があり、特殊耐久型は物理で崩されます。M3記事でもこの技構成ではメタグロスが困る相手と明記されています。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "hippowdon", explanation: "じしんで弱点を突かれ、回復やあくびで攻撃型の勢いを止められます。", sourceIds: ["m3-hippo-262"] },
      { pokemonId: "delphox", explanation: "特殊耐久に振っても、わるだくみから炎技を重ねられると受け切れません。ミラーコートを読まれて積まれる場面もあるため、ほえるを持つ型で対抗します。", sourceIds: ["m3-moyashi-37", "m4-asano-21"] },
    ],
    countermeasures: [
      { title: "地面技を無効にする味方を置く", targetPokemonIds: ["garchomp", "hippowdon", "metagross"], body: "ギャラドスやアーマーガアへ交代できれば地面技を無効化できます。特にギャラドスは威嚇も入り、ブリジュラスが苦手な物理地面へ二段構えで対応できます。", teammatePokemonIds: ["gyarados", "corviknight"], sourceIds: ["m3-hippo-262", "m4-ftn-5"] },
      { title: "積み技には、ほえるで対抗する", targetPokemonIds: ["delphox", "mimikyu"], body: "相手がわるだくみ・つるぎのまい・めいそうを使う構築なら、攻撃技だけでなくほえるを残します。倒すのではなく積みを消し、ステルスロックを踏ませるのが役目です。", sourceIds: ["m3-moyashi-37", "m4-asano-21"] },
    ],
    beginnerSummary: ["まずはがんじょうの攻撃型で、一度は動ける安心感を生かし、攻撃かステルスロックを選ぶところから始めましょう。", "ガブリアスやカバルドンが見えたら無理に先発へ置かず、地面無効のギャラドスを同時に選出すると役割が整理しやすくなります。"],
    sourceIds: ["m3-moyashi-37", "m3-hippo-262", "m4-asano-21", "m4-ftn-5", "m4-rapid-839"],
  },
  {
    pokemonId: "mimikyu", slug: "mimikyu", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 5, createdFromSeason: "M5",
    summary: "ばけのかわで一度の行動を作り、つるぎのまいと先制かげうちで崩れた試合を立て直す対面・終盤向けポケモンです。",
    basicUsage: [
      "ミミッキュの強みは、ばけのかわが残っていれば多くの攻撃を一度受けて動けることです。安全につるぎのまいを使い、じゃれつく・シャドークローで削り、最後をかげうちで取るのが基本です。M5ではいのちのたまが8割を超え、この分かりやすい対面型が中心です。",
      "ただし、ばけのかわはHPそのものを回復しません。ステルスロック、砂、先制技、連続技が重なるとすぐに圏内へ入ります。M4の対面構築では汎用的なゴースト枠として採用され、ムクホークのような相手を自由に動かさない役も担っていました。ウッドハンマーはカバルドンやアシレーヌを崩す実戦的な変更候補です。",
    ],
    favorableMatchups: [
      { pokemonId: "garchomp", explanation: "ドラゴン技を無効化し、じゃれつくで弱点を突けます。ばけのかわが残っていれば、スカーフ型にも一度動いてからかげうちまでつなげます。", sourceIds: ["m4-asano-21"] },
      { pokemonId: "dragonite", explanation: "フェアリー技が弱点で、ばけのかわにより一度は行動できます。マルチスケイルが残るため、つるぎのまいか事前の削りと合わせます。", sourceIds: ["m4-ryo-474"] },
      { pokemonId: "sneasler", explanation: "格闘技を無効化し、ばけのかわで別の攻撃も一度受けられます。相手の毒技や状態異常は無効ではないため、完全な受けではなく対面処理役です。", sourceIds: ["m4-rapid-839"] },
      { pokemonId: "hydreigon", explanation: "じゃれつくで4倍弱点を突け、かげうちで削れたスカーフ型も縛れます。M4の選出記事でも処理手段として明記されています。", sourceIds: ["m4-asano-21"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "metagross", explanation: "鋼技で弱点を突かれ、バレットパンチはかげうちと同じ先制技です。皮を剥がされた後は先制技同士でも火力・耐久差が出ます。", sourceIds: ["m3-collar-96"] },
      { pokemonId: "archaludon", explanation: "高い物理耐久とラスターカノンがあり、じきゅうりょく型は攻撃するほど硬くなります。のろいで崩す型以外は正面突破を狙いません。", sourceIds: ["m4-asano-21"] },
      { pokemonId: "hippowdon", explanation: "高い物理耐久で攻撃を受け、あくびやふきとばしでつるぎのまいの上昇を消されます。", caution: "ウッドハンマー採用なら大きく削れますが、反動で自分も先制技圏内へ入ります。", sourceIds: ["m4-asano-21", "m3-collar-96"] },
      { pokemonId: "gyarados", explanation: "いかくで攻撃を下げられ、メガシンカ後のかたやぶりはばけのかわを無視します。M4のメガギャラドス記事でもミミッキュに強く出られる点が評価されています。", sourceIds: ["m4-kou-237"] },
    ],
    countermeasures: [
      { title: "受けポケモンには役割破壊技か、別の勝ち筋", targetPokemonIds: ["hippowdon", "archaludon"], body: "カバルドンへはウッドハンマー、鋼へはドレインパンチが候補ですが、すべてを一つの型に入れることはできません。構築で最も困る相手を一つだけ技で見るか、マフォクシーなどの特殊アタッカーへ任せます。", teammatePokemonIds: ["delphox"], sourceIds: ["m4-asano-21", "m3-moyashi-37"] },
      { title: "ばけのかわを終盤まで残す", targetPokemonIds: ["metagross", "gyarados"], body: "初手で皮を使うより、相手のメガ枠や積みエースが出た後に投げる方が切り返しになります。メガギャラドスのかたやぶりには皮が機能しないため、アシレーヌなど別のストッパーを用意します。", teammatePokemonIds: ["primarina"], sourceIds: ["m4-kou-237", "m3-collar-96"] },
    ],
    beginnerSummary: ["最初はつるぎのまい・じゃれつく・シャドークロー・かげうちで、ばけのかわ一回を攻撃回数へ変える動きを覚えます。", "カバルドンやブリジュラスまで一匹で見るのではなく、どちらか一つを対策技で補い、残りは特殊アタッカーに任せると技選びが明確になります。"],
    sourceIds: ["m4-asano-21", "m4-kou-237", "m3-collar-96", "m4-rapid-839"],
  },
  {
    pokemonId: "hippowdon", slug: "hippowdon", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 6, createdFromSeason: "M5",
    summary: "物理攻撃を受け、あくびとステルスロックで相手を交代させながら、味方のエースが動ける一ターンを作ります。",
    basicUsage: [
      "カバルドンは相手を直接倒すより、じしんを警戒させながらステルスロックを置き、あくびで交代させるポケモンです。相手が眠りを嫌って交代すればステルスロックの削りが入り、居座れば次のターンに眠ります。その隙にマフォクシーやギャラドスなど、積み技を使う味方へつなぎます。",
      "M5ではオボンのみが約3分の2で、次がたべのこしです。M3最終37位ではステルスロックをブリジュラスへ任せ、カバルドンはまもるとあくびで物理を流す役に集中していました。技を全部詰め込むのではなく、ステルスロック型か、回復・まもるを厚くした型かを味方に合わせて決めます。",
    ],
    favorableMatchups: [
      { pokemonId: "metagross", explanation: "物理耐久と地面技で圧力をかけられます。メガメタグロスを止める代表的な引き先ですが、くさむすび採用はこのカバルドンを崩すための実戦的な対策です。", caution: "くさむすびが見えたら受け続けないこと。", sourceIds: ["m3-collar-96"] },
      { pokemonId: "mimikyu", explanation: "物理耐久で攻撃を受け、あくび・ふきとばしでつるぎのまいを消せます。", caution: "いのちのたまウッドハンマーは大きなダメージになります。", sourceIds: ["m3-collar-96", "m4-asano-21"] },
      { pokemonId: "garchomp", explanation: "耐久へ振った型なら物理ガブリアスを流し、あくびで次の行動を制限できます。", caution: "つるぎのまい、耐久ドラゴンテール、特殊な回復型など、型によって長期戦の結果が変わります。", sourceIds: ["m3-moyashi-37", "m5-arccosine-1900"] },
      { pokemonId: "gyarados", explanation: "メガ後は飛行タイプを失うのでじしんが通り、挑発が少ないメガ型をカバルドンでいなした実戦例があります。", caution: "メガ前の飛行タイプにはじしんが無効で、挑発型はあくびを止めます。", sourceIds: ["m3-hippo-262"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "primarina", explanation: "特殊水技で弱点を突かれます。M3の構築でもアシレーヌ入りの並びには割り切ったプレイが必要とされました。", sourceIds: ["m3-hippo-262"] },
      { pokemonId: "meowscarada", explanation: "トリックフラワーは急所に当たるため、防御上昇に頼れず弱点を突かれます。先発対面から居座るより、鋼タイプへ引く方が安全です。", sourceIds: ["m3-hippo-262"] },
      { pokemonId: "delphox", explanation: "草結びが体重の重いカバルドンへ高威力になり、わるだくみの起点にされる可能性もあります。M4記事でも草結びで迅速に処理できることが採用理由でした。", sourceIds: ["m4-rapid-839", "m4-asano-21"] },
      { pokemonId: "gyarados", explanation: "非メガのままなら地面無効で、ちょうはつによりあくび・回復を止めます。型が分からない選出画面では完全な有利とは数えません。", sourceIds: ["m3-hippo-262"] },
    ],
    countermeasures: [
      { title: "水・草を受ける味方を置く", targetPokemonIds: ["primarina", "meowscarada"], body: "マスカーニャは水・悪・ゴーストの一貫も切りやすく、ブリジュラスは草技を1/4にします。カバルドンがあくびを入れた後にこの味方へ替え、相手の交換先へ圧力をかけます。", teammatePokemonIds: ["meowscarada", "archaludon"], sourceIds: ["m3-moyashi-37"] },
      { title: "ステルスロック役を分担する", targetPokemonIds: ["delphox", "gyarados"], body: "カバルドンがまもる・なまける・ふきとばしを持ちたい場合、ブリジュラスへステルスロックを任せられます。役割を分けると、カバルドン自身は苦手対面から退く余裕を作れます。", teammatePokemonIds: ["archaludon"], sourceIds: ["m3-moyashi-37"] },
    ],
    beginnerSummary: ["まずはステルスロック→あくびの順を覚え、相手が交代したら味方の積みエースへつなぐ動きから始めます。", "アシレーヌやマスカーニャを見たらカバルドンを出さないのではなく、そこへ交代できるブリジュラスなどを一緒に選ぶ、と考えましょう。"],
    sourceIds: ["m3-moyashi-37", "m3-collar-96", "m3-hippo-262", "m4-rapid-839", "m4-asano-21"],
  },
  {
    pokemonId: "gyarados", slug: "gyarados", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 7, createdFromSeason: "M5",
    summary: "いかくで物理相手に一度動き、りゅうのまいからメガシンカして全抜きを狙う、分かりやすい積みエースです。",
    basicUsage: [
      "M5では約4分の3がギャラドスナイトで、りゅうのまいが約8割です。メガ前はいかくと地面無効を使って場へ出し、りゅうのまいを使える一ターンを作ります。メガ後は水・悪タイプになり、かたやぶりでミミッキュのばけのかわや一部の防御特性を無視して攻撃できます。いつメガシンカするかが使い方の中心です。",
      "M4のレート2000構築では、ガブリアスがステルスロックやドラゴンテールで削り、メガギャラドスを通していました。技はたきのぼり、かみくだく、パワーウィップ、じしんなどから三つしか選べません。アシレーヌやミラーを見るパワーウィップ、鋼・ゴーストを見るかみくだく、電気・鋼を見るじしんというように、味方で処理できない相手から選びます。",
    ],
    favorableMatchups: [
      { pokemonId: "metagross", explanation: "メガ後のかみくだくで弱点を突き、メガ前のいかくで物理火力を下げられます。鉄壁型には積み合わず、削ってから通します。", sourceIds: ["m4-kou-237"] },
      { pokemonId: "mimikyu", explanation: "メガ後のかたやぶりでばけのかわを無視できます。いかくで攻撃も下げられるため、通常のアタッカーより切り返されにくいです。", sourceIds: ["m4-kou-237"] },
      { pokemonId: "delphox", explanation: "水技で弱点を突き、炎技を半減します。メガ前は草結びが4倍弱点になるので、相手の技構成が分からないまま後出ししないことが大切です。", sourceIds: ["m4-kou-237"] },
      { pokemonId: "hippowdon", explanation: "メガ前はじしん無効で、ちょうはつがあればあくびを止められます。身代わり型でドラゴンテールやあくびの展開を避けた実戦例もあります。", caution: "メガシンカすると地面技が弱点になるため、メガするターンを選びます。", sourceIds: ["m3-moyashi-37", "m3-hippo-262"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "meowscarada", explanation: "スカーフ型が上から草技を撃ち、メガ前後どちらにも弱点を突けます。M4の構築でも重い相手として明記され、早めに数的有利を取って一貫を作らせない方針でした。", sourceIds: ["m4-kou-237"] },
      { pokemonId: "primarina", explanation: "メガ後はフェアリー技が弱点で、メガ前にはりゅうのまいをアンコールされる可能性があります。パワーウィップがあっても外しや耐久を考えると安定しません。", sourceIds: ["m4-kou-237"] },
      { pokemonId: "archaludon", explanation: "10まんボルトでメガ前4倍・メガ後2倍を突かれます。高い物理耐久もあり、積む前の正面突破は難しい相手です。", sourceIds: ["m3-hippo-262"] },
      { pokemonId: "venusaur", explanation: "草技で弱点を突き、メガフシギバナは厚い耐久で攻撃を受けます。M4構築ではこの相手のためにメガマフォクシーを補完採用していました。", sourceIds: ["m4-kou-237"] },
    ],
    countermeasures: [
      { title: "草と電気へ強い味方で先に削る", targetPokemonIds: ["meowscarada", "archaludon", "venusaur"], body: "マフォクシーは草タイプへ強く、ガブリアスは電気無効と地面打点を持ちます。ギャラドスを最初から出すのではなく、苦手を削ってから最後にりゅうのまいを狙います。", teammatePokemonIds: ["delphox", "garchomp"], sourceIds: ["m4-kou-237"] },
      { title: "メガ前の耐性を捨てるタイミングを選ぶ", targetPokemonIds: ["hippowdon", "mimikyu"], body: "地面技を受けるターンはメガ前、ばけのかわを無視して倒したいターンはメガ後です。毎試合同じターンにメガシンカせず、必要な耐性と特性を見て決めます。", sourceIds: ["m3-hippo-262", "m4-kou-237"] },
    ],
    beginnerSummary: ["まずはカバルドンやガブリアスでステルスロック・あくびを使い、相手が交代する一ターンにりゅうのまいを積む形から始めます。", "マスカーニャとブリジュラスが残っているうちは全抜きを急がず、マフォクシーやガブリアスで削ってからギャラドスを出しましょう。"],
    sourceIds: ["m4-kou-237", "m3-moyashi-37", "m3-hippo-262", "m4-perapera-197"],
  },
  {
    pokemonId: "delphox", slug: "delphox", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 8, createdFromSeason: "M5",
    summary: "メガシンカ後の高い素早さから特殊技を撃ち分け、わるだくみで受け寄りの相手も崩す高速特殊エースです。",
    basicUsage: [
      "現在はほぼ全てがマフォクシナイトで、記事もメガマフォクシー中心です。メガシンカ後の高い素早さを生かし、炎技とエスパー技で上から攻撃します。相手の交代が読めるときにわるだくみを使えば、耐久ポケモンまで突破圏内へ入ります。ただし物理耐久は高くないので、ミミッキュなどの先制技を受けてから積む使い方はしません。",
      "M3最終37位の構築では、新規メガシンカのバシャーモ、メタグロス、ムクホーク、ドラミドロなどへ強いことから軸に選ばれ、カバルドンが物理を流してあくびで積む隙を作りました。草結びは水タイプやカバルドンへ選出できる理由になり、マジカルシャインはサザンドラなど悪・ドラゴンへの打点です。四枠すべてに意味があるため、味方で誰を見るかを決めて技を選びます。",
    ],
    favorableMatchups: [
      { pokemonId: "metagross", explanation: "炎技で鋼を弱点にできます。M3記事ではカバルドンと組み、鉄壁メタグロスへ全勝した実戦報告があります。", caution: "メガメタグロスの素早さと地面技、先制バレットパンチがあるため、無傷同士の雑な後出しはしません。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "venusaur", explanation: "炎・エスパーの両方で弱点を突けます。メガギャラドスが苦手なメガフシギバナ対策として補完採用された例があります。", sourceIds: ["m4-kou-237"] },
      { pokemonId: "hippowdon", explanation: "草結び採用型なら重いカバルドンを大きく削れます。M4記事でも迅速に処理できることが採用理由でした。", caution: "草結びを持たない型では、あくびやじしんで止められます。", sourceIds: ["m4-rapid-839", "m4-asano-21"] },
      { pokemonId: "archaludon", explanation: "特殊耐久へ厚く振った型にも、わるだくみから高火力の炎技を重ねて圧力をかけられます。", caution: "ミラーコートをそのまま受けると倒されるため、積み技・みがわり・ほえるの有無を見ます。", sourceIds: ["m3-moyashi-37", "m4-asano-21"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "garchomp", explanation: "じしんと岩技が通り、通常マフォクシーの段階ではガブリアスの方が速いです。メガ後もスカーフ型には上を取られます。", sourceIds: ["m4-asano-21"] },
      { pokemonId: "gyarados", explanation: "水技で弱点を突かれ、メガ後は悪タイプでエスパー技も無効です。草結びがあっても、相手のメガタイミングで打点が変わります。", sourceIds: ["m4-kou-237"] },
      { pokemonId: "primarina", explanation: "炎を半減し、水技で弱点を突きます。草結びが選出根拠になるものの、オボン込みの耐久やアクアジェットがあるため安定した一対一ではありません。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "mimikyu", explanation: "ばけのかわで一発を受け、ゴースト技とかげうちで弱点を突きます。M3構築でもマフォクシーが苦手な物理全般の代表として明記されました。", sourceIds: ["m3-moyashi-37"] },
    ],
    countermeasures: [
      { title: "物理相手にはカバルドンを先に置く", targetPokemonIds: ["garchomp", "mimikyu"], body: "カバルドンで物理攻撃を受け、あくびで交代を促します。相手が交代するターンにマフォクシーを出せれば、HPを残したままわるだくみを狙えます。", teammatePokemonIds: ["hippowdon"], sourceIds: ["m3-moyashi-37"] },
      { title: "水への打点を技か別軸で用意する", targetPokemonIds: ["gyarados", "primarina"], body: "草結びを採用するか、マスカーニャを水への引き先にします。M3最終37位構築では、メガスターミーなどでマフォクシーを出せない試合に備え、壁＋メガギャラドスの別軸も用意していました。", teammatePokemonIds: ["meowscarada", "gyarados"], sourceIds: ["m3-moyashi-37"] },
    ],
    beginnerSummary: ["まずは炎技・エスパー技・わるだくみ・草結びの形で、カバルドンのあくびから安全に積む動きを試します。", "ミミッキュやスカーフガブリアスが残っているなら全抜きを急がず、カバルドンで先に削って先制技圏外のHPを保ちましょう。"],
    sourceIds: ["m3-moyashi-37", "m4-kou-237", "m4-asano-21", "m4-rapid-839", "m4-ftn-5"],
  },
  {
    pokemonId: "dragonite", slug: "dragonite", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 9, createdFromSeason: "M5",
    summary: "マルチスケイルの行動保証と、メガ後の型の広さを生かし、相手に物理・特殊のどちらで来るかを読ませない対面エースです。",
    basicUsage: [
      "M5ではカイリュナイトが約8割で、かえんほうしゃ、りゅうせいぐん、はねやすめ、エアスラッシュ、しんそくなどが混在しています。つまり、従来の物理しんそく型だけを想定してはいけません。まず無傷のマルチスケイルで一度行動し、相手の受け方を見てからメガシンカや技を選びます。",
      "M4最終474位の記事では、カイリューの対面性能の高さを軸に構築が組まれました。一方で、アシレーヌ、マスカーニャ、フェアリー系、ゲッコウガなど正面で厳しい相手を具体的に挙げ、その相手への引き先を作ることが課題でした。強い一匹だから毎回居座るのではなく、苦手な相手が見えた時の交換先まで用意して初めて性能を出せます。",
    ],
    favorableMatchups: [
      { pokemonId: "meowscarada", explanation: "メガ前は草を1/4にし、しんそくで削れたスカーフ型を先制して倒せます。", caution: "トリプルアクセルは4倍弱点で、マルチスケイルを複数回攻撃するため正面から安全とは言えません。", sourceIds: ["m4-ryo-474"] },
      { pokemonId: "hippowdon", explanation: "地面技を無効化し、はねやすめ型なら場持ちします。特殊技を持つ型なら高い物理耐久も越えやすいです。", caution: "ステルスロックでマルチスケイルを崩され、ふきとばしで積みを消されます。", sourceIds: ["m4-ryo-474"] },
      { pokemonId: "corviknight", explanation: "特殊のかえんほうしゃ採用型なら鋼・飛行へ大きな圧力をかけます。物理型だけだと思って受けに来た相手を崩せるのが型の広さです。", sourceIds: ["m4-ryo-474"] },
      { pokemonId: "gyarados", explanation: "10まんボルト採用型なら、メガシンカ前には4倍、メガシンカ後にも2倍の弱点を突けます。", caution: "メガギャラドスのかたやぶりはマルチスケイルを無視するため、相手が攻撃へ移る前に削る必要があります。", sourceIds: ["m4-kou-237"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "primarina", explanation: "ドラゴン技を無効化し、フェアリー技で弱点を突きます。M4のカイリュー記事でも厳しい相手の一つに挙げられています。", sourceIds: ["m4-ryo-474"] },
      { pokemonId: "mimikyu", explanation: "ドラゴン無効、フェアリー弱点、ばけのかわの行動保証が揃います。しんそくもゴーストタイプには無効です。", sourceIds: ["m4-ryo-474"] },
      { pokemonId: "meowscarada", explanation: "スカーフ＋トリプルアクセルなら上から4倍弱点を複数回突きます。M4記事でも苦手な相手として挙げられました。", sourceIds: ["m4-ryo-474"] },
      { pokemonId: "archaludon", explanation: "ドラゴン技を等倍に抑え、高い物理耐久で物理型を受けます。特殊型でも相手のりゅうせいぐんが弱点です。", sourceIds: ["m4-ryo-474"] },
    ],
    countermeasures: [
      { title: "フェアリーへの鋼の引き先を作る", targetPokemonIds: ["primarina", "mimikyu"], body: "ブリジュラスやメタグロスへ交代し、フェアリー技を受けます。カイリューのマルチスケイルを残せれば、終盤にもう一度行動保証として使えます。", teammatePokemonIds: ["archaludon", "metagross"], sourceIds: ["m4-ryo-474", "m3-collar-96"] },
      { title: "ステルスロックを置かせない・除去ではなく圧力をかける", targetPokemonIds: ["hippowdon", "archaludon"], body: "カバルドンやブリジュラスへ簡単に補助技を使わせるとマルチスケイルが消えます。初手から弱点技を持つ味方で圧力をかけるか、挑発などで一度止めてカイリューを温存します。", teammatePokemonIds: ["meowscarada"], sourceIds: ["m4-ryo-474"] },
    ],
    beginnerSummary: ["最初はカイリュナイト型でも、物理か特殊のどちらかへ技を寄せ、無傷のマルチスケイルで一度動くことを優先します。", "アシレーヌ・ミミッキュには居座らず鋼へ引き、ステルスロックを置く相手は先に削る。この二点を決めると、終盤のしんそくや高速特殊技を通しやすくなります。"],
    sourceIds: ["m4-ryo-474", "m4-kou-237", "m3-collar-96"],
  },
  {
    pokemonId: "metagross", slug: "metagross", rule: "Singles", seasonScope: ["M3", "M4", "M5"], rankAtCreation: 10, createdFromSeason: "M5",
    summary: "メガシンカ後の高い攻撃・耐久・素早さとバレットパンチを生かし、正面の殴り合いと終盤の掃除を両立します。",
    basicUsage: [
      "現在はほぼ全てがメタグロスナイトです。サイコファングを中心に、バレットパンチで削れた相手を先制処理し、じしん・れいとうパンチ・かみなりパンチ・アームハンマーなどから構築に必要な範囲を選びます。攻撃技だけでなく、てっぺき＋ボディプレスで物理相手を起点にする型も約2割見られます。",
      "M3最終96位の構築は、高火力・高耐久・先制技による対面性能を理由にメガメタグロスから組み始めました。アシレーヌ、サザンドラ、カバルドンを並べ、炎・地面・悪・ゴーストへの交換先を作っています。カバルドンやヤドランへ後投げされる問題には、くさむすびという特殊技を採用した上位構築もありました。技範囲の広さは、苦手を全部一匹で見るためではなく、味方が最も困る一匹を崩すために使います。",
    ],
    favorableMatchups: [
      { pokemonId: "primarina", explanation: "鋼技とかみなりパンチで弱点を突き、高い物理耐久でアクアジェットも受けます。M3では同じ構築に入れて相互補完する例も多く、対面時はメタグロス側が圧力をかけます。", sourceIds: ["m3-collar-96", "m4-asano-21"] },
      { pokemonId: "mimikyu", explanation: "鋼技とバレットパンチで弱点を突けます。ばけのかわを一度剥がす必要はありますが、その後の先制技勝負で優位を取りやすいです。", sourceIds: ["m3-collar-96"] },
      { pokemonId: "dragonite", explanation: "れいとうパンチならメガ前カイリューの4倍弱点を突けます。バレットパンチで削れた相手をマルチスケイルごと処理するのではなく、先に別の攻撃でマルチスケイルを崩します。", sourceIds: ["m3-collar-96"] },
      { pokemonId: "meowscarada", explanation: "バレットパンチで弱点を突き、こだわりスカーフ型に対しても先制技として先に攻撃できます。", caution: "はたきおとすはメガ前の持ち物へ圧力があり、悪技も弱点なので安全な後出しではありません。", sourceIds: ["m3-collar-96"] },
    ],
    unfavorableMatchups: [
      { pokemonId: "garchomp", explanation: "じしんで弱点を突かれ、スカーフ型ならメガ後も上を取られます。れいとうパンチで返せる型でも、正面から必ず勝てる関係ではありません。", sourceIds: ["m3-collar-96", "m4-asano-21"] },
      { pokemonId: "hippowdon", explanation: "高い物理耐久、回復、あくび、地面技で止められます。くさむすび採用が生まれたほど明確な交換先です。", sourceIds: ["m3-collar-96"] },
      { pokemonId: "delphox", explanation: "炎技で弱点を突かれます。メガマフォクシーは素早く、カバルドンのあくびから安全に積まれると受けられません。", sourceIds: ["m3-moyashi-37"] },
      { pokemonId: "gyarados", explanation: "メガ前のいかくで攻撃を下げ、メガ後のかみくだくで弱点を突きます。鉄壁型でも特殊な補完がなければ崩されます。", sourceIds: ["m4-kou-237"] },
    ],
    countermeasures: [
      { title: "カバルドンには技か味方のどちらかで対応する", targetPokemonIds: ["hippowdon"], body: "くさむすびを入れればカバルドンへの役割破壊になりますが、その分パンチ技を一つ失います。技枠を使わないなら、アシレーヌやマスカーニャでカバルドンを先に削ります。", teammatePokemonIds: ["primarina", "meowscarada"], sourceIds: ["m3-collar-96"] },
      { title: "炎・地面への交換先を用意する", targetPokemonIds: ["garchomp", "delphox", "gyarados"], body: "アシレーヌは炎・水・悪へ、カバルドンは物理地面へ、サザンドラは地面無効と悪耐性で補完します。一匹で受け切るのではなく、相手の技に応じて交換先を分けます。", teammatePokemonIds: ["primarina", "hippowdon", "hydreigon"], sourceIds: ["m3-collar-96"] },
    ],
    beginnerSummary: ["最初はサイコファング・バレットパンチに、じしんとパンチ技を一つ加え、正面で一匹を削って先制技で締める動きを覚えます。", "カバルドンと炎タイプをメタグロスだけで突破しようとせず、アシレーヌやマスカーニャへ役割を分けると技構成が決めやすくなります。"],
    sourceIds: ["m3-collar-96", "m3-moyashi-37", "m4-kou-237", "m4-asano-21"],
  },
];

export const guideBySlug = new Map(pokemonGuides.map((guide) => [guide.slug, guide]));
export const guideByPokemonId = new Map(pokemonGuides.map((guide) => [guide.pokemonId, guide]));
export const sourceById = new Map(guideSources.map((source) => [source.id, source]));

export function hasPokemonGuide(pokemonId: string) {
  return guideByPokemonId.has(pokemonId);
}
