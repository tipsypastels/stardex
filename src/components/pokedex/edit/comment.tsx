import type { Pokemon } from "../../../models/pokemon";
import type { PokemonMutator } from "../../../models/pokemon/mutator";
import { Input } from "../../common/forms/input";

export interface EditPokemonCommentProps {
  pokemon: Pokemon;
  mutator: PokemonMutator;
}

export function EditPokemonComment(props: EditPokemonCommentProps) {
  function set(value: string) {
    props.mutator.setComment(value.trim());
  }

  return (
    <div>
      <h2 class="font-bold">Comment</h2>
      <Input
        class="w-full"
        value={props.pokemon.comment ?? ""}
        placeholder="this does nothing, use it for anything."
        visuallyLowercase
        onChange={(e) => set(e.currentTarget.value)}
      />
    </div>
  );
}
