import { batch } from "@preact/signals";
import { useContext } from "preact/hooks";
import { PokemonsContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { ButtonLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";
import { EditPokemonBehavior } from "./behavior";
import { EditPokemonCustomIconLink } from "./custom_icon";
import { EditPokemonName } from "./name";
import { EditPokemonTypes } from "./types";

export interface EditPokemonModalProps {
  index: number;
  onClose(): void;
}

export function EditPokemonModal({ index, onClose }: EditPokemonModalProps) {
  const pokemons = useContext(PokemonsContext);
  const pokemon = pokemons.get(index)!;

  function onRemove() {
    batch(() => {
      toasts.add("times", `Removed ${pokemon.name.peek()}!`);
      pokemons.delete(index);
      onClose();
    });
  }

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
      {!pokemon.species.value ? <EditPokemonName pokemon={pokemon} /> : null}
      <EditPokemonTypes pokemon={pokemon} />
      <EditPokemonCustomIconLink onUpload={() => {}} />
      <EditPokemonBehavior pokemon={pokemon} />
    </Modal>
  );
}
