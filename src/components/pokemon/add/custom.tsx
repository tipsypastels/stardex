import { useComputed, useSignal } from "@preact/signals";
import type { RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { ButtonLink } from "../../common/link";
import { TYPE_SUGGESTIONS_LIST } from "../../types/util/suggestions";

export interface AddCustomProps {
  onSubmit(typeKeys: string[]): void;
  onCancel(): void;
}

export function AddCustom({ onSubmit, onCancel }: AddCustomProps) {
  const type1 = useSignal("");
  const type2 = useSignal("");

  const type1Ref = useRef<HTMLInputElement>(null);
  const type2Ref = useRef<HTMLInputElement>(null);

  const canSubmit = useComputed(() => !!type1.value);

  function submit() {
    if (!canSubmit.value) {
      alert("Enter a type!");
      type1Ref.current?.focus();
    }

    const typeKeys = (
      !type2.value || type2.value === type1.value ? [type1.value] : [type1.value, type2.value]
    ).map((s) => s.toLowerCase());

    onSubmit(typeKeys);
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "Enter") {
      submit();
    }
  }

  useEffect(() => {
    type1Ref.current?.focus();
  }, []);

  return (
    <div class="flex flex-col justify-center gap-4">
      <div class="grow text-center">
        ...with type{" "}
        <TypeInput
          input={type1.value}
          inputRef={type1Ref}
          onChange={(e) => (type1.value = e.currentTarget.value)}
          onKeyUp={handleKeyUp}
        />
        {" and "}
        <TypeInput
          input={type2.value}
          inputRef={type2Ref}
          onChange={(e) => (type2.value = e.currentTarget.value)}
          onKeyUp={handleKeyUp}
        />
      </div>

      <div class="flex justify-center gap-2 text-center">
        <ButtonLink onClick={submit} disabled={!canSubmit.value}>
          Add
        </ButtonLink>
        <ButtonLink look="secondary" onClick={onCancel}>
          Cancel
        </ButtonLink>
      </div>
    </div>
  );
}

interface TypeInputProps {
  input: string;
  inputRef: RefObject<HTMLInputElement>;
  onChange(e: { currentTarget: HTMLInputElement }): void;
  onKeyUp(e: KeyboardEvent): void;
}

function TypeInput({ input, inputRef, onChange, onKeyUp }: TypeInputProps) {
  return (
    <input
      class="border-b-primary bg-background w-20 border-0 border-b-2"
      value={input}
      ref={inputRef}
      onChange={onChange}
      onKeyUp={onKeyUp}
      list={TYPE_SUGGESTIONS_LIST}
    />
  );
}
