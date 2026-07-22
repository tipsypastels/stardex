import type { Diagnostic } from "@codemirror/lint";
import type { SyntaxNodeRef, Tree } from "@lezer/common";
import type { RawBuiltinPokemon, RawPokemon } from "..";
import { id } from "../../../utils/id";
import type { Span } from "../../../utils/span";
import type { RawPokemonList } from "../list";
import { Species, SPECIES } from "../species";
import { POKEMON_LIST_VERSION, POKEMON_VERSION } from "../versioned";
import { transformAltNameWithAliases } from "./alt_name";
import { PokemonListTextDiffBuilder } from "./diff";
import { parser } from "./lezer";

export interface ParsePokemonListTextResult {
  list: RawPokemonList;
  errors: Diagnostic[];
}

export function parsePokemonListText(text: string) {
  return parsePokemonListTextFromLezerTree(parser.parse(text), text, id);
}

export function parsePokemonListTextFromLezerTree(
  tree: Tree,
  text: Pick<string, "slice">,
  getId: (span: Span) => string,
): ParsePokemonListTextResult {
  const pokemons: RawPokemon[] = [];
  const textDiff = new PokemonListTextDiffBuilder();
  const errors: Diagnostic[] = [];

  let listing: Listing | undefined;

  function slice(span: Span) {
    return text.slice(span.from, span.to);
  }

  tree.iterate({
    enter(ref) {
      switch (ref.name) {
        case "Listing": {
          listing = new Listing(ref.node, slice, getId);
          break;
        }
        case "Name": {
          listing?.name(ref.node);
          break;
        }
        case "AltName": {
          listing?.altName(ref.node);
          break;
        }
        case "TypeName": {
          listing?.type(ref.node);
          break;
        }
        case "SpecSeparator": {
          listing?.explicitSpecSeparator();
          break;
        }
        case "Modifier": {
          listing?.modifier(ref.node);
          break;
        }
        case "InlineComment": {
          listing?.comment(ref.node);
          break;
        }
        case "Comment": {
          textDiff.verbatim(slice(ref));
          break;
        }
        case "Blank": {
          textDiff.blank(1);
          break;
        }
      }
    },
    leave(node) {
      switch (node.name) {
        case "Listing": {
          listing?.finish(pokemons, textDiff, errors);
          listing = undefined;
          break;
        }
      }
    },
  });

  return {
    list: {
      v: POKEMON_LIST_VERSION,
      all: pokemons,
      textDiff: textDiff.finish(),
    },
    errors,
  };
}

class Listing {
  #node: SyntaxNodeRef;
  #slice: (span: Span) => string;
  #getId: (span: Span) => string;

  #name?: Span;
  #altName?: Span;
  #types: Span[] = [];
  #modifiers: Span[] = [];
  #comment?: Span;
  #explicitSpecSeparator = false;

  constructor(node: SyntaxNodeRef, slice: (span: Span) => string, getId: (span: Span) => string) {
    this.#node = node;
    this.#slice = slice;
    this.#getId = getId;
  }

  name(name: Span) {
    this.#name = name;
  }

  altName(altName: Span) {
    this.#altName = altName;
  }

  type(type: Span) {
    this.#types.push(type);
  }

  modifier(modifier: Span) {
    this.#modifiers.push(modifier);
  }

  comment(comment: Span) {
    this.#comment = comment;
  }

  explicitSpecSeparator() {
    this.#explicitSpecSeparator = true;
  }

  finish(pokemons: RawPokemon[], textDiff: PokemonListTextDiffBuilder, errors: Diagnostic[]) {
    const warn = (message: string, span?: Span) => {
      const { from, to } = span ?? this.#node;
      errors.push({ severity: "warning", message, from, to });
    };

    const error = (message: string, span?: Span) => {
      const { from, to } = span ?? this.#node;
      errors.push({ severity: "error", message, from, to });
      textDiff.verbatim(this.#slice(this.#node));
    };

    // Probably can only happen when compiler recovery weirdness.
    if (!this.#name) {
      error("Pokémon should have a name.");
      return;
    }

    const name = this.#slice(this.#name);
    const altName = this.#altName && this.#slice(this.#altName);
    const types = this.#types.map((sp) => this.#slice(sp).toLowerCase());
    const species = SPECIES.search(name);

    let exclude = false;

    for (const modifierSp of this.#modifiers) {
      const modifier = this.#slice(modifierSp);
      switch (modifier) {
        case "@exclude":
        case "@ignore": {
          exclude = true;
          break;
        }
        case "@alt":
        case "@filler": {
          warn("This legacy modifier is not currently supported.", modifierSp);
          break;
        }
        default: {
          warn("Unknown modifier.", modifierSp);
          break;
        }
      }
    }

    const pokemon: RawPokemon | undefined = (() => {
      if (species) {
        const pokemon: RawBuiltinPokemon = {
          v: POKEMON_VERSION,
          id: this.#getId(this.#node),
          species: species.key,
        };

        applyAltNameToBuiltinPokemon(pokemon, species, altName, types, this.#explicitSpecSeparator);

        if (types.length > 0) {
          pokemon.types = types;
        }
        return pokemon;
      } else if (types.length > 0) {
        return {
          v: POKEMON_VERSION,
          id: this.#getId(this.#node),
          name,
          altName,
          types,
        };
      } else {
        error("Custom Pokémon must specify their types.");
      }
    })();
    if (!pokemon) {
      return;
    }
    if (exclude) {
      pokemon.exclude = true;
    }

    pokemons.push(pokemon);

    if (this.#comment) {
      const comment = this.#slice(this.#comment);
      textDiff.entryWithVerbatimSuffix(comment);
    } else {
      textDiff.entry();
    }
  }
}

function applyAltNameToBuiltinPokemon(
  pokemon: RawBuiltinPokemon,
  species: Species,
  originalAltName: string | undefined,
  types: string[],
  explicitSpecSeparator: boolean,
) {
  if (originalAltName) {
    const altName = transformAltNameWithAliases(species.key, originalAltName);
    if (!altName) return; // default form

    const altNameLower = altName.toLowerCase();
    if (altNameLower === species.noAltNameLower) {
      return;
    }

    const alt = species.alts.find((alt) => alt.nameLower === altNameLower);
    if (alt) {
      pokemon.alt = alt.kind;
    } else {
      pokemon.customAltName = altName;
    }
  } else if (types.length === 1 && !explicitSpecSeparator) {
    // Note: This hack is only necessary for alts without spaces. (Mega X) parses as (Mega X:) already
    // because of compiler recovery, but (Mega) is a valid type.

    const altName = transformAltNameWithAliases(species.key, types[0]);
    if (!altName) {
      // default form, don't also use it as a type
      types.splice(0, 1);
      return;
    }

    const altNameLower = altName.toLowerCase();
    if (altNameLower === species.noAltNameLower) {
      types.splice(0, 1);
      return;
    }

    const alt = species.alts.find((alt) => alt.nameLower === altNameLower);
    if (alt) {
      pokemon.alt = alt.kind;
      types.splice(0, 1);
    }
  }
}
