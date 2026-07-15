import { batch, useComputed, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import Fuse from "fuse.js";
import { useContext, useRef } from "preact/hooks";
import { EVOLUTION_LINES } from "../../../models/pokemon/evolution_line";
import { Species, SPECIES } from "../../../models/pokemon/species";
import { PokemonsContext } from "../../../state/context";
import { capitalizeWords } from "../../../utils/string";
import { Button } from "../../common/button";
import { useHotkey } from "../../layout/hotkeys";
import { SpeciesIcon } from "../util/species_icon";
import { AddCustom } from "./custom";

const FUSE = new Fuse(SPECIES.all, {
  keys: ["name", "hiddenName"],
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
      pokemons.pushBuiltins([species.key]);
      input.value = "";
    });
  }

  function addFamily(family: Species[]) {
    batch(() => {
      pokemons.pushBuiltins(family.map((species) => species.key));
      input.value = "";
    });
  }

  function addCustom(typeKeys: string[]) {
    const name = inputCapitalizedWords.value;

    batch(() => {
      pokemons.pushCustom(name, typeKeys);
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

  useHotkey("focusAddPokemon", (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });

  return (
    <div class="mb-8">
      <div class="relative mb-2 rounded-b-md border-2 border-t-0 border-secondary">
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

            {closestLine.value && closestLine.value.length > 1 ? (
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
