import { useSignal, useSignalEffect } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { PokemonsContext, RegionsContext, StrictnessContext } from "../../state/context";
import { stored } from "../../utils/storage";
import { Empty } from "../common/empty";
import { ButtonLink } from "../common/link";
import { Actions } from "../common/menus/actions";
import { Section } from "../layout/section";
import { RecommendedChangeGroup } from "./groups";
import { regionsIcon, RegionsModal } from "./regions";
import { StrictnessModal } from "./strictness";

const store = stored<boolean>("stardex_recommendations_show_just_right");

export function Recommendations() {
  const pokemons = useContext(PokemonsContext);
  const regions = useContext(RegionsContext);
  const strictness = useContext(StrictnessContext);
  const showJustRight = useSignal(store.load() ?? false);

  const modal = useSignal<"regions" | "strictness">();

  useSignalEffect(() => {
    store.dump(showJustRight.value);
  });

  function emptyFallbacks() {
    return (
      <Show
        when={() => pokemons.size.value === 0}
        fallback={
          <Empty>
            <strong>No regions are selected!</strong>{" "}
            <ButtonLink onClick={() => (modal.value = "regions")} look="none" bold>
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
    <Section id="recommendations" title="Recommendations" hotkey="jumpToRecommendations" hasActions>
      <Actions
        actions={[
          {
            name: "Regions",
            icon: regionsIcon(regions),
            onClick: () => (modal.value = "regions"),
          },
          {
            name: "Strictness",
            icon: strictness.icon.value,
            onClick: () => (modal.value = "strictness"),
          },
        ]}
      />

      <Show
        when={() => pokemons.size.value > 0 && regions.size.value > 0}
        fallback={emptyFallbacks()}
      >
        <RecommendedChangeGroup change="remove" title="Too Many" />
        <RecommendedChangeGroup change="add" title="Too Few" />

        <Show when={showJustRight}>
          <RecommendedChangeGroup change="none" title="Just Right" />
        </Show>

        <ButtonLink onClick={() => (showJustRight.value = !showJustRight.value)}>
          {showJustRight.value ? "Hide" : "Show"} just right
        </ButtonLink>
      </Show>

      <Show when={() => modal.value === "regions"}>
        <RegionsModal regions={regions} onClose={() => (modal.value = undefined)} />
      </Show>

      <Show when={() => modal.value === "strictness"}>
        <StrictnessModal strictness={strictness} onClose={() => (modal.value = undefined)} />
      </Show>
    </Section>
  );
}
