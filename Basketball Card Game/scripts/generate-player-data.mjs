import { writeFile } from "node:fs/promises";

const SEASON = "2025-26";
const STAT_SEASONS = [SEASON, "2024-25", "2023-24"];
const OUTPUT_FILE = new URL("../player-data.js", import.meta.url);

const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.nba.com/",
  Origin: "https://www.nba.com",
  "x-nba-stats-origin": "stats",
  "x-nba-stats-token": "true",
};

const NBA_TEAMS = [
  { id: "hawks", teamId: 1610612737, name: "Atlanta Hawks", shortName: "Hawks", abbreviation: "ATL", conference: "East", division: "Southeast", colors: { primary: "#C8102E", secondary: "#FDB927" } },
  { id: "celtics", teamId: 1610612738, name: "Boston Celtics", shortName: "Celtics", abbreviation: "BOS", conference: "East", division: "Atlantic", colors: { primary: "#007A33", secondary: "#BA9653" } },
  { id: "nets", teamId: 1610612751, name: "Brooklyn Nets", shortName: "Nets", abbreviation: "BKN", conference: "East", division: "Atlantic", colors: { primary: "#000000", secondary: "#FFFFFF" } },
  { id: "hornets", teamId: 1610612766, name: "Charlotte Hornets", shortName: "Hornets", abbreviation: "CHA", conference: "East", division: "Southeast", colors: { primary: "#1D1160", secondary: "#00788C" } },
  { id: "bulls", teamId: 1610612741, name: "Chicago Bulls", shortName: "Bulls", abbreviation: "CHI", conference: "East", division: "Central", colors: { primary: "#CE1141", secondary: "#000000" } },
  { id: "cavaliers", teamId: 1610612739, name: "Cleveland Cavaliers", shortName: "Cavaliers", abbreviation: "CLE", conference: "East", division: "Central", colors: { primary: "#6F263D", secondary: "#FFB81C" } },
  { id: "mavericks", teamId: 1610612742, name: "Dallas Mavericks", shortName: "Mavericks", abbreviation: "DAL", conference: "West", division: "Southwest", colors: { primary: "#00538C", secondary: "#B8C4CA" } },
  { id: "nuggets", teamId: 1610612743, name: "Denver Nuggets", shortName: "Nuggets", abbreviation: "DEN", conference: "West", division: "Northwest", colors: { primary: "#0E2240", secondary: "#FEC524" } },
  { id: "pistons", teamId: 1610612765, name: "Detroit Pistons", shortName: "Pistons", abbreviation: "DET", conference: "East", division: "Central", colors: { primary: "#C8102E", secondary: "#1D42BA" } },
  { id: "warriors", teamId: 1610612744, name: "Golden State Warriors", shortName: "Warriors", abbreviation: "GSW", conference: "West", division: "Pacific", colors: { primary: "#1D428A", secondary: "#FFC72C" } },
  { id: "rockets", teamId: 1610612745, name: "Houston Rockets", shortName: "Rockets", abbreviation: "HOU", conference: "West", division: "Southwest", colors: { primary: "#CE1141", secondary: "#C4CED4" } },
  { id: "pacers", teamId: 1610612754, name: "Indiana Pacers", shortName: "Pacers", abbreviation: "IND", conference: "East", division: "Central", colors: { primary: "#002D62", secondary: "#FDBB30" } },
  { id: "clippers", teamId: 1610612746, name: "LA Clippers", shortName: "Clippers", abbreviation: "LAC", conference: "West", division: "Pacific", colors: { primary: "#C8102E", secondary: "#1D428A" } },
  { id: "lakers", teamId: 1610612747, name: "Los Angeles Lakers", shortName: "Lakers", abbreviation: "LAL", conference: "West", division: "Pacific", colors: { primary: "#552583", secondary: "#FDB927" } },
  { id: "grizzlies", teamId: 1610612763, name: "Memphis Grizzlies", shortName: "Grizzlies", abbreviation: "MEM", conference: "West", division: "Southwest", colors: { primary: "#5D76A9", secondary: "#12173F" } },
  { id: "heat", teamId: 1610612748, name: "Miami Heat", shortName: "Heat", abbreviation: "MIA", conference: "East", division: "Southeast", colors: { primary: "#98002E", secondary: "#F9A01B" } },
  { id: "bucks", teamId: 1610612749, name: "Milwaukee Bucks", shortName: "Bucks", abbreviation: "MIL", conference: "East", division: "Central", colors: { primary: "#00471B", secondary: "#EEE1C6" } },
  { id: "timberwolves", teamId: 1610612750, name: "Minnesota Timberwolves", shortName: "Timberwolves", abbreviation: "MIN", conference: "West", division: "Northwest", colors: { primary: "#0C2340", secondary: "#78BE20" } },
  { id: "pelicans", teamId: 1610612740, name: "New Orleans Pelicans", shortName: "Pelicans", abbreviation: "NOP", conference: "West", division: "Southwest", colors: { primary: "#0C2340", secondary: "#C8102E" } },
  { id: "knicks", teamId: 1610612752, name: "New York Knicks", shortName: "Knicks", abbreviation: "NYK", conference: "East", division: "Atlantic", colors: { primary: "#F58426", secondary: "#006BB6" } },
  { id: "thunder", teamId: 1610612760, name: "Oklahoma City Thunder", shortName: "Thunder", abbreviation: "OKC", conference: "West", division: "Northwest", colors: { primary: "#007AC1", secondary: "#EF3B24" } },
  { id: "magic", teamId: 1610612753, name: "Orlando Magic", shortName: "Magic", abbreviation: "ORL", conference: "East", division: "Southeast", colors: { primary: "#0077C0", secondary: "#C4CED4" } },
  { id: "76ers", teamId: 1610612755, name: "Philadelphia 76ers", shortName: "76ers", abbreviation: "PHI", conference: "East", division: "Atlantic", colors: { primary: "#006BB6", secondary: "#ED174C" } },
  { id: "suns", teamId: 1610612756, name: "Phoenix Suns", shortName: "Suns", abbreviation: "PHX", conference: "West", division: "Pacific", colors: { primary: "#1D1160", secondary: "#E56020" } },
  { id: "blazers", teamId: 1610612757, name: "Portland Trail Blazers", shortName: "Blazers", abbreviation: "POR", conference: "West", division: "Northwest", colors: { primary: "#E03A3E", secondary: "#000000" } },
  { id: "kings", teamId: 1610612758, name: "Sacramento Kings", shortName: "Kings", abbreviation: "SAC", conference: "West", division: "Pacific", colors: { primary: "#5A2D81", secondary: "#63727A" } },
  { id: "spurs", teamId: 1610612759, name: "San Antonio Spurs", shortName: "Spurs", abbreviation: "SAS", conference: "West", division: "Southwest", colors: { primary: "#C4CED4", secondary: "#000000" } },
  { id: "raptors", teamId: 1610612761, name: "Toronto Raptors", shortName: "Raptors", abbreviation: "TOR", conference: "East", division: "Atlantic", colors: { primary: "#CE1141", secondary: "#000000" } },
  { id: "jazz", teamId: 1610612762, name: "Utah Jazz", shortName: "Jazz", abbreviation: "UTA", conference: "West", division: "Northwest", colors: { primary: "#002B5C", secondary: "#F9A01B" } },
  { id: "wizards", teamId: 1610612764, name: "Washington Wizards", shortName: "Wizards", abbreviation: "WAS", conference: "East", division: "Southeast", colors: { primary: "#002B5C", secondary: "#E31837" } },
];

const HALL_OF_FAME_ROSTER = [
  { name: "Michael Jordan", position: "G", jersey: "23", ability: 100, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jordan%20by%20Lipofsky%2016577.jpg", imagePosition: "50% 12%", imageScale: 1.07 },
  { name: "Kareem Abdul-Jabbar", position: "C", jersey: "33", ability: 100, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kareem-Abdul-Jabbar%20Lipofsky%20%28HQ%29%20%28cropped%29.jpg", imagePosition: "50% 12%" },
  { name: "Magic Johnson", position: "G", jersey: "32", ability: 99, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Magic%20Johnson%20Steve%20Lipofsky.jpg", imagePosition: "44% 14%", imageScale: 1.09 },
  { name: "Larry Bird", position: "F", jersey: "33", ability: 99, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Larry%20Bird%20Lipofsky%20%28high%20quality%29.jpg", imagePosition: "48% 14%", imageScale: 1.03 },
  { name: "Kobe Bryant", position: "G", jersey: "24", ability: 99, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bryant%20about%20to%20dunk%202008.jpg", imagePosition: "50% 12%" },
  { name: "Tim Duncan", position: "F-C", jersey: "21", ability: 99, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tim%20Duncan.jpg", imagePosition: "50% 12%", imageScale: 1.02 },
  { name: "Wilt Chamberlain", position: "C", jersey: "13", ability: 99, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Wilt%20Chamberlain3.jpg", imagePosition: "50% 10%" },
  { name: "Bill Russell", position: "C", jersey: "6", ability: 99, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bill%20russell%20dribbling.jpg", imagePosition: "50% 12%" },
  { name: "Hakeem Olajuwon", position: "C", jersey: "34", ability: 98, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hakeem.jpg", imagePosition: "52% 14%", imageScale: 1.08 },
  { name: "Shaquille O'Neal", position: "C", jersey: "34", ability: 98, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shaquille%20O%27Neal.jpg", imagePosition: "50% 12%", imageScale: 1.05 },
  { name: "Jerry West", position: "G", jersey: "44", ability: 98, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jerry%20West%20Lakers%201972%20champions.jpg", imagePosition: "50% 10%", imageScale: 1.03 },
  { name: "Oscar Robertson", position: "G", jersey: "1", ability: 98, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Oscar%20Robertson%20Bucks.jpeg", imagePosition: "50% 12%", imageScale: 1.02 },
  { name: "Julius Erving", position: "F", jersey: "6", ability: 97, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Julius%20Erving%20UMass.jpg", imagePosition: "50% 12%" },
  { name: "Dirk Nowitzki", position: "F", jersey: "41", ability: 97, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dirk%20Nowitzki%20shooting%20February%202013.jpg", imagePosition: "52% 16%", imageScale: 1.08 },
  { name: "Charles Barkley", position: "F", jersey: "34", ability: 96, image: "https://commons.wikimedia.org/wiki/Special:FilePath/Barkley%20Lipofsky.jpg", imagePosition: "50% 12%", imageScale: 1.02 },
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function headshotUrl(personId) {
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${personId}.png`;
}

function buildUrl(endpoint, params) {
  const url = new URL(`https://stats.nba.com/stats/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url;
}

async function requestJson(endpoint, params) {
  let lastError = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      const response = await fetch(buildUrl(endpoint, params), { headers: REQUEST_HEADERS });
      if (!response.ok) {
        throw new Error(`${endpoint} failed with ${response.status}`);
      }
      return response.json();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }

  throw lastError;
}

function readResultSet(payload, preferredName) {
  if (Array.isArray(payload.resultSets)) {
    const target = preferredName
      ? payload.resultSets.find((set) => set.name === preferredName)
      : payload.resultSets[0];
    if (!target) {
      throw new Error(`Result set "${preferredName}" not found.`);
    }
    return rowsFromSet(target);
  }

  if (payload.resultSet) {
    return rowsFromSet(payload.resultSet);
  }

  throw new Error("Unknown NBA response format.");
}

function rowsFromSet(resultSet) {
  const headers = resultSet.headers || [];
  return (resultSet.rowSet || []).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])),
  );
}

function parseExperience(rosterRow) {
  const expText = String(rosterRow?.EXP || "").trim();
  if (!expText || expText === "R") return 0;
  return Number(expText) || 0;
}

function getSeasonPerformance(statRow) {
  if (!statRow) return 0;
  const points = Number(statRow.PTS || 0);
  const assists = Number(statRow.AST || 0);
  const rebounds = Number(statRow.REB || 0);
  const steals = Number(statRow.STL || 0);
  const blocks = Number(statRow.BLK || 0);
  const turnovers = Number(statRow.TOV || 0);
  const minutes = Number(statRow.MIN || 0);
  const threesMade = Number(statRow.FG3M || 0);
  const fieldGoalPct = Number(statRow.FG_PCT || 0);
  const threePointPct = Number(statRow.FG3_PCT || 0);
  const freeThrowPct = Number(statRow.FT_PCT || 0);

  const skillScore =
    points * 1.28 +
    assists * 1.58 +
    rebounds * 0.78 +
    steals * 2.45 +
    blocks * 2.7 +
    threesMade * 0.5;
  const scoringLoadBonus =
    Math.max(0, points - 20) * 0.45 +
    Math.max(0, points - 25) * 0.95 +
    Math.max(0, points - 30) * 1.25;
  const playmakingPeakBonus =
    Math.max(0, assists - 6) * 0.75 +
    Math.max(0, assists - 9) * 0.9;
  const rimProtectionBonus =
    Math.max(0, blocks - 1.4) * 3.1 +
    Math.max(0, blocks - 2.6) * 1.9;
  const disruptionBonus = Math.max(0, steals - 1.4) * 1.7;
  const shootingBonus =
    Math.max(0, fieldGoalPct - 0.44) * 7 +
    Math.max(0, threePointPct - 0.34) * 5 +
    Math.max(0, freeThrowPct - 0.75) * 2.5;
  const turnoverPenalty = turnovers * 1.05;
  const roleFactor = 0.3 + 0.7 * Math.min(minutes, 36) / 36;
  return Math.max(
    0,
    skillScore +
      scoringLoadBonus +
      playmakingPeakBonus +
      rimProtectionBonus +
      disruptionBonus +
      shootingBonus -
      turnoverPenalty,
  ) * roleFactor + roleFactor * 6;
}

function getSeasonSampleWeight(statRow, seasonIndex) {
  if (!statRow) return 0;
  const gamesPlayed = Number(statRow.GP || 0);
  const minutes = Number(statRow.MIN || 0);
  const totalMinutes = gamesPlayed * minutes;
  const minuteWeight = 0.14 + 0.86 * Math.sqrt(Math.min(totalMinutes, 2400) / 2400);
  const gamesWeight = 0.18 + 0.82 * Math.min(gamesPlayed, 70) / 70;
  const recencyWeight =
    seasonIndex === 0 ? 1 :
    seasonIndex === 1 ? 0.68 :
    seasonIndex === 2 ? 0.42 :
    Math.max(0.3, 1 - seasonIndex * 0.24);
  return minuteWeight * gamesWeight * recencyWeight;
}

function getSeasonProfile(statRow, seasonIndex) {
  const gamesPlayed = Number(statRow?.GP || 0);
  const minutes = Number(statRow?.MIN || 0);
  const totalMinutes = gamesPlayed * minutes;
  return {
    statRow,
    seasonIndex,
    gamesPlayed,
    minutes,
    totalMinutes,
    impact: getSeasonPerformance(statRow),
    weight: getSeasonSampleWeight(statRow, seasonIndex),
  };
}

function scorePlayer(seasonStats, rosterRow) {
  const experience = parseExperience(rosterRow);
  const profiles = seasonStats.map((statRow, seasonIndex) => getSeasonProfile(statRow, seasonIndex));
  const weightedProfiles = profiles.filter((profile) => profile.weight > 0 && profile.impact > 0);

  if (!weightedProfiles.length) {
    return 5 + experience * 0.75;
  }

  const totalWeight = weightedProfiles.reduce((sum, profile) => sum + profile.weight, 0);
  const blendedImpact = weightedProfiles.reduce((sum, profile) => sum + profile.impact * profile.weight, 0) / totalWeight;
  const currentImpact = profiles[0]?.impact || 0;
  const currentWeight = profiles[0]?.weight || 0;
  const priorProfiles = weightedProfiles.filter((profile) => profile.seasonIndex > 0);
  const priorPeakImpact = priorProfiles.length ? Math.max(...priorProfiles.map((profile) => profile.impact)) : 0;
  const priorStarStrength = Math.max(0, Math.min(1, (priorPeakImpact - 50) / 10));
  const currentStarStrength = Math.max(0, Math.min(1, (currentImpact - 52) / 10));
  const experienceStrength = Math.min(1, experience / 6);
  const currentAbsence = Math.max(0, 0.92 - currentWeight);
  const injuryCarryBonus = priorPeakImpact * priorStarStrength * experienceStrength * currentAbsence * 0.1;
  const currentSeasonBonus =
    currentImpact * currentStarStrength * Math.min(1, currentWeight / 0.85) * 0.08;
  const lowEvidencePenalty =
    currentWeight < 0.55 && priorPeakImpact < 54
      ? (0.55 - currentWeight) * 10
      : 0;
  const veteranAvailabilityPenalty =
    experience >= 9 && currentWeight < 0.72
      ? (0.72 - currentWeight) * (6 + Math.min(6, experience - 8))
      : 0;
  const agingLowMinutesPenalty =
    experience >= 11 && currentWeight < 0.58
      ? (0.58 - currentWeight) * 12
      : 0;
  const experienceBonus = Math.min(experience, 10) * 0.12;

  return blendedImpact + injuryCarryBonus + currentSeasonBonus + experienceBonus - lowEvidencePenalty - veteranAvailabilityPenalty - agingLowMinutesPenalty;
}

function ratingCapForPlayer(seasonStats, rosterRow) {
  const experience = parseExperience(rosterRow);
  const currentProfile = getSeasonProfile(seasonStats[0], 0);
  const priorProfiles = seasonStats
    .slice(1)
    .map((statRow, index) => getSeasonProfile(statRow, index + 1))
    .filter((profile) => profile.weight > 0 && profile.impact > 0);

  if (!currentProfile.statRow && !priorProfiles.length) {
    return experience === 0 ? 80 : Math.min(84, 81 + experience);
  }

  const gamesPlayed = currentProfile.gamesPlayed;
  const totalMinutes = currentProfile.totalMinutes;
  let cap = 99;
  if (gamesPlayed < 5 || totalMinutes < 80) cap = 82;
  else if (gamesPlayed < 10 || totalMinutes < 160) cap = 84;
  else if (gamesPlayed < 18 || totalMinutes < 320) cap = 86;
  else if (gamesPlayed < 28 || totalMinutes < 560) cap = 89;
  else if (gamesPlayed < 40 || totalMinutes < 900) cap = 92;
  else if (gamesPlayed < 55 || totalMinutes < 1250) cap = 94;

  if (experience === 0) {
    if (gamesPlayed < 20 || totalMinutes < 400) cap = Math.min(cap, 83);
    else if (gamesPlayed < 35 || totalMinutes < 700) cap = Math.min(cap, 86);
    else if (gamesPlayed < 50 || totalMinutes < 1100) cap = Math.min(cap, 89);
    else cap = Math.min(cap, 91);
  } else if (experience === 1) {
    if (gamesPlayed < 20 || totalMinutes < 400) cap = Math.min(cap, 84);
    else if (gamesPlayed < 40 || totalMinutes < 850) cap = Math.min(cap, 88);
    else cap = Math.min(cap, 92);
  } else if (experience === 2) {
    if (gamesPlayed < 25 || totalMinutes < 500) cap = Math.min(cap, 86);
    else if (gamesPlayed < 45 || totalMinutes < 1000) cap = Math.min(cap, 90);
    else cap = Math.min(cap, 94);
  }

  const lowCurrentEvidence = !currentProfile.statRow || gamesPlayed < 45 || totalMinutes < 1000;
  if (lowCurrentEvidence && priorProfiles.length) {
    const priorPeakImpact = Math.max(...priorProfiles.map((profile) => profile.impact));
    const priorStarCap =
      priorPeakImpact >= 62 ? 97 :
      priorPeakImpact >= 58 ? 96 :
      priorPeakImpact >= 54 ? 95 :
      priorPeakImpact >= 50 ? 93 :
      priorPeakImpact >= 46 ? 91 :
      0;
    const hasEliteResume = priorPeakImpact >= 58 || (experience >= 4 && priorPeakImpact >= 54);
    const hasStrongResume = priorPeakImpact >= 50 && experience >= 2;
    if (hasEliteResume && priorStarCap) {
      cap = Math.max(cap, priorStarCap);
    } else if (hasStrongResume && priorStarCap) {
      cap = Math.max(cap, Math.min(priorStarCap, 93));
    }
  }

  return cap;
}

const CURRENT_PLAYER_RATING_BANDS = [
  { minPercentile: 99.98, ability: 99 },
  { minPercentile: 99.72, ability: 98 },
  { minPercentile: 99.3, ability: 97 },
  { minPercentile: 98.7, ability: 96 },
  { minPercentile: 97.6, ability: 95 },
  { minPercentile: 96.0, ability: 94 },
  { minPercentile: 93.5, ability: 93 },
  { minPercentile: 90.3, ability: 92 },
  { minPercentile: 86.2, ability: 91 },
  { minPercentile: 81.0, ability: 90 },
  { minPercentile: 74.5, ability: 89 },
  { minPercentile: 67.0, ability: 88 },
  { minPercentile: 59.0, ability: 87 },
  { minPercentile: 50.0, ability: 86 },
  { minPercentile: 42.0, ability: 85 },
  { minPercentile: 34.0, ability: 84 },
  { minPercentile: 26.0, ability: 83 },
  { minPercentile: 19.0, ability: 82 },
  { minPercentile: 12.5, ability: 81 },
  { minPercentile: 7.0, ability: 80 },
  { minPercentile: 3.0, ability: 79 },
  { minPercentile: 0, ability: 78 },
];

function ratingFromRank(rankFraction) {
  const percentile = (1 - rankFraction) * 100;
  return CURRENT_PLAYER_RATING_BANDS.find((band) => percentile >= band.minPercentile)?.ability ?? 78;
}

function buildAbilityMap(currentPlayers) {
  const scored = currentPlayers.map((player) => ({ ...player, score: scorePlayer(player.seasonStats, player.rosterRow) }));
  const sorted = [...scored].sort((a, b) => b.score - a.score || a.personId - b.personId);
  const byId = new Map();

  sorted.forEach((player, index) => {
    const rankFraction = sorted.length <= 1 ? 0 : index / (sorted.length - 1);
    const percentileRating = ratingFromRank(rankFraction);
    byId.set(player.personId, Math.min(percentileRating, ratingCapForPlayer(player.seasonStats, player.rosterRow)));
  });

  return byId;
}

function sortRoster(players) {
  return [...players].sort((a, b) => {
    if (b.ability !== a.ability) return b.ability - a.ability;
    return a.name.localeCompare(b.name);
  });
}

async function buildData() {
  const statsPayloads = [];
  for (const season of STAT_SEASONS) {
    statsPayloads.push(
      await requestJson("leaguedashplayerstats", {
        College: "",
        Conference: "",
        Country: "",
        DateFrom: "",
        DateTo: "",
        Division: "",
        DraftPick: "",
        DraftYear: "",
        GameScope: "",
        GameSegment: "",
        Height: "",
        LastNGames: "0",
        LeagueID: "00",
        Location: "",
        MeasureType: "Base",
        Month: "0",
        OpponentTeamID: "0",
        Outcome: "",
        PORound: "0",
        PaceAdjust: "N",
        PerMode: "PerGame",
        Period: "0",
        PlayerExperience: "",
        PlayerPosition: "",
        PlusMinus: "N",
        Rank: "N",
        Season: season,
        SeasonSegment: "",
        SeasonType: "Regular Season",
        ShotClockRange: "",
        StarterBench: "",
        TeamID: "0",
        TwoWay: "0",
        VsConference: "",
        VsDivision: "",
        Weight: "",
      }),
    );
  }

  const historicalPlayersPayload = await requestJson("commonallplayers", {
    IsOnlyCurrentSeason: "0",
    LeagueID: "00",
    Season: SEASON,
  });

  const rosterPayloads = [];
  for (const team of NBA_TEAMS) {
    const rosterPayload = await requestJson("commonteamroster", {
      LeagueID: "00",
      Season: SEASON,
      TeamID: String(team.teamId),
    });

    rosterPayloads.push({
      team,
      roster: readResultSet(rosterPayload, "CommonTeamRoster"),
    });
  }

  const statsBySeason = new Map(
    statsPayloads.map((payload, index) => {
      const rows = readResultSet(payload, "LeagueDashPlayerStats");
      return [
        STAT_SEASONS[index],
        new Map(rows.map((row) => [Number(row.PLAYER_ID), row])),
      ];
    }),
  );
  const historicalPlayers = readResultSet(historicalPlayersPayload, "CommonAllPlayers");
  const historicalByName = new Map(
    historicalPlayers.map((row) => [normalizeName(row.DISPLAY_FIRST_LAST), Number(row.PERSON_ID)]),
  );

  const rosterPlayers = rosterPayloads.flatMap(({ team, roster }) =>
    roster.map((player) => ({
      team,
      personId: Number(player.PLAYER_ID),
      rosterRow: player,
      seasonStats: STAT_SEASONS.map((season) => statsBySeason.get(season)?.get(Number(player.PLAYER_ID)) || null),
    })),
  );
  const abilityById = buildAbilityMap(rosterPlayers);

  const sets = rosterPayloads
    .map(({ team, roster }) => ({
      id: team.id,
      teamId: team.teamId,
      name: team.name,
      shortName: team.shortName,
      abbreviation: team.abbreviation,
      conference: team.conference,
      division: team.division,
      colors: team.colors,
      players: sortRoster(
        roster.map((player) => ({
          name: player.PLAYER,
          personId: Number(player.PLAYER_ID),
          position: player.POSITION || "G-F",
          jersey: player.NUM || "--",
          ability: abilityById.get(Number(player.PLAYER_ID)) || 80,
          image: headshotUrl(player.PLAYER_ID),
        })),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const hallPlayers = HALL_OF_FAME_ROSTER.map((player) => {
    const personId = historicalByName.get(normalizeName(player.name));
    if (!personId) {
      throw new Error(`Could not find PERSON_ID for Hall of Famer: ${player.name}`);
    }

    return {
      ...player,
      personId,
      image: player.image || headshotUrl(personId),
    };
  });

  sets.push({
    id: "hall-of-fame",
    teamId: 0,
    name: "Hall Of Fame Legends",
    shortName: "Legends",
    abbreviation: "HOF",
    conference: "Special",
    division: "Legacy",
    colors: { primary: "#7A5C00", secondary: "#F4C542" },
    players: sortRoster(hallPlayers),
  });

  return {
    version: "2025-26-live",
    season: SEASON,
    generatedAt: new Date().toISOString(),
    source: "Official NBA stats endpoints, NBA headshot CDN, and Wikimedia Commons legend imagery",
    sets,
  };
}

const data = await buildData();
await writeFile(
  OUTPUT_FILE,
  `window.BASKETBALL_CARD_DATA = ${JSON.stringify(data, null, 2)};\n`,
  "utf8",
);

const playerCount = data.sets.reduce((sum, set) => sum + set.players.length, 0);
console.log(`Wrote ${playerCount} cards across ${data.sets.length} sets to ${OUTPUT_FILE.pathname}`);
