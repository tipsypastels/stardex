import type { TargetedEvent } from "preact";
import { useContext } from "preact/hooks";
import type { Pokemon } from "../../../models/pokemon";
import { CustomIconsContext } from "../../../state/context";

export interface EditPokemonCustomIconProps {
  pokemon: Pokemon;
}

export function EditPokemonCustomIcon({ pokemon }: EditPokemonCustomIconProps) {
  const customIcons = useContext(CustomIconsContext);

  function onUpload(e: TargetedEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      customIcons.set(pokemon.key.value, reader.result as string);
    });

    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label>
        <input
          class="hidden"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={onUpload}
        />
        click to upload a file
      </label>
    </div>
  );
}
