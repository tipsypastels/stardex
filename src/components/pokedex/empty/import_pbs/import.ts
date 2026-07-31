import { batch } from "solid-js";
import type { RawPokemon } from "../../../../models/pokemon";
import { pokemons } from "../../../../models/pokemon/list";
import type { ExtractPBSPokemonsToRawPokemonsOptions } from "../../../../models/pokemon/pbs/extract";
import type { PBSForm } from "../../../../models/pokemon/pbs/form";
import { SPECIES } from "../../../../models/pokemon/species";
import { POKEMON_LIST_VERSION } from "../../../../models/pokemon/versioned";
import { TYPE_KEY_PAIRS } from "../../../../models/type/key_pair";
import { toasts } from "../../../../models/ui/toast";
import type { ImportPBSFinishPhase, ImportPBSState } from "./state";

export async function importPBS(state: ImportPBSState, phase: ImportPBSFinishPhase) {
  const { extractPBSPokemonsToRawPokemons } =
    await import("../../../../models/pokemon/pbs/extract");

  const extractOptions = makeExtractOptions(state, phase);
  const rawPokemons = extractPBSPokemonsToRawPokemons(extractOptions);

  batch(() => {
    state.close();
    pokemons.setFromRaw({ v: POKEMON_LIST_VERSION, all: rawPokemons });
    toasts.add("file-arrow-up", `Imported PBS file${state.files.files.length === 1 ? "" : "s"}!`);
  });
}

function makeExtractOptions(
  { files: { parsed } }: ImportPBSState,
  { dexes: { section: dexSection }, forms }: ImportPBSFinishPhase,
): ExtractPBSPokemonsToRawPokemonsOptions {
  const pokemons = parsed.pokemons.values();
  const dex = dexSection != null ? parsed.dexes.get(dexSection) : undefined;

  type SkipOptions = Pick<
    ExtractPBSPokemonsToRawPokemonsOptions,
    "shouldSkipBase" | "shouldSkipForm"
  >;

  const skipOptions = ((): SkipOptions => {
    switch (forms.granularity) {
      case "all": {
        return {};
      }
      case "types": {
        function resolveTypes(raw: RawPokemon) {
          return "species" in raw ? (raw.types ?? SPECIES.of(raw.species).typeKeys) : raw.types;
        }
        return {
          shouldSkipForm(form, pokemon) {
            return TYPE_KEY_PAIRS.equal(resolveTypes(form.raw), resolveTypes(pokemon.raw));
          },
        };
      }
      case "known": {
        return {
          shouldSkipForm(form) {
            return !("species" in form.raw && form.raw.alt);
          },
        };
      }
      case "custom": {
        const ADD: unique symbol = Symbol();
        const ADD_AND_SKIP_BASE: unique symbol = Symbol();
        const skipKind = new Map<PBSForm, typeof ADD | typeof ADD_AND_SKIP_BASE>();

        for (const bucket of forms.customBuckets ?? []) {
          switch (forms.customChoices.get(bucket.key)) {
            case "add": {
              for (const form of bucket.forms) {
                skipKind.set(form, ADD);
              }
              break;
            }
            case "replace": {
              for (const form of bucket.forms) {
                skipKind.set(form, ADD_AND_SKIP_BASE);
              }
            }
          }
        }
        return {
          shouldSkipBase(pokemon) {
            return pokemon.forms.some((form) => skipKind.get(form!) === ADD_AND_SKIP_BASE);
          },
          shouldSkipForm(form) {
            return !skipKind.has(form);
          },
        };
      }
      case undefined: {
        return {
          shouldSkipForm: () => true,
        };
      }
      default: {
        return forms.granularity satisfies never;
      }
    }
  })();

  return {
    pokemons,
    dex,
    ...skipOptions,
  };
}
