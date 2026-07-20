#!/usr/bin/env node
// @ts-check

import * as fs from "node:fs/promises";

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
 *  types: string[],
 *  evos?: { from?: string, to?: string[] }
 *  alts?: { kind: string, name: string, types: string[] }[]
 * }} ResolvedMon
 */

const ALT_KIND_METAS = [
  {
    kind: "alola",
    name: "Alolan",
  },
  {
    kind: "galar",
    name: "Galarian",
  },
  {
    kind: "hisui",
    name: "Hisuian",
  },
  {
    kind: "paldea",
    name: "Paldean",
  },
  // Tauros
  {
    kind: "paldea-combat-breed",
    name: "Paldean Combat Breed",
  },
  {
    kind: "paldea-blaze-breed",
    name: "Paldean Blaze Breed",
  },
  {
    kind: "paldea-aqua-breed",
    name: "Paldean Aqua Breed",
  },
  // Darmanitan
  {
    kind: "galar-standard",
    name: "Galarian",
  },
];

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

  await fs.writeFile(
    `${import.meta.dirname}/../src/data/species.json`,
    JSON.stringify(out, null, 2),
  );
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

    return { id, key, name, hiddenName, types, evos, alts };
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

  /** @type {{ kind: string, name: string, promise: Promise<Pokemon>}[]} */
  const queue = [];

  for (const variety of species.varieties) {
    if (variety.is_default) continue;

    const kind = variety.pokemon.name.replace(`${species.name}-`, "");
    const kindMeta = ALT_KIND_METAS.find((meta) => meta.kind === kind);
    if (!kindMeta) continue;

    queue.push({
      kind,
      name: kindMeta.name,
      promise: fetchPokemon(variety.pokemon.url),
    });
  }

  const alts = await Promise.all(
    queue.map(async ({ kind, name, promise }) => {
      const pokemon = await promise;
      const types = pokemon.types.map((t) => t.type.name);
      return { kind, name, types };
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
 * @param {string} s
 * @returns {s}
 */
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
