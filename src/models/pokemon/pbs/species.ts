import { SPECIES } from "../species";

// PBS section names don't contain any separators. We could use the name field
// instead of the section name, but that wouldn't work when processing forms,
// which don't repeat the name field.
const OVERRIDDES: Record<string, string> = {
  NIDORANfE: "nidoran-f",
  NIDORANmA: "nidoran-m",
  MRMIME: "mr-mime",
  HOOH: "ho-oh",
  MIMEJR: "mime-jr",
  PORYGONZ: "porygon-z",
  FLABEBE: "flabebe",
  TYPENULL: "type-null",
  JANGMOO: "jangmo-o",
  HAKAMOO: "hakamo-o",
  KOMMOO: "kommo-o",
  TAPUKOKO: "tapu-koko",
  TAPULELE: "tapu-lele",
  TAPUBULU: "tapu-bulu",
  TAPUFINI: "tapu-fini",
  MRRIME: "mr-rime",
  GREATTUSK: "great-tusk",
  SCREAMTAIL: "scream-tail",
  BRUTEBONNET: "brute-bonnet",
  FLUTTERMANE: "flutter-mane",
  SLITHERWING: "slither-wing",
  SANDYSHOCKS: "sandy-shocks",
  IRONTREADS: "iron-treads",
  IRONBUNDLE: "iron-bundle",
  IRONHANDS: "iron-hands",
  IRONJUGULIS: "iron-jugulis",
  IRONMOTH: "iron-moth",
  IRONTHORNS: "iron-thorns",
  WOCHIEN: "wo-chien",
  CHIENPAO: "chien-pao",
  TINGLU: "ting-lu",
  CHIYU: "chi-yu",
  ROARINGMOON: "roaring-moon",
  IRONVALIANT: "iron-valiant",
  WALKINGWAKE: "walking-wake",
  IRONLEAVES: "iron-leaves",
  GOUGINGFIRE: "gouging-fire",
  RAGINGBOLT: "raging-bolt",
  IRONBOULDER: "iron-boulder",
  IRONCROWN: "iron-crown",
};

export function getPBSRecordSectionSpecies(section: string) {
  return SPECIES.tryOf(OVERRIDDES[section] || section.toLowerCase());
}
