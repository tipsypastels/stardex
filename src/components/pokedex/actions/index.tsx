import { batch, createEffect, createSignal, Match, Show, Switch } from "solid-js";
import { pokedexFilter } from "../../../models/pokedex/filter";
import { pokedexMode } from "../../../models/pokedex/mode";
import type { AutosortRequest } from "../../../models/pokemon/autosort";
import { customIcons } from "../../../models/pokemon/custom_icon";
import { pokemons } from "../../../models/pokemon/list";
import { toasts } from "../../../models/ui/toast";
import { Button } from "../../common/button";
import { ActionBar, ActionBarItem } from "../../common/menus/action_bar";
import { Modal } from "../../common/menus/modal";
import { AddPokemon } from "../add";
import { AutosortPokedexModal } from "./autosort";
import { filterPokedexActionIcon, FilterPokedexModal } from "./filter";
import { ImportPokedexViaAction } from "./import";
import { PokedexModeModal } from "./mode";

export interface PokedexActionsProps {
  zapper: boolean;
  setZapper(zapper: boolean): void;
  onAutosort(request: AutosortRequest): void;
  afterActionChange(): void;
}

export function PokedexActions(props: PokedexActionsProps) {
  const [modal, setModal] = createSignal<"mode" | "filter" | "autosort" | "import" | "clear">();

  const isNonTextMode = () => pokedexMode.key !== "text";
  const isEmpty = () => pokemons.all.length === 0;

  createEffect(() => {
    if (isEmpty() || !isNonTextMode()) {
      props.setZapper(false);
    }
  });

  function toggleZapper() {
    batch(() => {
      if (props.zapper) {
        props.setZapper(false);
        toasts.add("bolt", "Zapper deactivated.");
      } else {
        props.setZapper(true);
        toasts.add("bolt", "Zapper active. Pokémon you click will be deleted!");
      }
    });
  }

  function clearPokedex() {
    batch(() => {
      setModal(undefined);
      pokemons.clear();
      customIcons.clear();
      toasts.add("trash", "Pokédex cleared! A blank slate...");
    });

    props.afterActionChange();
  }

  return (
    <>
      <ActionBar isUpperHalf>
        <ActionBarItem
          id="pokedex-mode"
          name="Mode"
          icon={pokedexMode.icon}
          onClick={() => setModal("mode")}
        />
        <Show when={isNonTextMode()}>
          {(_) => (
            <>
              <ActionBarItem
                id="pokedex-filter"
                name="Filter"
                icon={filterPokedexActionIcon(pokedexFilter.state)}
                active={!!pokedexFilter.state}
                disabled={isEmpty()}
                onClick={() => setModal("filter")}
              />
              <ActionBarItem
                id="pokedex-sort"
                name="Sort"
                icon="arrow-down-1-9"
                disabled={isEmpty()}
                onClick={() => setModal("autosort")}
              />
              <ActionBarItem
                id="pokedex-zapper"
                name="Zap"
                icon="bolt"
                active={props.zapper}
                disabled={isEmpty()}
                onClick={toggleZapper}
              />
            </>
          )}
        </Show>
        <ActionBarItem name="Import" icon="upload" onClick={() => setModal("import")} />
        <ActionBarItem
          name="Clear"
          icon="square-x"
          disabled={isEmpty()}
          onClick={() => setModal("clear")}
        />
      </ActionBar>

      <Show when={isNonTextMode()}>
        <AddPokemon />
      </Show>

      <Switch>
        <Match when={modal() === "mode"}>
          <PokedexModeModal onClose={() => setModal(undefined)} />
        </Match>

        <Match when={modal() === "filter"}>
          <FilterPokedexModal onClose={() => setModal(undefined)} />
        </Match>

        <Match when={modal() === "autosort"}>
          <AutosortPokedexModal
            onAutosort={(request) => {
              batch(() => {
                setModal(undefined);
                props.onAutosort(request);
              });
            }}
            onClose={() => setModal(undefined)}
          />
        </Match>

        <Match when={modal() === "clear"}>
          <Modal
            title="Clear Pokédex"
            onClose={() => setModal(undefined)}
            footer={
              <div class="flex flex-col justify-center">
                <Button onClick={clearPokedex} look="error">
                  Clear
                </Button>
              </div>
            }
            footerHasDivider
          >
            Are you sure you want to clear your Pokédex? You won't be getting any of it back.
          </Modal>
        </Match>
      </Switch>

      {/* NOTE: This has to be rendered unconditionally instead of matched because it contains its own modals. It does the conditional check internally instead. */}
      <ImportPokedexViaAction
        isOpen={modal() === "import"}
        onClose={() => setModal(undefined)}
        afterImport={props.afterActionChange}
      />
    </>
  );
}
