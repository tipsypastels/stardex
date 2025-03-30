<script lang="ts">
  import TypeName from "$lib/components/common/TypeName.svelte";
  import PieChart from "$lib/components/graphs/PieChart.svelte";
  import type { Allotment } from "$lib/metrics/allotment";

  interface Props {
    allotment: Allotment;
  }

  let { allotment }: Props = $props();
  let slices = $derived(
    [...allotment.types.values()].map((ty) => ({
      name: ty.type.name,
      color: ty.type.color,
      ratio: ty.ratio,
    })),
  );
</script>

<div class="mx-auto flex w-fit flex-col items-center gap-4 lg:mx-0 lg:flex-row">
  <div>
    <PieChart {slices} />
  </div>

  <div>
    <ol>
      {#each allotment.types.values() as ty}
        <li>
          <TypeName for={ty.typeKey} />
          — {(ty.ratio * 100).toFixed(2)}% ({ty.count})
        </li>
      {/each}
    </ol>
  </div>
</div>
