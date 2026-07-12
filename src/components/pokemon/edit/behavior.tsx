import type { Pokemon } from "../../../models/pokemon";

export interface EditPokemonBehaviorProps {
  pokemon: Pokemon;
}

export function EditPokemonBehavior({ pokemon }: EditPokemonBehaviorProps) {
  return (
    <div>
      <h2 class="mb-2 font-bold">Behaviour</h2>
      <label class="flex cursor-pointer items-center justify-center select-none md:justify-normal">
        <input
          type="checkbox"
          class="mr-2"
          checked={pokemon.exclude.value}
          onChange={(e) => (pokemon.exclude.value = e.currentTarget.checked)}
        />
        <div>Exclude from recommendations.</div>
      </label>
    </div>
  );
}
