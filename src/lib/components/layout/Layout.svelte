<script lang="ts">
  import type { Snippet } from "svelte";
  import Nav from "./Nav.svelte";
  import Logo from "./Logo.svelte";
  import Modal from "./Modal.svelte";
  import { editorOpen, setEditorOpen } from "$lib/state";
  import Icon from "../common/Icon.svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();

  function openEditor() {
    setEditorOpen(true);
  }
</script>

<Logo />

<button
  class="fixed bottom-6 right-6 z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-lime-600 text-2xl text-white shadow-lg shadow-slate-400 md:hidden"
  onclick={openEditor}
  aria-label="Add Pokémon"
>
  <Icon name="plus" />
</button>

<div class="mb-8 flex items-center">
  <h1 class="grow text-center text-4xl font-bold md:text-left">
    {title}
  </h1>

  <div class="hidden md:block">
    <button
      class="rounded-md bg-lime-600 px-4 py-2 font-bold text-white transition hover:-translate-y-1 hover:bg-indigo-950 hover:text-lime-600"
      onclick={openEditor}>Add Pokémon</button
    >
  </div>
</div>

<Nav />

<main class="mx-4 md:mx-0">
  {@render children()}
</main>

<Modal open={$editorOpen} onclose={() => setEditorOpen(false)} title="Add Pokémon">hi</Modal>
