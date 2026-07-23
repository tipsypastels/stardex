import { batch, createMemo, Show } from "solid-js";
import { customIcons } from "../../../models/pokemon/custom_icon";
import { pokemons } from "../../../models/pokemon/list";
import { toasts } from "../../../models/ui/toast";
import { ButtonLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";
import { PokemonIcon } from "../util/pokemon_icon";
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
      customIcons.delete(props.id);
      props.onClose();
    });
  }

  return (
    <Show
      when={customIconState.uploaded}
      fallback={
        <Modal
          title={`Edit ${pokemon().name}`}
          onClose={props.onClose}
          footer={
            <div class="flex">
              <ButtonLink look="warning" onClick={onRemove}>
                Remove
              </ButtonLink>

              <div class="grow" />

              <ButtonLink look="secondary" onClick={props.onClose}>
                Close
              </ButtonLink>
            </div>
          }
          footerHasDivider
        >
          <div class="relative">
            <div class="absolute top-0 right-0 rounded-md border-2 border-divider-heavy p-2">
              <div classList={{ "opacity-50": pokemon().exclude }}>
                <PokemonIcon pokemon={pokemon()} />
              </div>
            </div>

            <Show when={pokemon().isCustom()}>
              <EditPokemonName pokemon={pokemon()} mutator={mutator()} />
            </Show>

            <EditPokemonTypes pokemon={pokemon()} mutator={mutator()} />
            <EditPokemonCustomIconLink state={customIconState} />
            <EditPokemonBehavior pokemon={pokemon()} mutator={mutator()} />
          </div>
        </Modal>
      }
    >
      {(file) => (
        <EditPokemonCustomIconModal
          pokemon={pokemon()}
          initialFile={file()}
          onClose={() => customIconState.setUploaded(undefined)}
        />
      )}
    </Show>
  );
}
