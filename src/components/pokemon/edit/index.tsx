import { batch } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import type { Pokemon } from "../../../models/pokemon";
import { PokemonsContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { ButtonLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";
import { EditPokemonBehavior } from "./behavior";
import {
  EditPokemonCustomIconLink,
  EditPokemonCustomIconModal,
  useCustomIconUploadState,
  type CustomIconUploadState,
} from "./custom_icon";
import { EditPokemonName } from "./name";
import { EditPokemonTypes } from "./types";

export interface EditPokemonModalProps {
  index: number;
  onClose(): void;
}

export function EditPokemonModal({ index, onClose }: EditPokemonModalProps) {
  const pokemons = useContext(PokemonsContext);
  const pokemon = pokemons.get(index)!;
  const customIconState = useCustomIconUploadState(pokemon);

  function onRemove() {
    batch(() => {
      toasts.add("times", `Removed ${pokemon.name.peek()}!`);
      pokemons.delete(index);
      onClose();
    });
  }

  return (
    <Show
      when={customIconState.uploaded}
      fallback={editMainView(pokemon, customIconState, onClose, onRemove)}
    >
      {(file) => (
        <EditPokemonCustomIconModal
          pokemon={pokemon}
          file={file}
          onClose={onClose}
          onCancel={() => (customIconState.uploaded.value = undefined)}
        />
      )}
    </Show>
  );
}

function editMainView(
  pokemon: Pokemon,
  customIconState: CustomIconUploadState,
  onClose: () => void,
  onRemove: () => void,
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
      <EditPokemonCustomIconLink state={customIconState} />
      <EditPokemonBehavior pokemon={pokemon} />
    </Modal>
  );
}
