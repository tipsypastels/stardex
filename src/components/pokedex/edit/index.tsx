import { batch, createMemo, Show } from "solid-js";
import { pokemons } from "../../../models/pokemon/list";
import { toasts } from "../../../models/ui/toast";
import { ButtonLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";
import { EditPokemonBehavior } from "./behavior";
import {
  createCustomIconUploadState,
  EditPokemonCustomIconLink,
  EditPokemonCustomIconModal,
} from "./custom_icon";
import { EditPokemonName } from "./name";
import { EditPokemonTypes } from "./types";

export interface EditPokemonModalProps {
  id: string;
  onClose(): void;
}

export function EditPokemonModal(props: EditPokemonModalProps) {
  const pokemon = createMemo(() => pokemons.all.find((pokemon) => pokemon.id === props.id)!);
  const mutator = createMemo(() => pokemons.mutator(props.id));

  const customIconState = createCustomIconUploadState(() => props.id);

  function onRemove() {
    batch(() => {
      toasts.add("times", `Removed ${pokemon().name}!`);
      pokemons.delete(props.id);
      props.onClose();
    });
  }

  return (
    <Show
      when={customIconState.uploaded}
      fallback={
        <Modal
          title={`Edit ${pokemon.name}`}
          onClose={props.onClose}
          footer={
            <div class="text-right">
              <ButtonLink look="warning" onClick={onRemove}>
                Remove {pokemon().name}
              </ButtonLink>
            </div>
          }
          footerHasDivider
        >
          <Show when={pokemon().isCustom()}>
            <EditPokemonName pokemon={pokemon()} mutator={mutator()} />
          </Show>

          <EditPokemonTypes pokemon={pokemon()} mutator={mutator()} />
          <EditPokemonCustomIconLink state={customIconState} />
          <EditPokemonBehavior pokemon={pokemon()} mutator={mutator()} />
        </Modal>
      }
    >
      {(file) => (
        <EditPokemonCustomIconModal
          pokemon={pokemon()}
          initialFile={file()}
          onClose={props.onClose}
          onCancel={() => customIconState.setUploaded(undefined)}
        />
      )}
    </Show>
  );
}
