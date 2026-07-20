import Fuse from "fuse.js";
import { batch, createMemo, createSignal, Show } from "solid-js";
import { BUILTIN_POKEMONS, CUSTOM_POKEMONS } from "../../../models/pokemon";
import { EVOLUTION_LINES } from "../../../models/pokemon/evolution_line";
import { pokemons } from "../../../models/pokemon/list";
import { Species, SPECIES } from "../../../models/pokemon/species";
import { capitalizeWords } from "../../../utils/string";
import { Button } from "../../common/button";
import { SpeciesIcon } from "../util/species_icon";
import { AddCustom } from "./custom";

const FUSE = new Fuse(SPECIES.all, {
  keys: ["name", "hiddenName"],
  threshold: 0.1,
  includeScore: true,
});

export function AddPokemon() {
  const [query, setQuery] = createSignal("");
  const queryCapitalizedWords = createMemo(() => capitalizeWords(query()));
  const [addingCustom, setAddingCustom] = createSignal(false);

  const closest = createMemo(() => {
    if (query() === "") return;

    const result = FUSE.search(query(), { limit: 1 }).at(0);
    if (!result) return;

    const species = result.item;
    // For whatever reason, Fuse returns infinitesimals for exact matches, not zeroes. Bug?
    const exact = !!result.score && result.score <= 1e-7;
    return { species, exact };
  });

  const closestLine = createMemo(() => {
    const pokemon = closest();
    if (!pokemon) return;

    const line = EVOLUTION_LINES.of(pokemon.species);
    if (line.length > 1) return line;
  });

  function addPokemon(species: Species) {
    batch(() => {
      pokemons.push(BUILTIN_POKEMONS.of(species));
      setQuery("");
    });
  }

  function addFamily(family: Species[]) {
    batch(() => {
      pokemons.pushMany(family.map(BUILTIN_POKEMONS.of));
      setQuery("");
    });
  }

  function addCustom(typeKeys: string[]) {
    const name = queryCapitalizedWords();

    batch(() => {
      pokemons.push(CUSTOM_POKEMONS.of(name, typeKeys));
      setQuery("");
      setAddingCustom(false);
    });
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key !== "Enter" || query() === "") {
      return;
    }

    let family: Species[] | undefined;
    let species: Species | undefined;

    if (e.shiftKey && (family = closestLine())) {
      addFamily(family);
    } else if ((species = closest()?.species)) {
      addPokemon(species);
    } else {
      setAddingCustom(true);
    }
  }

  function closestIcon() {
    const species = closest()?.species;
    if (species) {
      return <SpeciesIcon id={species.id} name={species.name} />;
    } else if (query()) {
      return <SpeciesIcon id={0} name={queryCapitalizedWords()} />;
    } else {
      return null;
    }
  }

  return (
    <div class="mb-8">
      <div class="relative mb-2 rounded-b-md border-2 border-t-0 border-secondary">
        <input
          id="add-pokemon"
          class="block h-20 w-full border-0"
          placeholder="Enter a Pokémon..."
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          onKeyUp={handleKeyUp}
          disabled={addingCustom()}
        />

        <div class="absolute top-0 right-0">{closestIcon()}</div>
      </div>

      <Show
        when={!addingCustom()}
        fallback={<AddCustom onSubmit={addCustom} onCancel={() => setAddingCustom(false)} />}
      >
        <Show when={query()}>
          <div class="flex flex-col justify-center gap-2 md:flex-row">
            <Show when={closest()}>
              {(closest) => (
                <Button onClick={() => addPokemon(closest().species)}>
                  Add {closest().species.name}
                </Button>
              )}
            </Show>

            <Show when={closestLine()}>
              {(closestLine) => (
                <Button onClick={() => addFamily(closestLine())}>Add Family</Button>
              )}
            </Show>

            <Show when={!closest()?.exact}>
              <Button look="secondary" onClick={() => setAddingCustom(true)}>
                Add Custom
              </Button>
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  );
}
