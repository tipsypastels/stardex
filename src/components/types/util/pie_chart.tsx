import { For, type JSXElement } from "solid-js";
import type { AllotedType, Allotment } from "../../../metrics/allotment";
import { PieChart } from "../../common/graphs/pie_chart";
import { TypeName } from "./name";

export interface TypePieChartProps {
  allotment: Allotment;
  diameter?: number;
  class?: string;
  olClass?: string;
  renderLiExtra?(allotedType: AllotedType): JSXElement;
}

export function TypePieChart(props: TypePieChartProps) {
  const types = () => [...props.allotment.types.values()];
  const slices = () =>
    types().map(({ type, ratio }) => ({
      name: type.name,
      color: type.color,
      ratio,
    }));

  return (
    <div class={`mx-auto flex w-fit flex-col items-center gap-4 ${props.class}`}>
      <PieChart slices={slices()} diameter={props.diameter} class="shrink-0 dim" donut />
      <ol class={props.olClass}>
        <For each={types()}>
          {(alloted) => (
            <li>
              <TypeName type={alloted.type} />
              <span class="text-foreground-muted">
                {" "}
                — {(alloted.ratio * 100).toFixed(2)}% ({alloted.count}){" "}
                {props.renderLiExtra?.(alloted)}
              </span>
            </li>
          )}
        </For>
      </ol>
    </div>
  );
}
