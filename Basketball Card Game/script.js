const GAME_DATA = window.BASKETBALL_CARD_DATA;

if (!GAME_DATA || !Array.isArray(GAME_DATA.sets) || !GAME_DATA.sets.length) {
  throw new Error("Player dataset missing. Load player-data.js before script.js.");
}

const STORAGE_KEY = "hoops-card-club-save-v6";
const BASE_CLICK_VALUE = 1;
const BASE_PASSIVE_PER_SECOND = 0.24;
const STARTING_MONEY = 0;

const rarityTiers = [
  { id: "silver", label: "Silver", min: 0, max: 81, sellPrice: 10, color: "var(--silver)" },
  { id: "gold", label: "Gold", min: 82, max: 87, sellPrice: 42, color: "var(--gold-card)" },
  { id: "diamond", label: "Glass", min: 88, max: 95, sellPrice: 120, color: "var(--diamond)" },
  { id: "mythic", label: "Mythic", min: 96, max: 100, sellPrice: 285, color: "var(--mythic)" },
  { id: "blackmatter", label: "Black Matter", min: 99, max: 100, sellPrice: 520, color: "var(--blackmatter)" },
  { id: "legends", label: "Legends", min: 0, max: 100, sellPrice: 400, color: "#f3d37f" },
];

const visibleRarityOptions = [
  { id: "silver", value: "silver", label: "Silver" },
  { id: "gold", value: "gold", label: "Gold" },
  { id: "diamond", value: "diamond", label: "Glass" },
  { id: "blackmatter", value: "blackmatter", label: "Black Matter" },
  { id: "legends", value: "legends", label: "Legends" },
];
const visibleRarityIds = new Set(visibleRarityOptions.map((tier) => tier.id));

const HALL_OF_FAME_LOGO_URL = "https://www.hoophall.com/packages/bhof/themes/bhof/dist/images/bhof_logo.svg";
const BLACK_MATTER_PLAYERS = {
  "shai-gilgeous-alexander": {
    ability: 100,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/OKC%20Thunder%20at%20Washington%20Wizards%20%2851815871018%29.jpg",
    imagePosition: "center 16%",
    imageScale: 1.03,
  },
  "luka-doncic": {
    ability: 99,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Luka%20Don%C4%8Di%C4%87%202021.jpg",
    imagePosition: "center 12%",
    imageScale: 1.06,
  },
  "nikola-jokic": {
    ability: 99,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nikola%20Jokic%20free%20throw%20%28cropped%29.jpg",
    imagePosition: "center 16%",
    imageScale: 1.05,
  },
  "victor-wembanyama": {
    ability: 99,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Victor%20Wembanyama%20San%20Antonio%20Spurs%202024.jpg",
    imagePosition: "center 10%",
    imageScale: 1.06,
  },
  "giannis-antetokounmpo": {
    ability: 99,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Giannis%20Antetokounmpo%20%2851664127127%29%2001.jpg",
    imagePosition: "center 12%",
    imageScale: 1.04,
  },
};

const packTypes = [
  {
    id: "street",
    name: "Street Pack",
    cost: 0,
    baseCards: 3,
    guaranteedCards: 0,
    guaranteedMinAbility: 0,
    unlockUpgrade: null,
    accent: "#df6f2d",
    accentSecondary: "#ffd38c",
    stamp: "Free Rip",
    description: "Free starter pack with no guaranteed floor.",
  },
  {
    id: "riser",
    name: "Riser Pack",
    cost: 28,
    baseCards: 3,
    guaranteedCards: 1,
    guaranteedMinAbility: 85,
    unlockUpgrade: null,
    accent: "#2276c9",
    accentSecondary: "#9ed8ff",
    stamp: "Quick Hit",
    description: "Compact pack with one guaranteed 85+ player.",
  },
  {
    id: "bench",
    name: "Bench Pack",
    cost: 34,
    baseCards: 5,
    guaranteedCards: 0,
    guaranteedMinAbility: 0,
    unlockUpgrade: null,
    accent: "#27a7a1",
    accentSecondary: "#9af3ef",
    stamp: "Loose Stack",
    description: "Seven-card volume pack with no guaranteed hit.",
  },
  {
    id: "spotlight",
    name: "Spotlight Pack",
    cost: 72,
    baseCards: 5,
    guaranteedCards: 1,
    guaranteedMinAbility: 89,
    unlockUpgrade: null,
    accent: "#6f5ce7",
    accentSecondary: "#d8cdff",
    stamp: "Prime Pull",
    description: "Mid-tier pack with one guaranteed 89+ player.",
  },
  {
    id: "rotation",
    name: "Rotation Box",
    cost: 86,
    baseCards: 7,
    guaranteedCards: 1,
    guaranteedMinAbility: 87,
    unlockUpgrade: null,
    accent: "#cf9a23",
    accentSecondary: "#ffe3a0",
    stamp: "Full Stack",
    description: "Seven-card box with one guaranteed 87+ player.",
  },
  {
    id: "mega",
    name: "Mega Pack",
    cost: 160,
    baseCards: 10,
    guaranteedCards: 1,
    guaranteedMinAbility: 92,
    unlockUpgrade: null,
    accent: "#8a1f32",
    accentSecondary: "#f2c67d",
    stamp: "Mega Box",
    description: "Ten-card premium pack with one guaranteed 92+ star.",
  },
];

const DAILY_CHALLENGE_COUNT = 3;
const DAILY_CHALLENGE_POSITION_LABELS = {
  G: "Guards",
  F: "Forwards",
  C: "Centers",
};
const DAILY_CHALLENGE_POOL = ["open-packs", "rarity-pulls", "team-pulls", "position-pulls"];

const upgradeLanes = [
  {
    id: "click",
    label: "Click Path",
    className: "click",
    upgrades: [
      { id: "better_grip", name: "Better Grip", description: "Sharpen the main tap so every hit pays more instantly.", effectLabel: "+$1 per click", cost: 65, requires: [], apply: { click: 1 } },
      { id: "court_vision", name: "Court Vision", description: "Read the floor faster and turn each tap into better cash.", effectLabel: "+$2 per click", cost: 170, requires: ["better_grip"], apply: { click: 2 } },
      { id: "quick_release", name: "Quick Release", description: "Smooth mechanics raise your click output again.", effectLabel: "+$3 per click", cost: 360, requires: ["court_vision"], apply: { click: 3 } },
      { id: "clutch_meter", name: "Clutch Meter", description: "Big-moment energy makes every click matter more.", effectLabel: "+$5 per click", cost: 780, requires: ["quick_release"], apply: { click: 5 } },
      { id: "superstar_pop", name: "Superstar Pop", description: "Your click income becomes a major engine instead of a backup.", effectLabel: "+$8 per click", cost: 1500, requires: ["clutch_meter"], apply: { click: 8 } },
    ],
  },
  {
    id: "passive",
    label: "Passive Path",
    className: "passive",
    upgrades: [
      { id: "arena_kiosk", name: "Arena Kiosk", description: "Open a small in-arena kiosk for background revenue.", effectLabel: "+$0.25 per sec", cost: 80, requires: [], apply: { passive: 0.25 } },
      { id: "merch_table", name: "Merch Table", description: "Expand into jerseys and sleeves for a bigger passive stream.", effectLabel: "+$0.60 per sec", cost: 210, requires: ["arena_kiosk"], apply: { passive: 0.6 } },
      { id: "season_sponsor", name: "Season Sponsor", description: "Sponsor money turns passive income into a real climb.", effectLabel: "+$1.25 per sec", cost: 450, requires: ["merch_table"], apply: { passive: 1.25 } },
      { id: "regional_tv", name: "Regional TV", description: "Broadcast deals make your economy much steadier.", effectLabel: "+$2.50 per sec", cost: 960, requires: ["season_sponsor"], apply: { passive: 2.5 } },
      { id: "national_rights", name: "National Rights", description: "Top-tier passive income for long binder grinds.", effectLabel: "+$4.00 per sec", cost: 1800, requires: ["regional_tv"], apply: { passive: 4 } },
    ],
  },
  {
    id: "pack",
    label: "Pack Unlocks",
    className: "pack",
    upgrades: [
      { id: "unlock_arena_pack", name: "Arena License", description: "A costly milestone that unlocks the Arena Box tier.", effectLabel: "Unlock Arena Box", cost: 520, requires: [], apply: {} },
      { id: "unlock_vault_pack", name: "Vault License", description: "A rare late-game milestone that unlocks the Collector Vault and Black Label chase pack.", effectLabel: "Unlock Vault + Black Label", cost: 2100, requires: ["unlock_arena_pack"], apply: {} },
    ],
  },
];

const upgradesById = upgradeLanes.flatMap((lane) => lane.upgrades).reduce((map, upgrade) => {
  map[upgrade.id] = upgrade;
  return map;
}, {});

function slugify(value) {
  return String(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeColor(color) {
  const trimmed = String(color || "").trim();
  if (trimmed.startsWith("var(")) {
    return getComputedStyle(document.documentElement).getPropertyValue(trimmed.slice(4, -1)).trim() || "#4f5a70";
  }
  return trimmed || "#4f5a70";
}

function withAlpha(color, alpha) {
  const resolved = normalizeColor(color).replace("#", "");
  if (resolved.length === 3) {
    const [r, g, b] = resolved.split("").map((part) => parseInt(part + part, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (resolved.length === 6) {
    const r = parseInt(resolved.slice(0, 2), 16);
    const g = parseInt(resolved.slice(2, 4), 16);
    const b = parseInt(resolved.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

function getColorChannels(color) {
  const resolved = normalizeColor(color).replace("#", "");
  if (resolved.length === 3) {
    const [r, g, b] = resolved.split("").map((part) => parseInt(part + part, 16));
    return { r, g, b };
  }
  if (resolved.length === 6) {
    return {
      r: parseInt(resolved.slice(0, 2), 16),
      g: parseInt(resolved.slice(2, 4), 16),
      b: parseInt(resolved.slice(4, 6), 16),
    };
  }
  return { r: 79, g: 90, b: 112 };
}

function getCardTheme(color) {
  const { r, g, b } = getColorChannels(color);
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  const isLight = brightness >= 164;
  return {
    text: isLight ? "#13233b" : "#fffaf5",
    subtext: isLight ? "rgba(19, 35, 59, 0.74)" : "rgba(255, 250, 245, 0.84)",
    panel: isLight ? "rgba(255, 255, 255, 0.42)" : "rgba(10, 14, 24, 0.26)",
    panelBorder: isLight ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.14)",
    badge: isLight ? "rgba(255, 255, 255, 0.3)" : "rgba(10, 14, 24, 0.24)",
    badgeBorder: isLight ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.16)",
  };
}

function mixColor(color, targetColor, weight = 0.5) {
  const source = getColorChannels(color);
  const target = getColorChannels(targetColor);
  const ratio = Math.max(0, Math.min(1, Number(weight) || 0));
  const r = Math.round(source.r + (target.r - source.r) * ratio);
  const g = Math.round(source.g + (target.g - source.g) * ratio);
  const b = Math.round(source.b + (target.b - source.b) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

function getTeamArtGradientEnd(color) {
  const { r, g, b } = getColorChannels(color);
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness < 124
    ? mixColor(color, "#ffffff", 0.18)
    : mixColor(color, "#0b1322", 0.34);
}

function getRarity(ability, teamId = "") {
  const playerSlug = arguments[2] ? slugify(arguments[2]) : "";
  if (teamId === "hall-of-fame") {
    return rarityTiers.find((tier) => tier.id === "legends") || rarityTiers[0];
  }
  if (playerSlug && BLACK_MATTER_PLAYERS[playerSlug]) {
    return rarityTiers.find((tier) => tier.id === "blackmatter") || rarityTiers[0];
  }
  return rarityTiers.find((tier) => ability >= tier.min && ability <= tier.max) || rarityTiers[0];
}

function getVisualRarity(rarity) {
  if (!rarity) return rarityTiers[0];
  if (rarity.id === "mythic") {
    return rarityTiers.find((tier) => tier.id === "diamond") || rarity;
  }
  return rarity;
}

function getGlassDisplayColor(color) {
  const { r, g, b } = getColorChannels(color);
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;
  return brightness < 128
    ? mixColor(color, "#d8efff", 0.34)
    : mixColor(color, "#0f3d66", 0.2);
}

function roundRewardAmount(value) {
  const numeric = Math.max(0, Number(value) || 0);
  if (numeric >= 1000) return Math.round(numeric / 50) * 50;
  if (numeric >= 300) return Math.round(numeric / 25) * 25;
  return Math.round(numeric / 10) * 10;
}

function computeSetReward(set) {
  const sellTotal = set.players.reduce((sum, player) => sum + getRarity(player.ability, set.id).sellPrice, 0);
  if (set.id === "hall-of-fame") return roundRewardAmount(sellTotal * 0.32 + set.players.length * 24);
  return roundRewardAmount(sellTotal * 0.4 + set.players.length * 20);
}

function computeCollectionReward(groupId) {
  const teams = GAME_DATA.sets.filter((set) => set.conference === groupId);
  const setRewardTotal = teams.reduce((sum, set) => sum + computeSetReward(set), 0);
  if (groupId === "Special") {
    return roundRewardAmount(setRewardTotal * 0.46 + 240);
  }
  return roundRewardAmount(setRewardTotal * 0.22 + 180);
}

const conferenceOrder = { East: 0, West: 1, Special: 2 };

const teamSets = GAME_DATA.sets.map((set) => ({
  ...set,
  players: [...set.players].sort((a, b) => b.ability - a.ability || a.name.localeCompare(b.name)),
  reward: computeSetReward(set),
})).sort((a, b) => {
  const conferenceDelta = (conferenceOrder[a.conference] ?? 99) - (conferenceOrder[b.conference] ?? 99);
  if (conferenceDelta !== 0) return conferenceDelta;
  return a.name.localeCompare(b.name);
});

const collectionGroups = [
  {
    id: "East",
    name: "East Collection",
    shortName: "East",
    description: "All Eastern Conference team sets.",
    colors: {
      primary: "#305fdf",
      secondary: "#9fd0ff",
    },
  },
  {
    id: "West",
    name: "West Collection",
    shortName: "West",
    description: "All Western Conference team sets.",
    colors: {
      primary: "#139d99",
      secondary: "#ffd17b",
    },
  },
  {
    id: "Special",
    name: "Special Collection",
    shortName: "Special",
    description: "Legends and special sets.",
    colors: {
      primary: "#d2aa54",
      secondary: "#fff0ca",
    },
  },
].map((group) => ({
  ...group,
  reward: computeCollectionReward(group.id),
}));

const collectionGroupById = Object.fromEntries(collectionGroups.map((group) => [group.id, group]));

const cardCatalog = teamSets.flatMap((team) => team.players.map((player) => {
  const playerSlug = slugify(player.name);
  const blackMatterOverride = BLACK_MATTER_PLAYERS[playerSlug] || null;
  const hiddenAbility = Number(blackMatterOverride?.ability || player.ability);
  const rarity = getRarity(hiddenAbility, team.id, player.name);
  const visualRarity = getVisualRarity(rarity);
  const visualRarityColor = visualRarity.id === "diamond"
    ? getGlassDisplayColor(team.colors.primary)
    : visualRarity.color;
  const displayTeamName = team.id === "hall-of-fame" ? "Hall of Fame" : team.name;
  return {
    id: slugify(`${team.id}-${player.personId}-${player.name}`),
    teamId: team.id,
    teamName: displayTeamName,
    teamShortName: team.id === "hall-of-fame" ? displayTeamName : team.shortName,
    teamAbbreviation: team.abbreviation,
    teamColors: team.colors,
    conference: team.conference,
    division: team.division,
    name: player.name,
    personId: player.personId,
    image: blackMatterOverride?.image || player.image,
    imagePosition: blackMatterOverride?.imagePosition || player.imagePosition || "",
    imageScale: Number(blackMatterOverride?.imageScale || player.imageScale || 1),
    position: player.position || "G-F",
    jersey: player.jersey || "--",
    ability: hiddenAbility,
    visibleAbility: rarity.id === "legends" || rarity.id === "blackmatter" ? null : hiddenAbility,
    rarityId: rarity.id,
    rarityLabel: rarity.label,
    rarityColor: rarity.color,
    displayRarityId: visualRarity.id,
    displayRarityLabel: visualRarity.label,
    displayRarityColor: visualRarityColor,
    sellPrice: rarity.sellPrice,
  };
}));

const glassShowcaseCardIds = new Set(
  [...cardCatalog]
    .filter((card) => card.displayRarityId === "diamond" && card.rarityId !== "blackmatter" && card.rarityId !== "legends")
    .sort((left, right) => right.ability - left.ability || left.teamName.localeCompare(right.teamName) || left.name.localeCompare(right.name))
    .slice(0, 10)
    .map((card) => card.id),
);

cardCatalog.forEach((card) => {
  card.glassShowcase = glassShowcaseCardIds.has(card.id);
});

const teamById = Object.fromEntries(teamSets.map((team) => [team.id, team]));
const cardsById = Object.fromEntries(cardCatalog.map((card) => [card.id, card]));
const cardsByTeam = Object.fromEntries(teamSets.map((team) => [team.id, cardCatalog.filter((card) => card.teamId === team.id)]));
const cardsByRarity = Object.fromEntries(rarityTiers.map((tier) => [tier.id, cardCatalog.filter((card) => card.rarityId === tier.id)]));
const packById = Object.fromEntries(packTypes.map((pack) => [pack.id, pack]));
const cardsByConference = Object.fromEntries(collectionGroups.map((group) => [
  group.id,
  teamSets.filter((team) => team.conference === group.id).flatMap((team) => cardsByTeam[team.id]),
]));

const PROFILE_SHOWCASE_LIMIT = 3;
const PROFILE_HIGHLIGHTED_BADGE_LIMIT = 6;
const PROFILE_NAME_MAX_LENGTH = 24;

const ACHIEVEMENT_PACK_LIBRARY = {
  milestone_silver: {
    id: "achievement-milestone-silver",
    templateId: "achievement-milestone-silver",
    name: "Milestone Silver Pack",
    cost: 0,
    baseCards: 1,
    guaranteedCards: 1,
    guaranteedMinAbility: 82,
    accent: "#9ea7c6",
    accentSecondary: "#f1f4ff",
    stamp: "Achievement",
    description: "Reward pack for early-profile milestones.",
    rewardSource: "achievement",
    rewardLabel: "Achievement",
  },
  milestone_gold: {
    id: "achievement-milestone-gold",
    templateId: "achievement-milestone-gold",
    name: "Milestone Gold Pack",
    cost: 0,
    baseCards: 1,
    guaranteedCards: 1,
    guaranteedMinAbility: 85,
    accent: "#d9a54c",
    accentSecondary: "#ffebb2",
    stamp: "Achievement",
    description: "Reward pack for strong collection progress.",
    rewardSource: "achievement",
    rewardLabel: "Achievement",
  },
  milestone_diamond: {
    id: "achievement-milestone-diamond",
    templateId: "achievement-milestone-diamond",
    name: "Milestone Glass Pack",
    cost: 0,
    baseCards: 1,
    guaranteedCards: 1,
    guaranteedMinAbility: 88,
    accent: "#4f95ff",
    accentSecondary: "#d3f0ff",
    stamp: "Achievement",
    description: "Reward pack for premium binder milestones.",
    rewardSource: "achievement",
    rewardLabel: "Achievement",
  },
  milestone_elite: {
    id: "achievement-milestone-elite",
    templateId: "achievement-milestone-elite",
    name: "Elite Achievement Pack",
    cost: 0,
    baseCards: 2,
    guaranteedCards: 1,
    guaranteedMinAbility: 91,
    accent: "#8e5fff",
    accentSecondary: "#f3dcff",
    stamp: "Achievement",
    description: "Two-card premium achievement reward.",
    rewardSource: "achievement",
    rewardLabel: "Achievement",
  },
  milestone_mythic: {
    id: "achievement-milestone-mythic",
    templateId: "achievement-milestone-mythic",
    name: "Mythic Achievement Pack",
    cost: 0,
    baseCards: 2,
    guaranteedCards: 1,
    guaranteedMinAbility: 93,
    accent: "#f0be46",
    accentSecondary: "#fff1bc",
    stamp: "Achievement",
    description: "High-end achievement reward pack.",
    rewardSource: "achievement",
    rewardLabel: "Achievement",
  },
  milestone_legend: {
    id: "achievement-milestone-legend",
    templateId: "achievement-milestone-legend",
    name: "Legend Reward Pack",
    cost: 0,
    baseCards: 1,
    guaranteedCards: 1,
    guaranteedMinAbility: 95,
    accent: "#efe1b7",
    accentSecondary: "#fff8e7",
    stamp: "Achievement",
    description: "Premium one-card reward for elite milestones.",
    rewardSource: "achievement",
    rewardLabel: "Achievement",
  },
  legends_relic: {
    id: "achievement-legends-relic",
    templateId: "achievement-legends-relic",
    name: "Legends Relic Reward",
    cost: 0,
    baseCards: 1,
    guaranteedCards: 1,
    guaranteedMinAbility: 95,
    accent: "#e6cf8d",
    accentSecondary: "#fff2cb",
    stamp: "Achievement",
    description: "One legends-exclusive reward pull.",
    poolType: "team",
    poolId: "hall-of-fame",
    rewardSource: "achievement",
    rewardLabel: "Achievement",
  },
  dark_matter: {
    id: "achievement-dark-matter",
    templateId: "achievement-dark-matter",
    name: "Dark Matter Reward",
    cost: 0,
    baseCards: 1,
    guaranteedCards: 1,
    guaranteedMinAbility: 95,
    accent: "#05080d",
    accentSecondary: "#f7fbff",
    stamp: "Achievement",
    description: "Exclusive reward for top-tier pulls.",
    rewardSource: "achievement",
    rewardLabel: "Achievement",
  },
};

function createAchievementRewardPackDefinition(templateKey, overrides = {}) {
  const basePack = ACHIEVEMENT_PACK_LIBRARY[templateKey];
  if (!basePack) return null;
  return {
    ...basePack,
    ...overrides,
    cost: 0,
    rewardSource: overrides.rewardSource || basePack.rewardSource || "achievement",
    rewardLabel: overrides.rewardLabel || basePack.rewardLabel || "Achievement",
  };
}

function createFavoriteTeamAchievementPackDefinition(teamId, tierIndex = 0) {
  const team = teamById[teamId];
  if (!team) return null;
  const configs = [
    { name: `${team.shortName || team.name} Scout Pack`, baseCards: 1, guaranteedCards: 1, guaranteedMinAbility: 85 },
    { name: `${team.shortName || team.name} Loyalist Pack`, baseCards: 2, guaranteedCards: 1, guaranteedMinAbility: 88 },
    { name: `${team.shortName || team.name} Mastery Pack`, baseCards: 1, guaranteedCards: 1, guaranteedMinAbility: 92 },
  ];
  const config = configs[Math.max(0, Math.min(configs.length - 1, tierIndex))];
  return {
    id: `achievement-favorite-${teamId}-${tierIndex + 1}`,
    templateId: `achievement-favorite-${teamId}-${tierIndex + 1}`,
    name: config.name,
    cost: 0,
    baseCards: config.baseCards,
    guaranteedCards: config.guaranteedCards,
    guaranteedMinAbility: config.guaranteedMinAbility,
    accent: team.colors.primary,
    accentSecondary: team.colors.secondary,
    stamp: "Achievement",
    description: `Reward pack for building out ${team.name}.`,
    poolType: "team",
    poolId: team.id,
    rewardSource: "achievement",
    rewardLabel: "Favorite Team",
  };
}

function getTotalStoredCards() {
  return Object.values(state.cardCopies || {}).reduce((sum, count) => sum + Math.max(0, Number(count) || 0), 0);
}

function getUniquePulledCardCount() {
  return Object.values(state.pullCounts || {}).reduce((sum, count) => sum + (Number(count || 0) > 0 ? 1 : 0), 0);
}

function getRarityPullCount(rarityId) {
  return Object.entries(state.pullCounts || {}).reduce((sum, [cardId, count]) => {
    const card = cardsById[cardId];
    if (!card || card.rarityId !== rarityId) return sum;
    return sum + Number(count || 0);
  }, 0);
}

function getFavoriteTeamProgress(teamId) {
  const teamCards = cardsByTeam[teamId] || [];
  const uniqueOwned = teamCards.reduce((sum, card) => sum + (hasOwnedCard(card.id) ? 1 : 0), 0);
  const totalPulled = teamCards.reduce((sum, card) => sum + Math.max(0, Number(state.pullCounts?.[card.id]) || 0), 0);
  return {
    uniqueOwned,
    totalPulled,
    setComplete: state.completedTeams.includes(teamId),
    totalSetCards: teamCards.length,
  };
}

function getAchievementDefinitions() {
  const favoriteTeam = teamById[state.profile?.favoriteTeamId] || null;
  const definitions = [
    {
      id: "stacked-shelf",
      category: "Collection",
      title: "Stacked Shelf",
      note: "Keep cards stored in your club and build a deeper binder.",
      badgeAcronym: "SS",
      getProgress: () => getTotalStoredCards(),
      tiers: [
        { target: 30, label: "Shelf I", badgeTone: "silver", rewardTemplates: ["milestone_silver"] },
        { target: 120, label: "Shelf II", badgeTone: "gold", rewardTemplates: ["milestone_gold"] },
        { target: 260, label: "Shelf III", badgeTone: "diamond", rewardTemplates: ["milestone_diamond"] },
        { target: 520, label: "Shelf IV", badgeTone: "mythic", rewardTemplates: ["milestone_elite"] },
        { target: 900, label: "Shelf V", badgeTone: "legend", rewardTemplates: ["milestone_mythic", "milestone_elite"] },
      ],
    },
    {
      id: "fresh-ink",
      category: "Collection",
      title: "Fresh Ink",
      note: "Unbox new players for the first time and widen your club.",
      badgeAcronym: "FI",
      getProgress: () => getUniquePulledCardCount(),
      tiers: [
        { target: 15, label: "Ink I", badgeTone: "silver", rewardTemplates: ["milestone_silver"] },
        { target: 75, label: "Ink II", badgeTone: "gold", rewardTemplates: ["milestone_gold"] },
        { target: 180, label: "Ink III", badgeTone: "diamond", rewardTemplates: ["milestone_diamond"] },
        { target: 320, label: "Ink IV", badgeTone: "mythic", rewardTemplates: ["milestone_elite"] },
        { target: 500, label: "Ink V", badgeTone: "legend", rewardTemplates: ["milestone_mythic"] },
      ],
    },
    {
      id: "color-chase",
      category: "Rarity",
      title: "Color Chase",
      note: "Climb through the rarities and land your first premium pulls.",
      badgeAcronym: "CC",
      getProgress: () => ["silver", "gold", "diamond", "mythic", "blackmatter", "legends"].reduce((sum, rarityId) => sum + (getRarityPullCount(rarityId) > 0 ? 1 : 0), 0),
      tiers: [
        { target: 1, label: "Silver Found", badgeTone: "silver", rewardTemplates: ["milestone_silver"] },
        { target: 2, label: "Gold Found", badgeTone: "gold", rewardTemplates: ["milestone_gold"] },
        { target: 3, label: "Glass Found", badgeTone: "diamond", rewardTemplates: ["milestone_diamond"] },
        { target: 4, label: "Mythic Found", badgeTone: "mythic", rewardTemplates: ["milestone_elite"] },
        { target: 5, label: "Dark Matter Found", badgeTone: "blackmatter", rewardTemplates: ["milestone_legend"] },
        { target: 6, label: "Legends Found", badgeTone: "legend", rewardTemplates: ["milestone_legend"] },
      ],
    },
    {
      id: "set-closer",
      category: "Sets",
      title: "Set Closer",
      note: "Finish team sets and turn pack luck into completed pages.",
      badgeAcronym: "SC",
      getProgress: () => state.completedTeams.length,
      tiers: [
        { target: 1, label: "Closer I", badgeTone: "silver", rewardTemplates: ["milestone_gold"] },
        { target: 4, label: "Closer II", badgeTone: "gold", rewardTemplates: ["milestone_diamond"] },
        { target: 10, label: "Closer III", badgeTone: "diamond", rewardTemplates: ["milestone_elite"] },
        { target: 20, label: "Closer IV", badgeTone: "mythic", rewardTemplates: ["milestone_mythic"] },
        { target: teamSets.length, label: "Closer V", badgeTone: "legend", rewardTemplates: ["milestone_legend", "milestone_elite"] },
      ],
    },
    {
      id: "pack-rhythm",
      category: "Packs",
      title: "Rip Rhythm",
      note: "Keep opening packs and build momentum across the store.",
      badgeAcronym: "RR",
      getProgress: () => state.packsOpened,
      tiers: [
        { target: 10, label: "Rhythm I", badgeTone: "silver", rewardTemplates: ["milestone_silver"] },
        { target: 40, label: "Rhythm II", badgeTone: "gold", rewardTemplates: ["milestone_gold"] },
        { target: 120, label: "Rhythm III", badgeTone: "diamond", rewardTemplates: ["milestone_diamond"] },
        { target: 260, label: "Rhythm IV", badgeTone: "mythic", rewardTemplates: ["milestone_elite"] },
        { target: 500, label: "Rhythm V", badgeTone: "legend", rewardTemplates: ["milestone_mythic"] },
      ],
    },
    {
      id: "box-fever",
      category: "Packs",
      title: "Box Fever",
      note: "Pull more cards overall and keep the club moving.",
      badgeAcronym: "BF",
      getProgress: () => state.totalCardsDrawn,
      tiers: [
        { target: 25, label: "Fever I", badgeTone: "silver", rewardTemplates: ["milestone_silver"] },
        { target: 100, label: "Fever II", badgeTone: "gold", rewardTemplates: ["milestone_gold"] },
        { target: 300, label: "Fever III", badgeTone: "diamond", rewardTemplates: ["milestone_diamond"] },
        { target: 700, label: "Fever IV", badgeTone: "mythic", rewardTemplates: ["milestone_elite"] },
        { target: 1200, label: "Fever V", badgeTone: "legend", rewardTemplates: ["milestone_mythic"] },
      ],
    },
    {
      id: "conference-crown",
      category: "Collections",
      title: "Conference Crown",
      note: "Complete East, West, and Special collections.",
      badgeAcronym: "CCR",
      getProgress: () => getCompletedCollectionCount(),
      tiers: [
        { target: 1, label: "Crown I", badgeTone: "gold", rewardTemplates: ["milestone_diamond"] },
        { target: 2, label: "Crown II", badgeTone: "diamond", rewardTemplates: ["milestone_elite"] },
        { target: collectionGroups.length, label: "Crown III", badgeTone: "legend", rewardTemplates: ["milestone_legend"] },
      ],
    },
    {
      id: "daily-grind",
      category: "Dailies",
      title: "Daily Grind",
      note: "Finish full daily challenge runs on a regular clip.",
      badgeAcronym: "DG",
      getProgress: () => Math.max(0, Math.floor(Number(state.dailyBonusClaims || 0))),
      tiers: [
        { target: 1, label: "Daily I", badgeTone: "silver", rewardTemplates: ["milestone_silver"] },
        { target: 5, label: "Daily II", badgeTone: "gold", rewardTemplates: ["milestone_gold"] },
        { target: 15, label: "Daily III", badgeTone: "diamond", rewardTemplates: ["milestone_diamond"] },
        { target: 30, label: "Daily IV", badgeTone: "mythic", rewardTemplates: ["milestone_elite"] },
      ],
    },
    {
      id: "immortal-ink",
      category: "Special",
      title: "Immortal Ink",
      note: "Land Hall of Fame legends and grow the holy binder page.",
      badgeAcronym: "II",
      getProgress: () => getRarityPullCount("legends"),
      tiers: [
        { target: 1, label: "Immortal I", badgeTone: "gold", rewardTemplates: ["milestone_gold"] },
        { target: 3, label: "Immortal II", badgeTone: "legend", rewardTemplates: ["milestone_diamond", "milestone_gold"] },
        { target: 6, label: "Immortal III", badgeTone: "legend", rewardTemplates: ["milestone_legend"] },
      ],
    },
    {
      id: "dark-orbit",
      category: "Special",
      title: "Dark Orbit",
      note: "Pull Dark Matter superstars and chase the top tier.",
      badgeAcronym: "DO",
      getProgress: () => getRarityPullCount("blackmatter"),
      tiers: [
        { target: 1, label: "Orbit I", badgeTone: "blackmatter", rewardTemplates: ["milestone_diamond"] },
        { target: 2, label: "Orbit II", badgeTone: "blackmatter", rewardTemplates: ["milestone_elite"] },
        { target: 5, label: "Orbit III", badgeTone: "blackmatter", rewardTemplates: ["milestone_legend"] },
      ],
    },
  ];

  if (favoriteTeam) {
    const favoriteLogo = getTeamLogoUrl(favoriteTeam.id);
    definitions.unshift({
      id: `favorite-team-${favoriteTeam.id}`,
      category: "Favorite Team",
      title: `${favoriteTeam.shortName || favoriteTeam.name} Loyalist`,
      note: `Build out ${favoriteTeam.name} to unlock a gold team mastery badge.`,
      badgeAcronym: favoriteTeam.abbreviation,
      badgeLogoUrl: favoriteLogo,
      teamId: favoriteTeam.id,
      getTierProgress: (tierIndex) => {
        const progress = getFavoriteTeamProgress(favoriteTeam.id);
        if (tierIndex === 0) return progress.uniqueOwned;
        if (tierIndex === 1) return progress.totalPulled;
        return progress.setComplete ? 1 : 0;
      },
      tiers: [
        { target: 10, label: "Roster Hunter", badgeTone: "gold", rewardPacks: () => [createFavoriteTeamAchievementPackDefinition(favoriteTeam.id, 0)] },
        { target: 50, label: "Arena Loyalist", badgeTone: "gold", rewardPacks: () => [createFavoriteTeamAchievementPackDefinition(favoriteTeam.id, 1)] },
        { target: 1, label: "Team Mastery", badgeTone: "favorite-team-gold", rewardPacks: () => [createFavoriteTeamAchievementPackDefinition(favoriteTeam.id, 2)] },
      ],
    });
  }

  return definitions;
}

function getTodayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function pickRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createDailyRewardPackDefinition(tier, challenge = {}) {
  const packByTier = {
    small: {
      id: "daily-small-pack",
      templateId: "daily-small-pack",
      name: "Daily Pick Pack",
      cost: 0,
      baseCards: 1,
      guaranteedCards: 1,
      guaranteedMinAbility: 85,
      accent: "#1f8fff",
      accentSecondary: "#9ed8ff",
      stamp: "Daily Reward",
      description: "One 85+ pull from your daily challenge.",
    },
    medium: {
      id: "daily-medium-pack",
      templateId: "daily-medium-pack",
      name: "Daily Run Pack",
      cost: 0,
      baseCards: 2,
      guaranteedCards: 1,
      guaranteedMinAbility: 87,
      accent: "#1fbf8f",
      accentSecondary: "#a8ffe1",
      stamp: "Daily Reward",
      description: "Two cards with one guaranteed 87+ pull.",
    },
    high: {
      id: "daily-high-pack",
      templateId: "daily-high-pack",
      name: "Daily Surge Pack",
      cost: 0,
      baseCards: 2,
      guaranteedCards: 1,
      guaranteedMinAbility: 89,
      accent: "#7b63ff",
      accentSecondary: "#dbcfff",
      stamp: "Daily Reward",
      description: "Two cards with one guaranteed 89+ pull.",
    },
    bonus: {
      id: "daily-bonus-pack",
      templateId: "daily-bonus-pack",
      name: "Daily Crown Pack",
      cost: 0,
      baseCards: 3,
      guaranteedCards: 1,
      guaranteedMinAbility: 92,
      accent: "#c8902a",
      accentSecondary: "#ffe6ab",
      stamp: "Daily Bonus",
      description: "Three cards with one guaranteed 92+ pull.",
    },
  };
  const base = packByTier[tier] || packByTier.small;
  if (challenge.teamId && teamById[challenge.teamId]) {
    return {
      ...base,
      accent: teamById[challenge.teamId].colors.primary,
      accentSecondary: teamById[challenge.teamId].colors.secondary,
    };
  }
  if (challenge.rarityId) {
    return {
      ...base,
      accent: normalizeColor(cardsByRarity[challenge.rarityId]?.[0]?.rarityColor || base.accent),
      accentSecondary: base.accentSecondary,
    };
  }
  return base;
}

function generateOpenPacksDailyChallenge(dateKey, index) {
  const presets = [
    { target: 5, rewardTier: "small" },
    { target: 7, rewardTier: "medium" },
    { target: 9, rewardTier: "high" },
  ];
  const preset = pickRandomItem(presets);
  return {
    id: `${dateKey}-daily-open-${index}`,
    type: "open-packs",
    title: `Open ${preset.target} packs`,
    target: preset.target,
    progress: 0,
    completed: false,
    rewardGranted: false,
    rewardPack: createDailyRewardPackDefinition(preset.rewardTier),
  };
}

function generateRarityDailyChallenge(dateKey, index) {
  const presets = [
    { rarityId: "rare", target: 4, rewardTier: "small" },
    { rarityId: "epic", target: 2, rewardTier: "medium" },
    { rarityId: "legendary", target: 1, rewardTier: "high" },
  ];
  const preset = pickRandomItem(presets);
  const tier = rarityTiers.find((entry) => entry.id === preset.rarityId) || rarityTiers[0];
  return {
    id: `${dateKey}-daily-rarity-${index}`,
    type: "rarity-pulls",
    title: `Pull ${preset.target} ${tier.label}+ card${preset.target === 1 ? "" : "s"}`,
    target: preset.target,
    progress: 0,
    completed: false,
    rewardGranted: false,
    rarityId: preset.rarityId,
    rewardPack: createDailyRewardPackDefinition(preset.rewardTier, { rarityId: preset.rarityId }),
  };
}

function generateTeamDailyChallenge(dateKey, index) {
  const eligibleTeams = teamSets.filter((team) => team.id !== "hall-of-fame");
  const team = pickRandomItem(eligibleTeams);
  const target = pickRandomItem([3, 4, 5]);
  return {
    id: `${dateKey}-daily-team-${index}`,
    type: "team-pulls",
    title: `Pull ${target} ${team.shortName} player${target === 1 ? "" : "s"}`,
    target,
    progress: 0,
    completed: false,
    rewardGranted: false,
    teamId: team.id,
    rewardPack: createDailyRewardPackDefinition(target >= 5 ? "high" : "medium", { teamId: team.id }),
  };
}

function generatePositionDailyChallenge(dateKey, index) {
  const position = pickRandomItem(["G", "F", "C"]);
  const target = pickRandomItem([4, 5, 6]);
  return {
    id: `${dateKey}-daily-position-${index}`,
    type: "position-pulls",
    title: `Pull ${target} ${DAILY_CHALLENGE_POSITION_LABELS[position]}`,
    target,
    progress: 0,
    completed: false,
    rewardGranted: false,
    position,
    rewardPack: createDailyRewardPackDefinition(target >= 6 ? "high" : "medium"),
  };
}

function generateDailyChallenges(dateKey = getTodayKey()) {
  const generators = {
    "open-packs": generateOpenPacksDailyChallenge,
    "rarity-pulls": generateRarityDailyChallenge,
    "team-pulls": generateTeamDailyChallenge,
    "position-pulls": generatePositionDailyChallenge,
  };
  const challengeTypes = shuffleArray(DAILY_CHALLENGE_POOL).slice(0, DAILY_CHALLENGE_COUNT);
  return {
    dateKey,
    challenges: challengeTypes.map((type, index) => generators[type](dateKey, index)),
    bonusGranted: false,
    bonusRewardPack: createDailyRewardPackDefinition("bonus"),
  };
}

function isValidDailyChallengeState(dailyChallenges) {
  return Boolean(
    dailyChallenges
    && typeof dailyChallenges === "object"
    && typeof dailyChallenges.dateKey === "string"
    && Array.isArray(dailyChallenges.challenges)
    && dailyChallenges.challenges.length === DAILY_CHALLENGE_COUNT
    && dailyChallenges.bonusRewardPack,
  );
}

function ensureDailyChallenges() {
  const todayKey = getTodayKey();
  if (isValidDailyChallengeState(state.dailyChallenges) && state.dailyChallenges.dateKey === todayKey) return false;
  state.dailyChallenges = generateDailyChallenges(todayKey);
  saveState();
  return true;
}

function getCompletedDailyChallengeCount() {
  ensureDailyChallenges();
  return state.dailyChallenges.challenges.filter((challenge) => challenge.completed).length;
}

function getDailyChallengeIncrement(challenge, outcome) {
  switch (challenge.type) {
    case "open-packs":
      return 1;
    case "rarity-pulls":
      return outcome.results.filter((result) => getRarityRank(result.rarityId) >= getRarityRank(challenge.rarityId)).length;
    case "team-pulls":
      return outcome.results.filter((result) => result.teamId === challenge.teamId).length;
    case "position-pulls":
      return outcome.results.filter((result) => getPrimaryPosition(result.position) === challenge.position).length;
    default:
      return 0;
  }
}

function getDailyChallengeProgressPreview(outcome) {
  ensureDailyChallenges();
  if (!state.dailyChallenges) return [];

  return state.dailyChallenges.challenges.flatMap((challenge) => {
    if (challenge.completed) return [];
    const increment = getDailyChallengeIncrement(challenge, outcome);
    if (!increment) return [];
    const beforeProgress = challenge.progress;
    const afterProgress = Math.min(challenge.target, beforeProgress + increment);
    return [{
      id: challenge.id,
      type: challenge.type,
      title: challenge.title,
      beforeProgress,
      afterProgress,
      target: challenge.target,
      increment,
      completedNow: afterProgress >= challenge.target,
      rewardPack: challenge.rewardPack,
    }];
  });
}

function updateDailyChallengesFromOutcome(outcome) {
  ensureDailyChallenges();
  if (!state.dailyChallenges) return { progressEntries: [], rewardEntries: [] };

  const progressEntries = getDailyChallengeProgressPreview(outcome);
  const rewardEntries = [];
  let changed = false;

  progressEntries.forEach((entry) => {
    const challenge = state.dailyChallenges.challenges.find((item) => item.id === entry.id);
    if (!challenge) return;
    challenge.progress = entry.afterProgress;
    if (entry.completedNow) {
      challenge.completed = true;
      if (!challenge.rewardGranted) {
        const grantedPack = grantSavedPack(challenge.rewardPack);
        challenge.rewardGranted = true;
        rewardEntries.push({
          type: "challenge",
          title: challenge.title,
          rewardPack: grantedPack || challenge.rewardPack,
        });
      }
    }
    changed = true;
  });

  if (!state.dailyChallenges.bonusGranted && state.dailyChallenges.challenges.every((challenge) => challenge.completed)) {
    const bonusPack = grantSavedPack(state.dailyChallenges.bonusRewardPack);
    state.dailyChallenges.bonusGranted = true;
    state.dailyBonusClaims = Math.max(0, Math.floor(Number(state.dailyBonusClaims || 0))) + 1;
    rewardEntries.push({
      type: "bonus",
      title: "All Daily Challenges Complete",
      rewardPack: bonusPack || state.dailyChallenges.bonusRewardPack,
    });
    changed = true;
  }

  if (changed) saveState();
  return { progressEntries, rewardEntries };
}

function createPackInventoryRecord(pack, instanceId) {
  return {
    instanceId,
    templateId: pack.templateId || pack.id,
    id: pack.id,
    name: pack.name,
    cost: Number(pack.cost || 0),
    baseCards: Number(pack.baseCards || 0),
    guaranteedCards: Number(pack.guaranteedCards || 0),
    guaranteedMinAbility: Number(pack.guaranteedMinAbility || 0),
    accent: pack.accent,
    accentSecondary: pack.accentSecondary || pack.accent,
    stamp: pack.stamp || "",
    description: pack.description || "",
    poolType: pack.poolType || "all",
    poolId: pack.poolId || null,
    rewardSource: pack.rewardSource || "inventory",
    rewardLabel: pack.rewardLabel || "",
  };
}

function sanitizeSavedPack(entry, fallbackIndex = 0) {
  if (!entry || typeof entry !== "object") return null;
  if (!entry.id || !entry.name) return null;
  return createPackInventoryRecord(entry, entry.instanceId || `saved-pack-${fallbackIndex + 1}`);
}

function cloneDefaultState() {
  return {
    money: STARTING_MONEY,
    clicks: 0,
    packsOpened: 0,
    totalCardsDrawn: 0,
    totalDuplicateCash: 0,
    cardCopies: {},
    collection: {},
    pullCounts: {},
    upgrades: [],
    completedTeams: [],
    completedCollections: [],
    teamRewardCash: {},
    collectionRewardCash: {},
    savedPacks: [],
    nextSavedPackId: 1,
    streetPackDryStreak: 0,
    dailyChallenges: null,
    lastPack: null,
    firstPullAt: {},
    lifetimeEarned: STARTING_MONEY,
    lifetimePackSpend: 0,
    dailyBonusClaims: 0,
    achievementLevels: {},
    achievementTierUnlockedAt: {},
    profile: {
      favoriteTeamId: null,
      favoriteTeamPromptDismissed: false,
      name: "",
      showcasedCardIds: [],
      highlightedBadgeIds: [],
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaultState();
    const parsed = JSON.parse(raw);
    const cardCopies = {};
    Object.entries(parsed.cardCopies || {}).forEach(([cardId, count]) => {
      const normalized = Math.max(0, Math.floor(Number(count) || 0));
      if (normalized > 0) cardCopies[cardId] = normalized;
    });
    Object.entries(parsed.collection || {}).forEach(([cardId, owned]) => {
      if (!owned) return;
      if (!cardCopies[cardId]) cardCopies[cardId] = 1;
    });
    const collection = Object.fromEntries(Object.keys(cardCopies).map((cardId) => [cardId, true]));
    const lastPack = parsed.lastPack
      ? {
        ...parsed.lastPack,
        duplicateCash: Number(parsed.lastPack.duplicateCash || 0),
        rewardCash: Number(parsed.lastPack.rewardCash || 0),
        completedCollections: Array.isArray(parsed.lastPack.completedCollections) ? parsed.lastPack.completedCollections : [],
        repeatableStorePackId: parsed.lastPack.repeatableStorePackId || null,
        results: Array.isArray(parsed.lastPack.results)
          ? parsed.lastPack.results.map((result, index) => ({
            ...result,
            saleValue: Number(result.saleValue || result.sellPrice || 0),
            packResultId: result.packResultId || `${parsed.lastPack.packId || "pack"}-${index}-${result.id}`,
            duplicateDecision: result.isNew ? "new" : result.duplicateDecision === "sold" ? "sold" : "saved",
          }))
          : [],
      }
      : null;
    const savedPacks = Array.isArray(parsed.savedPacks)
      ? parsed.savedPacks
          .map((entry, index) => sanitizeSavedPack(entry, index))
          .filter(Boolean)
      : [];
    const firstPullAt = {};
    Object.entries(parsed.firstPullAt || {}).forEach(([cardId, value]) => {
      const normalized = Number(value || 0);
      if (normalized > 0) firstPullAt[cardId] = normalized;
    });
    const profile = {
      ...cloneDefaultState().profile,
      favoriteTeamId: teamById[parsed.profile?.favoriteTeamId] && parsed.profile.favoriteTeamId !== "hall-of-fame"
        ? parsed.profile.favoriteTeamId
        : null,
      favoriteTeamPromptDismissed: Boolean(parsed.profile?.favoriteTeamPromptDismissed),
      name: String(parsed.profile?.name || "").trim().slice(0, PROFILE_NAME_MAX_LENGTH),
      showcasedCardIds: normalizeSlotArray(
        parsed.profile?.showcasedCardIds,
        PROFILE_SHOWCASE_LIMIT,
        (cardId) => Boolean(cardsById[cardId]) && Math.max(0, Number(parsed.pullCounts?.[cardId]) || 0) > 0,
      ),
      highlightedBadgeIds: normalizeSlotArray(parsed.profile?.highlightedBadgeIds, PROFILE_HIGHLIGHTED_BADGE_LIMIT),
    };
    const achievementLevels = {};
    Object.entries(parsed.achievementLevels || {}).forEach(([achievementId, level]) => {
      const normalized = Math.max(0, Math.floor(Number(level) || 0));
      if (normalized > 0) achievementLevels[achievementId] = normalized;
    });
    const achievementTierUnlockedAt = {};
    Object.entries(parsed.achievementTierUnlockedAt || {}).forEach(([key, value]) => {
      const normalized = Number(value || 0);
      if (normalized > 0) achievementTierUnlockedAt[key] = normalized;
    });
    const highestSavedPackId = savedPacks.reduce((max, entry) => {
      const match = String(entry.instanceId || "").match(/(\d+)$/);
      const numeric = match ? Number(match[1]) : 0;
      return numeric > max ? numeric : max;
    }, 0);
    return {
      ...cloneDefaultState(),
      ...parsed,
      cardCopies,
      collection,
      pullCounts: parsed.pullCounts || {},
      upgrades: Array.isArray(parsed.upgrades) ? parsed.upgrades : [],
      completedTeams: Array.isArray(parsed.completedTeams) ? parsed.completedTeams : [],
      completedCollections: Array.isArray(parsed.completedCollections) ? parsed.completedCollections : [],
      teamRewardCash: parsed.teamRewardCash || {},
      collectionRewardCash: parsed.collectionRewardCash || {},
      savedPacks,
      nextSavedPackId: Math.max(1, Number(parsed.nextSavedPackId || 0) || 0, highestSavedPackId + 1),
      streetPackDryStreak: Math.max(0, Math.min(10, Math.floor(Number(parsed.streetPackDryStreak) || 0))),
      dailyChallenges: parsed.dailyChallenges || null,
      firstPullAt,
      lastPack,
      lifetimePackSpend: Math.max(0, Number(parsed.lifetimePackSpend || 0)),
      dailyBonusClaims: Math.max(0, Math.floor(Number(parsed.dailyBonusClaims || 0))),
      achievementLevels,
      achievementTierUnlockedAt,
      profile,
    };
  } catch (error) {
    console.warn("Failed to load save.", error);
    return cloneDefaultState();
  }
}

let state = loadState();
let activeView = "packs";
let activePackSection = "store";
let openingPack = null;
let isPackModalOpen = false;
let activePackPreview = null;
let activeCardPreview = null;
let setCompletionCelebration = null;
let dailyChallengeCelebration = null;
let achievementCelebration = null;
let activeCollectionGroup = null;
let activeCollectionTeam = null;
let collectionSection = "collections";
let collectionSort = "alpha";
let playerCollectionSearch = "";
let playerCollectionSort = "rating-desc";
let playerCollectionTeamFilter = [];
let playerCollectionRarityFilter = [];
let playerCollectionPositionFilter = "all";
let playerCollectionShowLocked = false;
let isPlayerFilterMenuOpen = false;
let isPlayerBulkSellOpen = false;
let isSetBulkSellOpen = false;
let bulkSellKeepCopies = 1;
let bulkSellTeamFilters = [];
let bulkSellRarityFilters = [];
let bulkSellMaxAbility = "";
let isDailyChallengesOpen = false;
let isFavoriteTeamModalOpen = !state.profile?.favoriteTeamId && !state.profile?.favoriteTeamPromptDismissed;
let favoriteTeamDraftId = state.profile?.favoriteTeamId || "";
let favoriteTeamModalContext = "onboarding";
let isProfileShowcaseModalOpen = false;
let activeProfileShowcaseSlot = 0;
let profileShowcasePickerSearch = "";
let profileShowcasePickerSort = "rating-desc";
let profileShowcasePickerTeamFilter = [];
let profileShowcasePickerRarityFilter = [];
let profileShowcasePickerPositionFilter = "all";
let isProfileBadgeModalOpen = false;
let activeProfileBadgeSlot = 0;
let isProfileAchievementsModalOpen = false;
let profileAchievementStatusFilter = "all";
let profileAchievementSort = "date-desc";
let isProfileNameEditing = false;
let profileNameDraft = "";
const assetPreloadCache = new Map();

const navTabsEl = document.getElementById("navTabs");
const hudGridEl = document.getElementById("hudGrid");
const dailyChallengeTriggerEl = document.getElementById("dailyChallengeTrigger");
const dailyChallengeProgressEl = document.getElementById("dailyChallengeProgress");
const dailyChallengePanelEl = document.getElementById("dailyChallengePanel");
const dailyChallengeTitleEl = document.getElementById("dailyChallengeTitle");
const dailyChallengeSummaryEl = document.getElementById("dailyChallengeSummary");
const dailyChallengeListEl = document.getElementById("dailyChallengeList");
const dailyChallengeBonusEl = document.getElementById("dailyChallengeBonus");
const packSummaryEl = document.getElementById("packSummary");
const packModeTabsEl = document.getElementById("packModeTabs");
const storePacksSectionEl = document.getElementById("storePacksSection");
const packStoreEl = document.getElementById("packStore");
const myPacksSectionEl = document.getElementById("myPacksSection");
const myPackStoreEl = document.getElementById("myPackStore");
const collectionViewEl = document.getElementById("collectionView");
const collectionEyebrowEl = document.getElementById("collectionEyebrow");
const collectionTitleEl = document.getElementById("collectionTitle");
const collectionIntroEl = document.getElementById("collectionIntro");
const collectionActionsEl = document.getElementById("collectionActions");
const collectionFiltersEl = document.getElementById("collectionFilters");
const collectionSummaryEl = document.getElementById("collectionSummary");
const teamGridEl = document.getElementById("teamGrid");
const statsGridEl = document.getElementById("statsGrid");
const profileViewEl = document.getElementById("profileView");
const profileWorkspaceEl = document.getElementById("profileWorkspace");
const resetGameEl = document.getElementById("resetGame");
const packModalEl = document.getElementById("packModal");
const packModalShellEl = document.getElementById("packModalShell");
const closePackModalEl = document.getElementById("closePackModal");
const packModalPrevEl = document.getElementById("packModalPrev");
const packModalNextEl = document.getElementById("packModalNext");
const revealAllCardsEl = document.getElementById("revealAllCards");
const openAnotherPackEl = document.getElementById("openAnotherPack");
const sellAllDuplicatesEl = document.getElementById("sellAllDuplicates");
const revealTitleEl = document.getElementById("revealTitle");
const revealSubtitleEl = document.getElementById("revealSubtitle");
const revealProgressEl = document.getElementById("revealProgress");
const modalPackMetaEl = document.getElementById("modalPackMeta");
const revealSetProgressEl = document.getElementById("revealSetProgress");
const revealDailyProgressEl = document.getElementById("revealDailyProgress");
const packRevealGridEl = document.getElementById("packRevealGrid");
const modalBottomActionsEl = document.querySelector(".modal-bottom-actions");
const cardPreviewModalEl = document.getElementById("cardPreviewModal");
const cardPreviewStageEl = document.getElementById("cardPreviewStage");
const cardPreviewMetaEl = document.getElementById("cardPreviewMeta");
const setCompletionModalEl = document.getElementById("setCompletionModal");
const setCompletionEyebrowEl = document.getElementById("setCompletionEyebrow");
const setCompletionTitleEl = document.getElementById("setCompletionTitle");
const setCompletionSubtitleEl = document.getElementById("setCompletionSubtitle");
const setCompletionRewardEl = document.getElementById("setCompletionReward");
const setCompletionGridEl = document.getElementById("setCompletionGrid");
const closeSetCompletionModalEl = document.getElementById("closeSetCompletionModal");
const dailyRewardModalEl = document.getElementById("dailyRewardModal");
const dailyRewardEyebrowEl = document.getElementById("dailyRewardEyebrow");
const dailyRewardTitleEl = document.getElementById("dailyRewardTitle");
const dailyRewardSubtitleEl = document.getElementById("dailyRewardSubtitle");
const dailyRewardSummaryEl = document.getElementById("dailyRewardSummary");
const dailyRewardListEl = document.getElementById("dailyRewardList");
const closeDailyRewardModalEl = document.getElementById("closeDailyRewardModal");
const achievementRewardModalEl = document.getElementById("achievementRewardModal");
const achievementRewardEyebrowEl = document.getElementById("achievementRewardEyebrow");
const achievementRewardTitleEl = document.getElementById("achievementRewardTitle");
const achievementRewardSubtitleEl = document.getElementById("achievementRewardSubtitle");
const achievementRewardSummaryEl = document.getElementById("achievementRewardSummary");
const achievementRewardListEl = document.getElementById("achievementRewardList");
const closeAchievementRewardModalEl = document.getElementById("closeAchievementRewardModal");
const favoriteTeamModalEl = document.getElementById("favoriteTeamModal");
const favoriteTeamGridEl = document.getElementById("favoriteTeamGrid");
const favoriteTeamLaterEl = document.getElementById("favoriteTeamLater");
const favoriteTeamSaveEl = document.getElementById("favoriteTeamSave");
const profileShowcaseModalEl = document.getElementById("profileShowcaseModal");
const profileShowcaseModalTitleEl = document.getElementById("profileShowcaseModalTitle");
const profileShowcaseModalSubtitleEl = document.getElementById("profileShowcaseModalSubtitle");
const profileShowcaseToolbarEl = document.getElementById("profileShowcaseToolbar");
const profileShowcasePickerGridEl = document.getElementById("profileShowcasePickerGrid");
const closeProfileShowcaseModalEl = document.getElementById("closeProfileShowcaseModal");
const profileBadgeModalEl = document.getElementById("profileBadgeModal");
const profileBadgeSlotGridEl = document.getElementById("profileBadgeSlotGrid");
const profileBadgePickerGridEl = document.getElementById("profileBadgePickerGrid");
const closeProfileBadgeModalEl = document.getElementById("closeProfileBadgeModal");
const profileAchievementsModalEl = document.getElementById("profileAchievementsModal");
const profileAchievementsSummaryEl = document.getElementById("profileAchievementsSummary");
const profileAchievementsToolbarEl = document.getElementById("profileAchievementsToolbar");
const profileAchievementsGridEl = document.getElementById("profileAchievementsGrid");
const closeProfileAchievementsModalEl = document.getElementById("closeProfileAchievementsModal");

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function preloadImageAsset(src) {
  const key = String(src || "").trim();
  if (!key) return Promise.resolve();
  if (assetPreloadCache.has(key)) return assetPreloadCache.get(key);

  const promise = new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(key);
    };
    const decodeAndFinish = () => {
      if (settled) return;
      if (typeof image.decode === "function") {
        image.decode().catch(() => {}).finally(finish);
      } else {
        finish();
      }
    };
    image.onload = decodeAndFinish;
    image.onerror = finish;
    image.decoding = "async";
    image.loading = "eager";
    image.src = key;

    if (image.complete) {
      decodeAndFinish();
    }
  });

  assetPreloadCache.set(key, promise);
  return promise;
}

function preloadPackAssets(results) {
  const assets = new Set();
  results.forEach((result) => {
    if (result.image) assets.add(result.image);
    const logoUrl = getTeamLogoUrl(result.teamId);
    if (logoUrl) assets.add(logoUrl);
  });
  return Promise.allSettled([...assets].map((src) => preloadImageAsset(src)));
}

function formatMoney(value) {
  const numeric = Number(value) || 0;
  const sign = numeric < 0 ? "-" : "";
  const absolute = Math.abs(numeric);
  if (absolute >= 1000000) {
    const scaled = absolute / 1000000;
    const compact = scaled >= 10 ? Math.floor(scaled).toString() : scaled.toFixed(1).replace(/\.0$/, "");
    return `${sign}${compact}T`;
  }
  if (absolute >= 1000) {
    const scaled = absolute / 1000;
    const compact = scaled >= 10 ? Math.floor(scaled).toString() : scaled.toFixed(1).replace(/\.0$/, "");
    return `${sign}${compact}B`;
  }
  return `${sign}${Math.floor(absolute)}M`;
}

function formatMoneyNeed(value) {
  const numeric = Math.max(0, Number(value) || 0);
  if (numeric >= 1000000 || numeric >= 1000) return formatMoney(numeric);
  return `${Math.ceil(numeric)}M`;
}

function getStoredCopyCount(cardId) {
  return Math.max(0, Math.floor(Number(state.cardCopies?.[cardId]) || 0));
}

function hasOwnedCard(cardId) {
  return getStoredCopyCount(cardId) > 0;
}

function getStoredDuplicateCount(cardId) {
  return Math.max(0, getStoredCopyCount(cardId) - 1);
}

function normalizeFilterList(value, predicate = () => true) {
  const values = Array.isArray(value)
    ? value
    : value == null || value === "" || value === "all"
      ? []
      : [value];
  return [...new Set(values.map((item) => String(item)).filter((item) => item && predicate(item)))];
}

function normalizeSlotArray(value, limit, predicate = () => true) {
  const source = Array.isArray(value) ? value.slice(0, limit) : [];
  const normalized = source.map((item) => {
    const next = String(item || "");
    return next && predicate(next) ? next : "";
  });
  while (normalized.length < limit) normalized.push("");
  return normalized;
}

function getBulkSellConfig(overrides = {}) {
  const keepCopies = Math.max(1, Math.min(4, Math.floor(Number(overrides.keepCopies ?? bulkSellKeepCopies) || 1)));
  const rawMaxAbility = overrides.maxAbility ?? bulkSellMaxAbility;
  const parsedMaxAbility = rawMaxAbility === "" || rawMaxAbility == null
    ? null
    : Math.max(0, Math.min(100, Math.floor(Number(rawMaxAbility) || 0))) || null;
  return {
    keepCopies,
    teamIds: normalizeFilterList(overrides.teamIds ?? bulkSellTeamFilters, (teamId) => Boolean(teamById[teamId])),
    rarityIds: normalizeFilterList(overrides.rarityIds ?? bulkSellRarityFilters, (rarityId) => visibleRarityIds.has(rarityId)),
    maxAbility: parsedMaxAbility,
  };
}

function getUniqueCards(cards) {
  return [...new Map((cards || []).map((card) => [card.id, card])).values()];
}

function canBulkSellCard(card, config) {
  if (!card) return false;
  if (!hasOwnedCard(card.id)) return false;
  if (getStoredCopyCount(card.id) <= config.keepCopies) return false;
  if (config.teamIds?.length && !config.teamIds.includes(card.teamId)) return false;
  if (config.rarityIds?.length && !config.rarityIds.includes(getFilterableRarityId(card))) return false;
  if (config.maxAbility != null && card.ability > config.maxAbility) return false;
  return true;
}

function getBulkSellSnapshot(cards, config = getBulkSellConfig()) {
  const uniqueCards = getUniqueCards(cards);
  const items = [];
  let totalCopies = 0;
  let totalValue = 0;

  uniqueCards.forEach((card) => {
    if (!canBulkSellCard(card, config)) return;
    const copiesToSell = Math.max(0, getStoredCopyCount(card.id) - config.keepCopies);
    if (!copiesToSell) return;
    const saleValue = copiesToSell * card.sellPrice;
    items.push({ card, copiesToSell, saleValue });
    totalCopies += copiesToSell;
    totalValue += saleValue;
  });

  return {
    items,
    cardCount: items.length,
    totalCopies,
    totalValue,
  };
}

function setStoredCopyCount(cardId, count) {
  const normalized = Math.max(0, Math.floor(Number(count) || 0));
  if (!state.cardCopies) state.cardCopies = {};
  if (normalized > 0) {
    state.cardCopies[cardId] = normalized;
    state.collection[cardId] = true;
    return;
  }
  delete state.cardCopies[cardId];
  delete state.collection[cardId];
}

function addStoredCopy(cardId, amount = 1) {
  setStoredCopyCount(cardId, getStoredCopyCount(cardId) + amount);
}

function countOwnedCards() {
  return Object.keys(state.cardCopies || {}).length;
}

function hasUpgrade(id) {
  return state.upgrades.includes(id);
}

function getRewardCashEarned() {
  return Object.values(state.teamRewardCash).reduce((sum, value) => sum + value, 0)
    + Object.values(state.collectionRewardCash || {}).reduce((sum, value) => sum + value, 0);
}

function getDisplayedTeamReward(teamId) {
  const stored = Number(state.teamRewardCash?.[teamId]);
  if (stored > 0) return roundRewardAmount(stored);
  const team = teamById[teamId];
  return team ? roundRewardAmount(team.reward) : 0;
}

function getDisplayedCollectionReward(groupId) {
  const stored = Number(state.collectionRewardCash?.[groupId]);
  if (stored > 0) return roundRewardAmount(stored);
  const group = collectionGroupById[groupId];
  return group ? roundRewardAmount(group.reward) : 0;
}

function getTeamRewardPackName(teamId) {
  return createTeamRewardPackDefinition(teamId)?.name || "Reward Pack";
}

function getCollectionRewardPackName(groupId) {
  return createCollectionRewardPackDefinition(groupId)?.name || "Reward Pack";
}

function buildRewardSummary(cash, packName) {
  return `${formatMoney(cash)} + ${packName}`;
}

function buildRewardMetaLine(cash, packName, className = "reward-meta-line") {
  return `<div class="${className}">${escapeHtml(buildRewardSummary(cash, packName))}</div>`;
}

function getStats() {
  let clickValue = BASE_CLICK_VALUE;
  let passivePerSecond = BASE_PASSIVE_PER_SECOND;
  state.upgrades.forEach((upgradeId) => {
    const upgrade = upgradesById[upgradeId];
    if (!upgrade) return;
    if (upgrade.apply.click) clickValue += upgrade.apply.click;
    if (upgrade.apply.passive) passivePerSecond += upgrade.apply.passive;
  });
  return { clickValue, passivePerSecond };
}

function getPackOdds() {
  const odds = [
    ["silver", 0.56],
    ["gold", 0.27],
    ["diamond", 0.12],
    ["mythic", 0.035],
    ["blackmatter", 0.002],
    ["legends", 0.003],
  ];
  const total = odds.reduce((sum, entry) => sum + entry[1], 0);
  return odds.map(([rarityId, value]) => ({ rarityId, value: value / total }));
}

function getEligibleCardsForPack(pack) {
  if (!pack) return cardCatalog;
  if (pack.poolType === "team" && pack.poolId && cardsByTeam[pack.poolId]?.length) {
    return cardsByTeam[pack.poolId];
  }
  if (pack.poolType === "conference" && pack.poolId && cardsByConference[pack.poolId]?.length) {
    return cardsByConference[pack.poolId];
  }
  return cardCatalog;
}

function getPoolForRarity(rarityId, sourcePool = cardCatalog) {
  const pool = sourcePool.filter((card) => card.rarityId === rarityId);
  if (pool && pool.length) return pool;
  return sourcePool.length ? sourcePool : cardCatalog;
}

function getPoolForMinimumAbility(minAbility, sourcePool = cardCatalog) {
  const filtered = sourcePool.filter((card) => card.ability >= minAbility);
  return filtered.length ? filtered : sourcePool;
}

function pickCardFromPool(pool, excludedIds = new Set()) {
  const available = pool.filter((card) => !excludedIds.has(card.id));
  if (!available.length) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function drawRandomCard(excludedIds = new Set(), sourcePool = cardCatalog) {
  const odds = getPackOdds();
  const roll = Math.random();
  let cursor = 0;
  for (const entry of odds) {
    cursor += entry.value;
    if (roll <= cursor) {
      const pool = getPoolForRarity(entry.rarityId, sourcePool);
      const picked = pickCardFromPool(pool, excludedIds);
      if (picked) return picked;
      break;
    }
  }
  return pickCardFromPool(sourcePool, excludedIds)
    || pickCardFromPool(getPoolForRarity("common", sourcePool), excludedIds)
    || sourcePool[Math.floor(Math.random() * sourcePool.length)]
    || pickCardFromPool(cardCatalog, excludedIds)
    || cardCatalog[Math.floor(Math.random() * cardCatalog.length)];
}

function drawGuaranteedCard(minAbility, excludedIds = new Set(), sourcePool = cardCatalog) {
  const pool = getPoolForMinimumAbility(minAbility, sourcePool);
  return pickCardFromPool(pool, excludedIds) || drawRandomCard(excludedIds, sourcePool);
}

function applyPackGuarantees(cards, pack, sourcePool = cardCatalog) {
  const guaranteedCards = Math.max(0, pack.guaranteedCards || 0);
  const minimumAbility = Number(pack.guaranteedMinAbility) || 0;
  if (!guaranteedCards || !minimumAbility) return cards;

  let satisfied = cards.filter((card) => card.ability >= minimumAbility).length;
  const fallbackIndices = cards.map((card, index) => ({ card, index }))
    .filter((entry) => entry.card.ability < minimumAbility)
    .map((entry) => entry.index);

  while (satisfied < guaranteedCards && fallbackIndices.length) {
    const pickIndex = Math.floor(Math.random() * fallbackIndices.length);
    const replaceIndex = fallbackIndices.splice(pickIndex, 1)[0];
    const excludedIds = new Set(
      cards
        .map((card, index) => (index === replaceIndex ? null : card.id))
        .filter(Boolean),
    );
    cards[replaceIndex] = drawGuaranteedCard(minimumAbility, excludedIds, sourcePool);
    satisfied += 1;
  }

  return cards;
}

function isTeamCompleteInCollection(collection, teamId) {
  return cardsByTeam[teamId].every((card) => Number(collection[card.id] || 0) > 0);
}

function isCollectionGroupCompleteFromTeams(completedTeamIds, groupId) {
  const teams = getTeamsForCollectionGroup(groupId);
  return teams.length > 0 && teams.every((team) => completedTeamIds.has(team.id));
}

function isPackUnlocked(pack) {
  return true;
}

function getClosestTeam() {
  let closest = null;
  teamSets.forEach((team) => {
    const total = cardsByTeam[team.id].length;
    const owned = cardsByTeam[team.id].filter((card) => hasOwnedCard(card.id)).length;
    const remaining = total - owned;
    if (remaining === 0) return;
    if (!closest || remaining < closest.remaining || (remaining === closest.remaining && owned > closest.owned)) {
      closest = { teamName: team.name, owned, total, remaining };
    }
  });
  return closest;
}

function getNextPackUpgrade() {
  return upgradeLanes.find((lane) => lane.id === "pack").upgrades.find((upgrade) => !hasUpgrade(upgrade.id)) || null;
}

function getUpgradeRenderKey() {
  return upgradeLanes.flatMap((lane) => lane.upgrades.map((upgrade) => {
    const purchased = hasUpgrade(upgrade.id) ? 1 : 0;
    const unlocked = upgrade.requires.every((requiredId) => hasUpgrade(requiredId)) ? 1 : 0;
    const canAfford = state.money >= upgrade.cost && !openingPack ? 1 : 0;
    return `${upgrade.id}:${purchased}:${unlocked}:${canAfford}:${openingPack ? 1 : 0}`;
  })).join("|");
}

function getPackRenderKey() {
  const storeKey = packTypes.map((pack) => {
    const unlocked = isPackUnlocked(pack) ? 1 : 0;
    const canBuy = unlocked && state.money >= pack.cost && !openingPack ? 1 : 0;
    return `${pack.id}:${unlocked}:${canBuy}:${openingPack ? 1 : 0}`;
  }).join("|");
  const savedKey = (state.savedPacks || []).map((pack) => `${pack.instanceId}:${pack.id}`).join("|");
  return `${storeKey}::${state.streetPackDryStreak || 0}::${savedKey}`;
}

function getInitials(name) {
  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getPrimaryPosition(position) {
  const [primary] = String(position || "").split(/[-/]/);
  return (primary || "G").toUpperCase();
}

function getTeamLogoUrl(teamKey) {
  if (teamKey === "hall-of-fame") return HALL_OF_FAME_LOGO_URL;
  const team = teamById[teamKey];
  if (!team || !team.teamId) return "";
  return `https://cdn.nba.com/logos/nba/${team.teamId}/global/L/logo.svg`;
}

function buildSetBrand(team) {
  const logoUrl = getTeamLogoUrl(team.id);
  const fallbackLabel = team.id === "hall-of-fame" ? "HOF" : team.abbreviation;
  return `
    <div class="team-brand collection-brand ${logoUrl ? "" : "fallback-only"}" data-fallback-label="${escapeHtml(fallbackLabel)}">
      ${logoUrl ? `<img class="team-logo" data-team-logo loading="lazy" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(team.name)} logo">` : ""}
    </div>
  `;
}

function getOwnedCountForTeam(teamId) {
  return cardsByTeam[teamId].filter((card) => hasOwnedCard(card.id)).length;
}

function buildOutcomeSetProgress(results) {
  const progressByTeam = new Map();

  results.forEach((result, index) => {
    if (!result.isNew) return;
    const team = teamById[result.teamId];
    if (!team) return;

    let entry = progressByTeam.get(result.teamId);
    if (!entry) {
      const beforeOwned = getOwnedCountForTeam(result.teamId);
      entry = {
        teamId: result.teamId,
        teamName: team.name,
        teamShortName: team.shortName,
        beforeOwned,
        afterOwned: beforeOwned,
        total: cardsByTeam[result.teamId].length,
        colors: team.colors,
        revealIndices: [],
        completedBefore: state.completedTeams.includes(result.teamId),
        completedAfter: false,
      };
      progressByTeam.set(result.teamId, entry);
    }

    entry.afterOwned += 1;
    entry.revealIndices.push(index);
    entry.completedAfter = entry.afterOwned >= entry.total;
  });

  return [...progressByTeam.values()];
}

function getOwnedCards() {
  return cardCatalog.filter((card) => hasOwnedCard(card.id));
}

function sortCollectionTeams(teams) {
  return [...teams].sort((left, right) => {
    if (collectionSort === "most-owned") {
      const ownedDelta = getOwnedCountForTeam(right.id) - getOwnedCountForTeam(left.id);
      if (ownedDelta !== 0) return ownedDelta;
    }
    if (collectionSort === "least-owned") {
      const ownedDelta = getOwnedCountForTeam(left.id) - getOwnedCountForTeam(right.id);
      if (ownedDelta !== 0) return ownedDelta;
    }
    return left.name.localeCompare(right.name);
  });
}

function getTeamsForCollectionGroup(groupId) {
  return teamSets.filter((team) => team.conference === groupId);
}

function sanitizeProfileName(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, PROFILE_NAME_MAX_LENGTH);
}

function getDefaultProfileName() {
  const favoriteTeam = getProfileFavoriteTeam();
  if (favoriteTeam) return sanitizeProfileName(`${favoriteTeam.shortName || favoriteTeam.name} Fan`);
  return sanitizeProfileName("Basketball Fan");
}

function getProfileDisplayName() {
  return sanitizeProfileName(state.profile?.name) || getDefaultProfileName();
}

function getAchievementTierUnlockKey(achievementId, tierIndex) {
  return `${achievementId}:${tierIndex + 1}`;
}

function getAchievementUnlockedAt(achievementId, tierIndex = null) {
  if (!state.achievementTierUnlockedAt) return 0;
  if (tierIndex == null) {
    const level = Math.max(0, Number(state.achievementLevels?.[achievementId]) || 0);
    if (!level) return 0;
    return Number(state.achievementTierUnlockedAt[getAchievementTierUnlockKey(achievementId, level - 1)] || 0);
  }
  return Number(state.achievementTierUnlockedAt[getAchievementTierUnlockKey(achievementId, tierIndex)] || 0);
}

function formatAchievementDate(value) {
  const timestamp = Number(value || 0);
  if (!timestamp) return "Before tracking";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCompletedSetCountForCollectionGroup(groupId) {
  return getTeamsForCollectionGroup(groupId).filter((team) => state.completedTeams.includes(team.id)).length;
}

function isCollectionGroupComplete(groupId) {
  const teams = getTeamsForCollectionGroup(groupId);
  return teams.length > 0 && teams.every((team) => state.completedTeams.includes(team.id));
}

function getCompletedCollectionCount() {
  return collectionGroups.filter((group) => isCollectionGroupComplete(group.id)).length;
}

function getCollectionGroupProgress(groupId) {
  const teams = getTeamsForCollectionGroup(groupId);
  return {
    totalSets: teams.length,
    completedSets: teams.filter((team) => state.completedTeams.includes(team.id)).length,
  };
}

function createTeamRewardPackDefinition(teamId) {
  const team = teamById[teamId];
  if (!team) return null;
  const topAbility = cardsByTeam[teamId]?.[0]?.ability || 84;
  return {
    id: `reward-team-${team.id}`,
    templateId: `reward-team-${team.id}`,
    name: `${team.shortName || team.name} Team Pack`,
    cost: 0,
    baseCards: 2,
    guaranteedCards: 1,
    guaranteedMinAbility: Math.max(84, Math.min(88, topAbility - 2)),
    accent: team.colors.primary,
    accentSecondary: team.colors.secondary,
    stamp: "Team Pack",
    description: `Reward pack with players from ${team.name}.`,
    poolType: "team",
    poolId: team.id,
    rewardSource: "set",
    rewardLabel: team.name,
  };
}

function createCollectionRewardPackDefinition(groupId) {
  const group = collectionGroupById[groupId];
  if (!group) return null;
  if (groupId === "Special") {
    return {
      id: "reward-collection-special",
      templateId: "reward-collection-special",
      name: "Legends Relic Pack",
      cost: 0,
      baseCards: 1,
      guaranteedCards: 1,
      guaranteedMinAbility: 98,
      accent: "#d4ae5d",
      accentSecondary: "#fff1cf",
      stamp: "Collection Pack",
      description: "One premium legends pull from the Special collection.",
      poolType: "team",
      poolId: "hall-of-fame",
      rewardSource: "collection",
      rewardLabel: group.name,
    };
  }
  return {
    id: `reward-collection-${groupId.toLowerCase()}`,
    templateId: `reward-collection-${groupId.toLowerCase()}`,
    name: `${group.shortName} Crown Pack`,
    cost: 0,
    baseCards: 1,
    guaranteedCards: 1,
    guaranteedMinAbility: 92,
    accent: group.colors.primary,
    accentSecondary: group.colors.secondary,
    stamp: "Collection Pack",
    description: `One elite pull from the ${group.name}.`,
    poolType: "conference",
    poolId: groupId,
    rewardSource: "collection",
    rewardLabel: group.name,
  };
}

function grantSavedPack(packDefinition) {
  if (!packDefinition) return null;
  const grantedPack = createPackInventoryRecord(packDefinition, `saved-pack-${state.nextSavedPackId}`);
  state.nextSavedPackId += 1;
  state.savedPacks.push(grantedPack);
  return grantedPack;
}

function toRoman(value) {
  const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return numerals[Math.max(0, Math.min(numerals.length - 1, Math.floor(value) - 1))] || String(value);
}

function getAchievementTierProgress(definition, tierIndex) {
  const tier = definition?.tiers?.[tierIndex];
  if (!tier) return 0;
  if (typeof definition.getTierProgress === "function") {
    return Math.max(0, Number(definition.getTierProgress(tierIndex, tier)) || 0);
  }
  if (typeof tier.getProgress === "function") {
    return Math.max(0, Number(tier.getProgress()) || 0);
  }
  if (typeof definition.getProgress === "function") {
    return Math.max(0, Number(definition.getProgress()) || 0);
  }
  return 0;
}

function getAchievementCompletionCount(definition) {
  if (!definition?.tiers?.length) return 0;
  let completed = 0;
  definition.tiers.forEach((tier, index) => {
    const progress = getAchievementTierProgress(definition, index);
    if (progress >= tier.target) completed += 1;
  });
  return completed;
}

function resolveAchievementTierRewardPacks(definition, tier, tierIndex) {
  if (!tier) return [];
  if (typeof tier.rewardPacks === "function") {
    return (tier.rewardPacks(definition, tierIndex) || []).filter(Boolean);
  }
  const templates = Array.isArray(tier.rewardTemplates) ? tier.rewardTemplates : [];
  return templates
    .map((templateKey) => createAchievementRewardPackDefinition(templateKey))
    .filter(Boolean);
}

function getBadgeTheme(tone, options = {}) {
  const themes = {
    silver: {
      bg: "linear-gradient(135deg, rgba(142, 154, 182, 0.38), rgba(91, 103, 132, 0.72))",
      border: "rgba(225, 233, 246, 0.38)",
      text: "#edf3ff",
      glow: "rgba(171, 184, 209, 0.28)",
    },
    gold: {
      bg: "linear-gradient(135deg, rgba(228, 182, 94, 0.42), rgba(131, 86, 24, 0.84))",
      border: "rgba(255, 229, 168, 0.42)",
      text: "#fff4d6",
      glow: "rgba(245, 195, 93, 0.32)",
    },
    diamond: {
      bg: "linear-gradient(135deg, rgba(92, 164, 255, 0.38), rgba(40, 78, 169, 0.82))",
      border: "rgba(199, 231, 255, 0.42)",
      text: "#ebf6ff",
      glow: "rgba(93, 170, 255, 0.32)",
    },
    mythic: {
      bg: "linear-gradient(135deg, rgba(239, 190, 70, 0.4), rgba(162, 92, 18, 0.86))",
      border: "rgba(255, 239, 196, 0.46)",
      text: "#fff7d7",
      glow: "rgba(244, 188, 70, 0.34)",
    },
    legend: {
      bg: "linear-gradient(135deg, rgba(243, 230, 190, 0.5), rgba(168, 130, 42, 0.88))",
      border: "rgba(255, 247, 218, 0.58)",
      text: "#fff9e7",
      glow: "rgba(247, 217, 129, 0.38)",
    },
    blackmatter: {
      bg: "linear-gradient(135deg, rgba(20, 24, 34, 0.88), rgba(4, 6, 11, 0.98))",
      border: "rgba(247, 250, 255, 0.44)",
      text: "#f5f9ff",
      glow: "rgba(215, 226, 244, 0.26)",
    },
    "favorite-team-gold": {
      bg: "linear-gradient(135deg, rgba(253, 220, 132, 0.52), rgba(166, 111, 18, 0.92))",
      border: "rgba(255, 247, 206, 0.6)",
      text: "#fffaf0",
      glow: "rgba(245, 204, 112, 0.42)",
    },
  };
  return {
    ...(themes[tone] || themes.silver),
    ...options,
  };
}

function getAchievementBadgeData(definition) {
  if (!definition) return null;
  const level = Math.max(0, Math.floor(Number(state.achievementLevels?.[definition.id]) || 0));
  if (!level) return null;
  const tier = definition.tiers[level - 1];
  if (!tier) return null;
  const isFavoriteTeamBadge = definition.teamId && level >= definition.tiers.length;
  if (isFavoriteTeamBadge) {
    return getTeamBadgeData(definition.teamId, { gold: true });
  }
  const theme = getBadgeTheme(tier.badgeTone || "silver");
  return {
    id: `achievement:${definition.id}`,
    label: tier.label,
    title: definition.title,
    note: definition.note,
    iconText: definition.badgeAcronym || definition.title.slice(0, 2).toUpperCase(),
    logoUrl: isFavoriteTeamBadge ? getTeamLogoUrl(definition.teamId) : definition.badgeLogoUrl || "",
    theme,
    category: definition.category,
    sortValue: 200 + level,
  };
}

function getTeamBadgeData(teamId, options = {}) {
  const team = teamById[teamId];
  if (!team) return null;
  const gold = options.gold === true;
  const theme = gold
    ? getBadgeTheme("favorite-team-gold")
    : {
        bg: `linear-gradient(135deg, ${withAlpha(team.colors.primary, 0.56)}, ${withAlpha(team.colors.secondary, 0.3)})`,
        border: withAlpha(team.colors.secondary, 0.5),
        text: "#f5f8ff",
        glow: withAlpha(team.colors.primary, 0.36),
      };
  return {
    id: `${gold ? "favorite-team" : "team"}:${teamId}`,
    label: gold ? `${team.shortName || team.name} Gold` : (team.shortName || team.name),
    title: gold ? `${team.name} Mastery` : `${team.name} Complete`,
    note: gold ? `Mastered your favorite team challenge for ${team.name}.` : `Completed the ${team.name} set and earned the team badge.`,
    iconText: team.abbreviation,
    logoUrl: getTeamLogoUrl(teamId),
    theme,
    category: gold ? "Favorite Team" : "Team Set",
    sortValue: gold ? 500 : 100,
  };
}

function getAllEarnedBadges() {
  const badges = [];
  getAchievementDefinitions().forEach((definition) => {
    const badge = getAchievementBadgeData(definition);
    if (badge) badges.push(badge);
  });
  state.completedTeams.forEach((teamId) => {
    const badge = getTeamBadgeData(teamId);
    if (badge) badges.push(badge);
  });
  Object.entries(state.achievementLevels || {}).forEach(([achievementId, level]) => {
    if (!achievementId.startsWith("favorite-team-")) return;
    if (Math.max(0, Math.floor(Number(level) || 0)) < 3) return;
    const teamId = achievementId.slice("favorite-team-".length);
    const goldBadge = getTeamBadgeData(teamId, { gold: true });
    if (goldBadge) badges.push(goldBadge);
  });

  return [...new Map(badges.map((badge) => [badge.id, badge])).values()].sort((left, right) => {
    if ((right.sortValue || 0) !== (left.sortValue || 0)) {
      return (right.sortValue || 0) - (left.sortValue || 0);
    }
    return left.title.localeCompare(right.title);
  });
}

function getBadgeById(badgeId) {
  return getAllEarnedBadges().find((badge) => badge.id === badgeId) || null;
}

function reconcileAchievements(options = {}) {
  const showCelebration = options.showCelebration === true;
  if (!state.achievementLevels) state.achievementLevels = {};
  if (!state.achievementTierUnlockedAt) state.achievementTierUnlockedAt = {};
  const rewardEntries = [];
  let changed = false;

  getAchievementDefinitions().forEach((definition) => {
    const reachedCount = getAchievementCompletionCount(definition);
    const storedCount = Math.max(0, Math.floor(Number(state.achievementLevels[definition.id]) || 0));
    if (reachedCount <= storedCount) return;

    for (let tierIndex = storedCount; tierIndex < reachedCount; tierIndex += 1) {
      const tier = definition.tiers[tierIndex];
      const rewardPacks = resolveAchievementTierRewardPacks(definition, tier, tierIndex);
      const grantedPacks = rewardPacks.map((pack) => grantSavedPack(pack)).filter(Boolean);
      const unlockKey = getAchievementTierUnlockKey(definition.id, tierIndex);
      if (!state.achievementTierUnlockedAt[unlockKey]) {
        state.achievementTierUnlockedAt[unlockKey] = Date.now();
      }
      rewardEntries.push({
        achievementId: definition.id,
        title: definition.title,
        tierLabel: tier.label,
        packs: grantedPacks.length ? grantedPacks : rewardPacks,
        badge: {
          id: `achievement:${definition.id}`,
          label: tier.label,
        },
      });
    }

    state.achievementLevels[definition.id] = reachedCount;
    changed = true;
  });

  if (changed && showCelebration && rewardEntries.length) {
    achievementCelebration = {
      rewards: rewardEntries,
    };
  }

  return { changed, rewardEntries };
}

function buildCollectionGroupPreview(group) {
  const previewTeams = getTeamsForCollectionGroup(group.id);
  return `
    <div class="collection-group-preview" aria-hidden="true">
      ${previewTeams.map((team) => {
        const logoUrl = getTeamLogoUrl(team.id);
        const fallbackLabel = team.id === "hall-of-fame" ? "HOF" : team.abbreviation;
        return `
          <span class="collection-group-logo ${logoUrl ? "" : "fallback-only"}" data-fallback-label="${escapeHtml(fallbackLabel)}">
            ${logoUrl ? `<img loading="lazy" src="${escapeHtml(logoUrl)}" alt="">` : ""}
          </span>
        `;
      }).join("")}
    </div>
  `;
}

function openCollectionGroup(groupId) {
  activeCollectionGroup = collectionGroupById[groupId] ? groupId : null;
  activeCollectionTeam = null;
  renderCollection();
}

function closeCollectionGroup() {
  activeCollectionGroup = null;
  activeCollectionTeam = null;
  isSetBulkSellOpen = false;
  renderCollection();
}

function openCollectionTeam(teamId) {
  collectionSection = "collections";
  activeCollectionGroup = teamById[teamId]?.conference || activeCollectionGroup;
  activeCollectionTeam = teamId;
  isSetBulkSellOpen = false;
  renderCollection();
}

function closeCollectionTeam() {
  activeCollectionTeam = null;
  isSetBulkSellOpen = false;
  renderCollection();
}

function setCollectionSort(sort) {
  collectionSort = sort;
  renderCollection();
}

function setCollectionSection(section) {
  collectionSection = section === "players" ? "players" : "collections";
  if (collectionSection !== "players") {
    isPlayerFilterMenuOpen = false;
    isPlayerBulkSellOpen = false;
  }
  renderCollection();
}

function setPlayerCollectionSearch(value) {
  playerCollectionSearch = String(value || "");
  renderCollection();
}

function setPlayerCollectionSort(sort) {
  playerCollectionSort = sort;
  renderCollection();
}

function setPlayerCollectionTeamFilter(filter) {
  playerCollectionTeamFilter = normalizeFilterList(filter, (teamId) => Boolean(teamById[teamId]));
  renderCollection();
}

function setPlayerCollectionRarityFilter(filter) {
  playerCollectionRarityFilter = normalizeFilterList(filter, (rarityId) => visibleRarityIds.has(rarityId));
  renderCollection();
}

function setPlayerCollectionPositionFilter(filter) {
  playerCollectionPositionFilter = filter;
  renderCollection();
}

function setPlayerCollectionShowLocked(showLocked) {
  playerCollectionShowLocked = showLocked === true;
  renderCollection();
}

function setPackSection(section) {
  activePackSection = section === "inventory" ? "inventory" : "store";
  renderPackStore();
}

function getSortedSavedPacks() {
  return [...state.savedPacks].sort((left, right) => {
    const guaranteeDelta = (right.guaranteedMinAbility || 0) - (left.guaranteedMinAbility || 0);
    if (guaranteeDelta !== 0) return guaranteeDelta;
    const cardDelta = (right.baseCards || 0) - (left.baseCards || 0);
    if (cardDelta !== 0) return cardDelta;
    return left.name.localeCompare(right.name);
  });
}

function getPackPreviewItems(sourceType) {
  return sourceType === "saved" ? getSortedSavedPacks() : packTypes;
}

function findPackPreviewIndex(items, sourceType, context = {}) {
  if (!items.length) return -1;
  if (sourceType === "saved") {
    if (context.savedPackId) {
      const savedIndex = items.findIndex((pack) => pack.instanceId === context.savedPackId);
      if (savedIndex >= 0) return savedIndex;
    }
    if (Number.isInteger(context.previewIndex)) {
      return Math.max(0, Math.min(items.length - 1, context.previewIndex));
    }
    return 0;
  }

  const packId = context.packId || context.repeatableStorePackId;
  if (packId) {
    const storeIndex = items.findIndex((pack) => pack.id === packId);
    if (storeIndex >= 0) return storeIndex;
  }
  return 0;
}

function getPackPreviewContext(source = null) {
  const contextSource = source || activePackPreview || (state.lastPack
    ? {
        sourceType: state.lastPack.packSourceType === "saved" ? "saved" : "store",
        savedPackId: state.lastPack.savedPackId || null,
        packId: state.lastPack.repeatableStorePackId || state.lastPack.packId,
        previewIndex: Number.isInteger(state.lastPack.previewIndex) ? state.lastPack.previewIndex : null,
      }
    : null);
  if (!contextSource) return null;

  const sourceType = contextSource.sourceType === "saved" ? "saved" : "store";
  const items = getPackPreviewItems(sourceType);
  const index = findPackPreviewIndex(items, sourceType, contextSource);
  if (index < 0) return null;
  const pack = items[index];
  if (!pack) return null;
  return {
    sourceType,
    items,
    index,
    pack,
    loops: sourceType === "saved" && items.length > 1,
  };
}

function openPackPreview(sourceType, context = {}) {
  const previewContext = getPackPreviewContext({
    sourceType,
    savedPackId: context.savedPackId || null,
    packId: context.packId || null,
    previewIndex: Number.isInteger(context.previewIndex) ? context.previewIndex : null,
  });
  if (!previewContext) return;
  activePackPreview = {
    sourceType: previewContext.sourceType,
    savedPackId: previewContext.sourceType === "saved" ? previewContext.pack.instanceId : null,
    packId: previewContext.pack.id,
    previewIndex: previewContext.index,
  };
  isPackModalOpen = true;
  renderPackArea();
}

function stepPackPreview(direction) {
  if (openingPack) return;
  const previewContext = getPackPreviewContext();
  if (!previewContext || previewContext.items.length <= 0) return;
  if (previewContext.sourceType === "saved") {
    if (previewContext.items.length <= 1) return;
    const nextIndex = (previewContext.index + direction + previewContext.items.length) % previewContext.items.length;
    const nextPack = previewContext.items[nextIndex];
    activePackPreview = {
      sourceType: "saved",
      savedPackId: nextPack.instanceId,
      packId: nextPack.id,
      previewIndex: nextIndex,
    };
  } else {
    const nextIndex = previewContext.index + direction;
    if (nextIndex < 0 || nextIndex >= previewContext.items.length) return;
    const nextPack = previewContext.items[nextIndex];
    activePackPreview = {
      sourceType: "store",
      packId: nextPack.id,
      previewIndex: nextIndex,
    };
  }
  renderPackArea();
}

function setBulkSellKeepCopies(value) {
  bulkSellKeepCopies = Math.max(1, Math.min(4, Math.floor(Number(value) || 1)));
  renderCollection();
}

function setBulkSellTeamFilters(teamIds) {
  bulkSellTeamFilters = normalizeFilterList(teamIds, (teamId) => Boolean(teamById[teamId]));
  renderCollection();
}

function setBulkSellRarityFilters(rarityIds) {
  bulkSellRarityFilters = normalizeFilterList(rarityIds, (rarityId) => visibleRarityIds.has(rarityId));
  renderCollection();
}

function togglePlayerFilterMenu() {
  isPlayerFilterMenuOpen = !isPlayerFilterMenuOpen;
  if (isPlayerFilterMenuOpen) isPlayerBulkSellOpen = false;
  renderCollection();
}

function togglePlayerBulkSellMenu() {
  isPlayerBulkSellOpen = !isPlayerBulkSellOpen;
  if (isPlayerBulkSellOpen) isPlayerFilterMenuOpen = false;
  renderCollection();
}

function toggleSetBulkSellMenu() {
  isSetBulkSellOpen = !isSetBulkSellOpen;
  renderCollection();
}

function setBulkSellMaxAbility(value) {
  const normalized = String(value ?? "").replace(/[^\d]/g, "").slice(0, 3);
  bulkSellMaxAbility = normalized ? String(Math.max(0, Math.min(100, Number(normalized)))) : "";
  renderCollection();
}

function openPackModal() {
  if (!openingPack && !state.lastPack && !activePackPreview) return;
  isPackModalOpen = true;
  renderPackArea();
}

function closePackModal() {
  if (openingPack) return;
  activePackPreview = null;
  if (state.lastPack) {
    state.lastPack = null;
    saveState();
  }
  isPackModalOpen = false;
  renderAll();
}

function closeResolvedPackFlow() {
  isPackModalOpen = false;
  activePackPreview = null;
  if (state.lastPack) {
    state.lastPack = null;
    saveState();
  }
  renderAll();
}

function closeSetCompletionModal() {
  setCompletionCelebration = null;
  renderAll();
}

function closeDailyRewardModal() {
  dailyChallengeCelebration = null;
  renderAll();
}

function clearOpeningPackDailyProgressTimer(packState = openingPack) {
  if (!packState?.dailyProgressTimer) return;
  window.clearTimeout(packState.dailyProgressTimer);
  packState.dailyProgressTimer = null;
}

function scheduleOpeningPackDailyProgressDismiss(packState = openingPack) {
  if (!packState || !packState.dailyProgressEntries?.length) return;
  clearOpeningPackDailyProgressTimer(packState);
  const preloadId = packState.preloadId;
  packState.dailyProgressVisible = true;
  packState.dailyProgressTimer = window.setTimeout(() => {
    if (!openingPack || openingPack.preloadId !== preloadId) return;
    openingPack.dailyProgressVisible = false;
    openingPack.dailyProgressTimer = null;
    renderRevealDailyProgress();
  }, 4200);
}

function formatPreviewDate(value) {
  const timestamp = Number(value || 0);
  if (!timestamp) return "Not unboxed yet";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function openCardPreview(cardId, options = {}) {
  const card = cardsById[cardId];
  if (!card) return;
  activeCardPreview = {
    cardId,
    collectionMode: options.collectionMode === true,
    owned: options.owned !== false,
  };
  const previewFooter = activeCardPreview.collectionMode
    ? buildCollectionCardFooter(card, { allowSell: false })
    : buildStaticValueFooter(card.sellPrice);
  cardPreviewStageEl.innerHTML = buildCardFace(card, {
    collectionMode: activeCardPreview.collectionMode,
    owned: activeCardPreview.owned,
    showCollectionStatus: activeCardPreview.collectionMode,
    footerHtml: previewFooter,
    previewable: false,
    tiltEnabled: true,
    shellClass: "preview-card-shell",
  });
  const totalPulls = Number(state.pullCounts?.[cardId] || 0);
  const firstUnboxedAt = Number(state.firstPullAt?.[cardId] || 0);
  const firstUnboxedText = firstUnboxedAt
    ? formatPreviewDate(firstUnboxedAt)
    : totalPulls > 0
      ? "Before tracking"
      : "Not unboxed yet";
  cardPreviewMetaEl.innerHTML = `
    <div class="card-preview-meta-line">First unboxed: ${escapeHtml(firstUnboxedText)}</div>
    <div class="card-preview-meta-line">Unboxed ${escapeHtml(totalPulls.toLocaleString("en-US"))} ${totalPulls === 1 ? "time" : "times"}</div>
  `;
  cardPreviewModalEl.hidden = false;
}

function closeCardPreview() {
  activeCardPreview = null;
  cardPreviewModalEl.hidden = true;
  cardPreviewStageEl.innerHTML = "";
  if (cardPreviewMetaEl) cardPreviewMetaEl.innerHTML = "";
}

function syncCollectionViewMeta() {
  if (!collectionEyebrowEl || !collectionTitleEl || !collectionIntroEl) return;
  if (collectionSection === "players") {
    collectionEyebrowEl.textContent = "Players";
    collectionTitleEl.textContent = "Browse your club.";
    collectionIntroEl.textContent = "Search, sort, and filter your cards, or turn on locked cards to view the full pool.";
    return;
  }

  if (activeCollectionTeam) {
    const team = teamById[activeCollectionTeam];
    const parentCollection = collectionGroupById[activeCollectionGroup || team?.conference];
    collectionEyebrowEl.textContent = "Set";
    collectionTitleEl.textContent = team ? `${team.name}.` : "Track set progress.";
    collectionIntroEl.textContent = parentCollection
      ? `Inside ${parentCollection.name}. Open a set to see the full roster and your missing cards.`
      : "Open a set to see the full roster and your missing cards.";
    return;
  }

  if (activeCollectionGroup) {
    const group = collectionGroupById[activeCollectionGroup];
    const { completedSets, totalSets } = getCollectionGroupProgress(activeCollectionGroup);
    collectionEyebrowEl.textContent = "Collection";
    collectionTitleEl.textContent = group ? `${group.name}.` : "Choose a collection.";
    collectionIntroEl.textContent = group
      ? `${completedSets}/${totalSets} sets completed in this collection.`
      : "Choose a collection to browse its sets.";
    return;
  }

  collectionEyebrowEl.textContent = "Collections";
  collectionTitleEl.textContent = "Choose a collection.";
  collectionIntroEl.textContent = "Browse East, West, and Special collections, then open the sets inside each one.";
}

function clearCollectionDetailTheme() {
  if (!collectionViewEl) return;
  collectionViewEl.classList.remove("team-active", "detail-focus");
  collectionViewEl.style.removeProperty("--collection-team-primary");
  collectionViewEl.style.removeProperty("--collection-team-secondary");
  collectionViewEl.style.removeProperty("--collection-team-logo");
}

function applyCollectionDetailTheme(team) {
  if (!collectionViewEl || !team) return;
  collectionViewEl.classList.add("team-active", "detail-focus");
  collectionViewEl.style.setProperty("--collection-team-primary", team.colors.primary);
  collectionViewEl.style.setProperty("--collection-team-secondary", team.colors.secondary);
  const logoUrl = getTeamLogoUrl(team.id);
  if (logoUrl) {
    collectionViewEl.style.setProperty("--collection-team-logo", `url("${logoUrl}")`);
  } else {
    collectionViewEl.style.removeProperty("--collection-team-logo");
  }
}

function getSectionIdForView(view) {
  if (view === "collections" || view === "sets" || view === "players" || view === "collection") return "collectionView";
  return `${view}View`;
}

function setActiveView(view) {
  activeView = view === "collection" || view === "sets" ? "collections" : view;
  if (activeView === "collections" || activeView === "players") {
    setCollectionSection(activeView);
  }
  syncCollectionViewMeta();
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === getSectionIdForView(activeView));
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeView);
  });
  if (activeView === "collections" || activeView === "players") renderCollection();
}

function shouldApplyStreetPackPity(pack, sourceType = "store") {
  return sourceType === "store" && pack?.id === "street" && state.streetPackDryStreak >= 10;
}

function simulatePackOutcome(pack, options = {}) {
  const sourceType = options.sourceType || "store";
  const sourcePool = getEligibleCardsForPack(pack);
  const tempCollection = { ...(state.cardCopies || {}) };
  const tempCompleted = new Set(state.completedTeams);
  const tempCompletedCollections = new Set(state.completedCollections || []);
  const results = [];
  const completedTeams = [];
  const completedCollections = [];
  const effectivePack = {
    ...pack,
    guaranteedCards: Math.max(pack.guaranteedCards || 0, options.forceGuaranteedMinAbility ? 1 : 0),
    guaranteedMinAbility: Math.max(Number(pack.guaranteedMinAbility) || 0, Number(options.forceGuaranteedMinAbility) || 0),
  };

  const packCards = applyPackGuarantees(
    (() => {
      const cards = [];
      const usedIds = new Set();
      for (let index = 0; index < effectivePack.baseCards; index += 1) {
        const nextCard = drawRandomCard(usedIds, sourcePool);
        if (!nextCard) break;
        cards.push(nextCard);
        usedIds.add(nextCard.id);
      }
      return cards;
    })(),
    effectivePack,
    sourcePool,
  );

  packCards.forEach((card, index) => {
    const alreadyOwned = Number(tempCollection[card.id] || 0) > 0;
    if (!alreadyOwned) {
      tempCollection[card.id] = 1;
      if (!tempCompleted.has(card.teamId) && isTeamCompleteInCollection(tempCollection, card.teamId)) {
        const reward = teamById[card.teamId].reward;
        tempCompleted.add(card.teamId);
        completedTeams.push({
          teamId: card.teamId,
          teamName: card.teamName,
          reward,
          rewardPack: createTeamRewardPackDefinition(card.teamId),
        });
        const collectionId = teamById[card.teamId]?.conference;
        if (collectionId && !tempCompletedCollections.has(collectionId) && isCollectionGroupCompleteFromTeams(tempCompleted, collectionId)) {
          const group = collectionGroupById[collectionId];
          tempCompletedCollections.add(collectionId);
          completedCollections.push({
            groupId: collectionId,
            groupName: group?.name || collectionId,
            reward: group?.reward || 0,
            rewardPack: createCollectionRewardPackDefinition(collectionId),
          });
        }
      }
    } else {
      tempCollection[card.id] = Number(tempCollection[card.id] || 0) + 1;
    }
    results.push({
      ...card,
      isNew: !alreadyOwned,
      saleValue: card.sellPrice,
      packResultId: `${pack.id}-${index}-${card.id}`,
      duplicateDecision: alreadyOwned ? "saved" : "new",
    });
  });

  return {
    packId: pack.id,
    packName: pack.name,
    packCost: pack.cost,
    packSourceType: sourceType,
    results,
    duplicateCash: 0,
    rewardCash: completedTeams.reduce((sum, entry) => sum + entry.reward, 0) + completedCollections.reduce((sum, entry) => sum + entry.reward, 0),
    completedTeams,
    completedCollections,
    gotStreetPackHit: pack.id === "street" && results.some((result) => result.ability >= 87),
    streetPackPityApplied: Boolean(options.forceGuaranteedMinAbility),
    openedAt: Date.now(),
  };
}

function applyPackOutcome(outcome) {
  state.packsOpened += 1;
  outcome.results.forEach((result) => {
    if (!state.firstPullAt[result.id]) {
      state.firstPullAt[result.id] = Number(outcome.openedAt || Date.now());
    }
    state.pullCounts[result.id] = (state.pullCounts[result.id] || 0) + 1;
    state.totalCardsDrawn += 1;
    addStoredCopy(result.id, 1);
  });

  outcome.completedTeams.forEach((entry) => {
    if (!state.completedTeams.includes(entry.teamId)) {
      state.completedTeams.push(entry.teamId);
      state.teamRewardCash[entry.teamId] = entry.reward;
      state.money += entry.reward;
      state.lifetimeEarned += entry.reward;
      entry.grantedPack = grantSavedPack(entry.rewardPack);
    }
  });

  outcome.completedCollections.forEach((entry) => {
    if (!state.completedCollections.includes(entry.groupId)) {
      state.completedCollections.push(entry.groupId);
      state.collectionRewardCash[entry.groupId] = entry.reward;
      state.money += entry.reward;
      state.lifetimeEarned += entry.reward;
      entry.grantedPack = grantSavedPack(entry.rewardPack);
    }
  });

  if (outcome.packId === "street" && outcome.packSourceType === "store") {
    state.streetPackDryStreak = outcome.gotStreetPackHit ? 0 : Math.min(10, state.streetPackDryStreak + 1);
  }

  const dailyChallengeUpdate = updateDailyChallengesFromOutcome(outcome);
  if (dailyChallengeUpdate.rewardEntries.length) {
    dailyChallengeCelebration = {
      rewards: dailyChallengeUpdate.rewardEntries,
    };
  }
  reconcileAchievements({ showCelebration: true });
  state.lastPack = outcome;
  saveState();
}

function openPack(packId, options = {}) {
  if (openingPack) return;
  const sourceType = options.sourceType || "store";
  const savedPackId = options.savedPackId || null;
  const previewIndex = Number.isInteger(options.previewIndex) ? options.previewIndex : null;
  const pack = sourceType === "saved"
    ? state.savedPacks.find((entry) => entry.instanceId === savedPackId)
    : packById[packId];
  if (!pack) return;
  if (sourceType === "store" && state.money < pack.cost) return;
  setCompletionCelebration = null;
  dailyChallengeCelebration = null;
  activePackPreview = null;
  if (sourceType === "store") {
    state.money -= pack.cost;
    state.lifetimePackSpend += pack.cost;
  } else {
    state.savedPacks = state.savedPacks.filter((entry) => entry.instanceId !== savedPackId);
  }
  state.lastPack = null;
  saveState();
  isPackModalOpen = true;
  const outcome = simulatePackOutcome(pack, {
    sourceType,
    forceGuaranteedMinAbility: shouldApplyStreetPackPity(pack, sourceType) ? 87 : 0,
  });
  outcome.setProgress = buildOutcomeSetProgress(outcome.results);
  outcome.dailyChallengeProgress = getDailyChallengeProgressPreview(outcome);
  outcome.repeatableStorePackId = sourceType === "store" ? pack.id : null;
  outcome.savedPackId = savedPackId;
  outcome.previewIndex = previewIndex;
  const preloadId = `${pack.id}-${outcome.openedAt}`;
  openingPack = {
    packId: pack.id,
    packName: pack.name,
    outcome,
    flipped: Array.from({ length: outcome.results.length }, () => false),
    revealedCount: 0,
    assetsReady: false,
    preloadId,
    setProgress: outcome.setProgress.map((entry) => ({
      ...entry,
      currentOwned: entry.beforeOwned,
      isVisible: false,
      isBumping: false,
      bumpTimer: null,
    })),
    dailyProgressEntries: outcome.dailyChallengeProgress.map((entry) => ({ ...entry })),
    dailyProgressVisible: outcome.dailyChallengeProgress.length > 0,
    dailyProgressTimer: null,
  };
  scheduleOpeningPackDailyProgressDismiss(openingPack);
  preloadPackAssets(outcome.results).finally(() => {
    if (!openingPack || openingPack.preloadId !== preloadId) return;
    openingPack.assetsReady = true;
    renderPackArea();
  });
  activeView = "packs";
  renderAll();
}

function updateRevealProgress() {
  if (!openingPack) return;
  revealProgressEl.textContent = `${openingPack.revealedCount} / ${openingPack.outcome.results.length} Revealed`;
}

function buildRevealSetProgressChip(entry, options = {}) {
  const currentOwned = options.currentOwned ?? entry.afterOwned;
  const progressPercent = entry.total ? Math.round((currentOwned / entry.total) * 100) : 0;
  const logoUrl = getTeamLogoUrl(entry.teamId);
  const fallbackLabel = entry.teamId === "hall-of-fame"
    ? "HOF"
    : String(entry.teamShortName || entry.teamName || "")
      .slice(0, 3)
      .toUpperCase();
  const teamPrimary = entry.colors?.primary || "#4f5a70";
  const teamSecondary = entry.colors?.secondary || teamPrimary;
  const gained = Math.max(0, currentOwned - entry.beforeOwned);
  const progressTag = currentOwned >= entry.total
    ? "Set Complete"
    : gained > 0
      ? `+${gained}`
      : "";

  return `
    <article
      class="reveal-set-progress-chip ${entry.isBumping ? "bump" : ""} ${currentOwned >= entry.total ? "complete" : ""}"
      style="--team-primary:${teamPrimary}; --team-secondary:${teamSecondary}; --set-progress:${progressPercent}%"
    >
      <div class="reveal-set-progress-head">
        <div class="reveal-set-progress-team">
          <span class="reveal-set-progress-logo ${logoUrl ? "" : "fallback-only"}" data-fallback-label="${escapeHtml(fallbackLabel)}">
            ${logoUrl ? `<img loading="lazy" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(entry.teamName)} logo">` : ""}
          </span>
          <span class="reveal-set-progress-name">${escapeHtml(entry.teamShortName || entry.teamName)}</span>
        </div>
        <div class="reveal-set-progress-meta">
          <span class="reveal-set-progress-count">${currentOwned}/${entry.total}</span>
          ${progressTag ? `<span class="reveal-set-progress-tag">${escapeHtml(progressTag)}</span>` : ""}
        </div>
      </div>
      <div class="reveal-set-progress-track">
        <span class="reveal-set-progress-fill"></span>
      </div>
    </article>
  `;
}

function renderRevealSetProgress() {
  if (!revealSetProgressEl) return;
  if (activePackPreview) {
    revealSetProgressEl.hidden = true;
    revealSetProgressEl.innerHTML = "";
    return;
  }

  let entries = [];

  if (openingPack) {
    entries = (openingPack.setProgress || []).filter((entry) => entry.isVisible && entry.currentOwned > entry.beforeOwned);
    revealSetProgressEl.classList.toggle("settled", false);
  } else if (state.lastPack?.setProgress?.length) {
    entries = state.lastPack.setProgress;
    revealSetProgressEl.classList.toggle("settled", true);
  } else {
    revealSetProgressEl.classList.toggle("settled", false);
  }

  if (!entries.length) {
    revealSetProgressEl.hidden = true;
    revealSetProgressEl.innerHTML = "";
    return;
  }

  revealSetProgressEl.hidden = false;
  revealSetProgressEl.innerHTML = entries.map((entry) =>
    buildRevealSetProgressChip(entry, {
      currentOwned: openingPack ? entry.currentOwned : entry.afterOwned,
    }),
  ).join("");
}

function renderRevealDailyProgress() {
  if (!revealDailyProgressEl) return;
  if (activePackPreview) {
    revealDailyProgressEl.hidden = true;
    revealDailyProgressEl.innerHTML = "";
    return;
  }
  const entries = openingPack?.dailyProgressVisible
    ? (openingPack.dailyProgressEntries || []).filter((entry) => entry.afterProgress > entry.beforeProgress)
    : [];

  if (!entries.length) {
    revealDailyProgressEl.hidden = true;
    revealDailyProgressEl.innerHTML = "";
    return;
  }

  revealDailyProgressEl.hidden = false;
  revealDailyProgressEl.innerHTML = entries.map((entry) => {
    const progressTag = entry.completedNow ? "Pack Added" : `+${entry.increment}`;
    return `
      <article class="reveal-daily-progress-chip ${entry.completedNow ? "complete" : ""}">
        <div class="reveal-daily-progress-top">
          <span class="mini-tag success">Daily</span>
          <span class="reveal-daily-progress-count">${entry.afterProgress}/${entry.target}</span>
          <span class="reveal-daily-progress-tag">${escapeHtml(progressTag)}</span>
        </div>
        <div class="reveal-daily-progress-name">${escapeHtml(entry.title)}</div>
      </article>
    `;
  }).join("");
}

function markRevealSetProgress(teamId) {
  if (!openingPack) return;
  const entry = openingPack.setProgress?.find((item) => item.teamId === teamId);
  if (!entry) return;

  entry.currentOwned = Math.min(entry.total, entry.currentOwned + 1);
  entry.isVisible = true;
  entry.isBumping = true;
  renderRevealSetProgress();

  if (entry.bumpTimer) window.clearTimeout(entry.bumpTimer);
  const preloadId = openingPack.preloadId;
  entry.bumpTimer = window.setTimeout(() => {
    if (!openingPack || openingPack.preloadId !== preloadId) return;
    const liveEntry = openingPack.setProgress?.find((item) => item.teamId === teamId);
    if (!liveEntry) return;
    liveEntry.isBumping = false;
    liveEntry.bumpTimer = null;
    renderRevealSetProgress();
  }, 760);
}

function finishOpeningPack() {
  if (!openingPack) return;
  clearOpeningPackDailyProgressTimer(openingPack);
  const outcome = openingPack.outcome;
  openingPack = null;
  applyPackOutcome(outcome);
  if (outcome.completedTeams.length || outcome.completedCollections.length) {
    setCompletionCelebration = {
      teams: outcome.completedTeams.map((entry) => {
        const team = teamById[entry.teamId];
        return {
          ...entry,
          totalCards: cardsByTeam[entry.teamId]?.length || 0,
          colors: team?.colors || { primary: "#c89a2d", secondary: "#f3d67f" },
        };
      }),
      collections: outcome.completedCollections.map((entry) => {
        const group = collectionGroupById[entry.groupId];
        return {
          ...entry,
          totalSets: getTeamsForCollectionGroup(entry.groupId).length,
          colors: group?.colors || { primary: "#c89a2d", secondary: "#f3d67f" },
        };
      }),
      totalReward: outcome.completedTeams.reduce((sum, entry) => sum + entry.reward, 0) + outcome.completedCollections.reduce((sum, entry) => sum + entry.reward, 0),
      totalPackCount: [
        ...outcome.completedTeams,
        ...outcome.completedCollections,
      ].filter((entry) => entry.grantedPack).length,
    };
  }
  renderAll();
}

function getPendingDuplicateResults() {
  if (!state.lastPack) return [];
  return state.lastPack.results.filter((result) => !result.isNew && result.duplicateDecision !== "sold");
}

function getPendingDuplicateSaleTotal() {
  return getPendingDuplicateResults().reduce((sum, result) => sum + result.saleValue, 0);
}

function markPendingPackDuplicateSales(cardId, count, saleValue) {
  if (!state.lastPack || count <= 0) return 0;
  let remaining = count;
  let sold = 0;
  state.lastPack.results.forEach((result) => {
    if (remaining <= 0) return;
    if (result.id !== cardId || result.isNew || result.duplicateDecision === "sold") return;
    result.duplicateDecision = "sold";
    state.lastPack.duplicateCash = (state.lastPack.duplicateCash || 0) + saleValue;
    sold += 1;
    remaining -= 1;
  });
  return sold;
}

function sellStoredDuplicate(cardId, saleValue) {
  if (getStoredDuplicateCount(cardId) <= 0) return false;
  setStoredCopyCount(cardId, getStoredCopyCount(cardId) - 1);
  state.money += saleValue;
  state.totalDuplicateCash += saleValue;
  state.lifetimeEarned += saleValue;
  saveState();
  return true;
}

function sellPackDuplicate(index) {
  const result = state.lastPack?.results?.[index];
  if (!result || result.isNew || result.duplicateDecision === "sold") return;
  if (!sellStoredDuplicate(result.id, result.saleValue)) return;
  result.duplicateDecision = "sold";
  state.lastPack.duplicateCash = (state.lastPack.duplicateCash || 0) + result.saleValue;
  saveState();
  renderAll();
}

function saveAllPendingDuplicates(options = {}) {
  if (options.closeAfter) {
    closeResolvedPackFlow();
    return;
  }
  renderPackArea();
}

function sellAllPendingDuplicates(options = {}) {
  if (!state.lastPack) return;
  let soldAny = false;
  state.lastPack.results.forEach((result) => {
    if (result.isNew || result.duplicateDecision === "sold") return;
    if (!sellStoredDuplicate(result.id, result.saleValue)) return;
    result.duplicateDecision = "sold";
    state.lastPack.duplicateCash = (state.lastPack.duplicateCash || 0) + result.saleValue;
    soldAny = true;
  });
  if (soldAny) saveState();
  if (options.closeAfter) {
    closeResolvedPackFlow();
    return;
  }
  if (!soldAny) return;
  renderAll();
}

function reopenCurrentPack() {
  if (openingPack) return;
  if (activePackPreview) {
    const previewContext = getPackPreviewContext(activePackPreview);
    if (!previewContext) return;
    if (previewContext.sourceType === "saved") {
      openPack("", {
        sourceType: "saved",
        savedPackId: previewContext.pack.instanceId,
        previewIndex: previewContext.index,
      });
      return;
    }
    openPack(previewContext.pack.id, {
      sourceType: "store",
      previewIndex: previewContext.index,
    });
    return;
  }
  if (!state.lastPack) return;
  const repeatPack = packById[state.lastPack.repeatableStorePackId];
  if (!repeatPack) return;
  openPack(repeatPack.id, {
    sourceType: "store",
    previewIndex: Number.isInteger(state.lastPack.previewIndex) ? state.lastPack.previewIndex : null,
  });
}

function sellDuplicateFromCollection(cardId) {
  const card = cardCatalog.find((entry) => entry.id === cardId);
  if (!card) return;
  if (!sellStoredDuplicate(card.id, card.sellPrice)) return;
  markPendingPackDuplicateSales(card.id, 1, card.sellPrice);
  saveState();
  renderAll();
}

function sellBulkDuplicates(cards, config) {
  const snapshot = getBulkSellSnapshot(cards, config);
  if (!snapshot.totalCopies) return snapshot;

  snapshot.items.forEach(({ card, copiesToSell }) => {
    setStoredCopyCount(card.id, getStoredCopyCount(card.id) - copiesToSell);
    markPendingPackDuplicateSales(card.id, copiesToSell, card.sellPrice);
  });

  state.money += snapshot.totalValue;
  state.totalDuplicateCash += snapshot.totalValue;
  state.lifetimeEarned += snapshot.totalValue;
  saveState();
  renderAll();
  return snapshot;
}

function revealAllPackCards() {
  if (!openingPack || !openingPack.assetsReady) return;
  revealAllCardsEl.disabled = true;
  const revealButtons = [...packRevealGridEl.querySelectorAll("[data-flip-index]")].filter((button) => button.getAttribute("aria-disabled") === "false");
  revealButtons.forEach((button, index) => {
    window.setTimeout(() => {
      if (button.getAttribute("aria-disabled") === "false") {
        flipPackCard(button, Number(button.dataset.flipIndex));
      }
    }, index * 110);
  });
}

function flipPackCard(button, index) {
  if (!openingPack || !openingPack.assetsReady || openingPack.flipped[index]) return;
  const result = openingPack.outcome.results[index];
  openingPack.flipped[index] = true;
  openingPack.revealedCount += 1;
  button.setAttribute("aria-disabled", "true");
  const isPremiumReveal = button.classList.contains("premium-reveal");
  const suspenseDelay = button.classList.contains("rarity-mythic")
    ? 340
    : isPremiumReveal
      ? 220
      : 0;
  const revealDuration = button.classList.contains("showcase-reveal") ? 1180 : 860;
  const settleDelay = suspenseDelay + revealDuration;
  const shell = button.closest(".card-shell");
  const priceRevealDelay = Math.max(suspenseDelay + 260, settleDelay - 220);

  if (isPremiumReveal) {
    button.classList.add("pre-reveal-charge");
  }

  window.setTimeout(() => {
    button.classList.remove("pre-reveal-charge");
    button.classList.add("flipped", "just-flipped", "is-revealed");
    updateRevealProgress();
    if (result?.isNew) markRevealSetProgress(result.teamId);
  }, suspenseDelay);

  window.setTimeout(() => {
    if (!shell) return;
    shell.classList.add("revealed");
    const priceRow = shell.querySelector(".reveal-price");
    if (priceRow) priceRow.setAttribute("aria-hidden", "false");
  }, priceRevealDelay);

  window.setTimeout(() => {
    button.classList.remove("just-flipped");
    if (openingPack && openingPack.revealedCount === openingPack.outcome.results.length) {
      finishOpeningPack();
    }
  }, settleDelay);
}

function buyUpgrade(id) {
  if (openingPack) return;
  const upgrade = upgradesById[id];
  if (!upgrade || hasUpgrade(id)) return;
  if (!upgrade.requires.every((requiredId) => hasUpgrade(requiredId))) return;
  if (state.money < upgrade.cost) return;
  state.money -= upgrade.cost;
  state.upgrades.push(id);
  saveState();
  renderAll();
}

function earnClick() {
  if (openingPack) return;
  const value = getStats().clickValue;
  state.money += value;
  state.lifetimeEarned += value;
  state.clicks += 1;
  saveState();
  renderHud();
  renderClicker();
  renderPackSummary();
  renderPackStore();
  renderUpgrades();
  renderStats();
}

function resetGame() {
  if (!window.confirm("Reset your money, collection, and pack history?")) return;
  state = cloneDefaultState();
  activeView = "packs";
  activeCollectionGroup = null;
  activeCollectionTeam = null;
  collectionSection = "collections";
  collectionSort = "alpha";
  playerCollectionSearch = "";
  playerCollectionSort = "rating-desc";
  playerCollectionTeamFilter = [];
  playerCollectionRarityFilter = [];
  playerCollectionPositionFilter = "all";
  playerCollectionShowLocked = false;
  isPlayerFilterMenuOpen = false;
  isPlayerBulkSellOpen = false;
  isSetBulkSellOpen = false;
  bulkSellTeamFilters = [];
  bulkSellRarityFilters = [];
  bulkSellKeepCopies = 1;
  bulkSellMaxAbility = "";
  openingPack = null;
  isPackModalOpen = false;
  activePackPreview = null;
  isDailyChallengesOpen = false;
  setCompletionCelebration = null;
  dailyChallengeCelebration = null;
  achievementCelebration = null;
  isFavoriteTeamModalOpen = true;
  saveState();
  renderAll();
}

function renderHud() {
  hudGridEl.innerHTML = [
    { label: "Balance", value: formatMoney(state.money) },
  ].map((item) => `
    <article class="hud-card">
      <div class="label">${item.label}</div>
      <div class="value">${item.value}</div>
    </article>
  `).join("");
}

function getDailyRewardMeta(pack) {
  if (!pack) return "";
  const countText = `${pack.baseCards} card${pack.baseCards === 1 ? "" : "s"}`;
  return pack.guaranteedCards > 0 && pack.guaranteedMinAbility > 0
    ? `${countText} • ${pack.guaranteedMinAbility}+`
    : countText;
}

function renderDailyChallenges() {
  ensureDailyChallenges();
  if (!state.dailyChallenges) return;

  const completed = getCompletedDailyChallengeCount();
  const total = state.dailyChallenges.challenges.length;
  if (dailyChallengeProgressEl) dailyChallengeProgressEl.textContent = `${completed}/${total}`;
  if (dailyChallengeSummaryEl) dailyChallengeSummaryEl.textContent = `${completed}/${total}`;
  if (dailyChallengeTitleEl) {
    dailyChallengeTitleEl.textContent = completed === total ? "All dailies cleared." : "Today’s challenges.";
  }
  if (dailyChallengeTriggerEl) {
    dailyChallengeTriggerEl.classList.toggle("complete", completed === total);
    dailyChallengeTriggerEl.setAttribute("aria-expanded", isDailyChallengesOpen ? "true" : "false");
  }
  if (dailyChallengePanelEl) {
    dailyChallengePanelEl.hidden = !isDailyChallengesOpen;
  }
  if (dailyChallengeListEl) {
    dailyChallengeListEl.innerHTML = state.dailyChallenges.challenges.map((challenge) => `
      <article class="daily-challenge-item ${challenge.completed ? "completed" : ""}">
        <div class="daily-challenge-copy">
          <strong>${escapeHtml(challenge.title)}</strong>
          <span>${escapeHtml(challenge.rewardPack.name)} • ${escapeHtml(getDailyRewardMeta(challenge.rewardPack))}</span>
        </div>
        <div class="daily-challenge-progress">
          <strong>${challenge.progress}/${challenge.target}</strong>
          <span>${challenge.completed ? "Reward sent" : "In progress"}</span>
        </div>
      </article>
    `).join("");
  }
  if (dailyChallengeBonusEl) {
    const bonusProgress = `${completed}/${total}`;
    dailyChallengeBonusEl.classList.toggle("completed", Boolean(state.dailyChallenges.bonusGranted));
    dailyChallengeBonusEl.innerHTML = `
      <div class="daily-bonus-copy">
        <span class="eyebrow accent">Daily Bonus</span>
        <strong>Complete all three dailies</strong>
        <span>${escapeHtml(state.dailyChallenges.bonusRewardPack.name)} • ${escapeHtml(getDailyRewardMeta(state.dailyChallenges.bonusRewardPack))}</span>
      </div>
      <div class="daily-bonus-progress">
        <strong>${bonusProgress}</strong>
        <span>${state.dailyChallenges.bonusGranted ? "Bonus sent" : "Final reward"}</span>
      </div>
    `;
  }
}

function renderClicker() {
  const { clickValue } = getStats();
  const closest = getClosestTeam();
  const nextPackUpgrade = getNextPackUpgrade();
  clickerSummaryEl.innerHTML = [
    { label: "Click Power", value: "+" + formatMoney(clickValue), meta: "Instant cash per tap" },
    { label: "Collection", value: `${countOwnedCards()} / ${cardCatalog.length}`, meta: closest ? `${closest.teamName} is your closest set` : "Every set is complete" },
    { label: "Next Pack", value: nextPackUpgrade ? nextPackUpgrade.name : "All packs open", meta: nextPackUpgrade ? `${formatMoney(nextPackUpgrade.cost)} unlock cost` : "You have every pack tier" },
  ].map((item) => `
    <article class="clicker-metric">
      <div class="label">${escapeHtml(item.label)}</div>
      <div class="value">${escapeHtml(item.value)}</div>
      <div class="meta">${escapeHtml(item.meta)}</div>
    </article>
  `).join("");
  clickerValueEl.textContent = "+" + formatMoney(clickValue);
}

function renderUpgrades() {
  upgradeGridEl.innerHTML = upgradeLanes.map((lane) => `
    <section class="upgrade-lane">
      <span class="mini-tag ${lane.className}">${lane.label}</span>
      <div class="upgrade-stack">
        ${lane.upgrades.map((upgrade) => {
          const purchased = hasUpgrade(upgrade.id);
          const unlocked = upgrade.requires.every((requiredId) => hasUpgrade(requiredId));
          const canAfford = state.money >= upgrade.cost && !openingPack;
          let label = "Buy Upgrade";
          if (purchased) label = "Purchased";
          else if (!unlocked) label = "Locked";
          else if (openingPack) label = "Opening Pack";
          else if (!canAfford) label = "Need Cash";

          return `
            <article class="upgrade-node ${purchased ? "purchased" : ""} ${!purchased && !unlocked ? "locked" : ""}">
              <div class="upgrade-head">
                <div>
                  <div style="font-weight:800;">${escapeHtml(upgrade.name)}</div>
                  <div class="meta">${escapeHtml(upgrade.effectLabel)}</div>
                </div>
                <div class="upgrade-cost">${formatMoney(upgrade.cost)}</div>
              </div>
              <div class="upgrade-body">${escapeHtml(upgrade.description)}</div>
              <div class="meta">${upgrade.requires.length ? `Requires: ${upgrade.requires.map((requiredId) => escapeHtml(upgradesById[requiredId].name)).join(", ")}` : "Root upgrade"}</div>
              <button class="upgrade-btn" type="button" data-upgrade-id="${upgrade.id}" ${purchased || !unlocked || !canAfford ? "disabled" : ""}>${escapeHtml(label)}</button>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
  lastUpgradeRenderKey = getUpgradeRenderKey();
}

function renderPackSummary() {
  if (!packSummaryEl) return;
  const bestPack = [...packTypes]
    .filter((pack) => pack.guaranteedCards > 0 && pack.guaranteedMinAbility > 0)
    .sort((left, right) => right.guaranteedMinAbility - left.guaranteedMinAbility)[0];
  const latestSales = state.lastPack ? state.lastPack.duplicateCash : 0;
  packSummaryEl.innerHTML = buildPackSummaryStrip([
    { label: "Card Pool", value: String(cardCatalog.length), meta: `${teamSets.length} total sets` },
    { label: "Pack Lineup", value: String(packTypes.length), meta: "Street Pack stays free forever" },
    { label: "Top Guarantee", value: bestPack ? `${bestPack.guaranteedMinAbility}+ OVR` : "None", meta: bestPack ? bestPack.name : "No guaranteed pack" },
    { label: "Latest Sales", value: state.lastPack ? formatMoney(latestSales) : "0M", meta: "Duplicate cards sold from the latest pack" },
  ]);
}

function renderPackStore() {
  packStoreEl.innerHTML = packTypes.map((pack) => {
    const canBuy = state.money >= pack.cost && !openingPack;
    const accentSecondary = pack.accentSecondary || pack.accent;
    const guaranteeText = pack.guaranteedCards > 0 && pack.guaranteedMinAbility > 0
      ? `${pack.guaranteedCards} x ${pack.guaranteedMinAbility}+ OVR`
      : "";
    const priceText = pack.cost === 0 ? "Free" : formatMoney(pack.cost);
    const buttonLabel = openingPack ? "Opening Pack" : `Open Pack • ${priceText}`;
    return `
      <article
        class="pack-card pack-card-${pack.id}"
        style="
          --pack-accent:${pack.accent};
          --pack-accent-secondary:${accentSecondary};
          --pack-accent-soft:${withAlpha(pack.accent, 0.18)};
          --pack-accent-soft-2:${withAlpha(accentSecondary, 0.28)};
          border-color:${withAlpha(pack.accent, 0.2)};
          background:
            radial-gradient(circle at top right, ${withAlpha(accentSecondary, 0.16)}, transparent 26%),
            linear-gradient(180deg, rgba(13,21,37,0.98), rgba(9,15,28,0.94)),
            rgba(10,16,29,0.9);
        "
      >
        <div class="pack-shot ${pack.baseCards === 1 ? "single-hit" : ""}">
          <div class="pack-shot-glow"></div>
          <div class="pack-shot-top solo-row">
            <span class="pack-tier">${pack.baseCards} card${pack.baseCards === 1 ? "" : "s"}</span>
          </div>
          <div class="pack-shot-center">
            <div class="pack-emblem" aria-hidden="true">
              <div class="pack-emblem-ring"></div>
              <div class="pack-emblem-core">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="pack-emblem-card"></div>
            </div>
            <div class="pack-shot-copy">
              <div class="pack-name">${escapeHtml(pack.name)}</div>
              ${guaranteeText ? `<div class="pack-guarantee">Guaranteed ${escapeHtml(guaranteeText)}</div>` : ""}
            </div>
          </div>
        </div>
        <button class="action-btn" type="button" data-pack-id="${pack.id}" ${canBuy ? "" : "disabled"}>
          ${escapeHtml(buttonLabel)}
        </button>
      </article>
    `;
  }).join("");
  lastPackRenderKey = getPackRenderKey();
}

function buildStreetPityMeter(options = {}) {
  const streak = Math.max(0, Math.min(10, state.streetPackDryStreak || 0));
  const pityReady = streak >= 10;
  const className = options.className ? ` ${options.className}` : "";
  return `
    <div class="pack-pity-meter ${pityReady ? "ready" : ""}${className}">
      <div class="pack-pity-top">
        <span>Bad Luck Meter</span>
      </div>
      <div class="pack-pity-track" aria-hidden="true">
        ${Array.from({ length: 10 }, (_, index) => `<span class="pack-pity-dot ${index < streak ? "active" : ""}"></span>`).join("")}
      </div>
    </div>
  `;
}

function getPackPrestigeLevel(pack) {
  const floor = Number(pack?.guaranteedMinAbility || 0);
  if (pack?.poolId === "hall-of-fame" || floor >= 99) return 5;
  if (floor >= 92 || Number(pack?.baseCards || 0) >= 10) return 4;
  if (floor >= 89 || Number(pack?.baseCards || 0) >= 7) return 3;
  if (floor >= 87 || Number(pack?.baseCards || 0) >= 5) return 2;
  if (floor >= 85) return 1;
  return 0;
}

function getPackVisualInfo(pack) {
  const conference = pack?.poolType === "conference" ? collectionGroupById[pack.poolId] : null;
  const team = pack?.poolType === "team" ? teamById[pack.poolId] : null;
  const hallOfFamePack = pack?.poolId === "hall-of-fame";
  let themeClass = `pack-theme-${pack.id}`;
  let logoUrl = "";
  let fallbackLabel = "";

  if (hallOfFamePack) {
    themeClass = "pack-theme-legends-reward";
    logoUrl = HALL_OF_FAME_LOGO_URL;
    fallbackLabel = "HOF";
  } else if (team) {
    themeClass = "pack-theme-team-reward";
    logoUrl = getTeamLogoUrl(team.id);
    fallbackLabel = team.abbreviation || team.shortName?.slice(0, 3).toUpperCase() || "TEAM";
  } else if (conference) {
    themeClass = "pack-theme-collection-reward";
    fallbackLabel = (conference.shortName || conference.name).replace(/\s*Collection/i, "").slice(0, 4).toUpperCase();
  } else if (pack?.rewardSource === "achievement") {
    if (/dark matter/i.test(pack.name)) themeClass = "pack-theme-darkmatter-reward";
    else if (/legend/i.test(pack.name)) themeClass = "pack-theme-legends-reward";
    else if (/glass/i.test(pack.name)) themeClass = "pack-theme-glass-reward";
    else if (/gold/i.test(pack.name)) themeClass = "pack-theme-gold-reward";
    else themeClass = "pack-theme-achievement-reward";
  } else if (pack?.rewardSource === "daily") {
    themeClass = "pack-theme-daily-reward";
  }

  const markLabel = logoUrl
    ? ""
    : conference
      ? (conference.shortName || conference.name).replace(/\s*Collection/i, "").toUpperCase()
      : pack.id === "street"
        ? "FREE"
        : pack.id === "riser"
          ? "85+"
          : pack.id === "bench"
            ? "STACK"
            : pack.id === "spotlight"
              ? "89+"
              : pack.id === "rotation"
                ? "87+"
                : pack.id === "mega"
                  ? "92+"
                  : Number(pack?.guaranteedMinAbility || 0) > 0
                    ? `${pack.guaranteedMinAbility}+`
                    : `${pack?.baseCards || 1}`;

  const stampLabel = pack?.stamp
    || (pack?.rewardSource === "set"
      ? "Team Pack"
      : pack?.rewardSource === "collection"
        ? "Collection Pack"
        : pack?.rewardSource === "achievement"
          ? "Achievement"
          : pack?.rewardSource === "daily"
            ? "Daily Reward"
            : "Store Pack");

  return {
    themeClass,
    prestigeClass: `pack-prestige-${getPackPrestigeLevel(pack)}`,
    logoUrl,
    fallbackLabel,
    markLabel,
    stampLabel,
  };
}

function buildRewardPackShowcase(pack) {
  if (!pack) return "";
  return `
    <div class="reward-pack-showcase">
      ${buildPackCard(pack, {
        mode: "reward",
        showActionButton: false,
        enablePreview: false,
      })}
    </div>
  `;
}

function buildPackCard(pack, options = {}) {
  const mode = options.mode || "store";
  const isSaved = mode === "saved" || mode === "preview-saved";
  const isPreview = mode === "preview-store" || mode === "preview-saved";
  const enablePreview = options.enablePreview !== false && !["reward"].includes(mode);
  const canOpen = Boolean(options.canOpen);
  const showActionButton = options.showActionButton !== false;
  const previewIndex = Number.isInteger(options.previewIndex) ? options.previewIndex : -1;
  const accentSecondary = pack.accentSecondary || pack.accent;
  const visualInfo = getPackVisualInfo(pack);
  const guaranteeText = pack.guaranteedCards > 0 && pack.guaranteedMinAbility > 0
    ? `${pack.guaranteedCards} x ${pack.guaranteedMinAbility}+ OVR`
    : "";
  const priceText = pack.cost === 0 ? "Free" : formatMoney(pack.cost);
  const buttonLabel = isSaved
    ? "Open Pack"
    : openingPack
      ? "Opening Pack"
      : `Open Pack - ${priceText}`;
  const actionData = isSaved
    ? `data-saved-pack-id="${pack.instanceId}"`
    : `data-pack-id="${pack.id}"`;
  const previewData = enablePreview
    ? (isSaved
      ? `data-preview-pack-source="saved" data-preview-saved-pack-id="${pack.instanceId}" data-preview-index="${previewIndex}"`
      : `data-preview-pack-source="store" data-preview-pack-id="${pack.id}" data-preview-index="${previewIndex}"`)
    : "";
  const pityMeter = mode === "store" && pack.id === "street"
    ? buildStreetPityMeter({ className: "pack-pity-meter-shot" })
    : isPreview && !isSaved && pack.id === "street"
      ? buildStreetPityMeter({ className: "pack-pity-meter-shot" })
    : "";
  const rewardKicker = isSaved && pack.stamp
    ? `<div class="pack-origin-kicker">${escapeHtml(pack.stamp)}</div>`
    : "";
  return `
    <article
      class="pack-card pack-card-${pack.id} ${visualInfo.themeClass} ${visualInfo.prestigeClass} ${isSaved ? "saved-pack-card" : ""} ${isPreview ? "pack-preview-card tilt-pack" : ""}"
      ${previewData}
      style="
        --pack-accent:${pack.accent};
        --pack-accent-secondary:${accentSecondary};
        --pack-accent-soft:${withAlpha(pack.accent, 0.18)};
        --pack-accent-soft-2:${withAlpha(accentSecondary, 0.28)};
        border-color:${withAlpha(pack.accent, 0.2)};
        background:
          radial-gradient(circle at top right, ${withAlpha(accentSecondary, 0.16)}, transparent 26%),
          linear-gradient(180deg, rgba(13,21,37,0.98), rgba(9,15,28,0.94)),
          rgba(10,16,29,0.9);
      "
    >
      <div class="pack-shot ${pack.baseCards === 1 ? "single-hit" : ""}">
        <div class="pack-shot-glow"></div>
        ${visualInfo.logoUrl || visualInfo.markLabel ? `
          <div class="pack-shot-brand-watermark ${visualInfo.logoUrl ? "has-logo" : "text-only"}">
            ${visualInfo.logoUrl
              ? `<img loading="lazy" decoding="async" src="${escapeHtml(visualInfo.logoUrl)}" alt="${escapeHtml(pack.rewardLabel || pack.name)} mark">`
              : `<span>${escapeHtml(visualInfo.markLabel)}</span>`}
          </div>
        ` : ""}
        <div class="pack-shot-top">
          <span class="pack-series">${escapeHtml(visualInfo.stampLabel)}</span>
          <span class="pack-tier">${pack.baseCards} card${pack.baseCards === 1 ? "" : "s"}</span>
        </div>
        <div class="pack-shot-center">
          <div class="pack-emblem" aria-hidden="true">
            <div class="pack-emblem-ring"></div>
            <div class="pack-emblem-core ${visualInfo.logoUrl ? "has-logo" : visualInfo.markLabel ? "is-mark" : ""}">
              ${visualInfo.logoUrl
                ? `<img class="pack-emblem-logo" loading="lazy" decoding="async" src="${escapeHtml(visualInfo.logoUrl)}" alt="${escapeHtml(pack.rewardLabel || pack.name)} logo">`
                : visualInfo.markLabel
                  ? `<span class="pack-emblem-mark">${escapeHtml(visualInfo.markLabel)}</span>`
                  : `<span></span><span></span><span></span><span></span>`}
            </div>
            <div class="pack-emblem-card"></div>
          </div>
          <div class="pack-shot-copy">
            ${rewardKicker}
            <div class="pack-name">${escapeHtml(pack.name)}</div>
            ${guaranteeText ? `<div class="pack-guarantee">Guaranteed ${escapeHtml(guaranteeText)}</div>` : ""}
          </div>
        </div>
        ${pityMeter ? `<div class="pack-shot-bottom">${pityMeter}</div>` : ""}
      </div>
      ${showActionButton ? `
      <button class="action-btn hold-action-btn ${isSaved ? "saved-pack-open" : ""}" type="button" ${actionData} ${canOpen ? "" : "disabled"}>
        ${escapeHtml(buttonLabel)}
      </button>
      ` : ""}
    </article>
  `;
}

function renderPackStore() {
  if (packModeTabsEl) {
    packModeTabsEl.querySelectorAll("[data-pack-section]").forEach((button) => {
      button.classList.toggle("active", button.dataset.packSection === activePackSection);
    });
  }
  if (storePacksSectionEl) {
    storePacksSectionEl.hidden = activePackSection !== "store";
  }

  packStoreEl.innerHTML = packTypes.map((pack) => buildPackCard(pack, {
    mode: "store",
    canOpen: state.money >= pack.cost && !openingPack,
    previewIndex: packTypes.findIndex((entry) => entry.id === pack.id),
  })).join("");

  if (myPackStoreEl && myPacksSectionEl) {
    const sortedSavedPacks = getSortedSavedPacks();
    myPacksSectionEl.hidden = activePackSection !== "inventory";
    myPackStoreEl.innerHTML = sortedSavedPacks.length
      ? sortedSavedPacks.map((pack, index) => buildPackCard(pack, {
          mode: "saved",
          canOpen: !openingPack,
          previewIndex: index,
        })).join("")
      : `
        <div class="pack-empty-state">
          <h3>No saved packs yet.</h3>
          <p>Complete sets and collections to earn custom reward packs here.</p>
        </div>
      `;
  }

  lastPackRenderKey = getPackRenderKey();
}

function buildPlayerArt(card, options = {}) {
  const lazy = options.lazy !== false;
  const overlayStart = options.overlayStart || "";
  const overlayEnd = options.overlayEnd || "";
  const overlayBottomEnd = options.overlayBottomEnd || "";
  const logoUrl = getTeamLogoUrl(card.teamId);
  const artGradientEnd = getTeamArtGradientEnd(card.teamColors.primary);
  const imageStyles = [];
  if (card.imagePosition) imageStyles.push(`object-position:${escapeHtml(card.imagePosition)}`);
  if (card.imageScale && Math.abs(card.imageScale - 1) > 0.001) imageStyles.push(`transform:scale(${card.imageScale.toFixed(3)})`);
  return `
    <div
      class="player-art"
      style="--team-primary:${card.teamColors.primary}; --team-secondary:${card.teamColors.secondary}; --team-art-end:${artGradientEnd}; --rarity-line:${normalizeColor(card.rarityColor)}; --rarity-tint:${withAlpha(card.rarityColor, 0.22)}; --team-logo:${logoUrl ? `url('${escapeHtml(logoUrl)}')` : "none"};"
    >
      ${overlayStart ? `<div class="player-art-overlay start">${overlayStart}</div>` : ""}
      ${overlayEnd ? `<div class="player-art-overlay end">${overlayEnd}</div>` : ""}
      ${overlayBottomEnd ? `<div class="player-art-overlay bottom-end">${overlayBottomEnd}</div>` : ""}
      <div class="player-art-core">
        <div class="player-art-bg"></div>
        <div class="player-art-fallback" aria-hidden="true"></div>
        <img data-player-image loading="${lazy ? "lazy" : "eager"}" fetchpriority="${lazy ? "auto" : "high"}" decoding="async" src="${escapeHtml(card.image)}" alt="${escapeHtml(card.name)}"${imageStyles.length ? ` style="${imageStyles.join(";")}"` : ""}>
      </div>
    </div>
  `;
}

function buildTeamBrand(card, options = {}) {
  const logoUrl = getTeamLogoUrl(card.teamId);
  const fallbackLabel = card.teamId === "hall-of-fame" ? "HOF" : card.teamAbbreviation;
  const lazy = options.lazy !== false;
  return `
    <div class="card-team-line">
      <div class="card-team-mark ${logoUrl ? "" : "fallback-only"}" data-fallback-label="${escapeHtml(fallbackLabel)}" style="--team-primary:${escapeHtml(card.teamColors.primary)}; --team-secondary:${escapeHtml(card.teamColors.secondary)};">
        ${logoUrl ? `<img class="card-team-logo" data-team-logo loading="${lazy ? "lazy" : "eager"}" fetchpriority="${lazy ? "auto" : "high"}" decoding="async" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(card.teamName)} logo">` : ""}
      </div>
      <div class="card-team-name">${escapeHtml(card.teamName)}</div>
    </div>
  `;
}

let rarityFrameSequence = 0;
const RARITY_FRAME_LOOP_LENGTH = 446;
const RARITY_FRAME_PATH_LENGTH = RARITY_FRAME_LOOP_LENGTH * 2;
const RARITY_FRAME_TAG_CHAR_WIDTH = 2.05;
const RARITY_FRAME_TAG_GAP = 16;
const RARITY_FRAME_LOOP_SECONDS = 20;
const RARITY_FRAME_PATH_D = "M11 2.25 H89 Q97.75 2.25 97.75 11 V129 Q97.75 137.75 89 137.75 H11 Q2.25 137.75 2.25 129 V11 Q2.25 2.25 11 2.25 Z";
const RARITY_FRAME_DOUBLE_PATH_D = `${RARITY_FRAME_PATH_D} ${RARITY_FRAME_PATH_D}`;

function getRarityFrameSlotCount(label) {
  const slotWidth = Math.max(24, (label.length * RARITY_FRAME_TAG_CHAR_WIDTH) + RARITY_FRAME_TAG_GAP);
  return Math.max(10, Math.floor(RARITY_FRAME_LOOP_LENGTH / slotWidth));
}

function buildRarityFrame(label) {
  const text = label.toUpperCase();
  const slotCount = getRarityFrameSlotCount(text);
  const slotSize = RARITY_FRAME_LOOP_LENGTH / slotCount;
  const frameId = `rarity-frame-${++rarityFrameSequence}`;
  const labels = Array.from({ length: slotCount }, (_, index) => {
    const baseOffset = ((index + 0.5) * slotSize).toFixed(3);
    return `
      <text class="card-rarity-text" text-anchor="middle">
        <textPath
          class="card-rarity-text-path"
          href="#${frameId}"
          startOffset="${baseOffset}"
          data-base-offset="${baseOffset}"
        >${escapeHtml(text)}</textPath>
      </text>
    `;
  }).join("");
  return `
    <div class="card-rarity-frame" data-rarity-frame-cycle="${RARITY_FRAME_LOOP_LENGTH.toFixed(3)}" aria-hidden="true">
      <svg class="card-rarity-svg" viewBox="0 0 100 140" preserveAspectRatio="none" focusable="false">
        <path class="card-rarity-border" pathLength="${RARITY_FRAME_PATH_LENGTH}" d="${RARITY_FRAME_DOUBLE_PATH_D}"></path>
        <path id="${frameId}" class="card-rarity-path" pathLength="${RARITY_FRAME_PATH_LENGTH}" d="${RARITY_FRAME_DOUBLE_PATH_D}"></path>
        ${labels}
      </svg>
    </div>
  `;
}

function buildCollectionSummaryStrip(items) {
  return items.map((item) => `
    <article class="collection-stat-chip">
      <span class="label">${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <span class="meta">${escapeHtml(item.meta)}</span>
    </article>
  `).join("");
}

function buildPackSummaryStrip(items) {
  return items.map((item) => `
    <article class="pack-summary-chip">
      <span class="label">${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <span class="meta">${escapeHtml(item.meta)}</span>
    </article>
  `).join("");
}

function getRarityShellGlowOpacity(rarityId, options = {}) {
  const { missing = false, interactive = false } = options;
  if (missing) return 0.1;
  const baseByRarity = {
    silver: 0.16,
    gold: 0.22,
    diamond: 0.28,
    mythic: 0.36,
    blackmatter: 0.42,
    legends: 0.34,
    common: 0.16,
    uncommon: 0.18,
    rare: 0.2,
    epic: 0.24,
    legendary: 0.3,
  };
  return (baseByRarity[rarityId] || 0.18) + (interactive ? 0.04 : 0);
}

function getPackIdleGlowOpacity(rarityId) {
  const opacityByRarity = {
    silver: 0.14,
    gold: 0.22,
    diamond: 0.28,
    mythic: 0.36,
    blackmatter: 0.44,
    legends: 0.32,
    common: 0.14,
    uncommon: 0.16,
    rare: 0.18,
    epic: 0.24,
    legendary: 0.3,
  };
  return opacityByRarity[rarityId] || 0.16;
}

function getPackHoverGlowOpacity(rarityId) {
  const opacityByRarity = {
    silver: 0.24,
    gold: 0.38,
    diamond: 0.5,
    mythic: 0.66,
    blackmatter: 0.78,
    legends: 0.62,
    common: 0.24,
    uncommon: 0.28,
    rare: 0.34,
    epic: 0.44,
    legendary: 0.56,
  };
  return opacityByRarity[rarityId] || 0.28;
}

function buildCardFace(result, options = {}) {
  const collectionMode = options.collectionMode || false;
  const owned = options.owned || false;
  const isMissing = collectionMode && !owned;
  const inlineFace = options.inlineFace || false;
  const showCollectionStatus = options.showCollectionStatus !== false;
  const footerHtml = options.footerHtml || "";
  const hideFooter = options.hideFooter || false;
  const previewable = options.previewable !== false;
  const tiltEnabled = options.tiltEnabled === true;
  const shellClass = options.shellClass || "";
  const storedCopies = getStoredCopyCount(result.id);
  const topStatus = collectionMode
    ? showCollectionStatus
      ? !owned
        ? `<span class="status-pill duplicate">Need</span>`
        : storedCopies > 1
          ? `<span class="status-pill copy-count">${escapeHtml(`${storedCopies}x`)}</span>`
          : ""
      : ""
    : result.isNew
      ? `<span class="status-pill new">New</span>`
      : storedCopies > 1
        ? `<span class="status-pill copy-count">${escapeHtml(`${storedCopies}x`)}</span>`
        : "";
  const visualRarityId = result.displayRarityId || result.rarityId;
  const visualRarityLabel = result.displayRarityLabel || result.rarityLabel;
  const visualRarityColor = result.displayRarityColor || result.rarityColor;
  const isBlackMatter = result.rarityId === "blackmatter";
  const rarityColor = isMissing
    ? "#d3dbe6"
    : isBlackMatter
      ? "#040609"
      : normalizeColor(visualRarityColor);
  const rarityTint = isMissing
    ? "rgba(208, 216, 228, 0.08)"
    : isBlackMatter
      ? "rgba(8, 10, 15, 0.72)"
      : withAlpha(visualRarityColor, 0.22);
  const rarityGlow = isMissing
    ? "rgba(214, 222, 234, 0.18)"
    : isBlackMatter
      ? "rgba(232, 238, 255, 0.22)"
      : withAlpha(visualRarityColor, 0.32);
  const cardPrice = formatMoney(collectionMode ? result.sellPrice : result.isNew ? result.sellPrice : result.saleValue);
  const positionLabel = getPrimaryPosition(result.position);
  const cardThemeSource = visualRarityId === "diamond"
    ? mixColor(result.teamColors.primary, "#eff8ff", 0.2)
    : visualRarityColor;
  const cardTheme = isBlackMatter
    ? {
        text: "#f4f8ff",
        subtext: "rgba(224, 232, 248, 0.82)",
        panel: "rgba(5, 7, 10, 0.18)",
        panelBorder: "rgba(255, 255, 255, 0.08)",
        badge: "rgba(7, 12, 18, 0.24)",
        badgeBorder: "rgba(255, 255, 255, 0.12)",
      }
    : isMissing
      ? {
          text: "#dfe7f2",
          subtext: "rgba(214, 223, 236, 0.72)",
          panel: "rgba(198, 206, 219, 0.12)",
          panelBorder: "rgba(222, 229, 238, 0.12)",
          badge: "rgba(214, 221, 233, 0.12)",
          badgeBorder: "rgba(230, 236, 245, 0.14)",
        }
      : getCardTheme(cardThemeSource);
  const raritySurfaceClass = `rarity-card-${visualRarityId}`;
  const isGlassShowcase = result.glassShowcase === true && visualRarityId === "diamond" && result.rarityId !== "blackmatter" && result.rarityId !== "legends";
  const variantCardClass = result.rarityId === "legends"
    ? "legend-card"
    : result.rarityId === "blackmatter"
      ? "blackmatter-card"
      : isGlassShowcase
        ? "glass-showcase-card"
        : "";
  const shellGlowOpacity = getRarityShellGlowOpacity(visualRarityId, {
    missing: isMissing,
  });
  const shouldShowRating = result.visibleAbility != null;
  const ratingValue = isMissing ? "?" : escapeHtml(String(result.visibleAbility ?? result.ability));
  const ratingBadge = shouldShowRating ? `
    <div class="rating-badge">
      <strong>${ratingValue}</strong>
      <span>OVR</span>
    </div>
  ` : "";

  const faceMarkup = `
    <div
      class="${collectionMode ? "collection-card" : "reveal-card"} ${inlineFace ? "" : tiltEnabled ? "tilt-card" : ""} ${raritySurfaceClass} ${variantCardClass} ${isMissing ? "missing" : ""}"
      ${previewable ? `data-preview-card-id="${escapeHtml(result.id)}" data-preview-collection-mode="${collectionMode ? "true" : "false"}" data-preview-owned="${owned ? "true" : "false"}"` : ""}
      style="--team-primary:${escapeHtml(result.teamColors.primary)}; --team-secondary:${escapeHtml(result.teamColors.secondary)}; --team-art-end:${getTeamArtGradientEnd(result.teamColors.primary)}; --rarity-line:${rarityColor}; --rarity-tint:${rarityTint}; --rarity-glow:${rarityGlow}; --card-text:${cardTheme.text}; --card-subtext:${cardTheme.subtext}; --card-panel:${cardTheme.panel}; --card-panel-border:${cardTheme.panelBorder}; --card-badge:${cardTheme.badge}; --card-badge-border:${cardTheme.badgeBorder}; --card-pattern-text:${isMissing ? "rgba(224, 230, 238, 0.9)" : isBlackMatter ? "rgba(247, 250, 255, 0.94)" : withAlpha(cardTheme.text, 0.8)}; --card-pattern-bg:${isMissing ? "rgba(214, 221, 231, 0.06)" : isBlackMatter ? "rgba(255, 255, 255, 0.04)" : withAlpha(visualRarityColor, 0.18)}; --card-pattern-line:${isMissing ? "rgba(208, 216, 228, 0.2)" : isBlackMatter ? "rgba(255, 255, 255, 0.12)" : withAlpha(visualRarityColor, 0.34)};"
    >
      ${buildRarityFrame(isMissing ? "Locked" : visualRarityLabel)}
      ${buildPlayerArt(result, { lazy: collectionMode, overlayStart: ratingBadge, overlayEnd: topStatus })}
      <div class="card-body">
        ${buildTeamBrand(result, { lazy: collectionMode })}
        <h4 class="player-name">${escapeHtml(result.name)}</h4>
        <div class="card-detail-row">
          <span class="position-pill"><span class="detail-pill-label">Pos</span>${escapeHtml(positionLabel)}</span>
          <span class="jersey-pill"><span class="detail-pill-label">No</span>${escapeHtml(result.jersey)}</span>
          <span class="value-pill"><span class="detail-pill-label">Val</span>${escapeHtml(cardPrice)}</span>
        </div>
      </div>
    </div>
  `;

  if (inlineFace) return faceMarkup;
  const shouldRenderActionRow = !hideFooter && Boolean(footerHtml);
  const shellStyle = `--rarity-line:${rarityColor}; --rarity-glow:${rarityGlow}; --card-shell-glow-opacity:${shellGlowOpacity};`;

  return `
    <div class="card-shell ${shellClass}" style="${shellStyle}">
      ${faceMarkup}
      ${shouldRenderActionRow ? `<div class="card-action-row">${footerHtml}</div>` : ""}
    </div>
  `;
}

function buildPackDuplicateFooter(result, index) {
  if (result.isNew) return "";
  if (result.duplicateDecision === "sold") {
    return `
      <div class="card-action-buttons pack-card-actions">
        <span class="mini-action-note sold">Sold</span>
      </div>
    `;
  }
  return `
    <div class="card-action-buttons pack-card-actions">
      <button type="button" class="secondary-btn mini-action-btn sell" data-pack-duplicate-sell="${index}">Sell</button>
    </div>
  `;
}

function buildStaticValueFooter(value) {
  return "";
}

function buildCollectionCardFooter(card, options = {}) {
  const allowSell = options.allowSell !== false;
  const duplicates = getStoredDuplicateCount(card.id);
  if (duplicates <= 0 || !allowSell) return "";
  return `
    <div class="card-action-buttons collection-card-actions">
      <button type="button" class="secondary-btn mini-action-btn sell" data-sell-duplicate-card="${escapeHtml(card.id)}">Sell</button>
    </div>
  `;
}

function buildInteractiveRevealCard(result, index, flipped, assetsReady = true) {
  const visualRarityId = result.displayRarityId || result.rarityId;
  const visualRarityColor = result.displayRarityColor || result.rarityColor;
  const rarityClass = `rarity-${visualRarityId}`;
  const showcaseClass = visualRarityId === "diamond" || result.rarityId === "legends" || result.rarityId === "blackmatter" ? "showcase-reveal" : "";
  const premiumRevealClass = visualRarityId === "diamond" || result.rarityId === "blackmatter" ? "premium-reveal" : "";
  const packAura = result.rarityId === "blackmatter"
      ? "rgba(242, 247, 255, 0.98)"
    : result.rarityId === "legends"
      ? "rgba(255, 236, 188, 0.98)"
      : visualRarityId === "diamond"
        ? withAlpha(visualRarityColor, 0.9)
        : visualRarityId === "gold"
          ? withAlpha(visualRarityColor, 0.62)
          : withAlpha(visualRarityColor, 0.42);
  const shellGlowOpacity = getRarityShellGlowOpacity(visualRarityId, { interactive: true });
  const idlePackGlowOpacity = getPackIdleGlowOpacity(visualRarityId);
  const hoverPackGlowOpacity = getPackHoverGlowOpacity(visualRarityId);
  return `
    <div class="card-shell interactive-card-shell ${flipped ? "revealed" : ""}" style="--rarity-line:${normalizeColor(visualRarityColor)}; --rarity-glow:${withAlpha(visualRarityColor, 0.42)}; --pack-aura:${packAura}; --card-shell-glow-opacity:${shellGlowOpacity};">
    <button
      type="button"
      class="flip-card pack-entry ${rarityClass} ${showcaseClass} ${premiumRevealClass} ${assetsReady ? "" : "assets-pending"} ${flipped ? "flipped is-revealed" : ""}"
      data-flip-index="${index}"
      aria-label="Reveal card ${index + 1}"
      aria-disabled="${assetsReady && !flipped ? "false" : "true"}"
      style="--card-index:${index}; --rarity-line:${normalizeColor(visualRarityColor)}; --rarity-glow:${withAlpha(visualRarityColor, 0.42)}; --rarity-tint:${withAlpha(visualRarityColor, 0.26)}; --pack-aura:${packAura}; --idle-pack-glow-opacity:${idlePackGlowOpacity}; --hover-pack-glow-opacity:${hoverPackGlowOpacity};"
    >
      <div class="flip-card-inner">
        <div class="flip-face flip-back">
          <div>
            <div class="card-back-mark">?</div>
          </div>
        </div>
        <div class="flip-face flip-front">
          ${buildCardFace(result, { inlineFace: true })}
        </div>
      </div>
    </button>
  </div>
  `;
}

function buildPackPreviewStage(pack, sourceType, previewIndex = 0) {
  const canOpen = sourceType === "saved" ? !openingPack : state.money >= pack.cost && !openingPack;
  const mode = sourceType === "saved" ? "preview-saved" : "preview-store";
  return `
    <div class="pack-preview-stage-shell">
      ${buildPackCard(pack, {
        mode,
        canOpen,
        previewIndex,
        showActionButton: false,
      })}
    </div>
  `;
}

function renderPackArea() {
  const previewContext = !openingPack ? getPackPreviewContext() : null;
  const isPreviewMode = Boolean(activePackPreview && previewContext);
  const hasRevealContent = Boolean(openingPack || state.lastPack || previewContext);
  packModalEl.hidden = !isPackModalOpen || !hasRevealContent;
  packRevealGridEl.classList.toggle("pack-preview-mode", isPreviewMode);
  closePackModalEl.disabled = Boolean(openingPack);
  closePackModalEl.textContent = openingPack ? "Finish Reveal First" : "Close";
  revealAllCardsEl.hidden = !openingPack;
  revealAllCardsEl.disabled = !openingPack || !openingPack.assetsReady || openingPack.revealedCount === openingPack.outcome.results.length;
  const pendingDuplicates = getPendingDuplicateResults();
  const hasPendingDuplicates = pendingDuplicates.length > 0;
  openAnotherPackEl.hidden = Boolean(openingPack) || (!isPreviewMode && !state.lastPack?.repeatableStorePackId);
  if (isPreviewMode && previewContext) {
    const previewCanOpen = previewContext.sourceType === "saved"
      ? true
      : state.money >= previewContext.pack.cost;
    openAnotherPackEl.disabled = !previewCanOpen;
    openAnotherPackEl.innerHTML = previewContext.sourceType === "saved"
      ? "Open Pack"
      : `Open New Pack <span class="repeat-pack-cost">${previewContext.pack.cost === 0 ? "Free" : formatMoney(previewContext.pack.cost)}</span>`;
  } else if (!openingPack && state.lastPack) {
    const repeatPack = packById[state.lastPack.repeatableStorePackId];
    const canRepeatPack = Boolean(repeatPack) && state.money >= repeatPack.cost;
    openAnotherPackEl.disabled = !canRepeatPack;
    openAnotherPackEl.innerHTML = repeatPack
      ? `Open New Pack <span class="repeat-pack-cost">${repeatPack.cost === 0 ? "Free" : formatMoney(repeatPack.cost)}</span>`
      : "Open New Pack";
  } else {
    openAnotherPackEl.disabled = true;
    openAnotherPackEl.textContent = "Open New Pack";
  }
  const modalStreetPackActive = openingPack?.packId === "street" && openingPack?.outcome?.packSourceType === "store";
  const modalStreetPackResolved = !isPreviewMode && state.lastPack?.repeatableStorePackId === "street" && state.lastPack?.packSourceType === "store";
  const modalStreetPackPreview = isPreviewMode && previewContext?.sourceType === "store" && previewContext.pack.id === "street";
  if (modalPackMetaEl) {
    modalPackMetaEl.innerHTML = (modalStreetPackActive || modalStreetPackResolved || modalStreetPackPreview)
      ? buildStreetPityMeter({ className: "pack-pity-meter-modal" })
      : "";
    modalPackMetaEl.hidden = !(modalStreetPackActive || modalStreetPackResolved || modalStreetPackPreview);
  }
  if (modalBottomActionsEl) {
    modalBottomActionsEl.classList.toggle(
      "preview-open-mode",
      !openingPack && !openAnotherPackEl.hidden && revealAllCardsEl.hidden,
    );
    modalBottomActionsEl.hidden = revealAllCardsEl.hidden && openAnotherPackEl.hidden && (!modalPackMetaEl || modalPackMetaEl.hidden);
  }
  sellAllDuplicatesEl.hidden = Boolean(openingPack) || isPreviewMode || !hasPendingDuplicates;
  sellAllDuplicatesEl.disabled = !hasPendingDuplicates;
  if (packModalPrevEl && packModalNextEl) {
    const showNav = !openingPack && Boolean(previewContext);
    packModalPrevEl.hidden = !showNav;
    packModalNextEl.hidden = !showNav;
    if (showNav && previewContext) {
      if (previewContext.sourceType === "saved") {
        const disabled = previewContext.items.length <= 1;
        packModalPrevEl.disabled = disabled;
        packModalNextEl.disabled = disabled;
      } else {
        packModalPrevEl.disabled = previewContext.index <= 0;
        packModalNextEl.disabled = previewContext.index >= previewContext.items.length - 1;
      }
    }
  }
  if (packModalEl.hidden) {
    renderRevealSetProgress();
    renderRevealDailyProgress();
    return;
  }

  if (openingPack) {
    revealTitleEl.textContent = `Opening ${openingPack.packName}`;
    revealSubtitleEl.textContent = openingPack.assetsReady
      ? "Hover a card to sense its rarity glow, then click each card to flip it."
      : "Loading player cards first so each reveal is instant.";
    revealProgressEl.textContent = `${openingPack.revealedCount} / ${openingPack.outcome.results.length} Revealed`;
    packRevealGridEl.classList.toggle("loading-assets", !openingPack.assetsReady);
    packRevealGridEl.innerHTML = openingPack.outcome.results.map((result, index) => buildInteractiveRevealCard(result, index, openingPack.flipped[index], openingPack.assetsReady)).join("");
    packRevealGridEl.querySelectorAll("[data-flip-index]").forEach((button) => {
      button.addEventListener("click", () => flipPackCard(button, Number(button.dataset.flipIndex)));
    });
    renderRevealSetProgress();
    renderRevealDailyProgress();
    return;
  }

  if (isPreviewMode && previewContext) {
    revealTitleEl.textContent = `${previewContext.pack.name} Preview`;
    revealSubtitleEl.textContent = previewContext.sourceType === "saved"
      ? "Browse your saved packs with the side arrows, then open one when ready."
      : "Browse store packs with the side arrows, then open one when ready.";
    revealProgressEl.textContent = previewContext.sourceType === "saved"
      ? `My Packs ${previewContext.index + 1}/${previewContext.items.length}`
      : `Store ${previewContext.index + 1}/${previewContext.items.length}`;
    packRevealGridEl.classList.remove("loading-assets");
    packRevealGridEl.innerHTML = buildPackPreviewStage(previewContext.pack, previewContext.sourceType, previewContext.index);
    renderRevealSetProgress();
    renderRevealDailyProgress();
    return;
  }

  packRevealGridEl.classList.remove("loading-assets");
  const lastPack = state.lastPack;
  const newCards = lastPack.results.filter((result) => result.isNew).length;
  const duplicates = lastPack.results.length - newCards;
  const pendingDuplicateCount = getPendingDuplicateResults().length;
  const completedSetText = lastPack.completedTeams.length ? ` Completed sets: ${lastPack.completedTeams.map((entry) => entry.teamName).join(", ")}.` : "";
  const completedCollectionText = lastPack.completedCollections?.length ? ` Completed collections: ${lastPack.completedCollections.map((entry) => entry.groupName).join(", ")}.` : "";
  revealTitleEl.textContent = `${lastPack.packName} Complete`;
  revealSubtitleEl.textContent = `All cards revealed. ${newCards} new, ${duplicates} duplicate.${pendingDuplicateCount ? ` ${pendingDuplicateCount} duplicate cards can still be sold.` : ""}${completedSetText}${completedCollectionText}`;
  revealProgressEl.textContent = `${lastPack.results.length} / ${lastPack.results.length} Revealed`;
  packRevealGridEl.innerHTML = lastPack.results.map((result, index) => buildCardFace(result, {
    footerHtml: buildPackDuplicateFooter(result, index),
  })).join("");
  renderRevealSetProgress();
  renderRevealDailyProgress();
}

function renderSetCompletionModal() {
  if (!setCompletionModalEl) return;
  const celebration = setCompletionCelebration;
  setCompletionModalEl.hidden = !celebration;
  if (!celebration) {
    setCompletionGridEl.innerHTML = "";
    return;
  }

  const teamCount = celebration.teams.length;
  const collectionCount = celebration.collections?.length || 0;
  const totalCompleteCount = teamCount + collectionCount;
  setCompletionEyebrowEl.textContent = totalCompleteCount > 1 ? "Completion Rewards" : collectionCount ? "Collection Complete" : "Set Complete";
  setCompletionTitleEl.textContent = totalCompleteCount > 1
    ? `${totalCompleteCount} Completions Rewarded`
    : collectionCount
      ? `${celebration.collections[0].groupName} Completed`
      : `${celebration.teams[0].teamName} Completed`;
  setCompletionSubtitleEl.textContent = "Massive pull. Completion cash and saved reward packs have been added to your club.";
  const rewardLabelParts = [];
  if (celebration.totalReward > 0) rewardLabelParts.push(`${formatMoney(celebration.totalReward)} Added`);
  if (celebration.totalPackCount > 0) rewardLabelParts.push(`${celebration.totalPackCount} Pack${celebration.totalPackCount === 1 ? "" : "s"}`);
  setCompletionRewardEl.textContent = rewardLabelParts.join(" + ") || "Rewards Added";

  const teamCards = celebration.teams.map((entry) => {
    const team = teamById[entry.teamId];
    const logoUrl = getTeamLogoUrl(entry.teamId);
    const fallbackLabel = entry.teamId === "hall-of-fame"
      ? "HOF"
      : (team?.abbreviation || entry.teamName.slice(0, 3)).toUpperCase();
    return `
      <article
        class="completion-team-card"
        style="--team-primary:${entry.colors.primary}; --team-secondary:${entry.colors.secondary};"
      >
        <div class="completion-team-top">
          <div class="completion-team-brand ${logoUrl ? "" : "fallback-only"}" data-fallback-label="${escapeHtml(fallbackLabel)}">
            ${logoUrl ? `<img loading="lazy" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(entry.teamName)} logo">` : ""}
          </div>
          <div class="completion-team-copy">
            <span class="eyebrow accent">Set Complete</span>
            <h4>${escapeHtml(entry.teamName)}</h4>
            <div class="completion-team-meta">${entry.totalCards}/${entry.totalCards} cards collected</div>
          </div>
          <div class="completion-team-reward">${formatMoney(entry.reward)}</div>
        </div>
        <div class="completion-team-stats">
          <span class="completion-team-stat">Cash Added</span>
          <span class="completion-team-stat">${formatMoney(entry.reward)}</span>
        </div>
        ${buildRewardPackShowcase(entry.rewardPack)}
      </article>
    `;
  });

  const collectionCards = (celebration.collections || []).map((entry) => `
    <article
      class="completion-team-card"
      style="--team-primary:${entry.colors.primary}; --team-secondary:${entry.colors.secondary};"
    >
      <div class="completion-team-top">
        <div class="completion-team-brand fallback-only" data-fallback-label="${escapeHtml((entry.groupName || "COL").replace(" Collection", "").toUpperCase())}"></div>
        <div class="completion-team-copy">
          <span class="eyebrow accent">Collection Complete</span>
          <h4>${escapeHtml(entry.groupName)}</h4>
          <div class="completion-team-meta">${entry.totalSets}/${entry.totalSets} sets completed</div>
        </div>
        <div class="completion-team-reward">${formatMoney(entry.reward)}</div>
      </div>
      <div class="completion-team-stats">
        <span class="completion-team-stat">Cash Added</span>
        <span class="completion-team-stat">${formatMoney(entry.reward)}</span>
      </div>
      ${buildRewardPackShowcase(entry.rewardPack)}
    </article>
  `);

  setCompletionGridEl.innerHTML = [...teamCards, ...collectionCards].join("");
}

function renderDailyRewardModal() {
  if (!dailyRewardModalEl) return;
  const celebration = dailyChallengeCelebration;
  dailyRewardModalEl.hidden = !celebration;
  if (!celebration) {
    if (dailyRewardListEl) dailyRewardListEl.innerHTML = "";
    return;
  }

  const rewardCount = celebration.rewards.length;
  const bonusCount = celebration.rewards.filter((entry) => entry.type === "bonus").length;
  if (dailyRewardEyebrowEl) {
    dailyRewardEyebrowEl.textContent = bonusCount ? "Daily Bonus" : "Daily Challenge";
  }
  if (dailyRewardTitleEl) {
    dailyRewardTitleEl.textContent = bonusCount
      ? "Daily rewards completed"
      : rewardCount > 1
        ? `${rewardCount} daily rewards claimed`
        : "Daily reward claimed";
  }
  if (dailyRewardSubtitleEl) {
    dailyRewardSubtitleEl.textContent = "Reward packs have been added to My Packs.";
  }
  if (dailyRewardSummaryEl) {
    dailyRewardSummaryEl.textContent = `${rewardCount} Reward${rewardCount === 1 ? "" : "s"}`;
  }
  if (dailyRewardListEl) {
    dailyRewardListEl.innerHTML = celebration.rewards.map((entry) => `
      <article class="daily-reward-item ${entry.type === "bonus" ? "bonus" : ""}">
        <div class="daily-reward-copy">
          <span class="eyebrow accent">${entry.type === "bonus" ? "Daily Bonus" : "Challenge Complete"}</span>
          <strong>${escapeHtml(entry.title)}</strong>
          <span>${escapeHtml(entry.rewardPack.name)} • ${escapeHtml(getDailyRewardMeta(entry.rewardPack))}</span>
        </div>
      </article>
    `).join("");
  }
}

function renderDailyRewardModal() {
  if (!dailyRewardModalEl) return;
  const celebration = dailyChallengeCelebration;
  dailyRewardModalEl.hidden = !celebration;
  if (!celebration) {
    if (dailyRewardListEl) dailyRewardListEl.innerHTML = "";
    return;
  }

  const rewardCount = celebration.rewards.length;
  const bonusCount = celebration.rewards.filter((entry) => entry.type === "bonus").length;
  if (dailyRewardEyebrowEl) {
    dailyRewardEyebrowEl.textContent = bonusCount ? "Daily Bonus" : "Daily Challenge";
  }
  if (dailyRewardTitleEl) {
    dailyRewardTitleEl.textContent = bonusCount
      ? "Daily rewards completed"
      : rewardCount > 1
        ? `${rewardCount} daily rewards claimed`
        : "Daily reward claimed";
  }
  if (dailyRewardSubtitleEl) {
    dailyRewardSubtitleEl.textContent = "Reward packs have been added to My Packs.";
  }
  if (dailyRewardSummaryEl) {
    dailyRewardSummaryEl.textContent = `${rewardCount} Reward${rewardCount === 1 ? "" : "s"}`;
  }
  if (dailyRewardListEl) {
    dailyRewardListEl.innerHTML = celebration.rewards.map((entry) => {
      const rewardMeta = `${entry.rewardPack.name} - ${getDailyRewardMeta(entry.rewardPack)}`;
      return `
        <article class="daily-reward-item ${entry.type === "bonus" ? "bonus" : ""}">
          <div class="daily-reward-copy">
            <span class="eyebrow accent">${entry.type === "bonus" ? "Daily Bonus" : "Challenge Complete"}</span>
            <strong>${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(rewardMeta)}</span>
          </div>
          ${buildRewardPackShowcase(entry.rewardPack)}
        </article>
      `;
    }).join("");
  }
}

function renderSetCollectionFilters() {
  const sortMeta = [
    { id: "alpha", label: "A-Z" },
    { id: "most-owned", label: "Most Owned" },
    { id: "least-owned", label: "Least Owned" },
  ];
  collectionFiltersEl.innerHTML = `
    <div class="filter-group">
      ${sortMeta.map((sort) => `
        <button type="button" class="filter-btn ${collectionSort === sort.id ? "active" : ""}" data-sort-id="${sort.id}">
          ${escapeHtml(sort.label)}
        </button>
      `).join("")}
    </div>
  `;
  collectionFiltersEl.querySelectorAll("[data-sort-id]").forEach((button) => {
    button.addEventListener("click", () => setCollectionSort(button.dataset.sortId));
  });
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getRarityRank(rarityId) {
  const normalized = rarityId === "mythic" ? "diamond" : rarityId;
  return visibleRarityOptions.findIndex((tier) => tier.id === normalized);
}

function getFilterableRarityId(card) {
  if (!card) return "silver";
  return card.displayRarityId || (card.rarityId === "mythic" ? "diamond" : card.rarityId);
}

function getFilteredPlayerCards() {
  const sourceCards = playerCollectionShowLocked ? cardCatalog : getOwnedCards();
  const searchNeedle = normalizeSearchText(playerCollectionSearch);
  const filtered = sourceCards.filter((card) => {
    if (playerCollectionTeamFilter.length && !playerCollectionTeamFilter.includes(card.teamId)) return false;
    if (playerCollectionRarityFilter.length && !playerCollectionRarityFilter.includes(getFilterableRarityId(card))) return false;
    if (playerCollectionPositionFilter !== "all" && getPrimaryPosition(card.position) !== playerCollectionPositionFilter) return false;
    if (!searchNeedle) return true;

    const haystack = normalizeSearchText([
      card.name,
      card.teamName,
      card.displayRarityLabel || card.rarityLabel,
      getPrimaryPosition(card.position),
      card.ability,
      card.jersey,
    ].join(" "));
    return haystack.includes(searchNeedle);
  });

  return [...filtered].sort((left, right) => {
    switch (playerCollectionSort) {
      case "rating-asc":
        return left.ability - right.ability || left.name.localeCompare(right.name);
      case "name-asc":
        return left.name.localeCompare(right.name);
      case "name-desc":
        return right.name.localeCompare(left.name);
      case "team-asc":
        return left.teamName.localeCompare(right.teamName) || right.ability - left.ability || left.name.localeCompare(right.name);
      case "rarity-desc":
        return getRarityRank(getFilterableRarityId(right)) - getRarityRank(getFilterableRarityId(left)) || right.ability - left.ability || left.name.localeCompare(right.name);
      case "rating-desc":
      default:
        return right.ability - left.ability || left.name.localeCompare(right.name);
    }
  });
}

function getFilterButtonLabel(baseLabel, count = 0) {
  return count > 0 ? `${baseLabel} • ${count}` : baseLabel;
}

function buildSelectableFilterGroup(title, items, selectedValues, dataAttr, options = {}) {
  const allowClear = options.allowClear !== false;
  const emptyText = options.emptyText || "No options";
  return `
    <section class="filter-popover-group">
      <div class="filter-popover-head">
        <span class="label">${escapeHtml(title)}</span>
        ${allowClear ? `<button type="button" class="mini-link-btn" data-clear-filter-group="${escapeHtml(dataAttr)}">Clear</button>` : ""}
      </div>
      <div class="filter-chip-grid">
        ${items.length ? items.map((item) => `
          <button
            type="button"
            class="filter-chip-btn ${selectedValues.includes(item.value) ? "active" : ""}"
            data-filter-option="${escapeHtml(dataAttr)}"
            data-filter-value="${escapeHtml(item.value)}"
          >${escapeHtml(item.label)}</button>
        `).join("") : `<span class="filter-chip-empty">${escapeHtml(emptyText)}</span>`}
      </div>
    </section>
  `;
}

function toggleFilterSelection(currentValues, value, universe = []) {
  const normalizedCurrent = normalizeFilterList(currentValues);
  if (!normalizedCurrent.length) {
    return [value];
  }
  if (normalizedCurrent.includes(value)) {
    return normalizedCurrent.filter((entry) => entry !== value);
  }
  const next = [...normalizedCurrent, value];
  if (universe.length && next.length >= universe.length) {
    return [];
  }
  return next;
}

function buildTeamLogoFilterGroup(title, items, selectedValues, dataAttr) {
  const activeValues = selectedValues.length ? selectedValues : items.map((item) => item.value);
  return `
    <section class="filter-popover-group team-logo-filter-group filter-span-full">
      <div class="filter-popover-head">
        <span class="label">${escapeHtml(title)}</span>
        <button type="button" class="mini-link-btn" data-clear-filter-group="${escapeHtml(dataAttr)}">${selectedValues.length ? "Clear" : "All Teams"}</button>
      </div>
      <div class="team-logo-filter-grid">
        ${items.map((item) => `
          <button
            type="button"
            class="team-logo-filter-btn ${activeValues.includes(item.value) ? "active" : ""}"
            data-filter-option="${escapeHtml(dataAttr)}"
            data-filter-value="${escapeHtml(item.value)}"
            title="${escapeHtml(item.label)}"
            aria-label="${escapeHtml(item.label)}"
          >
            <span class="team-logo-filter-mark ${item.logoUrl ? "" : "fallback-only"}" data-fallback-label="${escapeHtml(item.fallbackLabel || item.abbreviation || item.label.slice(0, 3).toUpperCase())}">
              ${item.logoUrl ? `<img loading="lazy" src="${escapeHtml(item.logoUrl)}" alt="${escapeHtml(item.label)} logo">` : ""}
            </span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderPlayerCollectionFilters(ownedCards) {
  const availableCards = playerCollectionShowLocked ? cardCatalog : ownedCards;
  const teamOptions = teamSets
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((team) => ({
      value: team.id,
      label: team.id === "hall-of-fame" ? "Hall of Fame" : team.name,
      abbreviation: team.abbreviation,
      fallbackLabel: team.id === "hall-of-fame" ? "HOF" : team.abbreviation,
      logoUrl: getTeamLogoUrl(team.id),
    }));
  const positionOptions = [...new Set(availableCards.map((card) => getPrimaryPosition(card.position)))].sort();
  const playerFilterCount = playerCollectionTeamFilter.length + playerCollectionRarityFilter.length + (playerCollectionPositionFilter === "all" ? 0 : 1) + (playerCollectionShowLocked ? 1 : 0);
  const filteredCards = getFilteredPlayerCards();

  collectionFiltersEl.innerHTML = `
    <div class="collection-tool-grid player-toolbar-grid">
      <label class="collection-field collection-search-field">
        <span class="label">Search Club</span>
        <input
          type="search"
          data-player-search
          value="${escapeHtml(playerCollectionSearch)}"
          placeholder="Search player, team, rarity, number"
          spellcheck="false"
        >
      </label>

      <label class="collection-field">
        <span class="label">Sort</span>
        <select data-player-sort>
          <option value="rating-desc" ${playerCollectionSort === "rating-desc" ? "selected" : ""}>Rating High-Low</option>
          <option value="rating-asc" ${playerCollectionSort === "rating-asc" ? "selected" : ""}>Rating Low-High</option>
          <option value="name-asc" ${playerCollectionSort === "name-asc" ? "selected" : ""}>Name A-Z</option>
          <option value="name-desc" ${playerCollectionSort === "name-desc" ? "selected" : ""}>Name Z-A</option>
          <option value="team-asc" ${playerCollectionSort === "team-asc" ? "selected" : ""}>Team A-Z</option>
          <option value="rarity-desc" ${playerCollectionSort === "rarity-desc" ? "selected" : ""}>Rarity High-Low</option>
        </select>
      </label>
      <div class="collection-field toolbar-button-field">
        <span class="label">Filters</span>
        <button type="button" class="secondary-btn toolbar-toggle-btn ${isPlayerFilterMenuOpen ? "active" : ""}" data-player-filter-toggle>
          ${escapeHtml(getFilterButtonLabel("Filters", playerFilterCount))}
        </button>
      </div>
      <div class="collection-field toolbar-button-field">
        <span class="label">Bulk Sell</span>
        <button type="button" class="secondary-btn toolbar-toggle-btn ${isPlayerBulkSellOpen ? "active" : ""}" data-player-bulk-toggle>
          Open Bulk Sell
        </button>
      </div>
    </div>
    ${isPlayerFilterMenuOpen ? `
      <section class="filter-popover-panel">
        ${buildTeamLogoFilterGroup("Teams", teamOptions, playerCollectionTeamFilter, "player-team")}
        <div class="filter-popover-grid player-filter-secondary-grid">
          ${buildSelectableFilterGroup("Rarities", visibleRarityOptions, playerCollectionRarityFilter, "player-rarity")}
          <section class="filter-popover-group">
            <div class="filter-popover-head">
              <span class="label">Position</span>
              <button type="button" class="mini-link-btn" data-clear-position-filter>Clear</button>
            </div>
            <div class="filter-chip-grid">
              <button type="button" class="filter-chip-btn ${playerCollectionPositionFilter === "all" ? "active" : ""}" data-position-filter="all">All</button>
              ${positionOptions.map((position) => `
                <button type="button" class="filter-chip-btn ${playerCollectionPositionFilter === position ? "active" : ""}" data-position-filter="${escapeHtml(position)}">${escapeHtml(position)}</button>
              `).join("")}
            </div>
          </section>
          <section class="filter-popover-group">
            <div class="filter-popover-head">
              <span class="label">Collection State</span>
              ${playerCollectionShowLocked ? `<button type="button" class="mini-link-btn" data-player-show-locked-reset>Owned Only</button>` : ""}
            </div>
            <div class="filter-chip-grid">
              <button type="button" class="filter-chip-btn ${!playerCollectionShowLocked ? "active" : ""}" data-player-show-locked="false">Owned Only</button>
              <button type="button" class="filter-chip-btn ${playerCollectionShowLocked ? "active" : ""}" data-player-show-locked="true">Show Locked</button>
            </div>
          </section>
        </div>
      </section>
    ` : ""}
    ${isPlayerBulkSellOpen ? buildBulkSellPanel(filteredCards, {
      scopeLabel: "Current Filters",
      title: "Bulk sell visible duplicates",
      note: "Uses your current search and filters. Auto sell only affects duplicate copies.",
      showTeamFilter: true,
      showRarityFilter: true,
      menuMode: true,
    }) : ""}
  `;

  const searchInput = collectionFiltersEl.querySelector("[data-player-search]");
  if (searchInput) {
    searchInput.addEventListener("input", () => setPlayerCollectionSearch(searchInput.value));
  }
  collectionFiltersEl.querySelector("[data-player-sort]")?.addEventListener("change", (event) => {
    setPlayerCollectionSort(event.target.value);
  });
  collectionFiltersEl.querySelector("[data-player-filter-toggle]")?.addEventListener("click", togglePlayerFilterMenu);
  collectionFiltersEl.querySelector("[data-player-bulk-toggle]")?.addEventListener("click", togglePlayerBulkSellMenu);
  collectionFiltersEl.querySelectorAll("[data-filter-option='player-team']").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.filterValue;
      const next = toggleFilterSelection(playerCollectionTeamFilter, value, teamOptions.map((team) => team.value));
      setPlayerCollectionTeamFilter(next);
    });
  });
  collectionFiltersEl.querySelectorAll("[data-filter-option='player-rarity']").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.filterValue;
      const next = toggleFilterSelection(playerCollectionRarityFilter, value, visibleRarityOptions.map((tier) => tier.id));
      setPlayerCollectionRarityFilter(next);
    });
  });
  collectionFiltersEl.querySelector("[data-clear-filter-group='player-team']")?.addEventListener("click", () => {
    setPlayerCollectionTeamFilter([]);
  });
  collectionFiltersEl.querySelector("[data-clear-filter-group='player-rarity']")?.addEventListener("click", () => {
    setPlayerCollectionRarityFilter([]);
  });
  collectionFiltersEl.querySelectorAll("[data-position-filter]").forEach((button) => {
    button.addEventListener("click", () => setPlayerCollectionPositionFilter(button.dataset.positionFilter));
  });
  collectionFiltersEl.querySelector("[data-clear-position-filter]")?.addEventListener("click", () => {
    setPlayerCollectionPositionFilter("all");
  });
  collectionFiltersEl.querySelectorAll("[data-player-show-locked]").forEach((button) => {
    button.addEventListener("click", () => {
      setPlayerCollectionShowLocked(button.dataset.playerShowLocked === "true");
    });
  });
  collectionFiltersEl.querySelector("[data-player-show-locked-reset]")?.addEventListener("click", () => {
    setPlayerCollectionShowLocked(false);
  });
  if (isPlayerBulkSellOpen) bindBulkSellPanel(collectionFiltersEl.querySelector(".bulk-sell-panel"), filteredCards);
}

function buildBulkSellPanel(cards, options = {}) {
  const scopeCards = getUniqueCards(cards);
  const teamOptions = [...new Map(scopeCards.map((card) => [card.teamId, card.teamName])).entries()]
    .sort((left, right) => left[1].localeCompare(right[1]))
    .map(([value, label]) => ({ value, label }));
  const showTeamFilter = options.showTeamFilter === true && teamOptions.length > 1;
  const showRarityFilter = options.showRarityFilter !== false;
  const visibleSnapshot = getBulkSellSnapshot(scopeCards, {
    keepCopies: 1,
    teamIds: [],
    rarityIds: [],
    maxAbility: null,
  });
  const ruleConfig = getBulkSellConfig({
    teamIds: showTeamFilter ? undefined : [],
    rarityIds: showRarityFilter ? undefined : [],
  });
  const ruleSnapshot = getBulkSellSnapshot(scopeCards, ruleConfig);
  const keepOptions = [1, 2, 3, 4];
  const scopeLabel = options.scopeLabel || "Current Scope";
  const title = options.title || "Bulk sell duplicates";
  const note = options.note || "Only duplicate copies can be sold.";
  const showNote = options.showNote !== false;
  return `
    <section class="bulk-sell-panel ${options.compact ? "compact" : ""} ${options.menuMode ? "menu-mode" : ""}">
      <div class="bulk-sell-summary">
        <div class="bulk-sell-copy">
          <span class="eyebrow accent">${escapeHtml(scopeLabel)}</span>
          <h3>${escapeHtml(title)}</h3>
          ${showNote ? `<p>${escapeHtml(note)}</p>` : ""}
        </div>
        <div class="bulk-sell-metrics">
          <article class="bulk-sell-metric">
            <span>Visible Dupes</span>
            <strong>${visibleSnapshot.totalCopies}</strong>
            <em>${visibleSnapshot.cardCount} cards • ${formatMoney(visibleSnapshot.totalValue)}</em>
          </article>
          <article class="bulk-sell-metric">
            <span>Rule Match</span>
            <strong>${ruleSnapshot.totalCopies}</strong>
            <em>${ruleSnapshot.cardCount} cards • ${formatMoney(ruleSnapshot.totalValue)}</em>
          </article>
        </div>
      </div>
      <div class="bulk-sell-controls">
        <label class="collection-field compact-field">
          <span class="label">Keep Copies</span>
          <select data-bulk-keep>
            ${keepOptions.map((count) => `<option value="${count}" ${ruleConfig.keepCopies === count ? "selected" : ""}>Keep ${count}</option>`).join("")}
          </select>
        </label>
        <label class="collection-field compact-field">
          <span class="label">Max OVR</span>
          <input type="number" min="0" max="100" step="1" value="${escapeHtml(ruleConfig.maxAbility ?? "")}" placeholder="Any OVR" data-bulk-ovr inputmode="numeric">
        </label>
      </div>
      ${(showTeamFilter || showRarityFilter) ? `
        <div class="bulk-sell-filter-grid">
          ${showTeamFilter ? buildSelectableFilterGroup("Teams", teamOptions, ruleConfig.teamIds, "bulk-team", { emptyText: "No teams" }) : ""}
          ${showRarityFilter ? buildSelectableFilterGroup("Rarities", visibleRarityOptions, ruleConfig.rarityIds, "bulk-rarity", { emptyText: "No rarities" }) : ""}
        </div>
      ` : ""}
      <div class="bulk-sell-actions-row">
        <button type="button" class="secondary-btn" data-bulk-sell-visible ${visibleSnapshot.totalCopies ? "" : "disabled"}>${visibleSnapshot.totalCopies ? `Sell Visible Dupes • ${formatMoney(visibleSnapshot.totalValue)}` : "No Visible Dupes"}</button>
        <button type="button" class="action-btn" data-bulk-sell-matching ${ruleSnapshot.totalCopies ? "" : "disabled"}>${ruleSnapshot.totalCopies ? `Auto Sell Matches • ${formatMoney(ruleSnapshot.totalValue)}` : "No Matches"}</button>
      </div>
    </section>
  `;
}

function bindBulkSellPanel(root, cards) {
  if (!root) return;
  root.querySelector("[data-bulk-keep]")?.addEventListener("change", (event) => {
    setBulkSellKeepCopies(event.target.value);
  });
  root.querySelector("[data-bulk-ovr]")?.addEventListener("change", (event) => {
    setBulkSellMaxAbility(event.target.value);
  });
  root.querySelectorAll("[data-filter-option='bulk-team']").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.filterValue;
      const next = bulkSellTeamFilters.includes(value)
        ? bulkSellTeamFilters.filter((entry) => entry !== value)
        : [...bulkSellTeamFilters, value];
      setBulkSellTeamFilters(next);
    });
  });
  root.querySelectorAll("[data-filter-option='bulk-rarity']").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.filterValue;
      const next = bulkSellRarityFilters.includes(value)
        ? bulkSellRarityFilters.filter((entry) => entry !== value)
        : [...bulkSellRarityFilters, value];
      setBulkSellRarityFilters(next);
    });
  });
  root.querySelector("[data-clear-filter-group='bulk-team']")?.addEventListener("click", () => {
    setBulkSellTeamFilters([]);
  });
  root.querySelector("[data-clear-filter-group='bulk-rarity']")?.addEventListener("click", () => {
    setBulkSellRarityFilters([]);
  });
  root.querySelector("[data-bulk-sell-visible]")?.addEventListener("click", () => {
    sellBulkDuplicates(cards, {
      keepCopies: 1,
      teamIds: [],
      rarityIds: [],
      maxAbility: null,
    });
  });
  root.querySelector("[data-bulk-sell-matching]")?.addEventListener("click", () => {
    sellBulkDuplicates(cards, getBulkSellConfig());
  });
}

function renderCollection() {
  syncCollectionViewMeta();

  if (collectionSection === "players") {
    clearCollectionDetailTheme();
    const ownedPlayerCards = getOwnedCards();
    const filteredCards = getFilteredPlayerCards();
    collectionActionsEl.innerHTML = "";
    renderPlayerCollectionFilters(ownedPlayerCards);
    collectionSummaryEl.className = "collection-summary-strip";
    collectionSummaryEl.innerHTML = "";

    teamGridEl.className = "team-grid players-mode";
    teamGridEl.innerHTML = filteredCards.length
      ? filteredCards.map((card) => buildCardFace(card, {
        collectionMode: true,
        owned: hasOwnedCard(card.id),
        showCollectionStatus: true,
        footerHtml: buildCollectionCardFooter(card),
      })).join("")
      : `
        <div class="collection-empty-state">
          <h3>No players match that search.</h3>
          <p>Try clearing one of the filters or turning on locked cards.</p>
        </div>
      `;
    return;
  }

  if (!activeCollectionGroup) {
    clearCollectionDetailTheme();
    collectionActionsEl.innerHTML = "";
    collectionFiltersEl.innerHTML = "";
    collectionSummaryEl.className = "collection-summary-strip";
    collectionSummaryEl.innerHTML = buildCollectionSummaryStrip([
      {
        label: "Completed Collections",
        value: `${getCompletedCollectionCount()}/${collectionGroups.length}`,
        meta: "Finish every set in East, West, and Special",
      },
    ]);

    teamGridEl.className = "team-grid collections-overview-mode";
    teamGridEl.innerHTML = collectionGroups.map((group) => {
      const { completedSets, totalSets } = getCollectionGroupProgress(group.id);
      const progress = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;
      return `
        <button
          type="button"
          class="team-card collection-group-card ${isCollectionGroupComplete(group.id) ? "completed" : ""}"
          data-collection-open="${group.id}"
          style="
            --team-primary:${group.colors.primary};
            --team-secondary:${group.colors.secondary};
            --team-primary-soft:${withAlpha(group.colors.primary, 0.16)};
            --team-secondary-soft:${withAlpha(group.colors.secondary, 0.12)};
            --set-progress:${progress}%;
          "
        >
          <div class="collection-group-top">
            <span class="eyebrow accent">Collection</span>
            <div class="compact-set-value">${completedSets}/${totalSets}</div>
          </div>
          ${buildCollectionGroupPreview(group)}
          <div class="collection-group-copy">
            <h3>${escapeHtml(group.name)}</h3>
            <div class="meta">${escapeHtml(group.description)}</div>
            ${buildRewardMetaLine(
              getDisplayedCollectionReward(group.id),
              getCollectionRewardPackName(group.id),
              "collection-reward-copy",
            )}
          </div>
        </button>
      `;
    }).join("");

    teamGridEl.querySelectorAll("[data-collection-open]").forEach((button) => {
      button.addEventListener("click", () => openCollectionGroup(button.dataset.collectionOpen));
    });
    return;
  }

  if (!activeCollectionTeam) {
    const group = collectionGroupById[activeCollectionGroup];
    const groupTeams = sortCollectionTeams(getTeamsForCollectionGroup(activeCollectionGroup));
    const { completedSets, totalSets } = getCollectionGroupProgress(activeCollectionGroup);
    clearCollectionDetailTheme();
    collectionActionsEl.innerHTML = `
      <button type="button" class="secondary-btn" id="collectionGroupBack">Back To All Collections</button>
    `;
    renderSetCollectionFilters();
    collectionSummaryEl.className = "collection-summary-strip";
    collectionSummaryEl.innerHTML = buildCollectionSummaryStrip([
      {
        label: "Sets Complete",
        value: `${completedSets}/${totalSets}`,
        meta: group ? group.name : "Collection progress",
      },
    ]);

    teamGridEl.className = "team-grid compact-mode";
    teamGridEl.innerHTML = groupTeams.map((team) => {
      const teamCards = cardsByTeam[team.id];
      const owned = getOwnedCountForTeam(team.id);
      const progress = Math.round((owned / teamCards.length) * 100);
      return `
        <button
          type="button"
          class="team-card compact-set-card ${state.completedTeams.includes(team.id) ? "completed" : ""}"
          data-team-open="${team.id}"
          style="
            --team-primary:${team.colors.primary};
            --team-secondary:${team.colors.secondary};
            --team-primary-soft:${withAlpha(team.colors.primary, 0.16)};
            --team-secondary-soft:${withAlpha(team.colors.secondary, 0.12)};
            --set-progress:${progress}%;
          "
        >
          <div class="compact-set-top">
            <div class="team-set-meta compact-team-set-meta">
              ${buildSetBrand(team)}
              <div>
                <h3>${escapeHtml(team.name)}</h3>
                ${buildRewardMetaLine(
                  getDisplayedTeamReward(team.id),
                  getTeamRewardPackName(team.id),
                  "compact-set-reward",
                )}
              </div>
            </div>
            <div class="compact-set-value">${owned}/${teamCards.length}</div>
          </div>
        </button>
      `;
    }).join("");

    document.getElementById("collectionGroupBack")?.addEventListener("click", closeCollectionGroup);
    teamGridEl.querySelectorAll("[data-team-open]").forEach((button) => {
      button.addEventListener("click", () => openCollectionTeam(button.dataset.teamOpen));
    });
    return;
  }

  const team = teamById[activeCollectionTeam];
  const parentCollection = collectionGroupById[activeCollectionGroup || team.conference];
  const teamCards = cardsByTeam[team.id];
  const owned = teamCards.filter((card) => hasOwnedCard(card.id)).length;
  const progress = Math.round((owned / teamCards.length) * 100);
  const completed = state.completedTeams.includes(team.id);
  applyCollectionDetailTheme(team);
  collectionActionsEl.innerHTML = "";
  collectionFiltersEl.innerHTML = "";
  collectionSummaryEl.className = "collection-summary-strip";
  collectionSummaryEl.innerHTML = "";
  const detailBulkSellPanel = buildBulkSellPanel(teamCards, {
    scopeLabel: `${team.shortName || team.name} Set`,
    title: "Bulk sell set duplicates",
    note: "Only duplicate copies from this set can be sold.",
    compact: true,
    showNote: false,
  });

  teamGridEl.className = "team-grid detail-mode";
  teamGridEl.innerHTML = `
    <section
      class="team-detail-shell"
      style="
        --team-primary:${team.colors.primary};
        --team-secondary:${team.colors.secondary};
        --team-primary-soft:${withAlpha(team.colors.primary, 0.16)};
        --team-secondary-soft:${withAlpha(team.colors.secondary, 0.12)};
      "
    >
      <div class="detail-head">
        <div class="detail-topbar">
          <div class="detail-team-head">
            ${buildSetBrand(team)}
            <div class="detail-team-copy">
              <span class="eyebrow accent">${completed ? "Set Complete" : "Team Set"}</span>
              <h3>${escapeHtml(team.name)}</h3>
            </div>
          </div>
          <div class="detail-topbar-actions">
            <button type="button" class="secondary-btn toolbar-toggle-btn ${isSetBulkSellOpen ? "active" : ""}" id="toggleSetBulkSell">Bulk Sell</button>
            <button type="button" class="secondary-btn" id="collectionBack">Back To ${escapeHtml(parentCollection?.shortName || "Collection")}</button>
          </div>
        </div>
        <div class="detail-meta-row">
          <div class="detail-progress-copy">Set progress: ${owned}/${teamCards.length}</div>
          <div class="detail-pulls-copy">Total cards pulled: ${teamCards.reduce((sum, card) => sum + (state.pullCounts[card.id] || 0), 0)}</div>
          <div class="set-status">
            <span class="reward-pill">${formatMoney(getDisplayedTeamReward(team.id))}</span>
            ${buildRewardMetaLine(
              getDisplayedTeamReward(team.id),
              getTeamRewardPackName(team.id),
              "detail-reward-copy",
            )}
          </div>
        </div>
        <div class="detail-bulk-sell" id="detailBulkSell">
          ${isSetBulkSellOpen ? detailBulkSellPanel : ""}
        </div>
      </div>
      <div class="progress-track detail-progress-track">
        <div class="progress-fill" style="width:${progress}%; --team-primary:${team.colors.primary}; --team-secondary:${team.colors.secondary};"></div>
      </div>
      <div class="team-cards">
        ${teamCards.map((card) => buildCardFace(card, {
          collectionMode: true,
          owned: hasOwnedCard(card.id),
          footerHtml: buildCollectionCardFooter(card),
        })).join("")}
      </div>
    </section>
  `;

  document.getElementById("collectionBack").addEventListener("click", closeCollectionTeam);
  document.getElementById("toggleSetBulkSell")?.addEventListener("click", toggleSetBulkSellMenu);
  if (isSetBulkSellOpen) {
    bindBulkSellPanel(document.getElementById("detailBulkSell"), teamCards);
  }
}

function getProfileFavoriteTeam() {
  return teamById[state.profile?.favoriteTeamId] || null;
}

function getShowcaseCardChoices() {
  return cardCatalog
    .filter((card) => Math.max(0, Number(state.pullCounts?.[card.id]) || 0) > 0)
    .sort((left, right) => right.ability - left.ability || left.name.localeCompare(right.name));
}

function getFavoriteTeamChoices() {
  return teamSets.filter((team) => team.id !== "hall-of-fame");
}

function buildFavoriteTeamPickerGrid(selectedTeamId = "") {
  return getFavoriteTeamChoices().map((team) => {
    const logoUrl = getTeamLogoUrl(team.id);
    const selected = selectedTeamId === team.id;
    return `
      <button
        type="button"
        class="favorite-team-option ${selected ? "active" : ""}"
        data-favorite-team-option="${escapeHtml(team.id)}"
        aria-pressed="${selected ? "true" : "false"}"
        style="--team-primary:${escapeHtml(team.colors.primary)}; --team-secondary:${escapeHtml(team.colors.secondary)};"
      >
        <span class="favorite-team-option-logo ${logoUrl ? "" : "fallback-only"}" data-fallback-label="${escapeHtml(team.abbreviation)}">
          ${logoUrl ? `<img loading="lazy" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(team.name)} logo">` : ""}
        </span>
        <span class="favorite-team-option-name">${escapeHtml(team.name)}</span>
      </button>
    `;
  }).join("");
}

function openFavoriteTeamModal(context = "profile") {
  favoriteTeamModalContext = context === "profile" ? "profile" : "onboarding";
  favoriteTeamDraftId = state.profile?.favoriteTeamId || "";
  isFavoriteTeamModalOpen = true;
  renderFavoriteTeamModal();
}

function setFavoriteTeam(teamId, options = {}) {
  const normalizedTeamId = teamById[teamId] && teamId !== "hall-of-fame" ? teamId : null;
  state.profile.favoriteTeamId = normalizedTeamId;
  state.profile.favoriteTeamPromptDismissed = options.keepPromptOpen ? false : true;
  isFavoriteTeamModalOpen = Boolean(options.keepPromptOpen);
  const achievementUpdate = reconcileAchievements({ showCelebration: options.showCelebration !== false });
  saveState();
  renderAll();
  return achievementUpdate;
}

function dismissFavoriteTeamPrompt() {
  if (favoriteTeamModalContext === "onboarding") {
    state.profile.favoriteTeamPromptDismissed = true;
  }
  isFavoriteTeamModalOpen = false;
  saveState();
  renderAll();
}

function closeAchievementRewardModal() {
  achievementCelebration = null;
  renderAll();
}

function buildProfileBadgeCard(badge, options = {}) {
  const highlighted = options.highlighted === true;
  const button = options.button !== false;
  const compact = options.compact === true;
  const tagName = button ? "button" : "div";
  return `
    <${tagName}
      class="profile-badge-card ${highlighted ? "highlighted" : ""} ${compact ? "compact" : ""}"
      ${button ? `type="button" data-profile-badge-id="${escapeHtml(badge.id)}"` : ""}
      title="${escapeHtml(badge.note)}"
      style="--badge-bg:${badge.theme.bg}; --badge-border:${badge.theme.border}; --badge-text:${badge.theme.text}; --badge-glow:${badge.theme.glow};"
    >
      <span class="profile-badge-icon ${badge.logoUrl ? "has-logo" : ""}">
        ${badge.logoUrl ? `<img loading="lazy" src="${escapeHtml(badge.logoUrl)}" alt="${escapeHtml(badge.title)} badge">` : escapeHtml(badge.iconText)}
      </span>
      <span class="profile-badge-copy">
        <strong>${escapeHtml(badge.title)}</strong>
        <span>${escapeHtml(badge.label)}</span>
      </span>
    </${tagName}>
  `;
}

function buildAchievementRewardText(definition, tier, tierIndex) {
  const rewardPacks = resolveAchievementTierRewardPacks(definition, tier, tierIndex);
  if (!rewardPacks.length) return "Badge upgrade";
  return rewardPacks.map((pack) => pack.name).join(" + ");
}

function renderProfileOverview() {
  if (!profileOverviewEl) return;
  const favoriteTeam = getProfileFavoriteTeam();
  const favoriteProgressDef = getAchievementDefinitions().find((definition) => definition.teamId && definition.teamId === favoriteTeam?.id);
  const favoriteLevel = favoriteProgressDef ? Math.max(0, Number(state.achievementLevels?.[favoriteProgressDef.id]) || 0) : 0;
  const favoriteNextTier = favoriteProgressDef && favoriteLevel < favoriteProgressDef.tiers.length
    ? favoriteProgressDef.tiers[favoriteLevel]
    : null;
  const favoriteProgress = favoriteNextTier ? getAchievementTierProgress(favoriteProgressDef, favoriteLevel) : 0;
  const quickStats = [
    { label: "Total Cards", value: getTotalStoredCards().toLocaleString("en-US"), meta: "All copies currently stored" },
    { label: "Collection Progress", value: `${countOwnedCards()}/${cardCatalog.length}`, meta: "Unique cards owned" },
    { label: "Completed Sets", value: `${state.completedTeams.length}/${teamSets.length}`, meta: "Finished team pages" },
    { label: "Earned Badges", value: getAllEarnedBadges().length.toLocaleString("en-US"), meta: "Unlocked across achievements and teams" },
  ];
  profileOverviewEl.innerHTML = `
    <div class="profile-overview-main">
      <div class="profile-favorite-team-card" style="${favoriteTeam ? `--favorite-primary:${favoriteTeam.colors.primary}; --favorite-secondary:${favoriteTeam.colors.secondary};` : ""}">
        <div class="profile-favorite-brand">
          ${favoriteTeam ? `
            <span class="profile-favorite-logo">
              <img loading="lazy" src="${escapeHtml(getTeamLogoUrl(favoriteTeam.id) || "")}" alt="${escapeHtml(favoriteTeam.name)} logo">
            </span>
            <div class="profile-favorite-copy">
              <span class="eyebrow accent">Favorite Team</span>
              <h3>${escapeHtml(favoriteTeam.name)}</h3>
              <p>${favoriteProgressDef
                ? favoriteNextTier
                  ? `${escapeHtml(favoriteProgressDef.title)} • ${Math.min(favoriteProgress, favoriteNextTier.target)}/${favoriteNextTier.target}`
                  : "Favorite team mastery complete."
                : "Favorite team progress is ready whenever you are."}</p>
            </div>
          ` : `
            <div class="profile-favorite-copy">
              <span class="eyebrow accent">Favorite Team</span>
              <h3>Choose your squad.</h3>
              <p>Pick a team to unlock favorite-team achievements and profile flair.</p>
            </div>
          `}
        </div>
        <div class="profile-team-picker-inline">
          <span class="field-label">Favorite team</span>
          <div class="profile-inline-controls">
            <button type="button" class="action-btn" data-open-favorite-team-modal>Change Favorite Team</button>
          </div>
        </div>
      </div>
      <div class="profile-quick-stats">
        ${quickStats.map((stat) => `
          <article class="profile-quick-stat">
            <span>${escapeHtml(stat.label)}</span>
            <strong>${escapeHtml(stat.value)}</strong>
            <small>${escapeHtml(stat.meta)}</small>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderProfileShowcase() {
  if (!profileShowcaseGridEl || !profileShowcaseControlsEl) return;
  const showcased = [...(state.profile?.showcasedCardIds || [])].slice(0, PROFILE_SHOWCASE_LIMIT);
  while (showcased.length < PROFILE_SHOWCASE_LIMIT) showcased.push("");
  const choices = getShowcaseCardChoices();
  profileShowcaseGridEl.innerHTML = showcased.map((cardId, index) => {
    const card = cardsById[cardId];
    if (!card) {
      return `
        <div class="profile-showcase-slot empty">
          <span class="eyebrow accent">Slot ${index + 1}</span>
          <h4>Empty Showcase Slot</h4>
          <p>Pick a packed card below to feature it on your profile.</p>
        </div>
      `;
    }
    return `
      <div class="profile-showcase-slot">
        ${buildCardFace(card, {
          collectionMode: true,
          owned: true,
          showCollectionStatus: false,
          hideFooter: true,
          shellClass: "profile-showcase-card-shell",
        })}
      </div>
    `;
  }).join("");
  profileShowcaseControlsEl.innerHTML = showcased.map((cardId, index) => `
    <label class="profile-showcase-control">
      <span>Showcase Slot ${index + 1}</span>
      <select data-profile-showcase-slot="${index}">
        <option value="">No card selected</option>
        ${choices.map((card) => `<option value="${escapeHtml(card.id)}" ${card.id === cardId ? "selected" : ""}>${escapeHtml(`${card.name} • ${card.teamName}`)}</option>`).join("")}
      </select>
    </label>
  `).join("");
}

function renderProfileBadges() {
  if (!profileHighlightedBadgesEl || !profileBadgeGridEl) return;
  const allBadges = getAllEarnedBadges();
  const previousHighlighted = state.profile?.highlightedBadgeIds || [];
  const highlightedIds = previousHighlighted.filter((badgeId) => Boolean(getBadgeById(badgeId)));
  if (highlightedIds.length !== previousHighlighted.length) {
    state.profile.highlightedBadgeIds = highlightedIds;
    saveState();
  }
  const highlightedBadges = highlightedIds.map((badgeId) => getBadgeById(badgeId)).filter(Boolean);

  profileHighlightedBadgesEl.innerHTML = highlightedBadges.length
    ? highlightedBadges.map((badge) => buildProfileBadgeCard(badge, { highlighted: true })).join("")
    : `
      <div class="profile-empty-note">
        <strong>No badges pinned yet.</strong>
        <span>Click a badge below to highlight it on your profile.</span>
      </div>
    `;

  profileBadgeGridEl.innerHTML = allBadges.length
    ? allBadges.map((badge) => buildProfileBadgeCard(badge, { highlighted: highlightedIds.includes(badge.id) })).join("")
    : `
      <div class="profile-empty-note">
        <strong>No badges earned yet.</strong>
        <span>Achievements and completed team sets will show up here.</span>
      </div>
    `;
}

function renderProfileAchievements() {
  if (!profileAchievementGridEl) return;
  const definitions = getAchievementDefinitions();
  profileAchievementGridEl.innerHTML = definitions.map((definition) => {
    const reachedLevel = Math.max(0, Number(state.achievementLevels?.[definition.id]) || 0);
    const isComplete = reachedLevel >= definition.tiers.length;
    const nextTierIndex = isComplete ? definition.tiers.length - 1 : reachedLevel;
    const nextTier = definition.tiers[nextTierIndex];
    const progressValue = isComplete
      ? nextTier.target
      : getAchievementTierProgress(definition, nextTierIndex);
    const progressPercent = nextTier?.target ? Math.min(100, (progressValue / nextTier.target) * 100) : 100;
    const badge = getAchievementBadgeData(definition);
    return `
      <article class="achievement-card ${isComplete ? "complete" : ""}">
        <div class="achievement-card-top">
          <div class="achievement-copy">
            <span class="eyebrow accent">${escapeHtml(definition.category)}</span>
            <h4>${escapeHtml(definition.title)}</h4>
            <p>${escapeHtml(definition.note)}</p>
          </div>
          ${badge ? buildProfileBadgeCard(badge, { button: false }) : `<div class="achievement-badge-placeholder">${escapeHtml(definition.badgeAcronym || definition.title.slice(0, 2).toUpperCase())}</div>`}
        </div>
        <div class="achievement-progress-copy">
          <strong>${isComplete ? "All tiers complete" : `${Math.min(progressValue, nextTier.target)}/${nextTier.target}`}</strong>
          <span>${escapeHtml(isComplete ? definition.tiers[definition.tiers.length - 1].label : nextTier.label)}</span>
        </div>
        <div class="progress-track achievement-progress-track">
          <div class="progress-fill" style="width:${progressPercent}%;"></div>
        </div>
        <div class="achievement-meta-row">
          <span>${escapeHtml(`${Math.min(reachedLevel, definition.tiers.length)}/${definition.tiers.length} tiers`)}</span>
          <span>${escapeHtml(isComplete ? "Badge upgraded" : buildAchievementRewardText(definition, nextTier, nextTierIndex))}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderProfile() {
  renderProfileOverview();
  renderProfileShowcase();
  renderProfileBadges();
  renderProfileAchievements();
}

function getProfileShowcaseSlots() {
  return normalizeSlotArray(
    state.profile?.showcasedCardIds,
    PROFILE_SHOWCASE_LIMIT,
    (cardId) => Boolean(cardsById[cardId]) && Math.max(0, Number(state.pullCounts?.[cardId]) || 0) > 0,
  );
}

function getProfileBadgeSlots() {
  return normalizeSlotArray(
    state.profile?.highlightedBadgeIds,
    PROFILE_HIGHLIGHTED_BADGE_LIMIT,
    (badgeId) => Boolean(getBadgeById(badgeId)),
  );
}

function syncProfileSlots() {
  const nextShowcase = getProfileShowcaseSlots();
  const nextBadges = getProfileBadgeSlots();
  const showcaseChanged = JSON.stringify(nextShowcase) !== JSON.stringify(state.profile?.showcasedCardIds || []);
  const badgeChanged = JSON.stringify(nextBadges) !== JSON.stringify(state.profile?.highlightedBadgeIds || []);
  state.profile.showcasedCardIds = nextShowcase;
  state.profile.highlightedBadgeIds = nextBadges;
  if (showcaseChanged || badgeChanged) saveState();
}

function updateProfileShowcaseSlots(slots, options = {}) {
  state.profile.showcasedCardIds = normalizeSlotArray(
    slots,
    PROFILE_SHOWCASE_LIMIT,
    (cardId) => Boolean(cardsById[cardId]) && Math.max(0, Number(state.pullCounts?.[cardId]) || 0) > 0,
  );
  if (options.save !== false) saveState();
  if (options.render !== false) renderProfile();
}

function updateProfileBadgeSlots(slots, options = {}) {
  state.profile.highlightedBadgeIds = normalizeSlotArray(
    slots,
    PROFILE_HIGHLIGHTED_BADGE_LIMIT,
    (badgeId) => Boolean(getBadgeById(badgeId)),
  );
  if (options.save !== false) saveState();
  if (options.render !== false) renderProfile();
}

function setProfileShowcaseSlot(slotIndex, cardId) {
  const normalizedIndex = Math.max(0, Math.min(PROFILE_SHOWCASE_LIMIT - 1, Number(slotIndex) || 0));
  const slots = getProfileShowcaseSlots();
  const currentCardId = slots[normalizedIndex] || "";
  const nextCardId = cardsById[cardId] && Math.max(0, Number(state.pullCounts?.[cardId]) || 0) > 0 ? cardId : "";
  if (currentCardId === nextCardId) {
    closeProfileShowcaseModal();
    return;
  }
  const usedIndex = nextCardId ? slots.findIndex((entry) => entry === nextCardId) : -1;
  if (usedIndex >= 0 && usedIndex !== normalizedIndex) {
    slots[usedIndex] = currentCardId;
  }
  slots[normalizedIndex] = nextCardId;
  updateProfileShowcaseSlots(slots);
  closeProfileShowcaseModal();
}

function setProfileHighlightedBadge(slotIndex, badgeId) {
  const badge = getBadgeById(badgeId);
  if (!badge) return;
  const normalizedIndex = Math.max(0, Math.min(PROFILE_HIGHLIGHTED_BADGE_LIMIT - 1, Number(slotIndex) || 0));
  const slots = getProfileBadgeSlots();
  const currentBadgeId = slots[normalizedIndex] || "";
  if (currentBadgeId === badgeId) return;
  const usedIndex = slots.findIndex((entry) => entry === badgeId);
  if (usedIndex >= 0 && usedIndex !== normalizedIndex) {
    slots[usedIndex] = currentBadgeId;
  }
  slots[normalizedIndex] = badgeId;
  updateProfileBadgeSlots(slots);
  isProfileBadgeModalOpen = true;
  renderProfile();
}

function getProfileAchievementSummary() {
  const definitions = getAchievementDefinitions();
  const totalTiers = definitions.reduce((sum, definition) => sum + definition.tiers.length, 0);
  const unlockedTiers = definitions.reduce((sum, definition) => {
    const level = Math.max(0, Math.min(definition.tiers.length, Number(state.achievementLevels?.[definition.id]) || 0));
    return sum + level;
  }, 0);
  const completedAchievements = definitions.filter((definition) => {
    const level = Math.max(0, Number(state.achievementLevels?.[definition.id]) || 0);
    return level >= definition.tiers.length;
  }).length;
  return {
    definitions,
    totalTiers,
    unlockedTiers,
    completedAchievements,
    totalAchievements: definitions.length,
    percent: totalTiers ? Math.min(100, (unlockedTiers / totalTiers) * 100) : 0,
  };
}

function getAchievementCompletionTimestamp(entry) {
  return entry.complete ? getAchievementUnlockedAt(entry.definition.id) : 0;
}

function getProfileAchievementEntries() {
  return getAchievementDefinitions().map((definition) => {
    const level = Math.max(0, Number(state.achievementLevels?.[definition.id]) || 0);
    const complete = level >= definition.tiers.length;
    const unlocked = level > 0;
    const currentTierIndex = complete ? definition.tiers.length - 1 : Math.min(level, definition.tiers.length - 1);
    const currentTier = definition.tiers[currentTierIndex];
    const progressValue = complete
      ? currentTier.target
      : getAchievementTierProgress(definition, currentTierIndex);
    const progressPercent = currentTier?.target ? Math.min(100, (progressValue / currentTier.target) * 100) : 0;
    const unlockedAt = unlocked ? getAchievementUnlockedAt(definition.id, 0) : 0;
    const completedAt = complete ? getAchievementUnlockedAt(definition.id, definition.tiers.length - 1) : 0;
    const badge = getAchievementBadgeData(definition);
    return {
      definition,
      level,
      complete,
      unlocked,
      currentTier,
      progressValue,
      progressPercent,
      unlockedAt,
      completedAt,
      badge,
      rewardText: buildAchievementRewardText(definition, currentTier, currentTierIndex),
    };
  });
}

function getFilteredProfileAchievementEntries() {
  const entries = getProfileAchievementEntries().filter((entry) => {
    switch (profileAchievementStatusFilter) {
      case "unlocked":
        return entry.unlocked;
      case "locked":
        return !entry.unlocked;
      case "complete":
        return entry.complete;
      case "in-progress":
        return entry.unlocked && !entry.complete;
      case "all":
      default:
        return true;
    }
  });

  return [...entries].sort((left, right) => {
    switch (profileAchievementSort) {
      case "date-asc":
        return (getAchievementCompletionTimestamp(left) || left.unlockedAt || Infinity) - (getAchievementCompletionTimestamp(right) || right.unlockedAt || Infinity) || left.definition.title.localeCompare(right.definition.title);
      case "title":
        return left.definition.title.localeCompare(right.definition.title);
      case "progress-desc":
        return right.progressPercent - left.progressPercent || right.level - left.level || left.definition.title.localeCompare(right.definition.title);
      case "date-desc":
      default:
        return (getAchievementCompletionTimestamp(right) || right.unlockedAt || -1) - (getAchievementCompletionTimestamp(left) || left.unlockedAt || -1) || left.definition.title.localeCompare(right.definition.title);
    }
  });
}

function getProfilePickerPositionOptions(cards) {
  return [...new Set(cards.map((card) => getPrimaryPosition(card.position)))].sort();
}

function getFilteredProfileShowcaseCards() {
  const searchNeedle = normalizeSearchText(profileShowcasePickerSearch);
  return getShowcaseCardChoices()
    .filter((card) => {
      if (profileShowcasePickerTeamFilter.length && !profileShowcasePickerTeamFilter.includes(card.teamId)) return false;
      if (profileShowcasePickerRarityFilter.length && !profileShowcasePickerRarityFilter.includes(getFilterableRarityId(card))) return false;
      if (profileShowcasePickerPositionFilter !== "all" && getPrimaryPosition(card.position) !== profileShowcasePickerPositionFilter) return false;
      if (!searchNeedle) return true;
      const haystack = normalizeSearchText([
        card.name,
        card.teamName,
        card.displayRarityLabel || card.rarityLabel,
        getPrimaryPosition(card.position),
        card.ability,
        card.jersey,
      ].join(" "));
      return haystack.includes(searchNeedle);
    })
    .sort((left, right) => {
      switch (profileShowcasePickerSort) {
        case "rating-asc":
          return left.ability - right.ability || left.name.localeCompare(right.name);
        case "name-asc":
          return left.name.localeCompare(right.name);
        case "name-desc":
          return right.name.localeCompare(left.name);
        case "team-asc":
          return left.teamName.localeCompare(right.teamName) || right.ability - left.ability || left.name.localeCompare(right.name);
        case "rarity-desc":
          return getRarityRank(getFilterableRarityId(right)) - getRarityRank(getFilterableRarityId(left)) || right.ability - left.ability || left.name.localeCompare(right.name);
        case "rating-desc":
        default:
          return right.ability - left.ability || left.name.localeCompare(right.name);
      }
    });
}

function openProfileShowcaseModal(slotIndex = 0) {
  activeProfileShowcaseSlot = Math.max(0, Math.min(PROFILE_SHOWCASE_LIMIT - 1, Number(slotIndex) || 0));
  isProfileShowcaseModalOpen = true;
  renderProfile();
}

function closeProfileShowcaseModal() {
  isProfileShowcaseModalOpen = false;
  renderProfile();
}

function openProfileBadgeModal(slotIndex = 0) {
  activeProfileBadgeSlot = Math.max(0, Math.min(PROFILE_HIGHLIGHTED_BADGE_LIMIT - 1, Number(slotIndex) || 0));
  isProfileBadgeModalOpen = true;
  renderProfile();
}

function closeProfileBadgeModal() {
  isProfileBadgeModalOpen = false;
  renderProfile();
}

function openProfileAchievementsModal() {
  isProfileAchievementsModalOpen = true;
  renderProfile();
}

function closeProfileAchievementsModal() {
  isProfileAchievementsModalOpen = false;
  renderProfile();
}

function beginProfileNameEdit() {
  profileNameDraft = sanitizeProfileName(state.profile?.name);
  isProfileNameEditing = true;
  renderProfile();
}

function cancelProfileNameEdit() {
  profileNameDraft = sanitizeProfileName(state.profile?.name);
  isProfileNameEditing = false;
  renderProfile();
}

function saveProfileName() {
  state.profile.name = sanitizeProfileName(profileNameDraft);
  isProfileNameEditing = false;
  saveState();
  renderProfile();
}

function buildProfileAvatar(favoriteTeam) {
  const logoUrl = favoriteTeam ? getTeamLogoUrl(favoriteTeam.id) : "";
  if (logoUrl) {
    return `
      <div class="profile-avatar">
        <img loading="lazy" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(favoriteTeam.name)} logo">
      </div>
    `;
  }
  return `
    <div class="profile-avatar placeholder">
      <span>BB</span>
    </div>
  `;
}

function buildProfileShowcaseSlot(slotIndex, cardId) {
  const card = cardsById[cardId];
  if (!card) {
    return `
      <article class="profile-showcase-slot-card empty">
        <button type="button" class="profile-showcase-empty-button" data-profile-open-showcase-slot="${slotIndex}">
          <span class="eyebrow accent">Featured Slot ${slotIndex + 1}</span>
          <strong>Add a featured card</strong>
          <span>Click to pick a player from your club.</span>
        </button>
        <button type="button" class="secondary-btn profile-slot-edit-btn" data-profile-open-showcase-slot="${slotIndex}">Choose Card</button>
      </article>
    `;
  }
  return `
    <article class="profile-showcase-slot-card">
      ${buildCardFace(card, {
        collectionMode: true,
        owned: true,
        showCollectionStatus: false,
        hideFooter: true,
      })}
      <button type="button" class="secondary-btn profile-slot-edit-btn" data-profile-open-showcase-slot="${slotIndex}">Edit Card</button>
    </article>
  `;
}

function buildProfileBadgeSlot(slotIndex, badgeId) {
  const badge = getBadgeById(badgeId);
  if (!badge) {
    return `
      <button type="button" class="profile-mini-badge-slot empty ${activeProfileBadgeSlot === slotIndex && isProfileBadgeModalOpen ? "active" : ""}" data-profile-badge-slot="${slotIndex}">
        <span class="profile-mini-badge-empty">Empty Slot ${slotIndex + 1}</span>
      </button>
    `;
  }
  return `
    <button type="button" class="profile-mini-badge-slot ${activeProfileBadgeSlot === slotIndex && isProfileBadgeModalOpen ? "active" : ""}" data-profile-badge-slot="${slotIndex}">
      ${buildProfileBadgeCard(badge, { highlighted: true, button: false, compact: true })}
    </button>
  `;
}

function renderProfileWorkspace() {
  if (!profileWorkspaceEl || !profileViewEl) return;
  syncProfileSlots();
  const favoriteTeam = getProfileFavoriteTeam();
  const logoUrl = favoriteTeam ? getTeamLogoUrl(favoriteTeam.id) : "";
  profileViewEl.classList.toggle("profile-themed", Boolean(favoriteTeam));
  profileViewEl.style.setProperty("--profile-primary", favoriteTeam?.colors.primary || "#214177");
  profileViewEl.style.setProperty("--profile-secondary", favoriteTeam?.colors.secondary || "#8ec8ff");
  profileViewEl.style.setProperty("--profile-logo-url", logoUrl ? `url("${logoUrl}")` : "none");

  const showcaseSlots = getProfileShowcaseSlots();
  const badgeSlots = getProfileBadgeSlots();
  const achievementSummary = getProfileAchievementSummary();
  const displayName = getProfileDisplayName();
  const favoriteTeamLabel = favoriteTeam ? favoriteTeam.name : "No favorite team selected";

  profileWorkspaceEl.innerHTML = `
    <div class="profile-page">
      <div class="profile-main-column">
        <section class="profile-hero-card profile-surface">
          <div class="profile-hero-top">
            ${buildProfileAvatar(favoriteTeam)}
            <div class="profile-hero-copy">
              <span class="eyebrow accent">Collector Profile</span>
              ${isProfileNameEditing ? `
                <div class="profile-name-editor">
                  <label class="collection-field compact-field profile-name-field">
                    <span class="label">Profile Name</span>
                    <input type="text" data-profile-name-input maxlength="${PROFILE_NAME_MAX_LENGTH}" value="${escapeHtml(profileNameDraft || "")}" placeholder="${escapeHtml(getDefaultProfileName())}">
                  </label>
                  <div class="profile-name-actions">
                    <button type="button" class="action-btn" data-profile-save-name>Save</button>
                    <button type="button" class="secondary-btn" data-profile-cancel-name>Cancel</button>
                  </div>
                </div>
              ` : `
                <div class="profile-name-row">
                  <h2>${escapeHtml(displayName)}</h2>
                  <button type="button" class="icon-btn profile-name-edit-btn" data-profile-start-name-edit aria-label="Edit profile name">
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.8 1.8a1.9 1.9 0 0 1 2.7 2.7L6 13H3v-3l8.8-8.2Zm1.3 1.4a.8.8 0 0 0-1.1 0l-.8.7 1.1 1.1.8-.7a.8.8 0 0 0 0-1.1ZM10.4 5 4.1 10.9V12h1.1L11.5 6 10.4 5Z"/></svg>
                  </button>
                </div>
              `}
              <div class="profile-hero-meta">
                <span class="profile-team-chip">${escapeHtml(favoriteTeamLabel)}</span>
                <button type="button" class="secondary-btn" data-open-favorite-team-modal>${favoriteTeam ? "Change Favorite Team" : "Choose Favorite Team"}</button>
              </div>
              <div class="profile-stat-strip">
                <article class="profile-stat-chip">
                  <span>Total Cards</span>
                  <strong>${getTotalStoredCards().toLocaleString("en-US")}</strong>
                </article>
                <article class="profile-stat-chip">
                  <span>Collection Progress</span>
                  <strong>${countOwnedCards()}/${cardCatalog.length}</strong>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section class="profile-showcase-panel profile-surface">
          <div class="profile-surface-head">
            <div class="section-copy">
              <span class="eyebrow accent">Featured Cards</span>
              <h3>Showcase your best pulls</h3>
              <p>Pick up to ${PROFILE_SHOWCASE_LIMIT} cards from your club to put on display.</p>
            </div>
          </div>
          <div class="profile-showcase-grid-steam">
            ${showcaseSlots.map((cardId, index) => buildProfileShowcaseSlot(index, cardId)).join("")}
          </div>
        </section>
      </div>

      <aside class="profile-sidebar">
        <button type="button" class="profile-achievement-summary-card profile-surface" data-open-profile-achievements>
          <div class="profile-surface-head sidebar-head">
            <div class="section-copy">
              <span class="eyebrow accent">Achievements</span>
              <h3>${achievementSummary.unlockedTiers}/${achievementSummary.totalTiers} tiers</h3>
            </div>
            <span class="slot-pill">${achievementSummary.completedAchievements}/${achievementSummary.totalAchievements}</span>
          </div>
          <div class="progress-track achievement-progress-track">
            <div class="progress-fill" style="width:${achievementSummary.percent}%;"></div>
          </div>
          <div class="profile-sidebar-meta">
            <span>${achievementSummary.completedAchievements} completed achievements</span>
            <span>View all</span>
          </div>
        </button>

        <section class="profile-badge-panel profile-surface">
          <div class="profile-surface-head sidebar-head">
            <div class="section-copy">
              <span class="eyebrow accent">Showcased Badges</span>
              <h3>Featured Badges</h3>
            </div>
            <button type="button" class="secondary-btn profile-badge-edit-btn" data-open-profile-badge-modal>Edit</button>
          </div>
          <div class="profile-mini-badge-grid">
            ${badgeSlots.map((badgeId, index) => buildProfileBadgeSlot(index, badgeId)).join("")}
          </div>
        </section>
      </aside>
    </div>
  `;
}

function renderProfileShowcaseModal() {
  if (!profileShowcaseModalEl || !profileShowcaseToolbarEl || !profileShowcasePickerGridEl) return;
  profileShowcaseModalEl.hidden = !isProfileShowcaseModalOpen;
  if (!isProfileShowcaseModalOpen) return;

  const slots = getProfileShowcaseSlots();
  const activeCardId = slots[activeProfileShowcaseSlot] || "";
  const activeCard = cardsById[activeCardId];
  const cards = getFilteredProfileShowcaseCards();
  const showcaseCards = getShowcaseCardChoices();
  const teamOptions = [...new Map(showcaseCards.map((card) => [card.teamId, card.teamName])).entries()]
    .sort((left, right) => left[1].localeCompare(right[1]))
    .map(([value, label]) => ({ value, label }));
  const rarityOptions = visibleRarityOptions
    .filter((tier) => showcaseCards.some((card) => getFilterableRarityId(card) === tier.id));
  const positionOptions = getProfilePickerPositionOptions(showcaseCards);

  profileShowcaseModalTitleEl.textContent = `Edit Featured Slot ${activeProfileShowcaseSlot + 1}`;
  profileShowcaseModalSubtitleEl.textContent = activeCard
    ? `Currently showing ${activeCard.name}. Pick another card to replace it or swap slots.`
    : "Pick a card from your club to fill this featured slot.";

  profileShowcaseToolbarEl.innerHTML = `
    <div class="collection-tool-grid profile-editor-tool-grid">
      <label class="collection-field collection-search-field">
        <span class="label">Search Club</span>
        <input type="search" data-profile-showcase-search value="${escapeHtml(profileShowcasePickerSearch)}" placeholder="Search player, team, rarity, number" spellcheck="false">
      </label>
      <label class="collection-field">
        <span class="label">Sort</span>
        <select data-profile-showcase-sort>
          <option value="rating-desc" ${profileShowcasePickerSort === "rating-desc" ? "selected" : ""}>Rating High-Low</option>
          <option value="rating-asc" ${profileShowcasePickerSort === "rating-asc" ? "selected" : ""}>Rating Low-High</option>
          <option value="name-asc" ${profileShowcasePickerSort === "name-asc" ? "selected" : ""}>Name A-Z</option>
          <option value="name-desc" ${profileShowcasePickerSort === "name-desc" ? "selected" : ""}>Name Z-A</option>
          <option value="team-asc" ${profileShowcasePickerSort === "team-asc" ? "selected" : ""}>Team</option>
          <option value="rarity-desc" ${profileShowcasePickerSort === "rarity-desc" ? "selected" : ""}>Rarity</option>
        </select>
      </label>
      <label class="collection-field">
        <span class="label">Position</span>
        <select data-profile-showcase-position>
          <option value="all">All Positions</option>
          ${positionOptions.map((position) => `<option value="${escapeHtml(position)}" ${profileShowcasePickerPositionFilter === position ? "selected" : ""}>${escapeHtml(position)}</option>`).join("")}
        </select>
      </label>
    </div>
    <div class="profile-editor-filter-stack">
      ${buildSelectableFilterGroup("Teams", teamOptions, profileShowcasePickerTeamFilter, "profile-showcase-team")}
      ${buildSelectableFilterGroup("Rarity", rarityOptions, profileShowcasePickerRarityFilter, "profile-showcase-rarity")}
    </div>
  `;

  profileShowcasePickerGridEl.innerHTML = cards.length
    ? cards.map((card) => {
      const usedSlotIndex = slots.findIndex((entry) => entry === card.id);
      const isCurrent = activeCardId === card.id;
      const isUsedElsewhere = usedSlotIndex >= 0 && usedSlotIndex !== activeProfileShowcaseSlot;
      const stateLabel = isCurrent
        ? "Current Slot"
        : isUsedElsewhere
          ? `Used in Slot ${usedSlotIndex + 1}`
          : "Available";
      return `
        <button type="button" class="profile-picker-card ${isCurrent ? "current" : ""} ${isUsedElsewhere ? "used-elsewhere" : ""}" data-profile-showcase-card="${escapeHtml(card.id)}">
          ${buildCardFace(card, {
            collectionMode: true,
            owned: true,
            showCollectionStatus: false,
            hideFooter: true,
            previewable: false,
          })}
          <span class="profile-picker-card-state">${escapeHtml(stateLabel)}</span>
        </button>
      `;
    }).join("")
    : `<div class="profile-picker-empty">No cards match your current filters.</div>`;
}

function renderProfileBadgeModal() {
  if (!profileBadgeModalEl || !profileBadgeSlotGridEl || !profileBadgePickerGridEl) return;
  profileBadgeModalEl.hidden = !isProfileBadgeModalOpen;
  if (!isProfileBadgeModalOpen) return;

  const slots = getProfileBadgeSlots();
  const badges = getAllEarnedBadges();

  profileBadgeSlotGridEl.innerHTML = slots.map((badgeId, index) => {
    const badge = getBadgeById(badgeId);
    return `
      <button type="button" class="profile-badge-slot-picker ${activeProfileBadgeSlot === index ? "active" : ""}" data-profile-badge-slot="${index}">
        <span class="eyebrow accent">Slot ${index + 1}</span>
        ${badge ? buildProfileBadgeCard(badge, { highlighted: true, button: false }) : `<span class="profile-badge-slot-empty">Choose a badge</span>`}
      </button>
    `;
  }).join("");

  profileBadgePickerGridEl.innerHTML = badges.length
    ? badges.map((badge) => {
      const usedIndex = slots.findIndex((entry) => entry === badge.id);
      const isCurrent = slots[activeProfileBadgeSlot] === badge.id;
      const isUsedElsewhere = usedIndex >= 0 && usedIndex !== activeProfileBadgeSlot;
      const note = isCurrent
        ? "Current Slot"
        : isUsedElsewhere
          ? `Used in Slot ${usedIndex + 1}`
          : "Available";
      return `
        <button type="button" class="profile-badge-picker-item ${isCurrent ? "current" : ""} ${isUsedElsewhere ? "used-elsewhere" : ""}" data-profile-badge-pick="${escapeHtml(badge.id)}">
          ${buildProfileBadgeCard(badge, { highlighted: isCurrent, button: false })}
          <span class="profile-picker-card-state">${escapeHtml(note)}</span>
        </button>
      `;
    }).join("")
    : `<div class="profile-picker-empty">Earn badges through sets and achievements to feature them here.</div>`;
}

function renderProfileAchievementsModal() {
  if (!profileAchievementsModalEl || !profileAchievementsSummaryEl || !profileAchievementsToolbarEl || !profileAchievementsGridEl) return;
  profileAchievementsModalEl.hidden = !isProfileAchievementsModalOpen;
  if (!isProfileAchievementsModalOpen) return;

  const summary = getProfileAchievementSummary();
  const entries = getFilteredProfileAchievementEntries();

  profileAchievementsSummaryEl.innerHTML = `
    <div class="profile-achievement-header-row">
      <div class="profile-achievement-summary-card inline compact-row">
        <div class="profile-surface-head sidebar-head">
          <div class="section-copy">
            <span class="eyebrow accent">Achievement Progress</span>
            <h3>${summary.unlockedTiers}/${summary.totalTiers} tiers</h3>
          </div>
          <span class="slot-pill">${summary.completedAchievements}/${summary.totalAchievements}</span>
        </div>
        <div class="progress-track achievement-progress-track">
          <div class="progress-fill" style="width:${summary.percent}%; --team-primary:#4ba4ff; --team-secondary:#9d71ff;"></div>
        </div>
      </div>
      <label class="collection-field compact-field profile-achievement-filter-field">
        <span class="label">Status</span>
        <select data-profile-achievement-status>
          <option value="all" ${profileAchievementStatusFilter === "all" ? "selected" : ""}>All Achievements</option>
          <option value="unlocked" ${profileAchievementStatusFilter === "unlocked" ? "selected" : ""}>Unlocked</option>
          <option value="in-progress" ${profileAchievementStatusFilter === "in-progress" ? "selected" : ""}>In Progress</option>
          <option value="complete" ${profileAchievementStatusFilter === "complete" ? "selected" : ""}>Complete</option>
          <option value="locked" ${profileAchievementStatusFilter === "locked" ? "selected" : ""}>Locked</option>
        </select>
      </label>
      <label class="collection-field compact-field profile-achievement-filter-field">
        <span class="label">Sort</span>
        <select data-profile-achievement-sort>
          <option value="date-desc" ${profileAchievementSort === "date-desc" ? "selected" : ""}>Latest Unlock</option>
          <option value="date-asc" ${profileAchievementSort === "date-asc" ? "selected" : ""}>Oldest Unlock</option>
          <option value="progress-desc" ${profileAchievementSort === "progress-desc" ? "selected" : ""}>Most Progress</option>
          <option value="title" ${profileAchievementSort === "title" ? "selected" : ""}>Title A-Z</option>
        </select>
      </label>
    </div>
  `;
  profileAchievementsToolbarEl.hidden = true;
  profileAchievementsToolbarEl.innerHTML = "";

  profileAchievementsGridEl.innerHTML = entries.length
    ? entries.map((entry) => `
      <article class="achievement-card achievement-row ${entry.complete ? "complete" : ""}">
        <div class="achievement-row-badge">
          ${entry.badge ? buildProfileBadgeCard(entry.badge, { button: false, compact: true }) : `<div class="achievement-badge-placeholder">${escapeHtml(entry.definition.badgeAcronym || entry.definition.title.slice(0, 2).toUpperCase())}</div>`}
        </div>
        <div class="achievement-row-main">
          <div class="achievement-row-top">
            <div class="achievement-copy">
              <span class="eyebrow accent">${escapeHtml(entry.definition.category)}</span>
              <h4>${escapeHtml(entry.definition.title)}</h4>
              <p>${escapeHtml(entry.definition.note)}</p>
            </div>
            <div class="achievement-progress-copy">
              <strong>${entry.complete ? "All tiers complete" : `${Math.min(entry.progressValue, entry.currentTier.target)}/${entry.currentTier.target}`}</strong>
              <span>${escapeHtml(entry.complete ? entry.definition.tiers[entry.definition.tiers.length - 1].label : entry.currentTier.label)}</span>
            </div>
          </div>
          <div class="progress-track achievement-progress-track">
            <div class="progress-fill" style="width:${entry.progressPercent}%; --team-primary:#4ba4ff; --team-secondary:#9d71ff;"></div>
          </div>
          <div class="achievement-meta-row">
            <span>${escapeHtml(entry.complete ? `Completed ${formatAchievementDate(entry.completedAt || entry.unlockedAt)}` : entry.unlocked ? `Unlocked ${formatAchievementDate(entry.unlockedAt)}` : "Not unlocked yet")}</span>
            <span>${escapeHtml(entry.complete ? "Badge upgraded" : entry.rewardText)}</span>
          </div>
        </div>
      </article>
    `).join("")
    : `<div class="profile-picker-empty">No achievements match the current filters.</div>`;
}

function renderProfile() {
  renderProfileWorkspace();
  renderProfileShowcaseModal();
  renderProfileBadgeModal();
  renderProfileAchievementsModal();
}

function renderAchievementRewardModal() {
  if (!achievementRewardModalEl) return;
  const celebration = achievementCelebration;
  achievementRewardModalEl.hidden = !celebration;
  if (!celebration) {
    if (achievementRewardListEl) achievementRewardListEl.innerHTML = "";
    return;
  }
  if (achievementRewardEyebrowEl) achievementRewardEyebrowEl.textContent = celebration.rewards.length > 1 ? "Achievements" : "Achievement";
  if (achievementRewardTitleEl) {
    achievementRewardTitleEl.textContent = celebration.rewards.length > 1
      ? `${celebration.rewards.length} achievement rewards claimed`
      : "Achievement reward claimed";
  }
  if (achievementRewardSubtitleEl) {
    achievementRewardSubtitleEl.textContent = "Saved reward packs were added to My Packs and your badge tier was upgraded.";
  }
  if (achievementRewardSummaryEl) {
    achievementRewardSummaryEl.textContent = `${celebration.rewards.length} Reward${celebration.rewards.length === 1 ? "" : "s"}`;
  }
  achievementRewardListEl.innerHTML = celebration.rewards.map((entry) => `
    <article class="achievement-reward-item">
      <div class="daily-reward-copy">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${escapeHtml(entry.tierLabel)}</span>
      </div>
      <div class="achievement-reward-packs">
        ${entry.packs.map((pack) => `<span class="reward-pill">${escapeHtml(pack.name)}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function renderAchievementRewardModal() {
  if (!achievementRewardModalEl) return;
  const celebration = achievementCelebration;
  achievementRewardModalEl.hidden = !celebration;
  if (!celebration) {
    if (achievementRewardListEl) achievementRewardListEl.innerHTML = "";
    return;
  }
  if (achievementRewardEyebrowEl) achievementRewardEyebrowEl.textContent = celebration.rewards.length > 1 ? "Achievements" : "Achievement";
  if (achievementRewardTitleEl) {
    achievementRewardTitleEl.textContent = celebration.rewards.length > 1
      ? `${celebration.rewards.length} achievement rewards claimed`
      : "Achievement reward claimed";
  }
  if (achievementRewardSubtitleEl) {
    achievementRewardSubtitleEl.textContent = "Saved reward packs were added to My Packs and your badge tier was upgraded.";
  }
  if (achievementRewardSummaryEl) {
    achievementRewardSummaryEl.textContent = `${celebration.rewards.length} Reward${celebration.rewards.length === 1 ? "" : "s"}`;
  }
  achievementRewardListEl.innerHTML = celebration.rewards.map((entry) => `
    <article class="achievement-reward-item">
      <div class="daily-reward-copy">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${escapeHtml(entry.tierLabel)}</span>
      </div>
      <div class="achievement-reward-packs">
        ${entry.packs.map((pack) => buildRewardPackShowcase(pack)).join("")}
      </div>
    </article>
  `).join("");
}

function renderFavoriteTeamModal() {
  if (!favoriteTeamModalEl || !favoriteTeamGridEl) return;
  favoriteTeamModalEl.hidden = !isFavoriteTeamModalOpen;
  if (!isFavoriteTeamModalOpen) return;
  favoriteTeamGridEl.innerHTML = buildFavoriteTeamPickerGrid(favoriteTeamDraftId || "");
  if (favoriteTeamLaterEl) {
    favoriteTeamLaterEl.textContent = favoriteTeamModalContext === "profile" ? "Cancel" : "Choose Later";
  }
  if (favoriteTeamSaveEl) {
    favoriteTeamSaveEl.textContent = "Continue";
    favoriteTeamSaveEl.disabled = !favoriteTeamDraftId;
  }
}

function renderStats() {
  const rarityPullCounts = visibleRarityOptions.map((tier) => ({
    label: `${tier.label} Pulled`,
    value: Object.entries(state.pullCounts || {}).reduce((sum, [cardId, count]) => {
      const card = cardsById[cardId];
      if (!card || getFilterableRarityId(card) !== tier.id) return sum;
      return sum + Number(count || 0);
    }, 0),
    meta: tier.id === "legends"
      ? "Hall of Fame exclusives"
      : tier.id === "blackmatter"
        ? "The five apex pulls"
        : tier.id === "diamond"
          ? "Glass tier stars and elite pulls"
          : tier.id === "silver"
            ? "81 OVR and below"
            : tier.id === "gold"
              ? "82-87 OVR"
              : "",
    rarityId: tier.id,
  }));
  const overviewStats = [
    { label: "Balance", value: formatMoney(state.money), meta: "Current club balance" },
    { label: "Packs Opened", value: state.packsOpened.toLocaleString("en-US"), meta: "Across all pack types" },
    { label: "Total Cards Pulled", value: state.totalCardsDrawn.toLocaleString("en-US"), meta: "Every card opened, including dupes" },
    { label: "Total Card Progress", value: `${countOwnedCards()} / ${cardCatalog.length}`, meta: "Unique cards in your club" },
    { label: "Lifetime Earnings", value: formatMoney(state.lifetimeEarned), meta: "Rewards, sales, and all club income" },
    { label: "Lifetime Pack Spend", value: formatMoney(state.lifetimePackSpend), meta: "Spent on store packs" },
  ];
  statsGridEl.innerHTML = [
    ...overviewStats.map((item) => `
    <article class="stat-card">
      <div class="label">${escapeHtml(item.label)}</div>
      <div class="value">${escapeHtml(item.value)}</div>
      <div class="meta">${escapeHtml(item.meta)}</div>
    </article>
  `),
    ...rarityPullCounts.map((item) => `
    <article class="stat-card rarity-stat-card rarity-${escapeHtml(item.rarityId)}">
      <div class="label">${escapeHtml(item.label)}</div>
      <div class="value">${escapeHtml(item.value.toLocaleString("en-US"))}</div>
      <div class="meta">${escapeHtml(item.meta)}</div>
    </article>
  `),
  ].join("");
}

function renderAll() {
  ensureDailyChallenges();
  setActiveView(activeView);
  renderHud();
  renderDailyChallenges();
  renderPackSummary();
  renderPackStore();
  renderPackArea();
  renderSetCompletionModal();
  renderDailyRewardModal();
  renderCollection();
  renderProfile();
  renderAchievementRewardModal();
  renderFavoriteTeamModal();
  renderStats();
}

document.addEventListener("error", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) return;
  if (target.matches("[data-player-image]")) {
    const shell = target.closest(".player-art");
    if (shell) shell.classList.add("image-fallback");
    return;
  }
  if (target.matches("[data-team-logo]")) {
    target.remove();
  }
}, true);

navTabsEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  setActiveView(button.dataset.view);
});

packModeTabsEl?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-pack-section]");
  if (!button) return;
  setPackSection(button.dataset.packSection);
});

packModalPrevEl?.addEventListener("click", () => stepPackPreview(-1));
packModalNextEl?.addEventListener("click", () => stepPackPreview(1));

dailyChallengeTriggerEl?.addEventListener("click", (event) => {
  event.stopPropagation();
  isDailyChallengesOpen = !isDailyChallengesOpen;
  renderDailyChallenges();
});

document.addEventListener("click", (event) => {
  const jumpButton = event.target.closest("[data-jump-view]");
  if (!jumpButton) return;
  setActiveView(jumpButton.dataset.jumpView);
});

document.addEventListener("click", (event) => {
  if (!isDailyChallengesOpen) return;
  const target = event.target;
  if (dailyChallengePanelEl?.contains(target) || dailyChallengeTriggerEl?.contains(target)) return;
  isDailyChallengesOpen = false;
  renderDailyChallenges();
});

packStoreEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-pack-id]");
  if (button) {
    const card = button.closest(".pack-card");
    const previewIndex = Number(card?.dataset.previewIndex || -1);
    openPack(button.dataset.packId, {
      sourceType: "store",
      previewIndex: previewIndex >= 0 ? previewIndex : null,
    });
    return;
  }
  const previewCard = event.target.closest('[data-preview-pack-source="store"]');
  if (!previewCard) return;
  openPackPreview("store", {
    packId: previewCard.dataset.previewPackId,
    previewIndex: Number(previewCard.dataset.previewIndex || 0),
  });
});
myPackStoreEl?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-saved-pack-id]");
  if (button) {
    const card = button.closest(".pack-card");
    const previewIndex = Number(card?.dataset.previewIndex || -1);
    openPack("", {
      sourceType: "saved",
      savedPackId: button.dataset.savedPackId,
      previewIndex: previewIndex >= 0 ? previewIndex : null,
    });
    return;
  }
  const previewCard = event.target.closest('[data-preview-pack-source="saved"]');
  if (!previewCard) return;
  openPackPreview("saved", {
    savedPackId: previewCard.dataset.previewSavedPackId,
    previewIndex: Number(previewCard.dataset.previewIndex || 0),
  });
});
revealAllCardsEl.addEventListener("click", revealAllPackCards);
openAnotherPackEl.addEventListener("click", reopenCurrentPack);
sellAllDuplicatesEl.addEventListener("click", () => sellAllPendingDuplicates({ closeAfter: true }));
closePackModalEl.addEventListener("click", closePackModal);
resetGameEl.addEventListener("click", resetGame);

packRevealGridEl.addEventListener("click", (event) => {
  const storePackButton = event.target.closest("[data-pack-id]");
  if (storePackButton && activePackPreview) {
    const previewContext = getPackPreviewContext(activePackPreview);
    if (previewContext) {
      openPack(storePackButton.dataset.packId, {
        sourceType: "store",
        previewIndex: previewContext.index,
      });
    }
    return;
  }
  const savedPackButton = event.target.closest("[data-saved-pack-id]");
  if (savedPackButton && activePackPreview) {
    const previewContext = getPackPreviewContext(activePackPreview);
    if (previewContext) {
      openPack("", {
        sourceType: "saved",
        savedPackId: savedPackButton.dataset.savedPackId,
        previewIndex: previewContext.index,
      });
    }
    return;
  }
  const sellButton = event.target.closest("[data-pack-duplicate-sell]");
  if (sellButton) {
    sellPackDuplicate(Number(sellButton.dataset.packDuplicateSell));
    return;
  }
  const previewCard = event.target.closest("[data-preview-card-id]");
  if (!previewCard) return;
  openCardPreview(previewCard.dataset.previewCardId, {
    collectionMode: previewCard.dataset.previewCollectionMode === "true",
    owned: previewCard.dataset.previewOwned !== "false",
  });
});

teamGridEl.addEventListener("click", (event) => {
  const sellButton = event.target.closest("[data-sell-duplicate-card]");
  if (sellButton) {
    sellDuplicateFromCollection(sellButton.dataset.sellDuplicateCard);
    return;
  }
  const previewCard = event.target.closest("[data-preview-card-id]");
  if (!previewCard) return;
  openCardPreview(previewCard.dataset.previewCardId, {
    collectionMode: previewCard.dataset.previewCollectionMode === "true",
    owned: previewCard.dataset.previewOwned !== "false",
  });
});

profileWorkspaceEl?.addEventListener("click", (event) => {
  const previewCard = event.target.closest("[data-preview-card-id]");
  if (previewCard) {
    openCardPreview(previewCard.dataset.previewCardId, {
      collectionMode: previewCard.dataset.previewCollectionMode === "true",
      owned: previewCard.dataset.previewOwned !== "false",
    });
    return;
  }

  const favoriteTeamButton = event.target.closest("[data-open-favorite-team-modal]");
  if (favoriteTeamButton) {
    openFavoriteTeamModal("profile");
    return;
  }

  const startNameEditButton = event.target.closest("[data-profile-start-name-edit]");
  if (startNameEditButton) {
    beginProfileNameEdit();
    return;
  }

  const saveNameButton = event.target.closest("[data-profile-save-name]");
  if (saveNameButton) {
    saveProfileName();
    return;
  }

  const cancelNameButton = event.target.closest("[data-profile-cancel-name]");
  if (cancelNameButton) {
    cancelProfileNameEdit();
    return;
  }

  const showcaseButton = event.target.closest("[data-profile-open-showcase-slot]");
  if (showcaseButton) {
    openProfileShowcaseModal(showcaseButton.dataset.profileOpenShowcaseSlot);
    return;
  }

  const badgeModalButton = event.target.closest("[data-open-profile-badge-modal]");
  if (badgeModalButton) {
    openProfileBadgeModal(activeProfileBadgeSlot);
    return;
  }

  const badgeSlotButton = event.target.closest("[data-profile-badge-slot]");
  if (badgeSlotButton) {
    openProfileBadgeModal(badgeSlotButton.dataset.profileBadgeSlot);
    return;
  }

  const achievementsButton = event.target.closest("[data-open-profile-achievements]");
  if (achievementsButton) {
    openProfileAchievementsModal();
  }
});

profileWorkspaceEl?.addEventListener("input", (event) => {
  const nameInput = event.target.closest("[data-profile-name-input]");
  if (!nameInput) return;
  profileNameDraft = sanitizeProfileName(nameInput.value);
});

profileWorkspaceEl?.addEventListener("keydown", (event) => {
  if (!event.target.closest("[data-profile-name-input]")) return;
  if (event.key === "Enter") {
    event.preventDefault();
    saveProfileName();
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    cancelProfileNameEdit();
  }
});

profileShowcaseModalEl?.addEventListener("click", (event) => {
  const assignButton = event.target.closest("[data-profile-showcase-card]");
  if (assignButton) {
    setProfileShowcaseSlot(activeProfileShowcaseSlot, assignButton.dataset.profileShowcaseCard);
    return;
  }

  const toggleButton = event.target.closest("[data-filter-option]");
  if (toggleButton) {
    const filterValue = toggleButton.dataset.filterValue;
    if (toggleButton.dataset.filterOption === "profile-showcase-team") {
      profileShowcasePickerTeamFilter = profileShowcasePickerTeamFilter.includes(filterValue)
        ? profileShowcasePickerTeamFilter.filter((value) => value !== filterValue)
        : [...profileShowcasePickerTeamFilter, filterValue];
      renderProfileShowcaseModal();
      return;
    }
    if (toggleButton.dataset.filterOption === "profile-showcase-rarity") {
      profileShowcasePickerRarityFilter = profileShowcasePickerRarityFilter.includes(filterValue)
        ? profileShowcasePickerRarityFilter.filter((value) => value !== filterValue)
        : [...profileShowcasePickerRarityFilter, filterValue];
      renderProfileShowcaseModal();
      return;
    }
  }

  const clearButton = event.target.closest("[data-clear-filter-group]");
  if (clearButton) {
    if (clearButton.dataset.clearFilterGroup === "profile-showcase-team") profileShowcasePickerTeamFilter = [];
    if (clearButton.dataset.clearFilterGroup === "profile-showcase-rarity") profileShowcasePickerRarityFilter = [];
    renderProfileShowcaseModal();
    return;
  }

  if (event.target === profileShowcaseModalEl) closeProfileShowcaseModal();
});

profileShowcaseModalEl?.addEventListener("input", (event) => {
  const searchInput = event.target.closest("[data-profile-showcase-search]");
  if (!searchInput) return;
  const selectionStart = searchInput.selectionStart;
  const selectionEnd = searchInput.selectionEnd;
  profileShowcasePickerSearch = searchInput.value;
  renderProfileShowcaseModal();
  const nextInput = profileShowcaseModalEl.querySelector("[data-profile-showcase-search]");
  if (nextInput) {
    nextInput.focus();
    if (typeof selectionStart === "number" && typeof selectionEnd === "number") {
      nextInput.setSelectionRange(selectionStart, selectionEnd);
    }
  }
});

profileShowcaseModalEl?.addEventListener("change", (event) => {
  const sortSelect = event.target.closest("[data-profile-showcase-sort]");
  if (sortSelect) {
    profileShowcasePickerSort = sortSelect.value;
    renderProfileShowcaseModal();
    return;
  }
  const positionSelect = event.target.closest("[data-profile-showcase-position]");
  if (positionSelect) {
    profileShowcasePickerPositionFilter = positionSelect.value;
    renderProfileShowcaseModal();
  }
});

profileBadgeModalEl?.addEventListener("click", (event) => {
  const slotButton = event.target.closest("[data-profile-badge-slot]");
  if (slotButton) {
    activeProfileBadgeSlot = Math.max(0, Math.min(PROFILE_HIGHLIGHTED_BADGE_LIMIT - 1, Number(slotButton.dataset.profileBadgeSlot) || 0));
    renderProfile();
    return;
  }
  const badgeButton = event.target.closest("[data-profile-badge-pick]");
  if (badgeButton) {
    setProfileHighlightedBadge(activeProfileBadgeSlot, badgeButton.dataset.profileBadgePick);
    return;
  }
  if (event.target === profileBadgeModalEl) closeProfileBadgeModal();
});

profileAchievementsModalEl?.addEventListener("click", (event) => {
  if (event.target === profileAchievementsModalEl) closeProfileAchievementsModal();
});

profileAchievementsModalEl?.addEventListener("change", (event) => {
  const statusSelect = event.target.closest("[data-profile-achievement-status]");
  if (statusSelect) {
    profileAchievementStatusFilter = statusSelect.value;
    renderProfile();
    return;
  }
  const sortSelect = event.target.closest("[data-profile-achievement-sort]");
  if (sortSelect) {
    profileAchievementSort = sortSelect.value;
    renderProfile();
  }
});

packModalEl.addEventListener("click", (event) => {
  if (event.target === packModalEl && !openingPack) closePackModal();
});
cardPreviewModalEl.addEventListener("click", (event) => {
  if (event.target === cardPreviewModalEl) closeCardPreview();
});
setCompletionModalEl.addEventListener("click", (event) => {
  if (event.target === setCompletionModalEl) closeSetCompletionModal();
});
closeSetCompletionModalEl.addEventListener("click", closeSetCompletionModal);
dailyRewardModalEl.addEventListener("click", (event) => {
  if (event.target === dailyRewardModalEl) closeDailyRewardModal();
});
closeDailyRewardModalEl.addEventListener("click", closeDailyRewardModal);
achievementRewardModalEl?.addEventListener("click", (event) => {
  if (event.target === achievementRewardModalEl) closeAchievementRewardModal();
});
closeAchievementRewardModalEl?.addEventListener("click", closeAchievementRewardModal);
favoriteTeamModalEl?.addEventListener("click", (event) => {
  const option = event.target.closest("[data-favorite-team-option]");
  if (option) {
    favoriteTeamDraftId = option.dataset.favoriteTeamOption || "";
    renderFavoriteTeamModal();
    return;
  }
  if (event.target === favoriteTeamModalEl) dismissFavoriteTeamPrompt();
});
favoriteTeamLaterEl?.addEventListener("click", dismissFavoriteTeamPrompt);
favoriteTeamSaveEl?.addEventListener("click", () => {
  if (!favoriteTeamDraftId) return;
  setFavoriteTeam(favoriteTeamDraftId, { showCelebration: true });
});
closeProfileShowcaseModalEl?.addEventListener("click", closeProfileShowcaseModal);
closeProfileBadgeModalEl?.addEventListener("click", closeProfileBadgeModal);
closeProfileAchievementsModalEl?.addEventListener("click", closeProfileAchievementsModal);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (isInteractiveTextTarget(event.target)) return;
    const holdAction = getSpacebarHoldAction();
    if (!holdAction) return;
    event.preventDefault();
    if (!activeHoldAction) {
      startHoldAction(holdAction);
    }
    return;
  }
  if (event.key === "Escape" && isDailyChallengesOpen) {
    isDailyChallengesOpen = false;
    renderDailyChallenges();
    return;
  }
  if (event.key === "Escape" && dailyChallengeCelebration) {
    closeDailyRewardModal();
    return;
  }
  if (event.key === "Escape" && achievementCelebration) {
    closeAchievementRewardModal();
    return;
  }
  if (event.key === "Escape" && isFavoriteTeamModalOpen) {
    dismissFavoriteTeamPrompt();
    return;
  }
  if (event.key === "Escape" && isProfileAchievementsModalOpen) {
    closeProfileAchievementsModal();
    return;
  }
  if (event.key === "Escape" && isProfileBadgeModalOpen) {
    closeProfileBadgeModal();
    return;
  }
  if (event.key === "Escape" && isProfileShowcaseModalOpen) {
    closeProfileShowcaseModal();
    return;
  }
  if (event.key === "Escape" && !cardPreviewModalEl.hidden) {
    closeCardPreview();
    return;
  }
  if (event.key === "Escape" && !openingPack && isPackModalOpen) {
    closePackModal();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code !== "Space") return;
  stopHoldAction(true);
});

const cardHoverSelector = ".flip-card, .collection-card, .reveal-card";
const cardTiltSelector = ".tilt-card, .tilt-pack";
const CARD_TILT_MAX = 15;
const CARD_TILT_DEAD_ZONE = 0.28;
const CARD_TILT_EXPONENT = 1.25;
const PREMIUM_CINEMATIC_ENTER_MS = 2000;
const PREMIUM_CINEMATIC_EXIT_MS = 750;
const HOLD_ACTION_DURATION_MS = 2000;
let activeTiltCard = null;
let pendingTiltCard = null;
let pendingTiltPoint = null;
let tiltFrame = 0;
let activeRarityFrameCard = null;
let rarityFrameAnimationHandle = 0;
let rarityFrameLastTimestamp = 0;
let activePremiumHoverShell = null;
const premiumHoverTimers = new WeakMap();
let activeHoldAction = null;
let holdActionFrame = 0;

function getCardRarityTextPaths(card) {
  return card ? [...card.querySelectorAll(".card-rarity-text-path")] : [];
}

function getCardRarityFrameCycle(card) {
  const frame = card?.querySelector?.(".card-rarity-frame");
  return Number(frame?.dataset?.rarityFrameCycle || 0);
}

function resetCardRarityFrame(card) {
  const textPaths = getCardRarityTextPaths(card);
  if (!textPaths.length) return;
  textPaths.forEach((textPath) => {
    textPath.setAttribute("startOffset", textPath.dataset.baseOffset || "0");
  });
  card.dataset.rarityFrameOffset = "0";
}

function stopRarityFrameMotion(reset = false) {
  if (rarityFrameAnimationHandle) {
    window.cancelAnimationFrame(rarityFrameAnimationHandle);
    rarityFrameAnimationHandle = 0;
  }
  rarityFrameLastTimestamp = 0;
  if (reset) resetCardRarityFrame(activeRarityFrameCard);
  activeRarityFrameCard = null;
}

function animateRarityFrame(timestamp) {
  if (!activeRarityFrameCard) {
    rarityFrameAnimationHandle = 0;
    rarityFrameLastTimestamp = 0;
    return;
  }
  const textPaths = getCardRarityTextPaths(activeRarityFrameCard);
  if (!textPaths.length) {
    stopRarityFrameMotion(false);
    return;
  }
  const cycleLength = getCardRarityFrameCycle(activeRarityFrameCard);
  if (!cycleLength) {
    stopRarityFrameMotion(false);
    return;
  }
  if (!rarityFrameLastTimestamp) rarityFrameLastTimestamp = timestamp;
  const deltaSeconds = (timestamp - rarityFrameLastTimestamp) / 1000;
  rarityFrameLastTimestamp = timestamp;
  const currentOffset = Number(activeRarityFrameCard.dataset.rarityFrameOffset || 0);
  const step = cycleLength / RARITY_FRAME_LOOP_SECONDS;
  const nextOffset = (currentOffset + deltaSeconds * step) % cycleLength;
  activeRarityFrameCard.dataset.rarityFrameOffset = String(nextOffset);
  textPaths.forEach((textPath) => {
    const baseOffset = Number(textPath.dataset.baseOffset || 0);
    textPath.setAttribute("startOffset", (baseOffset + nextOffset).toFixed(3));
  });
  rarityFrameAnimationHandle = window.requestAnimationFrame(animateRarityFrame);
}

function startRarityFrameMotion(card) {
  if (activeRarityFrameCard === card) return;
  stopRarityFrameMotion(false);
  const textPaths = getCardRarityTextPaths(card);
  if (!textPaths.length) return;
  activeRarityFrameCard = card;
  activeRarityFrameCard.dataset.rarityFrameOffset = activeRarityFrameCard.dataset.rarityFrameOffset || "0";
  rarityFrameLastTimestamp = 0;
  rarityFrameAnimationHandle = window.requestAnimationFrame(animateRarityFrame);
}

function getTiltEdgeStrength(value) {
  const absolute = Math.abs(value);
  if (absolute <= CARD_TILT_DEAD_ZONE) return 0;
  const scaled = (absolute - CARD_TILT_DEAD_ZONE) / (1 - CARD_TILT_DEAD_ZONE);
  return Math.sign(value) * (scaled ** CARD_TILT_EXPONENT);
}

function resetCardTilt(card) {
  if (!card) return;
  card.classList.remove("card-tilting");
  card.style.removeProperty("--card-tilt-x");
  card.style.removeProperty("--card-tilt-y");
}

function getPremiumHoverShell(target) {
  const shell = target?.closest?.(".card-shell");
  if (!shell) return null;
  return shell.querySelector(".legend-card, .blackmatter-card") ? shell : null;
}

function getPremiumHoverState(shell) {
  if (!shell) return null;
  const existing = premiumHoverTimers.get(shell);
  if (existing) return existing;
  const next = {
    enterTimer: 0,
    exitTimer: 0,
  };
  premiumHoverTimers.set(shell, next);
  return next;
}

function clearPremiumHoverTimer(timerId) {
  if (timerId) window.clearTimeout(timerId);
}

function startPremiumHover(shell) {
  if (!shell) return;
  const stateForShell = getPremiumHoverState(shell);
  clearPremiumHoverTimer(stateForShell.exitTimer);
  stateForShell.exitTimer = 0;
  shell.classList.add("premium-hovering");
  if (shell.classList.contains("premium-cinematic")) return;
  clearPremiumHoverTimer(stateForShell.enterTimer);
  stateForShell.enterTimer = window.setTimeout(() => {
    shell.classList.add("premium-cinematic");
    stateForShell.enterTimer = 0;
  }, PREMIUM_CINEMATIC_ENTER_MS);
}

function stopPremiumHover(shell, immediate = false) {
  if (!shell) return;
  const stateForShell = getPremiumHoverState(shell);
  clearPremiumHoverTimer(stateForShell.enterTimer);
  stateForShell.enterTimer = 0;
  clearPremiumHoverTimer(stateForShell.exitTimer);
  stateForShell.exitTimer = 0;
  if (immediate) {
    shell.classList.remove("premium-hovering", "premium-cinematic");
    return;
  }
  if (!shell.classList.contains("premium-cinematic")) {
    shell.classList.remove("premium-hovering");
    return;
  }
  stateForShell.exitTimer = window.setTimeout(() => {
    shell.classList.remove("premium-hovering", "premium-cinematic");
    stateForShell.exitTimer = 0;
  }, PREMIUM_CINEMATIC_EXIT_MS);
}

function applyCardTilt(card, point) {
  if (!card || !point) return;
  const rect = card.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const normalizedX = ((point.clientX - rect.left) / rect.width) * 2 - 1;
  const normalizedY = ((point.clientY - rect.top) / rect.height) * 2 - 1;
  const edgeX = getTiltEdgeStrength(Math.max(-1, Math.min(1, normalizedX)));
  const edgeY = getTiltEdgeStrength(Math.max(-1, Math.min(1, normalizedY)));
  card.classList.add("card-tilting");
  card.style.setProperty("--card-tilt-x", `${(-edgeY * CARD_TILT_MAX).toFixed(2)}deg`);
  card.style.setProperty("--card-tilt-y", `${(edgeX * CARD_TILT_MAX).toFixed(2)}deg`);
}

function queueCardTilt(card, point) {
  pendingTiltCard = card;
  pendingTiltPoint = point;
  if (tiltFrame) return;
  tiltFrame = window.requestAnimationFrame(() => {
    tiltFrame = 0;
    applyCardTilt(pendingTiltCard, pendingTiltPoint);
  });
}

function isInteractiveTextTarget(target) {
  return target instanceof HTMLElement
    && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|OPTION)$/.test(target.tagName));
}

function setHoldButtonProgress(button, progress) {
  if (!button) return;
  button.style.setProperty("--hold-progress", `${Math.max(0, Math.min(1, progress)) * 100}%`);
}

function stopHoldAction(reset = true) {
  if (holdActionFrame) {
    window.cancelAnimationFrame(holdActionFrame);
    holdActionFrame = 0;
  }
  if (reset && activeHoldAction?.button) {
    activeHoldAction.button.classList.remove("hold-active", "hold-complete");
    setHoldButtonProgress(activeHoldAction.button, 0);
  }
  activeHoldAction = null;
}

function getSpacebarHoldAction() {
  if (!isPackModalOpen) return null;
  if (openingPack && !revealAllCardsEl.hidden && !revealAllCardsEl.disabled) {
    return {
      id: "skip",
      button: revealAllCardsEl,
      trigger: () => revealAllPackCards(),
    };
  }
  if (!openingPack && !openAnotherPackEl.hidden && !openAnotherPackEl.disabled) {
    return {
      id: "open",
      button: openAnotherPackEl,
      trigger: () => reopenCurrentPack(),
    };
  }
  return null;
}

function tickHoldAction(timestamp) {
  if (!activeHoldAction) {
    holdActionFrame = 0;
    return;
  }
  const elapsed = timestamp - activeHoldAction.startedAt;
  const progress = Math.max(0, Math.min(1, elapsed / HOLD_ACTION_DURATION_MS));
  activeHoldAction.button.classList.add("hold-active");
  setHoldButtonProgress(activeHoldAction.button, progress);
  if (progress >= 1 && !activeHoldAction.fired) {
    activeHoldAction.fired = true;
    activeHoldAction.button.classList.add("hold-complete");
    activeHoldAction.trigger();
  }
  holdActionFrame = window.requestAnimationFrame(tickHoldAction);
}

function startHoldAction(action) {
  stopHoldAction(true);
  activeHoldAction = {
    ...action,
    startedAt: performance.now(),
    fired: false,
  };
  holdActionFrame = window.requestAnimationFrame(tickHoldAction);
}

document.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") {
    resetCardTilt(activeTiltCard);
    activeTiltCard = null;
    return;
  }
  const target = event.target instanceof Element ? event.target.closest(cardTiltSelector) : null;
  if (target !== activeTiltCard) {
    resetCardTilt(activeTiltCard);
    activeTiltCard = target;
  }
  if (!target) return;
  queueCardTilt(target, { clientX: event.clientX, clientY: event.clientY });
});

document.addEventListener("pointerover", (event) => {
  if (event.pointerType === "touch") return;
  const tiltTarget = event.target instanceof Element ? event.target.closest(cardTiltSelector) : null;
  const hoverTarget = event.target instanceof Element ? event.target.closest(cardHoverSelector) : null;
  if (tiltTarget && tiltTarget !== activeTiltCard) {
    resetCardTilt(activeTiltCard);
    activeTiltCard = tiltTarget;
  }
  if (tiltTarget) {
    queueCardTilt(tiltTarget, { clientX: event.clientX, clientY: event.clientY });
  }
  if (!hoverTarget) return;
  startRarityFrameMotion(hoverTarget);
  const premiumShell = getPremiumHoverShell(hoverTarget);
  if (premiumShell) {
    activePremiumHoverShell = premiumShell;
    startPremiumHover(premiumShell);
  }
});

document.addEventListener("pointerout", (event) => {
  if (!(event.target instanceof Element)) return;
  const tiltCard = event.target.closest(cardTiltSelector);
  const relatedTiltCard = event.relatedTarget instanceof Element ? event.relatedTarget.closest(cardTiltSelector) : null;
  if (tiltCard && tiltCard !== relatedTiltCard) {
    resetCardTilt(tiltCard);
    if (activeTiltCard === tiltCard) activeTiltCard = null;
  }
  const hoverCard = event.target.closest(cardHoverSelector);
  const relatedHoverCard = event.relatedTarget instanceof Element ? event.relatedTarget.closest(cardHoverSelector) : null;
  if (!hoverCard || hoverCard === relatedHoverCard) return;
  if (activeRarityFrameCard === hoverCard) stopRarityFrameMotion(false);
  const premiumShell = getPremiumHoverShell(hoverCard);
  const relatedPremiumShell = getPremiumHoverShell(event.relatedTarget instanceof Element ? event.relatedTarget : null);
  if (premiumShell && premiumShell !== relatedPremiumShell) {
    if (activePremiumHoverShell === premiumShell) activePremiumHoverShell = null;
    stopPremiumHover(premiumShell);
  }
});

window.addEventListener("blur", () => {
  resetCardTilt(activeTiltCard);
  activeTiltCard = null;
  stopRarityFrameMotion(false);
  stopPremiumHover(activePremiumHoverShell, true);
  activePremiumHoverShell = null;
  stopHoldAction(true);
});

let lastPackRenderKey = "";

const initialAchievementSync = reconcileAchievements({ showCelebration: false });
if (initialAchievementSync.changed) saveState();
renderAll();
