<script lang="ts">
  import Icon from "$lib/components/common/Icon.svelte";
  import type { Pokemon, PokemonRecommendationBehaviour } from "$lib/models/pokemon";
  import { pokemon } from "$lib/state/pokemon";

  interface Props {
    index: number;
    mon: Pokemon;
    close(): void;
  }

  let { index, mon, close }: Props = $props();

  function onRecChange(
    e: { currentTarget: HTMLInputElement },
    rec: PokemonRecommendationBehaviour,
  ) {
    if (e.currentTarget.checked) {
      pokemon.setRec(index, rec);
    }
  }
</script>

{#snippet recOption(label: string, rec: PokemonRecommendationBehaviour)}
  <label class="block">
    <input
      type="radio"
      name="rec"
      checked={mon.rec === rec}
      onchange={(e) => onRecChange(e, rec)}
    />
    {label}
  </label>
{/snippet}

<section>
  <h2 class="mb-2 text-center md:text-left">
    <Icon name="eyes fa-flip-horizontal" />
    Recommendation Behaviour
  </h2>

  <div class="ml-2">
    {@render recOption("Normal", undefined)}
    {@render recOption("Exempt", "exempt")}
    {@render recOption("Filler", "filler")}
  </div>
</section>
