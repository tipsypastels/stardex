import { useComputed } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import type { TargetedEvent } from "preact";
import { useContext } from "preact/hooks";
import type { Pokemon } from "../../../models/pokemon";
import { CustomIconsContext } from "../../../state/context";
import { ButtonLink } from "../../common/link";

export interface EditPokemonCustomIconProps {
  pokemon: Pokemon;
}

export function EditPokemonCustomIcon({ pokemon }: EditPokemonCustomIconProps) {
  const customIcons = useContext(CustomIconsContext);
  const customIcon = useComputed(() => customIcons.map.value.get(pokemon.key.value));

  function onUpload(e: TargetedEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      customIcons.set(pokemon.key.value, reader.result as string);
    });

    reader.readAsDataURL(file);
  }

  function onUnset() {
    customIcons.delete(pokemon.key.value);
  }

  return (
    <div>
      <h2 class="font-bold">Custom Icon</h2>
      <div class="flex gap-2">
        <label class="cursor-pointer text-primary underline">
          <input
            class="hidden"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={onUpload}
          />
          Upload
        </label>
        <Show when={customIcon}>
          <ButtonLink onClick={onUnset}>Unset</ButtonLink>
        </Show>
      </div>
    </div>
  );
}
