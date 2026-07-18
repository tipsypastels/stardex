import type { Pokemon } from "../../../models/pokemon";

export interface EditPokemonBehaviorProps {
  pokemon: Pokemon;
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
          // TODO: This is probably illegal.
          onChange={(e) => (props.pokemon.exclude = e.currentTarget.checked)}
        />
        <div>Exclude from graphs and recommendations.</div>
      </label>
    </div>
  );
}
