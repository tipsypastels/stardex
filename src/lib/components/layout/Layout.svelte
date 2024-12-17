<script lang="ts">
  import type { Snippet } from "svelte";
  import Nav from "./Nav.svelte";
  import Logo from "./Logo.svelte";
  import Modal from "./Modal.svelte";
  import { addPokemonModalOpen } from "$lib/state/add_pokemon_modal";
  import PokemonAddIconButton from "../pokemon/PokemonAddIconButton.svelte";
  import PokemonAddTextButton from "../pokemon/PokemonAddTextButton.svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<Logo />
<PokemonAddIconButton />

<div class="mb-8 flex items-center">
  <h1 class="grow text-center text-4xl font-bold md:text-left">
    {title}
  </h1>

  <PokemonAddTextButton />
</div>

<Nav />

<main class="mx-4 md:mx-0">
  {@render children()}
</main>

<Modal
  open={$addPokemonModalOpen}
  onclose={() => addPokemonModalOpen.set(false)}
  title="Add Pokémon">hi</Modal
>
