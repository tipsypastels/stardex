import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { MetricsContext } from "../../state/context";
import { Empty } from "../common/empty";
import { Section } from "../layout/section";
import { TypesActions } from "./actions";
import { TypePieChart } from "./util/pie_chart";

export function Types() {
  const metrics = useContext(MetricsContext);
  return (
    <Section id="types" title="Types" hotkey="jumpToTypes" hasActions>
      <TypesActions />
      <Show
        when={() => metrics.pokemonsAllotment.value.total > 0}
        fallback={<Empty>You have no Pokémon yet.</Empty>}
      >
        <TypePieChart allotment={metrics.pokemonsAllotment.value} />
      </Show>
    </Section>
  );
}
