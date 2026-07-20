import type { Pokemon } from "../../../models/pokemon";
import type { PokemonMutator } from "../../../models/pokemon/mutator";
import { Checkbox } from "../../common/forms/checkbox";

export interface EditPokemonBehaviorProps {
  pokemon: Pokemon;
  mutator: PokemonMutator;
}

export function EditPokemonBehavior(props: EditPokemonBehaviorProps) {
  return (
    <div>
      <h2 class="mb-2 font-bold">Behaviour</h2>
      <Checkbox
        name="Exclude from graphs and recommendations?"
        checked={props.pokemon.exclude}
        onChange={props.mutator.setExclude}
      />
    </div>
  );
}
