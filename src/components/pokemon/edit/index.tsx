import { batch, Signal, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { ButtonLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";
import { EditPokemonBehavior } from "./behavior";
import { EditPokemonCustomIconLink, EditPokemonCustomIconModal } from "./custom_icon";
import { EditPokemonName } from "./name";
import { EditPokemonTypes } from "./types";

export interface EditPokemonModalProps {
  index: number;
  onClose(): void;
}

export function EditPokemonModal({ index, onClose }: EditPokemonModalProps) {
  const pokemons = useContext(PokemonsContext);
  const pokemon = pokemons.get(index)!;
  const customIconFile = useSignal<File>();

  function onRemove() {
    batch(() => {
      toasts.add("times", `Removed ${pokemon.name.peek()}!`);
      pokemons.delete(index);
      onClose();
    });
  }

  return (
    <Show when={customIconFile} fallback={editMainView(pokemon, onClose, onRemove, customIconFile)}>
      {(file) => (
        <EditPokemonCustomIconModal
          pokemon={pokemon}
          file={file}
          onClose={onClose}
          onFinishOrCancel={() => (customIconFile.value = undefined)}
        />
      )}
    </Show>
  );
}

function editMainView(
  pokemon: Pokemon,
  onClose: () => void,
  onRemove: () => void,
  customIconFile: Signal<File | undefined>,
) {
  return (
    <Modal
      title={`Edit ${pokemon.name.value}`}
      onClose={onClose}
      footer={
        <div class="text-right">
          <ButtonLink look="warning" onClick={onRemove}>
            Remove {pokemon.name}
          </ButtonLink>
        </div>
      }
      hasFooterDivider
    >
      <Show when={() => !pokemon.species.value}>
        <EditPokemonName pokemon={pokemon} />
      </Show>

      <EditPokemonTypes pokemon={pokemon} />
      <EditPokemonCustomIconLink onUpload={(file) => (customIconFile.value = file)} />
      <EditPokemonBehavior pokemon={pokemon} />
    </Modal>
  );
}
