import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { ExcludedTypesContext, MetricsContext } from "../../state/context";
import { Empty } from "../common/empty";
import { ActionBar, ActionBarItem } from "../common/menus/action_bar";
import { Section } from "../layout/section";
import { ExcludedTypesModal } from "./excluded";
import { TypePieChart } from "./util/pie_chart";

export function Types() {
  const excludedTypes = useContext(ExcludedTypesContext);
  const metrics = useContext(MetricsContext);

  const excludedModalOpen = useSignal(false);

  return (
    <Section id="types" title="Types" hotkey="jumpToTypes" hasActions>
      <ActionBar>
        <ActionBarItem
          name="Exclude"
          icon={excludedTypes.all.value.size === 0 ? "eye" : "eye-closed"}
          onClick={() => (excludedModalOpen.value = true)}
        />
      </ActionBar>
      <Show
        when={() => metrics.pokemonsAllotment.value.total > 0}
        fallback={<Empty>You have no Pokémon yet.</Empty>}
      >
        <TypePieChart allotment={metrics.pokemonsAllotment.value} />
      </Show>
      <Show when={excludedModalOpen}>
        <ExcludedTypesModal
          excludedTypes={excludedTypes}
          onClose={() => (excludedModalOpen.value = false)}
        />
      </Show>
    </Section>
  );
}
