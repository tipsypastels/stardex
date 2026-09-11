import { createSignal, Show } from "solid-js";
import { pokemonsAllotment } from "../../models/metrics";
import { excludedTypes } from "../../models/type/excluded";
import { Empty } from "../common/empty";
import { ActionBar, ActionBarItem } from "../common/menus/action_bar";
import { Section } from "../layout/section";
import { CustomTypesModal } from "./custom";
import { ExcludedTypesModal } from "./excluded";
import { TypePieChart } from "./util/pie_chart";

export function Types() {
  const [modal, setModal] = createSignal<"excluded" | "custom">();

  return (
    <Section id="types" title="Types" hasActions>
      <ActionBar>
        <ActionBarItem
          name="Exclude"
          icon={excludedTypes.all.size === 0 ? "eye" : "eye-closed"}
          onClick={() => setModal("excluded")}
        />
        <ActionBarItem name="Custom" icon="question-circle" onClick={() => setModal("custom")} />
      </ActionBar>
      <Show
        when={pokemonsAllotment.value.total > 0}
        fallback={<Empty>You have no Pokémon yet.</Empty>}
      >
        <TypePieChart allotment={pokemonsAllotment.value} />
      </Show>
      <Show when={modal() === "excluded"}>
        <ExcludedTypesModal onClose={() => setModal()} />
      </Show>
      <Show when={modal() === "custom"}>
        <CustomTypesModal onClose={() => setModal()} />
      </Show>
    </Section>
  );
}
