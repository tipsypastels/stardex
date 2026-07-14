import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import {
  ExcludedTypesContext,
  PokemonsContext,
  RegionsContext,
  StrictnessContext,
} from "../../state/context";
import { Empty } from "../common/empty";
import { ButtonLink } from "../common/link";
import { ActionBar, ActionBarItem } from "../common/menus/action_bar";
import { Section } from "../layout/section";
import { ExcludedTypesModal } from "./excluded";
import { RecommendedChangeGroup } from "./groups";
import { regionsIcon, RegionsModal } from "./regions";
import { StrictnessModal } from "./strictness";

export function Recommendations() {
  const pokemons = useContext(PokemonsContext);
  const regions = useContext(RegionsContext);
  const strictness = useContext(StrictnessContext);
  const excludedTypes = useContext(ExcludedTypesContext);

  const modal = useSignal<"regions" | "strictness" | "exclude">();

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
      <ActionBar>
        <ActionBarItem
          name="Regions"
          icon={regionsIcon(regions)}
          onClick={() => (modal.value = "regions")}
        />
        <ActionBarItem
          name="Strictness"
          icon={strictness.icon.value}
          onClick={() => (modal.value = "strictness")}
        />
        <ActionBarItem
          name="Exclude"
          icon={excludedTypes.all.value.size === 0 ? "eye" : "eye-closed"}
          onClick={() => (modal.value = "exclude")}
        />
      </ActionBar>

      <Show
        when={() => pokemons.size.value > 0 && regions.size.value > 0}
        fallback={emptyFallbacks()}
      >
        <RecommendedChangeGroup change="remove" title="Too Many" />
        <RecommendedChangeGroup change="add" title="Too Few" />
        <RecommendedChangeGroup change="none" title="Just Right" />
      </Show>

      <Show when={() => modal.value === "regions"}>
        <RegionsModal regions={regions} onClose={() => (modal.value = undefined)} />
      </Show>

      <Show when={() => modal.value === "strictness"}>
        <StrictnessModal strictness={strictness} onClose={() => (modal.value = undefined)} />
      </Show>

      <Show when={() => modal.value === "exclude"}>
        <ExcludedTypesModal
          excludedTypes={excludedTypes}
          onClose={() => (modal.value = undefined)}
        />
      </Show>
    </Section>
  );
}
