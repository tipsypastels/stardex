<script lang="ts">
  import type { Pokemon } from "$lib/models/pokemon";
  import { capitalize } from "$lib/utils/strings";
  import { onMount } from "svelte";
  import { TYPE_SUGGESTIONS_LIST } from "../util/TypeSuggestions.svelte";

  interface Props {
    query: string;
    submit(mon: Pokemon): void;
    cancel(): void;
  }

  function doSubmit() {
    if (!canSubmit) {
      alert("Enter a type!");
      type1Input.focus();
      return;
    }

    const type = hasSignificantType2
      ? [type1.toLowerCase(), type2.toLowerCase()]
      : [type1.toLowerCase()];
    submit({ key, name, type });
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === "Enter") {
      doSubmit();
    }
  }

  let { query, submit, cancel }: Props = $props();
  let key = $derived(query.toLowerCase());
  let name = $derived(capitalize(query));

  let type1 = $state("");
  let type2 = $state("");

  let canSubmit = $derived(type1 !== "");
  let hasSignificantType2 = $derived(type2 && type2.toLowerCase() !== type1.toLowerCase());

  let type1Input: HTMLInputElement;

  onMount(() => {
    type1Input?.focus();
  });
</script>

<div class="flex flex-col justify-center gap-4 md:flex-row">
  <div class="grow md:ml-4">
    ...with type

    <input
      class="w-20 border-0 border-b-2 border-b-lime-600"
      bind:value={type1}
      bind:this={type1Input}
      onkeyup={handleKeyUp}
      list={TYPE_SUGGESTIONS_LIST}
    />

    and

    <input
      class="w-20 border-0 border-b-2 border-b-lime-600"
      bind:value={type2}
      onkeyup={handleKeyUp}
      list={TYPE_SUGGESTIONS_LIST}
    />

    .
  </div>

  <div class="flex justify-center">
    <button
      class="mr-2 block text-lime-600 underline disabled:cursor-not-allowed disabled:text-slate-400"
      disabled={!canSubmit}
      onclick={doSubmit}>Add</button
    >
    <button class="block text-red-500 underline" onclick={cancel}>Cancel</button>
  </div>
</div>
