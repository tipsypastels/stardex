import { createSignal, Show } from "solid-js";
import { pokemonsAllotment } from "../../models/metrics";
import { excludedTypes } from "../../models/type/excluded";
import { Empty } from "../common/empty";
import { ActionBar, ActionBarItem } from "../common/menus/action_bar";
import { Section } from "../layout/section";
import { ExcludedTypesModal } from "./excluded";
import { TypePieChart } from "./util/pie_chart";

export function Types() {
  const [excludedModalOpen, setExcludedModalOpen] = createSignal(false);

  return (
    <Section id="types" title="Types" hasActions>
      <ActionBar>
        <ActionBarItem
          name="Exclude"
          icon={excludedTypes.all.size === 0 ? "eye" : "eye-closed"}
          onClick={() => setExcludedModalOpen(true)}
        />
      </ActionBar>
      <Show
        when={pokemonsAllotment.value.total > 0}
        fallback={<Empty>You have no Pokémon yet.</Empty>}
      >
        <TypePieChart allotment={pokemonsAllotment.value} />
      </Show>
      <Show when={excludedModalOpen()}>
        <ExcludedTypesModal onClose={() => setExcludedModalOpen(false)} />
      </Show>
    </Section>
  );
}
