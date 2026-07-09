import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Input } from "../../common/input";
import { ButtonLink } from "../../common/link";
import { TYPE_SUGGESTIONS_LIST } from "../../types/util/suggestions";

export interface AddCustomProps {
  onSubmit(typeKeys: string[]): void;
  onCancel(): void;
}

// TODO: This never checks that a Pokemon with that key isn't in the dex.
// It's a no-op but it still lets you specify types.
export function AddCustom({ onSubmit, onCancel }: AddCustomProps) {
  const type1 = useSignal("");
  const type2 = useSignal("");

  const type1Ref = useRef<HTMLInputElement>(null);
  const type2Ref = useRef<HTMLInputElement>(null);

  function submit() {
    const typeKeys = [type1.value, type2.value]
      .map((k) => k.trim().toLowerCase())
      .filter((k) => !!k);

    if (typeKeys.length === 0) {
      type1Ref.current?.focus();
    }

    onSubmit(typeKeys);
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "Enter") {
      submit();
    }
  }

  useEffect(() => {
    console.log(type1Ref.current);
    type1Ref.current?.focus();
  }, []);

  return (
    <div class="flex flex-col justify-center gap-4">
      <div class="grow text-center">
        ...with type{" "}
        <Input
          value={type1.value}
          ref={type1Ref}
          onChange={(e) => (type1.value = e.currentTarget.value)}
          onKeyUp={handleKeyUp}
          list={TYPE_SUGGESTIONS_LIST}
        />
        {" and "}
        <Input
          value={type2.value}
          ref={type2Ref}
          onChange={(e) => (type2.value = e.currentTarget.value)}
          onKeyUp={handleKeyUp}
          list={TYPE_SUGGESTIONS_LIST}
        />
      </div>

      <div class="flex justify-center gap-2 text-center">
        <ButtonLink onClick={submit}>Add</ButtonLink>
        <ButtonLink look="secondary" onClick={onCancel}>
          Cancel
        </ButtonLink>
      </div>
    </div>
  );
}
