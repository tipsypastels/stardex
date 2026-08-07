import { createSignal, Show } from "solid-js";
import { recommendations } from "../../models/metrics";
import { pokemons } from "../../models/pokemon/list";
import { regions } from "../../models/region/set";
import { strictness } from "../../models/strictness";
import { Empty } from "../common/empty";
import { ButtonLink } from "../common/link";
import { ActionBar, ActionBarItem } from "../common/menus/action_bar";
import { Section } from "../layout/section";
import { RecommendedChangeGroup } from "./group";
import { createPipRecommendations, PipRecommendations } from "./pip";
import { regionsIcon, RegionsModal } from "./regions";
import { StrictnessModal } from "./strictness";

export function Recommendations() {
  const [modal, setModal] = createSignal<"regions" | "strictness">();
  const pip = createPipRecommendations();

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
    <>
      <Section id="recommendations" title="Recommendations" hasActions>
        <ActionBar>
          <ActionBarItem name="Regions" icon={regionsIcon()} onClick={() => setModal("regions")} />
          <ActionBarItem
            name="Strictness"
            icon={strictness.icon}
            onClick={() => setModal("strictness")}
          />
          <ActionBarItem name="Pop Out" icon="picture-in-picture" onClick={() => pip.toggle()} />
        </ActionBar>

        <Show when={pokemons.all.length > 0 && regions.all.length > 0} fallback={emptyFallbacks()}>
          <RecommendedChangeGroup recommendations={recommendations.value.remove} title="Too Many" />
          <RecommendedChangeGroup recommendations={recommendations.value.add} title="Too Few" />
          <RecommendedChangeGroup recommendations={recommendations.value.none} title="Just Right" />
        </Show>

        <Show when={modal() === "regions"}>
          <RegionsModal onClose={() => setModal(undefined)} />
        </Show>

        <Show when={modal() === "strictness"}>
          <StrictnessModal onClose={() => setModal(undefined)} />
        </Show>
      </Section>

      <Show when={pip.inOrAnimating}>
        <PipRecommendations pip={pip} />
      </Show>
    </>
  );
}
