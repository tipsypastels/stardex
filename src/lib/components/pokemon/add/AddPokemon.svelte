<script lang="ts">
  import { ALL_SPECIES, resolveEvolutionLine, type Species } from "$lib/models/species";
  import SpeciesIcon from "../icon/SpeciesIcon.svelte";
  import { pokemon, pokemonInclusion } from "$lib/state/pokemon";
  import AddCustom from "./AddCustom.svelte";
  import type { Pokemon } from "$lib/models/pokemon";
  import { onMount } from "svelte";
  import hotkeys from "hotkeys-js";
  import Fuse from "fuse.js";

  const SEARCH = new Fuse(ALL_SPECIES, {
    keys: ["name"],
    threshold: 0.1,
    includeScore: true,
  });

  function addMon(species: Species) {
    const included = $pokemonInclusion.has(species.key);
    if (included) {
      alert(`${species.name} is already in your Pokédex!`);
    } else {
      pokemon.add({ species });
    }
    query = "";
  }

  function addFamily(line: Species[]) {
    const lineNotIncluded = line.filter((sp) => !$pokemonInclusion.has(sp.key));
    if (lineNotIncluded.length === 0) {
      alert(`The ${line[0].name} family is already in your Pokédex!`);
    } else {
      pokemon.addBatch(lineNotIncluded.map((species) => ({ species })));
    }
    query = "";
  }

  function addCustom(mon: Pokemon) {
    pokemon.add(mon);
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
      addMon(closest.species);
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
  let closestLine = $derived(closest ? resolveEvolutionLine(closest.species) : undefined);
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
          onclick={() => addMon(closest.species)}
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
