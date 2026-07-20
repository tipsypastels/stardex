#!/usr/bin/env node
// @ts-check

import * as fs from "node:fs/promises";
import * as process from "node:process";

/**
 * @typedef {{
 *  count: number,
 *  next: string | null,
 *  results: { url: string }[],
 * }} Segment
 *
 * @typedef {{
 *  id: number,
 *  name: string,
 *  names?: { name: string, language: { name: string } }[]
 *  evolution_chain?:  { url: string }
 *  evolves_from_species?: { name: string }
 *  varieties: { is_default: boolean, pokemon: { name: string, url: string }}[]
 * }} PokemonSpecies
 *
 * @typedef {{
 *  id: number,
 *  is_default: boolean,
 *  types: { type: { name: string } }[]
 * }} Pokemon
 *
 * @typedef {{
 *  chain: PokemonEvosEntry
 * }} PokemonEvos
 *
 * @typedef {{
 *  species: { name: string }
 *  evolves_to?: PokemonEvosEntry[]
 * }} PokemonEvosEntry
 *
 * @typedef {{
 *  id: number,
 *  key: string,
 *  name: string,
 *  hiddenName?: string;
 *  noAltName?: string;
 *  types: string[],
 *  evos?: { from?: string, to?: string[] }
 *  alts?: { kind: string, name: string, types: string[], iconIndex: number }[]
 * }} ResolvedMon
 */

/** @type {Record<string, PokemonSpecies['varieties']>} */
const OVERRIDE_VARIETIES = {
  // PokeAPI considers meteor to be the default form, Smogon considers red core. Defer to Smogon.
  // Also PokeAPI has variants for every colour the meteor form can become, which is useless.
  // Both have the core colours, which are only cosmetic so ignore those too..
  minior: [
    {
      is_default: true,
      pokemon: {
        name: "minior-core",
        url: "https://pokeapi.co/api/v2/pokemon/10136/",
      },
    },
    {
      is_default: false,
      pokemon: {
        name: "minior-meteor",
        url: "https://pokeapi.co/api/v2/pokemon/774/",
      },
    },
  ],
  // PokeAPI (unlike Smogon and Bulbapedia) considers Toxtricity to have two GMax forms based on the base form.
  // Override that and change the form name to just toxtricity-gmax.
  toxtricity: [
    {
      is_default: true,
      pokemon: {
        name: "toxtricity-amped",
        url: "https://pokeapi.co/api/v2/pokemon/849/",
      },
    },
    {
      is_default: false,
      pokemon: {
        name: "toxtricity-low-key",
        url: "https://pokeapi.co/api/v2/pokemon/10184/",
      },
    },
    {
      is_default: false,
      pokemon: {
        name: "toxtricity-gmax",
        url: "https://pokeapi.co/api/v2/pokemon/10219/",
      },
    },
  ],
  // PokeAPI (and Bulbapedia) consider Fo4 to be the default form, but Smogon's icon sheet considers Fo3.
  // Since default forms can't currently have their icon sheet positions overridden, we defer to Smogon.
  maushold: [
    {
      is_default: true,
      pokemon: {
        name: "maushold-family-of-three",
        url: "https://pokeapi.co/api/v2/pokemon/10257/",
      },
    },
    {
      is_default: false,
      pokemon: {
        name: "maushold-family-of-four",
        url: "https://pokeapi.co/api/v2/pokemon/925/",
      },
    },
  ],
};

const SKIPPED_VARIETY_NAME_PATTERNS = [/-totem-/, /-totem$/];
const SKIPPED_VARIETY_NAMES = new Set([
  // LGPE gimmicks
  "eevee-starter",
  "pikachu-starter",
  // All meaningless
  "pikachu-rock-star",
  "pikachu-belle",
  "pikachu-pop-star",
  "pikachu-phd",
  "pikachu-libre",
  "pikachu-cosplay",
  "pikachu-original-cap",
  "pikachu-hoenn-cap",
  "pikachu-sinnoh-cap",
  "pikachu-unova-cap",
  "pikachu-kalos-cap",
  "pikachu-alola-cap",
  "pikachu-partner-cap",
  "pikachu-world-cap",
  // Changes when/how it changes forms
  "zygarde-10-power-construct",
  "zygarde-50-power-construct",
  // Changes stats, but not relevant to stardex
  "pumpkaboo-small",
  "pumpkaboo-large",
  "pumpkaboo-super",
  "gourgeist-small",
  "gourgeist-large",
  "gourgeist-super",
  // Only affects its evolution's form
  "rockruff-own-tempo",
  // Cosmetic
  "dudunsparce-three-segment",
  // Only matters in overworld
  "miraidon-low-power-mode",
  "miraidon-drive-mode",
  "miraidon-aquatic-mode",
  "miraidon-glide-mode",
  "koraidon-limited-build",
  "koraidon-sprinting-build",
  "koraidon-swimming-build",
  "koraidon-gliding-build",
  // Doesn't have a smogon icon, only an in battle change
  "mimikyu-busted",
  "mimikyu-totem-busted",
]);

/** @type {[RegExp, string][]} */
const VARIETY_KIND_NAME_PATTERNS = [
  [/-alola$/, "Alolan"],
  [/-galar$/, "Galarian"],
  [/-hisui$/, "Hisuian"],
  [/-paldea$/, "Paldean"],
  [/-gmax$/, "Gigantamax"],
];

/** @type {Record<string, string>} */
const VARIETY_KIND_NAMES = {
  "wormadam-sandy": "Sandy Cloak",
  "wormadam-trash": "Trash Cloak",
  "tauros-paldea-combat-breed": "Paldean Combat Breed",
  "tauros-paldea-blaze-breed": "Paldean Blaze Breed",
  "tauros-paldea-aqua-breed": "Paldean Aqua Breed",
  "darmanitan-galar-standard": "Galarian",
  "darmanitan-galar-zen": "Galarian Zen",
  "zygarde-10": "10%",
  "oricorio-pom-pom": "Pom-Pom",
  "oricorio-pau": "Pa'u",
  "necrozma-dusk": "Dusk Mane",
  "necrozma-dawn": "Dawn Wings",
  "eiscue-noice": "Noice Face",
  "zacian-crowned": "Crowned Sword",
  "zamazenta-crowned": "Crowned Shield",
  "urshifu-single-strike-gmax": "Single Strike Gigantamax",
  "urshifu-rapid-strike-gmax": "Rapid Strike Gigantamax",
  "calyrex-ice": "Ice Rider",
  "calyrex-shadow": "Shadow Rider",
};

/** @type {Record<string, string>} */
const NO_KIND_NAMES = {
  wormadam: "Plant Cloak",
  basculin: "Red Striped",
  tornadus: "Incarnate",
  thundurus: "Incarnate",
  landorus: "Incarnate",
  meloetta: "Aria",
  aegislash: "Shield",
  zygarde: "50%",
  oricorio: "Baile",
  lycanroc: "Midday",
  wishiwashi: "Solo",
  minior: "Core",
  toxtricity: "Amped",
  eiscue: "Ice Face",
  morpeko: "Full Belly",
  zacian: "Hero of Many Battles",
  zamazenta: "Hero of Many Battles",
  urshifu: "Single Strike",
  enamorus: "Incarnate",
  maushold: "Family of Three",
  squawkabilly: "Green Plumage",
  palafin: "Zero",
  tatsugiri: "Curly",
  gimmighoul: "Chest",
  ogerpon: "Teal Mask",
};

// From https://github.com/smogon/pokemon-showdown-client/blob/master/play.pokemonshowdown.com/src/battle-dex-data.ts#L151.
// Leave this unchanged to easier diff in the future. Instead put overrides in the next global.
/** @type {Record<string, number>} */
const SMOGON_ALT_ICON_INDICES = {
  // alt forms
  egg: 1032 + 1,
  pikachubelle: 1032 + 2,
  pikachulibre: 1032 + 3,
  pikachuphd: 1032 + 4,
  pikachupopstar: 1032 + 5,
  pikachurockstar: 1032 + 6,
  pikachucosplay: 1032 + 7,
  unownexclamation: 1032 + 8,
  unownquestion: 1032 + 9,
  unownb: 1032 + 10,
  unownc: 1032 + 11,
  unownd: 1032 + 12,
  unowne: 1032 + 13,
  unownf: 1032 + 14,
  unowng: 1032 + 15,
  unownh: 1032 + 16,
  unowni: 1032 + 17,
  unownj: 1032 + 18,
  unownk: 1032 + 19,
  unownl: 1032 + 20,
  unownm: 1032 + 21,
  unownn: 1032 + 22,
  unowno: 1032 + 23,
  unownp: 1032 + 24,
  unownq: 1032 + 25,
  unownr: 1032 + 26,
  unowns: 1032 + 27,
  unownt: 1032 + 28,
  unownu: 1032 + 29,
  unownv: 1032 + 30,
  unownw: 1032 + 31,
  unownx: 1032 + 32,
  unowny: 1032 + 33,
  unownz: 1032 + 34,
  castformrainy: 1032 + 35,
  castformsnowy: 1032 + 36,
  castformsunny: 1032 + 37,
  deoxysattack: 1032 + 38,
  deoxysdefense: 1032 + 39,
  deoxysspeed: 1032 + 40,
  burmysandy: 1032 + 41,
  burmytrash: 1032 + 42,
  wormadamsandy: 1032 + 43,
  wormadamtrash: 1032 + 44,
  cherrimsunshine: 1032 + 45,
  shelloseast: 1032 + 46,
  gastrodoneast: 1032 + 47,
  rotomfan: 1032 + 48,
  rotomfrost: 1032 + 49,
  rotomheat: 1032 + 50,
  rotommow: 1032 + 51,
  rotomwash: 1032 + 52,
  giratinaorigin: 1032 + 53,
  shayminsky: 1032 + 54,
  unfezantf: 1032 + 55,
  basculinbluestriped: 1032 + 56,
  darmanitanzen: 1032 + 57,
  deerlingautumn: 1032 + 58,
  deerlingsummer: 1032 + 59,
  deerlingwinter: 1032 + 60,
  sawsbuckautumn: 1032 + 61,
  sawsbucksummer: 1032 + 62,
  sawsbuckwinter: 1032 + 63,
  frillishf: 1032 + 64,
  jellicentf: 1032 + 65,
  tornadustherian: 1032 + 66,
  thundurustherian: 1032 + 67,
  landorustherian: 1032 + 68,
  kyuremblack: 1032 + 69,
  kyuremwhite: 1032 + 70,
  keldeoresolute: 1032 + 71,
  meloettapirouette: 1032 + 72,
  vivillonarchipelago: 1032 + 73,
  vivilloncontinental: 1032 + 74,
  vivillonelegant: 1032 + 75,
  vivillonfancy: 1032 + 76,
  vivillongarden: 1032 + 77,
  vivillonhighplains: 1032 + 78,
  vivillonicysnow: 1032 + 79,
  vivillonjungle: 1032 + 80,
  vivillonmarine: 1032 + 81,
  vivillonmodern: 1032 + 82,
  vivillonmonsoon: 1032 + 83,
  vivillonocean: 1032 + 84,
  vivillonpokeball: 1032 + 85,
  vivillonpolar: 1032 + 86,
  vivillonriver: 1032 + 87,
  vivillonsandstorm: 1032 + 88,
  vivillonsavanna: 1032 + 89,
  vivillonsun: 1032 + 90,
  vivillontundra: 1032 + 91,
  pyroarf: 1032 + 92,
  flabebeblue: 1032 + 93,
  flabebeorange: 1032 + 94,
  flabebewhite: 1032 + 95,
  flabebeyellow: 1032 + 96,
  floetteblue: 1032 + 97,
  floetteeternal: 1032 + 98,
  floetteorange: 1032 + 99,
  floettewhite: 1032 + 100,
  floetteyellow: 1032 + 101,
  florgesblue: 1032 + 102,
  florgesorange: 1032 + 103,
  florgeswhite: 1032 + 104,
  florgesyellow: 1032 + 105,
  furfroudandy: 1032 + 106,
  furfroudebutante: 1032 + 107,
  furfroudiamond: 1032 + 108,
  furfrouheart: 1032 + 109,
  furfroukabuki: 1032 + 110,
  furfroulareine: 1032 + 111,
  furfroumatron: 1032 + 112,
  furfroupharaoh: 1032 + 113,
  furfroustar: 1032 + 114,
  meowsticf: 1032 + 115,
  aegislashblade: 1032 + 116,
  xerneasneutral: 1032 + 117,
  hoopaunbound: 1032 + 118,
  rattataalola: 1032 + 119,
  raticatealola: 1032 + 120,
  raichualola: 1032 + 121,
  sandshrewalola: 1032 + 122,
  sandslashalola: 1032 + 123,
  vulpixalola: 1032 + 124,
  ninetalesalola: 1032 + 125,
  diglettalola: 1032 + 126,
  dugtrioalola: 1032 + 127,
  meowthalola: 1032 + 128,
  persianalola: 1032 + 129,
  geodudealola: 1032 + 130,
  graveleralola: 1032 + 131,
  golemalola: 1032 + 132,
  grimeralola: 1032 + 133,
  mukalola: 1032 + 134,
  exeggutoralola: 1032 + 135,
  marowakalola: 1032 + 136,
  greninjaash: 1032 + 137,
  zygarde10: 1032 + 138,
  zygardecomplete: 1032 + 139,
  oricoriopompom: 1032 + 140,
  oricoriopau: 1032 + 141,
  oricoriosensu: 1032 + 142,
  lycanrocmidnight: 1032 + 143,
  wishiwashischool: 1032 + 144,
  miniormeteor: 1032 + 145,
  miniororange: 1032 + 146,
  minioryellow: 1032 + 147,
  miniorgreen: 1032 + 148,
  miniorblue: 1032 + 149,
  miniorindigo: 1032 + 150,
  miniorviolet: 1032 + 151,
  magearnaoriginal: 1032 + 152,
  pikachuoriginal: 1032 + 153,
  pikachuhoenn: 1032 + 154,
  pikachusinnoh: 1032 + 155,
  pikachuunova: 1032 + 156,
  pikachukalos: 1032 + 157,
  pikachualola: 1032 + 158,
  pikachupartner: 1032 + 159,
  lycanrocdusk: 1032 + 160,
  necrozmaduskmane: 1032 + 161,
  necrozmadawnwings: 1032 + 162,
  necrozmaultra: 1032 + 163,
  pikachustarter: 1032 + 164,
  eeveestarter: 1032 + 165,
  meowthgalar: 1032 + 166,
  ponytagalar: 1032 + 167,
  rapidashgalar: 1032 + 168,
  farfetchdgalar: 1032 + 169,
  weezinggalar: 1032 + 170,
  mrmimegalar: 1032 + 171,
  corsolagalar: 1032 + 172,
  zigzagoongalar: 1032 + 173,
  linoonegalar: 1032 + 174,
  darumakagalar: 1032 + 175,
  darmanitangalar: 1032 + 176,
  darmanitangalarzen: 1032 + 177,
  yamaskgalar: 1032 + 178,
  stunfiskgalar: 1032 + 179,
  cramorantgulping: 1032 + 180,
  cramorantgorging: 1032 + 181,
  toxtricitylowkey: 1032 + 182,
  alcremierubycream: 1032 + 183,
  alcremiematchacream: 1032 + 184,
  alcremiemintcream: 1032 + 185,
  alcremielemoncream: 1032 + 186,
  alcremiesaltedcream: 1032 + 187,
  alcremierubyswirl: 1032 + 188,
  alcremiecaramelswirl: 1032 + 189,
  alcremierainbowswirl: 1032 + 190,
  eiscuenoice: 1032 + 191,
  indeedeef: 1032 + 192,
  morpekohangry: 1032 + 193,
  zaciancrowned: 1032 + 194,
  zamazentacrowned: 1032 + 195,
  slowpokegalar: 1032 + 196,
  slowbrogalar: 1032 + 197,
  zarudedada: 1032 + 198,
  pikachuworld: 1032 + 199,
  articunogalar: 1032 + 200,
  zapdosgalar: 1032 + 201,
  moltresgalar: 1032 + 202,
  slowkinggalar: 1032 + 203,
  calyrexice: 1032 + 204,
  calyrexshadow: 1032 + 205,
  growlithehisui: 1032 + 206,
  arcaninehisui: 1032 + 207,
  voltorbhisui: 1032 + 208,
  electrodehisui: 1032 + 209,
  typhlosionhisui: 1032 + 210,
  qwilfishhisui: 1032 + 211,
  sneaselhisui: 1032 + 212,
  samurotthisui: 1032 + 213,
  lilliganthisui: 1032 + 214,
  zoruahisui: 1032 + 215,
  zoroarkhisui: 1032 + 216,
  braviaryhisui: 1032 + 217,
  sliggoohisui: 1032 + 218,
  goodrahisui: 1032 + 219,
  avalugghisui: 1032 + 220,
  decidueyehisui: 1032 + 221,
  basculegionf: 1032 + 222,
  enamorustherian: 1032 + 223,
  taurospaldeacombat: 1032 + 224,
  taurospaldeablaze: 1032 + 225,
  taurospaldeaaqua: 1032 + 226,
  wooperpaldea: 1032 + 227,
  oinkolognef: 1032 + 228,
  palafinhero: 1032 + 229,
  mausholdfour: 1032 + 230,
  tatsugiridroopy: 1032 + 231,
  tatsugiristretchy: 1032 + 232,
  squawkabillyblue: 1032 + 233,
  squawkabillyyellow: 1032 + 234,
  squawkabillywhite: 1032 + 235,
  gimmighoulroaming: 1032 + 236,
  dialgaorigin: 1032 + 237,
  palkiaorigin: 1032 + 238,
  basculinwhitestriped: 1032 + 239,
  ursalunabloodmoon: 1032 + 240,
  ogerponwellspring: 1032 + 241,
  ogerponhearthflame: 1032 + 242,
  ogerponcornerstone: 1032 + 243,
  terapagosterastal: 1032 + 244,
  terapagosstellar: 1032 + 245,

  arceusbug: 1032 + 246,
  arceusdark: 1032 + 247,
  arceusdragon: 1032 + 248,
  arceuselectric: 1032 + 249,
  arceusfairy: 1032 + 250,
  arceusfighting: 1032 + 251,
  arceusfire: 1032 + 252,
  arceusflying: 1032 + 253,
  arceusghost: 1032 + 254,
  arceusgrass: 1032 + 255,
  arceusground: 1032 + 256,
  arceusice: 1032 + 257,
  arceuspoison: 1032 + 258,
  arceuspsychic: 1032 + 259,
  arceusrock: 1032 + 260,
  arceussteel: 1032 + 261,
  arceuswater: 1032 + 262,

  genesectdouse: 1032 + 263,
  genesectshock: 1032 + 264,
  genesectburn: 1032 + 265,
  genesectchill: 1032 + 266,

  silvallybug: 1032 + 267,
  silvallydark: 1032 + 268,
  silvallydragon: 1032 + 269,
  silvallyelectric: 1032 + 270,
  silvallyfairy: 1032 + 271,
  silvallyfighting: 1032 + 272,
  silvallyfire: 1032 + 273,
  silvallyflying: 1032 + 274,
  silvallyghost: 1032 + 275,
  silvallygrass: 1032 + 276,
  silvallyground: 1032 + 277,
  silvallyice: 1032 + 278,
  silvallypoison: 1032 + 279,
  silvallypsychic: 1032 + 280,
  silvallyrock: 1032 + 281,
  silvallysteel: 1032 + 282,
  silvallywater: 1032 + 283,

  // alt forms with duplicate icons
  greninjabond: 658,
  gumshoostotem: 735,
  raticatealolatotem: 1032 + 120,
  marowakalolatotem: 1032 + 136,
  araquanidtotem: 752,
  lurantistotem: 754,
  salazzletotem: 758,
  vikavolttotem: 738,
  togedemarutotem: 777,
  mimikyutotem: 778,
  mimikyubustedtotem: 778,
  ribombeetotem: 743,
  kommoototem: 784,
  sinisteaantique: 854,
  polteageistantique: 855,
  poltchageistartisan: 1012,
  sinistchamasterpiece: 1013,
  ogerpontealtera: 1017,
  ogerponwellspringtera: 1032 + 241,
  ogerponhearthflametera: 1032 + 242,
  ogerponcornerstonetera: 1032 + 243,
  toxtricitylowkeygmax: 1320 + 69,

  // Mega/G-Max
  venusaurmega: 1320 + 0,
  charizardmegax: 1320 + 1,
  charizardmegay: 1320 + 2,
  blastoisemega: 1320 + 3,
  beedrillmega: 1320 + 4,
  pidgeotmega: 1320 + 5,
  alakazammega: 1320 + 6,
  slowbromega: 1320 + 7,
  gengarmega: 1320 + 8,
  kangaskhanmega: 1320 + 9,
  pinsirmega: 1320 + 10,
  gyaradosmega: 1320 + 11,
  aerodactylmega: 1320 + 12,
  mewtwomegax: 1320 + 13,
  mewtwomegay: 1320 + 14,
  ampharosmega: 1320 + 15,
  steelixmega: 1320 + 16,
  scizormega: 1320 + 17,
  heracrossmega: 1320 + 18,
  houndoommega: 1320 + 19,
  tyranitarmega: 1320 + 20,
  sceptilemega: 1320 + 21,
  blazikenmega: 1320 + 22,
  swampertmega: 1320 + 23,
  gardevoirmega: 1320 + 24,
  sableyemega: 1320 + 25,
  mawilemega: 1320 + 26,
  aggronmega: 1320 + 27,
  medichammega: 1320 + 28,
  manectricmega: 1320 + 29,
  sharpedomega: 1320 + 30,
  cameruptmega: 1320 + 31,
  altariamega: 1320 + 32,
  banettemega: 1320 + 33,
  absolmega: 1320 + 34,
  glaliemega: 1320 + 35,
  salamencemega: 1320 + 36,
  metagrossmega: 1320 + 37,
  latiasmega: 1320 + 38,
  latiosmega: 1320 + 39,
  kyogreprimal: 1320 + 40,
  groudonprimal: 1320 + 41,
  rayquazamega: 1320 + 42,
  lopunnymega: 1320 + 43,
  garchompmega: 1320 + 44,
  lucariomega: 1320 + 45,
  abomasnowmega: 1320 + 46,
  gallademega: 1320 + 47,
  audinomega: 1320 + 48,
  dianciemega: 1320 + 49,
  charizardgmax: 1320 + 50,
  butterfreegmax: 1320 + 51,
  pikachugmax: 1320 + 52,
  meowthgmax: 1320 + 53,
  machampgmax: 1320 + 54,
  gengargmax: 1320 + 55,
  kinglergmax: 1320 + 56,
  laprasgmax: 1320 + 57,
  eeveegmax: 1320 + 58,
  snorlaxgmax: 1320 + 59,
  garbodorgmax: 1320 + 60,
  melmetalgmax: 1320 + 61,
  corviknightgmax: 1320 + 62,
  orbeetlegmax: 1320 + 63,
  drednawgmax: 1320 + 64,
  coalossalgmax: 1320 + 65,
  flapplegmax: 1320 + 66,
  appletungmax: 1320 + 67,
  sandacondagmax: 1320 + 68,
  toxtricitygmax: 1320 + 69,
  centiskorchgmax: 1320 + 70,
  hatterenegmax: 1320 + 71,
  grimmsnarlgmax: 1320 + 72,
  alcremiegmax: 1320 + 73,
  copperajahgmax: 1320 + 74,
  duraludongmax: 1320 + 75,
  eternatuseternamax: 1320 + 76,
  venusaurgmax: 1320 + 77,
  blastoisegmax: 1320 + 78,
  rillaboomgmax: 1320 + 79,
  cinderacegmax: 1320 + 80,
  inteleongmax: 1320 + 81,
  urshifugmax: 1320 + 82,
  urshifurapidstrikegmax: 1320 + 83,
  clefablemega: 1320 + 84,
  victreebelmega: 1320 + 85,
  starmiemega: 1320 + 86,
  dragonitemega: 1320 + 87,
  meganiummega: 1320 + 88,
  feraligatrmega: 1320 + 89,
  skarmorymega: 1320 + 90,
  froslassmega: 1320 + 91,
  emboarmega: 1320 + 92,
  excadrillmega: 1320 + 93,
  scolipedemega: 1320 + 94,
  scraftymega: 1320 + 95,
  eelektrossmega: 1320 + 96,
  chandeluremega: 1320 + 97,
  chesnaughtmega: 1320 + 98,
  delphoxmega: 1320 + 99,
  greninjamega: 1320 + 100,
  pyroarmega: 1320 + 101,
  floettemega: 1320 + 102,
  malamarmega: 1320 + 103,
  barbaraclemega: 1320 + 104,
  dragalgemega: 1320 + 105,
  hawluchamega: 1320 + 106,
  zygardemega: 1320 + 107,
  drampamega: 1320 + 108,
  falinksmega: 1320 + 109,
  raichumegax: 1320 + 110,
  raichumegay: 1320 + 111,
  chimechomega: 1320 + 112,
  absolmegaz: 1320 + 113,
  staraptormega: 1320 + 114,
  garchompmegaz: 1320 + 115,
  lucariomegaz: 1320 + 116,
  heatranmega: 1320 + 117,
  darkraimega: 1320 + 118,
  golurkmega: 1320 + 119,
  meowsticmmega: 1320 + 120,
  meowsticfmega: 1320 + 120,
  crabominablemega: 1320 + 121,
  golisopodmega: 1320 + 122,
  magearnamega: 1320 + 123,
  magearnaoriginalmega: 1320 + 124,
  zeraoramega: 1320 + 125,
  scovillainmega: 1320 + 126,
  glimmoramega: 1320 + 127,
  tatsugiricurlymega: 1320 + 128,
  tatsugiridroopymega: 1320 + 129,
  tatsugiristretchymega: 1320 + 130,
  baxcaliburmega: 1320 + 131,

  // CAP
  syclant: 1560 + 0,
  revenankh: 1560 + 1,
  pyroak: 1560 + 2,
  fidgit: 1560 + 3,
  stratagem: 1560 + 4,
  arghonaut: 1560 + 5,
  kitsunoh: 1560 + 6,
  cyclohm: 1560 + 7,
  colossoil: 1560 + 8,
  krilowatt: 1560 + 9,
  voodoom: 1560 + 10,
  tomohawk: 1560 + 11,
  necturna: 1560 + 12,
  mollux: 1560 + 13,
  aurumoth: 1560 + 14,
  malaconda: 1560 + 15,
  cawmodore: 1560 + 16,
  volkraken: 1560 + 17,
  plasmanta: 1560 + 18,
  naviathan: 1560 + 19,
  crucibelle: 1560 + 20,
  crucibellemega: 1560 + 21,
  kerfluffle: 1560 + 22,
  pajantom: 1560 + 23,
  jumbao: 1560 + 24,
  caribolt: 1560 + 25,
  smokomodo: 1560 + 26,
  snaelstrom: 1560 + 27,
  equilibra: 1560 + 28,
  astrolotl: 1560 + 29,
  miasmaw: 1560 + 30,
  chromera: 1560 + 31,
  venomicon: 1560 + 32,
  venomiconepilogue: 1560 + 33,
  saharaja: 1560 + 34,
  hemogoblin: 1560 + 35,
  syclar: 1560 + 36,
  embirch: 1560 + 37,
  flarelm: 1560 + 38,
  breezi: 1560 + 39,
  scratchet: 1560 + 40,
  necturine: 1560 + 41,
  cupra: 1560 + 42,
  argalis: 1560 + 43,
  brattler: 1560 + 44,
  cawdet: 1560 + 45,
  volkritter: 1560 + 46,
  snugglow: 1560 + 47,
  floatoy: 1560 + 48,
  caimanoe: 1560 + 49,
  pluffle: 1560 + 50,
  rebble: 1560 + 51,
  tactite: 1560 + 52,
  privatyke: 1560 + 53,
  nohface: 1560 + 54,
  monohm: 1560 + 55,
  duohm: 1560 + 56,
  protowatt: 1560 + 57,
  voodoll: 1560 + 58,
  mumbao: 1560 + 59,
  fawnifer: 1560 + 60,
  electrelk: 1560 + 61,
  smogecko: 1560 + 62,
  smoguana: 1560 + 63,
  swirlpool: 1560 + 64,
  coribalis: 1560 + 65,
  justyke: 1560 + 66,
  solotl: 1560 + 67,
  miasmite: 1560 + 68,
  dorsoil: 1560 + 69,
  saharascal: 1560 + 70,
  ababo: 1560 + 71,
  scattervein: 1560 + 72,
  cresceidon: 1560 + 73,
  chuggalong: 1560 + 74,
  shox: 1560 + 75,
  chuggon: 1560 + 76,
  draggalong: 1560 + 77,
  ramnarok: 1560 + 78,
  ramnarokradiant: 1560 + 79,
  flox: 1560 + 80,
  obliteryx: 1560 + 81,
};

/** @type {Record<string, number | "use-species">} */
const OVERRIDE_ALT_ICON_INDICES = {
  "tauros-paldea-combat-breed": SMOGON_ALT_ICON_INDICES.taurospaldeacombat,
  "tauros-paldea-blaze-breed": SMOGON_ALT_ICON_INDICES.taurospaldeablaze,
  "tauros-paldea-aqua-breed": SMOGON_ALT_ICON_INDICES.taurospaldeaaqua,
  "darmanitan-galar-standard": SMOGON_ALT_ICON_INDICES.darmanitangalar,
  "greninja-battle-bond": SMOGON_ALT_ICON_INDICES.greninjabond,
  "meowstic-male-mega": SMOGON_ALT_ICON_INDICES.meowsticmmega,
  "meowstic-female-mega": SMOGON_ALT_ICON_INDICES.meowsticfmega,
  "mimikyu-totem-disguised": "use-species",
  "necrozma-dusk": SMOGON_ALT_ICON_INDICES.necrozmaduskmane,
  "necrozma-dawn": SMOGON_ALT_ICON_INDICES.necrozmadawnwings,
  "urshifu-rapid-strike": "use-species", // has the same party icon as single strike
  "urshifu-single-strike-gmax": SMOGON_ALT_ICON_INDICES.urshifugmax,
  "squawkabilly-blue-plumage": SMOGON_ALT_ICON_INDICES.squawkabillyblue,
  "squawkabilly-yellow-plumage": SMOGON_ALT_ICON_INDICES.squawkabillyyellow,
  "squawkabilly-white-plumage": SMOGON_ALT_ICON_INDICES.squawkabillywhite,
  "maushold-family-of-four": SMOGON_ALT_ICON_INDICES.mausholdfour,
  "ogerpon-wellspring-mask": SMOGON_ALT_ICON_INDICES.ogerponwellspring,
  "ogerpon-hearthflame-mask": SMOGON_ALT_ICON_INDICES.ogerponhearthflame,
  "ogerpon-cornerstone-mask": SMOGON_ALT_ICON_INDICES.ogerponcornerstone,
};

const HIDDEN_NAMES = {
  "nidoran-m": "Nidoran Male",
  "nidoran-f": "Nidoran Female",
  "mr-mime": "Mr Mime",
  "mime-jr": "Mime Junior",
};

async function main() {
  /** @type {Promise<ResolvedMon | null>[]} */
  const promises = [];

  let segment = await fetchSegment("https://pokeapi.co/api/v2/pokemon-species");

  while (true) {
    fillSegment(promises, segment);

    if (!segment.next) break;
    segment = await fetchSegment(segment.next);
  }

  const resolved = await Promise.all(promises);
  resolved.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));

  /** @type {Record<string, Omit<ResolvedMon, 'key'>>} */
  let out = {};

  for (const maybeEntry of resolved) {
    if (!maybeEntry) {
      continue;
    }

    const { key, ...entry } = maybeEntry;
    out[key] = entry;
  }

  if (!process.env.DRY) {
    await fs.writeFile(
      `${import.meta.dirname}/../src/data/species.json`,
      JSON.stringify(out, null, 2),
    );
  }
}

/**
 * @param {Promise<ResolvedMon | null>[]} promises
 * @param {Segment} segment
 */
function fillSegment(promises, segment) {
  /**
   * @param {string} url
   * @returns {Promise<ResolvedMon | null>}
   */
  async function resolve(url) {
    const species = await fetchPokemonSpecies(url);
    const [pokemon, alts] = await Promise.all([resolveDefault(species), resolveAlts(species)]);
    const types = pokemon.types.map((t) => t.type.name);

    const { id } = species;
    const key = species.name;
    const name =
      species.names?.find((n) => n.language.name === "en")?.name ?? capitalize(species.name);
    const hiddenName = HIDDEN_NAMES[key];
    const noAltName = NO_KIND_NAMES[key];

    /** @type {ResolvedMon['evos']} */
    let evos;

    if (species.evolves_from_species?.name) {
      evos ??= {};
      evos.from = species.evolves_from_species.name;
    }

    if (species.evolution_chain?.url) {
      const evosData = await fetchEvolutions(species.evolution_chain.url);
      const evosEntry = findOwnSpeciesInEvosChain(evosData.chain, key);
      const evosTo = evosEntry?.evolves_to?.map((t) => t.species.name);

      if (evosTo?.length) {
        evos ??= {};
        evos.to = evosTo;
      }
    }

    return { id, key, name, hiddenName, noAltName, types, evos, alts };
  }

  for (const { url } of segment.results) {
    promises.push(resolve(url));
  }
}

/**
 * @param {PokemonSpecies} species
 */
async function resolveDefault(species) {
  const url = /** @type {string} */ (species.varieties.find((v) => v.is_default)?.pokemon.url);
  return await fetchPokemon(url);
}

/**
 *
 * @param {PokemonSpecies} species
 */
async function resolveAlts(species) {
  if (species.varieties.length < 2) return undefined;

  /** @type {{ kind: string, name: string, iconIndex: number, promise: Promise<Pokemon>}[]} */
  const queue = [];
  const varieties = OVERRIDE_VARIETIES[species.name] || species.varieties;

  for (const variety of varieties) {
    const key = variety.pokemon.name;

    if (variety.is_default) continue;
    if (SKIPPED_VARIETY_NAME_PATTERNS.some((p) => p.exec(key))) continue;
    if (SKIPPED_VARIETY_NAMES.has(key)) continue;

    const kind = key.replace(`${species.name}-`, "");
    const name =
      VARIETY_KIND_NAMES[key] ||
      VARIETY_KIND_NAME_PATTERNS.find(([p]) => p.exec(key))?.[1] ||
      capitalizeWords(kind.replace(/-/g, " "));

    const iconIndexOrUseSpecies =
      OVERRIDE_ALT_ICON_INDICES[variety.pokemon.name] ||
      SMOGON_ALT_ICON_INDICES[variety.pokemon.name.replace(/-female$/, "f").replace(/-/g, "")];

    const iconIndex = iconIndexOrUseSpecies === "use-species" ? species.id : iconIndexOrUseSpecies;

    if (iconIndex == null) {
      // eslint-disable-next-line no-console
      console.warn("Missing icon index", variety.pokemon.name);
    }

    queue.push({
      kind,
      name,
      iconIndex,
      promise: fetchPokemon(variety.pokemon.url),
    });
  }

  const alts = await Promise.all(
    queue.map(async ({ kind, name, iconIndex, promise }) => {
      const pokemon = await promise;
      const types = pokemon.types.map((t) => t.type.name);
      return { kind, name, types, iconIndex };
    }),
  );

  return alts.length > 0 ? alts : undefined;
}

/**
 * @param {string} url
 * @returns {Promise<Segment>}
 */
async function fetchSegment(url) {
  return fetchJson(`${url}?limit=100`);
}

/**
 * @param {string} url
 * @returns {Promise<PokemonSpecies>}
 */
async function fetchPokemonSpecies(url) {
  return await fetchJson(url);
}

/**
 * @param {string} url
 * @returns {Promise<Pokemon>}
 */
async function fetchPokemon(url) {
  return await fetchJson(url);
}

/**
 * @param {string} url
 * @returns {Promise<PokemonEvos>}
 */
async function fetchEvolutions(url) {
  return await fetchJson(url);
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
async function fetchJson(url) {
  return (await fetch(url)).json();
}

/**
 * @param {PokemonEvos['chain']} entries
 * @param {string} speciesKey
 * @returns {PokemonEvosEntry | undefined}
 */
function findOwnSpeciesInEvosChain(entries, speciesKey) {
  if (entries.species.name === speciesKey) {
    return entries;
  }
  for (const entry of entries.evolves_to ?? []) {
    const child = findOwnSpeciesInEvosChain(entry, speciesKey);
    if (child) return child;
  }
}

/**
 *
 * @param {string} s
 * @returns {string}
 */
function capitalizeWords(s) {
  return s.split(/\s+/).map(capitalize).join(" ").replace(/ Of /g, " of ");
}

/**
 * @param {string} s
 * @returns {string}
 */
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
