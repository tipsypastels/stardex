<script lang="ts">
  import { search } from "$lib/search";
  import TypeName from "../common/TypeName.svelte";
  import AddPokemonOption from "./AddPokemonOption.svelte";
  import SpeciesIcon from "./SpeciesIcon.svelte";

  interface Props {
    query: string;
  }

  const MAX_RESULTS = 3;

  function runSearch() {
    if (query === "") return [];
    return search(query).slice(0, MAX_RESULTS);
  }

  let { query = $bindable() }: Props = $props();
  let results = $derived(runSearch());
  let exactMatch = $derived(results[0]?.distance === 0);
</script>

<ol>
  {#each results as result, i}
    {@const { species } = result}
    <li class="mb-2 last:mb-0">
      <AddPokemonOption
        name={species.name}
        icon={species}
        aria-label="Add {species.name}"
        onclick={() => {}}
      >
        {#snippet subtitle()}
          <ul class="flex text-base">
            {#each species.type as type}
              <li class="mr-2">
                <TypeName for={type} />
              </li>
            {/each}
          </ul>
        {/snippet}
      </AddPokemonOption>
    </li>
  {/each}

  {#if query && !exactMatch}
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
