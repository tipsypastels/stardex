import { ALL_SPECIES, resolveSpecies } from "$lib/models/species";
import { resolvePokemonName, type Pokemon } from "../models/pokemon";

export function legacyTextFromPokemonList(pokemon: Pokemon[]) {
  const lines: string[] = [];

  for (const mon of pokemon) {
    if (mon.newlinesBefore) {
      lines.push(...new Array(mon.newlinesBefore).fill(""));
    }

    if (mon.comment) {
      lines.push(...mon.comment.split("\n").map((c) => `# ${c}`));
    }

    let line = resolvePokemonName(mon);

    if (mon.type) {
      line += ` (${mon.type.join("/")})`;
    }

    if (mon.exclude) {
      line += ` @exclude`;
    }

    lines.push(line);
  }

  return lines.join("\n");
}

export function legacyTextToPokemonList(text: string) {
  const out: Pokemon[] = [];
  const lines = text.split("\n");

  let commentBeforeNext: string[] = [];
  let newlinesBeforeNext = 0;

  for (const line_ of lines) {
    const line = line_.trim();

    if (line.length === 0) {
      newlinesBeforeNext++;
      continue;
    }

    if (line.startsWith("#")) {
      commentBeforeNext.push(line.replace(/^#\s*/, ""));
      continue;
    }

    const tokens = line.split(/\s+/);

    let name = "";
    let exclude = false;
    let type: string[] | undefined;

    let buildingName = true;

    for (const token of tokens) {
      if (token.startsWith("@") || token.startsWith("(")) {
        buildingName = false;
      }
      if (buildingName) {
        if (name.length > 0) name += " ";
        name += token;
      } else {
        if (token === "@exclude" || token === "@ignore") {
          exclude = true;
        } else if (token.startsWith("(")) {
          type = token
            .toLowerCase()
            .replaceAll(/[()]/g, "")
            .split(/\s*\/\s*/);
        } else {
          // TODO
          throw new Error("invalid token");
        }
      }
    }

    const species = resolveSpeciesByKeyOrName(name);
    const mon = ((): Pokemon => {
      if (species) {
        return { species, type };
      } else {
        if (!type) throw new Error("type(s) required");
        const key = name.toLowerCase().replace(" ", "-");
        return { key, name, type };
      }
    })();

    if (exclude) {
      mon.exclude = true;
    }
    if (commentBeforeNext.length > 0) {
      mon.comment = commentBeforeNext.join("\n");
      commentBeforeNext = [];
    }
    if (newlinesBeforeNext > 0) {
      mon.newlinesBefore = newlinesBeforeNext;
      newlinesBeforeNext = 0;
    }

    out.push(mon);
  }

  return out;
}

function resolveSpeciesByKeyOrName(keyOrName: string) {
  keyOrName = keyOrName.toLowerCase();
  // TODO: Add standard replacers like nidoran.
  const exact = resolveSpecies(keyOrName);
  if (exact) return exact;
  const dashed = resolveSpecies(keyOrName.replace(" ", "-"));
  if (dashed) return dashed;
  return ALL_SPECIES.find((species) => species.nameLower === keyOrName);
}
