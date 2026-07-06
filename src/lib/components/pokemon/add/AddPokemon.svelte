<script lang="ts">
  import { Species } from "$lib/models/species";
  import SpeciesIcon from "../icon/SpeciesIcon.svelte";
  import { pokemons } from "$lib/state/pokemons";
  import AddCustom from "./AddCustom.svelte";
  import { BuiltinPokemon, type Pokemon } from "$lib/models/pokemon";
  import { onMount } from "svelte";
  import hotkeys from "hotkeys-js";
  import Fuse from "fuse.js";

  const SEARCH = new Fuse(Species.ALL, {
    keys: ["name"],
    threshold: 0.1,
    includeScore: true,
  });

  function addPokemon(species: Species) {
    const included = $pokemons.hasKey(species.key);
    if (included) {
      alert(`${species.name} is already in your Pokédex!`);
    } else {
      pokemons.push(BuiltinPokemon.of(species.key));
    }
    query = "";
  }

  function addFamily(line: Species[]) {
    const lineNotIncluded = line.filter((species) => !$pokemons.hasKey(species.key));
    if (lineNotIncluded.length === 0) {
      alert(`The ${line[0].name} family is already in your Pokédex!`);
    } else {
      pokemons.push(...lineNotIncluded.map((species) => BuiltinPokemon.of(species.key)));
    }
    query = "";
  }

  function addCustom(pokemon: Pokemon) {
    pokemons.push(pokemon);
    query = "";
    closeCustomEditor();
  }

  function openCustomEditor() {
    editingCustom = true;
  }

  // TODO: Refocus the query input.
  function closeCustomEditor() {
    editingCustom = false;
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key !== "Enter" || query === "") {
      return;
    }
    if (e.shiftKey && closestLine && closestLine.length > 1) {
      addFamily(closestLine);
    } else if (closest) {
      addPokemon(closest.species);
    } else {
      openCustomEditor();
    }
  }

  function findClosest() {
    if (query === "") return;

    const result = SEARCH.search(query, { limit: 1 }).at(0);
    if (!result) return;

    const species = result.item;
    // For whatever reason, Fuse returns infinitesimals for exact matches, not zeroes. Bug?
    const exact = !!result.score && result.score <= 1e-15;
    return { species, exact };
  }

  let queryInput: HTMLInputElement;

  let query = $state("");
  let editingCustom = $state(false);

  let closest = $derived(findClosest());
  let closestLine = $derived(closest ? closest.species.getEvolutionLine() : undefined);
  let hasExactMatch = $derived(closest?.exact);

  onMount(() => {
    hotkeys("a", (e) => {
      e.preventDefault();
      queryInput.focus();
    });
    return () => hotkeys.unbind("a");
  });
</script>

<div>
  <div class="relative">
    <input
      class="mb-4 block h-[80px] w-full disabled:cursor-not-allowed disabled:bg-slate-100"
      placeholder="Add a Pokémon"
      bind:value={query}
      bind:this={queryInput}
      onkeyup={handleKeyUp}
      disabled={editingCustom}
    />

    <div class="absolute top-0 right-0">
      {#if closest}
        <SpeciesIcon for={closest.species} />
      {:else if query}
        <SpeciesIcon for={{ id: 0, name: `Custom Pokémon '${query}'` }} />
      {/if}
    </div>
  </div>

  {#if editingCustom}
    <AddCustom {query} submit={addCustom} cancel={closeCustomEditor} />
  {:else if query}
    <div class="flex flex-col justify-center gap-2 md:flex-row">
      {#if closest}
        <button
          class="cursor-pointer rounded-md bg-lime-600 px-4 py-2 text-white transition hover:-translate-y-1"
          onclick={() => addPokemon(closest.species)}
        >
          Add {closest.species.name}
        </button>
      {/if}

      {#if closestLine && closestLine.length > 1}
        <button
          class="cursor-pointer rounded-md bg-lime-600 px-4 py-2 text-white transition hover:-translate-y-1"
          onclick={() => addFamily(closestLine)}>Add Family</button
        >
      {/if}

      <button
        class="cursor-pointer rounded-md bg-slate-300 px-4 py-2 transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:line-through disabled:hover:translate-y-0"
        disabled={hasExactMatch}
        onclick={openCustomEditor}
      >
        Add Custom Pokémon '{query}'
      </button>
    </div>
  {/if}
</div>
