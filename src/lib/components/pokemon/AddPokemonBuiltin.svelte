<script lang="ts">
  import { searchSpecies } from "$lib/models/species";
  import TypeName from "../common/TypeName.svelte";
  import AddPokemonOption from "./AddPokemonOption.svelte";
  import SpeciesIcon from "./SpeciesIcon.svelte";

  interface Props {
    query: string;
  }

  const MAX_RESULTS = 5;

  function runSearch() {
    if (query === "") return [];
    return searchSpecies(query).slice(0, MAX_RESULTS);
  }

  let { query = $bindable() }: Props = $props();
  let results = $derived(runSearch());
  let noExactMatch = $derived(!results.find((r) => r.name.toLowerCase() === query));
</script>

<ol>
  {#each results as result, i}
    <li class="mb-2 last:mb-0">
      <AddPokemonOption
        name={result.name}
        icon={result}
        aria-label="Add {result.name}"
        onclick={() => {}}
      >
        {#snippet subtitle()}
          <ul class="flex text-base">
            {#each result.type as type}
              <li class="mr-2">
                <TypeName for={type} />
              </li>
            {/each}
          </ul>
        {/snippet}
      </AddPokemonOption>
    </li>
  {/each}

  {#if query && noExactMatch}
    <li>
      <button
        class="flex w-full cursor-pointer items-center text-left"
        aria-label="Add Custom Pokémon '{query}'"
      >
        <div>
          <SpeciesIcon for={{ id: 0, name: query }} />
        </div>

        <div class="grow">
          <div>
            {query}
          </div>

          <div class="text-base">Add a Custom Pokémon</div>
        </div>
      </button>
    </li>
  {/if}
</ol>
