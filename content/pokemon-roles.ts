export const roleGroups = [
  { id: "offense", label: "攻め", description: "技でダメージを与え、相手を倒すことを中心にする役割。" },
  { id: "defense", label: "受け", description: "相手の攻撃を耐え、回復や状態異常を使いながら長く戦う役割。" },
  { id: "balance", label: "バランス", description: "攻撃と交代を組み合わせ、攻守を切り替えながら有利な状況を作る役割。" },
  { id: "support", label: "サポート", description: "場の効果や変化技を使い、味方が戦いやすい状況を作る役割。" },
] as const;

export type RoleGroupId = typeof roleGroups[number]["id"];

export const pokemonRoleDefinitions = [
  { id: "physical-attacker", label: "物理アタッカー", group: "offense", description: "攻撃の高さを生かし、物理技を中心にダメージを与える。" },
  { id: "special-attacker", label: "特殊アタッカー", group: "offense", description: "特攻の高さを生かし、特殊技を中心にダメージを与える。" },
  { id: "mixed-attacker", label: "両刀アタッカー", group: "offense", description: "物理技と特殊技の両方を使い、相手に合わせて攻め方を変える。" },
  { id: "fast-attacker", label: "高速アタッカー", group: "offense", description: "高い素早さを生かし、相手より先に攻撃する。" },
  { id: "power-attacker", label: "高火力アタッカー", group: "offense", description: "高い攻撃力や威力の高い技で、一撃の大きさを生かして攻める。" },
  { id: "setup-sweeper", label: "積みエース", group: "offense", description: "能力を上げる技を使い、その後に一気に攻める。" },
  { id: "priority-attacker", label: "先制技アタッカー", group: "offense", description: "素早さに関係なく先に出やすい技で、弱った相手を仕留める。" },
  { id: "bulky-attacker", label: "耐久アタッカー", group: "offense", description: "攻撃を一度耐えやすい強みを生かし、反撃してダメージを与える。" },
  { id: "wallbreaker", label: "耐久崩し", group: "offense", description: "高火力や妨害を使い、回復しながら戦う相手を突破する。" },
  { id: "physical-wall", label: "物理受け", group: "defense", description: "高い防御を生かし、物理技を受け止める。" },
  { id: "special-wall", label: "特殊受け", group: "defense", description: "高い特防を生かし、特殊技を受け止める。" },
  { id: "mixed-wall", label: "両受け", group: "defense", description: "物理・特殊の両方に耐えやすく、幅広い相手を受け止める。" },
  { id: "recovery-wall", label: "回復耐久", group: "defense", description: "回復技を使い、何度も攻撃を受けながら長く戦う。" },
  { id: "status-stall", label: "状態異常耐久", group: "defense", description: "毒ややけどなどで相手を少しずつ消耗させながら耐える。" },
  { id: "team-cushion", label: "クッション", group: "defense", description: "味方が苦手な攻撃を代わりに受け、安全な交代先になる。" },
  { id: "bulky-offense", label: "攻守両立", group: "balance", description: "耐久と攻撃力の両方を生かし、受けてから反撃する。" },
  { id: "cycle", label: "サイクル", group: "balance", description: "相性のよい味方と交代を繰り返し、少しずつ有利な状況を作る。" },
  { id: "offensive-pivot", label: "攻撃して交代", group: "balance", description: "攻撃したあと味方へ交代する技を使い、攻めながら次へつなぐ。" },
  { id: "defensive-pivot", label: "受けて交代", group: "balance", description: "攻撃を受けてから味方へつなぎ、チームの交代を安定させる。" },
  { id: "entry-hazard", label: "設置技", group: "support", description: "ステルスロックなどを置き、交代で出てくる相手を削る。" },
  { id: "screens", label: "壁張り", group: "support", description: "リフレクターやひかりのかべで、味方が受けるダメージを減らす。" },
  { id: "rain-setter", label: "雨始動", group: "support", description: "雨を降らせ、水技や雨を利用する味方を強くする。" },
  { id: "sun-setter", label: "晴れ始動", group: "support", description: "晴れにして、炎技や晴れを利用する味方を強くする。" },
  { id: "sand-setter", label: "砂始動", group: "support", description: "砂嵐を起こし、天候を利用する味方を助けながら相手を削る。" },
  { id: "trick-room", label: "トリックルーム", group: "support", description: "一定時間、素早さの低いポケモンから動きやすい場を作る。" },
  { id: "tailwind", label: "追い風", group: "support", description: "おいかぜを使い、数ターンの間、味方が先に動きやすくする。" },
  { id: "status-support", label: "状態異常", group: "support", description: "眠り・毒・やけどなどを与え、相手の行動や耐久を妨げる。" },
  { id: "stat-control", label: "能力操作", group: "support", description: "相手の能力を下げたり、上がった能力を元に戻したりする。" },
  { id: "disruption", label: "行動妨害", group: "support", description: "ちょうはつやアンコールなどで、相手が選べる行動を狭める。" },
  { id: "hazard-removal", label: "設置物除去", group: "support", description: "味方側に置かれたステルスロックなどを取り除く。" },
  { id: "team-healing", label: "味方の回復", group: "support", description: "自分以外の味方を回復し、チーム全体を長く戦わせる。" },
] as const satisfies readonly { id: string; label: string; group: RoleGroupId; description: string }[];

export type PokemonRoleId = typeof pokemonRoleDefinitions[number]["id"];
export const pokemonRoleById = new Map(pokemonRoleDefinitions.map((role) => [role.id, role]));
