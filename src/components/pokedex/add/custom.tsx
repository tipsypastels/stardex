import { onMount } from "solid-js";
import { Input } from "../../common/input";
import { ButtonLink } from "../../common/link";
import { TYPE_SUGGESTIONS_LIST } from "../../types/util/suggestions";

export interface AddCustomProps {
  onSubmit(typeKeys: string[]): void;
  onCancel(): void;
}

export function AddCustom(props: AddCustomProps) {
  let input1: HTMLInputElement | undefined;
  let input2: HTMLInputElement | undefined;

  function submit() {
    const typeKeys = [input1?.value, input2?.value]
      .map((k) => k?.trim().toLowerCase())
      .filter((k): k is string => !!k);

    if (typeKeys.length === 0) {
      input1?.focus();
      return;
    }

    props.onSubmit(typeKeys);
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "Enter") {
      submit();
    }
  }

  onMount(() => {
    input1?.focus();
  });

  return (
    <div class="flex flex-col justify-center gap-4">
      <div class="grow text-center">
        ...with type{" "}
        <Input ref={input1} value="" onKeyUp={handleKeyUp} list={TYPE_SUGGESTIONS_LIST} />
        {" and "}
        <Input ref={input2} value="" onKeyUp={handleKeyUp} list={TYPE_SUGGESTIONS_LIST} />
      </div>

      <div class="flex justify-center gap-2 text-center">
        <ButtonLink onClick={submit}>Add</ButtonLink>
        <ButtonLink look="secondary" onClick={props.onCancel}>
          Cancel
        </ButtonLink>
      </div>
    </div>
  );
}
