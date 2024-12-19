<script lang="ts">
  import { resolvePokemonTypeKeys, type Pokemon } from "$lib/models/pokemon";
  import { pokemon } from "$lib/state/pokemon";

  interface Props {
    index: number;
    mon: Pokemon;
    close(): void;
  }

  let { index, mon }: Props = $props();
  const initialTypeKeys = resolvePokemonTypeKeys(mon);

  let customType1 = $state(initialTypeKeys[0] ?? "");
  let customType2 = $state(initialTypeKeys[1] ?? "");

  function handleBlur(value: string, index: number) {}
</script>

<section class="mb-4">
  <h2 class="font-bold">Types</h2>

  <input class="w-20 border-0 border-b-2 border-b-slate-600" bind:value={customType1} />
  and
  <input class="w-20 border-0 border-b-2 border-b-slate-600" bind:value={customType2} />
</section>

<section>
  <h2 class="font-bold">Behaviour</h2>

  <label class="flex items-center justify-center md:justify-normal">
    <input
      type="checkbox"
      class="mr-2"
      checked={mon.exclude}
      onchange={(e) => pokemon.setExclude(index, e.currentTarget.checked)}
    />
    <div>Exclude this Pokémon from recommendations.</div>
  </label>
</section>
