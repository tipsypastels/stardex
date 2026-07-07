import type { Allotment } from "../../../metrics/allotment";
import { PieChart } from "../../graphs/pie_chart";
import { TypeName } from "./type_name";

export interface TypePieChartProps {
  allotment: Allotment;
}

export function TypePieChart(props: TypePieChartProps) {
  const types = [...props.allotment.types.values()];
  const slices = types.map(({ type, ratio }) => ({
    name: type.name,
    color: type.color,
    ratio,
  }));

  return (
    <div class="mx-auto flex w-fit flex-col items-center gap-4 lg:mx-0 lg:flex-row">
      <div>
        <PieChart slices={slices} />
      </div>

      <div>
        <ol>
          {types.map(({ type, ratio, count }) => (
            <li>
              <TypeName type={type} /> — {(ratio * 100).toFixed(2)}% ({count})
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
