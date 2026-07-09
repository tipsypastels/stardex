import { batch } from "@preact/signals";
import { useContext } from "preact/hooks";
import { PokemonsContext } from "../../../state/context";
import { ButtonLink } from "../../common/link";
import { Modal } from "../../common/menus/modal";
import { EditPokemonBehavior } from "./behavior";
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
          <ButtonLink onClick={onRemove}>Remove</ButtonLink>
        </div>
      }
    >
      <EditPokemonTypes pokemon={pokemon} />
      <EditPokemonBehavior pokemon={pokemon} />
    </Modal>
  );
}
