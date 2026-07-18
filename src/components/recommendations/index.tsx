import { createSignal, Show } from "solid-js";
import { pokemons } from "../../models/pokemon/list";
import { regions } from "../../models/region/set";
import { strictness } from "../../models/strictness";
import { Empty } from "../common/empty";
import { ButtonLink } from "../common/link";
import { ActionBar, ActionBarItem } from "../common/menus/action_bar";
import { Section } from "../layout/section";
import { RecommendedChangeGroup } from "./group";
import { regionsIcon, RegionsModal } from "./regions";
import { StrictnessModal } from "./strictness";

export function Recommendations() {
  const [modal, setModal] = createSignal<"regions" | "strictness">();

  function emptyFallbacks() {
    return (
      <Show
        when={pokemons.all.length === 0}
        fallback={
          <Empty>
            <strong>No regions are selected!</strong>{" "}
            <ButtonLink onClick={() => setModal("regions")} look="none" bold>
              Select some
            </ButtonLink>{" "}
            to get recommendations.
          </Empty>
        }
      >
        <Empty>You still have no Pokémon yet.</Empty>
      </Show>
    );
  }

  return (
    <Section id="recommendations" title="Recommendations" hasActions>
      <ActionBar>
        <ActionBarItem name="Regions" icon={regionsIcon()} onClick={() => setModal("regions")} />
        <ActionBarItem
          name="Strictness"
          icon={strictness.icon}
          onClick={() => setModal("strictness")}
        />
      </ActionBar>

      <Show when={pokemons.all.length > 0 && regions.all.length > 0} fallback={emptyFallbacks()}>
        <RecommendedChangeGroup change="remove" title="Too Many" />
        <RecommendedChangeGroup change="add" title="Too Few" />
        <RecommendedChangeGroup change="none" title="Just Right" />
      </Show>

      <Show when={modal() === "regions"}>
        <RegionsModal onClose={() => setModal(undefined)} />
      </Show>

      <Show when={modal() === "strictness"}>
        <StrictnessModal onClose={() => setModal(undefined)} />
      </Show>
    </Section>
  );
}
