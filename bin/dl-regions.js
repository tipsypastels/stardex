#!/usr/bin/env node
// @ts-check

import fs from "node:fs/promises";
import process from "node:process";
import RAW_SPECIES_DATA from "../src/data/species.json" with { type: "json" };

/**
 * @typedef {{
 *  pokemon_entries: { pokemon_species: { name: string }}[]
 * }} Region
 *
 * @typedef {{
 *  species: string
 * }} ResolvedMember
 *
 * @typedef {{
 *  name: string;
 *  key: string;
 *  icon: string;
 *  members: ResolvedMember[];
 * }} ResolvedRegion
 */

const REGIONS_MAP = {
  kanto: { apiIds: [2], icon: "trees" },
  johto: { apiIds: [7], icon: "vihara" },
  hoenn: { apiIds: [15], icon: "wave" },
  sinnoh: { apiIds: [6], icon: "mountains" },
  unova: { apiIds: [9], icon: "city" },
  kalos: { apiIds: [12, 13, 14], icon: "baguette" },
  alola: { apiIds: [21], icon: "island-tropical" },
  galar: { apiIds: [27, 28, 29], icon: "fort" },
  paldea: { apiIds: [31, 32, 33], icon: "lighthouse" },
};

async function main() {
  /** @type {Promise<ResolvedRegion>[]} */
  const promises = [];

  for (const [key, data] of Object.entries(REGIONS_MAP)) {
    promises.push(resolve(key, data));
  }

  const resolved = await Promise.all(promises);
  /** @type {Record<string, Omit<ResolvedRegion, 'key'>>} */
  const out = {};

  for (const { key, ...entry } of resolved) {
    out[key] = entry;
  }

  if (!process.env.DRY) {
    await fs.writeFile(
      `${import.meta.dirname}/../src/data/regions.json`,
      JSON.stringify(out, null, 2),
    );
  }
}

/**
 *
 * @param {string} key
 * @param {typeof REGIONS_MAP[keyof typeof REGIONS_MAP]} data
 * @returns {Promise<ResolvedRegion>}
 */
async function resolve(key, { icon, apiIds }) {
  /** @type {Region[]} */
  const subRegions = await Promise.all(
    apiIds.map(async (apiId) => (await fetch(`https://pokeapi.co/api/v2/pokedex/${apiId}`)).json()),
  );

  /** @type {Region} */
  const region = { pokemon_entries: [] };
  const foundSpeciesKeys = new Set();

  for (const subRegion of subRegions) {
    for (const entry of subRegion.pokemon_entries) {
      if (!foundSpeciesKeys.has(entry.pokemon_species.name)) {
        region.pokemon_entries.push(entry);
        foundSpeciesKeys.add(entry.pokemon_species.name);
      }
    }
  }

  const name = key[0].toUpperCase() + key.slice(1);
  const members = region.pokemon_entries.flatMap((entry) => {
    const species = entry.pokemon_species.name;

    /**
     * In the app logic, alt forms aren't actually tied to regions at all, and I'd rather keep
     * it that way to prepare for whatever bizarre variation they add next. This part however
     * treats alts as regional forms. It must account for inexact kinds, e.g. Darmanitan's galar-standard,
     * and having multiple alts in the same region, e.g. Tauros.
     */
    const matchingAlts = /** @type {{ alts?: { kind: string }[] } | undefined} */ (
      RAW_SPECIES_DATA[species]
    )?.alts?.filter((alt) => alt.kind.includes(key));

    if (matchingAlts?.length) {
      return matchingAlts.map((alt) => ({
        species,
        alt: alt.kind,
      }));
    }

    return { species };
  });

  return { key, name, icon, members };
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
