<script lang="ts">
  import { ALL_SPECIES, resolveEvolutionLine, type Species } from "$lib/models/species";
  import { levenshteinDistance } from "@std/text";
  import SpeciesIcon from "../SpeciesIcon.svelte";
  import { pokemon, pokemonInclusion } from "$lib/state/pokemon";

  const DISTANCE_CUTOFF = 5; // in characters different

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

  function addCustom() {
    console.log("add custom");
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
      addCustom();
    }
  }

  function findClosest() {
    if (query === "") return;
    const queryLower = query.toLowerCase();

    let closestSpecies = ALL_SPECIES[0];
    let closestDistance = Infinity;

    for (const species of ALL_SPECIES) {
      const distance = levenshteinDistance(queryLower, species.nameLower);
      if (distance < closestDistance) {
        closestSpecies = species;
        closestDistance = distance;
      }
    }

    if (closestDistance > DISTANCE_CUTOFF) {
      return;
    }

    return {
      species: closestSpecies,
      distance: closestDistance,
    };
  }

  let query = $state("");
  let closest = $derived(findClosest());
  let closestLine = $derived(closest ? resolveEvolutionLine(closest.species) : undefined);
  let hasExactMatch = $derived(closest?.distance === 0);
</script>

<div class="mb-4 border-b-[1px] border-b-slate-300 pb-4">
  <div class="relative">
    <!-- svelte-ignore a11y_autofocus -->
    <input
      class="mb-4 block h-[80px] w-full"
      autofocus
      placeholder="Add a Pokémon"
      bind:value={query}
      onkeyup={handleKeyUp}
    />

    <div class="absolute right-0 top-0">
      {#if closest}
        <SpeciesIcon for={closest.species} />
      {:else if query}
        <SpeciesIcon for={{ id: 0, name: `Custom Pokémon '${query}'` }} />
      {/if}
    </div>
  </div>

  {#if query}
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
      >
        Add Custom Pokémon '{query}'
      </button>
    </div>
  {/if}
</div>
