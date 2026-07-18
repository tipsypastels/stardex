import { createMemo, For } from "solid-js";

export interface PieSlice {
  name: string;
  color: string;
  ratio: number;
}

interface PieSliceWithMeta extends PieSlice {
  d: string;
  incRatio: number;
}

export interface PieChartProps {
  slices: PieSlice[];
  donut?: boolean;
  diameter?: number;
  class?: string;
}

export function PieChart(props: PieChartProps) {
  const slicesWithMeta = createMemo(() => props.slices.reduce<PieSliceWithMeta[]>(reduceSlice, []));

  return (
    <svg
      class={`-rotate-90 ${props.class}`}
      viewBox="-1 -1 2 2"
      style={{ height: `${props.diameter ?? 250}px` }}
    >
      <For each={slicesWithMeta()}>
        {(slice) => <path data-name={slice.name} d={slice.d} style={{ fill: slice.color }} />}
      </For>
      {props.donut ? <circle r={0.6} cx={0} cy={0} fill="var(--background)" /> : null}
    </svg>
  );
}

function reduceSlice(prevs: PieSliceWithMeta[], curr: PieSlice): PieSliceWithMeta[] {
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
