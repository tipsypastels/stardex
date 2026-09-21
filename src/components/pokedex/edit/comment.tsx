import { createMemo } from "solid-js";
import { pokemons } from "../../../models/pokemon/list";
import { Input } from "../../common/forms/input";

export interface EditPokemonCommentProps {
  index: number;
}

export function EditPokemonComment(props: EditPokemonCommentProps) {
  const comment = createMemo(() => pokemons.commenter(props.index));

  function set(value: string) {
    value = value.trim();
    if (value) {
      comment().setValue(value);
    } else {
      comment().unsetValue();
    }
  }

  return (
    <div>
      <h2 class="font-bold">Comment</h2>
      <Input
        class="w-full"
        value={comment().value ?? ""}
        placeholder="this does nothing, use it for anything."
        visuallyLowercase
        onChange={(e) => set(e.currentTarget.value)}
      />
    </div>
  );
}
