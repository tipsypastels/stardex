import { useSignal } from "@preact/signals";
import type { Pokemon } from "../../../models/pokemon";
import { Input } from "../../common/input";

export interface EditPokemonNameProps {
  pokemon: Pokemon;
}

export function EditPokemonName({ pokemon }: EditPokemonNameProps) {
  const name = useSignal(pokemon.name.peek());

  function handleBlur() {
    if (name.value) {
      // @ts-expect-error, but the parent checks that we're custom.
      pokemon.name.value = name.value;
    } else {
      name.value = pokemon.name.value;
    }
  }

  return (
    <div class="mb-4">
      <h2 class="font-bold">Name</h2>

      <div>
        <Input
          size="double"
          value={name.value}
          onChange={(e) => (name.value = e.currentTarget.value)}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
