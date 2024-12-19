<script lang="ts" module>
  export interface PieSlice {
    name: string;
    color: string;
    ratio: number;
  }
</script>

<script lang="ts">
  interface Props {
    slices: PieSlice[];
    donut?: boolean;
    diameter?: number;
  }

  interface SliceWithMeta extends PieSlice {
    d: string;
    incRatio: number;
  }

  function reduceSlice(prevs: SliceWithMeta[], curr: PieSlice): SliceWithMeta[] {
    const prev = prevs.at(-1);
    const prevIncRatio = prev?.incRatio ?? 0;
    const [startX, startY] = coords(prevIncRatio);

    const incRatio = prevIncRatio + curr.ratio;
    const [endX, endY] = coords(incRatio);

    const large = curr.ratio > 0.5 ? 1 : 0;
    const d = `M ${startX} ${startY} A 1 1 0 ${large} 1 ${endX} ${endY} L 0 0`;

    return prevs.concat({ ...curr, incRatio, d });
  }

  function coords(incRatio: number): [number, number] {
    const x = Math.cos(2 * Math.PI * incRatio);
    const y = Math.sin(2 * Math.PI * incRatio);
    return [x, y];
  }

  let { slices, donut = true, diameter = 250 }: Props = $props();
  let slicesWithMeta = $derived(slices.reduce<SliceWithMeta[]>(reduceSlice, []));
</script>

<svg class="-rotate-90" viewBox="-1 -1 2 2" style:height="{diameter}px">
  {#each slicesWithMeta as slice}
    <path data-name={slice.name} d={slice.d} style:fill={slice.color} />
  {/each}

  {#if donut}
    <circle r={0.6} cx={0} cy={0} fill="white" />
  {/if}
</svg>
