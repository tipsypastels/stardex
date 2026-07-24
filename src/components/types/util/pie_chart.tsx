import { createSignal, For } from "solid-js";
import type { Allotment } from "../../../metrics/allotment";
import { PieChart } from "../../common/graphs/pie_chart";
import { TypeName } from "./name";

export interface TypePieChartProps {
  allotment: Allotment;
}

export function TypePieChart(props: TypePieChartProps) {
  const [donut, setDonut] = createSignal(true);

  const types = () => [...props.allotment.types.values()];
  const slices = () =>
    types().map(({ type, ratio }) => ({
      name: type.name,
      color: type.color,
      ratio,
    }));

  return (
    <div class="mx-auto flex w-fit flex-col items-center gap-4 lg:flex-row">
      <div onClick={() => setDonut((donut) => !donut)}>
        <PieChart slices={slices()} class="dim" donut={donut()} />
      </div>

      <div>
        <ol>
          <For each={types()}>
            {({ type, ratio, count }) => (
              <li>
                <TypeName type={type} />
                <span class="text-foreground-muted">
                  {" "}
                  — {(ratio * 100).toFixed(2)}% ({count})
                </span>
              </li>
            )}
          </For>
        </ol>
      </div>
    </div>
  );
}
