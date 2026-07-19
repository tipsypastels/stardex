import type { Pokemon } from "../../../models/pokemon";
import type { PokemonMutator } from "../../../models/pokemon/mutator";

export interface EditPokemonBehaviorProps {
  pokemon: Pokemon;
  mutator: PokemonMutator;
}

export function EditPokemonBehavior(props: EditPokemonBehaviorProps) {
  return (
    <div>
      <h2 class="mb-2 font-bold">Behaviour</h2>
      <label class="flex cursor-pointer items-center select-none">
        <input
          type="checkbox"
          class="mr-2"
          checked={props.pokemon.exclude}
          onChange={(e) => props.mutator.setExclude(e.target.checked)}
        />
        <div>Exclude from graphs and recommendations.</div>
      </label>
    </div>
  );
}
