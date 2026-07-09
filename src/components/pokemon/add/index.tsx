import { batch, useComputed, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import Fuse from "fuse.js";
import hotkeys from "hotkeys-js";
import { useContext, useEffect, useRef } from "preact/hooks";
import { EVOLUTION_LINES } from "../../../models/evolution_line";
import { BUILTIN_POKEMONS, CUSTOM_POKEMONS } from "../../../models/pokemon";
import { Species, SPECIES } from "../../../models/species";
import { PokemonsContext } from "../../../state/context";
import { capitalizeWords } from "../../../utils/string";
import { Button } from "../../common/button";
import { SpeciesIcon } from "../util/species_icon";
import { AddCustom } from "./custom";

const FUSE = new Fuse(SPECIES.all, {
  keys: ["name"],
  threshold: 0.1,
  includeScore: true,
});

export function AddPokemon() {
  const pokemons = useContext(PokemonsContext);

  const input = useSignal("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputCapitalizedWords = useComputed(() => capitalizeWords(input.value));

  const addingCustom = useSignal(false);

  const closest = useComputed(() => {
    if (input.value === "") return;

    const result = FUSE.search(input.value, { limit: 1 }).at(0);
    if (!result) return;

    const species = result.item;
    // For whatever reason, Fuse returns infinitesimals for exact matches, not zeroes. Bug?
    const exact = !!result.score && result.score <= 1e-15;
    return { species, exact };
  });

  const closestLine = useComputed(() => {
    if (closest.value) return EVOLUTION_LINES.of(closest.value.species);
  });

  function addPokemon(species: Species) {
    batch(() => {
      if (pokemons.hasKey(species.key)) {
        alert(`${species.name} is already in your Pokédex!`);
      } else {
        pokemons.push(BUILTIN_POKEMONS.of(species.key));
      }
      input.value = "";
    });
  }

  function addFamily(family: Species[]) {
    batch(() => {
      const notAlreadyIncluded = family.filter((species) => !pokemons.hasKey(species.key));
      if (notAlreadyIncluded.length === 0) {
        alert(`The ${family[0].name} family is already in your Pokédex!`);
      } else {
        pokemons.push(...notAlreadyIncluded.map((species) => BUILTIN_POKEMONS.of(species.key)));
      }
      input.value = "";
    });
  }

  function addCustom(typeKeys: string[]) {
    const key = input.value.toLowerCase();
    const name = inputCapitalizedWords.value;

    batch(() => {
      pokemons.push(CUSTOM_POKEMONS.of(key, name, typeKeys));
      input.value = "";
      addingCustom.value = false;
    });
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key !== "Enter" || input.value === "") {
      return;
    }
    if (e.shiftKey && closestLine.value) {
      addFamily(closestLine.value);
    } else if (closest.value) {
      addPokemon(closest.value.species);
    } else {
      addingCustom.value = true;
    }
  }

  // TODO: Indicate this somehow.
  useEffect(() => {
    hotkeys("a", (e) => {
      e.preventDefault();
      inputRef.current?.focus();
    });
    return () => hotkeys.unbind("a");
  }, []);

  return (
    <div class="mb-8">
      <div class="border-secondary relative mb-2 rounded-b-md border-2 border-t-0">
        <input
          ref={inputRef}
          class="block h-20 w-full border-0"
          placeholder="Enter a Pokémon..."
          value={input}
          onChange={(e) => (input.value = e.currentTarget.value)}
          onKeyUp={handleKeyUp}
          disabled={addingCustom.value}
        />

        <div class="absolute top-0 right-0">
          {closest.value && !addingCustom.value ? (
            <SpeciesIcon species={closest.value.species} />
          ) : input.value ? (
            <SpeciesIcon species={{ id: 0, name: inputCapitalizedWords.value }} />
          ) : null}
        </div>
      </div>

      <Show
        when={() => !addingCustom.value}
        fallback={<AddCustom onSubmit={addCustom} onCancel={() => (addingCustom.value = false)} />}
      >
        <Show when={input}>
          <div class="flex flex-col justify-center gap-2 md:flex-row">
            {closest.value ? (
              <Button onClick={() => addPokemon(closest.value!.species)}>
                Add {closest.value.species.name}
              </Button>
            ) : null}

            {closestLine.value ? (
              <Button onClick={() => addFamily(closestLine.value!)}>Add Family</Button>
            ) : null}

            {!closest.value?.exact ? (
              <Button look="secondary" onClick={() => (addingCustom.value = true)}>
                Add Custom
              </Button>
            ) : null}
          </div>
        </Show>
      </Show>
    </div>
  );
}
